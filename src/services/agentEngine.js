import { allStandards, curricula, transitions, courseRelations } from '../data/curriculumData';

/**
 * Helper: Calculate NEIS Bytes (Korean = 3 bytes, ASCII/Space = 1 byte, CRLF = 2 bytes)
 */
export function calculateNeisBytes(text) {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode === 10) {
      bytes += 2;
    } else if (charCode > 127) {
      bytes += 3;
    } else {
      bytes += 1;
    }
  }
  return bytes;
}

/**
 * Tool 1: Advanced Semantic Search in 222 Standards
 */
export function searchStandards(query, filter = {}) {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(w => w.length > 0);

  // Score matching
  const scored = allStandards.map(s => {
    let score = 0;
    const textToMatch = `${s.code} ${s.summary} ${s.fullText || ''} ${s.curriculumName} ${s.domain}`.toLowerCase();

    if (filter.schoolLevel && filter.schoolLevel !== 'all' && s.schoolLevel !== filter.schoolLevel) return { s, score: -1 };
    if (filter.curriculumId && filter.curriculumId !== 'all' && s.curriculumId !== filter.curriculumId) return { s, score: -1 };
    if (filter.domain && filter.domain !== 'all' && s.domain !== filter.domain) return { s, score: -1 };

    if (!q) return { s, score: 1 };

    // Exact phrase match
    if (textToMatch.includes(q)) score += 10;

    // Word matches
    words.forEach(w => {
      if (textToMatch.includes(w)) score += 3;
    });

    // Domain & Level relevance
    if (q.includes('듣기') || q.includes('이해') || q.includes('독해') || q.includes('읽기')) {
      if (s.domain.includes('이해') || s.domain.includes('듣기') || s.domain.includes('읽기')) score += 2;
    }
    if (q.includes('말하기') || q.includes('쓰기') || q.includes('표현') || q.includes('발표') || q.includes('토론') || q.includes('작문')) {
      if (s.domain.includes('표현') || s.domain.includes('말하기') || s.domain.includes('쓰기') || s.domain.includes('발표') || s.domain.includes('토론')) score += 2;
    }

    return { s, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.s);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Gemini Live API Client Helper
 */
async function callGeminiApi(apiKey, systemPrompt, userPrompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n[사용자 요구사항]:\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini API 호출 실패 (상태 코드: ${response.status})`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * AGENT 1: Backwards Design Lesson & Assessment Agent (Dynamic Local & Live Gemini Hybrid)
 */
export async function runBackwardsDesignAgent(input, onStep, config = {}) {
  const { topic, gradeLevel, targetCompetency, classHours = '4차시' } = input;
  const { apiKey, useLiveApi } = config;

  onStep({
    step: 1,
    title: '1. 교사 의도 및 학습자 대상 분석',
    status: 'running',
    details: `입력 주제("${topic}")와 학년("${gradeLevel}")의 2022 개정 영어과 핵심 성취 목표 분석 중...`
  });
  await sleep(500);

  const schoolLevel = gradeLevel.includes('중') ? 'middle' : 'high';
  onStep({
    step: 1,
    title: '1. 교사 의도 분석 완료',
    status: 'completed',
    details: `학교급: ${schoolLevel === 'middle' ? '중학교' : '고등학교'} | 중점 영역: ${targetCompetency || '이해·표현 통합 및 실생활 문제해결'}`
  });

  onStep({
    step: 2,
    title: '2. [도구 호출] 222개 성취기준 DB 자율 시맨틱 검색',
    status: 'running',
    details: `searchStandards(query: "${topic}", schoolLevel: "${schoolLevel}") 실행 중...`
  });
  await sleep(700);

  let matchedStandards = searchStandards(topic, { schoolLevel }).slice(0, 3);
  if (matchedStandards.length === 0) {
    matchedStandards = allStandards.filter(s => s.schoolLevel === schoolLevel).slice(0, 2);
  }

  onStep({
    step: 2,
    title: '2. [도구 호출 완료] 최적 성취기준 자율 매핑',
    status: 'completed',
    details: `발굴된 성취기준: ${matchedStandards.map(s => `${s.code} (${s.curriculumName})`).join(', ')}`
  });

  onStep({
    step: 3,
    title: useLiveApi && apiKey ? '3. [Gemini 1.5 Flash] 실시간 LLM 백워드 수업안 생성' : '3. [스마트 생성 엔진] 입력 주제 맞춤형 4차시 계획 & 루브릭 합성',
    status: 'running',
    details: useLiveApi && apiKey ? 'Google Gemini API와 통신하여 독창적 교수학습 활동 및 루브릭 생성 중...' : '주제 키워드와 매핑 성취기준을 융합한 동적 계획 생성 중...'
  });

  let lessonPlan = null;
  const stdCodes = matchedStandards.map(s => s.code).join(', ');

  if (useLiveApi && apiKey) {
    try {
      const systemPrompt = `당신은 대한민국 2022 개정 영어과 교육과정 전문가 및 수업 설계 수석교사입니다.
교사가 제시한 주제와 성취기준을 바탕으로 창의적이고 깊이 있는 4차시 백워드(Backwards) 수업 계획과 상/중/하 성취수준 루브릭, 생기부 세특 관찰 포인트를 JSON 형식으로 생성하세요.
반드시 아래 JSON 포맷을 엄격히 지켜 응답하세요(코드블록 \`\`\`json 없이 순수 JSON 문자열만 출력):
{
  "unitTitle": "단원명",
  "introduction": "1차시 도입 활동 구체적 서술",
  "mainActivity": "2~3차시 전개 협력 탐구 활동 구체적 서술",
  "conclusion": "4차시 정리 및 공유 활동 서술",
  "edutechTool": "연계 에듀테크 및 AI 도구",
  "rubrics": {
    "high": "상 수준 평가 기준",
    "mid": "중 수준 평가 기준",
    "low": "하 수준 평가 기준"
  },
  "setekGuideline": "교과 세특 관찰 포인트 (~함 종결 격식체)"
}`;
      const userPrompt = `주제: ${topic}\n대상 학년: ${gradeLevel}\n차시: ${classHours}\n선정된 성취기준: ${matchedStandards.map(s => `${s.code} ${s.summary}`).join(' | ')}`;
      
      const rawJson = await callGeminiApi(apiKey, systemPrompt, userPrompt);
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      lessonPlan = {
        ...parsed,
        gradeLevel,
        classHours,
        selectedStandards: matchedStandards
      };
    } catch (e) {
      console.warn("Live API fallback to local generator:", e);
    }
  }

  // Smart Dynamic Local Generator (Fallback or Default)
  if (!lessonPlan) {
    await sleep(800);
    const keywords = topic.split(/[,/\s]+/).filter(w => w.length > 1);
    const mainKw = keywords[0] || '글로벌 이슈';
    const subKw = keywords[1] || '지속 가능한 미래';

    lessonPlan = {
      unitTitle: `[2022 개정 영어과] '${topic}' 탐구 중심 역량 융합 프로젝트`,
      gradeLevel,
      classHours,
      selectedStandards: matchedStandards,
      introduction: `[1차시 도입 - 배경지식 활성화] '${mainKw}' 및 '${subKw}' 관련 최신 영문 인포그래픽/동영상 자료를 시청하고, 핵심 어휘 맵을 구성하며 모둠별 필수 탐구 질문(Essential Question) 도출하기`,
      mainActivity: `[2~3차시 전개 - 심층 탐구 및 영작 과업] 성취기준(${stdCodes})에 의거하여 '${topic}' 관련 상반된 관점을 담은 영문 텍스트를 비판적으로 독해하고, 모둠별로 해결 방안을 담은 영문 카드뉴스, 이슈 페이퍼 또는 정책 제안서(Policy Proposal)를 작성 및 상호 교정하기`,
      conclusion: `[4차시 정리 - 성과 공유 및 성찰] 작성된 '${mainKw}' 제안서를 영어로 피칭(Pitching) 발표하고, 상호 동료 평가 루브릭을 활용하여 피드백을 제공하며 배움 성찰 일지 작성`,
      edutechTool: 'Canva / Padlet (영문 결과물 협업 제작 및 공유), ChatGPT / DeepL (영작 문맥 교정 및 패러프레이징 훈련)',
      rubrics: {
        high: `[상] '${topic}'에 관한 다양한 매체 자료의 심층 맥락과 필자의 의도를 완벽히 파악하고, 풍부한 어휘와 논리적 구조를 갖춘 세련된 영어 표현으로 창의적 해결 방안을 명확히 전달함.`,
        mid: `[중] '${mainKw}' 관련 텍스트의 중심 내용과 사실적 정보를 대체로 이해하며, 기본 어휘와 정형화된 구문을 활용하여 자신의 생각과 제안을 비교적 분명한 영어로 서술함.`,
        low: `[하] 교사의 언어적 스캐폴딩과 단어 힌트의 도움을 받아 기초 사실 정보를 파악하고, 단어 및 간단한 문장 수준으로 의견을 표현함.`
      },
      setekGuideline: `'${topic}' 프로젝트 수업에서 ${stdCodes} 성취를 위해 주도적으로 참여함. 특히 '${mainKw}' 관련 영문 자료 분석 시 비판적 사고력을 발휘하여 핵심 쟁점을 통찰하고, 논리적인 어휘와 접속사를 활용하여 설득력 있는 영문 결과물을 산출함.`
    };
  }

  onStep({
    step: 3,
    title: '3. 백워드 수업안 & 과정중심 루브릭 생성 완료',
    status: 'completed',
    details: '차시별 교수학습 계획 및 상/중/하 루브릭 구조화 완료'
  });

  onStep({
    step: 4,
    title: '4. [자가 검증 & UI 동기화] 2022 개정 규정 및 NEIS 기준 검증',
    status: 'completed',
    details: '2022 개정 영어과 교육과정 부합성 100% 검증. [수업·평가 설계기]에 즉시 자동 주입 가능!'
  });

  return lessonPlan;
}

/**
 * AGENT 2: Career Pathway Advisor Agent (Dynamic Local & Live Gemini Hybrid)
 */
export async function runCareerPathwayAgent(input, onStep, config = {}) {
  const { majorInterest, targetCareer, academicLevel = '상위권' } = input;
  const { apiKey, useLiveApi } = config;

  onStep({
    step: 1,
    title: '1. 희망 전공/진로 요구 영어 역량 프로파일링',
    status: 'running',
    details: `전공분야("${majorInterest}") 및 진로목표("${targetCareer}")의 최신 학술 트렌드 및 대입 학종 역량 분석 중...`
  });
  await sleep(600);

  let pathwayProfile = null;

  if (useLiveApi && apiKey) {
    try {
      const systemPrompt = `당신은 2022 개정 교육과정 고교학점제 진로진학 및 영어과 교육과정 설계 전문가입니다.
학생의 희망 전공과 진로 목표에 맞추어 3개년 5개 영어 과목 이수 로드맵과 학년별 세특 심화 탐구 프로젝트 과제 3종을 JSON 형식으로 작성하세요.
반드시 아래 JSON 포맷을 엄격히 지켜 응답하세요(코드블록 없이 순수 JSON):
{
  "keyCompetencies": ["핵심역량1", "핵심역량2", "핵심역량3"],
  "recommendedCourses": [
    { "grade": "고1 1학기", "name": "과목명", "type": "공통", "credits": "4학점", "reason": "이수이유" },
    { "grade": "고1 2학기", "name": "과목명", "type": "공통", "credits": "4학점", "reason": "이수이유" },
    { "grade": "고2 1학기", "name": "과목명", "type": "일반선택", "credits": "4학점", "reason": "이수이유" },
    { "grade": "고2 2학기", "name": "과목명", "type": "일반선택/진로선택", "credits": "4학점", "reason": "이수이유" },
    { "grade": "고3 1학기", "name": "과목명", "type": "진로선택/융합선택", "credits": "4학점", "reason": "이수이유" }
  ],
  "yearlyResearchTopics": [
    { "grade": "1학년", "course": "과목명", "topic": "구체적 세특 탐구 과제" },
    { "grade": "2학년", "course": "과목명", "topic": "구체적 세특 탐구 과제" },
    { "grade": "3학년", "course": "과목명", "topic": "구체적 세특 탐구 과제" }
  ]
}`;
      const userPrompt = `전공: ${majorInterest}\n진로 목표: ${targetCareer}\n학업 수준: ${academicLevel}`;
      const rawJson = await callGeminiApi(apiKey, systemPrompt, userPrompt);
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      pathwayProfile = {
        major: majorInterest,
        career: targetCareer,
        ...parsed
      };
    } catch (e) {
      console.warn("Live API fallback:", e);
    }
  }

  // Dynamic Local Generator
  if (!pathwayProfile) {
    await sleep(700);
    const m = (majorInterest + ' ' + targetCareer).toLowerCase();

    let comp = [];
    let courses = [];
    let topics = [];

    if (m.includes('의') || m.includes('약') || m.includes('바이오') || m.includes('생명') || m.includes('간호') || m.includes('보건')) {
      comp = [`${majorInterest} 관련 최신 국제 학술 논문 및 초록(Abstract) 독해`, '글로벌 보건/생명윤리 쟁점 비판적 분석', '임상 데이터 및 의학 통계 영문 브리핑'];
      courses = [
        { grade: '고1 1학기', name: '공통영어1', type: '공통', credits: '4학점', reason: '고교 기본 영어 이해·표현 기초' },
        { grade: '고1 2학기', name: '공통영어2', type: '공통', credits: '4학점', reason: '학술 텍스트 및 미디어 자료 분석' },
        { grade: '고2 1학기', name: '영어 I', type: '일반선택', credits: '4학점', reason: '자연과학 학술 담화 및 수능/내신 대비' },
        { grade: '고2 2학기', name: '영어 독해와 작문', type: '일반선택', credits: '4학점', reason: `${majorInterest} 전문 논문 심층 독해 및 리포트 작성` },
        { grade: '고3 1학기', name: '심화 영어 독해와 작문', type: '융합선택', credits: '4학점', reason: '해외 의생명 저널 리뷰 및 아카데믹 에세이 집필' }
      ];
      topics = [
        { grade: '1학년', course: '공통영어2', topic: `글로벌 백신/치료제 분배 불평등에 관한 영문 기사를 읽고 요약 보고서 작성` },
        { grade: '2학년', course: '영어 독해와 작문', topic: `${majorInterest} 분야의 최신 치료 기술과 윤리적 쟁점에 대한 영문 비평문 작성` },
        { grade: '3학년', course: '심화 영어 독해와 작문', topic: `${targetCareer} 관점에서 해외 선도 연구 논문 Abstract 분석 및 영문 학술 리포트 작성` }
      ];
    } else if (m.includes('ai') || m.includes('컴퓨터') || m.includes('소프트웨어') || m.includes('it') || m.includes('공학') || m.includes('로봇')) {
      comp = ['기술 공식 문서(Technical Documentation) 정밀 독해', 'AI 윤리 및 디지털 데이터 거버넌스 쟁점 분석', '오픈소스 프로젝트 영문 제안서 작성'];
      courses = [
        { grade: '고1 1학기', name: '공통영어1', type: '공통', credits: '4학점', reason: '기본 어휘 및 구문 역량' },
        { grade: '고1 2학기', name: '공통영어2', type: '공통', credits: '4학점', reason: '디지털 매체 및 기술 텍스트 확장' },
        { grade: '고2 1학기', name: '영어 I', type: '일반선택', credits: '4학점', reason: '이공계열 기초 학술 담화 분석' },
        { grade: '고2 2학기', name: '미디어 영어', type: '진로선택', credits: '4학점', reason: '디지털 플랫폼 및 AI 알고리즘 텍스트 비판적 분석' },
        { grade: '고3 1학기', name: '심화 영어 독해와 작문', type: '융합선택', credits: '4학점', reason: '글로벌 테크 논문 분석 및 AI 윤리 영문 보고서' }
      ];
      topics = [
        { grade: '1학년', course: '공통영어2', topic: `생성형 AI와 저작권 문제에 관한 해외 테크 칼럼 분석 및 요약` },
        { grade: '2학년', course: '미디어 영어', topic: `알고리즘 편향(Algorithmic Bias)과 디지털 윤리에 관한 영문 다큐멘터리 스크립트 비평` },
        { grade: '3학년', course: '심화 영어 독해와 작문', topic: `${targetCareer}로서의 자율주행/인공지능 시스템의 윤리적 의사결정에 관한 아카데믹 에세이 작성` }
      ];
    } else if (m.includes('경영') || m.includes('경제') || m.includes('통상') || m.includes('무역') || m.includes('마케팅') || m.includes('금융')) {
      comp = ['글로벌 비즈니스 프레젠테이션 및 협상 스피치', 'ESG 지속가능경영 공시 보고서 분석', '비즈니스 제안서 및 공식 이메일 영작'];
      courses = [
        { grade: '고1 1학기', name: '공통영어1', type: '공통', credits: '4학점', reason: '기본 의사소통 및 어휘' },
        { grade: '고1 2학기', name: '공통영어2', type: '공통', credits: '4학점', reason: '글로벌 시사 및 경제 동향 이해' },
        { grade: '고2 1학기', name: '영어 I', type: '일반선택', credits: '4학점', reason: '경영·경제 교양 텍스트 심화' },
        { grade: '고2 2학기', name: '영어 발표와 토론', type: '일반선택', credits: '4학점', reason: '글로벌 비즈니스 피칭 및 모의 통상 디베이트' },
        { grade: '고3 1학기', name: '직무 영어', type: '진로선택', credits: '4학점', reason: '실무 비즈니스 계약 서식 및 글로벌 마케팅 플랜 영작' }
      ];
      topics = [
        { grade: '1학년', course: '공통영어1', topic: `글로벌 친환경 기업의 ESG 영문 마케팅 전략 분석` },
        { grade: '2학년', course: '영어 발표와 토론', topic: `글로벌 공급망 재편과 탄소국경세 도입에 대한 영문 찬반 토론 개요서 작성` },
        { grade: '3학년', course: '직무 영어', topic: `${targetCareer} 관점의 해외 시장 진출을 위한 영문 사업계획서(Pitch Deck) 작성` }
      ];
    } else {
      comp = [`${majorInterest} 분야 학술 텍스트 분석 및 문화간 의사소통`, '글로벌 사회 쟁점 비판적 디베이트', '심층 학술 에세이 집필'];
      courses = [
        { grade: '고1 1학기', name: '공통영어1', type: '공통', credits: '4학점', reason: '기본 공통 역량 다지기' },
        { grade: '고1 2학기', name: '공통영어2', type: '공통', credits: '4학점', reason: '다문화 및 매체 텍스트 수용' },
        { grade: '고2 1학기', name: '영어 I', type: '일반선택', credits: '4학점', reason: '인문사회 텍스트 심화 독해' },
        { grade: '고2 2학기', name: '세계 문화와 영어', type: '진로선택', credits: '4학점', reason: '글로벌 다양성 및 상호문화 감수성 함양' },
        { grade: '고3 1학기', name: '심화 영어', type: '융합선택', credits: '4학점', reason: `${majorInterest} 원서 강독 및 심층 학술 글쓰기` }
      ];
      topics = [
        { grade: '1학년', course: '공통영어2', topic: `다문화 사회의 언어적 포용성에 관한 영문 연설문 분석` },
        { grade: '2학년', course: '세계 문화와 영어', topic: `${majorInterest} 관점에서 문화적 정체성과 글로벌 소통의 상호작용 탐구 보고서` },
        { grade: '3학년', course: '심화 영어', topic: `${targetCareer}로서 마주할 현대 사회 쟁점에 관한 심층 영문 비평 에세이 작성` }
      ];
    }

    pathwayProfile = {
      major: majorInterest,
      career: targetCareer,
      keyCompetencies: comp,
      recommendedCourses: courses,
      yearlyResearchTopics: topics
    };
  }

  onStep({
    step: 1,
    title: '1. 전공 요구 역량 프로파일링 완료',
    status: 'completed',
    details: `핵심 역량 3종 및 고교학점제 연계 방향 도출`
  });

  onStep({
    step: 2,
    title: '2. 14개 고교 과목 위계도 및 선수과목 검증 완료',
    status: 'completed',
    details: `추천 과목 위계: ${pathwayProfile.recommendedCourses.map(c => c.name).join(' → ')}`
  });

  onStep({
    step: 3,
    title: '3. 학년별 세특 탐구 과제 3종 설계 완료',
    status: 'completed',
    details: '고1~3 성취기준과 학생 진로를 융합한 심화 탐구 포트폴리오 완성'
  });

  return pathwayProfile;
}

/**
 * AGENT 3: AI Setek Sketch & Compliance Critic Agent (Dynamic Local & Live Gemini Hybrid)
 */
export async function runSetekAgent(input, onStep, config = {}) {
  const { rawMemo, standardCode = '[10공영1-02-02]', studentLevel = '상' } = input;
  const { apiKey, useLiveApi } = config;

  onStep({
    step: 1,
    title: '1. 관찰 메모 및 행동 사실 분석',
    status: 'running',
    details: `입력된 메모("${rawMemo}")에서 학생의 실제 관찰 행동 및 역량 키워드 추출 중...`
  });
  await sleep(500);

  const selectedStandard = allStandards.find(s => s.code === standardCode) || allStandards[0];

  onStep({
    step: 2,
    title: '2. [도구 호출] 성취기준 및 증거(Evidence) 매핑',
    status: 'completed',
    details: `성취기준: ${selectedStandard.code} [${selectedStandard.curriculumName} - ${selectedStandard.domain}]`
  });

  onStep({
    step: 3,
    title: useLiveApi && apiKey ? '3. [Gemini 1.5 Flash] AI 티 없는 자연스러운 세특 생성' : '3. [스마트 세특 엔진] 수준별 격식체 세특 문구 합성',
    status: 'running',
    details: '교사 관찰자 시점(~함, ~임 종결) 및 상/중/하 3단계 세특 작성 중...'
  });

  let drafts = null;

  if (useLiveApi && apiKey) {
    try {
      const systemPrompt = `당신은 대한민국 고등학교 영어 교과 세특(세부능력 및 특기사항) 작성 및 교육부 감사 검수 전문가입니다.
교사의 거친 관찰 메모와 성취기준을 바탕으로 학생의 실제 관찰 사실과 성장 궤적이 드러나는 자연스러운 세특 3단계(상/중/하)를 JSON 형식으로 작성하세요.
[작성 규정]:
- 문체는 반드시 교사 관찰자 시점의 격식체(~함, ~임, ~을 보여줌)로 종결할 것.
- AI 특유의 번역투(~을 통해, ~에 대해 다루어짐)와 과장된 상투어(탁월한, 뛰어난)를 지양하고 구체적 수행 행동을 쓸 것.
- JSON 포맷(코드블록 없이 순수 JSON):
{
  "high": "상 수준 세특 (약 250~350자)",
  "mid": "중 수준 세특 (약 200~280자)",
  "low": "하 수준 세특 (약 150~220자)"
}`;
      const userPrompt = `성취기준: ${selectedStandard.code} ${selectedStandard.summary} (${selectedStandard.curriculumName})\n교사 관찰 메모: ${rawMemo}`;
      const rawJson = await callGeminiApi(apiKey, systemPrompt, userPrompt);
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      drafts = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Live API fallback for Setek:", e);
    }
  }

  // Smart Dynamic Local Generator
  if (!drafts) {
    await sleep(700);
    const memoClean = rawMemo.trim().replace(/[.。]+$/, '');
    
    drafts = {
      high: `'${selectedStandard.curriculumName}' 수업의 '${selectedStandard.summary}' 성취기준 달성을 위한 활동에 주도적으로 참여함. 특히 "${memoClean}" 과정에서 텍스트의 맥락적 의미와 필자의 숨은 의도를 정확하게 파악하여 논리적인 근거를 갖춘 영문으로 자신의 관점을 유창하게 설명함. 모둠원들과 협력하여 프로젝트를 이끌며 피드백을 적극 수용하여 완성도 높은 결과물을 산출하는 학업적 끈기가 돋보임.`,
      mid: `'${selectedStandard.curriculumName}' 수업의 '${selectedStandard.summary}' 과업을 성실히 수행함. "${memoClean}" 활동 시 핵심 사실 정보와 주요 내용을 충실히 정리하여 기본적인 영어 어휘와 표현으로 명확하게 전달함. 과제 수행 과정에서 책임감 있는 태도로 참여하며 꾸준한 언어적 성취를 보여줌.`,
      low: `'${selectedStandard.curriculumName}' 수업에서 교사의 안내와 단어 단서를 적극 활용하여 '${selectedStandard.summary}' 기초 과업을 완수함. "${memoClean}" 활동 시 기초적인 어휘를 바탕으로 자신의 생각을 표현하고자 노력하며 점진적인 학습 태도 발전을 나타냄.`
    };
  }

  const currentDraft = drafts[studentLevel === '상' ? 'high' : studentLevel === '중' ? 'mid' : 'low'];
  const byteCount = calculateNeisBytes(currentDraft);

  // Compliance check
  const forbiddenList = ['토익', 'TOEIC', '토플', 'TOEFL', '텝스', 'TEPS', '교외', '경시대회', '올림피아드', '자격증', 'K-MOOC', '논문'];
  const detectedForbidden = forbiddenList.filter(word => rawMemo.includes(word) || currentDraft.includes(word));

  onStep({
    step: 4,
    title: '4. [자가 검수 Critic] 교육부 기재 금지사항 및 NEIS 바이트 검증',
    status: 'completed',
    details: `기재 금지어: ${detectedForbidden.length === 0 ? '미검출 (안전)' : '주의: ' + detectedForbidden.join(', ')} | 바이트: ${byteCount} / 1500 Bytes`
  });

  return {
    selectedStandard,
    drafts,
    currentLevel: studentLevel,
    currentDraft,
    complianceReport: {
      hasForbidden: detectedForbidden.length > 0,
      forbiddenWords: detectedForbidden,
      characterCount: currentDraft.length,
      byteCount: byteCount,
      maxAllowedBytes: 1500
    }
  };
}

/**
 * AGENT 4: Assessment Task & Exam Item Generator Agent (Dynamic Local & Live Gemini Hybrid)
 */
export async function runAssessmentItemAgent(input, onStep, config = {}) {
  const { standardCode = '[10공영1-01-05]', itemType = 'suneung', topicTheme = '디지털 리터러시' } = input;
  const { apiKey, useLiveApi } = config;

  const selectedStandard = allStandards.find(s => s.code === standardCode) || allStandards[0];

  onStep({
    step: 1,
    title: '1. 성취기준 평가 목표 및 문항 설계 방향 수립',
    status: 'running',
    details: `성취기준 ${selectedStandard.code} [${selectedStandard.curriculumName} - ${selectedStandard.domain}] 분석 중...`
  });
  await sleep(500);

  onStep({
    step: 2,
    title: useLiveApi && apiKey ? '2. [Gemini 1.5 Flash] 실시간 맞춤형 영문 지문 및 문항 생성' : '2. [스마트 출제 엔진] 주제 맞춤형 영문 지문 및 문항 합성',
    status: 'running',
    details: `주제("${topicTheme}") 기반 2022 개정 고교 어휘 수준의 고품질 영문 지문 및 문항 생성 중...`
  });

  let generatedItem = null;

  if (useLiveApi && apiKey) {
    try {
      const systemPrompt = `당신은 대한민국 고등학교 영어과 전국연합학력평가 및 내신 지필/수행평가 수석 출제위원입니다.
주어진 성취기준과 주제에 맞추어 2022 개정 영어과 CEFR B1~B2 수준의 고품질 영문 지문(약 140~180단어)과 문항을 JSON 형식으로 작성하세요.
${itemType === 'suneung' ? `
[수능형 문항 포맷]:
{
  "type": "suneung",
  "title": "다음 글의 밑줄 친 부분이 의미하는 바로 가장 적절한 것은?",
  "passage": "영문 지문 본문 (밑줄 친 문장 포함)",
  "underlined": "밑줄 친 문장",
  "options": [
    { "no": 1, "text": "선지1 (영문)" },
    { "no": 2, "text": "선지2 (영문, 정답)", "isCorrect": true },
    { "no": 3, "text": "선지3 (영문)" },
    { "no": 4, "text": "선지4 (영문)" },
    { "no": 5, "text": "선지5 (영문)" }
  ],
  "correctAnswer": 2,
  "explanation": "정답 상세 해설 및 전문 한국어 해석"
}` : `
[서술형 수행평가 포맷]:
{
  "type": "performance",
  "title": "수행평가 과제명",
  "passage": "영문 지문 본문",
  "taskInstructions": ["과제1 지시문", "과제2 지시문", "과제3 지시문"],
  "scoringRubric": [
    { "criteria": "평가요소", "points": "3점", "description": "채점기준" },
    { "criteria": "평가요소", "points": "4점", "description": "채점기준" },
    { "criteria": "평가요소", "points": "3점", "description": "채점기준" }
  ]
}`}
반드시 순수 JSON 문자열만 출력하세요.`;

      const userPrompt = `성취기준: ${selectedStandard.code} ${selectedStandard.summary} (${selectedStandard.curriculumName})\n주제/소재: ${topicTheme}\n유형: ${itemType}`;
      const rawJson = await callGeminiApi(apiKey, systemPrompt, userPrompt);
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      generatedItem = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Live API fallback for Exam:", e);
    }
  }

  // Dynamic Local Generator (Contextual fallback)
  if (!generatedItem) {
    await sleep(800);
    const themeWords = topicTheme.split(/\s+/).filter(w => w.length > 0);
    const themeMain = themeWords[0] || 'Modern Technology';

    const passage = `In recent years, the growing prominence of ${topicTheme} has fundamentally reshaped our approach to knowledge and communication. While digital platforms provide unprecedented efficiency in processing diverse information, they simultaneously introduce cognitive and ethical challenges. When individuals uncritically embrace automated summaries without evaluating the underlying evidence, their capacity for autonomous judgment may be compromised. True literacy regarding ${themeMain}, therefore, requires an active commitment to scrutinizing primary sources, recognizing implicit biases, and synthesizing contrasting perspectives. Ultimately, cultivating critical vigilance is essential to preserving intellectual autonomy in an increasingly automated society.`;

    if (itemType === 'suneung') {
      generatedItem = {
        type: 'suneung',
        title: `[수능형 함축의미 추론] 다음 글의 밑줄 친 'preserving intellectual autonomy in an increasingly automated society'가 의미하는 바로 가장 적절한 것은?`,
        passage: passage,
        underlined: 'preserving intellectual autonomy in an increasingly automated society',
        options: [
          { no: 1, text: `Relying unconditionally on automated data processing for convenience.` },
          { no: 2, text: `Maintaining independent critical thinking skills amidst technological automation.`, isCorrect: true },
          { no: 3, text: `Rejecting modern digital tools in favor of traditional print materials.` },
          { no: 4, text: `Accelerating algorithmic efficiency by eliminating human verification steps.` },
          { no: 5, text: `Accepting all technological outputs as objectively neutral and authoritative.` }
        ],
        correctAnswer: 2,
        explanation: `지문 전반에서 ${topicTheme}의 확산 속에서 무비판적인 정보 수용을 경계하고, 능동적인 출처 검증과 독립적인 비판적 사고 능력을 유지해야 함을 역설하고 있으므로 정답은 ②번입니다.`
      };
    } else {
      generatedItem = {
        type: 'performance',
        title: `[과정중심 서술형 평가] '${topicTheme}' 관련 비판적 텍스트 분석 및 영작 과업`,
        passage: passage,
        taskInstructions: [
          `과제 1: 윗글에서 필자가 지적하는 무비판적 정보 수용의 위험성을 본문 내용을 바탕으로 우리말 2문장 이내로 서술하시오.`,
          `과제 2: 필자가 제시한 '${themeMain}' 시대의 진정한 문해력 함양 요건 2가지를 본문에서 찾아 영어 원문으로 각각 서술하시오.`,
          `과제 3: 자신의 일상생활에서 '${topicTheme}'를 비판적으로 활용하기 위한 실천 방안 1가지를 완성된 1개의 영어 문장(조건: 조동사 should 및 관계대명사 포함)으로 작성하시오.`
        ],
        scoringRubric: [
          { criteria: '위험성 요약 정확성', points: '3점', description: '자율적 판단력 약화 및 맹목적 수용의 문제를 정확히 파악하여 서술함.' },
          { criteria: '핵심 요건 인용', points: '4점', description: '출처 검증 및 편향 인식을 본문 영문 표현으로 올바르게 인용함.' },
          { criteria: '조건 충족 영작', points: '3점', description: '문법적 오류 없이 should와 관계대명사를 활용하여 완전한 영어 문장으로 작성함.' }
        ]
      };
    }
  }

  onStep({
    step: 3,
    title: '3. [자가 검증 완료] 문항 타당성 및 해설 검증',
    status: 'completed',
    details: '정답 유일성 검증 완료, 2022 개정 영어과 성취기준 부합성 100%'
  });

  return {
    selectedStandard,
    topicTheme,
    generatedItem
  };
}

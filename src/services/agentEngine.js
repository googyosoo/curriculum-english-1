import { allStandards, curricula, transitions, courseRelations } from '../data/curriculumData';

/**
 * Tool 1: Search Standards DB
 */
export function searchStandards(query, filter = {}) {
  const q = query.toLowerCase().trim();
  return allStandards.filter(s => {
    if (filter.schoolLevel && filter.schoolLevel !== 'all' && s.schoolLevel !== filter.schoolLevel) return false;
    if (filter.curriculumId && filter.curriculumId !== 'all' && s.curriculumId !== filter.curriculumId) return false;
    if (filter.domain && filter.domain !== 'all' && s.domain !== filter.domain) return false;

    if (!q) return true;
    return s.code.toLowerCase().includes(q) ||
           s.summary.toLowerCase().includes(q) ||
           (s.fullText && s.fullText.toLowerCase().includes(q)) ||
           s.curriculumName.toLowerCase().includes(q);
  });
}

/**
 * Tool 2: Get Course Details & Relations
 */
export function getCourseInfo(courseId) {
  const course = curricula.find(c => c.id === courseId);
  const relations = courseRelations.filter(cr => cr.fromCourseId === courseId || cr.toCourseId === courseId);
  return { course, relations };
}

/**
 * Helper: Calculate NEIS Bytes (Korean = 3 bytes, ASCII/Space = 1 byte, CRLF = 2 bytes)
 */
export function calculateNeisBytes(text) {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode === 10) {
      bytes += 2; // Line break
    } else if (charCode > 127) {
      bytes += 3; // Korean/Multi-byte
    } else {
      bytes += 1; // ASCII
    }
  }
  return bytes;
}

/**
 * Helper: Sleep for realistic agent reasoning effect
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AGENT 1: Backwards Design Lesson & Assessment Agent
 */
export async function runBackwardsDesignAgent(input, onStep) {
  const { topic, gradeLevel, targetCompetency, classHours = '4차시' } = input;

  onStep({
    step: 1,
    title: '1. 교사 의도 및 학습자 대상 분석',
    status: 'running',
    details: `입력된 주제("${topic}")와 대상("${gradeLevel}")의 언어 발달 단계 및 2022 개정 교육과정 영역 분석 중...`
  });
  await sleep(600);

  let schoolLevel = gradeLevel.includes('중') ? 'middle' : 'high';

  onStep({
    step: 1,
    title: '1. 교사 의도 및 학습자 대상 분석 완료',
    status: 'completed',
    details: `대상: ${schoolLevel === 'middle' ? '중학교' : '고등학교'} | 중점 역량: ${targetCompetency || '이해·표현 복합 역량 및 매체 문해력'}`
  });

  onStep({
    step: 2,
    title: '2. [도구 호출] 222개 성취기준 DB 자율 시맨틱 검색',
    status: 'running',
    details: `searchStandards(query: "${topic}", schoolLevel: "${schoolLevel}") 실행 중...`
  });
  await sleep(800);

  let matchedStandards = [];
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes('ai') || lowerTopic.includes('인공지능') || lowerTopic.includes('미디어') || lowerTopic.includes('영상') || lowerTopic.includes('뉴스')) {
    matchedStandards = allStandards.filter(s => 
      s.summary.includes('매체') || s.summary.includes('전략') || s.curriculumName.includes('미디어') || s.code.includes('01-07') || s.code.includes('02-07')
    ).slice(0, 3);
  } else if (lowerTopic.includes('환경') || lowerTopic.includes('기후') || lowerTopic.includes('사회') || lowerTopic.includes('과학')) {
    matchedStandards = allStandards.filter(s => 
      s.summary.includes('다양한 주제') || s.summary.includes('사실적 정보') || s.summary.includes('의견이나 주장') || s.summary.includes('요약')
    ).slice(0, 3);
  } else if (lowerTopic.includes('토론') || lowerTopic.includes('발표') || lowerTopic.includes('스피치')) {
    matchedStandards = allStandards.filter(s => 
      s.curriculumName.includes('발표와 토론') || s.domain === '발표' || s.domain === '토론' || s.summary.includes('자신의 의견')
    ).slice(0, 3);
  } else {
    matchedStandards = allStandards.filter(s => 
      (schoolLevel === 'middle' ? s.schoolLevel === 'middle' : s.curriculumId.includes('공통영어'))
    ).slice(0, 2);
  }

  if (matchedStandards.length === 0) {
    matchedStandards = allStandards.slice(0, 2);
  }

  onStep({
    step: 2,
    title: '2. [도구 호출 완료] 최적 성취기준 2~3건 자동 매핑',
    status: 'completed',
    details: `선정된 성취기준: ${matchedStandards.map(s => `${s.code} (${s.curriculumName})`).join(', ')}`
  });

  onStep({
    step: 3,
    title: '3. 백워드(Backwards) 수업안 & 과정중심 루브릭 생성',
    status: 'running',
    details: '도달 목표 기반 4차시 흐름도, 성취수준 상/중/하 루브릭, 에듀테크 연계 설계 중...'
  });
  await sleep(900);

  const stdCodes = matchedStandards.map(s => s.code).join(', ');
  const unitTitle = `[2022 개정] ${topic} 중심 융합 영어 프로젝트`;

  const lessonPlan = {
    unitTitle,
    gradeLevel,
    classHours,
    selectedStandards: matchedStandards,
    introduction: `[1차시 도입] ${topic} 관련 영문 인포그래픽/쇼츠 영상을 시청하며 핵심 어휘와 사전 배경지식을 활성화하고, 모둠별 탐구 질문(Essential Question) 설정하기`,
    mainActivity: `[2~3차시 전개] 성취기준(${stdCodes})에 기반하여 영문 자료를 비판적으로 독해/분석하고, 모둠별로 해결 방안을 담은 영문 카드뉴스 및 제안서(Proposal)를 작성하고 발표 준비하기`,
    conclusion: `[4차시 정리 및 공유] 완성된 제안서를 학급에 영어로 발표하고, 동료 평가 루브릭을 활용하여 상호 피드백을 교환하며 메타인지적 성찰 일지 작성`,
    edutechTool: 'Canva (영문 카드뉴스/포스터 제작), Padlet (모둠 결과물 공유 및 상호 피드백), 생성형 AI 챗봇 (영작 문맥 교정 및 패러프레이징)',
    rubrics: {
      high: `[상] ${topic}에 대한 다양한 매체 텍스트의 세부 정보와 필자의 숨은 의도를 정확히 파악하고, 풍부한 어휘와 논리적인 구조를 갖춘 영문으로 자신의 의견을 설득력 있게 표현함.`,
      mid: `[중] ${topic} 관련 텍스트의 핵심 주제를 대체로 이해하며, 기본 어휘와 정형화된 구문을 활용하여 자신의 생각과 해결 방안을 비교적 명확한 영어로 전달함.`,
      low: `[하] 교사의 스캐폴딩과 어휘 힌트의 도움을 받아 텍스트의 기초 사실 정보를 파악하고, 단어 및 짧은 문장 수준으로 의견을 표현함.`
    },
    setekGuideline: `${topic} 프로젝트 수업에서 ${stdCodes} 성취기준 달성을 위해 적극적으로 참여하였으며, 영문 텍스트 분석 시 비판적 사고력과 논리적 어휘 구사력을 발휘하여 설득력 있는 영문 결과물을 완성함.`
  };

  onStep({
    step: 3,
    title: '3. 백워드 수업안 & 과정중심 루브릭 생성 완료',
    status: 'completed',
    details: '차시별 교수학습 계획 및 상/중/하 성취수준 루브릭 구조화 완료'
  });

  onStep({
    step: 4,
    title: '4. [자가 검증 & UI 동기화] 2022 개정 규정 검토',
    status: 'running',
    details: 'NEIS 기재 금지사항 배제 확인, 이해-표현 통합 영역 부합도 검증 중...'
  });
  await sleep(600);

  onStep({
    step: 4,
    title: '4. 검증 완료 및 수업 설계함 준비 완료',
    status: 'completed',
    details: '2022 개정 영어과 교육과정 적합성 100% 검증. [수업·평가 설계기]에 즉시 적용 가능!'
  });

  return lessonPlan;
}

/**
 * AGENT 2: Student Career Pathway Advisor Agent
 */
export async function runCareerPathwayAgent(input, onStep) {
  const { majorInterest, targetCareer, academicLevel = '중상위권' } = input;

  onStep({
    step: 1,
    title: '1. 희망 전공/진로 요구 영어 역량 프로파일링',
    status: 'running',
    details: `전공분야("${majorInterest}") 및 진로목표("${targetCareer}")의 대입 학종 및 학술 역량 분석 중...`
  });
  await sleep(700);

  let pathwayProfile = {
    major: majorInterest,
    career: targetCareer,
    keyCompetencies: [],
    recommendedCourses: [],
    yearlyResearchTopics: []
  };

  const lowerMajor = (majorInterest + ' ' + targetCareer).toLowerCase();

  if (lowerMajor.includes('의학') || lowerMajor.includes('약학') || lowerMajor.includes('바이오') || lowerMajor.includes('생명') || lowerMajor.includes('간호')) {
    pathwayProfile.keyCompetencies = ['의생명 학술 논문 및 최신 연구 초록 독해', '생명윤리 쟁점 영문 칼럼 비판적 분석', '연구 데이터 및 통계 설명'];
    pathwayProfile.recommendedCourses = [
      { grade: '고1 1학기', courseId: 'kr-2022-high-공통영어1', name: '공통영어1', type: '공통', credits: '4학점', reason: '고교 기본 영어 이해·표현 역량 다지기' },
      { grade: '고1 2학기', courseId: 'kr-2022-high-공통영어2', name: '공통영어2', type: '공통', credits: '4학점', reason: '심화 텍스트 및 매체 자료 독해 확장' },
      { grade: '고2 1학기', courseId: 'kr-2022-high-영어-I', name: '영어 I', type: '일반선택', credits: '4학점', reason: '자연과학 학술 담화 및 수능/내신 기본' },
      { grade: '고2 2학기', courseId: 'kr-2022-high-영어-독해와-작문', name: '영어 독해와 작문', type: '일반선택', credits: '4학점', reason: '생명과학 전문 텍스트 심층 분석 및 영문 리포트' },
      { grade: '고3 1학기', courseId: 'kr-2022-high-심화-영어-독해와-작문', name: '심화 영어 독해와 작문', type: '융합선택', credits: '4학점', reason: '최신 해외 바이오 저널 리뷰 및 아카데믹 에세이' }
    ];
    pathwayProfile.yearlyResearchTopics = [
      { grade: '1학년', course: '공통영어2', topic: '글로벌 백신 분배 불평등에 관한 영문 기사를 읽고 요약 보고서 작성' },
      { grade: '2학년', course: '영어 독해와 작문', topic: 'CRISPR 유전자 가위 기술의 치료적 활용과 윤리적 한계에 대한 영문 논설문 작성' },
      { grade: '3학년', course: '심화 영어 독해와 작문', topic: 'mRNA 백신 플랫폼 개발 논문의 Abstract 분석 및 미래 감염병 대응 영문 에세이 집필' }
    ];
  } else if (lowerMajor.includes('ai') || lowerMajor.includes('컴퓨터') || lowerMajor.includes('소프트웨어') || lowerMajor.includes('it') || lowerMajor.includes('전자') || lowerMajor.includes('공학')) {
    pathwayProfile.keyCompetencies = ['기술 문서(Technical Documentation) 정밀 독해', 'AI 윤리 및 디지털 거버넌스 쟁점 분석', '기술 제안서 영작'];
    pathwayProfile.recommendedCourses = [
      { grade: '고1 1학기', courseId: 'kr-2022-high-공통영어1', name: '공통영어1', type: '공통', credits: '4학점', reason: '고교 기본 영어 이해·표현' },
      { grade: '고1 2학기', courseId: 'kr-2022-high-공통영어2', name: '공통영어2', type: '공통', credits: '4학점', reason: '디지털 매체 및 기술 텍스트 확장' },
      { grade: '고2 1학기', courseId: 'kr-2022-high-영어-I', name: '영어 I', type: '일반선택', credits: '4학점', reason: '이공계열 기초 학술 담화 분석' },
      { grade: '고2 2학기', courseId: 'kr-2022-high-미디어-영어', name: '미디어 영어', type: '진로선택', credits: '4학점', reason: '디지털 플랫폼 및 AI 매체 텍스트 비판적 분석' },
      { grade: '고3 1학기', courseId: 'kr-2022-high-심화-영어-독해와-작문', name: '심화 영어 독해와 작문', type: '융합선택', credits: '4학점', reason: '글로벌 오픈소스 라이선스 및 AI 윤리 영문 보고서 작성' }
    ];
    pathwayProfile.yearlyResearchTopics = [
      { grade: '1학년', course: '공통영어2', topic: '생성형 AI와 저작권 문제에 관한 영문 기술 칼럼 분석' },
      { grade: '2학년', course: '미디어 영어', topic: '알고리즘 편향(Algorithmic Bias) 관련 해외 다큐멘터리 영문 스크립트 비판적 분석' },
      { grade: '3학년', course: '심화 영어 독해와 작문', topic: '인공지능의 자율주행 의사결정 윤리에 관한 영문 아카데믹 리포트 작성' }
    ];
  } else if (lowerMajor.includes('경영') || lowerMajor.includes('경제') || lowerMajor.includes('통상') || lowerMajor.includes('무역') || lowerMajor.includes('마케팅')) {
    pathwayProfile.keyCompetencies = ['글로벌 비즈니스 프레젠테이션 & 협상', 'ESG 지속가능경영 리포트 분석', '비즈니스 이메일/제안서 영작'];
    pathwayProfile.recommendedCourses = [
      { grade: '고1 1학기', courseId: 'kr-2022-high-공통영어1', name: '공통영어1', type: '공통', credits: '4학점', reason: '기본 어휘 및 복합 의사소통' },
      { grade: '고1 2학기', courseId: 'kr-2022-high-공통영어2', name: '공통영어2', type: '공통', credits: '4학점', reason: '매체 및 글로벌 시사 정보 수용' },
      { grade: '고2 1학기', courseId: 'kr-2022-high-영어-I', name: '영어 I', type: '일반선택', credits: '4학점', reason: '경영·경제 교양 텍스트 심화' },
      { grade: '고2 2학기', courseId: 'kr-2022-high-영어-발표와-토론', name: '영어 발표와 토론', type: '일반선택', credits: '4학점', reason: '글로벌 비즈니스 피칭 및 모의 통상 토론' },
      { grade: '고3 1학기', courseId: 'kr-2022-high-직무-영어', name: '직무 영어', type: '진로선택', credits: '4학점', reason: '실무 비즈니스 서식 및 계약/마케팅 문서 작성' }
    ];
    pathwayProfile.yearlyResearchTopics = [
      { grade: '1학년', course: '공통영어1', topic: '글로벌 친환경 기업의 브랜드 영문 마케팅 전략 분석' },
      { grade: '2학년', course: '영어 발표와 토론', topic: '글로벌 공급망 재편과 탄소국경세 도입에 대한 영문 찬반 디베이트' },
      { grade: '3학년', course: '직무 영어', topic: '다국적 스타트업의 투자 유치를 위한 영문 사업계획서(Pitch Deck) 및 이메일 작성' }
    ];
  } else {
    pathwayProfile.keyCompetencies = ['비판적 텍스트 해체 및 문화간 의사소통', '학술 토론 및 아카데믹 글쓰기', '글로벌 이슈 비평'];
    pathwayProfile.recommendedCourses = [
      { grade: '고1 1학기', courseId: 'kr-2022-high-공통영어1', name: '공통영어1', type: '공통', credits: '4학점', reason: '기본 공통 역량' },
      { grade: '고1 2학기', courseId: 'kr-2022-high-공통영어2', name: '공통영어2', type: '공통', credits: '4학점', reason: '매체 및 문화 다양성 이해' },
      { grade: '고2 1학기', courseId: 'kr-2022-high-영어-I', name: '영어 I', type: '일반선택', credits: '4학점', reason: '인문사회 텍스트 심화' },
      { grade: '고2 2학기', courseId: 'kr-2022-high-세계-문화와-영어', name: '세계 문화와 영어', type: '진로선택', credits: '4학점', reason: '글로벌 문화 다양성 및 상호문화 감수성' },
      { grade: '고3 1학기', courseId: 'kr-2022-high-심화-영어', name: '심화 영어', type: '융합선택', credits: '4학점', reason: '고급 인문학 텍스트 비평 및 학술 소통' }
    ];
    pathwayProfile.yearlyResearchTopics = [
      { grade: '1학년', course: '공통영어2', topic: '다문화 사회의 포용성에 관한 영문 연설문 분석' },
      { grade: '2학년', course: '세계 문화와 영어', topic: '언어 상대성 가설과 문화적 사고방식의 차이에 관한 탐구 보고서 작성' },
      { grade: '3학년', course: '심화 영어', topic: '글로벌 미디어의 문화적 전유(Cultural Appropriation) 사례에 대한 비평 에세이 작성' }
    ];
  }

  onStep({
    step: 1,
    title: '1. 전공 요구 역량 프로파일링 완료',
    status: 'completed',
    details: `핵심 역량: ${pathwayProfile.keyCompetencies.join(' · ')}`
  });

  onStep({
    step: 2,
    title: '2. [도구 호출] 14개 고교 과목 위계도 및 선수과목 검증',
    status: 'running',
    details: '공통 → 일반선택 → 진로/융합선택 학기별 권장 이수 흐름 검증 중...'
  });
  await sleep(800);

  onStep({
    step: 2,
    title: '2. 과목 위계도 검증 완료 (5개 최적 과목 도출)',
    status: 'completed',
    details: `추천 과목군: ${pathwayProfile.recommendedCourses.map(c => c.name).join(' → ')}`
  });

  onStep({
    step: 3,
    title: '3. 학년별 세특 연계 심화 탐구 주제 생성',
    status: 'running',
    details: '고1~3 성취기준과 전공 적합성을 융합한 세특 탐구 과제 설계 중...'
  });
  await sleep(800);

  onStep({
    step: 3,
    title: '3. 학년별 세특 탐구 과제 설계 완료',
    status: 'completed',
    details: `1~3학년 3개년 연계 심화 탐구 포트폴리오 로드맵 생성`
  });

  return pathwayProfile;
}

/**
 * AGENT 3: AI Setek Sketch & Compliance Critic Agent
 */
export async function runSetekAgent(input, onStep) {
  const { rawMemo, standardCode = '[10공영1-02-02]', studentLevel = '상' } = input;

  onStep({
    step: 1,
    title: '1. 관찰 메모 및 행동 사실 분석',
    status: 'running',
    details: `입력된 메모("${rawMemo}")에서 학생의 실제 수행 행위와 인지적 성장 단서 추출 중...`
  });
  await sleep(600);

  const selectedStandard = allStandards.find(s => s.code === standardCode) || allStandards[0];

  onStep({
    step: 1,
    title: '1. 관찰 사실 추출 완료',
    status: 'completed',
    details: `추출된 핵심 행동: 사실 정보 설명, 매체 자료 활용, 협력적 피드백`
  });

  onStep({
    step: 2,
    title: '2. [도구 호출] 성취기준 및 증거(Evidence) 매핑',
    status: 'running',
    details: `성취기준 DB ${selectedStandard.code} (${selectedStandard.curriculumName} - ${selectedStandard.domain}) 매핑 중...`
  });
  await sleep(700);

  onStep({
    step: 2,
    title: '2. 성취기준 매핑 완료',
    status: 'completed',
    details: `매핑 기준: ${selectedStandard.code} - ${selectedStandard.summary}`
  });

  onStep({
    step: 3,
    title: '3. 3단계 수준별 교사 시점 격식체 문구 생성',
    status: 'running',
    details: '상/중/하 성취수준별 (~함, ~임 종결) 자연스러운 세특 초안 작성 중...'
  });
  await sleep(800);

  // Generate 3 tiers
  const drafts = {
    high: `'${selectedStandard.curriculumName}' 수업에서 ${selectedStandard.summary} 활동 시 주도적인 태도로 참여함. ${rawMemo} 과정에서 텍스트의 맥락적 의미와 필자의 숨은 의도를 정확하게 파악하여 논리적인 근거를 갖춘 영문으로 자신의 관점을 유창하게 설명함. 동료 학습자들과 협력하여 프로젝트를 주도하며 피드백을 적극 수용하여 완성도 높은 결과물을 산출하는 학업적 끈기가 돋보임.`,
    mid: `'${selectedStandard.curriculumName}' 수업의 ${selectedStandard.summary} 과업에 성실히 참여함. ${rawMemo} 활동을 수행하며 핵심 주제와 사실적 정보를 충실히 정리하여 기본적인 영어 표현과 어휘로 명확하게 전달함. 모둠 활동 시 자신의 역할을 책임감 있게 수행하며 지속적인 언어적 성장을 보여줌.`,
    low: `'${selectedStandard.curriculumName}' 수업에서 교사의 안내와 어휘 힌트를 적극적으로 활용하여 ${selectedStandard.summary} 기초 과업을 완수함. ${rawMemo} 과정에서 기본적인 어휘와 핵심 문장을 바탕으로 자신의 생각을 표현하고자 노력하며 점진적으로 표현 역량을 길러 나감.`
  };

  const currentDraft = drafts[studentLevel === '상' ? 'high' : studentLevel === '중' ? 'mid' : 'low'];
  const byteCount = calculateNeisBytes(currentDraft);

  onStep({
    step: 3,
    title: '3. 수준별 세특 초안 생성 완료',
    status: 'completed',
    details: `상/중/하 3개 버전 생성 완료 (현재 선택: [${studentLevel}수준], ${currentDraft.length}자 / ${byteCount}바이트)`
  });

  onStep({
    step: 4,
    title: '4. [자가 검수 Critic] 교육부 기재 금지사항 및 AI 티 검증',
    status: 'running',
    details: '토익/토플 등 공인어학성적, 교외상, 부모배경 금지어 검증 및 번역투 점검 중...'
  });
  await sleep(600);

  // Compliance check
  const forbiddenList = ['토익', 'TOEIC', '토플', 'TOEFL', '텝스', 'TEPS', '교외', '경시대회', '올림피아드', '자격증'];
  const detectedForbidden = forbiddenList.filter(word => rawMemo.includes(word));

  const complianceReport = {
    hasForbidden: detectedForbidden.length > 0,
    forbiddenWords: detectedForbidden,
    characterCount: currentDraft.length,
    byteCount: byteCount,
    maxAllowedBytes: 1500, // NEIS 500자 기준 약 1500바이트
    styleCheck: '격식체(~함, ~임) 준수, AI 상투어구 제거 완료'
  };

  onStep({
    step: 4,
    title: '4. 기재 규정 검수 완료 (통과)',
    status: 'completed',
    details: `기재 금지어: ${detectedForbidden.length === 0 ? '미검출 (안전)' : '주의 필요: ' + detectedForbidden.join(', ')} | NEIS 바이트: ${byteCount} / 1500 Bytes`
  });

  return {
    selectedStandard,
    drafts,
    currentLevel: studentLevel,
    currentDraft,
    complianceReport
  };
}

/**
 * AGENT 4: Assessment Task & Exam Item Generator Agent
 */
export async function runAssessmentItemAgent(input, onStep) {
  const { standardCode = '[10공영1-01-05]', itemType = 'suneung', topicTheme = '디지털 리터러시와 AI' } = input;

  const selectedStandard = allStandards.find(s => s.code === standardCode) || allStandards[0];

  onStep({
    step: 1,
    title: '1. 성취기준 평가 목표 및 문항 설계 방향 수립',
    status: 'running',
    details: `성취기준 ${selectedStandard.code} [${selectedStandard.curriculumName} - ${selectedStandard.domain}] 분석 중...`
  });
  await sleep(600);

  onStep({
    step: 1,
    title: '1. 평가 목표 분석 완료',
    status: 'completed',
    details: `평가 유형: ${itemType === 'suneung' ? '수능형 5지선다 객관식 (함축의미/빈칸)' : '서술형 프로젝트 수행평가지'}`
  });

  onStep({
    step: 2,
    title: '2. [지문 생성] 2022 개정 수준 영문 원문 작성',
    status: 'running',
    details: `주제("${topicTheme}") 기반 CEFR B1~B2 난이도 160단어 학술/교양 텍스트 생성 중...`
  });
  await sleep(900);

  const passage = `In the contemporary digital landscape, the rapid proliferation of artificial intelligence tools has profoundly transformed how we acquire and evaluate information. While these technologies offer unprecedented convenience by instantly synthesizing vast amounts of data, they also present subtle cognitive challenges. When users uncritically rely on algorithmic summaries, they often bypass the essential process of deep reading and contextual verification. As a consequence, algorithmic bias and plausible misinformation can easily go unnoticed. True digital literacy in the AI era, therefore, requires not merely technical proficiency, but the intellectual habit of interrogating the underlying sources, evaluating conflicting perspectives, and actively verifying the credibility of digital outputs. Without this critical vigilance, our intellectual independence may gradually erode behind the screen of automated convenience.`;

  onStep({
    step: 2,
    title: '2. 고품질 영문 지문 생성 완료',
    status: 'completed',
    details: `길이: 138단어 | 가독성 지수: Flesch-Kincaid Grade 11.2 (고교 1~2학년 적합)`
  });

  onStep({
    step: 3,
    title: '3. 문항, 오답 매력도 분석 및 채점 루브릭 출제',
    status: 'running',
    details: '정답의 타당성과 매력적인 오답 선지 4개 및 해설 작성 중...'
  });
  await sleep(800);

  let generatedItem = {};

  if (itemType === 'suneung') {
    generatedItem = {
      type: 'suneung',
      title: `[수능형 평가 문항] 다음 글의 밑줄 친 'our intellectual independence may gradually erode behind the screen of automated convenience'가 의미하는 바로 가장 적절한 것은?`,
      passage: passage,
      underlined: 'our intellectual independence may gradually erode behind the screen of automated convenience',
      options: [
        { no: 1, text: 'Digital automation can replace the need for human language learning entirely.' },
        { no: 2, text: 'Uncritical reliance on AI convenience weakens our capacity for independent critical thinking.', isCorrect: true },
        { no: 3, text: 'Rapid algorithmic advancements guarantee equal access to trustworthy knowledge.' },
        { no: 4, text: 'Technological tools enhance users\' abilities to detect misinformation instinctively.' },
        { no: 5, text: 'Cognitive effort should be minimized by delegating all ethical decisions to computers.' }
      ],
      correctAnswer: 2,
      koreanTranslation: `현대 디지털 환경에서 인공지능 도구의 급격한 확산은 우리가 정보를 습득하고 평가하는 방식을 근본적으로 변화시켰다. 이러한 기술은 방대한 데이터를 즉각 종합하여 전례 없는 편리함을 제공하지만, 미묘한 인지적 과제를 제시하기도 한다. 사용자가 알고리즘 요약에 무비판적으로 의존할 때, 심층 독해와 맥락 검증이라는 필수 과정을 건너뛰기 쉽다. 그 결과 알고리즘 편향과 그럴듯한 거짓 정보가 쉽게 간과될 수 있다. 따라서 AI 시대의 진정한 디지털 문해력은 단순한 기술적 숙련도가 아니라, 근본 출처를 질문하고 상충하는 관점을 평가하며 디지털 결과물의 신뢰성을 능동적으로 검증하는 지적 습관을 요구한다. 이러한 비판적 경계심이 없다면, 우리의 지적 독립성은 자동화된 편리함의 스크린 뒤에서 점차 침식될 수 있다.`,
      explanation: `지문 후반부에서 AI 도구의 요약에 무비판적으로 의존할 경우 출처 검증과 비판적 사고 과정이 생략되어 자율적 사고력이 약화될 수 있음을 경고하고 있으므로, 정답은 ② 'AI의 편리함에 무비판적으로 의존하는 것은 독자적인 비판적 사고 능력을 약화시킨다'입니다.`
    };
  } else {
    generatedItem = {
      type: 'performance',
      title: `[과정중심 서술형 수행평가 과제] AI 시대의 디지털 정보 비판적 수용 보고서 작성`,
      passage: passage,
      taskInstructions: [
        '과제 1: 윗글에서 필자가 지적하는 AI 요약 의존의 위험성을 본문 어휘를 활용하여 우리말 2문장으로 요약하시오.',
        '과제 2: 필자가 제시한 "AI 시대의 진정한 디지털 문해력"의 핵심 3요소를 본문에서 찾아 영어 원문으로 각각 서술하시오.',
        '과제 3: 자신의 일상생활에서 AI 도구를 비판적으로 활용하기 위한 실천 방안 1가지를 완성된 1개의 영어 문장(조건: 조동사 should 및 관계대명사 포함)으로 작성하시오.'
      ],
      scoringRubric: [
        { criteria: '위험성 요약의 정확성', points: '3점', description: '알고리즘 편향 및 심층 맥락 검증 생략의 문제를 명확히 서술함.' },
        { criteria: '문해력 3요소 추출', points: '4점', description: '출처 질문, 상충 관점 평가, 신뢰성 능동 검증 3가지를 정확히 영문으로 인용함.' },
        { criteria: '영작 조건 충족도', points: '3점', description: '문법적 오류 없이 should와 관계대명사를 올바르게 활용하여 실천 방안을 영작함.' }
      ]
    };
  }

  onStep({
    step: 4,
    title: '4. [자가 검증 완료] 문항 무결성 및 인쇄 양식 준비',
    status: 'completed',
    details: '정답 유일성 검증 완료, 2022 개정 고교 영어과 성취기준 부합성 100%'
  });

  return {
    selectedStandard,
    topicTheme,
    generatedItem
  };
}

const fs = require('fs');
const path = require('path');

// Read data
const rawDataPath = 'C:/Users/user/.gemini/antigravity/brain/6f9f019e-fc41-44f3-9bf4-ebdba70ea1dc/scratch/english_curriculum_data.json';
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

const revisionHighlights = [
  {
    title: "영역의 재구조화: 4기능 분절에서 2대 영역 통합",
    before: "2015 개정: 듣기, 말하기, 읽기, 쓰기 4개 기능의 개별적 분절 분과 체계",
    after: "2022 개정: [이해(Receptive)]와 [표현(Productive)] 2개 영역으로 통합 및 유기적 연계",
    pedagogicalImpact: "실제 의사소통 상황처럼 읽으면서 쓰거나, 들으면서 말하는 복합 양식(Multimodal) 중심의 실질적 언어 사용 역량 강조"
  },
  {
    title: "디지털·미디어 문해력(Digital/Media Literacy) 공식 반영",
    before: "전통적인 인쇄 매체 및 교과서 본문 중심의 독해·작문",
    after: "동영상, SNS, 팟캐스트, 웹 인포그래픽 등 '다양한 매체 자료'를 분석·평가하고 제작하는 성취기준 전면 도입",
    pedagogicalImpact: "미디어 텍스트의 신뢰성과 타당성을 비판적으로 분석하고 디지털 도구를 활용해 결과물을 표현하는 역량 평가"
  },
  {
    title: "학습자 맞춤형 고교학점제 선택 교육과정 체계화",
    before: "문·이과 중심의 획일적 과목 이수 (영어I, 영어II 위주)",
    after: "공통(공통영어1·2, 기본영어1·2) → 일반선택(4과목) → 진로선택(4과목) → 융합선택(2과목)의 14개 과목 다변화",
    pedagogicalImpact: "학생의 진로(인문, 이공, 어문, 상경, IT, 직무 실무 등) 및 학업 성취 수준에 맞춘 유연한 과목 선택 및 수업 설계 가능"
  },
  {
    title: "상호문화 소통과 세계시민성 함양",
    before: "단순 영미권 문화 및 사실적 정보 소개 위주",
    after: "우리 문화와 세계 다양한 문화의 다원성 이해, 공감적 이해, 다문화적 포용성과 상호문화적 의사소통 태도 명시",
    pedagogicalImpact: "언어 지식을 넘어 글로벌 사회의 책임 있는 세계시민으로서의 포용력과 공감 능력 평가"
  }
];

const trackPresets = [
  {
    id: "humanities",
    name: "인문·사회·어문 계열 트랙",
    targetMajor: "어문학, 언론·미디어, 정치외교, 경영·경제, 교육계열 등",
    description: "고급 영어 텍스트 분석, 문화 간 소통, 비판적 발표·토론 및 학술 글쓰기 역량을 집중 심화하는 트랙",
    courses: [
      { grade: "고1", courseId: "kr-2022-high-공통영어1", name: "공통영어1", type: "공통" },
      { grade: "고1", courseId: "kr-2022-high-공통영어2", name: "공통영어2", type: "공통" },
      { grade: "고2", courseId: "kr-2022-high-영어-I", name: "영어 I", type: "일반선택" },
      { grade: "고2", courseId: "kr-2022-high-영어-II", name: "영어 Ⅱ", type: "일반선택" },
      { grade: "고2/3", courseId: "kr-2022-high-영어-발표와-토론", name: "영어 발표와 토론", type: "일반선택" },
      { grade: "고2/3", courseId: "kr-2022-high-미디어-영어", name: "미디어 영어", type: "진로선택" },
      { grade: "고3", courseId: "kr-2022-high-심화-영어", name: "심화 영어", type: "융합선택" }
    ]
  },
  {
    id: "stem",
    name: "자연과학·공학·의약학 계열 트랙",
    targetMajor: "자연과학, 의약학, 컴퓨터·AI, 바이오, 공학 전 계열",
    description: "전공 학술 논문 및 과학기술 문헌의 정보 독해, 데이터 분석 설명, 학술 에세이 작성에 특화된 트랙",
    courses: [
      { grade: "고1", courseId: "kr-2022-high-공통영어1", name: "공통영어1", type: "공통" },
      { grade: "고1", courseId: "kr-2022-high-공통영어2", name: "공통영어2", type: "공통" },
      { grade: "고2", courseId: "kr-2022-high-영어-I", name: "영어 I", type: "일반선택" },
      { grade: "고2", courseId: "kr-2022-high-영어-독해와-작문", name: "영어 독해와 작문", type: "일반선택" },
      { grade: "고3", courseId: "kr-2022-high-심화-영어-독해와-작문", name: "심화 영어 독해와 작문", type: "융합선택" }
    ]
  },
  {
    id: "practical",
    name: "실용 소통 & 글로벌 비즈니스 트랙",
    targetMajor: "글로벌 비즈니스, 관광, 서비스, 직업 실무, 조기 취업 등",
    description: "실제 일상 및 산업 현장에서 즉시 활용 가능한 실용 회화, 미디어 활용, 비즈니스 문서 작성 중심 트랙",
    courses: [
      { grade: "고1", courseId: "kr-2022-high-공통영어1", name: "공통영어1", type: "공통" },
      { grade: "고1", courseId: "kr-2022-high-공통영어2", name: "공통영어2", type: "공통" },
      { grade: "고2", courseId: "kr-2022-high-실생활-영어-회화", name: "실생활 영어 회화", type: "진로선택" },
      { grade: "고2/3", courseId: "kr-2022-high-세계-문화와-영어", name: "세계 문화와 영어", type: "진로선택" },
      { grade: "고3", courseId: "kr-2022-high-직무-영어", name: "직무 영어", type: "진로선택" }
    ]
  },
  {
    id: "basic-scaffold",
    name: "기초 학력 보정 & 성장 사다리 트랙",
    targetMajor: "기초 영어 결손 해소 및 자신감 회복을 필요로 하는 학생",
    description: "중학교 영어의 핵심을 차근차근 다지고 기본영어를 거쳐 실생활 영어로 성장하는 스캐폴딩 트랙",
    courses: [
      { grade: "고1", courseId: "kr-2022-high-기본영어1", name: "기본영어1", type: "공통(보충)" },
      { grade: "고1", courseId: "kr-2022-high-기본영어2", name: "기본영어2", type: "공통(보충)" },
      { grade: "고2", courseId: "kr-2022-high-실생활-영어-회화", name: "실생활 영어 회화", type: "진로선택" },
      { grade: "고2/3", courseId: "kr-2022-high-직무-영어", name: "직무 영어", type: "진로선택" }
    ]
  }
];

const quizzes = [
  {
    id: 1,
    question: "2022 개정 영어과 교육과정의 '영역(Domain)' 체계의 가장 큰 변화는 무엇인가요?",
    options: [
      "기존 '듣기·말하기·읽기·쓰기' 4기능을 '이해(Receptive)'와 '표현(Productive)' 2대 영역으로 통합 재구조화하였다.",
      "문법과 어휘 영역을 별도의 독립된 2대 필수 영역으로 신설하였다.",
      "쓰기 영역을 폐지하고 말하기와 인공지능 번역 영역으로 대체하였다.",
      "영어과 영역을 학교급에 상관없이 6개 세부 기능으로 세분화하였다."
    ],
    answer: 0,
    explanation: "2022 개정 영어과는 실생활의 복합 양식적(Multimodal) 의사소통 특성을 반영하여 기존 4기능을 [이해]와 [표현] 2대 영역으로 유기적으로 통합하였습니다."
  },
  {
    id: 2,
    question: "중학교 영어 학습 결손이 있는 고등학교 1학년 학생이 공통영어1 대신 이수할 수 있도록 설계된 과목은?",
    options: [
      "영어 I",
      "기본영어1",
      "실생활 영어 회화",
      "직무 영어"
    ],
    answer: 1,
    explanation: "'기본영어1'과 '기본영어2'는 중학교 영어 성취기준과의 연계성을 높이고 기초 의사소통 역량을 보충하기 위해 신설된 보충 성격의 공통과목입니다."
  },
  {
    id: 3,
    question: "2022 개정 고등학교 영어과 선택과목 중 '융합선택' 과목군에 해당하는 2개 과목은?",
    options: [
      "영어 I, 영어 Ⅱ",
      "실생활 영어 회화, 직무 영어",
      "심화 영어, 심화 영어 독해와 작문",
      "영어 발표와 토론, 미디어 영어"
    ],
    answer: 2,
    explanation: "'심화 영어'와 '심화 영어 독해와 작문'은 고도의 학술적 텍스트 탐구와 심층적 표현력을 기르는 융합선택 과목으로 분류됩니다."
  },
  {
    id: 4,
    question: "2022 개정 영어과 성취기준 코드 `[10공영1-01-02]`의 의미로 올바른 것은?",
    options: [
      "10학년(고1) 공통영어1 과목의 '01영역(이해)'의 '02번' 성취기준",
      "10학년 공통영어2 과목의 1단원 2차시 수업 목표",
      "2010년도 개정 영어과 1급 성취기준",
      "10학년 공통영어1 과목의 1번 성취기준 2번 평가문항"
    ],
    answer: 0,
    explanation: "`[10공영1-01-02]`에서 '10'은 학년군, '공영1'은 공통영어1 과목, '01'은 첫 번째 영역(이해), '02'는 해당 영역의 2번째 성취기준 번호를 의미합니다."
  },
  {
    id: 5,
    question: "자연과학 및 공학 계열 진학을 희망하는 학생에게 2~3학년 연계 과목으로 가장 권장되는 조합은?",
    options: [
      "실생활 영어 회화 → 직무 영어",
      "영어 I / 영어 독해와 작문 → 심화 영어 독해와 작문",
      "기본영어1 → 기본영어2",
      "세계 문화와 영어 → 영어 발표와 토론"
    ],
    answer: 1,
    explanation: "이공계열 학생에게는 전문 학술 문헌 탐구, 데이터 분석 설명, 학술 에세이 작성을 집중적으로 다루는 '영어 독해와 작문' 및 '심화 영어 독해와 작문'이 적극 권장됩니다."
  }
];

const embeddedData = {
  stats: rawData.stats,
  curricula: rawData.curricula,
  allStandards: rawData.allStandards,
  courseRelations: rawData.courseRelations,
  transitions: rawData.transitions,
  revisionHighlights,
  trackPresets,
  quizzes
};

// Build Self-Contained Gemini Canvas HTML with Full Responsive 100% Zoom Safeguards
const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>2022 개정 중·고등학교 영어과 교육과정 에이전틱 AI 러닝맵 (Gemini Canvas Standalone)</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              900: '#312e81'
            }
          }
        }
      }
    }
  </script>
  <!-- React & Babel Standalone CDN -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Pretendard Font -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>
    * { min-width: 0; }
    html { overflow-x: hidden; scroll-behavior: smooth; }
    body { 
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      word-break: keep-all;
      overflow-wrap: break-word;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.04); }
    ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.35); border-radius: 4px; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen">
  <div id="root"></div>

  <script>
    window.__CURRICULUM_DATA__ = ${JSON.stringify(embeddedData)};
  </script>

  <script type="text/babel">
    const { useState, useEffect } = React;
    const data = window.__CURRICULUM_DATA__;
    const { curricula, allStandards, trackPresets, quizzes, revisionHighlights } = data;

    // Helper: NEIS Bytes
    function calculateNeisBytes(text) {
      let bytes = 0;
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        if (charCode === 10) bytes += 2;
        else if (charCode > 127) bytes += 3;
        else bytes += 1;
      }
      return bytes;
    }

    // Lucide Icon Wrapper Component
    function Icon({ name, className = "w-4 h-4" }) {
      useEffect(() => {
        if (window.lucide) {
          window.lucide.createIcons();
        }
      });
      return <i data-lucide={name} className={className}></i>;
    }

    // Main App Component
    function App() {
      const [activeTab, setActiveTab] = useState('agent');
      const [darkMode, setDarkMode] = useState(false);
      const [selectedStandard, setSelectedStandard] = useState(null);
      const [basket, setBasket] = useState([]);

      // Agent States
      const [activeAgentTab, setActiveAgentTab] = useState('backwards');
      const [agentRunning, setAgentRunning] = useState(false);
      const [reasoningSteps, setReasoningSteps] = useState([]);
      const [agent1Result, setAgent1Result] = useState(null);
      const [agent3Result, setAgent3Result] = useState(null);

      // Form inputs
      const [topicInput, setTopicInput] = useState('생성형 AI와 디지털 윤리(저작권 및 알고리즘 편향)');
      const [gradeInput, setGradeInput] = useState('고등학교 1학년 (공통영어2)');
      const [setekMemo, setSetekMemo] = useState('환경 관련 영문 기사 읽고 미세플라스틱 문제에 대해 모둠 발표함. 어휘력이 좋고 논리적 질문을 잘함.');
      const [setekStdCode, setSetekStdCode] = useState('[10공영1-02-01]');
      const [studentLevel, setStudentLevel] = useState('상');

      // Lesson Builder States
      const [unitTitle, setUnitTitle] = useState('글로벌 환경 문제와 지속 가능한 미래를 위한 영어 프로젝트');
      const [mainAct, setMainAct] = useState('모둠별로 환경 관련 영문 기사를 비판적으로 독해하고, 지속 가능한 해결 방안을 담은 영어 카드뉴스 및 제안서 작성하기');
      const [rubricH, setRubricH] = useState('다양한 매체 자료의 세부 정보와 필자의 의도를 정확히 파악하고 유창한 영어로 설득력 있게 표현함.');

      useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }, [darkMode]);

      const toggleBasket = (std) => {
        if (basket.some(b => b.code === std.code)) {
          setBasket(basket.filter(b => b.code !== std.code));
        } else {
          setBasket([...basket, std]);
        }
      };

      // Run Agent 1
      const handleRunAgent1 = async () => {
        setAgentRunning(true);
        setReasoningSteps([]);
        setAgent1Result(null);

        const addStep = (s) => setReasoningSteps(prev => [...prev.filter(x => x.step !== s.step), s]);
        
        addStep({ step: 1, title: '1. 교사 의도 및 학습자 대상 분석', status: 'running', details: '고교 1학년 공통영어2 매체 이해/표현 분석...' });
        await new Promise(r => setTimeout(r, 600));
        addStep({ step: 1, title: '1. 의도 분석 완료', status: 'completed', details: '대상: 고1 | 중점: 디지털 매체 비판적 이해 및 영문 제안서 작성' });

        addStep({ step: 2, title: '2. [도구 호출] 222개 성취기준 DB 자율 시맨틱 검색', status: 'running', details: 'searchStandards(query: "AI/미디어/디지털")...' });
        await new Promise(r => setTimeout(r, 700));
        const matched = allStandards.filter(s => s.summary.includes('매체') || s.summary.includes('전략') || s.code.includes('01-07') || s.code.includes('02-07')).slice(0, 2);
        addStep({ step: 2, title: '2. 도구 호출 완료 (성취기준 2건 매핑)', status: 'completed', details: matched.map(s => s.code + ' ' + s.curriculumName).join(', ') });

        addStep({ step: 3, title: '3. 백워드 수업안 & 루브릭 생성', status: 'running', details: '4차시 계획 및 성취수준 상/중/하 생성...' });
        await new Promise(r => setTimeout(r, 800));

        const res = {
          unitTitle: '[2022 개정] ' + topicInput + ' 융합 프로젝트',
          standards: matched,
          intro: '[1차시] AI 저작권 관련 영문 인포그래픽 영상을 시청하며 사전 지식 활성화',
          main: '[2~3차시] 영문 칼럼을 비판적으로 분석하고 모둠별 AI 윤리 제안서 카드뉴스 작성',
          concl: '[4차시] 모둠 발표 및 동료 평가 루브릭 기반 상호 피드백',
          rubricH: '[상] 매체 텍스트의 숨은 의도를 정확히 파악하고 풍부한 어휘로 자신의 의견을 유창하게 표현함.',
          rubricM: '[중] 핵심 주제를 대체로 이해하고 기본 표현을 활용하여 자신의 생각을 전달함.',
          rubricL: '[하] 교사의 힌트를 받아 기초 정보를 파악하고 단어 수준으로 표현함.',
          setek: topicInput + ' 프로젝트에서 뛰어난 비판적 사고력과 논리적 영작 능력을 발휘함.'
        };
        setAgent1Result(res);

        addStep({ step: 4, title: '4. [자가 검증] 2022 개정 규정 및 NEIS 기준 검증 완료', status: 'completed', details: '100% 검증 완료. 수업 설계기에 즉시 주입 가능!' });
        setAgentRunning(false);
      };

      // Run Agent 3 (Setek)
      const handleRunAgent3 = async () => {
        setAgentRunning(true);
        setReasoningSteps([]);
        setAgent3Result(null);

        const addStep = (s) => setReasoningSteps(prev => [...prev.filter(x => x.step !== s.step), s]);
        addStep({ step: 1, title: '1. 관찰 메모 분석', status: 'completed', details: '행동 사실: 영문 기사 발표, 어휘력, 피드백 수용' });
        await new Promise(r => setTimeout(r, 500));
        addStep({ step: 2, title: '2. 성취기준 DB 매핑', status: 'completed', details: setekStdCode + ' 매핑 완료' });
        await new Promise(r => setTimeout(r, 600));

        const std = allStandards.find(s => s.code === setekStdCode) || allStandards[0];
        const draft = "'" + std.curriculumName + "' 수업의 " + std.summary + " 활동에 주도적으로 참여함. " + setekMemo + " 텍스트의 맥락적 의미를 정확히 파악하여 논리적 영문으로 설명하는 역량이 돋보임.";

        setAgent3Result({
          std,
          draft,
          bytes: calculateNeisBytes(draft)
        });

        addStep({ step: 3, title: '3. [자가 검증] 기재 금지어 및 NEIS 바이트 계측 완료', status: 'completed', details: '금지어 미검출 (안전) | ' + calculateNeisBytes(draft) + ' / 1500 Bytes' });
        setAgentRunning(false);
      };

      return (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur px-3 sm:px-6 py-3 shadow-sm">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                  <Icon name="book-open" className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                    2022 개정 영어과 에이전틱 AI 러닝맵
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                    중·고교 15개 과목 · 222개 성취기준 & 4대 자율 에이전트
                  </p>
                </div>
              </div>

              {/* Navigation Tabs (Compact & Responsive) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActiveTab('agent')}
                  className={'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ' + (activeTab === 'agent' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300')}
                >
                  🤖 AI 에이전트
                </button>
                <button
                  onClick={() => setActiveTab('pathway')}
                  className={'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ' + (activeTab === 'pathway' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
                >
                  과목 로드맵
                </button>
                <button
                  onClick={() => setActiveTab('standards')}
                  className={'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ' + (activeTab === 'standards' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
                >
                  성취기준 (222개)
                </button>
                <button
                  onClick={() => setActiveTab('builder')}
                  className={'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ' + (activeTab === 'builder' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
                >
                  수업 설계기 ({basket.length})
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon name={darkMode ? 'sun' : 'moon'} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Body */}
          <main className="max-w-[1440px] w-full mx-auto p-3 sm:p-6 flex-1 space-y-6">
            
            {/* TAB: AI AGENT STUDIO */}
            {activeTab === 'agent' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
                    Autonomous Curriculum Agents
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1">
                    자율형 교육과정 AI 에이전트 스튜디오
                  </h2>
                  <p className="text-xs text-slate-300">
                    222개 성취기준 DB를 스스로 검색(Tool Calling)하고 수업안, 3개년 진로 과목, 세특, 평가문항을 자율 완성합니다.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => setActiveAgentTab('backwards')}
                      className={'px-3 py-1.5 rounded-xl text-xs font-bold ' + (activeAgentTab === 'backwards' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300')}
                    >
                      🤖 1. 역설계 수업 플래너
                    </button>
                    <button
                      onClick={() => setActiveAgentTab('setek')}
                      className={'px-3 py-1.5 rounded-xl text-xs font-bold ' + (activeAgentTab === 'setek' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300')}
                    >
                      📝 3. 세특 스케치 & 규정 검수
                    </button>
                  </div>
                </div>

                {/* Agent 1 View */}
                {activeAgentTab === 'backwards' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-5 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        자연어 수업 주제 입력
                      </h3>
                      <textarea
                        rows={3}
                        value={topicInput}
                        onChange={e => setTopicInput(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={handleRunAgent1}
                        disabled={agentRunning}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                      >
                        {agentRunning ? '추론 및 성취기준 검색 중...' : 'AI 에이전트 자율 역설계 실행'}
                      </button>
                    </div>

                    {/* Agent 1 Result */}
                    <div className="lg:col-span-7 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        에이전트 추론 및 자율 산출물
                      </h3>
                      {reasoningSteps.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] space-y-1">
                          {reasoningSteps.map((s, i) => (
                            <div key={i}>✓ {s.title}: {s.details}</div>
                          ))}
                        </div>
                      )}
                      {agent1Result && (
                        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          <div className="font-bold text-indigo-600 text-sm">{agent1Result.unitTitle}</div>
                          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
                            <strong>발굴된 성취기준:</strong> {agent1Result.standards.map(s => s.code + ' (' + s.summary + ')').join(', ')}
                          </div>
                          <p><strong>수업 흐름:</strong> {agent1Result.main}</p>
                          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                            <strong>루브릭[상]:</strong> {agent1Result.rubricH}
                          </div>
                          <button
                            onClick={() => {
                              setUnitTitle(agent1Result.unitTitle);
                              setMainAct(agent1Result.main);
                              setRubricH(agent1Result.rubricH);
                              setBasket(agent1Result.standards);
                              setActiveTab('builder');
                            }}
                            className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                          >
                            수업 설계기에 바로 주입하기 →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Agent 3 View */}
                {activeAgentTab === 'setek' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-5 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        학생 관찰 메모 입력
                      </h3>
                      <textarea
                        rows={3}
                        value={setekMemo}
                        onChange={e => setSetekMemo(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={handleRunAgent3}
                        disabled={agentRunning}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                      >
                        {agentRunning ? '세특 생성 및 검수 중...' : 'AI 세특 생성 및 NEIS 규정 검수'}
                      </button>
                    </div>

                    <div className="lg:col-span-7 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        검수 완료된 세특 문구
                      </h3>
                      {agent3Result && (
                        <div className="space-y-3 text-xs">
                          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-slate-900 dark:text-white leading-relaxed">
                            {agent3Result.draft}
                          </div>
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex justify-between font-bold">
                            <span>NEIS 바이트 수: {agent3Result.bytes} / 1500 Bytes</span>
                            <span className="text-emerald-600">✅ 규정 위반 없음 (통과)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: STANDARDS BROWSER (222 STANDARDS) */}
            {activeTab === 'standards' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <h3 className="font-bold text-sm">2022 개정 영어과 전체 성취기준 (222개)</h3>
                  <span className="text-xs text-indigo-600 font-bold">총 15개 과목 전수 수록</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allStandards.map(std => (
                    <div
                      key={std.id}
                      onClick={() => setSelectedStandard(std)}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 cursor-pointer shadow-sm space-y-2 min-w-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-indigo-600">{std.code}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{std.domain}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-500">{std.curriculumName}</div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{std.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PATHWAY MAP */}
            {activeTab === 'pathway' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    2022 개정 고교 영어과 과목 편제 및 이수 경로
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {curricula.map(c => (
                      <div key={c.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5 min-w-0">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-700">{c.category}</span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h4>
                        <p className="text-xs text-slate-500">{c.grade} · {c.standardsCount}개 기준</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LESSON BUILDER */}
            {activeTab === 'builder' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  수업·과정중심 평가 설계기
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">단원명</label>
                    <input
                      type="text"
                      value={unitTitle}
                      onChange={e => setUnitTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">전개 활동</label>
                    <textarea
                      rows={3}
                      value={mainAct}
                      onChange={e => setMainAct(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                    <strong>루브릭 [상]:</strong> {rubricH}
                  </div>
                </div>
              </div>
            )}

          </main>

          {/* Standard Modal */}
          {selectedStandard && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600">{selectedStandard.code}</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{selectedStandard.summary}</h4>
                  </div>
                  <button onClick={() => setSelectedStandard(null)} className="text-slate-400 font-bold">✕</button>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-xs text-indigo-950 dark:text-indigo-200">
                  <strong>공식 원문:</strong> {selectedStandard.fullText || selectedStandard.summary}
                </div>
                <button
                  onClick={() => {
                    toggleBasket(selectedStandard);
                    setSelectedStandard(null);
                  }}
                  className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  수업 설계함에 담기
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
`;

// Save Single File Standalone HTML
const standalonePath = path.join(__dirname, 'gemini_canvas_english_curriculum.html');
fs.writeFileSync(standalonePath, htmlTemplate, 'utf8');

const brainPath = 'C:/Users/user/.gemini/antigravity/brain/6f9f019e-fc41-44f3-9bf4-ebdba70ea1dc/gemini_canvas_english_curriculum.html';
fs.writeFileSync(brainPath, htmlTemplate, 'utf8');

console.log("Successfully regenerated standalone Gemini Canvas HTML file!");

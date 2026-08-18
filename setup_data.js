const fs = require('fs');
const path = require('path');

const srcDataDir = 'c:/Users/user/Desktop/Antigravity/0817 curriculum/src/data';
if (!fs.existsSync(srcDataDir)) {
  fs.mkdirSync(srcDataDir, { recursive: true });
}

const rawData = JSON.parse(fs.readFileSync('c:/Users/user/Desktop/Antigravity/0817 curriculum/english_curriculum_data.json', 'utf8'));

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

const fileContent = `export const stats = ${JSON.stringify(rawData.stats, null, 2)};
export const curricula = ${JSON.stringify(rawData.curricula, null, 2)};
export const allStandards = ${JSON.stringify(rawData.allStandards, null, 2)};
export const courseRelations = ${JSON.stringify(rawData.courseRelations, null, 2)};
export const transitions = ${JSON.stringify(rawData.transitions, null, 2)};
export const revisionHighlights = ${JSON.stringify(revisionHighlights, null, 2)};
export const trackPresets = ${JSON.stringify(trackPresets, null, 2)};
export const quizzes = ${JSON.stringify(quizzes, null, 2)};

export default {
  stats,
  curricula,
  allStandards,
  courseRelations,
  transitions,
  revisionHighlights,
  trackPresets,
  quizzes
};
`;

fs.writeFileSync(path.join(srcDataDir, 'curriculumData.js'), fileContent, 'utf8');
console.log("Successfully created c:/Users/user/Desktop/Antigravity/0817 curriculum/src/data/curriculumData.js!");

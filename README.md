# 🎓 2022 개정 중·고등학교 영어과 교육과정 에이전틱 AI 러닝맵 포털
> **2022 Revised National English Curriculum Learning Map & 4 Autonomous Agents Portal**

대한민국 2022 개정 교육과정 중·고등학교 영어과 **15개 과목 전수**와 **222개 성취기준**, 세부 학습 주제 및 평가 문항 데이터를 기반으로 한 교사용 인터랙티브 러닝맵 및 **4대 자율형 에이전틱 AI 코파일럿 포털**입니다.

---

## 🌟 주요 핵심 기능

### 1. 🤖 4대 자율 에이전트 (Autonomous AI Agents)
- **에이전트 1: 자율형 교육과정 역설계(Backwards Design) 수업 플래너**
  - 자연어 주제 입력 시 222개 성취기준 DB를 자율 도구(Tool Calling)로 검색하여 4차시 계획, 상/중/하 루브릭, 에듀테크 매핑 및 수업 설계기 자동 주입.
- **에이전트 2: 학생 진로 맞춤형 고교 3개년 과목 설계 어드바이저**
  - 희망 전공(의약학, AI/SW, 경영, 미디어 등)에 따른 5개 권장 과목 위계 로드맵 및 학년별 세특 탐구 과제 3종 제안.
- **에이전트 3: AI 세특 스케치 & 기재 규정 검수기 (Compliance Critic)**
  - 거친 관찰 메모로부터 성취기준 연계 상/중/하 격식체(~함) 세특 생성, 교육부 기재 금지어 필터링 및 실시간 NEIS 바이트(1500Bytes) 계측.
- **에이전트 4: 성취기준 맞춤형 수행평가 과제 & 수능형 지문 제작기**
  - 성취기준 기반 CEFR B1/B2 수준 영문 지문 자율 생성, 수능형 5지선다 객관식(해설/해석 포함) 또는 서술형 수행평가지 및 채점 루브릭 산출.
- **실시간 자율 추론 시각화 (Reasoning Visualizer)**: 에이전트의 단계별 사고 과정(Planning → Tool Calling → Generation → Critic)을 투명하게 확인.

### 2. 🧭 과목 로드맵 & 4대 진로 트랙 시뮬레이터
- 중학교(1과목) → 고교 공통(4과목) → 일반선택(4과목) → 진로선택(4과목) → 융합선택(2과목)의 위계 체계 시각화
- 인문/어문, 이공/의약학, 실용 비즈니스, 기초 보정 4대 트랙 프리셋 필터 제공

### 3. 📋 성취기준 222개 전수 다차원 탐색기
- 15개 과목 222개 성취기준 전수의 공식 원문, 교육부 고시 출처, 세부 학습 주제, 관찰 증거 및 평가 문항 인스펙터
- 카드형 / 표 테이블형 뷰 전환, 실시간 다중 필터링 및 복사 기능

### 4. 🔀 중→고 학습 연계 전이 & 과목 1:1 비교기
- 중학 기초 역량에서 고교 심화 과목으로의 3단계 발전 흐름 및 교수 팁 안내
- 선택한 2개 과목의 성취수준 및 난이도 좌우 1:1 비교

### 5. ✨ 성취기준 기반 수업·평가 설계기
- 성취기준 장바구니 담기, 도입-전개-정리 차시 계획, 과정중심 상/중/하 루브릭 작성 및 마크다운/인쇄 PDF 출력

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Design**: Pretendard Typography, Dark/Light Mode, Fully Responsive (100% Zoom Optimized)
- **Engine**: Client-Side Standalone ReAct Agentic Engine (No External API Required)
- **Data Source**: 대한민국 교육부 고시 제2022-33호 별책 & `raphysicst-create/korean-secondary-learning-map-mcp` (MIT License)

---

## 🚀 실행 방법 (Getting Started)

### 방법 A: Node.js / Vite 로컬 개발 서버 실행
```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 시작
npm run dev

# 3. 브라우저에서 http://localhost:3000 접속
```

### 방법 B: Gemini Canvas 또는 단일 HTML 파일로 즉시 실행
- 별도의 Node 설치 없이 루트 디렉토리의 **`gemini_canvas_english_curriculum.html`** 파일을 브라우저로 더블클릭하거나, 코드를 복사하여 **Gemini Canvas (제미나 캔버스)**에 붙여넣으면 즉시 완벽히 동작합니다.

---

## 📄 라이선스 (License)

This project is licensed under the [MIT License](LICENSE).
공공누리 제1유형(출처표시) 대한민국 교육부 2022 개정 교육과정 고시 자료를 활용하였습니다.

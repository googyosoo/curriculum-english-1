import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Printer, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Wand2,
  RefreshCw,
  Layers,
  ArrowRight,
  Bot
} from 'lucide-react';
import { allStandards } from '../data/curriculumData';

export default function LessonBuilder({ 
  basket, 
  setBasket, 
  onGoToStandards, 
  importedLessonPlan,
  onGoToAgentStudio
}) {
  const [unitTitle, setUnitTitle] = useState('글로벌 환경 문제와 지속 가능한 미래를 위한 영어 프로젝트');
  const [gradeLevel, setGradeLevel] = useState('고등학교 1학년 (공통영어1/2)');
  const [classHours, setClassHours] = useState('4차시 블렌디드 프로젝트');
  const [copied, setCopied] = useState(false);

  // Lesson Plan States
  const [introduction, setIntroduction] = useState('기후 변화 관련 짧은 영어 인포그래픽 영상을 시청하고 핵심 쟁점에 대해 브레인스토밍하기');
  const [mainActivity, setMainActivity] = useState('모둠별로 환경 관련 영문 기사를 비판적으로 독해하고, 지속 가능한 해결 방안을 담은 영어 카드뉴스 및 제안서 작성하기');
  const [conclusion, setConclusion] = useState('작성한 제안서를 모둠별로 발표하고, 동료 평가 루브릭을 활용하여 상호 피드백 주고받기');
  const [edutechTool, setEdutechTool] = useState('Canva (영문 카드뉴스 제작), Padlet (동료 평가 공유), 생성형 AI (영작 문맥 교정)');

  // Rubric States
  const [rubricHigh, setRubricHigh] = useState('다양한 매체 자료의 세부 정보와 필자의 의도를 정확히 파악하고, 논리적인 근거를 바탕으로 자신의 의견을 유창하고 타당한 영어 문장으로 명확히 표현함.');
  const [rubricMid, setRubricMid] = useState('매체 자료의 주요 내용을 대체로 이해하며, 정형화된 표현과 기본 어휘를 활용하여 자신의 생각이나 계획을 비교적 적절한 영어로 전달함.');
  const [rubricLow, setRubricLow] = useState('교사의 스캐폴딩과 단어 단서의 도움을 받아 글의 기본 사실적 정보를 파악하고, 간단한 단어 수준의 문장으로 의견을 표현함.');

  // Setek Guidelines
  const [setekPoints, setSetekPoints] = useState('매체 텍스트 분석 과정에서 비판적 사고력을 발휘하여 필자의 숨은 의도를 포착하고, 모둠 내 환경 제안서 영작 시 창의적인 어휘와 명확한 접속사를 활용하여 설득력 있는 문장을 구성함.');

  // Handle imported data from Agent 1
  useEffect(() => {
    if (importedLessonPlan) {
      if (importedLessonPlan.unitTitle) setUnitTitle(importedLessonPlan.unitTitle);
      if (importedLessonPlan.gradeLevel) setGradeLevel(importedLessonPlan.gradeLevel);
      if (importedLessonPlan.classHours) setClassHours(importedLessonPlan.classHours);
      if (importedLessonPlan.introduction) setIntroduction(importedLessonPlan.introduction);
      if (importedLessonPlan.mainActivity) setMainActivity(importedLessonPlan.mainActivity);
      if (importedLessonPlan.conclusion) setConclusion(importedLessonPlan.conclusion);
      if (importedLessonPlan.edutechTool) setEdutechTool(importedLessonPlan.edutechTool);
      if (importedLessonPlan.rubrics) {
        if (importedLessonPlan.rubrics.high) setRubricHigh(importedLessonPlan.rubrics.high);
        if (importedLessonPlan.rubrics.mid) setRubricMid(importedLessonPlan.rubrics.mid);
        if (importedLessonPlan.rubrics.low) setRubricLow(importedLessonPlan.rubrics.low);
      }
      if (importedLessonPlan.setekGuideline) setSetekPoints(importedLessonPlan.setekGuideline);
      if (importedLessonPlan.selectedStandards && importedLessonPlan.selectedStandards.length > 0) {
        setBasket(importedLessonPlan.selectedStandards);
      }
    }
  }, [importedLessonPlan]);

  // Auto-generate helper based on basket
  const handleAutoGenerate = () => {
    if (basket.length === 0) return;
    const stdNames = basket.map(b => b.summary).join(', ');
    const stdCodes = basket.map(b => b.code).join(', ');

    setUnitTitle(`[${basket[0].curriculumName}] 성취기준 연계 역량 중심 영어 프로젝트`);
    setIntroduction(`[도입] ${basket[0].summary}와 연계하여 실생활 관련 멀티미디어 자료를 활용한 질문 던지기 및 배경지식 활성화`);
    setMainActivity(`[전개] 성취기준(${stdCodes})을 바탕으로 학습자가 텍스트를 심층 분석하고, 모둠별 협력 탐구를 통해 실제적 결과물(보고서, 발표 자료 등) 산출`);
    setConclusion(`[정리] 산출물 공유 및 자기평가·동료평가를 통한 메타인지적 학습 성찰`);
    
    setRubricHigh(`성취기준(${stdCodes})의 모든 요소를 충실히 달성하여 텍스트의 심층적 맥락을 완벽히 이해하고 창의적·논리적으로 결과물을 영어로 표현함.`);
    setRubricMid(`성취기준의 핵심 요소를 대체로 이해하고 기본 표현을 활용하여 과업을 성실히 수행함.`);
    setRubricLow(`안내와 스캐폴딩을 바탕으로 기초적인 어휘와 표현을 활용하여 과업의 일부를 완성함.`);

    setSetekPoints(`수업 중 ${stdNames} 성취를 위해 주도적으로 탐구 활동에 참여하였으며, 과업 수행 과정에서 뛰어난 문제 해결력과 유창한 언어 표현 역량을 발휘함.`);
  };

  const handleRemoveFromBasket = (code) => {
    setBasket(basket.filter(b => b.code !== code));
  };

  const handleClearBasket = () => {
    setBasket([]);
  };

  const handleLoadSample = () => {
    const sampleCodes = ['[10공영1-01-01]', '[10공영1-02-02]'];
    const samples = allStandards.filter(s => sampleCodes.includes(s.code));
    setBasket(samples);
  };

  const handleCopyMarkdown = () => {
    const md = `# [2022 개정 영어과 수업 및 과정중심 평가 계획서]

## 1. 수업 개요
- **단원명**: ${unitTitle}
- **대상 및 차시**: ${gradeLevel} / ${classHours}
- **연계 성취기준 (${basket.length}개)**:
${basket.map(b => `  - **${b.code}** [${b.curriculumName} - ${b.domain}] ${b.summary}`).join('\n')}

---

## 2. 교수·학습 활동 설계
- **도입 (Introduction)**: ${introduction}
- **전개 (Main Activity)**: ${mainActivity}
- **정리 (Conclusion)**: ${conclusion}
- **활용 에듀테크 / AI 도구**: ${edutechTool}

---

## 3. 과정중심 평가 루브릭 (성취수준별 도달 기준)
- **[상 (High)]**: ${rubricHigh}
- **[중 (Mid)]**: ${rubricMid}
- **[하 (Low)]**: ${rubricLow}

---

## 4. 학교생활기록부 교과 세특 관찰 가이드라인
> ${setekPoints}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              교사용 인터랙티브 수업·평가·세특 설계 빌더
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              성취기준 기반 원스톱 수업 & 과정중심 평가 플래너
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              원하는 성취기준을 담고 차시별 교수학습 활동과 성취수준 루브릭(상/중/하), 생기부 세특 기재 포인트를 손쉽게 기획하고 내보내세요.
            </p>
          </div>

          <button
            onClick={onGoToAgentStudio}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all shrink-0"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>AI 에이전트에게 자동 기획 맡기기</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={handleAutoGenerate}
            disabled={basket.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>선택 성취기준 기반 자동 생성</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            <span>샘플 성취기준 불러오기</span>
          </button>
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '마크다운 복사 완료!' : '마크다운 복사'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 4 Cols: Selected Standards Basket */}
        <div className="lg:col-span-4 min-w-0 space-y-4 no-print">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  설계함에 담긴 성취기준 ({basket.length}개)
                </h4>
              </div>
              {basket.length > 0 && (
                <button
                  onClick={handleClearBasket}
                  className="text-xs font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> 비우기
                </button>
              )}
            </div>

            {basket.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-3">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  아직 담긴 성취기준이 없습니다.<br />
                  성취기준 탐색기에서 <strong>'+ 담기'</strong> 버튼을 누르거나 <strong>[AI 에이전트 스튜디오]</strong>에서 자동 기획을 실행하세요.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={onGoToAgentStudio}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI 에이전트 자율 기획 실행</span>
                  </button>
                  <button
                    onClick={onGoToStandards}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100"
                  >
                    <span>성취기준 탐색기로 이동</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {basket.map((std) => (
                  <div
                    key={std.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 rounded text-[11px]">
                        {std.code}
                      </span>
                      <button
                        onClick={() => handleRemoveFromBasket(std.code)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="제거"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      [{std.curriculumName} · {std.domain}]
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                      {std.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {basket.length > 0 && (
              <button
                onClick={onGoToStandards}
                className="w-full py-2 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 성취기준 추가로 담기
              </button>
            )}

          </div>
        </div>

        {/* Right 8 Cols: Editable Lesson Plan Document */}
        <div className="lg:col-span-8 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-sm space-y-6">
          
          {/* Section 1: Meta Information */}
          <div className="space-y-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              1. 수업 개요 및 목표
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  단원명 / 프로젝트명
                </label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  대상 학년 / 교과목
                </label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  차시 구성
                </label>
                <input
                  type="text"
                  value={classHours}
                  onChange={(e) => setClassHours(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Instruction Flow */}
          <div className="space-y-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              2. 단계별 교수·학습 활동 설계
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  도입 (Introduction & Warm-up)
                </label>
                <textarea
                  rows={2}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  전개 (Main Task & Collaborative Learning)
                </label>
                <textarea
                  rows={3}
                  value={mainActivity}
                  onChange={(e) => setMainActivity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  정리 및 평가 (Conclusion & Feedback)
                </label>
                <textarea
                  rows={2}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  연계 에듀테크 & 생성형 AI 도구
                </label>
                <input
                  type="text"
                  value={edutechTool}
                  onChange={(e) => setEdutechTool(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Assessment Rubric */}
          <div className="space-y-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. 과정중심 평가 루브릭 (성취수준별 도달 기준)
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  [성취수준 상 (High)]
                </span>
                <textarea
                  rows={2}
                  value={rubricHigh}
                  onChange={(e) => setRubricHigh(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-1.5">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                  [성취수준 중 (Mid)]
                </span>
                <textarea
                  rows={2}
                  value={rubricMid}
                  onChange={(e) => setRubricMid(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  [성취수준 하 (Low)]
                </span>
                <textarea
                  rows={2}
                  value={rubricLow}
                  onChange={(e) => setRubricLow(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 4: School Record (Setek) Guidelines */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              4. 학교생활기록부 교과 세특 관찰 가이드라인
            </h3>
            <textarea
              rows={3}
              value={setekPoints}
              onChange={(e) => setSetekPoints(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 text-xs text-slate-900 dark:text-white leading-relaxed font-medium"
            />
          </div>

        </div>

      </div>

    </div>
  );
}

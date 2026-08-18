import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Compass, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Send, 
  RefreshCw, 
  Copy, 
  Check,
  Zap,
  Target,
  FileCheck,
  ShieldCheck,
  Printer,
  HelpCircle,
  Award,
  Key,
  Settings,
  ExternalLink,
  Bot
} from 'lucide-react';
import { 
  runBackwardsDesignAgent, 
  runCareerPathwayAgent,
  runSetekAgent,
  runAssessmentItemAgent,
  calculateNeisBytes
} from '../services/agentEngine';
import { allStandards } from '../data/curriculumData';
import ReasoningVisualizer from './ReasoningVisualizer';

export default function AgenticStudio({ 
  onApplyToLessonBuilder, 
  onNavigateToPathway,
  initialStandardCode,
  initialAgent
}) {
  const [activeAgent, setActiveAgent] = useState(initialAgent || 'backwards');
  const [isRunning, setIsRunning] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [copied, setCopied] = useState(false);

  // Gemini API Key & Live Mode Settings
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('eng_gemini_api_key') || '');
  const [useLiveApi, setUseLiveApi] = useState(() => localStorage.getItem('eng_use_live_api') === 'true');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  // Agent 1 States (Backwards Design)
  const [topicInput, setTopicInput] = useState('생성형 AI와 디지털 윤리(저작권 및 알고리즘 편향)');
  const [gradeInput, setGradeInput] = useState('고등학교 1학년 (공통영어2)');
  const [hoursInput, setHoursInput] = useState('4차시 블렌디드 프로젝트');
  const [lessonResult, setLessonResult] = useState(null);

  // Agent 2 States (Career Pathway)
  const [majorInput, setMajorInput] = useState('의약학 및 생명공학 계열');
  const [careerInput, setCareerInput] = useState('신약 개발 연구원 및 바이오 의공학자');
  const [academicLevel, setAcademicLevel] = useState('상위권 (수시 학생부종합전형 대비)');
  const [pathwayResult, setPathwayResult] = useState(null);

  // Agent 3 States (Setek Sketch & Compliance)
  const [setekRawMemo, setSetekRawMemo] = useState('환경 관련 영문 기사 읽고 미세플라스틱 문제에 대해 모둠 발표함. 어휘력이 좋고 논리적 질문을 잘함.');
  const [setekStandardCode, setSetekStandardCode] = useState(initialStandardCode || '[10공영1-02-02]');
  const [studentLevel, setStudentLevel] = useState('상');
  const [setekResult, setSetekResult] = useState(null);

  // Agent 4 States (Assessment Task & Exam Item)
  const [assessmentStandardCode, setAssessmentStandardCode] = useState(initialStandardCode || '[10공영1-01-05]');
  const [itemType, setItemType] = useState('suneung');
  const [themeInput, setThemeInput] = useState('디지털 문해력과 인공지능 윤리');
  const [assessmentResult, setAssessmentResult] = useState(null);

  useEffect(() => {
    if (initialStandardCode) {
      setSetekStandardCode(initialStandardCode);
      setAssessmentStandardCode(initialStandardCode);
    }
    if (initialAgent) {
      setActiveAgent(initialAgent);
    }
  }, [initialStandardCode, initialAgent]);

  const handleSaveApiKey = () => {
    localStorage.setItem('eng_gemini_api_key', tempApiKey.trim());
    localStorage.setItem('eng_use_live_api', tempApiKey.trim() ? 'true' : 'false');
    setApiKey(tempApiKey.trim());
    setUseLiveApi(!!tempApiKey.trim());
    setShowSettingsModal(false);
  };

  const getAgentConfig = () => ({
    apiKey,
    useLiveApi: useLiveApi && !!apiKey
  });

  // Agent 1 Run
  const handleRunAgent1 = async () => {
    setIsRunning(true);
    setReasoningSteps([]);
    setLessonResult(null);

    const updateStep = (newStep) => {
      setReasoningSteps(prev => {
        const filtered = prev.filter(s => s.step !== newStep.step);
        return [...filtered, newStep].sort((a, b) => a.step - b.step);
      });
    };

    try {
      const result = await runBackwardsDesignAgent({
        topic: topicInput,
        gradeLevel: gradeInput,
        classHours: hoursInput
      }, updateStep, getAgentConfig());
      setLessonResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  // Agent 2 Run
  const handleRunAgent2 = async () => {
    setIsRunning(true);
    setReasoningSteps([]);
    setPathwayResult(null);

    const updateStep = (newStep) => {
      setReasoningSteps(prev => {
        const filtered = prev.filter(s => s.step !== newStep.step);
        return [...filtered, newStep].sort((a, b) => a.step - b.step);
      });
    };

    try {
      const result = await runCareerPathwayAgent({
        majorInterest: majorInput,
        targetCareer: careerInput,
        academicLevel: academicLevel
      }, updateStep, getAgentConfig());
      setPathwayResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  // Agent 3 Run (Setek)
  const handleRunAgent3 = async () => {
    setIsRunning(true);
    setReasoningSteps([]);
    setSetekResult(null);

    const updateStep = (newStep) => {
      setReasoningSteps(prev => {
        const filtered = prev.filter(s => s.step !== newStep.step);
        return [...filtered, newStep].sort((a, b) => a.step - b.step);
      });
    };

    try {
      const result = await runSetekAgent({
        rawMemo: setekRawMemo,
        standardCode: setekStandardCode,
        studentLevel: studentLevel
      }, updateStep, getAgentConfig());
      setSetekResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  // Agent 4 Run (Assessment Item)
  const handleRunAgent4 = async () => {
    setIsRunning(true);
    setReasoningSteps([]);
    setAssessmentResult(null);

    const updateStep = (newStep) => {
      setReasoningSteps(prev => {
        const filtered = prev.filter(s => s.step !== newStep.step);
        return [...filtered, newStep].sort((a, b) => a.step - b.step);
      });
    };

    try {
      const result = await runAssessmentItemAgent({
        standardCode: assessmentStandardCode,
        itemType: itemType,
        topicTheme: themeInput
      }, updateStep, getAgentConfig());
      setAssessmentResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApplyToBuilder = () => {
    if (lessonResult && onApplyToLessonBuilder) {
      onApplyToLessonBuilder(lessonResult);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header & AI Engine Indicator */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              2022 개정 영어과 에이전틱 AI 코파일럿 스튜디오
            </div>

            {/* AI Engine Status & Key Setting Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px]">
                <span className={`w-2 h-2 rounded-full ${useLiveApi && apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
                <span className="font-bold text-slate-200">
                  {useLiveApi && apiKey ? '✨ Gemini 1.5 실시간 AI 모드' : '⚡ 고속 스마트 동적 엔진'}
                </span>
              </div>
              <button
                onClick={() => {
                  setTempApiKey(apiKey);
                  setShowSettingsModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px] transition-all"
                title="AI 엔진 설정 (Gemini API 키)"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{apiKey ? 'API 변경' : 'Gemini 연동'}</span>
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            자율형 교육과정 에이전트 4대 시스템 (4 Autonomous Agents)
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
            교사의 자연어 요구를 스스로 분석하여 <strong>222개 성취기준 DB를 자율 도구(Tool Calling)로 검색</strong>하고, 다단계 추론(ReAct)과 자가 검증(Critic)을 거쳐 수업·과목·세특·평가를 완성합니다.
          </p>

          {/* 4 Agent Switcher Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => {
                setActiveAgent('backwards');
                setReasoningSteps([]);
              }}
              className={`flex items-center gap-1.5 p-3 rounded-xl text-xs font-bold transition-all text-left min-w-0 ${
                activeAgent === 'backwards'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Wand2 className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] opacity-75">추천 1순위</span>
                <span className="truncate">역설계 수업 플래너</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveAgent('pathway');
                setReasoningSteps([]);
              }}
              className={`flex items-center gap-1.5 p-3 rounded-xl text-xs font-bold transition-all text-left min-w-0 ${
                activeAgent === 'pathway'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-300 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] opacity-75">추천 2순위</span>
                <span className="truncate">3개년 진로 과목 설계</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveAgent('setek');
                setReasoningSteps([]);
              }}
              className={`flex items-center gap-1.5 p-3 rounded-xl text-xs font-bold transition-all text-left min-w-0 ${
                activeAgent === 'setek'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <FileCheck className="w-4 h-4 text-teal-300 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] opacity-75">추천 3순위</span>
                <span className="truncate">세특 스케치 & 검수</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveAgent('assessment');
                setReasoningSteps([]);
              }}
              className={`flex items-center gap-1.5 p-3 rounded-xl text-xs font-bold transition-all text-left min-w-0 ${
                activeAgent === 'assessment'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-300'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-300 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] opacity-75">추천 4순위</span>
                <span className="truncate">수행평가 & 수능문항</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AGENT 1: Backwards Design Agent View */}
      {/* ========================================================================= */}
      {activeAgent === 'backwards' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <Wand2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">에이전트 1: 역설계 수업 플래너</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                자연어 수업 아이디어 역설계
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                원하는 어떤 주제든 자유롭게 입력하면, 에이전트가 222개 성취기준을 실시간 검색하여 4차시 계획과 루브릭을 자율 구성합니다.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">💡 추천 주제 예시 (클릭 시 자동 입력):</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setTopicInput('생성형 AI와 저작권 침해 및 딥페이크 윤리');
                    setGradeInput('고등학교 1학년 (공통영어2)');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  🤖 AI 딥페이크 윤리 (고1)
                </button>
                <button
                  onClick={() => {
                    setTopicInput('탄소 국경세 도입과 글로벌 환경 정책 제안');
                    setGradeInput('고등학교 2학년 (영어 독해와 작문)');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  🌍 탄소국경세 제안서 (고2)
                </button>
                <button
                  onClick={() => {
                    setTopicInput('우주 탐사와 인류의 미래 거주지 개척');
                    setGradeInput('고등학교 3학년 (심화 영어)');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  🚀 우주 탐사 (고3)
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  수업 주제 / 단원 핵심 테마 (자유 입력)
                </label>
                <textarea
                  rows={2}
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="예: K-컬처와 글로벌 문화 융합, 기후 위기와 에너지 전환 등"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    대상 학년 / 교과
                  </label>
                  <input
                    type="text"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    차시 구성
                  </label>
                  <input
                    type="text"
                    value={hoursInput}
                    onChange={(e) => setHoursInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRunAgent1}
              disabled={isRunning || !topicInput.trim()}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isRunning ? '에이전트가 맞춤형 추론 중...' : 'AI 에이전트 자율 역설계 실행하기'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 min-w-0 space-y-6">
            <ReasoningVisualizer steps={reasoningSteps} isRunning={isRunning} />

            {lessonResult && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 shadow-md space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-1 inline-block">
                      에이전트 자율 산출물
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {lessonResult.unitTitle}
                    </h4>
                  </div>

                  <button
                    onClick={handleApplyToBuilder}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all group shrink-0"
                  >
                    <span>수업 설계기에 주입</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    📌 에이전트가 도구로 발굴한 최적 성취기준 ({lessonResult.selectedStandards.length}건):
                  </span>
                  <div className="space-y-2">
                    {lessonResult.selectedStandards.map((std) => (
                      <div
                        key={std.id}
                        className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {std.code}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {std.curriculumName} · {std.domain}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                          {std.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    📖 단계별 교수·학습 흐름:
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-slate-700 dark:text-slate-300">
                    <p><strong>도입:</strong> {lessonResult.introduction}</p>
                    <p><strong>전개:</strong> {lessonResult.mainActivity}</p>
                    <p><strong>정리:</strong> {lessonResult.conclusion}</p>
                    <p className="text-indigo-600 dark:text-indigo-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <strong>에듀테크 도구:</strong> {lessonResult.edutechTool}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    📊 과정중심 평가 성취수준 루브릭 (상/중/하):
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200">
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">[상]</strong>
                      {lessonResult.rubrics.high}
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200">
                      <strong className="text-blue-700 dark:text-blue-400 block mb-0.5">[중]</strong>
                      {lessonResult.rubrics.mid}
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      <strong className="text-slate-600 dark:text-slate-400 block mb-0.5">[하]</strong>
                      {lessonResult.rubrics.low}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-950 dark:text-purple-200">
                  <strong className="text-purple-700 dark:text-purple-400 block mb-1">
                    ✨ 학교생활기록부 교과 세특 관찰 포인트:
                  </strong>
                  {lessonResult.setekGuideline}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT 2: Career Pathway Advisor View */}
      {/* ========================================================================= */}
      {activeAgent === 'pathway' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">에이전트 2: 3개년 진로 과목 설계</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                학생 진로 맞춤 과목 & 탐구 설계
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                학생의 희망 전공과 진로 목표를 자유롭게 입력하면, 3개년 최적 과목 이수 조합과 학년별 세특 탐구 과제를 자율 설계합니다.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">💡 추천 진로 예시:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setMajorInput('의약학 및 바이오 생명과학');
                    setCareerInput('글로벌 신약 개발 연구원');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                >
                  🧬 의약학/바이오
                </button>
                <button
                  onClick={() => {
                    setMajorInput('인공지능 및 자율주행 소프트웨어공학');
                    setCareerInput('AI 알고리즘 엔지니어');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                >
                  💻 AI / 소프트웨어
                </button>
                <button
                  onClick={() => {
                    setMajorInput('국제통상 및 글로벌 지속가능경영');
                    setCareerInput('글로벌 공급망 ESG 컨설턴트');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                >
                  📊 국제통상/경영
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  희망 전공 분야 (자유 입력)
                </label>
                <input
                  type="text"
                  value={majorInput}
                  onChange={(e) => setMajorInput(e.target.value)}
                  placeholder="예: 항공우주공학, 미디어커뮤니케이션, 심리학 등"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  구체적 진로 목표 / 희망 직업
                </label>
                <input
                  type="text"
                  value={careerInput}
                  onChange={(e) => setCareerInput(e.target.value)}
                  placeholder="예: 항공기 제어 시스템 개발자, 글로벌 다큐멘터리 PD 등"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleRunAgent2}
              disabled={isRunning || !majorInput.trim()}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all"
            >
              <Target className="w-4 h-4 text-emerald-300" />
              <span>{isRunning ? '3개년 과목 위계 자율 분석 중...' : '3개년 과목 설계 어드바이저 실행하기'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 min-w-0 space-y-6">
            <ReasoningVisualizer steps={reasoningSteps} isRunning={isRunning} />

            {pathwayResult && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-800 p-6 shadow-md space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 mb-1 inline-block">
                      3개년 진로 맞춤 포트폴리오
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      [{pathwayResult.major}] 추천 이수 로드맵
                    </h4>
                  </div>

                  <button
                    onClick={onNavigateToPathway}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all group"
                  >
                    <span>과목 로드맵에서 확인</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 text-xs">
                  <strong className="text-purple-700 dark:text-purple-300 block mb-1">
                    🎯 전공 요구 핵심 영어 역량:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {pathwayResult.keyCompetencies.map((comp, idx) => (
                      <li key={idx}>{comp}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    🗺️ 학년별 권장 영어 과목 이수 순서 (총 5개 과목):
                  </span>
                  <div className="space-y-2">
                    {pathwayResult.recommendedCourses.map((c, idx) => (
                      <div
                        key={c.courseId || idx}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-[11px] shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {c.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                                {c.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {c.grade} · {c.reason}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          {c.credits}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    ✨ 학년별 세특 연계 심화 탐구 프로젝트 과제:
                  </span>
                  <div className="space-y-2">
                    {pathwayResult.yearlyResearchTopics.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1"
                      >
                        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                          <span>[{item.grade} · {item.course}]</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200">
                          {item.topic}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT 3: Setek Sketch & Compliance Critic View */}
      {/* ========================================================================= */}
      {activeAgent === 'setek' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <FileCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">에이전트 3: 세특 스케치 & 규정 검수기</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                관찰 메모 기반 세특 생성 & 검수
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                자유로운 학생 관찰 메모를 입력하면, 성취기준과 매핑하여 상/중/하 격식체 세특을 생성하고 NEIS 바이트 및 기재 금지어를 자동 검수합니다.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">💡 관찰 메모 예시 (클릭 시 입력):</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setSetekRawMemo('미세플라스틱 해양 오염 영문 칼럼을 읽고 도표와 통계를 분석하여 모둠원들에게 영어로 브리핑함.');
                    setSetekStandardCode('[10공영1-02-01]');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  🌱 미세플라스틱 통계 브리핑
                </button>
                <button
                  onClick={() => {
                    setSetekRawMemo('AI 챗봇으로 영작 문법 오류를 스스로 교정하고 5단락 영어 에세이를 논리적으로 완성함.');
                    setSetekStandardCode('[12영독02-06]');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  ✍️ 영작 퇴고 & AI 활용
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  교사의 학생 관찰 메모 (자유 입력)
                </label>
                <textarea
                  rows={3}
                  value={setekRawMemo}
                  onChange={(e) => setSetekRawMemo(e.target.value)}
                  placeholder="예: 영어 발표 시 전달력이 우수하고 어려운 어휘를 문맥에 맞게 잘 활용함."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    연계 성취기준 선택
                  </label>
                  <select
                    value={setekStandardCode}
                    onChange={(e) => setSetekStandardCode(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {allStandards.slice(0, 60).map(s => (
                      <option key={s.id} value={s.code}>
                        {s.code} [{s.curriculumName}] {s.summary.slice(0, 18)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    학생 성취수준
                  </label>
                  <select
                    value={studentLevel}
                    onChange={(e) => setStudentLevel(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="상">상 수준 (심화 확장)</option>
                    <option value="중">중 수준 (성실 수행)</option>
                    <option value="하">하 수준 (스캐폴딩 성장)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunAgent3}
              disabled={isRunning || !setekRawMemo.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
            >
              <FileCheck className="w-4 h-4 text-teal-200" />
              <span>{isRunning ? '세특 생성 및 기재 규정 검수 중...' : 'AI 세특 생성 및 NEIS 규정 검수 실행'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 min-w-0 space-y-6">
            <ReasoningVisualizer steps={reasoningSteps} isRunning={isRunning} />

            {setekResult && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6 shadow-md space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mb-1 inline-block">
                      성취기준 연계 세특 산출물 ({setekResult.selectedStandard.code})
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {setekResult.selectedStandard.curriculumName} · {setekResult.selectedStandard.domain} 영역
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCopyText(setekResult.drafts[studentLevel === '상' ? 'high' : studentLevel === '중' ? 'mid' : 'low'])}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '복사됨!' : '세특 복사'}</span>
                  </button>
                </div>

                {/* Level Tabs */}
                <div className="flex gap-2">
                  {['상', '중', '하'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setStudentLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        studentLevel === lvl
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      [{lvl} 수준 문구]
                    </button>
                  ))}
                </div>

                {/* Current Draft Display */}
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                  {setekResult.drafts[studentLevel === '상' ? 'high' : studentLevel === '중' ? 'mid' : 'low']}
                </div>

                {/* NEIS Byte & Compliance Critic Report Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      NEIS 규정 및 바이트 수 계측 리포트
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {calculateNeisBytes(setekResult.drafts[studentLevel === '상' ? 'high' : studentLevel === '중' ? 'mid' : 'low'])} / 1500 Bytes
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">기재 금지어 필터링</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {setekResult.complianceReport.hasForbidden ? '⚠️ 금지어 주의' : '✅ 100% 규정 준수 (안전)'}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">어조 및 문체 검증</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        교사 시점 격식체(~함)
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT 4: Assessment Task & Exam Item Generator View */}
      {/* ========================================================================= */}
      {activeAgent === 'assessment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">에이전트 4: 수행평가 & 문항 제작기</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                성취기준 기반 맞춤 문항 출제
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                성취기준과 지문 소재를 입력하면 2022 개정 어휘 기준의 고품질 영문 지문과 수능형 5지선다 또는 서술형 수행평가지와 채점표를 자율 생성합니다.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  출제 기준 성취기준 선택
                </label>
                <select
                  value={assessmentStandardCode}
                  onChange={(e) => setAssessmentStandardCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {allStandards.slice(0, 60).map(s => (
                    <option key={s.id} value={s.code}>
                      {s.code} [{s.curriculumName}] {s.summary.slice(0, 20)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  평가 유형 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setItemType('suneung')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      itemType === 'suneung'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    수능형 5지선다 객관식
                  </button>
                  <button
                    onClick={() => setItemType('performance')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      itemType === 'performance'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    서술형 수행평가지
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  지문 주제 / 소재 (자유 입력)
                </label>
                <input
                  type="text"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  placeholder="예: 생물다양성 보존, 사이버 보안, 원격 근무 등"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleRunAgent4}
              disabled={isRunning || !themeInput.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-200" />
              <span>{isRunning ? '영문 지문 및 문항 자율 출제 중...' : '지문 생성 및 평가 문항 출제 실행'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 min-w-0 space-y-6">
            <ReasoningVisualizer steps={reasoningSteps} isRunning={isRunning} />

            {assessmentResult && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 shadow-md space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-1 inline-block">
                      {assessmentResult.generatedItem.type === 'suneung' ? '수능형 5지선다 문항' : '서술형 수행평가지'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      기준: {assessmentResult.selectedStandard.code} ({assessmentResult.selectedStandard.curriculumName})
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCopyText(assessmentResult.generatedItem.passage)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-blue-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '복사됨!' : '지문 복사'}</span>
                  </button>
                </div>

                {/* Passage */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">
                    [Reading Passage - 2022 개정 영어과 CEFR B1/B2 수준]
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                    {assessmentResult.generatedItem.passage}
                  </p>
                </div>

                {/* Suneung Questions */}
                {assessmentResult.generatedItem.type === 'suneung' ? (
                  <div className="space-y-4">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                      {assessmentResult.generatedItem.title}
                    </h5>

                    <div className="space-y-1.5 text-xs">
                      {assessmentResult.generatedItem.options.map((opt) => (
                        <div
                          key={opt.no}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            opt.isCorrect
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 font-bold text-emerald-950 dark:text-emerald-200'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] shrink-0 font-bold">
                              {opt.no}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {opt.isCorrect && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                              정답 ②
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                      <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">💡 정답 해설 및 전문 해석:</strong>
                      <p>{assessmentResult.generatedItem.explanation}</p>
                    </div>
                  </div>
                ) : (
                  /* Performance Task Instructions & Rubric */
                  <div className="space-y-4">
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                      {assessmentResult.generatedItem.title}
                    </h5>

                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs space-y-2 text-slate-800 dark:text-slate-200">
                      <strong className="text-blue-700 dark:text-blue-300 block">📝 학생 수행 과제 지시문:</strong>
                      {assessmentResult.generatedItem.taskInstructions.map((task, idx) => (
                        <div key={idx} className="pl-2 border-l-2 border-blue-400">
                          {task}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <strong className="text-slate-700 dark:text-slate-300 block">📊 교사용 과정중심 채점 기준표:</strong>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-lg">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                            <tr>
                              <th className="p-2">평가 요소</th>
                              <th className="p-2 w-16">배점</th>
                              <th className="p-2">세부 채점 기준</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {assessmentResult.generatedItem.scoringRubric.map((rub, idx) => (
                              <tr key={idx}>
                                <td className="p-2 font-bold">{rub.criteria}</td>
                                <td className="p-2 font-mono font-bold text-blue-600">{rub.points}</td>
                                <td className="p-2 text-slate-600 dark:text-slate-400">{rub.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Settings Modal (Gemini API Key Modal) */}
      {/* ========================================================================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  AI 에이전트 엔진 설정
                </h4>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                기본 탑재된 <strong>[스마트 동적 엔진]</strong>은 API 키 없이도 입력 주제에 따라 매번 완전히 다른 맞춤형 수업안과 지문을 생성합니다.
              </p>
              <p>
                더 나아가 구글의 최신 <strong>Gemini 1.5 Flash 실시간 LLM</strong>을 직접 연결하여 무제한 생성 능력을 활성화하려면 아래에 무료 Gemini API 키를 입력하세요.
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  🔑 Google Gemini API Key 입력:
                </span>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>* 키는 브라우저 로컬 저장소에만 안전하게 보관됩니다.</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5"
                  >
                    무료 API 키 발급받기 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setTempApiKey('');
                  localStorage.removeItem('eng_gemini_api_key');
                  localStorage.removeItem('eng_use_live_api');
                  setApiKey('');
                  setUseLiveApi(false);
                  setShowSettingsModal(false);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                키 초기화 (기본 엔진 복귀)
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                설정 저장
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

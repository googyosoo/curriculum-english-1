import React, { useState } from 'react';
import { 
  curricula, 
  allStandards 
} from '../data/curriculumData';
import { 
  GitMerge, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function TransitionFlow({ onSelectStandard }) {
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'receptive' | 'productive' | 'academic' | 'media'

  // Curated Pedagogical Transitions between Middle and High School
  const transitionScenarios = [
    {
      id: 'trans-1',
      category: 'receptive',
      categoryLabel: '이해 영역 (독해·청해)',
      middleStandard: {
        code: '[9영01-02]',
        summary: '친숙한 일반적 주제에 관한 담화나 글의 세부 정보를 파악하기',
        curriculum: '중학교 영어'
      },
      highStandard: {
        code: '[10공영1-01-01]',
        summary: '친숙하고 다양한 주제에 관한 말이나 글의 세부 정보를 파악하기',
        curriculum: '공통영어1'
      },
      deepeningHighStandard: {
        code: '[12영I-01-05]',
        summary: '말이나 글의 맥락을 바탕으로 어구나 문장의 함축적 의미를 추론하기',
        curriculum: '영어 I'
      },
      deepeningReason: '중학교의 단순 사실적 정보 파악에서 고교 공통영어를 거쳐, 영어I에서는 문맥 속 함축적 의미와 필자의 의도를 논리적으로 추론하는 고차원 독해로 심화 확장됩니다.',
      teachingTip: '중학교 단계에서 명시적인 단서 찾기 훈련을 충분히 한 후, 고교에서는 단락 전체의 맥락적 일관성(Coherence)과 접속 부사, 어조(Tone)를 분석하도록 지도합니다.'
    },
    {
      id: 'trans-2',
      category: 'productive',
      categoryLabel: '표현 영역 (말하기·쓰기)',
      middleStandard: {
        code: '[9영02-04]',
        summary: '자신의 경험이나 계획 또는 일이나 사건을 간단한 말이나 글로 설명하기',
        curriculum: '중학교 영어'
      },
      highStandard: {
        code: '[10공영1-02-02]',
        summary: '자신의 경험이나 계획 또는 일이나 사건을 말이나 글로 설명하기',
        curriculum: '공통영어1'
      },
      deepeningHighStandard: {
        code: '[12영독02-03]',
        summary: '포용적 태도로 자신의 의견이나 감정을 논리적인 글로 제시하기',
        curriculum: '영어 독해와 작문'
      },
      deepeningReason: '단순한 일상 경험의 나열 및 묘사에서 시작하여, 고교에서는 자신의 관점과 논거를 타당하게 구조화하여 논설문/에세이로 발전시킵니다.',
      teachingTip: '문장 단위의 영작에서 탈피하여 Topic Sentence - Supporting Details - Concluding Sentence의 5단락 에세이 구조화 프레임워크를 제공하세요.'
    },
    {
      id: 'trans-3',
      category: 'academic',
      categoryLabel: '구어 소통 & 발표/토론',
      middleStandard: {
        code: '[9영02-05]',
        summary: '상대방을 존중하는 태도로 간단한 질문을 하거나 의견을 표현하기',
        curriculum: '중학교 영어'
      },
      highStandard: {
        code: '[10공영2-02-03]',
        summary: '상대방을 배려하고 존중하는 태도로 자신의 의견이나 주장을 표현하기',
        curriculum: '공통영어2'
      },
      deepeningHighStandard: {
        code: '[12영발02-04]',
        summary: '상대방 주장의 논리를 분석하여 반대 심문하며 토론하기',
        curriculum: '영어 발표와 토론'
      },
      deepeningReason: '중학교의 기초 대화 및 질의응답이 고등학교에서는 아카데믹 프레젠테이션과 상대방의 논리적 허점을 짚어내는 학술 토론(Debate) 역량으로 진화합니다.',
      teachingTip: '상대방의 주장을 요약(Reframing)한 뒤 반론을 제기하는 의사소통 전략 표현(Signpost expressions)을 체계적으로 훈련시킵니다.'
    },
    {
      id: 'trans-4',
      category: 'media',
      categoryLabel: '디지털 & 매체 문해력',
      middleStandard: {
        code: '[9영01-09]',
        summary: '적절한 전략을 활용하여 다양한 매체로 된 말이나 글의 의미를 파악하기',
        curriculum: '중학교 영어'
      },
      highStandard: {
        code: '[10공영2-01-07]',
        summary: '적절한 전략을 활용하여 다양한 매체로 된 말이나 글의 의미를 파악하기',
        curriculum: '공통영어2'
      },
      deepeningHighStandard: {
        code: '[12미영01-01]',
        summary: '미디어 자료에 나타난 정보와 시각적 요소를 종합하여 주제와 관점을 비판적으로 분석하기',
        curriculum: '미디어 영어'
      },
      deepeningReason: '시각/청각 매체의 기초 정보 수용에서 출발하여, 미디어 텍스트의 프레이밍과 제작 의도를 비판적으로 해체·평가하고 디지털 콘텐츠로 재창작하는 역량으로 확장됩니다.',
      teachingTip: '생성형 AI, 카드뉴스, 짧은 숏폼 영상 스크립트 제작 등 실제 디지털 매체를 활용한 복합양식(Multimodal) 프로젝트 수업과 연계하세요.'
    }
  ];

  const filteredScenarios = selectedCategory === 'all'
    ? transitionScenarios
    : transitionScenarios.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-3">
          <GitMerge className="w-3.5 h-3.5" />
          중학교 ↔ 고등학교 학년군 간 학습 전이(Transitions)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          중·고등 연계 심화 발전 흐름도 & 스캐폴딩 가이드
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          중학교(7~9학년군)에서 습득한 기초 의사소통 역량이 고등학교 1학년(공통영어1·2)과 2~3학년 선택과목(일반·진로·융합)에서 어떻게 고도화되는지 핵심 연계 경로를 확인하고 교수학습 처방을 확인하세요.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            전체 연계 흐름
          </button>
          <button
            onClick={() => setSelectedCategory('receptive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'receptive'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            이해 (독해/청해) 연계
          </button>
          <button
            onClick={() => setSelectedCategory('productive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'productive'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            표현 (말하기/쓰기) 연계
          </button>
          <button
            onClick={() => setSelectedCategory('academic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'academic'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            학술 발표·토론 연계
          </button>
          <button
            onClick={() => setSelectedCategory('media')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'media'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            미디어 문해력 연계
          </button>
        </div>
      </div>

      {/* Transition Scenario Cards */}
      <div className="space-y-6">
        {filteredScenarios.map((scenario) => (
          <div 
            key={scenario.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {scenario.categoryLabel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {scenario.id}
              </span>
            </div>

            {/* 3-Step Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              
              {/* STEP 1: Middle School */}
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                      STEP 1: 중학교 기초
                    </span>
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      {scenario.middleStandard.code}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    {scenario.middleStandard.curriculum}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {scenario.middleStandard.summary}
                  </p>
                </div>
              </div>

              {/* STEP 2: High School Common */}
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                      STEP 2: 고1 공통 확장
                    </span>
                    <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                      {scenario.highStandard.code}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    {scenario.highStandard.curriculum}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {scenario.highStandard.summary}
                  </p>
                </div>
              </div>

              {/* STEP 3: High School Deepening Selection */}
              <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400">
                      STEP 3: 고2~3 선택 심화
                    </span>
                    <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                      {scenario.deepeningHighStandard.code}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    {scenario.deepeningHighStandard.curriculum}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {scenario.deepeningHighStandard.summary}
                  </p>
                </div>
              </div>

            </div>

            {/* Deepening Reason & Teacher Tip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  연계 및 심화 원리
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {scenario.deepeningReason}
                </p>
              </div>

              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  교사용 스캐폴딩 티칭 팁
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {scenario.teachingTip}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

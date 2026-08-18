import React, { useState } from 'react';
import { 
  revisionHighlights, 
  quizzes 
} from '../data/curriculumData';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  BookOpen, 
  Award, 
  ArrowRight,
  Info,
  Check
} from 'lucide-react';

export default function CurriculumGuideQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (quizId, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [quizId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = calculateScore();

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          2022 개정 영어과 핵심 총정리 & 티칭 셀프 퀴즈
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          새 교육과정 핵심 변화 한눈에 보기 & 마스터 퀴즈
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          기존 2015 교육과정과의 핵심 차이점 4가지를 명확히 이해하고, 인터랙티브 교사용 진단 퀴즈를 풀어보며 2022 개정 영어과의 주요 원리와 과목 체계를 완벽하게 마스터하세요.
        </p>
      </div>

      {/* Section 1: 4 Key Revision Highlights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            2022 개정 영어과 4대 핵심 패러다임 변화
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revisionHighlights.map((hl, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {hl.title}
                  </h4>
                </div>

                {/* Before & After comparison */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-slate-700 dark:text-slate-300">
                    <strong className="text-rose-600 dark:text-rose-400 block mb-0.5">이전 (2015 개정):</strong>
                    {hl.before}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">개정 (2022 개정):</strong>
                    {hl.after}
                  </div>
                </div>
              </div>

              {/* Pedagogical Impact */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/20 p-2.5 rounded-lg">
                <strong>교수·학습 시사점:</strong> {hl.pedagogicalImpact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Interactive Teacher Quiz */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                2022 개정 영어과 교사 마스터 퀴즈 (5문항)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              문항을 풀고 제출하여 즉각적인 정답 확인과 상세 해설을 받아보세요.
            </p>
          </div>

          {/* Quiz Score status */}
          {submitted && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">내 점수</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {score} / {quizzes.length}점 ({Math.round((score / quizzes.length) * 100)}점)
                </span>
              </div>
              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 다시 풀기
              </button>
            </div>
          )}
        </div>

        {/* Quiz Questions List */}
        <div className="space-y-6">
          {quizzes.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrect = submitted && selectedAnswers[q.id] === q.answer;
            const isWrong = submitted && selectedAnswers[q.id] !== q.answer;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20'
                      : 'border-rose-300 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                {/* Question title */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-extrabold text-xs">
                    Q{idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                    {q.question}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrectAnswer = q.answer === optIdx;

                    let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300';
                    if (isSelected) {
                      optionStyle = 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-400/40 font-bold';
                    }
                    if (submitted) {
                      if (isCorrectAnswer) {
                        optionStyle = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/50';
                      } else if (isSelected && !isCorrectAnswer) {
                        optionStyle = 'border-rose-500 bg-rose-100/70 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 line-through';
                      }
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[11px] font-bold shrink-0">
                            {optIdx + 1}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {submitted && isCorrectAnswer && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        {submitted && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                      💡 정답 및 상세 해설:
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        {!submitted && (
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {answeredCount} / {quizzes.length} 문항 완료
            </span>
            <button
              onClick={handleSubmitQuiz}
              disabled={answeredCount < quizzes.length}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              정답 제출 및 채점하기
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

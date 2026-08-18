import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  FileCheck, 
  HelpCircle, 
  Award,
  ExternalLink,
  ChevronRight,
  Plus,
  Bot,
  FileText
} from 'lucide-react';

export default function StandardDetailModal({ 
  standard, 
  onClose, 
  basket, 
  toggleBasket,
  onOpenAgentWithStandard
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'topics' | 'assessment'

  if (!standard) return null;

  const inBasket = basket && basket.some(b => b.code === standard.code);

  const handleCopyAll = () => {
    const text = `[2022 개정 영어과 성취기준]
코드: ${standard.code}
과목: ${standard.curriculumName} (${standard.schoolLevel === 'middle' ? '중학교' : '고등학교'})
영역: ${standard.domain}
내용: ${standard.summary}
공식 원문: ${standard.fullText || standard.summary}
${standard.sourceLocator ? `출처: 교육부 고시 제2022-33호 별책 (${standard.sourceLocator.section || ''}, p.${standard.sourceLocator.pdfPage || ''})` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono font-extrabold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                {standard.code}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {standard.curriculumName}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {standard.domain} 영역
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {standard.schoolLevel === 'middle' ? '중학교 (7~9학년군)' : '고등학교 (10~12학년군)'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {standard.summary}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Agent Actions Bar inside Modal */}
        <div className="px-6 py-2.5 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            AI 에이전트 연동:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenAgentWithStandard) onOpenAgentWithStandard(standard.code, 'setek');
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>이 기준으로 세특 생성 (에이전트 3)</span>
            </button>
            <button
              onClick={() => {
                onClose();
                if (onOpenAgentWithStandard) onOpenAgentWithStandard(standard.code, 'assessment');
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>이 기준으로 문항 출제 (에이전트 4)</span>
            </button>
          </div>
        </div>

        {/* Modal Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>원문 & 기본 정보</span>
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'topics'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>세부 학습 주제 ({standard.topics?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'assessment'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>관찰 증거 & 평가 문항 예시</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  국가교육과정 고시 공식 성취기준 원문
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-semibold leading-relaxed text-sm">
                  {standard.fullText || standard.summary}
                </p>
              </div>

              {standard.sourceLocator && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
                  <div className="font-bold text-slate-600 dark:text-slate-300">
                    📜 법적 고시 출처 메타데이터
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    교육부 고시 제2022-33호 별책 (PDF {standard.sourceLocator.pdfPage}쪽 · 섹션: {standard.sourceLocator.section})
                  </div>
                </div>
              )}

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  2022 개정 영어과 교수·학습 중점
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  본 성취기준은 <strong>{standard.curriculumName}</strong>의 <strong>{standard.domain}</strong> 영역에 해당하며, 실생활 및 다양한 맥락에서 
                  언어적 지식뿐만 아니라 비판적 사고력과 상호문화적 감수성을 복합적으로 발현할 수 있도록 학습자 중심 탐구 과업으로 구현되어야 합니다.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-3">
              {standard.topics && standard.topics.length > 0 ? (
                standard.topics.map((tp, idx) => (
                  <div 
                    key={tp.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        📌 {tp.title}
                      </h5>
                      {tp.types && tp.types.length > 0 && (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                          {tp.types.join(', ')}
                        </span>
                      )}
                    </div>
                    {tp.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {tp.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  연계된 세부 학습 주제 정보가 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="space-y-4">
              {standard.topics && standard.topics.some(t => (t.evidence && t.evidence.length > 0) || (t.assessmentPrompts && t.assessmentPrompts.length > 0)) ? (
                standard.topics.map((tp, idx) => (
                  <div 
                    key={tp.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                  >
                    <h5 className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                      [학습 주제] {tp.title}
                    </h5>

                    {tp.evidence && tp.evidence.length > 0 && (
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                          🔍 학생 관찰 증거 (Evidence)
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          {tp.evidence.map((ev, i) => (
                            <li key={i}>{ev}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {tp.assessmentPrompts && tp.assessmentPrompts.length > 0 && (
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mb-1">
                          📝 평가 문항 및 수행 과제 예시 (Prompts)
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          {tp.assessmentPrompts.map((pm, i) => (
                            <li key={i}>{pm}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  등록된 평가 예시 문항이 없습니다.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사 완료!' : '성취기준 정보 복사'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBasket && toggleBasket(standard)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                inBasket
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {inBasket ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inBasket ? '수업 설계함에서 제거' : '수업 설계함에 담기'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

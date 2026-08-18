import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Terminal, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ReasoningVisualizer({ steps, isRunning }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white shadow-xl space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Agentic AI Reasoning Log (다단계 자율 추론 엔진)
          </span>
        </div>
        {isRunning ? (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] animate-pulse font-bold">
            <Loader2 className="w-3 h-3 animate-spin" /> 추론 및 도구 실행 중...
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 자율 추론 완료
          </span>
        )}
      </div>

      <div className="space-y-3">
        {steps.map((s, idx) => {
          const isCompleted = s.status === 'completed';
          const isRunningStep = s.status === 'running';

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-slate-800/60 border-slate-700/80 text-slate-200'
                  : isRunningStep
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 ring-1 ring-emerald-500/40 animate-pulse'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isRunningStep ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                      {s.step}
                    </div>
                  )}
                  <span>{s.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isCompleted ? 'SUCCESS' : isRunningStep ? 'RUNNING...' : 'PENDING'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                {s.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

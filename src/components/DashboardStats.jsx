import React from 'react';
import { BookOpen, CheckCircle, Award, Sparkles, School, Library } from 'lucide-react';
import { stats } from '../data/curriculumData';

export default function DashboardStats({ onSelectFilter }) {
  const statCards = [
    {
      title: '총 과목 편제',
      value: '15개 과목',
      sub: '중학교 1 · 고교 14',
      icon: School,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-800/60',
      action: () => onSelectFilter && onSelectFilter('all')
    },
    {
      title: '성취기준 전수',
      value: '222개',
      sub: '중학 21 · 고교 201',
      icon: CheckCircle,
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-800/60',
      action: () => onSelectFilter && onSelectFilter('standards')
    },
    {
      title: '핵심 영역 체계',
      value: '이해 · 표현',
      sub: '2대 통합 영역 + 매체',
      icon: BookOpen,
      color: 'from-indigo-600 to-purple-600',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-200 dark:border-indigo-800/60',
      action: () => onSelectFilter && onSelectFilter('guide')
    },
    {
      title: '고교 선택군',
      value: '4대 과목군',
      sub: '공통 · 일반 · 진로 · 융합',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-800/60',
      action: () => onSelectFilter && onSelectFilter('pathway')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.action}
            className={`p-4 rounded-xl border ${card.borderColor} ${card.bgColor} transition-all duration-200 hover:shadow-md cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm ${card.textColor} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-0.5">
              {card.value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}

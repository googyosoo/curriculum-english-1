import React, { useState } from 'react';
import { curricula, allStandards } from '../data/curriculumData';
import { Columns, ArrowLeftRight, Check, BookOpen, Layers, Sparkles, Scale, Info } from 'lucide-react';

export default function StandardComparator({ onOpenDetail }) {
  const [courseAId, setCourseAId] = useState('kr-2022-high-공통영어1');
  const [courseBId, setCourseBId] = useState('kr-2022-high-영어-I');

  const courseA = curricula.find(c => c.id === courseAId) || curricula[1];
  const courseB = curricula.find(c => c.id === courseBId) || curricula[5];

  const presets = [
    { label: '공통영어1 vs 영어 I', idA: 'kr-2022-high-공통영어1', idB: 'kr-2022-high-영어-I' },
    { label: '영어 독해작문 vs 심화 독해작문', idA: 'kr-2022-high-영어-독해와-작문', idB: 'kr-2022-high-심화-영어-독해와-작문' },
    { label: '기본영어1 vs 공통영어1', idA: 'kr-2022-high-기본영어1', idB: 'kr-2022-high-공통영어1' },
    { label: '영어 발표토론 vs 실생활 회화', idA: 'kr-2022-high-영어-발표와-토론', idB: 'kr-2022-high-실생활-영어-회화' },
    { label: '미디어 영어 vs 세계문화와 영어', idA: 'kr-2022-high-미디어-영어', idB: 'kr-2022-high-세계-문화와-영어' },
  ];

  const handleSwap = () => {
    setCourseAId(courseBId);
    setCourseBId(courseAId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-3">
          <Scale className="w-3.5 h-3.5" />
          과목 간 성취기준 1:1 비교 분석기
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          과목별 성취수준 & 난이도 차이 나란히 비교
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          비슷해 보이는 과목 간의 성취기준 수준차, 요구 어휘/구문 난도, 교수·학습 목표를 1:1로 대조하여 교과 편제 및 학생 과목 선택 상담에 활용하세요.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="text-xs font-semibold text-blue-300">추천 비교 조합:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCourseAId(p.idA);
                setCourseBId(p.idB);
              }}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white transition-colors border border-slate-700"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Selectors & Swap Button */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          
          {/* Select Course A */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              기준 과목 A (좌측)
            </label>
            <select
              value={courseAId}
              onChange={(e) => setCourseAId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {curricula.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.category}] {c.name} ({c.standardsCount}개 기준)
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-4 md:pt-0">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
              title="과목 위치 서로 바꾸기"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Select Course B */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              비교 과목 B (우측)
            </label>
            <select
              value={courseBId}
              onChange={(e) => setCourseBId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              {curricula.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.category}] {c.name} ({c.standardsCount}개 기준)
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column A */}
        <div className="space-y-4 min-w-0">
          <div className="bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-600 text-white">
                {courseA.category}
              </span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {courseA.grade} · {courseA.credits}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              {courseA.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {courseA.description}
            </p>
          </div>

          {/* Standards of A */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
              <span>{courseA.name} 성취기준 목록</span>
              <span>총 {courseA.standards.length}개</span>
            </div>
            {courseA.standards.map((std) => (
              <div
                key={std.id}
                onClick={() => onOpenDetail && onOpenDetail(std)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-sm hover:border-blue-400 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {std.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {std.domain}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {std.summary}
                </p>
                {std.fullText && std.fullText !== std.summary && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {std.fullText}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column B */}
        <div className="space-y-4 min-w-0">
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-600 text-white">
                {courseB.category}
              </span>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {courseB.grade} · {courseB.credits}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              {courseB.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {courseB.description}
            </p>
          </div>

          {/* Standards of B */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
              <span>{courseB.name} 성취기준 목록</span>
              <span>총 {courseB.standards.length}개</span>
            </div>
            {courseB.standards.map((std) => (
              <div
                key={std.id}
                onClick={() => onOpenDetail && onOpenDetail(std)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-sm hover:border-indigo-400 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {std.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {std.domain}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {std.summary}
                </p>
                {std.fullText && std.fullText !== std.summary && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {std.fullText}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

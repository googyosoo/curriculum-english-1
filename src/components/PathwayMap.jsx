import React, { useState } from 'react';
import { 
  curricula, 
  trackPresets, 
  courseRelations 
} from '../data/curriculumData';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Award,
  Filter,
  Info,
  ExternalLink
} from 'lucide-react';

export default function PathwayMap({ onSelectCourse, onSelectStandard }) {
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [activeCourseId, setActiveCourseId] = useState('kr-2022-high-공통영어1');
  const [filterCategory, setFilterCategory] = useState('all');

  const activeCourse = curricula.find(c => c.id === activeCourseId) || curricula[0];

  // Group curricula by category/stage
  const middleSchoolCourses = curricula.filter(c => c.schoolLevel === 'middle');
  const highCommonCourses = curricula.filter(c => c.category.includes('공통'));
  const highGeneralCourses = curricula.filter(c => c.category === '일반선택');
  const highCareerCourses = curricula.filter(c => c.category === '진로선택');
  const highFusionCourses = curricula.filter(c => c.category === '융합선택');

  // Active track course IDs
  const activeTrackObj = trackPresets.find(t => t.id === selectedTrack);
  const trackCourseIds = activeTrackObj ? new Set(activeTrackObj.courses.map(c => c.courseId)) : new Set();

  const isCourseInTrack = (courseId) => {
    if (selectedTrack === 'all') return true;
    return trackCourseIds.has(courseId);
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case '중학교 공통':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case '고교 공통':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case '고교 공통(보충)':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      case '일반선택':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case '진로선택':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case '융합선택':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Track Filter */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            2022 개정 중·고교 영어과 과목 체계도
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            학습자 진로 맞춤형 이수 로드맵 시뮬레이터
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            중학교 기초 의사소통부터 고등학교 공통, 일반·진로·융합선택 과목까지의 이수 체계와 권장 연계 흐름을 한눈에 파악하고, 학생 진로별 추천 이수 트랙을 시뮬레이션해 보세요.
          </p>

          {/* Track Presets Selector */}
          <div>
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-2">
              💡 진로 계열별 추천 이수 트랙 필터
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTrack('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTrack === 'all'
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                전체 과목 보기
              </button>
              {trackPresets.map((track) => {
                const isActive = selectedTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105 ring-2 ring-indigo-300'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{track.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Track explanation bar */}
        {activeTrackObj && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-indigo-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">[{activeTrackObj.name}]</strong> {activeTrackObj.description}
              <span className="text-slate-400 block mt-0.5">권장 진로: {activeTrackObj.targetMajor}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Roadmap Interactive Stages & Active Course Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Interactive Course Flow Canvas */}
        <div className="lg:col-span-8 min-w-0 space-y-6">

          {/* STAGE 1: 중학교 공통 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  중학교 공통 교육과정 (7~9학년군)
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">기초 의사소통 역량 함양</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {middleSchoolCourses.map(course => {
                const isSelected = activeCourseId === course.id;
                const inTrack = isCourseInTrack(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => setActiveCourseId(course.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-md ring-2 ring-indigo-400/40'
                        : inTrack
                        ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900'
                        : 'opacity-40 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${getCategoryBadgeClass(course.category)}`}>
                        {course.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {course.standardsCount}개 성취기준
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-base mb-1">
                      {course.name}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connection Arrow */}
          <div className="flex justify-center -my-3 relative z-10">
            <div className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <span>고등학교 진학 및 과목 선택 분기</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>

          {/* STAGE 2: 고교 1학년 공통 과목군 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  고등학교 1학년 공통 과목군
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">기본영어(보충) 또는 공통영어1·2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highCommonCourses.map(course => {
                const isSelected = activeCourseId === course.id;
                const inTrack = isCourseInTrack(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => setActiveCourseId(course.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 shadow-md ring-2 ring-blue-400/40'
                        : inTrack
                        ? 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900'
                        : 'opacity-40 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${getCategoryBadgeClass(course.category)}`}>
                        {course.category} ({course.grade})
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {course.standardsCount}개 성취기준
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-base mb-1">
                      {course.name}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connection Arrow */}
          <div className="flex justify-center -my-3 relative z-10">
            <div className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <span>고교 2~3학년 선택과목 심화 분화</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>

          {/* STAGE 3: 고교 2~3학년 선택 과목군 (일반 / 진로 / 융합) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  고등학교 2~3학년 선택 과목군 (10개 과목)
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">일반선택 · 진로선택 · 융합선택</span>
            </div>

            {/* 일반선택 */}
            <div>
              <div className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                일반선택 과목군 (기초 소양 및 수능/학업 심화)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highGeneralCourses.map(course => {
                  const isSelected = activeCourseId === course.id;
                  const inTrack = isCourseInTrack(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourseId(course.id)}
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/80 dark:bg-sky-950/60 shadow-md ring-2 ring-sky-400/40'
                          : inTrack
                          ? 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 bg-white dark:bg-slate-900'
                          : 'opacity-40 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getCategoryBadgeClass(course.category)}`}>
                          {course.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {course.standardsCount}개 기준
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                        {course.name}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {course.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 진로선택 */}
            <div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                진로선택 과목군 (직무·미디어·문화·실생활 맞춤)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highCareerCourses.map(course => {
                  const isSelected = activeCourseId === course.id;
                  const inTrack = isCourseInTrack(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourseId(course.id)}
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-md ring-2 ring-emerald-400/40'
                          : inTrack
                          ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                          : 'opacity-40 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getCategoryBadgeClass(course.category)}`}>
                          {course.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {course.standardsCount}개 기준
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                        {course.name}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {course.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 융합선택 */}
            <div>
              <div className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                융합선택 과목군 (고급 학술 탐구 및 전공 심화)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highFusionCourses.map(course => {
                  const isSelected = activeCourseId === course.id;
                  const inTrack = isCourseInTrack(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourseId(course.id)}
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/60 shadow-md ring-2 ring-purple-400/40'
                          : inTrack
                          ? 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-slate-900'
                          : 'opacity-40 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getCategoryBadgeClass(course.category)}`}>
                          {course.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {course.standardsCount}개 기준
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                        {course.name}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {course.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Right 4 Cols: Active Course Detail Inspector Panel */}
        <div className="lg:col-span-4 min-w-0 sticky top-20">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-5">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getCategoryBadgeClass(activeCourse.category)}`}>
                  {activeCourse.category}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {activeCourse.grade} · {activeCourse.credits}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activeCourse.name}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                {activeCourse.id}
              </p>
            </div>

            {/* Description */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl text-xs leading-relaxed text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">과목 성격 및 목표:</strong>
              {activeCourse.description}
            </div>

            {/* Standards Breakdown by Domain */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  성취기준 영역별 구성 ({activeCourse.standardsCount}개)
                </span>
                <button
                  onClick={() => onSelectCourse && onSelectCourse(activeCourse.id)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                >
                  전체 보기 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {activeCourse.standards.map((std, idx) => (
                  <div
                    key={std.id || idx}
                    onClick={() => onSelectStandard && onSelectStandard(std)}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-900/90 text-xs transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                        {std.code}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {std.domain}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {std.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => onSelectCourse && onSelectCourse(activeCourse.id)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>성취기준 브라우저로 이동</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

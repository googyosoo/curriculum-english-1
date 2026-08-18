import React, { useState, useMemo } from 'react';
import { 
  allStandards, 
  curricula 
} from '../data/curriculumData';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles, 
  Check, 
  Copy, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Layers, 
  LayoutGrid, 
  Table, 
  SlidersHorizontal,
  Info,
  HelpCircle
} from 'lucide-react';

export default function StandardsBrowser({ 
  selectedCurriculumId, 
  setSelectedCurriculumId, 
  onOpenDetail, 
  basket, 
  toggleBasket 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [copiedCode, setCopiedCode] = useState(null);

  // Extract unique domains
  const availableDomains = useMemo(() => {
    const domains = new Set(allStandards.map(s => s.domain));
    return ['all', ...Array.from(domains)];
  }, []);

  // Filter standards
  const filteredStandards = useMemo(() => {
    return allStandards.filter(s => {
      // School Level filter
      if (selectedSchoolLevel !== 'all' && s.schoolLevel !== selectedSchoolLevel) {
        return false;
      }
      // Curriculum filter
      if (selectedCurriculumId && selectedCurriculumId !== 'all' && s.curriculumId !== selectedCurriculumId) {
        return false;
      }
      // Domain filter
      if (selectedDomain !== 'all' && s.domain !== selectedDomain) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const codeMatch = s.code.toLowerCase().includes(q);
        const summaryMatch = s.summary.toLowerCase().includes(q);
        const textMatch = s.fullText && s.fullText.toLowerCase().includes(q);
        const currMatch = s.curriculumName.toLowerCase().includes(q);
        const topicMatch = s.topics && s.topics.some(t => t.title.toLowerCase().includes(q));
        if (!codeMatch && !summaryMatch && !textMatch && !currMatch && !topicMatch) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedSchoolLevel, selectedCurriculumId, selectedDomain]);

  const handleCopy = (std, e) => {
    e.stopPropagation();
    const textToCopy = `${std.code} ${std.fullText || std.summary} (${std.curriculumName} - ${std.domain})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(std.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDomainColor = (domain) => {
    switch (domain) {
      case '이해':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case '표현':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case '독해':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case '작문':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case '발표':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case '토론':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case '직무 의사소통':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="성취기준 코드(예: [9영01-01], [10공영1-01-01]), 키워드(추론, 요약, 매체, 어휘 등), 과목명 검색..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                지우기
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="카드 그리드 뷰"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">카드형</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="표 테이블 뷰"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">테이블형</span>
              </button>
            </div>
          </div>
        </div>

        {/* Multi-tier Filter Pills */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* School Level Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-16">
              학교급:
            </span>
            <button
              onClick={() => setSelectedSchoolLevel('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedSchoolLevel === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              전체 (222)
            </button>
            <button
              onClick={() => setSelectedSchoolLevel('middle')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedSchoolLevel === 'middle'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              중학교 (21)
            </button>
            <button
              onClick={() => setSelectedSchoolLevel('high')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedSchoolLevel === 'high'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              고등학교 (201)
            </button>
          </div>

          {/* Curriculum Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-16">
              과목 선택:
            </span>
            <button
              onClick={() => setSelectedCurriculumId('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                !selectedCurriculumId || selectedCurriculumId === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              전체 과목
            </button>
            {curricula.map(c => {
              const isSelected = selectedCurriculumId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCurriculumId(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.name}
                  <span className="ml-1 text-[10px] opacity-75">({c.standardsCount})</span>
                </button>
              );
            })}
          </div>

          {/* Domain Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-16">
              영역별:
            </span>
            {availableDomains.map(dm => {
              const isSelected = selectedDomain === dm;
              return (
                <button
                  key={dm}
                  onClick={() => setSelectedDomain(dm)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {dm === 'all' ? '전체 영역' : dm}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            검색 결과: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredStandards.length}개</strong> 성취기준 (전체 222개 중)
          </div>
          {(searchQuery || selectedSchoolLevel !== 'all' || selectedCurriculumId !== 'all' || selectedDomain !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSchoolLevel('all');
                setSelectedCurriculumId('all');
                setSelectedDomain('all');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              모든 필터 초기화
            </button>
          )}
        </div>

      </div>

      {/* Standards List Rendering (Grid or Table) */}
      {filteredStandards.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">
            일치하는 성취기준이 없습니다
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            검색어 또는 필터 조건을 변경하여 다시 시도해 보세요.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStandards.map((std) => {
            const inBasket = basket && basket.some(b => b.code === std.code);
            const isCopied = copiedCode === std.code;

            return (
              <div
                key={std.id}
                onClick={() => onOpenDetail && onOpenDetail(std)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between group relative min-w-0"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-extrabold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                        {std.code}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getDomainColor(std.domain)}`}>
                        {std.domain}
                      </span>
                    </div>

                    {/* Copy & Basket Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopy(std, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="성취기준 복사"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBasket && toggleBasket(std);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          inBasket
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60'
                        }`}
                        title={inBasket ? "설계함에서 제거" : "수업 설계함에 담기"}
                      >
                        {inBasket ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Subject Name */}
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-500" />
                    <span>{std.curriculumName}</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span>{std.schoolLevel === 'middle' ? '중학교' : '고등학교'}</span>
                  </div>

                  {/* Standard Summary / Text */}
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                    {std.summary}
                  </h4>

                  {/* Official Full text snippet if different */}
                  {std.fullText && std.fullText !== std.summary && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800 mb-3">
                      <strong className="text-slate-600 dark:text-slate-300 font-semibold">원문:</strong> {std.fullText}
                    </p>
                  )}
                </div>

                {/* Bottom Topic count & Action guide */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    세부 주제 {std.topicsCount}개 연계
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    상세보기 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-28">코드</th>
                  <th className="py-3 px-4 w-32">과목</th>
                  <th className="py-3 px-4 w-20">영역</th>
                  <th className="py-3 px-4">성취기준 내용 및 공식 원문</th>
                  <th className="py-3 px-4 w-24 text-center">연계 주제</th>
                  <th className="py-3 px-4 w-24 text-right">설계함 담기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStandards.map((std) => {
                  const inBasket = basket && basket.some(b => b.code === std.code);
                  return (
                    <tr
                      key={std.id}
                      onClick={() => onOpenDetail && onOpenDetail(std)}
                      className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        {std.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {std.curriculumName}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getDomainColor(std.domain)}`}>
                          {std.domain}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                          {std.summary}
                        </div>
                        {std.fullText && std.fullText !== std.summary && (
                          <div className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                            {std.fullText}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-600 dark:text-slate-400">
                        {std.topicsCount}개
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBasket && toggleBasket(std);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            inBasket
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-700'
                          }`}
                        >
                          {inBasket ? '담김 ✓' : '+ 담기'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

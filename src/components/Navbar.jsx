import React from 'react';
import { 
  BookOpen, 
  Compass, 
  ListOrdered, 
  GitMerge, 
  Columns, 
  Sparkles, 
  HelpCircle, 
  Moon, 
  Sun, 
  Bot,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode, 
  basketCount, 
  openBasket 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'agent', label: 'AI 에이전트', fullLabel: 'AI 에이전트 스튜디오', icon: Bot, isHighlight: true },
    { id: 'pathway', label: '과목 로드맵', fullLabel: '과목 로드맵 & 트랙', icon: Compass },
    { id: 'standards', label: '성취기준(222)', fullLabel: '성취기준 탐색기 (222개)', icon: ListOrdered },
    { id: 'transitions', label: '연계 전이', fullLabel: '중→고 연계 전이', icon: GitMerge },
    { id: 'compare', label: '과목 비교', fullLabel: '과목 1:1 비교기', icon: Columns },
    { id: 'builder', label: '수업 설계기', fullLabel: '수업·평가 설계기', icon: Sparkles, badge: basketCount },
    { id: 'guide', label: '개정 가이드', fullLabel: '개정 가이드 & 퀴즈', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Title */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer shrink-0" 
            onClick={() => setActiveTab('pathway')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                  2022 개정 영어과 러닝맵
                </span>
                <span className="hidden md:inline-flex px-1.5 py-0.2 text-[10px] font-bold rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shrink-0">
                  AI 포털
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block truncate">
                중·고교 15개 과목 · 222개 성취기준 전수 안내
              </p>
            </div>
          </div>

          {/* Desktop Navigation (Adaptive: fits 100% zoom screens cleanly) */}
          <nav className="hidden lg:flex items-center space-x-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.fullLabel}
                  className={`relative flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    item.isHighlight && !isActive
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-sm'
                      : isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : item.isHighlight ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                  <span className="hidden xl:inline">{item.fullLabel}</span>
                  <span className="xl:hidden">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold leading-none text-white bg-amber-500 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Basket, Dark Mode, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Agent Button for tablet/mobile screens */}
            <button
              onClick={() => setActiveTab('agent')}
              className={`lg:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'agent'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI 에이전트</span>
            </button>

            {basketCount > 0 && activeTab !== 'builder' && (
              <button
                onClick={() => setActiveTab('builder')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                title="설계함 열기"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">설계함</span>
                <span className="bg-indigo-800 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {basketCount}
                </span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="테마 전환"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.fullLabel}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-amber-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

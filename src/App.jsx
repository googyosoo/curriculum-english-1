import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import PathwayMap from './components/PathwayMap';
import StandardsBrowser from './components/StandardsBrowser';
import TransitionFlow from './components/TransitionFlow';
import StandardComparator from './components/StandardComparator';
import LessonBuilder from './components/LessonBuilder';
import CurriculumGuideQuiz from './components/CurriculumGuideQuiz';
import AgenticStudio from './components/AgenticStudio';
import StandardDetailModal from './components/StandardDetailModal';
import { allStandards, curricula } from './data/curriculumData';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('agent'); // Default to AI Agent Studio
  const [selectedCurriculumId, setSelectedCurriculumId] = useState('all');
  const [selectedStandardDetail, setSelectedStandardDetail] = useState(null);
  const [importedLessonPlan, setImportedLessonPlan] = useState(null);
  
  // Agent Studio Target Props
  const [agentInitialCode, setAgentInitialCode] = useState(null);
  const [agentInitialType, setAgentInitialType] = useState('backwards');

  // Basket for lesson planner (persistent in localStorage)
  const [basket, setBasket] = useState(() => {
    try {
      const saved = localStorage.getItem('eng_curriculum_basket');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('eng_curriculum_basket', JSON.stringify(basket));
    } catch (e) {
      console.error(e);
    }
  }, [basket]);

  const toggleBasket = (standard) => {
    if (basket.some(b => b.code === standard.code)) {
      setBasket(basket.filter(b => b.code !== standard.code));
    } else {
      setBasket([...basket, standard]);
    }
  };

  const handleSelectCourseFromMap = (courseId) => {
    setSelectedCurriculumId(courseId);
    setActiveTab('standards');
  };

  const handleSelectStandardFromMap = (standard) => {
    setSelectedStandardDetail(standard);
  };

  const handleApplyAgentLesson = (lessonPlan) => {
    setImportedLessonPlan(lessonPlan);
    if (lessonPlan.selectedStandards) {
      setBasket(lessonPlan.selectedStandards);
    }
    setActiveTab('builder');
  };

  const handleOpenAgentWithStandard = (standardCode, agentType) => {
    setAgentInitialCode(standardCode);
    setAgentInitialType(agentType);
    setActiveTab('agent');
  };

  const handleDashboardFilter = (filterType) => {
    if (filterType === 'standards') {
      setSelectedCurriculumId('all');
      setActiveTab('standards');
    } else if (filterType === 'guide') {
      setActiveTab('guide');
    } else if (filterType === 'pathway') {
      setActiveTab('pathway');
    } else {
      setSelectedCurriculumId('all');
      setActiveTab('standards');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        basketCount={basket.length}
        openBasket={() => setActiveTab('builder')}
      />

      {/* Main Container - Optimized max width for 100% zoom screens */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        
        {/* Top Summary Stats */}
        <DashboardStats onSelectFilter={handleDashboardFilter} />

        {/* Tab 0: AI Agent Studio (All 4 Autonomous Agents) */}
        {activeTab === 'agent' && (
          <AgenticStudio
            onApplyToLessonBuilder={handleApplyAgentLesson}
            onNavigateToPathway={() => setActiveTab('pathway')}
            initialStandardCode={agentInitialCode}
            initialAgent={agentInitialType}
          />
        )}

        {/* Tab 1: Pathway & Track Simulator */}
        {activeTab === 'pathway' && (
          <PathwayMap
            onSelectCourse={handleSelectCourseFromMap}
            onSelectStandard={handleSelectStandardFromMap}
          />
        )}

        {/* Tab 2: Standards Browser (222 Standards) */}
        {activeTab === 'standards' && (
          <StandardsBrowser
            selectedCurriculumId={selectedCurriculumId}
            setSelectedCurriculumId={setSelectedCurriculumId}
            onOpenDetail={(std) => setSelectedStandardDetail(std)}
            basket={basket}
            toggleBasket={toggleBasket}
          />
        )}

        {/* Tab 3: Middle-to-High Transitions */}
        {activeTab === 'transitions' && (
          <TransitionFlow
            onSelectStandard={(std) => setSelectedStandardDetail(std)}
          />
        )}

        {/* Tab 4: 1:1 Course Comparator */}
        {activeTab === 'compare' && (
          <StandardComparator
            onOpenDetail={(std) => setSelectedStandardDetail(std)}
          />
        )}

        {/* Tab 5: Hands-on Lesson & Assessment Designer */}
        {activeTab === 'builder' && (
          <LessonBuilder
            basket={basket}
            setBasket={setBasket}
            onGoToStandards={() => setActiveTab('standards')}
            importedLessonPlan={importedLessonPlan}
            onGoToAgentStudio={() => setActiveTab('agent')}
          />
        )}

        {/* Tab 6: 2022 Revision Guide & Quiz */}
        {activeTab === 'guide' && (
          <CurriculumGuideQuiz />
        )}

      </main>

      {/* Standard Detail Modal */}
      {selectedStandardDetail && (
        <StandardDetailModal
          standard={selectedStandardDetail}
          onClose={() => setSelectedStandardDetail(null)}
          basket={basket}
          toggleBasket={toggleBasket}
          onOpenAgentWithStandard={handleOpenAgentWithStandard}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 no-print mt-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>2022 개정 중·고등학교 영어과 교육과정 4대 에이전틱 AI 러닝맵 포털</span>
          </div>
          <p>
            기반 데이터 출처: 대한민국 교육부 고시 제2022-33호 별책(공공저작물) 및 raphysicst-create/korean-secondary-learning-map-mcp (MIT License)
          </p>
        </div>
      </footer>

    </div>
  );
}

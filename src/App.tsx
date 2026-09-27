import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GPASummaryCards } from './components/dashboard/GPASummaryCards';
import { DegreeProgressBar } from './components/dashboard/DegreeProgressBar';
import { HowItCalculatedModal } from './components/dashboard/HowItCalculatedModal';
import { SemesterManager } from './components/calculator/SemesterManager';
import { SubjectTable } from './components/calculator/SubjectTable';
import { GradingScaleSidebar } from './components/calculator/GradingScaleSidebar';
import { TargetGPACalculator } from './components/planner/TargetGPACalculator';
import { ScenarioSandbox } from './components/planner/ScenarioSandbox';
import { AIAdvisorChat } from './components/ai/AIAdvisorChat';
import { AcademicCharts } from './components/charts/AcademicCharts';
import { GradingSettingsModal } from './components/settings/GradingSettingsModal';
import { AISettingsModal } from './components/settings/AISettingsModal';
import { ExportReportModal } from './components/export/ExportReportModal';
import { AboutSection } from './components/about/AboutSection';
import {
  ClassificationRule,
  GradingScale,
  Semester,
  Subject,
} from './types/academic';
import {
  AVAILABLE_GRADING_SCALES,
  DEFAULT_CLASSIFICATION_RULES,
  SAMPLE_SEMESTERS,
} from './lib/defaultConfig';
import {
  calculateCGPA,
  calculateCompletedSubjectsCount,
  calculateSemesterGPA,
  calculateTotalCredits,
  calculateTotalWeightedPoints,
  calculateClassification,
import { calculateClassification } from './lib/gpaCalculator';
import { Sparkles, HelpCircle, GraduationCap, Download } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { fetchUserData, saveUserData } from './lib/db';

export const App: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'calculator' | 'planner' | 'ai' | 'grading' | 'about'>('calculator');

  // Dark / Light Theme - Defaulting to Pleasant White HCI Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gpa_theme');
    return saved === 'dark'; // Defaults to false (Light Theme)
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('gpa_theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gpa_theme', 'light');
    }
  }, [isDarkMode]);

  // Academic Profile State with LocalStorage persistence
  const [currentGradingScale, setCurrentGradingScale] = useState<GradingScale>(() => {
    const saved = localStorage.getItem('gpa_grading_scale_id');
    const found = AVAILABLE_GRADING_SCALES.find((s) => s.id === saved);
    return found || AVAILABLE_GRADING_SCALES[0];
  });

  const [classificationRules, setClassificationRules] = useState<ClassificationRule[]>(() => {
    const saved = localStorage.getItem('gpa_classification_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_CLASSIFICATION_RULES;
  });

  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('gpa_semesters_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return SAMPLE_SEMESTERS;
  });

  const [activeSemesterId, setActiveSemesterId] = useState<string | 'all'>('all');

  // Sync with Firestore when User Logs In
  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser.uid).then((data) => {
        if (data) {
          if (data.semesters && data.semesters.length > 0) setSemesters(data.semesters);
          if (data.classificationRules) setClassificationRules(data.classificationRules);
          if (data.gradingScaleId) {
            const found = AVAILABLE_GRADING_SCALES.find((s) => s.id === data.gradingScaleId);
            if (found) setCurrentGradingScale(found);
          }
        }
      });
    }
  }, [currentUser]);

  // Persist changes to LocalStorage & Firestore
  useEffect(() => {
    localStorage.setItem('gpa_semesters_data', JSON.stringify(semesters));
    if (currentUser) {
      saveUserData(currentUser.uid, { semesters });
    }
  }, [semesters, currentUser]);

  useEffect(() => {
    localStorage.setItem('gpa_grading_scale_id', currentGradingScale.id);
    if (currentUser) {
      saveUserData(currentUser.uid, { gradingScaleId: currentGradingScale.id });

  useEffect(() => {
    localStorage.setItem('gpa_classification_rules', JSON.stringify(classificationRules));
  }, [classificationRules]);

  // Modals state
  const [isHowItCalculatedOpen, setIsHowItCalculatedOpen] = useState(false);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Deterministic calculations
  const cgpa = calculateCGPA(semesters, currentGradingScale);
  const totalCredits = calculateTotalCredits(semesters);
  const completedSubjects = calculateCompletedSubjectsCount(semesters);
  const totalWeightedPoints = calculateTotalWeightedPoints(semesters, currentGradingScale);
  const classification = calculateClassification(cgpa, classificationRules);

  // Active semester subjects
  const activeSemester =
    activeSemesterId !== 'all' ? semesters.find((s) => s.id === activeSemesterId) : null;
  const activeSemesterGPA = activeSemester
    ? calculateSemesterGPA(activeSemester.subjects, currentGradingScale)
    : cgpa;

  const currentDisplayedSubjects = activeSemester
    ? activeSemester.subjects
    : semesters.flatMap((s) => s.subjects);

  // Subject Actions
  const handleAddSubject = () => {
    const newSubject: Subject = {
      id: `s-${Date.now()}`,
      name: '',
      credits: 3,
      grade: 'A',
    };

    if (activeSemester) {
      setSemesters(
        semesters.map((sem) =>
          sem.id === activeSemester.id
            ? { ...sem, subjects: [...sem.subjects, newSubject] }
            : sem
        )
      );
    } else {
      // If in 'all' view, add to the last semester or create one
      if (semesters.length === 0) {
        setSemesters([
          {
            id: `sem-${Date.now()}`,
            name: 'Year 1 — Semester 1',
            year: 1,
            semesterNumber: 1,
            subjects: [newSubject],
          },
        ]);
      } else {
        const lastSem = semesters[semesters.length - 1];
        setSemesters(
          semesters.map((sem) =>
            sem.id === lastSem.id
              ? { ...sem, subjects: [...sem.subjects, newSubject] }
              : sem
          )
        );
      }
    }
  };

  const handleUpdateSubject = (id: string, updates: Partial<Subject>) => {
    setSemesters(
      semesters.map((sem) => ({
        ...sem,
        subjects: sem.subjects.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub)),
      }))
    );
  };

  const handleRemoveSubject = (id: string) => {
    setSemesters(
      semesters.map((sem) => ({
        ...sem,
        subjects: sem.subjects.filter((sub) => sub.id !== id),
      }))
    );
  };

  // Semester Actions
  const handleAddSemester = (customName?: string) => {
    const count = semesters.length + 1;
    const year = Math.ceil(count / 2);
    const semNum = count % 2 === 1 ? 1 : 2;
    const newSemester: Semester = {
      id: `sem-${Date.now()}`,
      name: customName || `Year ${year} — Semester ${semNum}`,
      year,
      semesterNumber: semNum,
      subjects: [
        { id: `s-${Date.now()}-1`, name: '', credits: 3, grade: 'A' },
        { id: `s-${Date.now()}-2`, name: '', credits: 3, grade: 'A-' },
      ],
    };
    setSemesters([...semesters, newSemester]);
    setActiveSemesterId(newSemester.id);
  };

  const handleRemoveSemester = (id: string) => {
    if (semesters.length <= 1) return;
    const remaining = semesters.filter((s) => s.id !== id);
    setSemesters(remaining);
    if (activeSemesterId === id) {
      setActiveSemesterId(remaining[0]?.id || 'all');
    }
  };

  const handleRenameSemester = (id: string, newName: string) => {
    setSemesters(
      semesters.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  // Preset & Sample Data Actions
  const handleLoadSampleData = () => {
    setSemesters(SAMPLE_SEMESTERS);
    setActiveSemesterId('all');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear your current academic modules?')) {
      setSemesters([
        {
          id: 'sem-1',
          name: 'Year 1 — Semester 1',
          year: 1,
          semesterNumber: 1,
          subjects: [],
        },
      ]);
      setActiveSemesterId('sem-1');
    }
  };

  const handleUpdateClassificationRule = (id: string, minGPA: number) => {
    setClassificationRules(
      classificationRules.map((rule) =>
        rule.id === id ? { ...rule, minGPA } : rule
      )
    );
  };

  const handleResetClassificationRules = () => {
    setClassificationRules(DEFAULT_CLASSIFICATION_RULES);
  };

  // Format summaries for AI Advisor
  const semestersSummary = semesters.map((sem) => ({
    name: sem.name,
    credits: sem.subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0),
    gpa: calculateSemesterGPA(sem.subjects, currentGradingScale),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-purple-600 selection:text-white dark:bg-[#090514] dark:text-slate-100 transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetData}
        onOpenExport={() => setIsExportModalOpen(true)}
        selectedUniversityName={currentGradingScale.university}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        {/* Academic Platform Hero Banner */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-purple-900/30">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-semibold text-purple-700 dark:bg-purple-950/60 dark:border-purple-800/40 dark:text-purple-300 mb-2.5 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Sri Lankan Undergraduate Academic Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Calculate Your GPA. <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent dark:from-purple-400 dark:via-purple-300 dark:to-indigo-300">Plan Your Future.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/70 mt-1.5 max-w-2xl leading-relaxed">
              Designed with human-centered ergonomics for Sri Lankan university undergraduates across state universities and private institutes (SLIIT, NSBM, IIT, Colombo, Moratuwa, USJ, Kelaniya, Peradeniya).
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2.5">
            <button
              onClick={() => setIsHowItCalculatedOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-purple-700 hover:border-purple-300 shadow-xs transition-all dark:bg-[#160b30] dark:border-purple-800/40 dark:text-purple-300 dark:hover:bg-purple-900/40 dark:hover:text-white"
            >
              <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>How GPA is Calculated</span>
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Target & Scenarios</span>
            </button>
          </div>
        </div>

        {/* Real-time Summary Cards & Progress (Always prominent across core workflow) */}
        <GPASummaryCards
          cgpa={cgpa}
          semesterGPA={activeSemesterGPA}
          isSemesterMode={activeSemesterId !== 'all'}
          activeSemesterName={activeSemester?.name}
          totalCredits={totalCredits}
          completedSubjects={completedSubjects}
          totalWeightedPoints={totalWeightedPoints}
          classification={classification}
          onOpenHowItCalculated={() => setIsHowItCalculatedOpen(true)}
        />

        <DegreeProgressBar
          cgpa={cgpa}
          classificationRules={classificationRules}
        />

        {/* Tab 1: Calculator & Dashboard */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Main Calculator (Col 8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Semester Mode Switcher */}
              <SemesterManager
                semesters={semesters}
                activeSemesterId={activeSemesterId}
                setActiveSemesterId={setActiveSemesterId}
                gradingScale={currentGradingScale}
                onAddSemester={handleAddSemester}
                onRemoveSemester={handleRemoveSemester}
                onRenameSemester={handleRenameSemester}
              />

              {/* Subject Entries Table */}
              <SubjectTable
                subjects={currentDisplayedSubjects}
                gradingScale={currentGradingScale}
                onAddSubject={handleAddSubject}
                onUpdateSubject={handleUpdateSubject}
                onRemoveSubject={handleRemoveSubject}
                onLoadSampleData={handleLoadSampleData}
              />

              {/* Charts & Analytics */}
              <AcademicCharts
                semesters={semesters}
                gradingScale={currentGradingScale}
                completedCredits={totalCredits}
                remainingCredits={Math.max(120 - totalCredits, 0)}
              />

              {/* Download Feature */}
              {semesters.some(s => s.subjects.length > 0) && (
                <div className="flex justify-center pt-8 pb-4">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Final Academic Report (PDF)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar (Col 4) */}
            <div className="lg:col-span-4 space-y-6">
              <GradingScaleSidebar
                currentGradingScale={currentGradingScale}
                onSelectGradingScale={setCurrentGradingScale}
                classificationRules={classificationRules}
                onOpenGradingModal={() => setIsGradingModalOpen(true)}
              />

              {/* Quick Target Insight */}
              <div className="rounded-2xl bg-gradient-to-br from-[#170c30] to-[#100720] border border-purple-800/40 p-5 shadow-xl light:bg-slate-100 light:border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 light:text-purple-700 mb-2">
                  Academic Degree Goal
                </h4>
                <p className="text-xs text-slate-300 light:text-slate-600 mb-3">
                  Want to know exactly what future grades you need to graduate with First Class honours?
                </p>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Open Academic Target Planner →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Academic Planner & Scenarios */}
        {activeTab === 'planner' && (
          <div className="space-y-8 animate-fadeIn">
            <TargetGPACalculator
              currentCGPA={cgpa}
              completedCredits={totalCredits}
            />

            <ScenarioSandbox
              currentWeightedPoints={totalWeightedPoints}
              currentCredits={totalCredits}
              currentCGPA={cgpa}
              gradingScale={currentGradingScale}
              classificationRules={classificationRules}
            />
          </div>
        )}

        {/* Tab 3: Gemini AI Academic Advisor */}
        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <AIAdvisorChat
              currentCGPA={cgpa}
              completedCredits={totalCredits}
              remainingCredits={Math.max(120 - totalCredits, 30)}
              targetCGPA={3.70}
              universityName={currentGradingScale.university}
              degreeName="Undergraduate Degree Program"
              semestersSummary={semestersSummary}
            />
          </div>
        )}

        {/* Tab 4: Grading Scales & Settings */}
        {activeTab === 'grading' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white light:text-slate-900">
                  Sri Lankan University Grading Scales & Classification Presets
                </h2>
                <p className="text-xs text-purple-300/80 light:text-slate-600">
                  Switch universities or customize honour thresholds
                </p>
              </div>
              <button
                onClick={() => setIsGradingModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                Customize Cutoffs
              </button>
            </div>

            <GradingScaleSidebar
              currentGradingScale={currentGradingScale}
              onSelectGradingScale={setCurrentGradingScale}
              classificationRules={classificationRules}
              onOpenGradingModal={() => setIsGradingModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 5: About & Guide */}
        {activeTab === 'about' && (
          <AboutSection
            onOpenHowItCalculated={() => setIsHowItCalculatedOpen(true)}
            onSelectTab={setActiveTab}
          />
        )}
      </main>

      {/* Modals */}
      <HowItCalculatedModal
        isOpen={isHowItCalculatedOpen}
        onClose={() => setIsHowItCalculatedOpen(false)}
        totalCredits={totalCredits}
        totalWeightedPoints={totalWeightedPoints}
        cgpa={cgpa}
      />

      <GradingSettingsModal
        isOpen={isGradingModalOpen}
        onClose={() => setIsGradingModalOpen(false)}
        currentGradingScale={currentGradingScale}
        onSelectGradingScale={setCurrentGradingScale}
        classificationRules={classificationRules}
        onUpdateClassificationRule={handleUpdateClassificationRule}
        onResetClassificationRules={handleResetClassificationRules}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        semesters={semesters}
        gradingScale={currentGradingScale}
        cgpa={cgpa}
        totalCredits={totalCredits}
        totalWeightedPoints={totalWeightedPoints}
        classification={classification}
        universityName={currentGradingScale.university}
      />

      {/* Footer with Developer Attribution */}
      <Footer
        onOpenHowItCalculated={() => setIsHowItCalculatedOpen(true)}
        onOpenAbout={() => setActiveTab('about')}
      />
    </div>
  );
};

export default App;

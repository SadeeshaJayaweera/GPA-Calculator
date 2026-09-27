import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Calculator,
  Target,
  Bot,
  Sliders,
  Sun,
  Moon,
  Download,
  Info,
  LogOut,
  User,
  LogIn,
  Settings,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  activeTab: 'calculator' | 'planner' | 'ai' | 'grading' | 'about';
  setActiveTab: (tab: 'calculator' | 'planner' | 'ai' | 'grading' | 'about') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onLoadSampleData: () => void;
  onResetData: () => void;
  onOpenExport: () => void;
  onOpenAISettings: () => void;
  selectedUniversityName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onLoadSampleData,
  onResetData,
  onOpenExport,
  onOpenAISettings,
  selectedUniversityName,
}) => {
  const { currentUser, loginWithGoogle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs dark:border-purple-900/30 dark:bg-[#090514]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-md shadow-purple-600/20 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-[#0e0720] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  GPA Mate <span className="text-purple-600 dark:text-purple-400 font-black">LK</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700/40">
                  Sri Lanka
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-purple-300/70 hidden xl:block truncate">
                Undergraduate GPA & Academic Planning Platform • {selectedUniversityName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 dark:bg-[#130a26]/80 dark:border-purple-900/40">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-purple-900/20'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'planner'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-purple-900/20'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Planner
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-purple-900/20'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
              AI Advisor
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('grading')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'grading'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-purple-900/20'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Grading
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'about'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-purple-900/20'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              About
            </button>
          </nav>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLoadSampleData}
              title="Load sample Sri Lankan undergraduate data"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 hover:text-purple-900 dark:bg-purple-950/60 dark:border-purple-800/40 dark:text-purple-300 dark:hover:bg-purple-900/50 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">Sample Data</span>
            </button>

            <button
              onClick={onResetData}
              title="Clear all subjects"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Auth Section */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#130a26]/80 p-1 pr-3 rounded-xl border border-slate-200 dark:border-purple-900/40">
                <img 
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName}`} 
                  alt="Profile" 
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:block max-w-[100px] truncate">
                  {currentUser.displayName?.split(' ')[0]}
                </span>
                <div className="flex items-center gap-0.5 ml-1 border-l border-slate-200 dark:border-purple-900/50 pl-1">
                  <button 
                    onClick={onOpenAISettings}
                    title="AI Advisor Settings"
                    className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={logout}
                    title="Sign Out"
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 hover:text-purple-800 dark:bg-purple-950/60 dark:border-purple-800/40 dark:text-purple-300 dark:hover:bg-purple-900/50 dark:hover:text-purple-200 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
              >
                <div className="bg-white p-0.5 rounded-full shadow-sm flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </div>
                <span className="hidden sm:inline">Sign in with Google</span>
              </button>
            )}

            <button
              onClick={onOpenExport}
              title="Export GPA Report & Summary"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-sm shadow-purple-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Export Report</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:text-slate-300 dark:bg-[#180c33] dark:border-purple-900/40 dark:hover:text-white dark:hover:bg-purple-900/40 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-200 dark:border-purple-900/20">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] ${
              activeTab === 'calculator' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Calc
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] ${
              activeTab === 'planner' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Target className="w-4 h-4" />
            Target
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] ${
              activeTab === 'ai' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Advisor
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] ${
              activeTab === 'grading' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Scales
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] ${
              activeTab === 'about' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Info className="w-4 h-4" />
            About
          </button>
        </div>
      </div>
    </header>
  );
};

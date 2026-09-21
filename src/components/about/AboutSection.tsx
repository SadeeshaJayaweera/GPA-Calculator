import React from 'react';
import {
  GraduationCap,
  Heart,
  ShieldCheck,
  HelpCircle,
  Building2,
  Cpu,
} from 'lucide-react';

interface AboutSectionProps {
  onOpenHowItCalculated: () => void;
  onSelectTab: (tab: 'calculator' | 'planner' | 'ai') => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenHowItCalculated,
  onSelectTab,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-xs relative overflow-hidden dark:bg-gradient-to-br dark:from-[#1b0d38] dark:via-[#130728] dark:to-[#0c041a] dark:border-purple-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-md shadow-purple-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-[#100622] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dark:text-white">
              GPA Mate <span className="text-purple-600 dark:text-purple-400">LK</span>
            </h2>
            <p className="text-sm text-purple-700 dark:text-purple-300 font-bold">
              The Dedicated Academic Intelligence & Planning Platform for Sri Lankan Undergraduates
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Built specifically for students across all Sri Lankan state and private universities following
          <strong> BSc, BSc (Hons), Software Engineering, Computer Science, Information Technology, Engineering, and Business Management</strong>.
          Designed using ergonomic human-computer interaction (HCI) standards to provide clarity, eliminate spreadsheet errors, and guide your trajectory to First Class honours.
        </p>

        {/* Developer Attribution Box */}
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:bg-purple-950/60 dark:border-purple-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-purple-700 border border-purple-200 shadow-2xs dark:bg-purple-900/60 dark:text-purple-300 dark:border-transparent">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-purple-800 dark:text-purple-300/80 tracking-wider">
                Project Architect & Developer
              </span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                Sadeesha Jayaweera
              </div>
            </div>
          </div>
          <span className="text-xs text-purple-900 dark:text-purple-200/90 max-w-xs text-left sm:text-right font-medium">
            Dedicated to empowering Sri Lankan university students with transparent academic tracking.
          </span>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 w-fit mb-3 dark:bg-purple-900/40 dark:text-purple-300 dark:border-transparent">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5 dark:text-white">
            100% Deterministic Engine
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            All GPA and CGPA calculations use verified credit-weighted formulas (never inaccurate semester averages). Guaranteed mathematical correctness.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 w-fit mb-3 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-transparent">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5 dark:text-white">
            Multi-University Presets
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Pre-configured for UGC standard, SLIIT, NSBM, IIT / Westminster, University of Colombo, University of Moratuwa, and adaptable to any institution.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 w-fit mb-3 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-transparent">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5 dark:text-white">
            Gemini AI Advisor
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Get personalized academic study plans, credit leverage strategies, and scenario explanations anchored to verified numbers.
          </p>
        </div>
      </div>

      {/* Guide & Frequently Asked Questions */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 dark:bg-[#120826] dark:border-purple-900/30">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Understanding Sri Lankan Degree Classifications
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#170c30] dark:border-purple-900/40 dark:text-slate-300">
            <strong className="text-purple-700 dark:text-purple-300 block text-sm mb-1 font-bold">
              • First Class Honours (GPA ≥ 3.70)
            </strong>
            The highest undergraduate distinction. In most Sri Lankan universities, students must also have no failed or repeated modules and complete degree requirements within the minimum registration period.
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#170c30] dark:border-purple-900/40 dark:text-slate-300">
            <strong className="text-purple-700 dark:text-purple-300 block text-sm mb-1 font-bold">
              • Second Class (Upper Division) (GPA 3.30 – 3.69)
            </strong>
            Commonly referred to as a "2:1". Highly respected by major tech firms, software engineering recruiters, and international postgraduate programs.
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#170c30] dark:border-purple-900/40 dark:text-slate-300">
            <strong className="text-purple-700 dark:text-purple-300 block text-sm mb-1 font-bold">
              • Second Class (Lower Division) (GPA 3.00 – 3.29)
            </strong>
            Commonly referred to as a "2:2". Satisfies graduation criteria with solid academic performance.
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#170c30] dark:border-purple-900/40 dark:text-slate-300">
            <strong className="text-purple-700 dark:text-purple-300 block text-sm mb-1 font-bold">
              • General Pass (GPA 2.00 – 2.99)
            </strong>
            Minimum acceptable GPA required for degree conferment.
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <button
            onClick={onOpenHowItCalculated}
            className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors dark:bg-purple-900/40 dark:border-purple-700/50 dark:text-purple-300"
          >
            Review Step-by-Step Formula
          </button>
          <button
            onClick={() => onSelectTab('calculator')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-xs transition-colors"
          >
            Start Calculating Now
          </button>
        </div>
      </div>
    </div>
  );
};

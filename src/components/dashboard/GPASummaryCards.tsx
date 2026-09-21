import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ClassificationRule } from '../../types/academic';

interface GPASummaryCardsProps {
  cgpa: number;
  semesterGPA: number;
  isSemesterMode: boolean;
  activeSemesterName?: string;
  totalCredits: number;
  completedSubjects: number;
  totalWeightedPoints: number;
  classification: ClassificationRule;
  onOpenHowItCalculated: () => void;
}

export const GPASummaryCards: React.FC<GPASummaryCardsProps> = ({
  cgpa,
  semesterGPA,
  isSemesterMode,
  activeSemesterName,
  totalCredits,
  completedSubjects,
  totalWeightedPoints,
  classification,
  onOpenHowItCalculated,
}) => {
  const displayGPA = isSemesterMode ? semesterGPA : cgpa;
  const gpaLabel = isSemesterMode ? `${activeSemesterName || 'Semester'} GPA` : 'Cumulative CGPA';

  // Badge styles based on degree classification
  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {/* 1. GPA / CGPA Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-purple-200 shadow-xs hover:shadow-md transition-shadow p-5 dark:bg-gradient-to-br dark:from-[#1b0d36] dark:to-[#120824] dark:border-purple-600/30 dark:shadow-xl">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            {gpaLabel}
          </span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-transparent">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {displayGPA.toFixed(2)}
          </span>
          <span className="text-sm font-semibold text-slate-400 dark:text-purple-400/80">/ 4.00</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {isSemesterMode ? `CGPA: ${cgpa.toFixed(2)}` : 'Full degree credit weighted'}
          </span>
          <button
            onClick={onOpenHowItCalculated}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-bold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Formula</span>
          </button>
        </div>
      </div>

      {/* 2. Total Credits Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 dark:bg-gradient-to-br dark:from-[#160b2e] dark:to-[#100720] dark:border-purple-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Credits
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-transparent">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
            {totalCredits}
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Credits</span>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate">
          Total Weighted Points: <strong className="text-purple-700 dark:text-purple-300 font-mono">{totalWeightedPoints}</strong>
        </p>
      </div>

      {/* 3. Subjects Completed */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 dark:bg-gradient-to-br dark:from-[#160b2e] dark:to-[#100720] dark:border-purple-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Subjects Completed
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-transparent">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
            {completedSubjects}
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Modules</span>
        </div>

        <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time credit evaluation</span>
        </p>
      </div>

      {/* 4. Degree Classification Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 dark:bg-gradient-to-br dark:from-[#180c33] dark:to-[#110722] dark:border-purple-800/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Degree Classification
          </span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-transparent">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2">
          <span
            className={`inline-block px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border shadow-2xs ${getBadgeStyle(
              classification.badgeColor
            )}`}
          >
            {classification.name}
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate">
          {classification.description}
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { Heart, GraduationCap, ShieldCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenHowItCalculated: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHowItCalculated,
  onOpenAbout,
}) => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-16 text-slate-600 shadow-2xs dark:border-purple-900/30 dark:bg-[#070312] dark:text-slate-400 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Purpose */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-slate-900 dark:text-slate-200 text-sm tracking-wide">
              GPA Mate LK
            </span>
            <span className="text-xs text-purple-700 dark:text-purple-400 font-semibold">
              • Academic Platform for Sri Lankan Undergraduates
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Supporting state & private university students across SLIIT, NSBM, IIT, University of Colombo, University of Moratuwa, USJ, Kelaniya, Peradeniya, and all UGC degree programs.
          </p>
        </div>

        {/* Developer Attribution & Links */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-800 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-full dark:text-slate-300 dark:bg-purple-950/40 dark:border-purple-800/30 font-semibold shadow-2xs">
            <span>Developed by</span>
            <span className="font-extrabold text-purple-700 dark:text-purple-300">
              Sadeesha Jayaweera
            </span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-0.5" />
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={onOpenHowItCalculated}
              className="text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              How GPA is Calculated
            </button>
            <span className="text-slate-300 dark:text-purple-900">•</span>
            <button
              onClick={onOpenAbout}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Degree Rules & Info
            </button>
            <span className="text-slate-300 dark:text-purple-900">•</span>
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              100% Deterministic Engine
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-100 dark:border-purple-950/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 font-medium">
        <p>© {new Date().getFullYear()} GPA Mate LK. All mathematical models adhere strictly to Sri Lankan university credit specifications.</p>
        <p className="text-purple-700 dark:text-purple-400 font-bold">Developed by Sadeesha Jayaweera</p>
      </div>
    </footer>
  );
};

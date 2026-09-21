import React from 'react';
import { X, CheckCircle, Calculator, Info } from 'lucide-react';

interface HowItCalculatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCredits: number;
  totalWeightedPoints: number;
  cgpa: number;
}

export const HowItCalculatedModal: React.FC<HowItCalculatedModalProps> = ({
  isOpen,
  onClose,
  totalCredits,
  totalWeightedPoints,
  cgpa,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl dark:bg-[#120826] dark:border-purple-800/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-purple-900/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/40">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              How Your GPA is Calculated
            </h3>
            <p className="text-xs text-purple-700 dark:text-purple-300/80 font-semibold">
              Transparent, deterministic credit-weighted formulation
            </p>
          </div>
        </div>

        {/* Real-time Math Breakdown */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-4 font-mono text-xs text-slate-800 dark:bg-[#090314] dark:border-purple-900/50 dark:text-slate-200">
          <div className="text-slate-500 mb-1">// Your Live Academic Figures:</div>
          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-purple-950">
            <span>Total Weighted Points (Σ Credit × GP):</span>
            <span className="font-bold text-purple-700 dark:text-purple-300">{totalWeightedPoints}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-purple-950">
            <span>Total Completed Credits (Σ Credits):</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300">{totalCredits}</span>
          </div>
          <div className="flex justify-between py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
            <span>Calculation:</span>
            <span>
              {totalCredits > 0 ? `${totalWeightedPoints} ÷ ${totalCredits} = ${cgpa.toFixed(2)}` : '0 credits = 0.00'}
            </span>
          </div>
        </div>

        {/* Step by step explanation */}
        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white">1. Weighted Points per Module</strong>
              <p className="text-slate-500 dark:text-slate-400">
                For every subject, multiply its credit value by its numeric grade point (e.g. 3 credits × 4.0 for grade A = 12.0 weighted points).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white">2. Sum Total Quality Points</strong>
              <p className="text-slate-500 dark:text-slate-400">
                Sum all the weighted points from every completed subject across all semesters.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white">3. Divide by Total Credits</strong>
              <p className="text-slate-500 dark:text-slate-400">
                Divide the total weighted points by the sum of credits. Rounded to two decimal places for transcripts.
              </p>
            </div>
          </div>
        </div>

        {/* Critical Note on Semester Averaging */}
        <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900 dark:bg-purple-950/40 dark:border-purple-800/30 dark:text-purple-200">
          <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
          <p>
            <strong>Important Sri Lankan University Rule:</strong> Cumulative GPA (CGPA) is <em>never</em> calculated by averaging semester GPAs. It is strictly weighted across all individual subject credits.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

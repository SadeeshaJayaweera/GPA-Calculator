import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateRequiredFutureGPA } from '../../lib/gpaCalculator';

interface TargetGPACalculatorProps {
  currentCGPA: number;
  completedCredits: number;
  onApplyRemainingCredits?: (credits: number) => void;
}

export const TargetGPACalculator: React.FC<TargetGPACalculatorProps> = ({
  currentCGPA,
  completedCredits,
}) => {
  const [targetCGPA, setTargetCGPA] = useState<number>(3.70);
  const [remainingCredits, setRemainingCredits] = useState<number>(30);

  const result = calculateRequiredFutureGPA(
    currentCGPA,
    completedCredits,
    remainingCredits,
    targetCGPA
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-transparent">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Target GPA & Degree Class Calculator
          </h3>
          <p className="text-xs text-slate-500 dark:text-purple-300/70">
            Determine the exact future GPA and grade profile needed across your remaining credits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#170c30] dark:border-purple-900/40">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Current CGPA
              </label>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentCGPA.toFixed(2)}
              </div>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">From completed modules</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#170c30] dark:border-purple-900/40">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Completed Credits
              </label>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {completedCredits}
              </div>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">Credit weight base</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target CGPA (e.g. 3.70 for First Class)
              </label>
              <span className="font-mono text-sm font-bold text-purple-700 dark:text-purple-400">
                {targetCGPA.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="2.00"
              max="4.00"
              step="0.05"
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(parseFloat(e.target.value))}
              className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer dark:bg-[#1b0d38]"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1">
              <span>Pass (2.00)</span>
              <span>2:2 (3.00)</span>
              <span>2:1 (3.30)</span>
              <span>1st (3.70)</span>
              <span>4.00</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Remaining Credits to Graduate
            </label>
            <input
              type="number"
              min="1"
              max="160"
              value={remainingCredits || ''}
              onChange={(e) => setRemainingCredits(parseInt(e.target.value) || 0)}
              placeholder="e.g. 30 credits"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-[#170c30] dark:border-purple-900/50 dark:text-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Typical Sri Lankan BSc Hons degree requires 120 total credits (approx. 30 credits per academic year).
            </p>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 border border-purple-200 p-5 shadow-xs dark:from-[#180c33] dark:to-[#100720] dark:border-purple-800/40">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider">
                Required Future Average
              </span>
              <div
                className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  !result.isAchievable
                    ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40'
                    : result.requiredFutureGPA > 3.7
                    ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40'
                }`}
              >
                {!result.isAchievable ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Mathematically Impossible</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Feasible Plan</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span
                className={`text-4xl sm:text-5xl font-black ${
                  !result.isAchievable
                    ? 'text-rose-600 dark:text-rose-400'
                    : result.requiredFutureGPA > 3.7
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {result.isAchievable ? result.requiredFutureGPA.toFixed(2) : '> 4.00'}
              </span>
              <span className="text-sm text-slate-500 font-medium">GPA across future modules</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-3 font-medium">
              {result.message}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-purple-200/80 dark:border-purple-900/40 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Maximum Achievable CGPA:</span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                {result.maxPossibleCGPA.toFixed(2)} (with straight 4.00s)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Total Degree Credits on Completion:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                {completedCredits + remainingCredits} Credits
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, Sparkles } from 'lucide-react';
import { ClassificationRule } from '../../types/academic';
import { getNextClassificationTarget } from '../../lib/gpaCalculator';

interface DegreeProgressBarProps {
  cgpa: number;
  classificationRules: ClassificationRule[];
}

export const DegreeProgressBar: React.FC<DegreeProgressBarProps> = ({
  cgpa,
  classificationRules,
}) => {
  const { nextRule, pointsNeeded } = getNextClassificationTarget(cgpa, classificationRules);

  // Trigger celebration confetti when reaching First Class
  useEffect(() => {
    if (cgpa >= 3.70 && cgpa <= 4.0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'],
        });
      } catch {
        // Safe fallback if confetti canvas not available
      }
    }
  }, [cgpa]);

  // Calculate percentage along 0.0 to 4.0 continuum
  const clampedCGPA = Math.min(Math.max(cgpa, 0), 4.0);
  const percentage = (clampedCGPA / 4.0) * 100;

  // Stages on the continuum
  const stages = [
    { label: 'Pass', gpa: 2.0 },
    { label: 'Second Lower (2:2)', gpa: 3.0 },
    { label: 'Second Upper (2:1)', gpa: 3.3 },
    { label: 'First Class (1st)', gpa: 3.7 },
  ];

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 mb-8 shadow-xs dark:bg-[#130a26] dark:border-purple-900/30 dark:shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Degree Classification Journey
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/40 font-semibold">
            Sri Lankan Standard
          </span>
        </div>

        <div className="text-xs">
          {nextRule ? (
            <span className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 dark:text-purple-300 dark:bg-purple-900/20 dark:border-purple-700/30 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Need <strong>+{pointsNeeded.toFixed(2)} CGPA</strong> to reach <strong>{nextRule.name}</strong>
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Congratulations! First Class Standing Achieved</span>
            </span>
          )}
        </div>
      </div>

      {/* Visual Continuum Bar */}
      <div className="relative pt-6 pb-2">
        {/* Background Track */}
        <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200 dark:bg-[#0a0517] dark:border-purple-900/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 transition-all duration-700 ease-out shadow-xs shadow-purple-500/30"
            style={{ width: `${Math.max(percentage, 3)}%` }}
          />
        </div>

        {/* Milestone Tick Marks */}
        <div className="relative w-full flex justify-between mt-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          <div className="text-left">
            <span className="block font-bold text-slate-700 dark:text-slate-300">0.00</span>
            <span className="text-[10px] text-slate-400">Start</span>
          </div>
          {stages.map((stage) => {
            const posPct = (stage.gpa / 4.0) * 100;
            const isReached = clampedCGPA >= stage.gpa;
            return (
              <div
                key={stage.label}
                className="absolute flex flex-col items-center -translate-x-1/2"
                style={{ left: `${posPct}%` }}
              >
                <div
                  className={`w-3 h-3 rounded-full -mt-[23px] border-2 transition-all ${
                    isReached
                      ? 'bg-purple-600 border-white shadow-sm shadow-purple-500/50 scale-125'
                      : 'bg-white border-slate-300 dark:bg-[#090514] dark:border-purple-800'
                  }`}
                />
                <span className={`mt-2 font-bold ${isReached ? 'text-purple-700 dark:text-purple-300' : 'text-slate-500'}`}>
                  {stage.gpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 hidden md:block font-medium">
                  {stage.label}
                </span>
              </div>
            );
          })}
          <div className="text-right">
            <span className="block font-bold text-emerald-600 dark:text-emerald-400">4.00</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Max</span>
          </div>
        </div>
      </div>
    </div>
  );
};

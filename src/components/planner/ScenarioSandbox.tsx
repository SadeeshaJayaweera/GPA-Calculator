import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, SlidersHorizontal, Award } from 'lucide-react';
import { ClassificationRule, GradingScale, ScenarioModule } from '../../types/academic';
import {
  calculateProjectedCGPA,
  calculateClassification,
  generateGradeScenarios,
} from '../../lib/gpaCalculator';

interface ScenarioSandboxProps {
  currentWeightedPoints: number;
  currentCredits: number;
  currentCGPA: number;
  gradingScale: GradingScale;
  classificationRules: ClassificationRule[];
}

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({
  currentWeightedPoints,
  currentCredits,
  currentCGPA,
  gradingScale,
  classificationRules,
}) => {
  // Sandbox upcoming subjects state
  const [upcomingModules, setUpcomingModules] = useState<ScenarioModule[]>([
    { id: 'u1', name: 'Final Year Software Project', credits: 6, expectedGrade: 'A' },
    { id: 'u2', name: 'Artificial Intelligence & Machine Learning', credits: 3, expectedGrade: 'A-' },
    { id: 'u3', name: 'Cloud Computing & DevOps', credits: 3, expectedGrade: 'B+' },
    { id: 'u4', name: 'Information Security & Cryptography', credits: 3, expectedGrade: 'A' },
  ]);

  const [targetCGPA, setTargetCGPA] = useState<number>(3.70);

  // Add upcoming module
  const addModule = () => {
    setUpcomingModules([
      ...upcomingModules,
      {
        id: `u-${Date.now()}`,
        name: `Upcoming Subject ${upcomingModules.length + 1}`,
        credits: 3,
        expectedGrade: 'A',
      },
    ]);
  };

  // Update upcoming module
  const updateModule = (id: string, updates: Partial<ScenarioModule>) => {
    setUpcomingModules(
      upcomingModules.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // Remove upcoming module
  const removeModule = (id: string) => {
    setUpcomingModules(upcomingModules.filter((m) => m.id !== id));
  };

  // Projected calculations
  const { projectedCGPA, additionalCredits, additionalPoints } = calculateProjectedCGPA(
    currentWeightedPoints,
    currentCredits,
    upcomingModules,
    gradingScale
  );

  const projectedClass = calculateClassification(projectedCGPA, classificationRules);

  // Auto-generate recipe scenarios
  const feasibleCombinations = generateGradeScenarios(
    currentCGPA,
    currentCredits,
    upcomingModules.map((m) => ({ name: m.name, credits: m.credits })),
    targetCGPA,
    gradingScale
  );

  return (
    <div className="space-y-8">
      {/* 1. Interactive What-If Simulator */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-transparent">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Interactive "What-If" Grade Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300/70">
                Test different grade outcomes for upcoming subjects and observe instant CGPA projection.
              </p>
            </div>
          </div>

          <button
            onClick={addModule}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Upcoming Subject</span>
          </button>
        </div>

        {/* Projected CGPA Banner */}
        <div className="rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50/70 to-purple-50 border border-purple-200 p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 dark:from-purple-900/40 dark:via-[#1a0a38] dark:to-indigo-950/40 dark:border-purple-600/40">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                Simulated Graduation CGPA
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {projectedCGPA.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  ({projectedCGPA >= currentCGPA ? '+' : ''}
                  {(projectedCGPA - currentCGPA).toFixed(2)} from current)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Simulated Class</span>
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                {projectedClass.name}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-purple-800/40 hidden sm:block" />
            <div className="text-right hidden sm:block">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Upcoming Weight</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-200">
                +{additionalCredits} cr ({additionalPoints} pts)
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Module List */}
        <div className="space-y-3">
          {upcomingModules.map((module, idx) => (
            <div
              key={module.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#170c30] dark:border-purple-900/40"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={module.name}
                  placeholder={`Upcoming Module ${idx + 1}`}
                  onChange={(e) => updateModule(module.id, { name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold focus:border-purple-600 focus:outline-none dark:bg-[#120826] dark:border-purple-900/50 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Credits:</span>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={module.credits || ''}
                    onChange={(e) =>
                      updateModule(module.id, { credits: parseInt(e.target.value) || 0 })
                    }
                    className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-slate-900 dark:bg-[#120826] dark:border-purple-900/50 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Expected:</span>
                  <select
                    value={module.expectedGrade}
                    onChange={(e) => updateModule(module.id, { expectedGrade: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-purple-700 dark:bg-[#120826] dark:border-purple-900/50 dark:text-purple-300"
                  >
                    {gradingScale.grades.map((g) => (
                      <option key={g.grade} value={g.grade} className="bg-white text-slate-900 dark:bg-[#120826] dark:text-white">
                        {g.grade} ({g.gpa.toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => removeModule(module.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Remove module"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Intelligent "What Grades Do I Need?" Combination Recipes */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-transparent">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Intelligent Feasible Grade Combinations
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300/70">
                Mathematically verified scenarios ranked by feasibility to hit your desired CGPA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Target CGPA:</span>
            <input
              type="number"
              min="2.0"
              max="4.0"
              step="0.05"
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(parseFloat(e.target.value) || 3.7)}
              className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-purple-700 focus:bg-white dark:bg-[#170c30] dark:border-purple-900/60 dark:text-purple-300"
            />
          </div>
        </div>

        {feasibleCombinations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-50 border border-slate-200 dark:bg-purple-950/20 dark:border-purple-900/30">
            No feasible combinations found for target {targetCGPA.toFixed(2)} with these upcoming subjects, or target already surpassed. Adjust your target or add more upcoming credits.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feasibleCombinations.map((scenario) => (
              <div
                key={scenario.id}
                className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between dark:bg-[#170c30] dark:border-purple-900/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {scenario.description}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        scenario.feasibilityRating === 'Very Feasible'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40'
                          : scenario.feasibilityRating === 'Balanced'
                          ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/40'
                          : scenario.feasibilityRating === 'Demanding'
                          ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40'
                          : 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/40'
                      }`}
                    >
                      {scenario.feasibilityRating}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                    Projected CGPA: <strong className="text-purple-700 dark:text-purple-300 font-mono">{scenario.projectedCGPA.toFixed(2)}</strong> (Average Required: {scenario.averageRequiredGPA.toFixed(2)})
                  </div>

                  <div className="space-y-1.5 border-t border-slate-200 dark:border-purple-900/30 pt-2 text-xs">
                    {scenario.grades.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px] font-medium">
                          {item.subjectName} ({item.credits} cr)
                        </span>
                        <span className="font-mono font-bold text-purple-700 dark:text-purple-400 bg-white px-2 py-0.5 rounded border border-slate-200 dark:bg-[#120826] dark:border-purple-900/40">
                          {item.grade} ({item.gradePoint.toFixed(1)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

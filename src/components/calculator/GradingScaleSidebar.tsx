import React from 'react';
import { Table, Award, Building, ExternalLink } from 'lucide-react';
import { ClassificationRule, GradingScale } from '../../types/academic';
import { AVAILABLE_GRADING_SCALES } from '../../lib/defaultConfig';

interface GradingScaleSidebarProps {
  currentGradingScale: GradingScale;
  onSelectGradingScale: (scale: GradingScale) => void;
  classificationRules: ClassificationRule[];
  onOpenGradingModal: () => void;
}

export const GradingScaleSidebar: React.FC<GradingScaleSidebarProps> = ({
  currentGradingScale,
  onSelectGradingScale,
  classificationRules,
  onOpenGradingModal,
}) => {
  return (
    <div className="space-y-6">
      {/* University Scale Selector */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider dark:text-slate-300">
              University System
            </h4>
          </div>
          <button
            onClick={onOpenGradingModal}
            className="text-[11px] text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-bold flex items-center gap-1"
          >
            <span>Details</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <select
          value={currentGradingScale.id}
          onChange={(e) => {
            const found = AVAILABLE_GRADING_SCALES.find((s) => s.id === e.target.value);
            if (found) onSelectGradingScale(found);
          }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-[#180c33] dark:border-purple-900/60 dark:text-purple-200"
        >
          {AVAILABLE_GRADING_SCALES.map((scale) => (
            <option key={scale.id} value={scale.id} className="bg-white text-slate-900 dark:bg-[#120826] dark:text-white">
              {scale.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Institution: <strong className="text-purple-700 dark:text-purple-300">{currentGradingScale.university}</strong>
        </p>
      </div>

      {/* Grading Scale Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider dark:text-slate-300">
              Grading Scale Table
            </h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800/40">
            {currentGradingScale.grades.length} Grades
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-purple-900/30">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-600 dark:bg-[#180d33] dark:border-purple-900/40 dark:text-slate-400">
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3 text-center">GPA</th>
                <th className="py-2.5 px-3 text-right">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono dark:divide-purple-900/20">
              {currentGradingScale.grades.map((item) => (
                <tr
                  key={item.grade}
                  className="hover:bg-purple-50/40 transition-colors dark:hover:bg-purple-950/20"
                >
                  <td className="py-2 px-3 font-sans font-bold text-purple-700 dark:text-purple-300">
                    {item.grade}
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-slate-900 dark:text-slate-200">
                    {item.gpa.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">
                    {item.minMarks}–{item.maxMarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Degree Classification Thresholds Quick View */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider dark:text-slate-300">
            Classification Thresholds
          </h4>
        </div>

        <div className="space-y-2 text-xs">
          {classificationRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 dark:bg-[#180c33] dark:border-purple-900/30 dark:text-slate-300"
            >
              <span className="font-semibold truncate">
                {rule.name}
              </span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-300 ml-2">
                ≥ {rule.minGPA.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

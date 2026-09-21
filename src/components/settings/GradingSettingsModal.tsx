import React from 'react';
import { X, Sliders, Check, RotateCcw } from 'lucide-react';
import { ClassificationRule, GradingScale } from '../../types/academic';
import { AVAILABLE_GRADING_SCALES } from '../../lib/defaultConfig';

interface GradingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGradingScale: GradingScale;
  onSelectGradingScale: (scale: GradingScale) => void;
  classificationRules: ClassificationRule[];
  onUpdateClassificationRule: (id: string, minGPA: number) => void;
  onResetClassificationRules: () => void;
}

export const GradingSettingsModal: React.FC<GradingSettingsModalProps> = ({
  isOpen,
  onClose,
  currentGradingScale,
  onSelectGradingScale,
  classificationRules,
  onUpdateClassificationRule,
  onResetClassificationRules,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto dark:bg-[#120826] dark:border-purple-800/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-purple-900/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/40">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              University Presets & Classification Configuration
            </h3>
            <p className="text-xs text-purple-700 dark:text-purple-300/80 font-semibold">
              Configure university grading scales and degree class GPA cutoffs
            </p>
          </div>
        </div>

        {/* University Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Select University Scale Preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AVAILABLE_GRADING_SCALES.map((scale) => {
              const isSelected = currentGradingScale.id === scale.id;
              return (
                <button
                  key={scale.id}
                  onClick={() => onSelectGradingScale(scale)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-sm dark:bg-purple-900/40 dark:border-purple-500 dark:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50/50 hover:border-purple-300 dark:bg-[#180c33] dark:border-purple-900/30 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{scale.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                  </div>
                  <span className="text-[11px] text-purple-700 dark:text-purple-300/70 block mt-1 font-medium">
                    {scale.university}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configurable Degree Classification Thresholds */}
        <div className="mb-6 pt-4 border-t border-slate-200 dark:border-purple-900/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Degree Classification Cutoffs
              </h4>
              <p className="text-[11px] text-slate-500">
                Minimum cumulative GPA required for each honour classification
              </p>
            </div>
            <button
              onClick={onResetClassificationRules}
              className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-400 hover:text-purple-900 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to UGC Standard</span>
            </button>
          </div>

          <div className="space-y-3">
            {classificationRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#180c33] dark:border-purple-900/30"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {rule.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {rule.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">≥</span>
                  <input
                    type="number"
                    min="0"
                    max="4.0"
                    step="0.05"
                    value={rule.minGPA}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        onUpdateClassificationRule(rule.id, val);
                      }
                    }}
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-purple-700 text-xs focus:outline-none focus:border-purple-600 dark:bg-[#120826] dark:border-purple-900/60 dark:text-purple-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

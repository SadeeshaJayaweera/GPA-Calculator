import React from 'react';
import { Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { GradingScale, Subject } from '../../types/academic';
import { getGradePoint, calculateSubjectWeightedPoints } from '../../lib/gpaCalculator';

interface SubjectTableProps {
  subjects: Subject[];
  gradingScale: GradingScale;
  onAddSubject: () => void;
  onUpdateSubject: (id: string, updates: Partial<Subject>) => void;
  onRemoveSubject: (id: string) => void;
  onLoadSampleData: () => void;
}

export const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  gradingScale,
  onAddSubject,
  onUpdateSubject,
  onRemoveSubject,
  onLoadSampleData,
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-6 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-transparent">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Subject & Module Entries
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300/70">
              Enter credits and select grades. GPA and points update in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={onAddSubject}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-purple-800/40 dark:bg-purple-950/10">
          <BookOpen className="w-10 h-10 text-purple-400/60 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Start building your academic record
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Add your semester modules and credit values to calculate your exact weighted GPA.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onAddSubject}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Your First Subject
            </button>
            <button
              onClick={onLoadSampleData}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-purple-50 hover:text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/50 transition-colors"
            >
              Load Sample Data
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/80 dark:bg-transparent dark:border-purple-900/40 dark:text-purple-300/80">
                  <th className="py-2.5 px-3 rounded-l-lg">Subject / Module Name</th>
                  <th className="py-2.5 px-3 text-center w-28">Credits</th>
                  <th className="py-2.5 px-3 text-center w-36">Grade</th>
                  <th className="py-2.5 px-3 text-center w-28">Grade Point</th>
                  <th className="py-2.5 px-3 text-center w-32">Weighted Pts</th>
                  <th className="py-2.5 px-3 text-center w-16 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs dark:divide-purple-900/20">
                {subjects.map((subject, index) => {
                  const gp = getGradePoint(subject.grade, gradingScale);
                  const weighted = calculateSubjectWeightedPoints(subject.credits, gp);
                  return (
                    <tr
                      key={subject.id}
                      className="group hover:bg-purple-50/40 transition-colors dark:hover:bg-purple-950/20"
                    >
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={subject.name}
                          placeholder={`Module ${index + 1} (e.g. Database Systems)`}
                          onChange={(e) => onUpdateSubject(subject.id, { name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-colors dark:bg-[#170c30] dark:border-purple-900/50 dark:text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min="0.5"
                          max="30"
                          step="0.5"
                          value={subject.credits || ''}
                          placeholder="Credits"
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onUpdateSubject(subject.id, { credits: isNaN(val) ? 0 : val });
                          }}
                          className="w-20 mx-auto text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-colors dark:bg-[#170c30] dark:border-purple-900/50 dark:text-white"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={subject.grade}
                          onChange={(e) => onUpdateSubject(subject.id, { grade: e.target.value })}
                          className="w-32 mx-auto bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-purple-700 font-bold focus:bg-white focus:outline-none focus:border-purple-600 transition-colors dark:bg-[#170c30] dark:border-purple-900/50 dark:text-purple-300"
                        >
                          {gradingScale.grades.map((g) => (
                            <option key={g.grade} value={g.grade} className="bg-white text-slate-900 dark:bg-[#120826] dark:text-white">
                              {g.grade} — {g.gpa.toFixed(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {gp.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-purple-700 dark:text-purple-400">
                        {weighted.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onRemoveSubject(subject.id)}
                          title="Remove subject"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden space-y-3">
            {subjects.map((subject, index) => {
              const gp = getGradePoint(subject.grade, gradingScale);
              const weighted = calculateSubjectWeightedPoints(subject.credits, gp);
              return (
                <div
                  key={subject.id}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2.5 dark:bg-[#170c30] dark:border-purple-900/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={subject.name}
                      placeholder={`Module ${index + 1}`}
                      onChange={(e) => onUpdateSubject(subject.id, { name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium dark:bg-[#120826] dark:border-purple-900/60 dark:text-white"
                    />
                    <button
                      onClick={() => onRemoveSubject(subject.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Credits
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={subject.credits || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          onUpdateSubject(subject.id, { credits: isNaN(val) ? 0 : val });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold dark:bg-[#120826] dark:border-purple-900/60 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Grade
                      </label>
                      <select
                        value={subject.grade}
                        onChange={(e) => onUpdateSubject(subject.id, { grade: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-purple-700 font-bold dark:bg-[#120826] dark:border-purple-900/60 dark:text-purple-300"
                      >
                        {gradingScale.grades.map((g) => (
                          <option key={g.grade} value={g.grade} className="bg-white text-slate-900 dark:bg-[#120826] dark:text-white">
                            {g.grade} ({g.gpa.toFixed(1)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-purple-900/30 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <span>Grade Point: <strong className="text-slate-900 dark:text-white">{gp.toFixed(1)}</strong></span>
                    <span>Weighted Pts: <strong className="text-purple-700 dark:text-purple-400 font-bold">{weighted.toFixed(1)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-purple-900/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Positive credits required for weighted calculations</span>
            </div>
            <button
              onClick={onAddSubject}
              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add another subject</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

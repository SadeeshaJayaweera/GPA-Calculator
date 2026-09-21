import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, Layers } from 'lucide-react';
import { GradingScale, Semester } from '../../types/academic';
import { calculateSemesterGPA } from '../../lib/gpaCalculator';

interface SemesterManagerProps {
  semesters: Semester[];
  activeSemesterId: string | 'all';
  setActiveSemesterId: (id: string | 'all') => void;
  gradingScale: GradingScale;
  onAddSemester: (name?: string) => void;
  onRemoveSemester: (id: string) => void;
  onRenameSemester: (id: string, newName: string) => void;
}

export const SemesterManager: React.FC<SemesterManagerProps> = ({
  semesters,
  activeSemesterId,
  setActiveSemesterId,
  gradingScale,
  onAddSemester,
  onRemoveSemester,
  onRenameSemester,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startRename = (sem: Semester) => {
    setEditingId(sem.id);
    setEditingName(sem.name);
  };

  const saveRename = (id: string) => {
    if (editingName.trim()) {
      onRenameSemester(id, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 mb-6 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-white">
            Semester Selection & Organization
          </h3>
        </div>

        <button
          onClick={() => onAddSemester()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition-colors self-start sm:self-auto dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 dark:border-purple-800/40"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Semester</span>
        </button>
      </div>

      {/* Grid Mode Selector Buttons (Inspired by Sri Lankan University Layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {/* All Semesters (Cumulative Mode) */}
        <button
          onClick={() => setActiveSemesterId('all')}
          className={`relative p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
            activeSemesterId === 'all'
              ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/30 scale-[1.02]'
              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/50 dark:bg-[#180d33] dark:border-purple-900/40 dark:text-slate-300'
          }`}
        >
          <div>
            <div className="text-xs font-bold truncate">All Semesters</div>
            <div className="text-[10px] opacity-80 mt-0.5">Degree CGPA Mode</div>
          </div>
          <div className="mt-2 text-[10px] font-mono opacity-90">
            {semesters.length} Semesters Total
          </div>
        </button>

        {/* Individual Semesters */}
        {semesters.map((sem) => {
          const semGPA = calculateSemesterGPA(sem.subjects, gradingScale);
          const isSelected = activeSemesterId === sem.id;
          const semCredits = sem.subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);

          return (
            <div
              key={sem.id}
              onClick={() => setActiveSemesterId(sem.id)}
              className={`group relative p-3 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/30 scale-[1.02]'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/50 dark:bg-[#170c30] dark:border-purple-900/40 dark:text-slate-300'
              }`}
            >
              {editingId === sem.id ? (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs px-2 py-1 rounded border border-purple-500 focus:outline-none dark:bg-[#0d051c] dark:text-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename(sem.id);
                    }}
                  />
                  <button
                    onClick={() => saveRename(sem.id)}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <div className="text-xs font-bold truncate max-w-[110px]" title={sem.name}>
                      {sem.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-purple-300/70 mt-0.5">
                      {sem.subjects.length} modules • {semCredits} cr
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(sem);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded"
                      title="Rename semester"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {semesters.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSemester(sem.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete semester"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200 dark:border-purple-900/30 font-mono">
                <span className={`text-[10px] ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>GPA:</span>
                <span className={`font-bold ${isSelected ? 'text-white' : semGPA >= 3.7 ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-700 dark:text-purple-300'}`}>
                  {semGPA.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

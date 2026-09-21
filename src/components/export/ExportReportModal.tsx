import React, { useState } from 'react';
import { X, Printer, Copy, Check, Download, FileText } from 'lucide-react';
import { ClassificationRule, GradingScale, Semester } from '../../types/academic';
import { calculateSemesterGPA, calculateSubjectWeightedPoints, getGradePoint } from '../../lib/gpaCalculator';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesters: Semester[];
  gradingScale: GradingScale;
  cgpa: number;
  totalCredits: number;
  totalWeightedPoints: number;
  classification: ClassificationRule;
  universityName: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  semesters,
  gradingScale,
  cgpa,
  totalCredits,
  totalWeightedPoints,
  classification,
  universityName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `🎓 Sri Lankan University Academic Performance Summary
Institution: ${universityName}
Cumulative GPA (CGPA): ${cgpa.toFixed(2)} / 4.00
Predicted Degree Classification: ${classification.name}
Total Completed Credits: ${totalCredits}
Total Weighted Points: ${totalWeightedPoints}
Semesters Recorded: ${semesters.length}
Generated via GPA Mate LK (Developed by Sadeesha Jayaweera)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    let csv = 'Semester,Subject Name,Credits,Grade,Grade Point,Weighted Points\n';

    semesters.forEach((sem) => {
      sem.subjects.forEach((subj) => {
        const gp = getGradePoint(subj.grade, gradingScale);
        const weighted = calculateSubjectWeightedPoints(subj.credits, gp);
        csv += `"${sem.name}","${subj.name.replace(/"/g, '""')}",${subj.credits},"${subj.grade}",${gp.toFixed(1)},${weighted.toFixed(1)}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Academic_Transcript_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto dark:bg-[#120826] dark:border-purple-800/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-purple-900/30 transition-colors no-print"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic Transcript Summary Report
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300/80 font-semibold">
                Official credit-weighted GPA summary ready for export or printing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors dark:bg-[#1c0d3a] dark:border-purple-800/40 dark:text-purple-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors dark:bg-[#1c0d3a] dark:border-purple-800/40 dark:text-purple-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Academic Summary Sheet */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-800 dark:bg-[#0d051c] dark:border-purple-900/40 dark:text-slate-200">
          <div className="border-b border-slate-200 dark:border-purple-900/40 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Academic Transcript & GPA Record
              </h2>
              <p className="text-xs text-purple-700 dark:text-purple-300/80 font-bold">
                {universityName} • Sri Lankan Undergraduate Academic Model
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
              <div>Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
              <div>System: {gradingScale.name}</div>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#160b30] dark:border-purple-900/40 mb-6 font-mono">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Cumulative GPA</div>
              <div className="text-xl font-extrabold text-purple-700 dark:text-purple-300">{cgpa.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Degree Class</div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{classification.name}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Total Credits</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-200">{totalCredits}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Weighted Points</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-200">{totalWeightedPoints}</div>
            </div>
          </div>

          {/* Breakdown per semester */}
          <div className="space-y-6">
            {semesters.map((sem) => {
              const semGPA = calculateSemesterGPA(sem.subjects, gradingScale);
              const semCredits = sem.subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
              return (
                <div key={sem.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold border-b border-slate-200 dark:border-purple-900/30 pb-1">
                    <span className="text-purple-700 dark:text-purple-300">{sem.name}</span>
                    <span className="text-slate-500">
                      Credits: {semCredits} | Semester GPA: {semGPA.toFixed(2)}
                    </span>
                  </div>

                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-[10px] uppercase text-slate-500 font-bold bg-slate-50/50">
                        <th className="py-1 px-1">Subject</th>
                        <th className="py-1 text-center w-16">Credits</th>
                        <th className="py-1 text-center w-16">Grade</th>
                        <th className="py-1 text-right w-20 px-1">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono dark:divide-purple-900/10">
                      {sem.subjects.map((subj) => {
                        const gp = getGradePoint(subj.grade, gradingScale);
                        const weighted = calculateSubjectWeightedPoints(subj.credits, gp);
                        return (
                          <tr key={subj.id}>
                            <td className="py-1.5 px-1 font-sans text-slate-900 dark:text-slate-200 font-medium">{subj.name || 'Untitled Module'}</td>
                            <td className="py-1.5 text-center">{subj.credits}</td>
                            <td className="py-1.5 text-center font-bold text-purple-700 dark:text-purple-300">{subj.grade}</td>
                            <td className="py-1.5 text-right px-1">{weighted.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-purple-900/30 flex justify-between items-center text-[10px] text-slate-500 font-medium">
            <span>Formula: CGPA = Σ(Credits × Grade Points) / Σ(Credits)</span>
            <span>Developed by Sadeesha Jayaweera • GPA Mate LK</span>
          </div>
        </div>
      </div>
    </div>
  );
};

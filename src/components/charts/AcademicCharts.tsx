import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { GradingScale, Semester } from '../../types/academic';
import { calculateSemesterGPA } from '../../lib/gpaCalculator';

interface AcademicChartsProps {
  semesters: Semester[];
  gradingScale: GradingScale;
  completedCredits: number;
  remainingCredits: number;
}

export const AcademicCharts: React.FC<AcademicChartsProps> = ({
  semesters,
  gradingScale,
  completedCredits,
  remainingCredits,
}) => {
  // 1. Semester progression data
  const semesterProgression = semesters.map((sem) => {
    const semGPA = calculateSemesterGPA(sem.subjects, gradingScale);
    return {
      name: sem.name.replace('Year ', 'Y').replace('Semester ', 'S'),
      fullName: sem.name,
      gpa: semGPA,
      target: 3.7, // First class benchmark line
    };
  });

  // 2. Grade distribution counts
  const gradeCounts: Record<string, number> = {};
  gradingScale.grades.forEach((g) => {
    gradeCounts[g.grade] = 0;
  });

  semesters.forEach((sem) => {
    sem.subjects.forEach((subj) => {
      if (subj.grade && gradeCounts[subj.grade] !== undefined) {
        gradeCounts[subj.grade] += 1;
      }
    });
  });

  const gradeDistributionData = Object.entries(gradeCounts)
    .filter(([_, count]) => count > 0)
    .map(([grade, count]) => ({
      grade,
      count,
    }));

  const GRADE_COLORS: Record<string, string> = {
    'A+': '#10b981',
    A: '#059669',
    'A-': '#34d399',
    'B+': '#6366f1',
    B: '#8b5cf6',
    'B-': '#a855f7',
    'C+': '#d97706',
    C: '#f59e0b',
    'C-': '#fbbf24',
    'D+': '#f87171',
    D: '#ef4444',
    E: '#dc2626',
    F: '#991b1b',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* 1. Semester GPA Trajectory Line Chart */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs uppercase font-bold text-slate-800 tracking-wider dark:text-slate-300">
              GPA Progression by Semester
            </h4>
          </div>
          <span className="text-[11px] text-purple-700 dark:text-purple-400 font-bold">Benchmark: 3.70 (1st Class)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={semesterProgression} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 4.0]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 4 }}
                activeDot={{ r: 6, fill: '#ec4899' }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Grade Distribution Bar Chart */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs dark:bg-[#120826] dark:border-purple-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs uppercase font-bold text-slate-800 tracking-wider dark:text-slate-300">
              Grade Distribution
            </h4>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            <span>Modules: {completedCredits > 0 ? semesters.flatMap((s) => s.subjects).length : 0}</span>
            <span>•</span>
            <span className="text-purple-700 dark:text-purple-300">
              {completedCredits} / {completedCredits + remainingCredits} Credits
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          {gradeDistributionData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No grade distribution data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="grade" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeDistributionData.map((entry) => (
                    <Cell
                      key={entry.grade}
                      fill={GRADE_COLORS[entry.grade] || '#9333ea'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

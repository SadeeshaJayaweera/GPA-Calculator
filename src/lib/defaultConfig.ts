import { ClassificationRule, GradingScale, Semester } from '../types/academic';

export const DEFAULT_UGC_GRADES = [
  { grade: 'A+', gpa: 4.0, minMarks: 90, maxMarks: 100, description: 'Outstanding' },
  { grade: 'A',  gpa: 4.0, minMarks: 80, maxMarks: 89,  description: 'Excellent' },
  { grade: 'A-', gpa: 3.7, minMarks: 75, maxMarks: 79,  description: 'Very Good' },
  { grade: 'B+', gpa: 3.3, minMarks: 70, maxMarks: 74,  description: 'Good' },
  { grade: 'B',  gpa: 3.0, minMarks: 65, maxMarks: 69,  description: 'Satisfactory' },
  { grade: 'B-', gpa: 2.7, minMarks: 60, maxMarks: 64,  description: 'Pass Fair' },
  { grade: 'C+', gpa: 2.3, minMarks: 55, maxMarks: 59,  description: 'Pass' },
  { grade: 'C',  gpa: 2.0, minMarks: 45, maxMarks: 54,  description: 'Pass Borderline' },
  { grade: 'C-', gpa: 1.7, minMarks: 40, maxMarks: 44,  description: 'Conditional Pass' },
  { grade: 'D+', gpa: 1.3, minMarks: 35, maxMarks: 39,  description: 'Deficiency' },
  { grade: 'D',  gpa: 1.0, minMarks: 30, maxMarks: 34,  description: 'Deficiency Pass' },
  { grade: 'E',  gpa: 0.0, minMarks: 0,  maxMarks: 29,  description: 'Fail' },
];

export const AVAILABLE_GRADING_SCALES: GradingScale[] = [
  {
    id: 'ugc-standard',
    name: 'Sri Lankan UGC Standard (General)',
    university: 'Sri Lankan UGC Standard',
    isDefault: true,
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'sliit-scale',
    name: 'SLIIT Standard Grading',
    university: 'Sri Lanka Institute of Information Technology',
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'nsbm-scale',
    name: 'NSBM Green University Scale',
    university: 'NSBM Green University',
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'uoc-scale',
    name: 'University of Colombo (UCSC / Science)',
    university: 'University of Colombo',
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'uom-scale',
    name: 'University of Moratuwa (Engineering / FIT)',
    university: 'University of Moratuwa',
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'iit-scale',
    name: 'IIT / University of Westminster',
    university: 'Informatics Institute of Technology',
    grades: [
      { grade: 'A+', gpa: 4.0, minMarks: 85, maxMarks: 100, description: 'First Class High' },
      { grade: 'A',  gpa: 4.0, minMarks: 70, maxMarks: 84,  description: 'First Class' },
      { grade: 'B+', gpa: 3.3, minMarks: 65, maxMarks: 69,  description: 'Upper Second High' },
      { grade: 'B',  gpa: 3.0, minMarks: 60, maxMarks: 64,  description: 'Upper Second' },
      { grade: 'C+', gpa: 2.3, minMarks: 55, maxMarks: 59,  description: 'Lower Second High' },
      { grade: 'C',  gpa: 2.0, minMarks: 50, maxMarks: 54,  description: 'Lower Second' },
      { grade: 'D',  gpa: 1.0, minMarks: 40, maxMarks: 49,  description: 'Third Class' },
      { grade: 'F',  gpa: 0.0, minMarks: 0,  maxMarks: 39,  description: 'Fail' },
    ],
  },
  {
    id: 'usj-scale',
    name: 'University of Sri Jayewardenepura',
    university: 'USJ',
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'uok-scale',
    name: 'University of Kelaniya',
    university: 'UOK',
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'pera-scale',
    name: 'University of Peradeniya',
    university: 'UOP',
    grades: DEFAULT_UGC_GRADES,
  },
  {
    id: 'ruhuna-scale',
    name: 'University of Ruhuna',
    university: 'UOR',
    grades: DEFAULT_UGC_GRADES,
  },
];

export const DEFAULT_CLASSIFICATION_RULES: ClassificationRule[] = [
  {
    id: 'first-class',
    name: 'First Class Honours',
    minGPA: 3.70,
    maxGPA: 4.00,
    badgeColor: 'emerald',
    description: 'Highest academic honour (GPA 3.70 - 4.00)',
  },
  {
    id: 'second-upper',
    name: 'Second Class (Upper Division)',
    minGPA: 3.30,
    maxGPA: 3.69,
    badgeColor: 'purple',
    description: 'Meritorious academic standing (GPA 3.30 - 3.69)',
  },
  {
    id: 'second-lower',
    name: 'Second Class (Lower Division)',
    minGPA: 3.00,
    maxGPA: 3.29,
    badgeColor: 'blue',
    description: 'Good academic standing (GPA 3.00 - 3.29)',
  },
  {
    id: 'general-pass',
    name: 'General Pass',
    minGPA: 2.00,
    maxGPA: 2.99,
    badgeColor: 'amber',
    description: 'Minimum graduation requirement (GPA 2.00 - 2.99)',
  },
  {
    id: 'fail',
    name: 'Academic Probation / Fail',
    minGPA: 0.00,
    maxGPA: 1.99,
    badgeColor: 'rose',
    description: 'Below minimum required academic standing',
  },
];

export const SAMPLE_SEMESTERS: Semester[] = [
  {
    id: 'sem-1',
    name: 'Year 1 — Semester 1',
    year: 1,
    semesterNumber: 1,
    subjects: [
      { id: 's1', code: 'CS101', name: 'Mathematics for Computing', credits: 3, grade: 'A' },
      { id: 's2', code: 'CS102', name: 'Programming in C / C++', credits: 3, grade: 'A' },
      { id: 's3', code: 'CS103', name: 'Database Management Systems', credits: 3, grade: 'B+' },
      { id: 's4', code: 'CS104', name: 'Computer Systems Architecture', credits: 3, grade: 'A-' },
      { id: 's5', code: 'EN101', name: 'Academic Writing & Communication', credits: 2, grade: 'A' },
      { id: 's6', code: 'PD101', name: 'Personal Development & Professional Ethics', credits: 2, grade: 'B' },
    ],
  },
  {
    id: 'sem-2',
    name: 'Year 1 — Semester 2',
    year: 1,
    semesterNumber: 2,
    subjects: [
      { id: 's7', code: 'CS201', name: 'Data Structures & Algorithms', credits: 3, grade: 'A' },
      { id: 's8', code: 'CS202', name: 'Object Oriented Programming (Java)', credits: 3, grade: 'A-' },
      { id: 's9', code: 'CS203', name: 'Web Application Development', credits: 3, grade: 'A+' },
      { id: 's10', code: 'CS204', name: 'Operating Systems & Networking', credits: 3, grade: 'B+' },
      { id: 's11', code: 'MA201', name: 'Discrete Mathematics & Statistics', credits: 3, grade: 'A-' },
    ],
  },
];

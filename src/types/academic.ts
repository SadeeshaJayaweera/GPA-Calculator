export interface GradeItem {
  grade: string;
  gpa: number;
  minMarks: number;
  maxMarks: number;
  description?: string;
}

export interface GradingScale {
  id: string;
  name: string;
  university: string;
  isDefault?: boolean;
  grades: GradeItem[];
}

export interface ClassificationRule {
  id: string;
  name: string;
  minGPA: number;
  maxGPA: number;
  badgeColor: string; // Tailwind color token or hex
  description: string;
}

export interface Subject {
  id: string;
  code?: string;
  name: string;
  credits: number;
  grade: string;
  isCompleted?: boolean;
  attemptNumber?: number;
  countsTowardGPA?: boolean;
}

export interface Semester {
  id: string;
  name: string;
  year: number;
  semesterNumber: number;
  subjects: Subject[];
}

export interface AcademicProfile {
  university: string;
  degree: string;
  targetCGPA: number;
  gradingScaleId: string;
  semesters: Semester[];
  customClassRules?: ClassificationRule[];
}

export interface TargetCalculationResult {
  currentCGPA: number;
  completedCredits: number;
  remainingCredits: number;
  targetCGPA: number;
  requiredFutureGPA: number;
  maxPossibleCGPA: number;
  isAchievable: boolean;
  message: string;
}

export interface ScenarioModule {
  id: string;
  name: string;
  credits: number;
  expectedGrade: string;
}

export interface FeasibleScenario {
  id: string;
  description: string;
  averageRequiredGPA: number;
  projectedCGPA: number;
  feasibilityRating: 'Very Feasible' | 'Balanced' | 'Demanding' | 'Maximum Effort';
  grades: {
    subjectName: string;
    credits: number;
    grade: string;
    gradePoint: number;
  }[];
}

export interface AIAdvisorRequest {
  currentCGPA: number;
  completedCredits: number;
  remainingCredits: number;
  targetCGPA: number;
  targetClass?: string;
  university: string;
  degree: string;
  userMessage: string;
  semestersSummary?: {
    name: string;
    credits: number;
    gpa: number;
  }[];
  upcomingSubjects?: {
    name: string;
    credits: number;
  }[];
}

export interface AIAdvisorResponse {
  answer: string;
  mathematicalSummary: {
    currentCGPA: number;
    completedCredits: number;
    remainingCredits: number;
    requiredFutureGPA: number;
    maxPossibleCGPA: number;
    isAchievable: boolean;
  };
  recommendations: string[];
}

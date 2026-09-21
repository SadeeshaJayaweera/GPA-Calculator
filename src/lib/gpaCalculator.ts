import {
  ClassificationRule,
  FeasibleScenario,
  GradingScale,
  Semester,
  Subject,
  TargetCalculationResult,
} from '../types/academic';

/**
 * Gets the numeric GPA grade point for a given letter grade from the grading scale.
 */
export function getGradePoint(grade: string, gradingScale: GradingScale): number {
  const match = gradingScale.grades.find(
    (g) => g.grade.trim().toUpperCase() === grade.trim().toUpperCase()
  );
  return match ? match.gpa : 0.0;
}

/**
 * Calculates weighted quality points for a single subject:
 * Weighted Points = Credits * Grade Point
 */
export function calculateSubjectWeightedPoints(credits: number, gradePoint: number): number {
  if (isNaN(credits) || credits <= 0 || isNaN(gradePoint)) {
    return 0;
  }
  return Number((credits * gradePoint).toFixed(4));
}

/**
 * Calculates GPA for a collection of subjects in a semester.
 * Returns 0 if total credits are 0.
 */
export function calculateSemesterGPA(subjects: Subject[], gradingScale: GradingScale): number {
  const validSubjects = subjects.filter(
    (s) => s.countsTowardGPA !== false && s.credits > 0 && s.grade
  );

  if (validSubjects.length === 0) {
    return 0;
  }

  let totalWeighted = 0;
  let totalCredits = 0;

  for (const subject of validSubjects) {
    const point = getGradePoint(subject.grade, gradingScale);
    totalWeighted += subject.credits * point;
    totalCredits += subject.credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return Number((totalWeighted / totalCredits).toFixed(4));
}

/**
 * Calculates Cumulative GPA (CGPA) across all completed semesters.
 * CRITICAL RULE: CGPA is calculated from all subject-level weighted points,
 * NOT by averaging semester GPAs.
 * CGPA = Σ(all subject credit × grade point) / Σ(all subject credits)
 */
export function calculateCGPA(semesters: Semester[], gradingScale: GradingScale): number {
  let totalWeighted = 0;
  let totalCredits = 0;

  for (const sem of semesters) {
    for (const subject of sem.subjects) {
      if (subject.countsTowardGPA !== false && subject.credits > 0 && subject.grade) {
        const point = getGradePoint(subject.grade, gradingScale);
        totalWeighted += subject.credits * point;
        totalCredits += subject.credits;
      }
    }
  }

  if (totalCredits === 0) {
    return 0;
  }

  return Number((totalWeighted / totalCredits).toFixed(4));
}

/**
 * Calculates total credits across all semesters.
 */
export function calculateTotalCredits(semesters: Semester[]): number {
  let credits = 0;
  for (const sem of semesters) {
    for (const subject of sem.subjects) {
      if (subject.countsTowardGPA !== false && subject.credits > 0 && subject.grade) {
        credits += Number(subject.credits) || 0;
      }
    }
  }
  return Number(credits.toFixed(1));
}

/**
 * Calculates total completed subjects count.
 */
export function calculateCompletedSubjectsCount(semesters: Semester[]): number {
  let count = 0;
  for (const sem of semesters) {
    for (const subject of sem.subjects) {
      if (subject.credits > 0 && subject.grade) {
        count += 1;
      }
    }
  }
  return count;
}

/**
 * Calculates total weighted points across all semesters.
 */
export function calculateTotalWeightedPoints(
  semesters: Semester[],
  gradingScale: GradingScale
): number {
  let weighted = 0;
  for (const sem of semesters) {
    for (const subject of sem.subjects) {
      if (subject.countsTowardGPA !== false && subject.credits > 0 && subject.grade) {
        const point = getGradePoint(subject.grade, gradingScale);
        weighted += subject.credits * point;
      }
    }
  }
  return Number(weighted.toFixed(2));
}

/**
 * Determines Degree Classification based on CGPA and configuration rules.
 */
export function calculateClassification(
  cgpa: number,
  rules: ClassificationRule[]
): ClassificationRule {
  const sorted = [...rules].sort((a, b) => b.minGPA - a.minGPA);
  for (const rule of sorted) {
    if (cgpa >= rule.minGPA) {
      return rule;
    }
  }
  return sorted[sorted.length - 1];
}

/**
 * Finds the next higher classification target and points required.
 */
export function getNextClassificationTarget(
  cgpa: number,
  rules: ClassificationRule[]
): { nextRule: ClassificationRule | null; pointsNeeded: number } {
  const sorted = [...rules].sort((a, b) => a.minGPA - b.minGPA);
  for (const rule of sorted) {
    if (rule.minGPA > cgpa) {
      return {
        nextRule: rule,
        pointsNeeded: Number((rule.minGPA - cgpa).toFixed(2)),
      };
    }
  }
  return { nextRule: null, pointsNeeded: 0 };
}

/**
 * Calculates maximum possible CGPA if student scores 4.0 in all remaining credits.
 */
export function calculateMaximumPossibleCGPA(
  currentCGPA: number,
  completedCredits: number,
  remainingCredits: number
): number {
  const currentWeighted = currentCGPA * completedCredits;
  const totalFutureCredits = completedCredits + remainingCredits;
  if (totalFutureCredits === 0) return 0;
  return Number(((currentWeighted + remainingCredits * 4.0) / totalFutureCredits).toFixed(2));
}

/**
 * Calculates required future GPA and maximum achievable CGPA for target CGPA.
 * Formula:
 * Required Future GPA = (Target CGPA × (Current Credits + Remaining Credits) − Current Weighted Points) / Remaining Credits
 * Maximum CGPA = (Current Weighted Points + Remaining Credits × 4.0) / (Current Credits + Remaining Credits)
 */
export function calculateRequiredFutureGPA(
  currentCGPA: number,
  completedCredits: number,
  remainingCredits: number,
  targetCGPA: number
): TargetCalculationResult {
  const currentWeighted = currentCGPA * completedCredits;

  if (remainingCredits <= 0) {
    const isMet = currentCGPA >= targetCGPA;
    return {
      currentCGPA: Number(currentCGPA.toFixed(2)),
      completedCredits,
      remainingCredits: 0,
      targetCGPA: Number(targetCGPA.toFixed(2)),
      requiredFutureGPA: 0,
      maxPossibleCGPA: Number(currentCGPA.toFixed(2)),
      isAchievable: isMet,
      message: isMet
        ? `You have already achieved your target CGPA of ${targetCGPA.toFixed(2)} with your current ${currentCGPA.toFixed(2)} CGPA!`
        : `No remaining credits entered. Current CGPA is ${currentCGPA.toFixed(2)}. Add upcoming credits to plan.`,
    };
  }

  const totalFutureCredits = completedCredits + remainingCredits;
  const maxPossibleCGPA = calculateMaximumPossibleCGPA(currentCGPA, completedCredits, remainingCredits);

  const rawRequired =
    (targetCGPA * totalFutureCredits - currentWeighted) / remainingCredits;
  const requiredFutureGPA = Number(rawRequired.toFixed(2));

  if (rawRequired > 4.0) {
    return {
      currentCGPA: Number(currentCGPA.toFixed(2)),
      completedCredits,
      remainingCredits,
      targetCGPA: Number(targetCGPA.toFixed(2)),
      requiredFutureGPA,
      maxPossibleCGPA,
      isAchievable: false,
      message: `Even with a perfect 4.00 GPA in all remaining ${remainingCredits} credits, your maximum achievable CGPA is ${maxPossibleCGPA.toFixed(2)}. The target of ${targetCGPA.toFixed(2)} cannot be reached.`,
    };
  }

  if (rawRequired <= 0) {
    return {
      currentCGPA: Number(currentCGPA.toFixed(2)),
      completedCredits,
      remainingCredits,
      targetCGPA: Number(targetCGPA.toFixed(2)),
      requiredFutureGPA: 0.0,
      maxPossibleCGPA,
      isAchievable: true,
      message: `Your current academic credit base is strong enough that you will maintain at least ${targetCGPA.toFixed(2)} CGPA even with minimum pass grades across the remaining ${remainingCredits} credits.`,
    };
  }

  return {
    currentCGPA: Number(currentCGPA.toFixed(2)),
    completedCredits,
    remainingCredits,
    targetCGPA: Number(targetCGPA.toFixed(2)),
    requiredFutureGPA,
    maxPossibleCGPA,
    isAchievable: true,
    message: `You need an average GPA of ${requiredFutureGPA.toFixed(2)} across your remaining ${remainingCredits} credits to graduate with a ${targetCGPA.toFixed(2)} CGPA.`,
  };
}

/**
 * Calculates projected CGPA when simulating future subjects.
 */
export function calculateProjectedCGPA(
  currentWeightedPoints: number,
  currentCredits: number,
  upcomingSubjects: { credits: number; expectedGrade: string }[],
  gradingScale: GradingScale
): { projectedCGPA: number; additionalCredits: number; additionalPoints: number } {
  let additionalPoints = 0;
  let additionalCredits = 0;

  for (const mod of upcomingSubjects) {
    if (mod.credits > 0 && mod.expectedGrade) {
      const gp = getGradePoint(mod.expectedGrade, gradingScale);
      additionalPoints += mod.credits * gp;
      additionalCredits += mod.credits;
    }
  }

  const totalCredits = currentCredits + additionalCredits;
  if (totalCredits === 0) {
    return { projectedCGPA: 0, additionalCredits: 0, additionalPoints: 0 };
  }

  const projectedCGPA = Number(
    ((currentWeightedPoints + additionalPoints) / totalCredits).toFixed(2)
  );

  return {
    projectedCGPA,
    additionalCredits,
    additionalPoints: Number(additionalPoints.toFixed(2)),
  };
}

/**
 * Generates feasible grade combinations for remaining modules to hit a target CGPA.
 */
export function generateGradeScenarios(
  currentCGPA: number,
  completedCredits: number,
  remainingSubjects: { name: string; credits: number }[],
  targetCGPA: number,
  gradingScale: GradingScale
): FeasibleScenario[] {
  const currentWeighted = currentCGPA * completedCredits;
  const remainingCredits = remainingSubjects.reduce((acc, s) => acc + s.credits, 0);

  if (remainingCredits === 0 || remainingSubjects.length === 0) {
    return [];
  }

  const totalCredits = completedCredits + remainingCredits;
  const rawRequiredGPA = (targetCGPA * totalCredits - currentWeighted) / remainingCredits;

  if (rawRequiredGPA > 4.0) {
    return [];
  }

  const scenarios: FeasibleScenario[] = [];

  // Candidate grade distribution patterns
  const patterns: {
    name: string;
    feasibility: FeasibleScenario['feasibilityRating'];
    preferredGrades: string[];
  }[] = [
    {
      name: 'All-Round Excellence (A / A+ Focus)',
      feasibility: 'Maximum Effort',
      preferredGrades: ['A+', 'A', 'A'],
    },
    {
      name: 'High Performance (A / A- Blend)',
      feasibility: 'Demanding',
      preferredGrades: ['A', 'A-', 'B+'],
    },
    {
      name: 'Balanced Strategy (A- / B+ Distribution)',
      feasibility: 'Balanced',
      preferredGrades: ['A-', 'B+', 'B'],
    },
    {
      name: 'Consistent Solid Passing (B+ / B Focus)',
      feasibility: 'Very Feasible',
      preferredGrades: ['B+', 'B', 'B-'],
    },
  ];

  // Available grades sorted descending
  const sortedGrades = [...gradingScale.grades].sort((a, b) => b.gpa - a.gpa);

  // Generate 3 to 4 distinct scenario profiles
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const assignedGrades: FeasibleScenario['grades'] = [];
    let scenarioWeighted = 0;

    // Allocate higher grades to subjects with higher credits to optimize weighted yield
    const sortedSubjects = [...remainingSubjects].sort((a, b) => b.credits - a.credits);

    for (let idx = 0; idx < sortedSubjects.length; idx++) {
      const subj = sortedSubjects[idx];
      const preferredGradeName = pattern.preferredGrades[idx % pattern.preferredGrades.length];
      const matchedGrade =
        sortedGrades.find((g) => g.grade === preferredGradeName) || sortedGrades[1] || sortedGrades[0];

      const gp = matchedGrade.gpa;
      assignedGrades.push({
        subjectName: subj.name,
        credits: subj.credits,
        grade: matchedGrade.grade,
        gradePoint: gp,
      });
      scenarioWeighted += subj.credits * gp;
    }

    const projectedCGPA = Number(
      ((currentWeighted + scenarioWeighted) / totalCredits).toFixed(2)
    );
    const avgGPA = Number((scenarioWeighted / remainingCredits).toFixed(2));

    if (projectedCGPA >= Number(targetCGPA.toFixed(2)) - 0.05) {
      scenarios.push({
        id: `scenario-${i + 1}`,
        description: pattern.name,
        averageRequiredGPA: avgGPA,
        projectedCGPA,
        feasibilityRating: pattern.feasibility,
        grades: assignedGrades,
      });
    }
  }

  return scenarios;
}

import { describe, it, expect } from 'vitest';
import {
  calculateSubjectWeightedPoints,
  calculateSemesterGPA,
  calculateCGPA,
  calculateTotalCredits,
  calculateClassification,
  calculateRequiredFutureGPA,
  calculateMaximumPossibleCGPA,
  getGradePoint,
} from '../gpaCalculator';
import { AVAILABLE_GRADING_SCALES, DEFAULT_CLASSIFICATION_RULES } from '../defaultConfig';
import { Semester, Subject } from '../../types/academic';

const defaultScale = AVAILABLE_GRADING_SCALES[0]; // UGC Standard

describe('GPA Calculation Engine - Sri Lankan Standards', () => {
  // 1. Single 3-credit A -> 4.0
  it('1. Single 3-credit A produces GPA = 4.0', () => {
    const pts = calculateSubjectWeightedPoints(3, 4.0);
    expect(pts).toBe(12.0);

    const subjects: Subject[] = [
      { id: '1', name: 'Database Systems', credits: 3, grade: 'A' },
    ];
    const gpa = calculateSemesterGPA(subjects, defaultScale);
    expect(gpa).toBe(4.0);
  });

  // 2. 3-credit A + 3-credit B -> 3.5
  it('2. 3-credit A + 3-credit B produces GPA = 3.5', () => {
    const subjects: Subject[] = [
      { id: '1', name: 'Programming', credits: 3, grade: 'A' },
      { id: '2', name: 'Data Structures', credits: 3, grade: 'B' },
    ];
    const gpa = calculateSemesterGPA(subjects, defaultScale);
    // (3*4.0 + 3*3.0) / 6 = 21/6 = 3.5
    expect(gpa).toBe(3.5);
  });

  // 3. 3-credit A + 6-credit B -> (3*4 + 6*3) / 9 = 30 / 9 = 3.3333
  it('3. 3-credit A + 6-credit B produces weighted GPA = 3.33', () => {
    const subjects: Subject[] = [
      { id: '1', name: 'Web Development', credits: 3, grade: 'A' },
      { id: '2', name: 'Software Project', credits: 6, grade: 'B' },
    ];
    const gpa = calculateSemesterGPA(subjects, defaultScale);
    expect(Number(gpa.toFixed(2))).toBe(3.33);
  });

  // 4. A+ and A both produce 4.0
  it('4. Both A+ and A produce 4.0 grade point', () => {
    expect(getGradePoint('A+', defaultScale)).toBe(4.0);
    expect(getGradePoint('A', defaultScale)).toBe(4.0);
    expect(getGradePoint('A-', defaultScale)).toBe(3.7);
    expect(getGradePoint('B+', defaultScale)).toBe(3.3);
  });

  // 5. Zero-credit case does not produce NaN
  it('5. Zero-credit case does not produce NaN or crash', () => {
    const emptySubjects: Subject[] = [];
    expect(calculateSemesterGPA(emptySubjects, defaultScale)).toBe(0);

    const zeroCreditSubjects: Subject[] = [
      { id: '1', name: 'Orientation', credits: 0, grade: 'A' },
    ];
    expect(calculateSemesterGPA(zeroCreditSubjects, defaultScale)).toBe(0);

    const emptySemesters: Semester[] = [];
    expect(calculateCGPA(emptySemesters, defaultScale)).toBe(0);
    expect(calculateTotalCredits(emptySemesters)).toBe(0);
  });

  // 6. Target GPA calculation
  it('6. Target GPA calculation correctly calculates required future GPA', () => {
    // Current CGPA: 3.42, Completed Credits: 90, Remaining Credits: 30, Target CGPA: 3.70
    // Total credits = 120
    // Current weighted = 3.42 * 90 = 307.8
    // Target weighted = 3.70 * 120 = 444
    // Required weighted = 444 - 307.8 = 136.2
    // Required future GPA = 136.2 / 30 = 4.54 -> impossible (> 4.0)
    const resultImpossible = calculateRequiredFutureGPA(3.42, 90, 30, 3.70);
    expect(resultImpossible.isAchievable).toBe(false);

    // Achievable test: Current 3.50, Completed 60, Remaining 60, Target 3.60
    // Current weighted = 3.50 * 60 = 210
    // Target weighted = 3.60 * 120 = 432
    // Needed = 222 / 60 = 3.70
    const resultAchievable = calculateRequiredFutureGPA(3.50, 60, 60, 3.60);
    expect(resultAchievable.isAchievable).toBe(true);
    expect(resultAchievable.requiredFutureGPA).toBe(3.7);
  });

  // 7. Impossible target detection
  it('7. Detects mathematically impossible target GPA', () => {
    const result = calculateRequiredFutureGPA(2.50, 100, 20, 3.70);
    expect(result.isAchievable).toBe(false);
    expect(result.requiredFutureGPA).toBeGreaterThan(4.0);
  });

  // 8. Maximum possible CGPA calculation
  it('8. Maximum possible CGPA calculation is accurate', () => {
    // Current 3.0, Credits 60, Remaining 60
    // (3.0 * 60 + 60 * 4.0) / 120 = (180 + 240) / 120 = 420 / 120 = 3.50
    const maxVal = calculateMaximumPossibleCGPA(3.0, 60, 60);
    expect(maxVal).toBe(3.5);

    const result = calculateRequiredFutureGPA(3.0, 60, 60, 3.80);
    expect(result.maxPossibleCGPA).toBe(3.5);
  });

  // 9. Classification boundaries
  it('9. Classification boundaries adhere to Sri Lankan degree thresholds', () => {
    expect(calculateClassification(3.85, DEFAULT_CLASSIFICATION_RULES).name).toBe('First Class Honours');
    expect(calculateClassification(3.70, DEFAULT_CLASSIFICATION_RULES).name).toBe('First Class Honours');
    expect(calculateClassification(3.69, DEFAULT_CLASSIFICATION_RULES).name).toBe('Second Class (Upper Division)');
    expect(calculateClassification(3.30, DEFAULT_CLASSIFICATION_RULES).name).toBe('Second Class (Upper Division)');
    expect(calculateClassification(3.29, DEFAULT_CLASSIFICATION_RULES).name).toBe('Second Class (Lower Division)');
    expect(calculateClassification(3.00, DEFAULT_CLASSIFICATION_RULES).name).toBe('Second Class (Lower Division)');
    expect(calculateClassification(2.99, DEFAULT_CLASSIFICATION_RULES).name).toBe('General Pass');
    expect(calculateClassification(2.00, DEFAULT_CLASSIFICATION_RULES).name).toBe('General Pass');
    expect(calculateClassification(1.99, DEFAULT_CLASSIFICATION_RULES).name).toBe('Academic Probation / Fail');
  });

  // 10. Multiple semesters (CRITICAL: Weighted sum, not averaging semester GPAs)
  it('10. Multi-semester CGPA is credit-weighted, never an average of semester GPAs', () => {
    // Example from prompt:
    // Semester 1: GPA = 4.0, Credits = 10
    // Semester 2: GPA = 3.0, Credits = 30
    // CGPA is NOT (4.0 + 3.0)/2 = 3.5!
    // Correct: (4.0*10 + 3.0*30)/40 = (40 + 90)/40 = 130/40 = 3.25
    const sem1: Semester = {
      id: 'sem-1',
      name: 'Semester 1',
      year: 1,
      semesterNumber: 1,
      subjects: [
        { id: '1', name: 'Module A', credits: 10, grade: 'A' }, // 10 * 4.0 = 40
      ],
    };

    const sem2: Semester = {
      id: 'sem-2',
      name: 'Semester 2',
      year: 1,
      semesterNumber: 2,
      subjects: [
        { id: '2', name: 'Module B', credits: 30, grade: 'B' }, // 30 * 3.0 = 90
      ],
    };

    const cgpa = calculateCGPA([sem1, sem2], defaultScale);
    expect(cgpa).toBe(3.25);
    expect(cgpa).not.toBe(3.5);
  });

  // 11. Different credit values
  it('11. Supports various credit weights (1-credit, 2-credit, 4-credit, 6-credit modules)', () => {
    const subjects: Subject[] = [
      { id: '1', name: 'Lab 1', credits: 1, grade: 'A' }, // 1 * 4 = 4
      { id: '2', name: 'English', credits: 2, grade: 'B+' }, // 2 * 3.3 = 6.6
      { id: '3', name: 'Core Computing', credits: 4, grade: 'A-' }, // 4 * 3.7 = 14.8
      { id: '4', name: 'Final Project', credits: 6, grade: 'A' }, // 6 * 4 = 24
    ];
    // Total credits = 13
    // Total points = 4 + 6.6 + 14.8 + 24 = 49.4
    // GPA = 49.4 / 13 = 3.80
    const gpa = calculateSemesterGPA(subjects, defaultScale);
    expect(Number(gpa.toFixed(2))).toBe(3.80);
  });

  // 12. Removing a subject updates GPA
  it('12. Removing a subject correctly updates calculated GPA', () => {
    const s1: Subject = { id: '1', name: 'Subj 1', credits: 3, grade: 'A' };
    const s2: Subject = { id: '2', name: 'Subj 2', credits: 3, grade: 'C' }; // 2.0
    const initialList = [s1, s2];
    expect(calculateSemesterGPA(initialList, defaultScale)).toBe(3.0);

    // After removing s2
    const updatedList = [s1];
    expect(calculateSemesterGPA(updatedList, defaultScale)).toBe(4.0);
  });

  // 13. Changing grade updates GPA
  it('13. Changing grade immediately updates GPA', () => {
    const subjects: Subject[] = [
      { id: '1', name: 'Algorithms', credits: 3, grade: 'C' }, // 2.0
    ];
    expect(calculateSemesterGPA(subjects, defaultScale)).toBe(2.0);

    // Student improves to A
    subjects[0].grade = 'A';
    expect(calculateSemesterGPA(subjects, defaultScale)).toBe(4.0);
  });

  // 14. Changing credits updates GPA
  it('14. Changing subject credits updates weighted balance', () => {
    const s1: Subject = { id: '1', name: 'Subj A', credits: 1, grade: 'A' }; // 4.0
    const s2: Subject = { id: '2', name: 'Subj B', credits: 1, grade: 'B' }; // 3.0
    expect(calculateSemesterGPA([s1, s2], defaultScale)).toBe(3.5);

    // Subj A becomes a 3-credit module
    const s1Heavy = { ...s1, credits: 3 };
    // (3*4 + 1*3) / 4 = 15/4 = 3.75
    expect(calculateSemesterGPA([s1Heavy, s2], defaultScale)).toBe(3.75);
  });
});

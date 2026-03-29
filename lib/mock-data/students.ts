/**
 * Mock data for frontend development.
 * 20 students with varied progress across 8 Gatsby Benchmarks.
 * None are 100% complete - all are works in progress.
 *
 * Distribution:
 * - 5 students: 70-90% complete (green, almost there)
 * - 8 students: 40-69% complete (yellow/orange)
 * - 5 students: 15-39% complete (orange/red)
 * - 2 students: <15% complete (red, just started)
 */

import {
  Student,
  StudentId,
  TenantId,
  LocationId,
  CohortId,
  BenchmarkId,
  ActivityId,
  BenchmarkProgress,
  StudentProgress,
  StudentSummary,
  HeatmapData,
  CompletionStatus,
  ActivityCompletion,
} from '../types/student';
import { getAllBenchmarks } from '../reference-data/benchmarks';

const BENCHMARKS = getAllBenchmarks();

// ============================================================================
// Constants
// ============================================================================

const TENANT_ID = 'TENANT-ARNFIELD' as TenantId;
const LOCATION_EAST = 'LOC-EAST' as LocationId;
const LOCATION_WEST = 'LOC-WEST' as LocationId;
const COHORT_Y10 = 'COHORT-Y10-2025' as CohortId;
const COHORT_Y11 = 'COHORT-Y11-2025' as CohortId;

const FIRST_NAMES = [
  'Oliver', 'George', 'Harry', 'Noah', 'Jack', 'Leo', 'Arthur', 'Muhammad', 'Oscar', 'Charlie',
  'Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Ivy', 'Lily', 'Isabella', 'Sophia', 'Grace',
  'Henry', 'William', 'James', 'Lucas', 'Theo', 'Freddie', 'Archie', 'Alfie', 'Thomas', 'Ethan',
  'Emily', 'Poppy', 'Ella', 'Florence', 'Willow', 'Rosie', 'Sophie', 'Evie', 'Daisy', 'Sienna',
  'Jacob', 'Edward', 'Alexander', 'Sebastian', 'Max', 'Daniel', 'Adam', 'Ryan', 'Liam', 'Benjamin'
];

const LAST_NAMES = [
  'Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies', 'Wilson', 'Evans', 'Thomas', 'Roberts',
  'Johnson', 'Walker', 'Wright', 'Robinson', 'Thompson', 'White', 'Hughes', 'Edwards', 'Green', 'Hall',
  'Lewis', 'Harris', 'Clarke', 'Patel', 'Jackson', 'Wood', 'Turner', 'Martin', 'Cooper', 'Hill'
];

const BENCHMARK_IDS: BenchmarkId[] = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'];

// ============================================================================
// Helpers
// ============================================================================

function createStudentId(index: number): StudentId {
  return `STUDENT-${String(index).padStart(3, '0')}` as StudentId;
}

function getStatus(percent: number): CompletionStatus {
  if (percent === 0) return 'not-started';
  if (percent >= 100) return 'complete';
  return 'in-progress';
}

function generateActivityCompletions(
  benchmarkId: BenchmarkId,
  percentComplete: number
): ActivityCompletion[] {
  const benchmark = BENCHMARKS.find(b => b.id === benchmarkId);
  if (!benchmark) return [];

  const totalActivities = benchmark.activities.length;
  // Use floor and cap at totalActivities - 1 to ensure none are 100% complete
  const completedCount = Math.min(
    Math.floor((percentComplete / 100) * totalActivities),
    totalActivities - 1
  );

  return benchmark.activities.slice(0, completedCount).map((activity, index) => ({
    activityId: activity.id as ActivityId,
    completedAt: new Date(Date.now() - (completedCount - index) * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

function generateBenchmarkProgress(
  studentId: StudentId,
  progressProfile: number[]
): BenchmarkProgress[] {
  return BENCHMARK_IDS.map((benchmarkId, index) => ({
    studentId,
    benchmarkId,
    percentComplete: progressProfile[index],
    status: getStatus(progressProfile[index]),
    activitiesCompleted: generateActivityCompletions(benchmarkId, progressProfile[index]),
    lastUpdated: new Date().toISOString(),
  }));
}

// ============================================================================
// Progress Profiles (20 students, none 100% complete)
// ============================================================================

// All profiles combined - 20 students total
const PROGRESS_PROFILES: number[][] = [
  // 5 high performers (70-90%, almost there but not complete)
  [90, 85, 80, 75, 70, 65, 60, 55],
  [85, 85, 80, 80, 75, 70, 65, 60],
  [80, 80, 75, 75, 70, 70, 65, 65],
  [90, 80, 75, 70, 65, 60, 55, 50],
  [75, 75, 75, 75, 75, 70, 70, 70],

  // 8 medium performers (40-69%)
  [65, 60, 55, 50, 45, 40, 35, 30],
  [60, 60, 55, 55, 50, 50, 45, 45],
  [55, 55, 50, 50, 45, 45, 40, 40],
  [70, 60, 50, 45, 40, 35, 30, 25],
  [50, 50, 50, 50, 45, 45, 40, 40],
  [65, 55, 50, 45, 40, 40, 35, 35],
  [60, 55, 50, 45, 45, 40, 40, 35],
  [55, 50, 50, 45, 45, 40, 40, 35],

  // 5 low performers (15-39%)
  [35, 30, 25, 20, 15, 15, 10, 10],
  [30, 30, 25, 20, 20, 15, 15, 10],
  [40, 30, 25, 20, 15, 10, 10, 10],
  [25, 25, 20, 20, 15, 15, 15, 10],
  [35, 25, 20, 20, 15, 15, 10, 10],

  // 2 just started (<15%)
  [15, 10, 5, 5, 0, 0, 0, 0],
  [10, 10, 5, 0, 0, 0, 0, 0],
];

// ============================================================================
// Generate Students
// ============================================================================

function createStudent(index: number): Student {
  const location = index % 2 === 0 ? LOCATION_EAST : LOCATION_WEST;
  const cohort = index < 10 ? COHORT_Y10 : COHORT_Y11;
  const yearGroup = index < 10 ? 10 : 11;

  return {
    id: createStudentId(index),
    firstName: FIRST_NAMES[index % FIRST_NAMES.length],
    lastName: LAST_NAMES[Math.floor(index / 2) % LAST_NAMES.length],
    email: `student${index}@arnfield.school.uk`,
    tenantId: TENANT_ID,
    locationId: location,
    cohortId: cohort,
    yearGroup,
    createdAt: new Date('2025-09-01').toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function getProgressProfile(index: number): number[] {
  return PROGRESS_PROFILES[index] || PROGRESS_PROFILES[PROGRESS_PROFILES.length - 1];
}

// ============================================================================
// Exported Mock Data
// ============================================================================

export const MOCK_STUDENTS: Student[] = Array.from({ length: 20 }, (_, i) => createStudent(i));

export const MOCK_BENCHMARK_PROGRESS: Map<StudentId, BenchmarkProgress[]> = new Map(
  MOCK_STUDENTS.map(student => {
    const index = parseInt(student.id.replace('STUDENT-', ''));
    return [student.id, generateBenchmarkProgress(student.id, getProgressProfile(index))];
  })
);

export function getMockStudentProgress(studentId: StudentId): StudentProgress | null {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  if (!student) return null;

  const benchmarks = MOCK_BENCHMARK_PROGRESS.get(studentId) || [];
  const overallPercent = Math.round(
    benchmarks.reduce((sum, b) => sum + b.percentComplete, 0) / benchmarks.length
  );

  return {
    student,
    benchmarks,
    overallPercent,
    targets: [],
    employerEncounters: [],
  };
}

export function getMockStudentSummary(student: Student): StudentSummary {
  const benchmarks = MOCK_BENCHMARK_PROGRESS.get(student.id) || [];
  const overallPercent = Math.round(
    benchmarks.reduce((sum, b) => sum + b.percentComplete, 0) / benchmarks.length
  );

  const benchmarkStatuses = Object.fromEntries(
    benchmarks.map(b => [b.benchmarkId, b.status])
  ) as Record<BenchmarkId, CompletionStatus>;

  return {
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    yearGroup: student.yearGroup,
    overallPercent,
    benchmarkStatuses,
  };
}

export function getMockHeatmapData(locationId?: LocationId): HeatmapData {
  const students = locationId
    ? MOCK_STUDENTS.filter(s => s.locationId === locationId)
    : MOCK_STUDENTS;

  const rows = students.map(student => {
    const benchmarks = MOCK_BENCHMARK_PROGRESS.get(student.id) || [];

    return {
      student: getMockStudentSummary(student),
      cells: benchmarks.map(b => ({
        studentId: student.id,
        benchmarkId: b.benchmarkId,
        percentComplete: b.percentComplete,
        status: b.status,
      })),
    };
  });

  return {
    rows,
    benchmarkIds: BENCHMARK_IDS,
  };
}

// ============================================================================
// Tenant/Location Data
// ============================================================================

export const MOCK_TENANT = {
  id: TENANT_ID,
  name: 'Arnfield Care',
};

export const MOCK_LOCATIONS = [
  { id: LOCATION_EAST, name: 'Arnfield School East', studentCount: 10 },
  { id: LOCATION_WEST, name: 'Arnfield School West', studentCount: 10 },
];

export const MOCK_COHORTS = [
  { id: COHORT_Y10, name: 'Year 10 2025-26', yearGroup: 10, studentCount: 10 },
  { id: COHORT_Y11, name: 'Year 11 2025-26', yearGroup: 11, studentCount: 10 },
];

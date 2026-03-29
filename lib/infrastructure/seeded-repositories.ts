/**
 * Seeded repositories for demo/development.
 * Pre-populated with mock data from lib/mock-data/students.ts.
 */

import { MOCK_STUDENTS, MOCK_BENCHMARK_PROGRESS } from '../mock-data/students';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { CohortId } from '../domain/tenant/CohortId';
import { BenchmarkProgress, CompletedActivity } from '../domain/benchmark/BenchmarkProgress';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { ActivityId } from '../domain/benchmark/ActivityId';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { InMemoryBenchmarkProgressRepository } from '../domain/benchmark/InMemoryBenchmarkProgressRepository';
import { getAllBenchmarks } from '../reference-data/benchmarks';

import type { Student as MockStudent, BenchmarkProgress as MockBenchmarkProgress } from '../types/student';

const BENCHMARKS = getAllBenchmarks();

function getTotalActivities(benchmarkId: string): number {
  const benchmark = BENCHMARKS.find(b => b.id === benchmarkId);
  return benchmark?.activities.length ?? 9;
}

function convertMockStudentToDomain(mock: MockStudent): Student {
  return Student.create({
    id: StudentId.create(mock.id),
    firstName: mock.firstName,
    lastName: mock.lastName,
    email: mock.email,
    tenantId: TenantId.create(mock.tenantId),
    locationId: LocationId.create(mock.locationId),
    cohortId: CohortId.create(mock.cohortId),
    yearGroup: mock.yearGroup,
    createdAt: new Date(mock.createdAt),
    updatedAt: new Date(mock.updatedAt),
  });
}

function convertMockProgressToDomain(mock: MockBenchmarkProgress): BenchmarkProgress {
  const completedActivities: CompletedActivity[] = mock.activitiesCompleted.map(ac => ({
    activityId: ActivityId.create(ac.activityId),
    completedAt: new Date(ac.completedAt),
  }));

  const now = new Date();

  return BenchmarkProgress.create({
    studentId: StudentId.create(mock.studentId),
    benchmarkId: BenchmarkId.create(mock.benchmarkId),
    completedActivities,
    totalActivities: getTotalActivities(mock.benchmarkId),
    createdAt: now,
    updatedAt: new Date(mock.lastUpdated),
  });
}

// Create and seed repositories
const studentRepo = new InMemoryStudentRepository();
const progressRepo = new InMemoryBenchmarkProgressRepository();

// Seed students
for (const mockStudent of MOCK_STUDENTS) {
  const student = convertMockStudentToDomain(mockStudent);
  studentRepo.save(student);
}

// Seed benchmark progress
for (const [studentId, progressList] of MOCK_BENCHMARK_PROGRESS) {
  for (const mockProgress of progressList) {
    const progress = convertMockProgressToDomain(mockProgress);
    progressRepo.save(progress);
  }
}

// Export singleton instances
export const studentRepository = studentRepo;
export const progressRepository = progressRepo;

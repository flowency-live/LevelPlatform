import { GetStudentProgress } from './GetStudentProgress';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { InMemoryBenchmarkProgressRepository } from '../domain/benchmark/InMemoryBenchmarkProgressRepository';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { BenchmarkProgress } from '../domain/benchmark/BenchmarkProgress';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { ActivityId } from '../domain/benchmark/ActivityId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { CohortId } from '../domain/tenant/CohortId';

describe('GetStudentProgress', () => {
  let studentRepository: InMemoryStudentRepository;
  let progressRepository: InMemoryBenchmarkProgressRepository;
  let useCase: GetStudentProgress;

  const now = new Date('2026-03-29T10:00:00Z');

  const createStudent = (id: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName: 'Oliver',
      lastName: 'Smith',
      email: `${id.toLowerCase()}@school.uk`,
      tenantId: TenantId.create('TENANT-ARNFIELD'),
      locationId: LocationId.create('LOC-EAST'),
      cohortId: CohortId.create('COHORT-Y10-2025'),
      yearGroup: 10,
      createdAt: now,
      updatedAt: now,
    });
  };

  const createProgress = (studentId: string, benchmarkId: string, completedCount: number) => {
    const completedActivities = [];
    for (let i = 1; i <= completedCount; i++) {
      completedActivities.push({
        activityId: ActivityId.create(`${benchmarkId}-0${i}`),
        completedAt: now,
      });
    }

    return BenchmarkProgress.create({
      studentId: StudentId.create(studentId),
      benchmarkId: BenchmarkId.create(benchmarkId),
      completedActivities,
      totalActivities: 9,
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    progressRepository = new InMemoryBenchmarkProgressRepository();
    useCase = new GetStudentProgress(studentRepository, progressRepository);
  });

  describe('execute', () => {
    it('returns student with all benchmark progress', async () => {
      const student = createStudent('STUDENT-001');
      const progress1 = createProgress('STUDENT-001', 'GB1', 5);
      const progress2 = createProgress('STUDENT-001', 'GB2', 9);

      await studentRepository.save(student);
      await progressRepository.save(progress1);
      await progressRepository.save(progress2);

      const result = await useCase.execute(StudentId.create('STUDENT-001'));

      expect(result.student.id.equals(student.id)).toBe(true);
      expect(result.benchmarkProgress).toHaveLength(2);
      expect(result.benchmarkProgress.find(p => p.benchmarkId.equals(BenchmarkId.create('GB1')))?.percentComplete).toBe(56);
      expect(result.benchmarkProgress.find(p => p.benchmarkId.equals(BenchmarkId.create('GB2')))?.percentComplete).toBe(100);
    });

    it('returns empty progress array for student with no progress', async () => {
      const student = createStudent('STUDENT-001');
      await studentRepository.save(student);

      const result = await useCase.execute(StudentId.create('STUDENT-001'));

      expect(result.student.id.equals(student.id)).toBe(true);
      expect(result.benchmarkProgress).toHaveLength(0);
    });

    it('throws StudentNotFoundError for non-existent student', async () => {
      await expect(
        useCase.execute(StudentId.create('STUDENT-NOTFOUND'))
      ).rejects.toThrow('Student not found');
    });

    it('calculates overall progress percentage', async () => {
      const student = createStudent('STUDENT-001');
      const progress1 = createProgress('STUDENT-001', 'GB1', 9); // 100%
      const progress2 = createProgress('STUDENT-001', 'GB2', 5); // 56%
      const progress3 = createProgress('STUDENT-001', 'GB3', 0); // 0%

      await studentRepository.save(student);
      await progressRepository.save(progress1);
      await progressRepository.save(progress2);
      await progressRepository.save(progress3);

      const result = await useCase.execute(StudentId.create('STUDENT-001'));

      // (100 + 56 + 0) / 3 = 52
      expect(result.overallPercentComplete).toBe(52);
    });

    it('returns 0 overall progress for student with no benchmarks', async () => {
      const student = createStudent('STUDENT-001');
      await studentRepository.save(student);

      const result = await useCase.execute(StudentId.create('STUDENT-001'));

      expect(result.overallPercentComplete).toBe(0);
    });
  });
});

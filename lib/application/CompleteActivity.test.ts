import { CompleteActivity } from './CompleteActivity';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { InMemoryBenchmarkProgressRepository } from '../domain/benchmark/InMemoryBenchmarkProgressRepository';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { BenchmarkProgress } from '../domain/benchmark/BenchmarkProgress';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { BenchmarkActivityId } from '../domain/benchmark/BenchmarkActivityId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { SubdivisionId } from '../domain/tenant/SubdivisionId';

describe('CompleteActivity', () => {
  let studentRepository: InMemoryStudentRepository;
  let progressRepository: InMemoryBenchmarkProgressRepository;
  let useCase: CompleteActivity;

  const now = new Date('2026-03-29T10:00:00Z');
  const later = new Date('2026-03-29T11:00:00Z');

  const createStudent = (id: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName: 'Oliver',
      lastName: 'Smith',
      email: `${id.toLowerCase()}@school.uk`,
      tenantId: TenantId.create('TENANT-ARNFIELD'),
      locationId: LocationId.create('LOC-EAST'),
      subdivisionId: SubdivisionId.create('SUB-EAGLE'),
      createdAt: now,
      updatedAt: now,
    });
  };

  const createProgress = (studentId: string, benchmarkId: string, completedCount: number = 0) => {
    const completedActivities = [];
    for (let i = 1; i <= completedCount; i++) {
      completedActivities.push({
        activityId: BenchmarkActivityId.create(`${benchmarkId}-0${i}`),
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
    useCase = new CompleteActivity(studentRepository, progressRepository);
  });

  describe('execute', () => {
    it('marks activity as completed', async () => {
      const student = createStudent('STUDENT-001');
      const progress = createProgress('STUDENT-001', 'GB1', 0);

      await studentRepository.save(student);
      await progressRepository.save(progress);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-001'),
        benchmarkId: BenchmarkId.create('GB1'),
        activityId: BenchmarkActivityId.create('GB1-01'),
        completedAt: later,
      });

      expect(result.completedActivities).toHaveLength(1);
      expect(result.isActivityCompleted(BenchmarkActivityId.create('GB1-01'))).toBe(true);
      expect(result.getActivityCompletedAt(BenchmarkActivityId.create('GB1-01'))).toEqual(later);
    });

    it('persists the updated progress', async () => {
      const student = createStudent('STUDENT-001');
      const progress = createProgress('STUDENT-001', 'GB1', 0);

      await studentRepository.save(student);
      await progressRepository.save(progress);

      await useCase.execute({
        studentId: StudentId.create('STUDENT-001'),
        benchmarkId: BenchmarkId.create('GB1'),
        activityId: BenchmarkActivityId.create('GB1-01'),
        completedAt: later,
      });

      const saved = await progressRepository.findByStudentAndBenchmark(
        StudentId.create('STUDENT-001'),
        BenchmarkId.create('GB1')
      );

      expect(saved!.completedActivities).toHaveLength(1);
      expect(saved!.updatedAt).toEqual(later);
    });

    it('throws StudentNotFoundError for non-existent student', async () => {
      await expect(
        useCase.execute({
          studentId: StudentId.create('STUDENT-NOTFOUND'),
          benchmarkId: BenchmarkId.create('GB1'),
          activityId: BenchmarkActivityId.create('GB1-01'),
          completedAt: later,
        })
      ).rejects.toThrow('Student not found');
    });

    it('creates new progress if none exists', async () => {
      const student = createStudent('STUDENT-001');
      await studentRepository.save(student);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-001'),
        benchmarkId: BenchmarkId.create('GB1'),
        activityId: BenchmarkActivityId.create('GB1-01'),
        completedAt: later,
      });

      expect(result.completedActivities).toHaveLength(1);
      expect(result.createdAt).toEqual(later);
    });

    it('does not duplicate already completed activity', async () => {
      const student = createStudent('STUDENT-001');
      const progress = createProgress('STUDENT-001', 'GB1', 1); // GB1-01 already done

      await studentRepository.save(student);
      await progressRepository.save(progress);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-001'),
        benchmarkId: BenchmarkId.create('GB1'),
        activityId: BenchmarkActivityId.create('GB1-01'), // Same activity
        completedAt: later,
      });

      expect(result.completedActivities).toHaveLength(1);
      expect(result.getActivityCompletedAt(BenchmarkActivityId.create('GB1-01'))).toEqual(now); // Original time preserved
    });

    it('updates percentComplete correctly', async () => {
      const student = createStudent('STUDENT-001');
      const progress = createProgress('STUDENT-001', 'GB1', 4); // 4/9 = 44%

      await studentRepository.save(student);
      await progressRepository.save(progress);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-001'),
        benchmarkId: BenchmarkId.create('GB1'),
        activityId: BenchmarkActivityId.create('GB1-05'), // 5th activity
        completedAt: later,
      });

      expect(result.completedActivities).toHaveLength(5);
      expect(result.percentComplete).toBe(56); // 5/9 = 56%
    });
  });
});

import { GetStudentCareerPlan, StudentNotFoundError } from './GetStudentCareerPlan';
import { InMemoryBenchmarkProgressRepository } from '../domain/benchmark/InMemoryBenchmarkProgressRepository';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { BenchmarkProgress } from '../domain/benchmark/BenchmarkProgress';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { BenchmarkActivityId } from '../domain/benchmark/BenchmarkActivityId';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { SubdivisionId } from '../domain/tenant/SubdivisionId';

describe('GetStudentCareerPlan', () => {
  let benchmarkProgressRepository: InMemoryBenchmarkProgressRepository;
  let studentRepository: InMemoryStudentRepository;
  let useCase: GetStudentCareerPlan;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');
  const locationId = LocationId.create('LOC-EAST');

  const createStudent = (id: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName: 'Alice',
      lastName: 'Thompson',
      email: `${id.toLowerCase().replace('student-', '')}@school.uk`,
      tenantId,
      locationId,
      subdivisionId: SubdivisionId.create('SUB-YEAR10'),
      createdAt: now,
      updatedAt: now,
    });
  };

  const createProgress = (
    studentId: string,
    benchmarkId: string,
    completedActivityIds: string[] = [],
    totalActivities: number = 5
  ) => {
    return BenchmarkProgress.create({
      studentId: StudentId.create(studentId),
      benchmarkId: BenchmarkId.create(benchmarkId),
      completedActivities: completedActivityIds.map((id) => ({
        activityId: BenchmarkActivityId.create(id),
        completedAt: now,
      })),
      totalActivities,
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    benchmarkProgressRepository = new InMemoryBenchmarkProgressRepository();
    studentRepository = new InMemoryStudentRepository();
    useCase = new GetStudentCareerPlan(benchmarkProgressRepository, studentRepository);
  });

  describe('execute', () => {
    it('returns career plan summary for a student', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01', 'GB1-02'], 5)
      );
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB2', ['GB2-01'], 4)
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result.totalActivitiesCompleted).toBe(3);
      expect(result.totalActivities).toBe(9);
      expect(result.overallPercentage).toBeGreaterThan(0);
    });

    it('returns zero progress for student with no activities', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result.totalActivitiesCompleted).toBe(0);
      expect(result.overallPercentage).toBe(0);
    });

    it('throws StudentNotFoundError if student not found', async () => {
      await expect(
        useCase.execute({
          studentId: StudentId.create('STUDENT-NOTFOUND'),
        })
      ).rejects.toThrow(StudentNotFoundError);
    });

    it('calculates overall percentage across all areas', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);
      // 5 out of 10 = 50%
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01', 'GB1-02', 'GB1-03', 'GB1-04', 'GB1-05'], 10)
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result.overallPercentage).toBe(50);
    });

    it('includes area progress breakdown without Gatsby terminology', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01'], 5)
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result.areas).toHaveLength(1);
      expect(result.areas[0].areaId).toBe('GB1');
      expect(result.areas[0].activitiesCompleted).toBe(1);
      expect(result.areas[0].totalActivities).toBe(5);
      expect(result.areas[0].percentage).toBe(20);
    });

    it('does not include progress from other students', async () => {
      const student1 = createStudent('STUDENT-ABC123');
      const student2 = createStudent('STUDENT-XYZ789');
      await studentRepository.save(student1);
      await studentRepository.save(student2);
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01'], 5)
      );
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-XYZ789', 'GB1', ['GB1-01', 'GB1-02', 'GB1-03'], 5)
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result.totalActivitiesCompleted).toBe(1);
    });
  });
});

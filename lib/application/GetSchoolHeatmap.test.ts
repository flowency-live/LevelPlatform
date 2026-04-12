import { GetSchoolHeatmap } from './GetSchoolHeatmap';
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

describe('GetSchoolHeatmap', () => {
  let benchmarkProgressRepository: InMemoryBenchmarkProgressRepository;
  let studentRepository: InMemoryStudentRepository;
  let useCase: GetSchoolHeatmap;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');
  const locationId = LocationId.create('LOC-EAST');

  const createStudent = (id: string, firstName: string, lastName: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName,
      lastName,
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
    useCase = new GetSchoolHeatmap(benchmarkProgressRepository, studentRepository);
  });

  describe('execute', () => {
    it('returns a row for each student', async () => {
      await studentRepository.save(createStudent('STUDENT-ABC123', 'Alice', 'Thompson'));
      await studentRepository.save(createStudent('STUDENT-XYZ789', 'Bob', 'Wilson'));

      const result = await useCase.execute({
        locationId,
      });

      expect(result.rows).toHaveLength(2);
    });

    it('returns 8 benchmark columns for each student', async () => {
      await studentRepository.save(createStudent('STUDENT-ABC123', 'Alice', 'Thompson'));

      const result = await useCase.execute({
        locationId,
      });

      expect(result.rows[0].benchmarks).toHaveLength(8);
      expect(result.rows[0].benchmarks.map((b) => b.benchmarkId)).toEqual([
        'GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8',
      ]);
    });

    it('includes student identifier (anonymized)', async () => {
      await studentRepository.save(createStudent('STUDENT-ABC123', 'Alice', 'Thompson'));

      const result = await useCase.execute({
        locationId,
      });

      expect(result.rows[0].studentId).toBe('STUDENT-ABC123');
      expect(result.rows[0].displayName).toBeDefined();
    });

    it('shows correct status for each benchmark', async () => {
      await studentRepository.save(createStudent('STUDENT-ABC123', 'Alice', 'Thompson'));

      // GB1 complete
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01', 'GB1-02'], 2)
      );
      // GB2 in progress
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB2', ['GB2-01'], 3)
      );
      // GB3 not started (no progress record)

      const result = await useCase.execute({
        locationId,
      });

      const gb1 = result.rows[0].benchmarks.find((b) => b.benchmarkId === 'GB1');
      const gb2 = result.rows[0].benchmarks.find((b) => b.benchmarkId === 'GB2');
      const gb3 = result.rows[0].benchmarks.find((b) => b.benchmarkId === 'GB3');

      expect(gb1?.status).toBe('complete');
      expect(gb2?.status).toBe('in-progress');
      expect(gb3?.status).toBe('not-started');
    });

    it('includes percentage for each benchmark', async () => {
      await studentRepository.save(createStudent('STUDENT-ABC123', 'Alice', 'Thompson'));

      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01'], 4)
      );

      const result = await useCase.execute({
        locationId,
      });

      const gb1 = result.rows[0].benchmarks.find((b) => b.benchmarkId === 'GB1');
      expect(gb1?.percentage).toBe(25);
    });

    it('returns empty rows when no students', async () => {
      const result = await useCase.execute({
        locationId,
      });

      expect(result.rows).toHaveLength(0);
    });

    it('filters by location', async () => {
      await studentRepository.save(createStudent('STUDENT-EAST01', 'Alice', 'Thompson'));
      await studentRepository.save(
        Student.create({
          id: StudentId.create('STUDENT-WEST01'),
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob@school.uk',
          tenantId,
          locationId: LocationId.create('LOC-WEST'),
          subdivisionId: SubdivisionId.create('SUB-YEAR10'),
          createdAt: now,
          updatedAt: now,
        })
      );

      const result = await useCase.execute({
        locationId: LocationId.create('LOC-EAST'),
      });

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].studentId).toBe('STUDENT-EAST01');
    });
  });
});

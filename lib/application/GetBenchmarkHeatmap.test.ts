import { GetBenchmarkHeatmap } from './GetBenchmarkHeatmap';
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

describe('GetBenchmarkHeatmap', () => {
  let studentRepository: InMemoryStudentRepository;
  let progressRepository: InMemoryBenchmarkProgressRepository;
  let useCase: GetBenchmarkHeatmap;

  const now = new Date('2026-03-29T10:00:00Z');

  const createStudent = (id: string, cohortId: string = 'COHORT-Y10-2025') => {
    return Student.create({
      id: StudentId.create(id),
      firstName: `Student${id.slice(-3)}`,
      lastName: 'Test',
      email: `${id.toLowerCase()}@school.uk`,
      tenantId: TenantId.create('TENANT-ARNFIELD'),
      locationId: LocationId.create('LOC-EAST'),
      cohortId: CohortId.create(cohortId),
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
    useCase = new GetBenchmarkHeatmap(studentRepository, progressRepository);
  });

  describe('execute', () => {
    it('returns heatmap data for all students in cohort', async () => {
      const student1 = createStudent('STUDENT-001');
      const student2 = createStudent('STUDENT-002');
      const progress1 = createProgress('STUDENT-001', 'GB1', 9); // 100%
      const progress2 = createProgress('STUDENT-002', 'GB1', 5); // 56%

      await studentRepository.save(student1);
      await studentRepository.save(student2);
      await progressRepository.save(progress1);
      await progressRepository.save(progress2);

      const result = await useCase.execute(CohortId.create('COHORT-Y10-2025'));

      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].studentId.equals(StudentId.create('STUDENT-001'))).toBe(true);
      expect(result.rows[0].studentName).toBe('Student001 Test');
    });

    it('returns benchmark columns with progress status', async () => {
      const student = createStudent('STUDENT-001');
      const progress = createProgress('STUDENT-001', 'GB1', 9);

      await studentRepository.save(student);
      await progressRepository.save(progress);

      const result = await useCase.execute(CohortId.create('COHORT-Y10-2025'));

      const gb1Cell = result.rows[0].benchmarks.find(
        b => b.benchmarkId.equals(BenchmarkId.create('GB1'))
      );
      expect(gb1Cell?.percentComplete).toBe(100);
      expect(gb1Cell?.status).toBe('complete');
    });

    it('returns not-started status for missing progress', async () => {
      const student = createStudent('STUDENT-001');
      await studentRepository.save(student);

      const result = await useCase.execute(CohortId.create('COHORT-Y10-2025'));

      const gb1Cell = result.rows[0].benchmarks.find(
        b => b.benchmarkId.equals(BenchmarkId.create('GB1'))
      );
      expect(gb1Cell?.percentComplete).toBe(0);
      expect(gb1Cell?.status).toBe('not-started');
    });

    it('filters students by cohort', async () => {
      const student1 = createStudent('STUDENT-001', 'COHORT-Y10-2025');
      const student2 = createStudent('STUDENT-002', 'COHORT-Y11-2025');

      await studentRepository.save(student1);
      await studentRepository.save(student2);

      const result = await useCase.execute(CohortId.create('COHORT-Y10-2025'));

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].studentId.equals(StudentId.create('STUDENT-001'))).toBe(true);
    });

    it('returns all 8 Gatsby Benchmarks for each student', async () => {
      const student = createStudent('STUDENT-001');
      await studentRepository.save(student);

      const result = await useCase.execute(CohortId.create('COHORT-Y10-2025'));

      expect(result.rows[0].benchmarks).toHaveLength(8);
      expect(result.rows[0].benchmarks.map(b => b.benchmarkId.toString())).toEqual([
        'GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'
      ]);
    });

    it('returns empty rows for cohort with no students', async () => {
      const result = await useCase.execute(CohortId.create('COHORT-EMPTY'));

      expect(result.rows).toHaveLength(0);
    });

    it('calculates cohort summary statistics', async () => {
      const student1 = createStudent('STUDENT-001');
      const student2 = createStudent('STUDENT-002');
      const progress1 = createProgress('STUDENT-001', 'GB1', 9); // 100%
      const progress2 = createProgress('STUDENT-002', 'GB1', 5); // 56%

      await studentRepository.save(student1);
      await studentRepository.save(student2);
      await progressRepository.save(progress1);
      await progressRepository.save(progress2);

      const result = await useCase.execute(CohortId.create('COHORT-Y10-2025'));

      expect(result.summary.totalStudents).toBe(2);
      expect(result.summary.averageOverallProgress).toBe(10); // (100+56)/2/8 benchmarks = ~10%
    });
  });
});

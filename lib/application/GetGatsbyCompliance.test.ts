import { GetGatsbyCompliance } from './GetGatsbyCompliance';
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

describe('GetGatsbyCompliance', () => {
  let benchmarkProgressRepository: InMemoryBenchmarkProgressRepository;
  let studentRepository: InMemoryStudentRepository;
  let useCase: GetGatsbyCompliance;

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
    useCase = new GetGatsbyCompliance(benchmarkProgressRepository, studentRepository);
  });

  describe('execute', () => {
    it('returns compliance for all 8 Gatsby benchmarks', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);

      const result = await useCase.execute({
        locationId,
      });

      // Should return all 8 benchmarks even if no progress
      expect(result.benchmarks).toHaveLength(8);
      expect(result.benchmarks.map((b) => b.benchmarkId)).toEqual([
        'GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8',
      ]);
    });

    it('calculates percentage of students who have completed each benchmark', async () => {
      const student1 = createStudent('STUDENT-ABC123');
      const student2 = createStudent('STUDENT-XYZ789');
      await studentRepository.save(student1);
      await studentRepository.save(student2);

      // Student 1 has completed GB1 (100%)
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01', 'GB1-02', 'GB1-03', 'GB1-04', 'GB1-05'], 5)
      );
      // Student 2 has not started GB1

      const result = await useCase.execute({
        locationId,
      });

      const gb1 = result.benchmarks.find((b) => b.benchmarkId === 'GB1');
      expect(gb1?.studentsComplete).toBe(1);
      expect(gb1?.studentsInProgress).toBe(0);
      expect(gb1?.studentsNotStarted).toBe(1);
    });

    it('identifies students in progress', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);

      // Partially complete
      await benchmarkProgressRepository.save(
        createProgress('STUDENT-ABC123', 'GB1', ['GB1-01', 'GB1-02'], 5)
      );

      const result = await useCase.execute({
        locationId,
      });

      const gb1 = result.benchmarks.find((b) => b.benchmarkId === 'GB1');
      expect(gb1?.studentsInProgress).toBe(1);
      expect(gb1?.studentsComplete).toBe(0);
    });

    it('calculates overall school compliance percentage', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);

      // Complete 4 out of 8 benchmarks
      for (const benchmarkId of ['GB1', 'GB2', 'GB3', 'GB4']) {
        await benchmarkProgressRepository.save(
          createProgress('STUDENT-ABC123', benchmarkId, [`${benchmarkId}-01`, `${benchmarkId}-02`], 2)
        );
      }

      const result = await useCase.execute({
        locationId,
      });

      // 4/8 benchmarks complete = 50%
      expect(result.overallCompliance).toBe(50);
    });

    it('returns zero compliance when no students', async () => {
      const result = await useCase.execute({
        locationId,
      });

      expect(result.overallCompliance).toBe(0);
      expect(result.totalStudents).toBe(0);
    });

    it('filters by location', async () => {
      const eastStudent = createStudent('STUDENT-EAST01');
      const westStudent = Student.create({
        id: StudentId.create('STUDENT-WEST01'),
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@school.uk',
        tenantId,
        locationId: LocationId.create('LOC-WEST'),
        subdivisionId: SubdivisionId.create('SUB-YEAR10'),
        createdAt: now,
        updatedAt: now,
      });
      await studentRepository.save(eastStudent);
      await studentRepository.save(westStudent);

      await benchmarkProgressRepository.save(
        createProgress('STUDENT-EAST01', 'GB1', ['GB1-01', 'GB1-02'], 2)
      );

      const result = await useCase.execute({
        locationId: LocationId.create('LOC-EAST'),
      });

      expect(result.totalStudents).toBe(1);
    });
  });
});

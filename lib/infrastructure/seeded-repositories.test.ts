import { studentRepository, progressRepository } from './seeded-repositories';
import { StudentId } from '../domain/student/StudentId';
import { CohortId } from '../domain/tenant/CohortId';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';

describe('seeded-repositories', () => {
  describe('studentRepository', () => {
    it('contains 50 students', async () => {
      const students = await studentRepository.findByCohortId(CohortId.create('COHORT-Y10-2025'));
      const students2 = await studentRepository.findByCohortId(CohortId.create('COHORT-Y11-2025'));

      expect(students.length + students2.length).toBe(50);
    });

    it('can find student by ID', async () => {
      const student = await studentRepository.findById(StudentId.create('STUDENT-000'));

      expect(student).not.toBeNull();
      expect(student?.firstName).toBe('Oliver');
    });

    it('returns students with timestamps', async () => {
      const student = await studentRepository.findById(StudentId.create('STUDENT-001'));

      expect(student?.createdAt).toBeInstanceOf(Date);
      expect(student?.updatedAt).toBeInstanceOf(Date);
    });

    it('filters by cohort correctly', async () => {
      const y10Students = await studentRepository.findByCohortId(CohortId.create('COHORT-Y10-2025'));

      expect(y10Students.length).toBe(25);
      y10Students.forEach(s => {
        expect(s.yearGroup).toBe(10);
      });
    });
  });

  describe('progressRepository', () => {
    it('contains progress for all students', async () => {
      const progress = await progressRepository.findByStudentId(StudentId.create('STUDENT-001'));

      expect(progress.length).toBeGreaterThan(0);
    });

    it('returns progress with correct benchmark IDs', async () => {
      const progress = await progressRepository.findByStudentId(StudentId.create('STUDENT-001'));

      const benchmarkIds = progress.map(p => p.benchmarkId.toString());
      expect(benchmarkIds).toContain('GB1');
    });

    it('high performers have high completion', async () => {
      // STUDENT-000 is first high performer (100% on all)
      const progress = await progressRepository.findByStudentId(StudentId.create('STUDENT-000'));

      const allComplete = progress.every(p => p.percentComplete === 100);
      expect(allComplete).toBe(true);
    });

    it('can find progress by student and benchmark', async () => {
      const progress = await progressRepository.findByStudentAndBenchmark(
        StudentId.create('STUDENT-001'),
        BenchmarkId.create('GB1')
      );

      expect(progress).not.toBeNull();
      expect(progress?.benchmarkId.toString()).toBe('GB1');
    });
  });
});

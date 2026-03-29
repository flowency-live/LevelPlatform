import { InMemoryBenchmarkProgressRepository } from './InMemoryBenchmarkProgressRepository';
import { BenchmarkProgress } from './BenchmarkProgress';
import { BenchmarkId } from './BenchmarkId';
import { ActivityId } from './ActivityId';
import { StudentId } from '../student/StudentId';

describe('InMemoryBenchmarkProgressRepository', () => {
  let repository: InMemoryBenchmarkProgressRepository;
  const now = new Date('2026-03-29T10:00:00Z');

  const createProgress = (overrides: Partial<{
    studentId: string;
    benchmarkId: string;
    completedActivityIds: string[];
    totalActivities: number;
  }> = {}) => {
    return BenchmarkProgress.create({
      studentId: StudentId.create(overrides.studentId ?? 'STUDENT-001'),
      benchmarkId: BenchmarkId.create(overrides.benchmarkId ?? 'GB1'),
      completedActivities: (overrides.completedActivityIds ?? []).map(id => ({
        activityId: ActivityId.create(id),
        completedAt: now,
      })),
      totalActivities: overrides.totalActivities ?? 9,
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    repository = new InMemoryBenchmarkProgressRepository();
  });

  describe('save and findByStudentAndBenchmark', () => {
    it('saves and retrieves progress', async () => {
      const progress = createProgress({
        completedActivityIds: ['GB1-01', 'GB1-02'],
      });

      await repository.save(progress);
      const found = await repository.findByStudentAndBenchmark(
        progress.studentId,
        progress.benchmarkId
      );

      expect(found).not.toBeNull();
      expect(found!.studentId.equals(progress.studentId)).toBe(true);
      expect(found!.benchmarkId.equals(progress.benchmarkId)).toBe(true);
      expect(found!.completedActivities).toHaveLength(2);
    });

    it('returns null for non-existent progress', async () => {
      const found = await repository.findByStudentAndBenchmark(
        StudentId.create('STUDENT-NOTFOUND'),
        BenchmarkId.create('GB1')
      );

      expect(found).toBeNull();
    });

    it('overwrites existing progress on save', async () => {
      const progress1 = createProgress({ completedActivityIds: ['GB1-01'] });
      const progress2 = createProgress({ completedActivityIds: ['GB1-01', 'GB1-02', 'GB1-03'] });

      await repository.save(progress1);
      await repository.save(progress2);

      const found = await repository.findByStudentAndBenchmark(
        progress1.studentId,
        progress1.benchmarkId
      );

      expect(found!.completedActivities).toHaveLength(3);
    });

    it('preserves timestamps through save/retrieve', async () => {
      const progress = createProgress();

      await repository.save(progress);
      const found = await repository.findByStudentAndBenchmark(
        progress.studentId,
        progress.benchmarkId
      );

      expect(found!.createdAt).toEqual(now);
      expect(found!.updatedAt).toEqual(now);
    });
  });

  describe('findByStudentId', () => {
    it('returns all progress for student', async () => {
      const progress1 = createProgress({ benchmarkId: 'GB1' });
      const progress2 = createProgress({ benchmarkId: 'GB2' });
      const progress3 = createProgress({ studentId: 'STUDENT-002', benchmarkId: 'GB1' });

      await repository.save(progress1);
      await repository.save(progress2);
      await repository.save(progress3);

      const found = await repository.findByStudentId(StudentId.create('STUDENT-001'));

      expect(found).toHaveLength(2);
      expect(found.some(p => p.benchmarkId.equals(BenchmarkId.create('GB1')))).toBe(true);
      expect(found.some(p => p.benchmarkId.equals(BenchmarkId.create('GB2')))).toBe(true);
    });

    it('returns empty array when no progress for student', async () => {
      const found = await repository.findByStudentId(StudentId.create('STUDENT-EMPTY'));

      expect(found).toEqual([]);
    });
  });

  describe('findByBenchmarkId', () => {
    it('returns all progress for benchmark', async () => {
      const progress1 = createProgress({ studentId: 'STUDENT-001', benchmarkId: 'GB1' });
      const progress2 = createProgress({ studentId: 'STUDENT-002', benchmarkId: 'GB1' });
      const progress3 = createProgress({ studentId: 'STUDENT-001', benchmarkId: 'GB2' });

      await repository.save(progress1);
      await repository.save(progress2);
      await repository.save(progress3);

      const found = await repository.findByBenchmarkId(BenchmarkId.create('GB1'));

      expect(found).toHaveLength(2);
      expect(found.some(p => p.studentId.equals(StudentId.create('STUDENT-001')))).toBe(true);
      expect(found.some(p => p.studentId.equals(StudentId.create('STUDENT-002')))).toBe(true);
    });

    it('returns empty array when no progress for benchmark', async () => {
      const found = await repository.findByBenchmarkId(BenchmarkId.create('GB8'));

      expect(found).toEqual([]);
    });
  });
});

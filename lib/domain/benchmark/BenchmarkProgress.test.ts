import { BenchmarkProgress, CompletionStatus } from './BenchmarkProgress';
import { BenchmarkId } from './BenchmarkId';
import { ActivityId } from './ActivityId';
import { StudentId } from '../student/StudentId';

describe('BenchmarkProgress', () => {
  const studentId = StudentId.create('STUDENT-001');
  const benchmarkId = BenchmarkId.create('GB1');

  describe('create', () => {
    it('creates empty progress', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivityIds: [],
        totalActivities: 5,
      });

      expect(progress.studentId.equals(studentId)).toBe(true);
      expect(progress.benchmarkId.equals(benchmarkId)).toBe(true);
      expect(progress.percentComplete).toBe(0);
      expect(progress.status).toBe('not-started');
    });

    it('calculates percent complete', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivityIds: [
          ActivityId.create('GB1-01'),
          ActivityId.create('GB1-02'),
        ],
        totalActivities: 5,
      });

      expect(progress.percentComplete).toBe(40);
      expect(progress.status).toBe('in-progress');
    });

    it('returns 100% when all complete', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivityIds: [
          ActivityId.create('GB1-01'),
          ActivityId.create('GB1-02'),
          ActivityId.create('GB1-03'),
        ],
        totalActivities: 3,
      });

      expect(progress.percentComplete).toBe(100);
      expect(progress.status).toBe('complete');
    });

    it('throws for negative totalActivities', () => {
      expect(() =>
        BenchmarkProgress.create({
          studentId,
          benchmarkId,
          completedActivityIds: [],
          totalActivities: -1,
        })
      ).toThrow();
    });
  });

  describe('completeActivity', () => {
    it('adds activity to completed list', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivityIds: [],
        totalActivities: 5,
      });

      const updated = progress.completeActivity(ActivityId.create('GB1-01'));

      expect(updated.completedActivityIds).toHaveLength(1);
      expect(updated.percentComplete).toBe(20);
    });

    it('does not duplicate already completed activity', () => {
      const activityId = ActivityId.create('GB1-01');
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivityIds: [activityId],
        totalActivities: 5,
      });

      const updated = progress.completeActivity(activityId);

      expect(updated.completedActivityIds).toHaveLength(1);
    });
  });

  describe('isActivityCompleted', () => {
    it('returns true for completed activity', () => {
      const activityId = ActivityId.create('GB1-01');
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivityIds: [activityId],
        totalActivities: 5,
      });

      expect(progress.isActivityCompleted(activityId)).toBe(true);
    });

    it('returns false for incomplete activity', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivityIds: [],
        totalActivities: 5,
      });

      expect(progress.isActivityCompleted(ActivityId.create('GB1-01'))).toBe(false);
    });
  });
});

import { BenchmarkProgress, CompletionStatus, CompletedActivity } from './BenchmarkProgress';
import { BenchmarkId } from './BenchmarkId';
import { BenchmarkActivityId } from './BenchmarkActivityId';
import { StudentId } from '../student/StudentId';

describe('BenchmarkProgress', () => {
  const studentId = StudentId.create('STUDENT-001');
  const benchmarkId = BenchmarkId.create('GB1');
  const now = new Date('2026-03-29T10:00:00Z');
  const later = new Date('2026-03-29T11:00:00Z');

  describe('create', () => {
    it('creates empty progress with timestamps', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(progress.studentId.equals(studentId)).toBe(true);
      expect(progress.benchmarkId.equals(benchmarkId)).toBe(true);
      expect(progress.percentComplete).toBe(0);
      expect(progress.status).toBe('not-started');
      expect(progress.createdAt).toEqual(now);
      expect(progress.updatedAt).toEqual(now);
    });

    it('calculates percent complete', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [
          { activityId: BenchmarkActivityId.create('GB1-01'), completedAt: now },
          { activityId: BenchmarkActivityId.create('GB1-02'), completedAt: now },
        ],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(progress.percentComplete).toBe(40);
      expect(progress.status).toBe('in-progress');
    });

    it('returns 100% when all complete', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [
          { activityId: BenchmarkActivityId.create('GB1-01'), completedAt: now },
          { activityId: BenchmarkActivityId.create('GB1-02'), completedAt: now },
          { activityId: BenchmarkActivityId.create('GB1-03'), completedAt: now },
        ],
        totalActivities: 3,
        createdAt: now,
        updatedAt: now,
      });

      expect(progress.percentComplete).toBe(100);
      expect(progress.status).toBe('complete');
    });

    it('throws for negative totalActivities', () => {
      expect(() =>
        BenchmarkProgress.create({
          studentId,
          benchmarkId,
          completedActivities: [],
          totalActivities: -1,
          createdAt: now,
          updatedAt: now,
        })
      ).toThrow();
    });
  });

  describe('completeActivity', () => {
    it('adds activity to completed list with timestamp', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      const updated = progress.completeActivity(BenchmarkActivityId.create('GB1-01'), later);

      expect(updated.completedActivities).toHaveLength(1);
      expect(updated.completedActivities[0].completedAt).toEqual(later);
      expect(updated.percentComplete).toBe(20);
      expect(updated.updatedAt).toEqual(later);
    });

    it('does not duplicate already completed activity', () => {
      const activityId = BenchmarkActivityId.create('GB1-01');
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [{ activityId, completedAt: now }],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      const updated = progress.completeActivity(activityId, later);

      expect(updated.completedActivities).toHaveLength(1);
      expect(updated.completedActivities[0].completedAt).toEqual(now);
    });

    it('preserves createdAt when completing activity', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      const updated = progress.completeActivity(BenchmarkActivityId.create('GB1-01'), later);

      expect(updated.createdAt).toEqual(now);
    });
  });

  describe('isActivityCompleted', () => {
    it('returns true for completed activity', () => {
      const activityId = BenchmarkActivityId.create('GB1-01');
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [{ activityId, completedAt: now }],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(progress.isActivityCompleted(activityId)).toBe(true);
    });

    it('returns false for incomplete activity', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(progress.isActivityCompleted(BenchmarkActivityId.create('GB1-01'))).toBe(false);
    });
  });

  describe('getActivityCompletedAt', () => {
    it('returns completion date for completed activity', () => {
      const activityId = BenchmarkActivityId.create('GB1-01');
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [{ activityId, completedAt: now }],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(progress.getActivityCompletedAt(activityId)).toEqual(now);
    });

    it('returns null for incomplete activity', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      expect(progress.getActivityCompletedAt(BenchmarkActivityId.create('GB1-01'))).toBeNull();
    });
  });

  describe('completedActivityIds', () => {
    it('returns array of activity IDs for backwards compatibility', () => {
      const progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [
          { activityId: BenchmarkActivityId.create('GB1-01'), completedAt: now },
          { activityId: BenchmarkActivityId.create('GB1-02'), completedAt: now },
        ],
        totalActivities: 5,
        createdAt: now,
        updatedAt: now,
      });

      const ids = progress.completedActivityIds;
      expect(ids).toHaveLength(2);
      expect(ids[0].equals(BenchmarkActivityId.create('GB1-01'))).toBe(true);
      expect(ids[1].equals(BenchmarkActivityId.create('GB1-02'))).toBe(true);
    });
  });
});

import { ASDANProgress, InvalidASDANProgressError } from './ASDANProgress';
import { ASDANQualificationId } from './ASDANQualificationId';
import { ASDANUnitId } from './ASDANUnitId';
import { StudentId } from '../student/StudentId';

describe('ASDANProgress', () => {
  const createTestProgress = (
    overrides: Partial<{
      studentId: StudentId;
      qualificationId: ASDANQualificationId;
      completedUnitIds: ASDANUnitId[];
      enrolledAt: Date;
      updatedAt: Date;
    }> = {}
  ): ASDANProgress => {
    return ASDANProgress.create({
      studentId: overrides.studentId ?? StudentId.create('STUDENT-ABC123'),
      qualificationId:
        overrides.qualificationId ?? ASDANQualificationId.create('COPE-L1'),
      completedUnitIds: overrides.completedUnitIds ?? [],
      enrolledAt: overrides.enrolledAt ?? new Date('2024-01-01'),
      updatedAt: overrides.updatedAt ?? new Date('2024-01-01'),
    });
  };

  describe('create', () => {
    it('creates progress with empty completed units', () => {
      const progress = createTestProgress();
      expect(progress.studentId.toString()).toBe('STUDENT-ABC123');
      expect(progress.qualificationId.toString()).toBe('COPE-L1');
      expect(progress.completedUnitIds).toEqual([]);
    });

    it('creates progress with pre-completed units', () => {
      const progress = createTestProgress({
        completedUnitIds: [ASDANUnitId.create('ASDAN-COPE001')],
      });
      expect(progress.completedUnitIds).toHaveLength(1);
      expect(progress.completedUnitIds[0].toString()).toBe('ASDAN-COPE001');
    });

    it('stores enrollment and update dates', () => {
      const enrolledAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-02-01');
      const progress = createTestProgress({ enrolledAt, updatedAt });
      expect(progress.enrolledAt).toEqual(enrolledAt);
      expect(progress.updatedAt).toEqual(updatedAt);
    });
  });

  describe('completeUnit', () => {
    it('returns new progress with unit added', () => {
      const progress = createTestProgress();
      const unitId = ASDANUnitId.create('ASDAN-COPE001');
      const completedAt = new Date('2024-03-15');

      const updated = progress.completeUnit(unitId, completedAt);

      expect(updated).not.toBe(progress);
      expect(updated.completedUnitIds).toHaveLength(1);
      expect(updated.completedUnitIds[0].equals(unitId)).toBe(true);
      expect(updated.updatedAt).toEqual(completedAt);
    });

    it('does not modify original progress (immutability)', () => {
      const progress = createTestProgress();
      const unitId = ASDANUnitId.create('ASDAN-COPE001');

      progress.completeUnit(unitId, new Date());

      expect(progress.completedUnitIds).toHaveLength(0);
    });

    it('returns same progress if unit already completed', () => {
      const unitId = ASDANUnitId.create('ASDAN-COPE001');
      const progress = createTestProgress({
        completedUnitIds: [unitId],
      });

      const updated = progress.completeUnit(unitId, new Date());

      expect(updated.completedUnitIds).toHaveLength(1);
    });

    it('allows completing multiple units', () => {
      const progress = createTestProgress();
      const unit1 = ASDANUnitId.create('ASDAN-COPE001');
      const unit2 = ASDANUnitId.create('ASDAN-COPE002');

      const updated = progress
        .completeUnit(unit1, new Date('2024-03-15'))
        .completeUnit(unit2, new Date('2024-03-16'));

      expect(updated.completedUnitIds).toHaveLength(2);
    });
  });

  describe('getCompletedUnits', () => {
    it('returns empty array when no units completed', () => {
      const progress = createTestProgress();
      expect(progress.getCompletedUnits()).toEqual([]);
    });

    it('returns completed unit ids', () => {
      const unit1 = ASDANUnitId.create('ASDAN-COPE001');
      const unit2 = ASDANUnitId.create('ASDAN-COPE002');
      const progress = createTestProgress({
        completedUnitIds: [unit1, unit2],
      });

      const completed = progress.getCompletedUnits();

      expect(completed).toHaveLength(2);
      expect(completed[0].equals(unit1)).toBe(true);
      expect(completed[1].equals(unit2)).toBe(true);
    });

    it('returns defensive copy', () => {
      const progress = createTestProgress({
        completedUnitIds: [ASDANUnitId.create('ASDAN-COPE001')],
      });

      const copy1 = progress.getCompletedUnits();
      const copy2 = progress.getCompletedUnits();

      expect(copy1).not.toBe(copy2);
    });
  });

  describe('isUnitCompleted', () => {
    it('returns false when unit not completed', () => {
      const progress = createTestProgress();
      const unitId = ASDANUnitId.create('ASDAN-COPE001');

      expect(progress.isUnitCompleted(unitId)).toBe(false);
    });

    it('returns true when unit is completed', () => {
      const unitId = ASDANUnitId.create('ASDAN-COPE001');
      const progress = createTestProgress({
        completedUnitIds: [unitId],
      });

      expect(progress.isUnitCompleted(unitId)).toBe(true);
    });
  });

  describe('getPercentageComplete', () => {
    it('returns 0 when no units completed', () => {
      const progress = createTestProgress();
      expect(progress.getPercentageComplete()).toBe(0);
    });

    it('calculates percentage based on qualification requirements', () => {
      const unit1 = ASDANUnitId.create('ASDAN-COPE001');
      const progress = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L1'),
        completedUnitIds: [unit1],
      });

      const percentage = progress.getPercentageComplete();
      expect(percentage).toBeGreaterThan(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('returns 100 when all required units completed', () => {
      const unit1 = ASDANUnitId.create('ASDAN-COPE001');
      const unit2 = ASDANUnitId.create('ASDAN-COPE002');
      const unit3 = ASDANUnitId.create('ASDAN-COPE003');
      const progress = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L1'),
        completedUnitIds: [unit1, unit2, unit3],
      });

      expect(progress.getPercentageComplete()).toBe(100);
    });
  });

  describe('isComplete', () => {
    it('returns false when no units completed', () => {
      const progress = createTestProgress();
      expect(progress.isComplete()).toBe(false);
    });

    it('returns false when only some units completed', () => {
      const progress = createTestProgress({
        completedUnitIds: [ASDANUnitId.create('ASDAN-COPE001')],
      });
      expect(progress.isComplete()).toBe(false);
    });

    it('returns true when minimum units requirement met', () => {
      const unit1 = ASDANUnitId.create('ASDAN-COPE001');
      const unit2 = ASDANUnitId.create('ASDAN-COPE002');
      const unit3 = ASDANUnitId.create('ASDAN-COPE003');
      const progress = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L1'),
        completedUnitIds: [unit1, unit2, unit3],
      });

      expect(progress.isComplete()).toBe(true);
    });
  });

  describe('getRemainingUnits', () => {
    it('returns all required units when none completed', () => {
      const progress = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L1'),
      });

      const remaining = progress.getRemainingUnits();
      expect(remaining.length).toBeGreaterThan(0);
    });

    it('excludes completed units from remaining', () => {
      const unit1 = ASDANUnitId.create('ASDAN-COPE001');
      const progress = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L1'),
        completedUnitIds: [unit1],
      });

      const remaining = progress.getRemainingUnits();
      const remainingIds = remaining.map((u) => u.toString());
      expect(remainingIds).not.toContain('ASDAN-COPE001');
    });

    it('returns empty array when all units completed', () => {
      const unit1 = ASDANUnitId.create('ASDAN-COPE001');
      const unit2 = ASDANUnitId.create('ASDAN-COPE002');
      const unit3 = ASDANUnitId.create('ASDAN-COPE003');
      const unit4 = ASDANUnitId.create('ASDAN-COPE004');
      const progress = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L1'),
        completedUnitIds: [unit1, unit2, unit3, unit4],
      });

      expect(progress.getRemainingUnits()).toHaveLength(0);
    });
  });

  describe('equals', () => {
    it('returns true for same student and qualification', () => {
      const progress1 = createTestProgress();
      const progress2 = createTestProgress();
      expect(progress1.equals(progress2)).toBe(true);
    });

    it('returns false for different students', () => {
      const progress1 = createTestProgress({
        studentId: StudentId.create('STUDENT-ABC123'),
      });
      const progress2 = createTestProgress({
        studentId: StudentId.create('STUDENT-DEF456'),
      });
      expect(progress1.equals(progress2)).toBe(false);
    });

    it('returns false for different qualifications', () => {
      const progress1 = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L1'),
      });
      const progress2 = createTestProgress({
        qualificationId: ASDANQualificationId.create('COPE-L2'),
      });
      expect(progress1.equals(progress2)).toBe(false);
    });
  });
});

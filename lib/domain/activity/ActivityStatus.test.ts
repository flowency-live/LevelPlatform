import { ActivityStatus, ALL_ACTIVITY_STATUSES, isActivityStatus } from './ActivityStatus';

describe('ActivityStatus', () => {
  describe('enum values', () => {
    it('has draft status', () => {
      expect(ActivityStatus.Draft).toBe('draft');
    });

    it('has active status', () => {
      expect(ActivityStatus.Active).toBe('active');
    });

    it('has archived status', () => {
      expect(ActivityStatus.Archived).toBe('archived');
    });
  });

  describe('ALL_ACTIVITY_STATUSES', () => {
    it('contains all three statuses', () => {
      expect(ALL_ACTIVITY_STATUSES).toHaveLength(3);
      expect(ALL_ACTIVITY_STATUSES).toContain(ActivityStatus.Draft);
      expect(ALL_ACTIVITY_STATUSES).toContain(ActivityStatus.Active);
      expect(ALL_ACTIVITY_STATUSES).toContain(ActivityStatus.Archived);
    });

    it('is readonly', () => {
      expect(() => {
        (ALL_ACTIVITY_STATUSES as ActivityStatus[]).push(ActivityStatus.Draft);
      }).toThrow();
    });
  });

  describe('isActivityStatus', () => {
    it('returns true for valid statuses', () => {
      expect(isActivityStatus('draft')).toBe(true);
      expect(isActivityStatus('active')).toBe(true);
      expect(isActivityStatus('archived')).toBe(true);
    });

    it('returns false for invalid statuses', () => {
      expect(isActivityStatus('pending')).toBe(false);
      expect(isActivityStatus('completed')).toBe(false);
      expect(isActivityStatus('unknown')).toBe(false);
    });

    it('returns false for uppercase values', () => {
      expect(isActivityStatus('DRAFT')).toBe(false);
      expect(isActivityStatus('Active')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isActivityStatus('')).toBe(false);
    });
  });
});

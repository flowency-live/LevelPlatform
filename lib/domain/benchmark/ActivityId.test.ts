import { ActivityId, InvalidActivityIdError } from './ActivityId';

describe('ActivityId', () => {
  describe('create', () => {
    it('creates valid ActivityId for GB1-01', () => {
      const id = ActivityId.create('GB1-01');
      expect(id.toString()).toBe('GB1-01');
    });

    it('creates valid ActivityId for any benchmark activity', () => {
      const validIds = ['GB1-01', 'GB2-04', 'GB8-03', 'GB5-02'];
      validIds.forEach(value => {
        const id = ActivityId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('throws InvalidActivityIdError for invalid format', () => {
      expect(() => ActivityId.create('GB0-01')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('GB9-01')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('GB1-00')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('GB1-99')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('INVALID')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('')).toThrow(InvalidActivityIdError);
    });

    it('throws InvalidActivityIdError for lowercase', () => {
      expect(() => ActivityId.create('gb1-01')).toThrow(InvalidActivityIdError);
    });
  });

  describe('benchmarkNumber', () => {
    it('returns the benchmark number', () => {
      expect(ActivityId.create('GB1-01').benchmarkNumber).toBe(1);
      expect(ActivityId.create('GB5-03').benchmarkNumber).toBe(5);
      expect(ActivityId.create('GB8-04').benchmarkNumber).toBe(8);
    });
  });

  describe('activityNumber', () => {
    it('returns the activity number', () => {
      expect(ActivityId.create('GB1-01').activityNumber).toBe(1);
      expect(ActivityId.create('GB5-03').activityNumber).toBe(3);
      expect(ActivityId.create('GB8-04').activityNumber).toBe(4);
    });
  });

  describe('benchmarkId', () => {
    it('returns the parent benchmark id string', () => {
      expect(ActivityId.create('GB1-01').benchmarkIdString).toBe('GB1');
      expect(ActivityId.create('GB5-03').benchmarkIdString).toBe('GB5');
    });
  });

  describe('equals', () => {
    it('returns true for same activity id', () => {
      const id1 = ActivityId.create('GB1-01');
      const id2 = ActivityId.create('GB1-01');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different activity ids', () => {
      const id1 = ActivityId.create('GB1-01');
      const id2 = ActivityId.create('GB1-02');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid (static)', () => {
    it('returns true for valid activity ids', () => {
      expect(ActivityId.isValid('GB1-01')).toBe(true);
      expect(ActivityId.isValid('GB8-04')).toBe(true);
    });

    it('returns false for invalid activity ids', () => {
      expect(ActivityId.isValid('GB0-01')).toBe(false);
      expect(ActivityId.isValid('GB9-01')).toBe(false);
      expect(ActivityId.isValid('invalid')).toBe(false);
      expect(ActivityId.isValid('')).toBe(false);
    });
  });
});

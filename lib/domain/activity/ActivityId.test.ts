import { ActivityId, InvalidActivityIdError } from './ActivityId';

describe('ActivityId', () => {
  describe('create', () => {
    it('creates valid ActivityId with alphanumeric suffix', () => {
      const id = ActivityId.create('ACT-ABC123');
      expect(id.toString()).toBe('ACT-ABC123');
    });

    it('creates valid ActivityId with lowercase suffix', () => {
      const id = ActivityId.create('ACT-abc123');
      expect(id.toString()).toBe('ACT-abc123');
    });

    it('creates valid ActivityId with mixed case suffix', () => {
      const id = ActivityId.create('ACT-AbC123xYz');
      expect(id.toString()).toBe('ACT-AbC123xYz');
    });

    it('throws InvalidActivityIdError for missing prefix', () => {
      expect(() => ActivityId.create('ABC123')).toThrow(InvalidActivityIdError);
    });

    it('throws InvalidActivityIdError for wrong prefix', () => {
      expect(() => ActivityId.create('ACTIVITY-001')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('act-001')).toThrow(InvalidActivityIdError);
    });

    it('throws InvalidActivityIdError for empty string', () => {
      expect(() => ActivityId.create('')).toThrow(InvalidActivityIdError);
    });

    it('throws InvalidActivityIdError for prefix only', () => {
      expect(() => ActivityId.create('ACT-')).toThrow(InvalidActivityIdError);
    });

    it('throws InvalidActivityIdError for special characters in suffix', () => {
      expect(() => ActivityId.create('ACT-abc_123')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('ACT-abc-123')).toThrow(InvalidActivityIdError);
      expect(() => ActivityId.create('ACT-abc 123')).toThrow(InvalidActivityIdError);
    });

    it('includes invalid value in error message', () => {
      try {
        ActivityId.create('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidActivityIdError);
        expect((error as Error).message).toContain('invalid');
      }
    });
  });

  describe('equals', () => {
    it('returns true for same activity id', () => {
      const id1 = ActivityId.create('ACT-001');
      const id2 = ActivityId.create('ACT-001');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different activity ids', () => {
      const id1 = ActivityId.create('ACT-001');
      const id2 = ActivityId.create('ACT-002');
      expect(id1.equals(id2)).toBe(false);
    });

    it('is case sensitive', () => {
      const id1 = ActivityId.create('ACT-abc');
      const id2 = ActivityId.create('ACT-ABC');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid activity ids', () => {
      expect(ActivityId.isValid('ACT-001')).toBe(true);
      expect(ActivityId.isValid('ACT-ABC123')).toBe(true);
      expect(ActivityId.isValid('ACT-xyz')).toBe(true);
    });

    it('returns false for invalid activity ids', () => {
      expect(ActivityId.isValid('')).toBe(false);
      expect(ActivityId.isValid('ACT-')).toBe(false);
      expect(ActivityId.isValid('INVALID')).toBe(false);
      expect(ActivityId.isValid('act-001')).toBe(false);
      expect(ActivityId.isValid('ACT-abc_123')).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the string value', () => {
      const id = ActivityId.create('ACT-MYACTIVITY');
      expect(id.toString()).toBe('ACT-MYACTIVITY');
    });
  });
});

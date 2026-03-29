import { CohortId, InvalidCohortIdError } from './CohortId';

describe('CohortId', () => {
  describe('create', () => {
    it('creates valid CohortId', () => {
      const id = CohortId.create('COHORT-Y10-2025');
      expect(id.toString()).toBe('COHORT-Y10-2025');
    });

    it('throws InvalidCohortIdError for missing prefix', () => {
      expect(() => CohortId.create('Y10-2025')).toThrow(InvalidCohortIdError);
    });

    it('throws InvalidCohortIdError for empty string', () => {
      expect(() => CohortId.create('')).toThrow(InvalidCohortIdError);
    });
  });

  describe('equals', () => {
    it('returns true for same cohort id', () => {
      const id1 = CohortId.create('COHORT-Y10-2025');
      const id2 = CohortId.create('COHORT-Y10-2025');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different cohort ids', () => {
      const id1 = CohortId.create('COHORT-Y10-2025');
      const id2 = CohortId.create('COHORT-Y11-2025');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid cohort ids', () => {
      expect(CohortId.isValid('COHORT-Y10-2025')).toBe(true);
    });

    it('returns false for invalid cohort ids', () => {
      expect(CohortId.isValid('COHORT-')).toBe(false);
      expect(CohortId.isValid('')).toBe(false);
    });
  });
});

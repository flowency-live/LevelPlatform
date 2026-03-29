import { LocationId, InvalidLocationIdError } from './LocationId';

describe('LocationId', () => {
  describe('create', () => {
    it('creates valid LocationId', () => {
      const id = LocationId.create('LOC-EAST');
      expect(id.toString()).toBe('LOC-EAST');
    });

    it('throws InvalidLocationIdError for missing prefix', () => {
      expect(() => LocationId.create('EAST')).toThrow(InvalidLocationIdError);
    });

    it('throws InvalidLocationIdError for empty string', () => {
      expect(() => LocationId.create('')).toThrow(InvalidLocationIdError);
    });
  });

  describe('equals', () => {
    it('returns true for same location id', () => {
      const id1 = LocationId.create('LOC-EAST');
      const id2 = LocationId.create('LOC-EAST');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different location ids', () => {
      const id1 = LocationId.create('LOC-EAST');
      const id2 = LocationId.create('LOC-WEST');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid location ids', () => {
      expect(LocationId.isValid('LOC-EAST')).toBe(true);
    });

    it('returns false for invalid location ids', () => {
      expect(LocationId.isValid('LOC-')).toBe(false);
      expect(LocationId.isValid('')).toBe(false);
    });
  });
});

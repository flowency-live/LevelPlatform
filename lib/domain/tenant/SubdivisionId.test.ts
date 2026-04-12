import { SubdivisionId, InvalidSubdivisionIdError } from './SubdivisionId';

describe('SubdivisionId', () => {
  describe('create', () => {
    it('creates valid SubdivisionId', () => {
      const id = SubdivisionId.create('SUB-EAGLE');
      expect(id.toString()).toBe('SUB-EAGLE');
    });

    it('throws InvalidSubdivisionIdError for missing prefix', () => {
      expect(() => SubdivisionId.create('EAGLE')).toThrow(InvalidSubdivisionIdError);
    });

    it('throws InvalidSubdivisionIdError for empty string', () => {
      expect(() => SubdivisionId.create('')).toThrow(InvalidSubdivisionIdError);
    });

    it('throws InvalidSubdivisionIdError for prefix only', () => {
      expect(() => SubdivisionId.create('SUB-')).toThrow(InvalidSubdivisionIdError);
    });
  });

  describe('equals', () => {
    it('returns true for same subdivision id', () => {
      const id1 = SubdivisionId.create('SUB-EAGLE');
      const id2 = SubdivisionId.create('SUB-EAGLE');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different subdivision ids', () => {
      const id1 = SubdivisionId.create('SUB-EAGLE');
      const id2 = SubdivisionId.create('SUB-HAWK');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid subdivision ids', () => {
      expect(SubdivisionId.isValid('SUB-EAGLE')).toBe(true);
      expect(SubdivisionId.isValid('SUB-HAWK')).toBe(true);
      expect(SubdivisionId.isValid('SUB-RAVEN')).toBe(true);
    });

    it('returns false for invalid subdivision ids', () => {
      expect(SubdivisionId.isValid('SUB-')).toBe(false);
      expect(SubdivisionId.isValid('')).toBe(false);
      expect(SubdivisionId.isValid('sub-eagle')).toBe(false);
      expect(SubdivisionId.isValid('HOUSE-EAGLE')).toBe(false);
    });
  });
});

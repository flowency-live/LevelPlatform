import { ASDANUnitId, InvalidASDANUnitIdError } from './ASDANUnitId';

describe('ASDANUnitId', () => {
  describe('create', () => {
    it('creates valid ASDANUnitId with alphanumeric code', () => {
      const id = ASDANUnitId.create('ASDAN-COPE001');
      expect(id.toString()).toBe('ASDAN-COPE001');
    });

    it('creates valid ASDANUnitId with various codes', () => {
      const validIds = ['ASDAN-COPE001', 'ASDAN-EMP01', 'ASDAN-WRL001', 'ASDAN-PSD01'];
      validIds.forEach((value) => {
        const id = ASDANUnitId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('creates valid ASDANUnitId with lowercase code', () => {
      const id = ASDANUnitId.create('ASDAN-cope001');
      expect(id.toString()).toBe('ASDAN-cope001');
    });

    it('throws InvalidASDANUnitIdError for missing prefix', () => {
      expect(() => ASDANUnitId.create('COPE001')).toThrow(InvalidASDANUnitIdError);
    });

    it('throws InvalidASDANUnitIdError for wrong prefix', () => {
      expect(() => ASDANUnitId.create('asdan-COPE001')).toThrow(InvalidASDANUnitIdError);
      expect(() => ASDANUnitId.create('UNIT-COPE001')).toThrow(InvalidASDANUnitIdError);
    });

    it('throws InvalidASDANUnitIdError for empty string', () => {
      expect(() => ASDANUnitId.create('')).toThrow(InvalidASDANUnitIdError);
    });

    it('throws InvalidASDANUnitIdError for prefix only', () => {
      expect(() => ASDANUnitId.create('ASDAN-')).toThrow(InvalidASDANUnitIdError);
    });

    it('throws InvalidASDANUnitIdError for special characters in code', () => {
      expect(() => ASDANUnitId.create('ASDAN-COPE_001')).toThrow(InvalidASDANUnitIdError);
      expect(() => ASDANUnitId.create('ASDAN-COPE 001')).toThrow(InvalidASDANUnitIdError);
    });

    it('includes invalid value in error message', () => {
      try {
        ASDANUnitId.create('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidASDANUnitIdError);
        expect((error as Error).message).toContain('invalid');
      }
    });
  });

  describe('equals', () => {
    it('returns true for same ASDAN unit id', () => {
      const id1 = ASDANUnitId.create('ASDAN-COPE001');
      const id2 = ASDANUnitId.create('ASDAN-COPE001');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different ASDAN unit ids', () => {
      const id1 = ASDANUnitId.create('ASDAN-COPE001');
      const id2 = ASDANUnitId.create('ASDAN-COPE002');
      expect(id1.equals(id2)).toBe(false);
    });

    it('is case sensitive', () => {
      const id1 = ASDANUnitId.create('ASDAN-cope001');
      const id2 = ASDANUnitId.create('ASDAN-COPE001');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid ASDAN unit ids', () => {
      expect(ASDANUnitId.isValid('ASDAN-COPE001')).toBe(true);
      expect(ASDANUnitId.isValid('ASDAN-EMP01')).toBe(true);
      expect(ASDANUnitId.isValid('ASDAN-xyz123')).toBe(true);
    });

    it('returns false for invalid ASDAN unit ids', () => {
      expect(ASDANUnitId.isValid('')).toBe(false);
      expect(ASDANUnitId.isValid('ASDAN-')).toBe(false);
      expect(ASDANUnitId.isValid('INVALID')).toBe(false);
      expect(ASDANUnitId.isValid('asdan-COPE001')).toBe(false);
      expect(ASDANUnitId.isValid('ASDAN-COPE_001')).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the string value', () => {
      const id = ASDANUnitId.create('ASDAN-COPE001');
      expect(id.toString()).toBe('ASDAN-COPE001');
    });
  });
});

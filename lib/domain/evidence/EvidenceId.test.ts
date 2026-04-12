import { EvidenceId, InvalidEvidenceIdError } from './EvidenceId';

describe('EvidenceId', () => {
  describe('create', () => {
    it('creates valid EvidenceId with alphanumeric suffix', () => {
      const id = EvidenceId.create('EVD-ABC123');
      expect(id.toString()).toBe('EVD-ABC123');
    });

    it('creates valid EvidenceId with lowercase suffix', () => {
      const id = EvidenceId.create('EVD-abc123');
      expect(id.toString()).toBe('EVD-abc123');
    });

    it('creates valid EvidenceId with mixed case suffix', () => {
      const id = EvidenceId.create('EVD-AbC123xYz');
      expect(id.toString()).toBe('EVD-AbC123xYz');
    });

    it('throws InvalidEvidenceIdError for missing prefix', () => {
      expect(() => EvidenceId.create('ABC123')).toThrow(InvalidEvidenceIdError);
    });

    it('throws InvalidEvidenceIdError for wrong prefix', () => {
      expect(() => EvidenceId.create('EVIDENCE-001')).toThrow(InvalidEvidenceIdError);
      expect(() => EvidenceId.create('evd-001')).toThrow(InvalidEvidenceIdError);
    });

    it('throws InvalidEvidenceIdError for empty string', () => {
      expect(() => EvidenceId.create('')).toThrow(InvalidEvidenceIdError);
    });

    it('throws InvalidEvidenceIdError for prefix only', () => {
      expect(() => EvidenceId.create('EVD-')).toThrow(InvalidEvidenceIdError);
    });

    it('throws InvalidEvidenceIdError for special characters in suffix', () => {
      expect(() => EvidenceId.create('EVD-abc_123')).toThrow(InvalidEvidenceIdError);
      expect(() => EvidenceId.create('EVD-abc-123')).toThrow(InvalidEvidenceIdError);
      expect(() => EvidenceId.create('EVD-abc 123')).toThrow(InvalidEvidenceIdError);
    });

    it('includes invalid value in error message', () => {
      try {
        EvidenceId.create('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidEvidenceIdError);
        expect((error as Error).message).toContain('invalid');
      }
    });
  });

  describe('equals', () => {
    it('returns true for same evidence id', () => {
      const id1 = EvidenceId.create('EVD-001');
      const id2 = EvidenceId.create('EVD-001');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different evidence ids', () => {
      const id1 = EvidenceId.create('EVD-001');
      const id2 = EvidenceId.create('EVD-002');
      expect(id1.equals(id2)).toBe(false);
    });

    it('is case sensitive', () => {
      const id1 = EvidenceId.create('EVD-abc');
      const id2 = EvidenceId.create('EVD-ABC');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid evidence ids', () => {
      expect(EvidenceId.isValid('EVD-001')).toBe(true);
      expect(EvidenceId.isValid('EVD-ABC123')).toBe(true);
      expect(EvidenceId.isValid('EVD-xyz')).toBe(true);
    });

    it('returns false for invalid evidence ids', () => {
      expect(EvidenceId.isValid('')).toBe(false);
      expect(EvidenceId.isValid('EVD-')).toBe(false);
      expect(EvidenceId.isValid('INVALID')).toBe(false);
      expect(EvidenceId.isValid('evd-001')).toBe(false);
      expect(EvidenceId.isValid('EVD-abc_123')).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the string value', () => {
      const id = EvidenceId.create('EVD-MYEVIDENCE');
      expect(id.toString()).toBe('EVD-MYEVIDENCE');
    });
  });
});

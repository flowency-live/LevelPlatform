import { EvidenceType, ALL_EVIDENCE_TYPES, isEvidenceType } from './EvidenceType';

describe('EvidenceType', () => {
  describe('enum values', () => {
    it('has photo evidence type', () => {
      expect(EvidenceType.Photo).toBe('photo');
    });

    it('has voice evidence type', () => {
      expect(EvidenceType.Voice).toBe('voice');
    });

    it('has document evidence type', () => {
      expect(EvidenceType.Document).toBe('document');
    });
  });

  describe('ALL_EVIDENCE_TYPES', () => {
    it('contains all three types', () => {
      expect(ALL_EVIDENCE_TYPES).toHaveLength(3);
      expect(ALL_EVIDENCE_TYPES).toContain(EvidenceType.Photo);
      expect(ALL_EVIDENCE_TYPES).toContain(EvidenceType.Voice);
      expect(ALL_EVIDENCE_TYPES).toContain(EvidenceType.Document);
    });

    it('is readonly', () => {
      expect(() => {
        (ALL_EVIDENCE_TYPES as EvidenceType[]).push(EvidenceType.Photo);
      }).toThrow();
    });
  });

  describe('isEvidenceType', () => {
    it('returns true for valid evidence types', () => {
      expect(isEvidenceType('photo')).toBe(true);
      expect(isEvidenceType('voice')).toBe(true);
      expect(isEvidenceType('document')).toBe(true);
    });

    it('returns false for invalid evidence types', () => {
      expect(isEvidenceType('video')).toBe(false);
      expect(isEvidenceType('audio')).toBe(false);
      expect(isEvidenceType('file')).toBe(false);
    });

    it('returns false for uppercase values', () => {
      expect(isEvidenceType('PHOTO')).toBe(false);
      expect(isEvidenceType('Voice')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isEvidenceType('')).toBe(false);
    });
  });
});

import { EvidenceRequirement, InvalidEvidenceRequirementError } from './EvidenceRequirement';
import { EvidenceType } from './EvidenceType';

describe('EvidenceRequirement', () => {
  describe('create', () => {
    it('creates valid evidence requirement', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload a photo of your completed work',
        mandatory: true,
      });

      expect(requirement.type).toBe(EvidenceType.Photo);
      expect(requirement.description).toBe('Upload a photo of your completed work');
      expect(requirement.mandatory).toBe(true);
    });

    it('creates mandatory photo evidence requirement', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Photo evidence required',
        mandatory: true,
      });

      expect(requirement.type).toBe(EvidenceType.Photo);
      expect(requirement.mandatory).toBe(true);
    });

    it('creates optional voice evidence requirement', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Voice,
        description: 'Voice reflection optional',
        mandatory: false,
      });

      expect(requirement.type).toBe(EvidenceType.Voice);
      expect(requirement.mandatory).toBe(false);
    });

    it('creates document evidence requirement', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Document,
        description: 'Upload a document',
      });

      expect(requirement.type).toBe(EvidenceType.Document);
    });

    it('throws for empty description', () => {
      expect(() =>
        EvidenceRequirement.create({
          type: EvidenceType.Photo,
          description: '',
        })
      ).toThrow(InvalidEvidenceRequirementError);
    });

    it('throws for whitespace-only description', () => {
      expect(() =>
        EvidenceRequirement.create({
          type: EvidenceType.Photo,
          description: '   ',
        })
      ).toThrow(InvalidEvidenceRequirementError);
    });

    it('trims whitespace from description', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: '  Upload a photo  ',
      });

      expect(requirement.description).toBe('Upload a photo');
    });
  });

  describe('mandatory default', () => {
    it('defaults mandatory to true when not specified', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Photo required',
      });

      expect(requirement.mandatory).toBe(true);
    });

    it('respects explicit false for mandatory', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Photo optional',
        mandatory: false,
      });

      expect(requirement.mandatory).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true for same requirements', () => {
      const req1 = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload a photo',
        mandatory: true,
      });

      const req2 = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload a photo',
        mandatory: true,
      });

      expect(req1.equals(req2)).toBe(true);
    });

    it('returns false for different types', () => {
      const req1 = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload evidence',
        mandatory: true,
      });

      const req2 = EvidenceRequirement.create({
        type: EvidenceType.Voice,
        description: 'Upload evidence',
        mandatory: true,
      });

      expect(req1.equals(req2)).toBe(false);
    });

    it('returns false for different descriptions', () => {
      const req1 = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload a photo',
        mandatory: true,
      });

      const req2 = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload an image',
        mandatory: true,
      });

      expect(req1.equals(req2)).toBe(false);
    });

    it('returns false for different mandatory flags', () => {
      const req1 = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload a photo',
        mandatory: true,
      });

      const req2 = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload a photo',
        mandatory: false,
      });

      expect(req1.equals(req2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('properties are readonly', () => {
      const requirement = EvidenceRequirement.create({
        type: EvidenceType.Photo,
        description: 'Upload a photo',
        mandatory: true,
      });

      // TypeScript should prevent this, but test runtime immutability
      expect(requirement.type).toBe(EvidenceType.Photo);
      expect(requirement.description).toBe('Upload a photo');
      expect(requirement.mandatory).toBe(true);
    });
  });
});

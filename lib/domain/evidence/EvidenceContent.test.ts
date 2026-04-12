import { EvidenceContent, InvalidEvidenceContentError } from './EvidenceContent';
import { EvidenceType } from '../activity/EvidenceType';

describe('EvidenceContent', () => {
  const uploadedAt = new Date('2026-04-12T10:00:00Z');

  describe('create', () => {
    it('creates valid evidence content with photo type', () => {
      const content = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photos/abc123.jpg',
        uploadedAt,
      });

      expect(content.type).toBe(EvidenceType.Photo);
      expect(content.url).toBe('https://storage.example.com/photos/abc123.jpg');
      expect(content.uploadedAt).toEqual(uploadedAt);
    });

    it('creates valid evidence content with voice type', () => {
      const content = EvidenceContent.create({
        type: EvidenceType.Voice,
        url: 'https://storage.example.com/voice/xyz789.mp3',
        uploadedAt,
      });

      expect(content.type).toBe(EvidenceType.Voice);
      expect(content.url).toBe('https://storage.example.com/voice/xyz789.mp3');
    });

    it('creates valid evidence content with document type', () => {
      const content = EvidenceContent.create({
        type: EvidenceType.Document,
        url: 'https://storage.example.com/docs/report.pdf',
        uploadedAt,
      });

      expect(content.type).toBe(EvidenceType.Document);
    });

    it('throws for empty url', () => {
      expect(() =>
        EvidenceContent.create({
          type: EvidenceType.Photo,
          url: '',
          uploadedAt,
        })
      ).toThrow(InvalidEvidenceContentError);
    });

    it('throws for whitespace-only url', () => {
      expect(() =>
        EvidenceContent.create({
          type: EvidenceType.Photo,
          url: '   ',
          uploadedAt,
        })
      ).toThrow(InvalidEvidenceContentError);
    });

    it('trims whitespace from url', () => {
      const content = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: '  https://storage.example.com/photo.jpg  ',
        uploadedAt,
      });

      expect(content.url).toBe('https://storage.example.com/photo.jpg');
    });

    it('includes error details in error message', () => {
      try {
        EvidenceContent.create({
          type: EvidenceType.Photo,
          url: '',
          uploadedAt,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidEvidenceContentError);
        expect((error as Error).message).toContain('url');
      }
    });
  });

  describe('equals', () => {
    it('returns true for same content', () => {
      const content1 = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photo.jpg',
        uploadedAt,
      });

      const content2 = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photo.jpg',
        uploadedAt,
      });

      expect(content1.equals(content2)).toBe(true);
    });

    it('returns false for different types', () => {
      const content1 = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/file.jpg',
        uploadedAt,
      });

      const content2 = EvidenceContent.create({
        type: EvidenceType.Voice,
        url: 'https://storage.example.com/file.jpg',
        uploadedAt,
      });

      expect(content1.equals(content2)).toBe(false);
    });

    it('returns false for different urls', () => {
      const content1 = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photo1.jpg',
        uploadedAt,
      });

      const content2 = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photo2.jpg',
        uploadedAt,
      });

      expect(content1.equals(content2)).toBe(false);
    });

    it('returns false for different uploadedAt', () => {
      const content1 = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photo.jpg',
        uploadedAt: new Date('2026-04-12T10:00:00Z'),
      });

      const content2 = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photo.jpg',
        uploadedAt: new Date('2026-04-12T11:00:00Z'),
      });

      expect(content1.equals(content2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('properties are readonly', () => {
      const content = EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/photo.jpg',
        uploadedAt,
      });

      expect(content.type).toBe(EvidenceType.Photo);
      expect(content.url).toBe('https://storage.example.com/photo.jpg');
      expect(content.uploadedAt).toEqual(uploadedAt);
    });
  });
});

import {
  SubmissionStatus,
  ALL_SUBMISSION_STATUSES,
  isSubmissionStatus,
} from './SubmissionStatus';

describe('SubmissionStatus', () => {
  describe('enum values', () => {
    it('has pending status', () => {
      expect(SubmissionStatus.Pending).toBe('pending');
    });

    it('has approved status', () => {
      expect(SubmissionStatus.Approved).toBe('approved');
    });

    it('has rejected status', () => {
      expect(SubmissionStatus.Rejected).toBe('rejected');
    });
  });

  describe('ALL_SUBMISSION_STATUSES', () => {
    it('contains all three statuses', () => {
      expect(ALL_SUBMISSION_STATUSES).toHaveLength(3);
      expect(ALL_SUBMISSION_STATUSES).toContain(SubmissionStatus.Pending);
      expect(ALL_SUBMISSION_STATUSES).toContain(SubmissionStatus.Approved);
      expect(ALL_SUBMISSION_STATUSES).toContain(SubmissionStatus.Rejected);
    });

    it('is readonly', () => {
      expect(() => {
        (ALL_SUBMISSION_STATUSES as SubmissionStatus[]).push(SubmissionStatus.Pending);
      }).toThrow();
    });
  });

  describe('isSubmissionStatus', () => {
    it('returns true for valid statuses', () => {
      expect(isSubmissionStatus('pending')).toBe(true);
      expect(isSubmissionStatus('approved')).toBe(true);
      expect(isSubmissionStatus('rejected')).toBe(true);
    });

    it('returns false for invalid statuses', () => {
      expect(isSubmissionStatus('draft')).toBe(false);
      expect(isSubmissionStatus('completed')).toBe(false);
      expect(isSubmissionStatus('unknown')).toBe(false);
    });

    it('returns false for uppercase values', () => {
      expect(isSubmissionStatus('PENDING')).toBe(false);
      expect(isSubmissionStatus('Approved')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isSubmissionStatus('')).toBe(false);
    });
  });
});

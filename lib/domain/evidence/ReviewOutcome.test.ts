import { ReviewOutcome } from './ReviewOutcome';
import { SubmissionStatus } from './SubmissionStatus';
import { StaffId } from '../staff/StaffId';

describe('ReviewOutcome', () => {
  const reviewedAt = new Date('2026-04-12T14:00:00Z');
  const reviewerStaffId = StaffId.create('STAFF-GATSBY01');

  describe('create', () => {
    it('creates approved review without feedback', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
      });

      expect(outcome.status).toBe(SubmissionStatus.Approved);
      expect(outcome.reviewedBy.equals(reviewerStaffId)).toBe(true);
      expect(outcome.reviewedAt).toEqual(reviewedAt);
      expect(outcome.feedback).toBeUndefined();
    });

    it('creates approved review with feedback', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Excellent work!',
      });

      expect(outcome.status).toBe(SubmissionStatus.Approved);
      expect(outcome.feedback).toBe('Excellent work!');
    });

    it('creates rejected review with feedback', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Rejected,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Please provide clearer evidence',
      });

      expect(outcome.status).toBe(SubmissionStatus.Rejected);
      expect(outcome.feedback).toBe('Please provide clearer evidence');
    });

    it('trims whitespace from feedback', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: '  Great work!  ',
      });

      expect(outcome.feedback).toBe('Great work!');
    });

    it('converts empty feedback to undefined', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: '   ',
      });

      expect(outcome.feedback).toBeUndefined();
    });
  });

  describe('isApproved', () => {
    it('returns true for approved review', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
      });

      expect(outcome.isApproved()).toBe(true);
    });

    it('returns false for rejected review', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Rejected,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Needs improvement',
      });

      expect(outcome.isApproved()).toBe(false);
    });
  });

  describe('isRejected', () => {
    it('returns true for rejected review', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Rejected,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Needs improvement',
      });

      expect(outcome.isRejected()).toBe(true);
    });

    it('returns false for approved review', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
      });

      expect(outcome.isRejected()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true for same outcomes', () => {
      const outcome1 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Great!',
      });

      const outcome2 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        reviewedAt,
        feedback: 'Great!',
      });

      expect(outcome1.equals(outcome2)).toBe(true);
    });

    it('returns false for different statuses', () => {
      const outcome1 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
      });

      const outcome2 = ReviewOutcome.create({
        status: SubmissionStatus.Rejected,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Rejected',
      });

      expect(outcome1.equals(outcome2)).toBe(false);
    });

    it('returns false for different reviewers', () => {
      const outcome1 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        reviewedAt,
      });

      const outcome2 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: StaffId.create('STAFF-GATSBY02'),
        reviewedAt,
      });

      expect(outcome1.equals(outcome2)).toBe(false);
    });

    it('returns false for different reviewedAt', () => {
      const outcome1 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt: new Date('2026-04-12T14:00:00Z'),
      });

      const outcome2 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt: new Date('2026-04-12T15:00:00Z'),
      });

      expect(outcome1.equals(outcome2)).toBe(false);
    });

    it('returns false for different feedback', () => {
      const outcome1 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Great!',
      });

      const outcome2 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Good work!',
      });

      expect(outcome1.equals(outcome2)).toBe(false);
    });

    it('returns true for both undefined feedback', () => {
      const outcome1 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
      });

      const outcome2 = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
      });

      expect(outcome1.equals(outcome2)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('properties are readonly', () => {
      const outcome = ReviewOutcome.create({
        status: SubmissionStatus.Approved,
        reviewedBy: reviewerStaffId,
        reviewedAt,
        feedback: 'Good',
      });

      expect(outcome.status).toBe(SubmissionStatus.Approved);
      expect(outcome.reviewedBy.equals(reviewerStaffId)).toBe(true);
      expect(outcome.reviewedAt).toEqual(reviewedAt);
      expect(outcome.feedback).toBe('Good');
    });
  });
});

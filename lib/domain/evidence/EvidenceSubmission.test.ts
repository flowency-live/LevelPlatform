import {
  EvidenceSubmission,
  InvalidEvidenceSubmissionError,
  InvalidStateTransitionError,
} from './EvidenceSubmission';
import { EvidenceId } from './EvidenceId';
import { EvidenceContent } from './EvidenceContent';
import { SubmissionStatus } from './SubmissionStatus';
import { StudentId } from '../student/StudentId';
import { ActivityId } from '../activity/ActivityId';
import { StaffId } from '../staff/StaffId';
import { EvidenceType } from '../activity/EvidenceType';

describe('EvidenceSubmission', () => {
  const submittedAt = new Date('2026-04-12T09:00:00Z');
  const reviewedAt = new Date('2026-04-12T14:00:00Z');
  const updatedAt = new Date('2026-04-12T14:00:00Z');

  const studentId = StudentId.create('STUDENT-ABC123');
  const activityId = ActivityId.create('ACT-001');
  const evidenceId = EvidenceId.create('EVD-001');
  const reviewerStaffId = StaffId.create('STAFF-GATSBY01');

  const content = EvidenceContent.create({
    type: EvidenceType.Photo,
    url: 'https://storage.example.com/photos/evidence.jpg',
    uploadedAt: submittedAt,
  });

  const createSubmission = (
    overrides: Partial<{
      id: EvidenceId;
      studentId: StudentId;
      activityId: ActivityId;
      content: EvidenceContent;
      status: SubmissionStatus;
    }> = {}
  ) => {
    return EvidenceSubmission.create({
      id: overrides.id ?? evidenceId,
      studentId: overrides.studentId ?? studentId,
      activityId: overrides.activityId ?? activityId,
      content: overrides.content ?? content,
      submittedAt,
      updatedAt: submittedAt,
    });
  };

  describe('create', () => {
    it('creates submission with Pending status by default', () => {
      const submission = createSubmission();

      expect(submission.id.equals(evidenceId)).toBe(true);
      expect(submission.studentId.equals(studentId)).toBe(true);
      expect(submission.activityId.equals(activityId)).toBe(true);
      expect(submission.content.equals(content)).toBe(true);
      expect(submission.status).toBe(SubmissionStatus.Pending);
      expect(submission.review).toBeUndefined();
      expect(submission.submittedAt).toEqual(submittedAt);
    });

    it('creates submission with all required fields', () => {
      const submission = EvidenceSubmission.create({
        id: EvidenceId.create('EVD-XYZ789'),
        studentId: StudentId.create('STUDENT-XYZ789'),
        activityId: ActivityId.create('ACT-XYZ'),
        content: EvidenceContent.create({
          type: EvidenceType.Voice,
          url: 'https://storage.example.com/voice/recording.mp3',
          uploadedAt: submittedAt,
        }),
        submittedAt,
        updatedAt: submittedAt,
      });

      expect(submission.status).toBe(SubmissionStatus.Pending);
    });
  });

  describe('approve', () => {
    it('returns new instance with Approved status', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);

      expect(approved.status).toBe(SubmissionStatus.Approved);
      expect(submission.status).toBe(SubmissionStatus.Pending); // Original unchanged
    });

    it('creates ReviewOutcome with reviewer details', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);

      expect(approved.review).not.toBeUndefined();
      expect(approved.review!.status).toBe(SubmissionStatus.Approved);
      expect(approved.review!.reviewedBy.equals(reviewerStaffId)).toBe(true);
      expect(approved.review!.reviewedAt).toEqual(reviewedAt);
    });

    it('includes optional feedback', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt, 'Excellent work!');

      expect(approved.review!.feedback).toBe('Excellent work!');
    });

    it('updates the updatedAt timestamp', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);

      expect(approved.updatedAt).toEqual(reviewedAt);
    });

    it('preserves all other properties', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);

      expect(approved.id.equals(submission.id)).toBe(true);
      expect(approved.studentId.equals(submission.studentId)).toBe(true);
      expect(approved.activityId.equals(submission.activityId)).toBe(true);
      expect(approved.content.equals(submission.content)).toBe(true);
      expect(approved.submittedAt).toEqual(submission.submittedAt);
    });

    it('throws when submission is already approved', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);

      expect(() => approved.approve(reviewerStaffId, reviewedAt)).toThrow(
        InvalidStateTransitionError
      );
    });

    it('throws when submission is already rejected', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'Needs improvement');

      expect(() => rejected.approve(reviewerStaffId, reviewedAt)).toThrow(
        InvalidStateTransitionError
      );
    });
  });

  describe('reject', () => {
    it('returns new instance with Rejected status', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'Needs clearer evidence');

      expect(rejected.status).toBe(SubmissionStatus.Rejected);
      expect(submission.status).toBe(SubmissionStatus.Pending); // Original unchanged
    });

    it('creates ReviewOutcome with feedback', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'Please resubmit');

      expect(rejected.review).not.toBeUndefined();
      expect(rejected.review!.status).toBe(SubmissionStatus.Rejected);
      expect(rejected.review!.feedback).toBe('Please resubmit');
    });

    it('requires feedback', () => {
      const submission = createSubmission();

      expect(() => submission.reject(reviewerStaffId, reviewedAt, '')).toThrow(
        InvalidEvidenceSubmissionError
      );
    });

    it('rejects whitespace-only feedback', () => {
      const submission = createSubmission();

      expect(() => submission.reject(reviewerStaffId, reviewedAt, '   ')).toThrow(
        InvalidEvidenceSubmissionError
      );
    });

    it('updates the updatedAt timestamp', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'Feedback');

      expect(rejected.updatedAt).toEqual(reviewedAt);
    });

    it('throws when submission is already approved', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);

      expect(() => approved.reject(reviewerStaffId, reviewedAt, 'Too late')).toThrow(
        InvalidStateTransitionError
      );
    });

    it('throws when submission is already rejected', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'First rejection');

      expect(() => rejected.reject(reviewerStaffId, reviewedAt, 'Second rejection')).toThrow(
        InvalidStateTransitionError
      );
    });
  });

  describe('isPending', () => {
    it('returns true for pending submission', () => {
      const submission = createSubmission();
      expect(submission.isPending()).toBe(true);
    });

    it('returns false for approved submission', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);
      expect(approved.isPending()).toBe(false);
    });

    it('returns false for rejected submission', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'Feedback');
      expect(rejected.isPending()).toBe(false);
    });
  });

  describe('isApproved', () => {
    it('returns true for approved submission', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);
      expect(approved.isApproved()).toBe(true);
    });

    it('returns false for pending submission', () => {
      const submission = createSubmission();
      expect(submission.isApproved()).toBe(false);
    });

    it('returns false for rejected submission', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'Feedback');
      expect(rejected.isApproved()).toBe(false);
    });
  });

  describe('isRejected', () => {
    it('returns true for rejected submission', () => {
      const submission = createSubmission();
      const rejected = submission.reject(reviewerStaffId, reviewedAt, 'Feedback');
      expect(rejected.isRejected()).toBe(true);
    });

    it('returns false for pending submission', () => {
      const submission = createSubmission();
      expect(submission.isRejected()).toBe(false);
    });

    it('returns false for approved submission', () => {
      const submission = createSubmission();
      const approved = submission.approve(reviewerStaffId, reviewedAt);
      expect(approved.isRejected()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true for same id', () => {
      const submission1 = createSubmission({ id: EvidenceId.create('EVD-SAME') });
      const submission2 = createSubmission({ id: EvidenceId.create('EVD-SAME') });

      expect(submission1.equals(submission2)).toBe(true);
    });

    it('returns false for different ids', () => {
      const submission1 = createSubmission({ id: EvidenceId.create('EVD-001') });
      const submission2 = createSubmission({ id: EvidenceId.create('EVD-002') });

      expect(submission1.equals(submission2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('approve returns new instance', () => {
      const original = createSubmission();
      const approved = original.approve(reviewerStaffId, reviewedAt);

      expect(original).not.toBe(approved);
      expect(original.status).toBe(SubmissionStatus.Pending);
      expect(approved.status).toBe(SubmissionStatus.Approved);
    });

    it('reject returns new instance', () => {
      const original = createSubmission();
      const rejected = original.reject(reviewerStaffId, reviewedAt, 'Feedback');

      expect(original).not.toBe(rejected);
      expect(original.status).toBe(SubmissionStatus.Pending);
      expect(rejected.status).toBe(SubmissionStatus.Rejected);
    });
  });
});

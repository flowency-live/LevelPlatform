import { EvidenceId } from './EvidenceId';
import { EvidenceContent } from './EvidenceContent';
import { SubmissionStatus } from './SubmissionStatus';
import { ReviewOutcome } from './ReviewOutcome';
import { StudentId } from '../student/StudentId';
import { ActivityId } from '../activity/ActivityId';
import { StaffId } from '../staff/StaffId';

export interface EvidenceSubmissionProps {
  readonly id: EvidenceId;
  readonly studentId: StudentId;
  readonly activityId: ActivityId;
  readonly content: EvidenceContent;
  readonly submittedAt: Date;
  readonly updatedAt: Date;
}

interface InternalEvidenceSubmissionProps extends EvidenceSubmissionProps {
  readonly status: SubmissionStatus;
  readonly review?: ReviewOutcome;
}

export class InvalidEvidenceSubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEvidenceSubmissionError';
  }
}

export class InvalidStateTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateTransitionError';
  }
}

export class EvidenceSubmission {
  readonly id: EvidenceId;
  readonly studentId: StudentId;
  readonly activityId: ActivityId;
  readonly content: EvidenceContent;
  readonly status: SubmissionStatus;
  readonly review: ReviewOutcome | undefined;
  readonly submittedAt: Date;
  readonly updatedAt: Date;

  private constructor(props: InternalEvidenceSubmissionProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.activityId = props.activityId;
    this.content = props.content;
    this.status = props.status;
    this.review = props.review;
    this.submittedAt = props.submittedAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: EvidenceSubmissionProps): EvidenceSubmission {
    return new EvidenceSubmission({
      ...props,
      status: SubmissionStatus.Pending,
      review: undefined,
    });
  }

  approve(reviewedBy: StaffId, reviewedAt: Date, feedback?: string): EvidenceSubmission {
    if (!this.isPending()) {
      throw new InvalidStateTransitionError(
        `Cannot approve submission with status "${this.status}". Only pending submissions can be approved.`
      );
    }

    const review = ReviewOutcome.create({
      status: SubmissionStatus.Approved,
      reviewedBy,
      reviewedAt,
      feedback,
    });

    return new EvidenceSubmission({
      id: this.id,
      studentId: this.studentId,
      activityId: this.activityId,
      content: this.content,
      status: SubmissionStatus.Approved,
      review,
      submittedAt: this.submittedAt,
      updatedAt: reviewedAt,
    });
  }

  reject(reviewedBy: StaffId, reviewedAt: Date, feedback: string): EvidenceSubmission {
    if (!this.isPending()) {
      throw new InvalidStateTransitionError(
        `Cannot reject submission with status "${this.status}". Only pending submissions can be rejected.`
      );
    }

    const trimmedFeedback = feedback.trim();
    if (trimmedFeedback.length === 0) {
      throw new InvalidEvidenceSubmissionError(
        'Rejection feedback cannot be empty'
      );
    }

    const review = ReviewOutcome.create({
      status: SubmissionStatus.Rejected,
      reviewedBy,
      reviewedAt,
      feedback: trimmedFeedback,
    });

    return new EvidenceSubmission({
      id: this.id,
      studentId: this.studentId,
      activityId: this.activityId,
      content: this.content,
      status: SubmissionStatus.Rejected,
      review,
      submittedAt: this.submittedAt,
      updatedAt: reviewedAt,
    });
  }

  isPending(): boolean {
    return this.status === SubmissionStatus.Pending;
  }

  isApproved(): boolean {
    return this.status === SubmissionStatus.Approved;
  }

  isRejected(): boolean {
    return this.status === SubmissionStatus.Rejected;
  }

  equals(other: EvidenceSubmission): boolean {
    return this.id.equals(other.id);
  }
}

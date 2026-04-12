import { SubmissionStatus } from './SubmissionStatus';
import { StaffId } from '../staff/StaffId';

export interface ReviewOutcomeProps {
  readonly status: SubmissionStatus.Approved | SubmissionStatus.Rejected;
  readonly reviewedBy: StaffId;
  readonly reviewedAt: Date;
  readonly feedback?: string;
}

export class InvalidReviewOutcomeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReviewOutcomeError';
  }
}

export class ReviewOutcome {
  readonly status: SubmissionStatus.Approved | SubmissionStatus.Rejected;
  readonly reviewedBy: StaffId;
  readonly reviewedAt: Date;
  readonly feedback: string | undefined;

  private constructor(props: ReviewOutcomeProps & { feedback?: string }) {
    this.status = props.status;
    this.reviewedBy = props.reviewedBy;
    this.reviewedAt = props.reviewedAt;
    this.feedback = props.feedback;
  }

  static create(props: ReviewOutcomeProps): ReviewOutcome {
    if (props.status === SubmissionStatus.Pending) {
      throw new InvalidReviewOutcomeError(
        'Review outcome cannot have Pending status. Must be Approved or Rejected.'
      );
    }

    const trimmedFeedback = props.feedback?.trim();
    const feedback = trimmedFeedback && trimmedFeedback.length > 0 ? trimmedFeedback : undefined;

    return new ReviewOutcome({
      ...props,
      feedback,
    });
  }

  isApproved(): boolean {
    return this.status === SubmissionStatus.Approved;
  }

  isRejected(): boolean {
    return this.status === SubmissionStatus.Rejected;
  }

  equals(other: ReviewOutcome): boolean {
    return (
      this.status === other.status &&
      this.reviewedBy.equals(other.reviewedBy) &&
      this.reviewedAt.getTime() === other.reviewedAt.getTime() &&
      this.feedback === other.feedback
    );
  }
}

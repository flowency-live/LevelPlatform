export enum SubmissionStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export const ALL_SUBMISSION_STATUSES: readonly SubmissionStatus[] = Object.freeze([
  SubmissionStatus.Pending,
  SubmissionStatus.Approved,
  SubmissionStatus.Rejected,
]);

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return ALL_SUBMISSION_STATUSES.includes(value as SubmissionStatus);
}

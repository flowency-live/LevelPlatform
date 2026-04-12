import { EvidenceRepository } from './EvidenceRepository';
import { EvidenceSubmission } from './EvidenceSubmission';
import { EvidenceId } from './EvidenceId';
import { SubmissionStatus } from './SubmissionStatus';
import { StudentId } from '../student/StudentId';
import { ActivityId } from '../activity/ActivityId';

export class InMemoryEvidenceRepository implements EvidenceRepository {
  private readonly submissions: Map<string, EvidenceSubmission> = new Map();

  async findById(id: EvidenceId): Promise<EvidenceSubmission | null> {
    return this.submissions.get(id.toString()) ?? null;
  }

  async findByStudent(studentId: StudentId): Promise<EvidenceSubmission[]> {
    return Array.from(this.submissions.values()).filter((submission) =>
      submission.studentId.equals(studentId)
    );
  }

  async findByActivity(activityId: ActivityId): Promise<EvidenceSubmission[]> {
    return Array.from(this.submissions.values()).filter((submission) =>
      submission.activityId.equals(activityId)
    );
  }

  async findByStudentAndActivity(
    studentId: StudentId,
    activityId: ActivityId
  ): Promise<EvidenceSubmission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) =>
        submission.studentId.equals(studentId) &&
        submission.activityId.equals(activityId)
    );
  }

  async findPending(): Promise<EvidenceSubmission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.status === SubmissionStatus.Pending
    );
  }

  async save(submission: EvidenceSubmission): Promise<void> {
    this.submissions.set(submission.id.toString(), submission);
  }
}

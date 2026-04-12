import { EvidenceSubmission } from './EvidenceSubmission';
import { EvidenceId } from './EvidenceId';
import { StudentId } from '../student/StudentId';
import { ActivityId } from '../activity/ActivityId';

export interface EvidenceRepository {
  findById(id: EvidenceId): Promise<EvidenceSubmission | null>;
  findByStudent(studentId: StudentId): Promise<EvidenceSubmission[]>;
  findByActivity(activityId: ActivityId): Promise<EvidenceSubmission[]>;
  findByStudentAndActivity(
    studentId: StudentId,
    activityId: ActivityId
  ): Promise<EvidenceSubmission[]>;
  findPending(): Promise<EvidenceSubmission[]>;
  save(submission: EvidenceSubmission): Promise<void>;
}

import { EvidenceSubmission } from '../domain/evidence/EvidenceSubmission';
import { EvidenceRepository } from '../domain/evidence/EvidenceRepository';
import { StudentId } from '../domain/student/StudentId';
import { ActivityId } from '../domain/activity/ActivityId';

export interface GetStudentEvidenceRequest {
  studentId: StudentId;
  activityId?: ActivityId;
}

export class GetStudentEvidence {
  constructor(private readonly evidenceRepository: EvidenceRepository) {}

  async execute(request: GetStudentEvidenceRequest): Promise<EvidenceSubmission[]> {
    const { studentId, activityId } = request;

    if (activityId) {
      return this.evidenceRepository.findByStudentAndActivity(studentId, activityId);
    }

    return this.evidenceRepository.findByStudent(studentId);
  }
}

import { EvidenceSubmission } from '../domain/evidence/EvidenceSubmission';
import { EvidenceRepository } from '../domain/evidence/EvidenceRepository';
import { EvidenceId } from '../domain/evidence/EvidenceId';
import { EvidenceContent } from '../domain/evidence/EvidenceContent';
import { StudentRepository } from '../domain/student/StudentRepository';
import { StudentId } from '../domain/student/StudentId';
import { SchoolActivityRepository } from '../domain/activity/SchoolActivityRepository';
import { ActivityId } from '../domain/activity/ActivityId';
import { ActivityStatus } from '../domain/activity/ActivityStatus';
import { EvidenceType } from '../domain/activity/EvidenceType';

export class StudentNotFoundError extends Error {
  constructor(studentId: StudentId) {
    super(`Student not found: ${studentId.toString()}`);
    this.name = 'StudentNotFoundError';
  }
}

export class ActivityNotFoundError extends Error {
  constructor(activityId: ActivityId) {
    super(`Activity not found: ${activityId.toString()}`);
    this.name = 'ActivityNotFoundError';
  }
}

export class ActivityNotActiveError extends Error {
  constructor(activityId: ActivityId, currentStatus: ActivityStatus) {
    super(
      `Activity ${activityId.toString()} has status ${currentStatus}, expected ${ActivityStatus.Active}`
    );
    this.name = 'ActivityNotActiveError';
  }
}

export interface SubmitEvidenceRequest {
  studentId: StudentId;
  activityId: ActivityId;
  evidenceType: EvidenceType;
  url: string;
  submittedAt: Date;
}

export interface IdGenerator {
  generateEvidenceId(): EvidenceId;
}

class DefaultIdGenerator implements IdGenerator {
  generateEvidenceId(): EvidenceId {
    const uuid = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
    return EvidenceId.create(`EVD-${uuid.toUpperCase()}`);
  }
}

export class SubmitEvidence {
  private readonly idGenerator: IdGenerator;

  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly activityRepository: SchoolActivityRepository,
    private readonly evidenceRepository: EvidenceRepository,
    idGenerator?: IdGenerator
  ) {
    this.idGenerator = idGenerator ?? new DefaultIdGenerator();
  }

  async execute(request: SubmitEvidenceRequest): Promise<EvidenceSubmission> {
    const { studentId, activityId, evidenceType, url, submittedAt } = request;

    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new StudentNotFoundError(studentId);
    }

    const activity = await this.activityRepository.findById(activityId);
    if (!activity) {
      throw new ActivityNotFoundError(activityId);
    }

    if (activity.status !== ActivityStatus.Active) {
      throw new ActivityNotActiveError(activityId, activity.status);
    }

    const evidenceId = this.idGenerator.generateEvidenceId();

    const content = EvidenceContent.create({
      type: evidenceType,
      url,
      uploadedAt: submittedAt,
    });

    const submission = EvidenceSubmission.create({
      id: evidenceId,
      studentId,
      activityId,
      content,
      submittedAt,
      updatedAt: submittedAt,
    });

    await this.evidenceRepository.save(submission);

    return submission;
  }
}

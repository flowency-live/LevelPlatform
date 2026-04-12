import { EvidenceSubmission } from '../domain/evidence/EvidenceSubmission';
import { EvidenceRepository } from '../domain/evidence/EvidenceRepository';
import { EvidenceId } from '../domain/evidence/EvidenceId';
import { StaffRepository } from '../domain/staff/StaffRepository';
import { StaffId } from '../domain/staff/StaffId';

export class EvidenceNotFoundError extends Error {
  constructor(evidenceId: EvidenceId) {
    super(`Evidence not found: ${evidenceId.toString()}`);
    this.name = 'EvidenceNotFoundError';
  }
}

export class StaffNotFoundError extends Error {
  constructor(staffId: StaffId) {
    super(`Staff member not found: ${staffId.toString()}`);
    this.name = 'StaffNotFoundError';
  }
}

export class EvidenceNotPendingError extends Error {
  constructor(evidenceId: EvidenceId) {
    super(`Evidence ${evidenceId.toString()} is not pending`);
    this.name = 'EvidenceNotPendingError';
  }
}

export class RejectionFeedbackRequiredError extends Error {
  constructor() {
    super('Feedback is required when rejecting evidence');
    this.name = 'RejectionFeedbackRequiredError';
  }
}

export interface ReviewEvidenceRequest {
  evidenceId: EvidenceId;
  reviewedBy: StaffId;
  decision: 'approve' | 'reject';
  feedback?: string;
  reviewedAt: Date;
}

export class ReviewEvidence {
  constructor(
    private readonly evidenceRepository: EvidenceRepository,
    private readonly staffRepository: StaffRepository
  ) {}

  async execute(request: ReviewEvidenceRequest): Promise<EvidenceSubmission> {
    const { evidenceId, reviewedBy, decision, feedback, reviewedAt } = request;

    const evidence = await this.evidenceRepository.findById(evidenceId);
    if (!evidence) {
      throw new EvidenceNotFoundError(evidenceId);
    }

    const staff = await this.staffRepository.findById(reviewedBy);
    if (!staff) {
      throw new StaffNotFoundError(reviewedBy);
    }

    if (!evidence.isPending()) {
      throw new EvidenceNotPendingError(evidenceId);
    }

    let reviewedEvidence: EvidenceSubmission;

    if (decision === 'reject') {
      if (!feedback) {
        throw new RejectionFeedbackRequiredError();
      }
      reviewedEvidence = evidence.reject(reviewedBy, reviewedAt, feedback);
    } else {
      reviewedEvidence = evidence.approve(reviewedBy, reviewedAt, feedback);
    }

    await this.evidenceRepository.save(reviewedEvidence);

    return reviewedEvidence;
  }
}

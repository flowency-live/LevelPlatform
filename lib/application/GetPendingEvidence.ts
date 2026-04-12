import { EvidenceSubmission } from '../domain/evidence/EvidenceSubmission';
import { EvidenceRepository } from '../domain/evidence/EvidenceRepository';

export interface GetPendingEvidenceRequest {
  // Can be extended to add optional filters like locationId
}

export class GetPendingEvidence {
  constructor(private readonly evidenceRepository: EvidenceRepository) {}

  async execute(_request: GetPendingEvidenceRequest): Promise<EvidenceSubmission[]> {
    return this.evidenceRepository.findPending();
  }
}

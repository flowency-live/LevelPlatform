const VALID_EVIDENCE_PATTERN = /^EVD-[A-Za-z0-9]+$/;

export class InvalidEvidenceIdError extends Error {
  constructor(value: string) {
    super(`Invalid evidence ID: "${value}". Must be EVD-{identifier}.`);
    this.name = 'InvalidEvidenceIdError';
  }
}

export class EvidenceId {
  private constructor(private readonly value: string) {}

  static create(value: string): EvidenceId {
    if (!EvidenceId.isValid(value)) {
      throw new InvalidEvidenceIdError(value);
    }
    return new EvidenceId(value);
  }

  static isValid(value: string): boolean {
    return VALID_EVIDENCE_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: EvidenceId): boolean {
    return this.value === other.value;
  }
}

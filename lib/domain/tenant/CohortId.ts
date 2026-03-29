const VALID_COHORT_PATTERN = /^COHORT-[A-Za-z0-9-]+$/;

export class InvalidCohortIdError extends Error {
  constructor(value: string) {
    super(`Invalid cohort ID: "${value}". Must be COHORT-{identifier}.`);
    this.name = 'InvalidCohortIdError';
  }
}

export class CohortId {
  private constructor(private readonly value: string) {}

  static create(value: string): CohortId {
    if (!CohortId.isValid(value)) {
      throw new InvalidCohortIdError(value);
    }
    return new CohortId(value);
  }

  static isValid(value: string): boolean {
    return VALID_COHORT_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: CohortId): boolean {
    return this.value === other.value;
  }
}

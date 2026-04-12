const VALID_SUBDIVISION_PATTERN = /^SUB-[A-Za-z0-9]+$/;

export class InvalidSubdivisionIdError extends Error {
  constructor(value: string) {
    super(`Invalid subdivision ID: "${value}". Must be SUB-{identifier}.`);
    this.name = 'InvalidSubdivisionIdError';
  }
}

export class SubdivisionId {
  private constructor(private readonly value: string) {}

  static create(value: string): SubdivisionId {
    if (!SubdivisionId.isValid(value)) {
      throw new InvalidSubdivisionIdError(value);
    }
    return new SubdivisionId(value);
  }

  static isValid(value: string): boolean {
    return VALID_SUBDIVISION_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: SubdivisionId): boolean {
    return this.value === other.value;
  }
}

const VALID_ACTIVITY_PATTERN = /^ACT-[A-Za-z0-9]+$/;

export class InvalidActivityIdError extends Error {
  constructor(value: string) {
    super(`Invalid activity ID: "${value}". Must be ACT-{identifier}.`);
    this.name = 'InvalidActivityIdError';
  }
}

export class ActivityId {
  private constructor(private readonly value: string) {}

  static create(value: string): ActivityId {
    if (!ActivityId.isValid(value)) {
      throw new InvalidActivityIdError(value);
    }
    return new ActivityId(value);
  }

  static isValid(value: string): boolean {
    return VALID_ACTIVITY_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: ActivityId): boolean {
    return this.value === other.value;
  }
}

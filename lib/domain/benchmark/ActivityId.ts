const VALID_ACTIVITY_PATTERN = /^GB[1-8]-0[1-9]$/;

export class InvalidActivityIdError extends Error {
  constructor(value: string) {
    super(`Invalid activity ID: "${value}". Must be format GB[1-8]-0[1-9] (e.g., GB1-01).`);
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

  get benchmarkNumber(): number {
    return parseInt(this.value.charAt(2), 10);
  }

  get activityNumber(): number {
    return parseInt(this.value.substring(4), 10);
  }

  get benchmarkIdString(): string {
    return this.value.substring(0, 3);
  }

  toString(): string {
    return this.value;
  }

  equals(other: ActivityId): boolean {
    return this.value === other.value;
  }
}

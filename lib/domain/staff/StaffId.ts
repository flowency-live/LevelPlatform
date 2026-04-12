const VALID_STAFF_PATTERN = /^STAFF-[A-Za-z0-9]+$/;

export class InvalidStaffIdError extends Error {
  constructor(value: string) {
    super(`Invalid staff ID: "${value}". Must be STAFF-{identifier}.`);
    this.name = 'InvalidStaffIdError';
  }
}

export class StaffId {
  private constructor(private readonly value: string) {}

  static create(value: string): StaffId {
    if (!StaffId.isValid(value)) {
      throw new InvalidStaffIdError(value);
    }
    return new StaffId(value);
  }

  static isValid(value: string): boolean {
    return VALID_STAFF_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: StaffId): boolean {
    return this.value === other.value;
  }
}

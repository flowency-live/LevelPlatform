const VALID_STUDENT_PATTERN = /^STUDENT-[A-Za-z0-9]+$/;

export class InvalidStudentIdError extends Error {
  constructor(value: string) {
    super(`Invalid student ID: "${value}". Must be STUDENT-{identifier}.`);
    this.name = 'InvalidStudentIdError';
  }
}

export class StudentId {
  private constructor(private readonly value: string) {}

  static create(value: string): StudentId {
    if (!StudentId.isValid(value)) {
      throw new InvalidStudentIdError(value);
    }
    return new StudentId(value);
  }

  static isValid(value: string): boolean {
    return VALID_STUDENT_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: StudentId): boolean {
    return this.value === other.value;
  }
}

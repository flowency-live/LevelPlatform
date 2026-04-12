const VALID_ASDAN_UNIT_PATTERN = /^ASDAN-[A-Za-z0-9]+$/;

export class InvalidASDANUnitIdError extends Error {
  constructor(value: string) {
    super(`Invalid ASDAN unit ID: "${value}". Must be ASDAN-{code}.`);
    this.name = 'InvalidASDANUnitIdError';
  }
}

export class ASDANUnitId {
  private constructor(private readonly value: string) {}

  static create(value: string): ASDANUnitId {
    if (!ASDANUnitId.isValid(value)) {
      throw new InvalidASDANUnitIdError(value);
    }
    return new ASDANUnitId(value);
  }

  static isValid(value: string): boolean {
    return VALID_ASDAN_UNIT_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: ASDANUnitId): boolean {
    return this.value === other.value;
  }
}

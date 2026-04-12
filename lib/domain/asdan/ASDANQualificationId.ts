const VALID_TYPES = ['COPE', 'EMP', 'PDP', 'PP', 'SC'] as const;
const VALID_COPE_LEVELS = ['L1', 'L2', 'L3'] as const;
const VALID_EMP_LEVELS = ['L1', 'L2'] as const;
const VALID_PDP_LEVELS = ['BRONZE', 'SILVER', 'GOLD'] as const;
const VALID_PP_LEVELS = ['ENTRY'] as const;

const VALID_QUALIFICATION_PATTERN = /^(COPE|EMP|PDP|PP|SC)-([A-Z0-9]+)$/;

export class InvalidASDANQualificationIdError extends Error {
  constructor(value: string) {
    super(
      `Invalid ASDAN qualification ID: "${value}". Must be {TYPE}-{LEVEL} format (e.g., COPE-L1, EMP-L2, PDP-BRONZE, PP-ENTRY, SC-FINANCE).`
    );
    this.name = 'InvalidASDANQualificationIdError';
  }
}

export class ASDANQualificationId {
  private readonly value: string;
  private readonly type: string;
  private readonly level: string;

  private constructor(value: string, type: string, level: string) {
    this.value = value;
    this.type = type;
    this.level = level;
  }

  static create(value: string): ASDANQualificationId {
    const parsed = ASDANQualificationId.parse(value);
    if (!parsed) {
      throw new InvalidASDANQualificationIdError(value);
    }
    return new ASDANQualificationId(value, parsed.type, parsed.level);
  }

  private static parse(
    value: string
  ): { type: string; level: string } | null {
    const match = value.match(VALID_QUALIFICATION_PATTERN);
    if (!match) {
      return null;
    }

    const [, type, level] = match;

    if (!ASDANQualificationId.isValidTypeLevel(type, level)) {
      return null;
    }

    return { type, level };
  }

  private static isValidTypeLevel(type: string, level: string): boolean {
    switch (type) {
      case 'COPE':
        return (VALID_COPE_LEVELS as readonly string[]).includes(level);
      case 'EMP':
        return (VALID_EMP_LEVELS as readonly string[]).includes(level);
      case 'PDP':
        return (VALID_PDP_LEVELS as readonly string[]).includes(level);
      case 'PP':
        return (VALID_PP_LEVELS as readonly string[]).includes(level);
      case 'SC':
        return level.length > 0 && /^[A-Z0-9]+$/.test(level);
      default:
        return false;
    }
  }

  static isValid(value: string): boolean {
    return ASDANQualificationId.parse(value) !== null;
  }

  toString(): string {
    return this.value;
  }

  equals(other: ASDANQualificationId): boolean {
    return this.value === other.value;
  }

  getType(): string {
    return this.type;
  }

  getLevel(): string {
    return this.level;
  }
}

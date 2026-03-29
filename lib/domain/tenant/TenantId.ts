const VALID_TENANT_PATTERN = /^TENANT-[A-Za-z0-9]+$/;

export class InvalidTenantIdError extends Error {
  constructor(value: string) {
    super(`Invalid tenant ID: "${value}". Must be TENANT-{identifier}.`);
    this.name = 'InvalidTenantIdError';
  }
}

export class TenantId {
  private constructor(private readonly value: string) {}

  static create(value: string): TenantId {
    if (!TenantId.isValid(value)) {
      throw new InvalidTenantIdError(value);
    }
    return new TenantId(value);
  }

  static isValid(value: string): boolean {
    return VALID_TENANT_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: TenantId): boolean {
    return this.value === other.value;
  }
}

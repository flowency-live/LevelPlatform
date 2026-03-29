const VALID_LOCATION_PATTERN = /^LOC-[A-Za-z0-9]+$/;

export class InvalidLocationIdError extends Error {
  constructor(value: string) {
    super(`Invalid location ID: "${value}". Must be LOC-{identifier}.`);
    this.name = 'InvalidLocationIdError';
  }
}

export class LocationId {
  private constructor(private readonly value: string) {}

  static create(value: string): LocationId {
    if (!LocationId.isValid(value)) {
      throw new InvalidLocationIdError(value);
    }
    return new LocationId(value);
  }

  static isValid(value: string): boolean {
    return VALID_LOCATION_PATTERN.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: LocationId): boolean {
    return this.value === other.value;
  }
}

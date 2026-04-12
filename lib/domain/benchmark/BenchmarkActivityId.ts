const VALID_BENCHMARK_ACTIVITY_PATTERN = /^GB[1-8]-0[1-9]$/;

export class InvalidBenchmarkActivityIdError extends Error {
  constructor(value: string) {
    super(`Invalid benchmark activity ID: "${value}". Must be format GB[1-8]-0[1-9] (e.g., GB1-01).`);
    this.name = 'InvalidBenchmarkActivityIdError';
  }
}

export class BenchmarkActivityId {
  private constructor(private readonly value: string) {}

  static create(value: string): BenchmarkActivityId {
    if (!BenchmarkActivityId.isValid(value)) {
      throw new InvalidBenchmarkActivityIdError(value);
    }
    return new BenchmarkActivityId(value);
  }

  static isValid(value: string): boolean {
    return VALID_BENCHMARK_ACTIVITY_PATTERN.test(value);
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

  equals(other: BenchmarkActivityId): boolean {
    return this.value === other.value;
  }
}

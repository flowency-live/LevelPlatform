const VALID_BENCHMARK_PATTERN = /^GB[1-8]$/;
const VALID_BENCHMARK_IDS = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'] as const;

export class InvalidBenchmarkIdError extends Error {
  constructor(value: string) {
    super(`Invalid benchmark ID: "${value}". Must be GB1-GB8.`);
    this.name = 'InvalidBenchmarkIdError';
  }
}

export class BenchmarkId {
  private constructor(private readonly value: string) {}

  static create(value: string): BenchmarkId {
    if (!BenchmarkId.isValid(value)) {
      throw new InvalidBenchmarkIdError(value);
    }
    return new BenchmarkId(value);
  }

  static isValid(value: string): boolean {
    return VALID_BENCHMARK_PATTERN.test(value);
  }

  static all(): BenchmarkId[] {
    return VALID_BENCHMARK_IDS.map(id => new BenchmarkId(id));
  }

  get number(): number {
    return parseInt(this.value.charAt(2), 10);
  }

  toString(): string {
    return this.value;
  }

  equals(other: BenchmarkId): boolean {
    return this.value === other.value;
  }
}

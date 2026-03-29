import { BenchmarkId, InvalidBenchmarkIdError } from './BenchmarkId';

describe('BenchmarkId', () => {
  describe('create', () => {
    it('creates valid BenchmarkId for GB1', () => {
      const id = BenchmarkId.create('GB1');
      expect(id.toString()).toBe('GB1');
    });

    it('creates valid BenchmarkId for GB8', () => {
      const id = BenchmarkId.create('GB8');
      expect(id.toString()).toBe('GB8');
    });

    it('creates valid BenchmarkId for all Gatsby Benchmarks', () => {
      const validIds = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'];
      validIds.forEach(value => {
        const id = BenchmarkId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('throws InvalidBenchmarkIdError for GB0', () => {
      expect(() => BenchmarkId.create('GB0')).toThrow(InvalidBenchmarkIdError);
    });

    it('throws InvalidBenchmarkIdError for GB9', () => {
      expect(() => BenchmarkId.create('GB9')).toThrow(InvalidBenchmarkIdError);
    });

    it('throws InvalidBenchmarkIdError for lowercase', () => {
      expect(() => BenchmarkId.create('gb1')).toThrow(InvalidBenchmarkIdError);
    });

    it('throws InvalidBenchmarkIdError for empty string', () => {
      expect(() => BenchmarkId.create('')).toThrow(InvalidBenchmarkIdError);
    });

    it('throws InvalidBenchmarkIdError for invalid format', () => {
      expect(() => BenchmarkId.create('GATSBY1')).toThrow(InvalidBenchmarkIdError);
      expect(() => BenchmarkId.create('G1')).toThrow(InvalidBenchmarkIdError);
      expect(() => BenchmarkId.create('B1')).toThrow(InvalidBenchmarkIdError);
    });

    it('includes the invalid value in error message', () => {
      try {
        BenchmarkId.create('invalid');
        fail('Expected InvalidBenchmarkIdError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidBenchmarkIdError);
        expect((error as InvalidBenchmarkIdError).message).toContain('invalid');
      }
    });
  });

  describe('equals', () => {
    it('returns true for same benchmark id', () => {
      const id1 = BenchmarkId.create('GB1');
      const id2 = BenchmarkId.create('GB1');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different benchmark ids', () => {
      const id1 = BenchmarkId.create('GB1');
      const id2 = BenchmarkId.create('GB2');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('number', () => {
    it('returns the benchmark number', () => {
      expect(BenchmarkId.create('GB1').number).toBe(1);
      expect(BenchmarkId.create('GB5').number).toBe(5);
      expect(BenchmarkId.create('GB8').number).toBe(8);
    });
  });

  describe('isValid (static)', () => {
    it('returns true for valid benchmark ids', () => {
      expect(BenchmarkId.isValid('GB1')).toBe(true);
      expect(BenchmarkId.isValid('GB8')).toBe(true);
    });

    it('returns false for invalid benchmark ids', () => {
      expect(BenchmarkId.isValid('GB0')).toBe(false);
      expect(BenchmarkId.isValid('GB9')).toBe(false);
      expect(BenchmarkId.isValid('invalid')).toBe(false);
      expect(BenchmarkId.isValid('')).toBe(false);
    });
  });

  describe('all (static)', () => {
    it('returns all 8 Gatsby Benchmark IDs', () => {
      const all = BenchmarkId.all();
      expect(all).toHaveLength(8);
      expect(all.map(id => id.toString())).toEqual([
        'GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'
      ]);
    });
  });
});

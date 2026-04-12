import { BenchmarkActivityId, InvalidBenchmarkActivityIdError } from './BenchmarkActivityId';

describe('BenchmarkActivityId', () => {
  describe('create', () => {
    it('creates valid BenchmarkActivityId for GB1-01', () => {
      const id = BenchmarkActivityId.create('GB1-01');
      expect(id.toString()).toBe('GB1-01');
    });

    it('creates valid BenchmarkActivityId for any benchmark activity', () => {
      const validIds = ['GB1-01', 'GB2-04', 'GB8-03', 'GB5-02'];
      validIds.forEach(value => {
        const id = BenchmarkActivityId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('throws InvalidBenchmarkActivityIdError for invalid format', () => {
      expect(() => BenchmarkActivityId.create('GB0-01')).toThrow(InvalidBenchmarkActivityIdError);
      expect(() => BenchmarkActivityId.create('GB9-01')).toThrow(InvalidBenchmarkActivityIdError);
      expect(() => BenchmarkActivityId.create('GB1-00')).toThrow(InvalidBenchmarkActivityIdError);
      expect(() => BenchmarkActivityId.create('GB1-99')).toThrow(InvalidBenchmarkActivityIdError);
      expect(() => BenchmarkActivityId.create('INVALID')).toThrow(InvalidBenchmarkActivityIdError);
      expect(() => BenchmarkActivityId.create('')).toThrow(InvalidBenchmarkActivityIdError);
    });

    it('throws InvalidBenchmarkActivityIdError for lowercase', () => {
      expect(() => BenchmarkActivityId.create('gb1-01')).toThrow(InvalidBenchmarkActivityIdError);
    });
  });

  describe('benchmarkNumber', () => {
    it('returns the benchmark number', () => {
      expect(BenchmarkActivityId.create('GB1-01').benchmarkNumber).toBe(1);
      expect(BenchmarkActivityId.create('GB5-03').benchmarkNumber).toBe(5);
      expect(BenchmarkActivityId.create('GB8-04').benchmarkNumber).toBe(8);
    });
  });

  describe('activityNumber', () => {
    it('returns the activity number', () => {
      expect(BenchmarkActivityId.create('GB1-01').activityNumber).toBe(1);
      expect(BenchmarkActivityId.create('GB5-03').activityNumber).toBe(3);
      expect(BenchmarkActivityId.create('GB8-04').activityNumber).toBe(4);
    });
  });

  describe('benchmarkId', () => {
    it('returns the parent benchmark id string', () => {
      expect(BenchmarkActivityId.create('GB1-01').benchmarkIdString).toBe('GB1');
      expect(BenchmarkActivityId.create('GB5-03').benchmarkIdString).toBe('GB5');
    });
  });

  describe('equals', () => {
    it('returns true for same benchmark activity id', () => {
      const id1 = BenchmarkActivityId.create('GB1-01');
      const id2 = BenchmarkActivityId.create('GB1-01');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different benchmark activity ids', () => {
      const id1 = BenchmarkActivityId.create('GB1-01');
      const id2 = BenchmarkActivityId.create('GB1-02');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid (static)', () => {
    it('returns true for valid benchmark activity ids', () => {
      expect(BenchmarkActivityId.isValid('GB1-01')).toBe(true);
      expect(BenchmarkActivityId.isValid('GB8-04')).toBe(true);
    });

    it('returns false for invalid benchmark activity ids', () => {
      expect(BenchmarkActivityId.isValid('GB0-01')).toBe(false);
      expect(BenchmarkActivityId.isValid('GB9-01')).toBe(false);
      expect(BenchmarkActivityId.isValid('invalid')).toBe(false);
      expect(BenchmarkActivityId.isValid('')).toBe(false);
    });
  });
});

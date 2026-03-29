import {
  GATSBY_BENCHMARKS,
  GatsbyBenchmark,
  getBenchmark,
  getBenchmarkActivities,
  getAllBenchmarks
} from './benchmarks';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';

describe('Gatsby Benchmarks Reference Data', () => {
  describe('GATSBY_BENCHMARKS', () => {
    it('contains exactly 8 benchmarks', () => {
      expect(Object.keys(GATSBY_BENCHMARKS)).toHaveLength(8);
    });

    it('contains GB1 through GB8', () => {
      const ids = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'];
      ids.forEach(id => {
        expect(GATSBY_BENCHMARKS[id]).toBeDefined();
      });
    });

    it('each benchmark has required properties', () => {
      Object.values(GATSBY_BENCHMARKS).forEach((benchmark: GatsbyBenchmark) => {
        expect(benchmark.id).toBeDefined();
        expect(benchmark.name).toBeDefined();
        expect(benchmark.shortName).toBeDefined();
        expect(benchmark.description).toBeDefined();
        expect(benchmark.activities).toBeInstanceOf(Array);
        expect(benchmark.activities.length).toBeGreaterThan(0);
      });
    });
  });

  describe('GB1 - A stable careers programme', () => {
    it('has correct metadata', () => {
      const gb1 = GATSBY_BENCHMARKS.GB1;
      expect(gb1.id).toBe('GB1');
      expect(gb1.name).toBe('A stable careers programme');
      expect(gb1.shortName).toBe('Careers Programme');
    });

    it('has activities for career planning', () => {
      const gb1 = GATSBY_BENCHMARKS.GB1;
      expect(gb1.activities.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GB2 - Learning from career and labour market information', () => {
    it('has correct metadata', () => {
      const gb2 = GATSBY_BENCHMARKS.GB2;
      expect(gb2.id).toBe('GB2');
      expect(gb2.name).toBe('Learning from career and labour market information');
      expect(gb2.shortName).toBe('Labour Market');
    });
  });

  describe('GB3 - Addressing the needs of each pupil', () => {
    it('has correct metadata', () => {
      const gb3 = GATSBY_BENCHMARKS.GB3;
      expect(gb3.id).toBe('GB3');
      expect(gb3.name).toBe('Addressing the needs of each pupil');
      expect(gb3.shortName).toBe('Individual Needs');
    });
  });

  describe('GB4 - Linking curriculum learning to careers', () => {
    it('has correct metadata', () => {
      const gb4 = GATSBY_BENCHMARKS.GB4;
      expect(gb4.id).toBe('GB4');
      expect(gb4.name).toBe('Linking curriculum learning to careers');
      expect(gb4.shortName).toBe('Curriculum Links');
    });
  });

  describe('GB5 - Encounters with employers and employees', () => {
    it('has correct metadata', () => {
      const gb5 = GATSBY_BENCHMARKS.GB5;
      expect(gb5.id).toBe('GB5');
      expect(gb5.name).toBe('Encounters with employers and employees');
      expect(gb5.shortName).toBe('Employer Encounters');
    });
  });

  describe('GB6 - Experiences of workplaces', () => {
    it('has correct metadata', () => {
      const gb6 = GATSBY_BENCHMARKS.GB6;
      expect(gb6.id).toBe('GB6');
      expect(gb6.name).toBe('Experiences of workplaces');
      expect(gb6.shortName).toBe('Work Experience');
    });
  });

  describe('GB7 - Encounters with further and higher education', () => {
    it('has correct metadata', () => {
      const gb7 = GATSBY_BENCHMARKS.GB7;
      expect(gb7.id).toBe('GB7');
      expect(gb7.name).toBe('Encounters with further and higher education');
      expect(gb7.shortName).toBe('Education Pathways');
    });
  });

  describe('GB8 - Personal guidance', () => {
    it('has correct metadata', () => {
      const gb8 = GATSBY_BENCHMARKS.GB8;
      expect(gb8.id).toBe('GB8');
      expect(gb8.name).toBe('Personal guidance');
      expect(gb8.shortName).toBe('Personal Guidance');
    });
  });

  describe('getBenchmark', () => {
    it('returns benchmark for valid BenchmarkId', () => {
      const id = BenchmarkId.create('GB1');
      const benchmark = getBenchmark(id);
      expect(benchmark.id).toBe('GB1');
      expect(benchmark.name).toBe('A stable careers programme');
    });

    it('returns correct benchmark for each id', () => {
      BenchmarkId.all().forEach(id => {
        const benchmark = getBenchmark(id);
        expect(benchmark.id).toBe(id.toString());
      });
    });
  });

  describe('getBenchmarkActivities', () => {
    it('returns activities for a benchmark', () => {
      const id = BenchmarkId.create('GB1');
      const activities = getBenchmarkActivities(id);
      expect(activities).toBeInstanceOf(Array);
      expect(activities.length).toBeGreaterThan(0);
    });

    it('each activity has required properties', () => {
      const id = BenchmarkId.create('GB1');
      const activities = getBenchmarkActivities(id);
      activities.forEach(activity => {
        expect(activity.id).toBeDefined();
        expect(activity.name).toBeDefined();
        expect(activity.description).toBeDefined();
        expect(activity.benchmarkId).toBe('GB1');
      });
    });
  });

  describe('getAllBenchmarks', () => {
    it('returns all 8 benchmarks', () => {
      const all = getAllBenchmarks();
      expect(all).toHaveLength(8);
    });

    it('returns benchmarks in order GB1-GB8', () => {
      const all = getAllBenchmarks();
      expect(all.map(b => b.id)).toEqual([
        'GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'
      ]);
    });
  });
});

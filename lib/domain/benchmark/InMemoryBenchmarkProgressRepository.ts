import { BenchmarkProgress } from './BenchmarkProgress';
import { BenchmarkId } from './BenchmarkId';
import { BenchmarkProgressRepository } from './BenchmarkProgressRepository';
import { StudentId } from '../student/StudentId';

export class InMemoryBenchmarkProgressRepository implements BenchmarkProgressRepository {
  private readonly progress: Map<string, BenchmarkProgress> = new Map();

  private makeKey(studentId: StudentId, benchmarkId: BenchmarkId): string {
    return `${studentId.toString()}#${benchmarkId.toString()}`;
  }

  async findByStudentAndBenchmark(
    studentId: StudentId,
    benchmarkId: BenchmarkId
  ): Promise<BenchmarkProgress | null> {
    return this.progress.get(this.makeKey(studentId, benchmarkId)) ?? null;
  }

  async findByStudentId(studentId: StudentId): Promise<BenchmarkProgress[]> {
    return [...this.progress.values()].filter(
      p => p.studentId.equals(studentId)
    );
  }

  async findByBenchmarkId(benchmarkId: BenchmarkId): Promise<BenchmarkProgress[]> {
    return [...this.progress.values()].filter(
      p => p.benchmarkId.equals(benchmarkId)
    );
  }

  async save(progress: BenchmarkProgress): Promise<void> {
    this.progress.set(
      this.makeKey(progress.studentId, progress.benchmarkId),
      progress
    );
  }
}

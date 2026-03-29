import { BenchmarkProgress } from './BenchmarkProgress';
import { BenchmarkId } from './BenchmarkId';
import { StudentId } from '../student/StudentId';

export interface BenchmarkProgressRepository {
  findByStudentAndBenchmark(
    studentId: StudentId,
    benchmarkId: BenchmarkId
  ): Promise<BenchmarkProgress | null>;

  findByStudentId(studentId: StudentId): Promise<BenchmarkProgress[]>;

  findByBenchmarkId(benchmarkId: BenchmarkId): Promise<BenchmarkProgress[]>;

  save(progress: BenchmarkProgress): Promise<void>;
}

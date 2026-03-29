import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { StudentRepository } from '../domain/student/StudentRepository';
import { BenchmarkProgress, CompletionStatus } from '../domain/benchmark/BenchmarkProgress';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { BenchmarkProgressRepository } from '../domain/benchmark/BenchmarkProgressRepository';
import { CohortId } from '../domain/tenant/CohortId';

const ALL_BENCHMARK_IDS = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'];

export interface BenchmarkCell {
  benchmarkId: BenchmarkId;
  percentComplete: number;
  status: CompletionStatus;
}

export interface HeatmapRow {
  studentId: StudentId;
  studentName: string;
  benchmarks: BenchmarkCell[];
  overallPercentComplete: number;
}

export interface HeatmapSummary {
  totalStudents: number;
  averageOverallProgress: number;
}

export interface HeatmapResult {
  rows: HeatmapRow[];
  summary: HeatmapSummary;
}

export class GetBenchmarkHeatmap {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly progressRepository: BenchmarkProgressRepository
  ) {}

  async execute(cohortId: CohortId): Promise<HeatmapResult> {
    const students = await this.studentRepository.findByCohortId(cohortId);

    const rows = await Promise.all(
      students.map(student => this.buildHeatmapRow(student))
    );

    const summary = this.calculateSummary(rows);

    return { rows, summary };
  }

  private async buildHeatmapRow(student: Student): Promise<HeatmapRow> {
    const progressList = await this.progressRepository.findByStudentId(student.id);
    const progressMap = new Map(
      progressList.map(p => [p.benchmarkId.toString(), p])
    );

    const benchmarks: BenchmarkCell[] = ALL_BENCHMARK_IDS.map(id => {
      const benchmarkId = BenchmarkId.create(id);
      const progress = progressMap.get(id);

      return {
        benchmarkId,
        percentComplete: progress?.percentComplete ?? 0,
        status: progress?.status ?? 'not-started',
      };
    });

    const totalPercent = benchmarks.reduce((sum, b) => sum + b.percentComplete, 0);
    const overallPercentComplete = Math.round(totalPercent / benchmarks.length);

    return {
      studentId: student.id,
      studentName: student.fullName,
      benchmarks,
      overallPercentComplete,
    };
  }

  private calculateSummary(rows: HeatmapRow[]): HeatmapSummary {
    if (rows.length === 0) {
      return { totalStudents: 0, averageOverallProgress: 0 };
    }

    const totalProgress = rows.reduce((sum, row) => sum + row.overallPercentComplete, 0);
    const averageOverallProgress = Math.round(totalProgress / rows.length);

    return {
      totalStudents: rows.length,
      averageOverallProgress,
    };
  }
}

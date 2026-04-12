import { BenchmarkProgressRepository } from '../domain/benchmark/BenchmarkProgressRepository';
import { StudentRepository } from '../domain/student/StudentRepository';
import { LocationId } from '../domain/tenant/LocationId';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';

const ALL_BENCHMARK_IDS = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'];

export interface BenchmarkComplianceDTO {
  benchmarkId: string;
  studentsComplete: number;
  studentsInProgress: number;
  studentsNotStarted: number;
  compliancePercentage: number;
}

export interface GatsbyComplianceDTO {
  locationId: string;
  totalStudents: number;
  overallCompliance: number;
  benchmarks: BenchmarkComplianceDTO[];
}

export interface GetGatsbyComplianceRequest {
  locationId: LocationId;
}

export class GetGatsbyCompliance {
  constructor(
    private readonly benchmarkProgressRepository: BenchmarkProgressRepository,
    private readonly studentRepository: StudentRepository
  ) {}

  async execute(request: GetGatsbyComplianceRequest): Promise<GatsbyComplianceDTO> {
    const { locationId } = request;

    const students = await this.studentRepository.findByLocationId(locationId);
    const totalStudents = students.length;

    if (totalStudents === 0) {
      return {
        locationId: locationId.toString(),
        totalStudents: 0,
        overallCompliance: 0,
        benchmarks: ALL_BENCHMARK_IDS.map((id) => ({
          benchmarkId: id,
          studentsComplete: 0,
          studentsInProgress: 0,
          studentsNotStarted: 0,
          compliancePercentage: 0,
        })),
      };
    }

    const benchmarks: BenchmarkComplianceDTO[] = [];
    let totalBenchmarksComplete = 0;

    for (const benchmarkId of ALL_BENCHMARK_IDS) {
      const progressList = await this.benchmarkProgressRepository.findByBenchmarkId(
        BenchmarkId.create(benchmarkId)
      );

      // Filter to only students in this location
      const studentIds = new Set(students.map((s) => s.id.toString()));
      const locationProgress = progressList.filter((p) =>
        studentIds.has(p.studentId.toString())
      );

      let studentsComplete = 0;
      let studentsInProgress = 0;

      for (const progress of locationProgress) {
        if (progress.status === 'complete') {
          studentsComplete++;
        } else if (progress.status === 'in-progress') {
          studentsInProgress++;
        }
      }

      const studentsNotStarted = totalStudents - studentsComplete - studentsInProgress;
      const compliancePercentage =
        totalStudents > 0
          ? Math.round((studentsComplete / totalStudents) * 100)
          : 0;

      totalBenchmarksComplete += studentsComplete;

      benchmarks.push({
        benchmarkId,
        studentsComplete,
        studentsInProgress,
        studentsNotStarted,
        compliancePercentage,
      });
    }

    // Overall compliance = average completion across all benchmarks
    const maxPossibleCompletions = totalStudents * ALL_BENCHMARK_IDS.length;
    const overallCompliance =
      maxPossibleCompletions > 0
        ? Math.round((totalBenchmarksComplete / maxPossibleCompletions) * 100)
        : 0;

    return {
      locationId: locationId.toString(),
      totalStudents,
      overallCompliance,
      benchmarks,
    };
  }
}

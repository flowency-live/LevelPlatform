import { BenchmarkProgressRepository } from '../domain/benchmark/BenchmarkProgressRepository';
import { StudentRepository } from '../domain/student/StudentRepository';
import { LocationId } from '../domain/tenant/LocationId';
import { CompletionStatus } from '../domain/benchmark/BenchmarkProgress';

const ALL_BENCHMARK_IDS = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'];

export interface BenchmarkCellDTO {
  benchmarkId: string;
  status: CompletionStatus;
  percentage: number;
}

export interface HeatmapRowDTO {
  studentId: string;
  displayName: string;
  benchmarks: BenchmarkCellDTO[];
}

export interface SchoolHeatmapDTO {
  locationId: string;
  rows: HeatmapRowDTO[];
}

export interface GetSchoolHeatmapRequest {
  locationId: LocationId;
}

export class GetSchoolHeatmap {
  constructor(
    private readonly benchmarkProgressRepository: BenchmarkProgressRepository,
    private readonly studentRepository: StudentRepository
  ) {}

  async execute(request: GetSchoolHeatmapRequest): Promise<SchoolHeatmapDTO> {
    const { locationId } = request;

    const students = await this.studentRepository.findByLocationId(locationId);

    const rows: HeatmapRowDTO[] = [];

    for (const student of students) {
      const progressList = await this.benchmarkProgressRepository.findByStudentId(student.id);

      const progressMap = new Map(
        progressList.map((p) => [p.benchmarkId.toString(), p])
      );

      const benchmarks: BenchmarkCellDTO[] = ALL_BENCHMARK_IDS.map((benchmarkId) => {
        const progress = progressMap.get(benchmarkId);

        if (!progress) {
          return {
            benchmarkId,
            status: 'not-started' as CompletionStatus,
            percentage: 0,
          };
        }

        return {
          benchmarkId,
          status: progress.status,
          percentage: progress.percentComplete,
        };
      });

      rows.push({
        studentId: student.id.toString(),
        displayName: student.initials,
        benchmarks,
      });
    }

    return {
      locationId: locationId.toString(),
      rows,
    };
  }
}

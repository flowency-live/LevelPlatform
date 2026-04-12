import { BenchmarkProgressRepository } from '../domain/benchmark/BenchmarkProgressRepository';
import { StudentRepository } from '../domain/student/StudentRepository';
import { StudentId } from '../domain/student/StudentId';

export class StudentNotFoundError extends Error {
  constructor(studentId: StudentId) {
    super(`Student not found: ${studentId.toString()}`);
    this.name = 'StudentNotFoundError';
  }
}

export interface AreaProgressDTO {
  areaId: string;
  activitiesCompleted: number;
  totalActivities: number;
  percentage: number;
}

export interface CareerPlanDTO {
  studentId: string;
  totalActivitiesCompleted: number;
  totalActivities: number;
  overallPercentage: number;
  areas: AreaProgressDTO[];
}

export interface GetStudentCareerPlanRequest {
  studentId: StudentId;
}

export class GetStudentCareerPlan {
  constructor(
    private readonly benchmarkProgressRepository: BenchmarkProgressRepository,
    private readonly studentRepository: StudentRepository
  ) {}

  async execute(request: GetStudentCareerPlanRequest): Promise<CareerPlanDTO> {
    const { studentId } = request;

    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new StudentNotFoundError(studentId);
    }

    const progressList = await this.benchmarkProgressRepository.findByStudentId(studentId);

    const areas: AreaProgressDTO[] = progressList.map((progress) => ({
      areaId: progress.benchmarkId.toString(),
      activitiesCompleted: progress.completedActivities.length,
      totalActivities: progress.totalActivities,
      percentage: progress.percentComplete,
    }));

    const totalActivitiesCompleted = areas.reduce(
      (sum, area) => sum + area.activitiesCompleted,
      0
    );
    const totalActivities = areas.reduce(
      (sum, area) => sum + area.totalActivities,
      0
    );
    const overallPercentage =
      totalActivities > 0
        ? Math.round((totalActivitiesCompleted / totalActivities) * 100)
        : 0;

    return {
      studentId: studentId.toString(),
      totalActivitiesCompleted,
      totalActivities,
      overallPercentage,
      areas,
    };
  }
}

import { StudentId } from '../domain/student/StudentId';
import { StudentRepository } from '../domain/student/StudentRepository';
import { BenchmarkProgress } from '../domain/benchmark/BenchmarkProgress';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { BenchmarkActivityId } from '../domain/benchmark/BenchmarkActivityId';
import { BenchmarkProgressRepository } from '../domain/benchmark/BenchmarkProgressRepository';

export class StudentNotFoundError extends Error {
  constructor(studentId: StudentId) {
    super(`Student not found: ${studentId.toString()}`);
    this.name = 'StudentNotFoundError';
  }
}

export interface CompleteActivityRequest {
  studentId: StudentId;
  benchmarkId: BenchmarkId;
  activityId: BenchmarkActivityId;
  completedAt: Date;
}

export class CompleteActivity {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly progressRepository: BenchmarkProgressRepository
  ) {}

  async execute(request: CompleteActivityRequest): Promise<BenchmarkProgress> {
    const { studentId, benchmarkId, activityId, completedAt } = request;

    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new StudentNotFoundError(studentId);
    }

    let progress = await this.progressRepository.findByStudentAndBenchmark(
      studentId,
      benchmarkId
    );

    if (!progress) {
      progress = BenchmarkProgress.create({
        studentId,
        benchmarkId,
        completedActivities: [],
        totalActivities: 9,
        createdAt: completedAt,
        updatedAt: completedAt,
      });
    }

    const updatedProgress = progress.completeActivity(activityId, completedAt);

    await this.progressRepository.save(updatedProgress);

    return updatedProgress;
  }
}

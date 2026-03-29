import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { StudentRepository } from '../domain/student/StudentRepository';
import { BenchmarkProgress } from '../domain/benchmark/BenchmarkProgress';
import { BenchmarkProgressRepository } from '../domain/benchmark/BenchmarkProgressRepository';

export class StudentNotFoundError extends Error {
  constructor(studentId: StudentId) {
    super(`Student not found: ${studentId.toString()}`);
    this.name = 'StudentNotFoundError';
  }
}

export interface StudentProgressResult {
  student: Student;
  benchmarkProgress: BenchmarkProgress[];
  overallPercentComplete: number;
}

export class GetStudentProgress {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly progressRepository: BenchmarkProgressRepository
  ) {}

  async execute(studentId: StudentId): Promise<StudentProgressResult> {
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new StudentNotFoundError(studentId);
    }

    const benchmarkProgress = await this.progressRepository.findByStudentId(studentId);

    const overallPercentComplete = this.calculateOverallProgress(benchmarkProgress);

    return {
      student,
      benchmarkProgress,
      overallPercentComplete,
    };
  }

  private calculateOverallProgress(progress: BenchmarkProgress[]): number {
    if (progress.length === 0) {
      return 0;
    }

    const total = progress.reduce((sum, p) => sum + p.percentComplete, 0);
    return Math.round(total / progress.length);
  }
}

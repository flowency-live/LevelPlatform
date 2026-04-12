import { ASDANProgressRepository } from '../domain/asdan/ASDANProgressRepository';
import { StudentRepository } from '../domain/student/StudentRepository';
import { StudentId } from '../domain/student/StudentId';

export class StudentNotFoundError extends Error {
  constructor(studentId: StudentId) {
    super(`Student not found: ${studentId.toString()}`);
    this.name = 'StudentNotFoundError';
  }
}

export interface ASDANProgressDTO {
  qualificationId: string;
  completedUnits: string[];
  percentageComplete: number;
  isComplete: boolean;
  enrolledAt: Date;
  updatedAt: Date;
}

export interface GetASDANProgressRequest {
  studentId: StudentId;
}

export class GetASDANProgress {
  constructor(
    private readonly asdanProgressRepository: ASDANProgressRepository,
    private readonly studentRepository: StudentRepository
  ) {}

  async execute(request: GetASDANProgressRequest): Promise<ASDANProgressDTO[]> {
    const { studentId } = request;

    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new StudentNotFoundError(studentId);
    }

    const progressList = await this.asdanProgressRepository.findByStudent(studentId);

    return progressList.map((progress) => ({
      qualificationId: progress.qualificationId.toString(),
      completedUnits: progress.completedUnitIds.map((u) => u.toString()),
      percentageComplete: progress.getPercentageComplete(),
      isComplete: progress.isComplete(),
      enrolledAt: progress.enrolledAt,
      updatedAt: progress.updatedAt,
    }));
  }
}

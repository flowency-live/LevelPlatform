import { StudentRepository } from '../domain/student/StudentRepository';
import { StudentId } from '../domain/student/StudentId';

export class StudentNotFoundError extends Error {
  constructor(studentId: string) {
    super(`Student not found: ${studentId}`);
    this.name = 'StudentNotFoundError';
  }
}

export interface RegenerateStudentTokenRequest {
  studentId: string;
}

export interface RegenerateStudentTokenResponse {
  accessToken: string;
  studentId: string;
  displayName: string;
}

export class RegenerateStudentToken {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(request: RegenerateStudentTokenRequest): Promise<RegenerateStudentTokenResponse> {
    const studentId = StudentId.create(request.studentId);

    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new StudentNotFoundError(request.studentId);
    }

    const updatedStudent = student.regenerateAccessToken();
    await this.studentRepository.save(updatedStudent);

    return {
      accessToken: updatedStudent.accessToken!.toString(),
      studentId: updatedStudent.id.toString(),
      displayName: updatedStudent.initials,
    };
  }
}

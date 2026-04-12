import { ASDANProgressRepository } from './ASDANProgressRepository';
import { ASDANProgress } from './ASDANProgress';
import { ASDANQualificationId } from './ASDANQualificationId';
import { StudentId } from '../student/StudentId';

export class InMemoryASDANProgressRepository implements ASDANProgressRepository {
  private readonly progressMap: Map<string, ASDANProgress> = new Map();

  private makeKey(
    studentId: StudentId,
    qualificationId: ASDANQualificationId
  ): string {
    return `${studentId.toString()}:${qualificationId.toString()}`;
  }

  async findById(
    studentId: StudentId,
    qualificationId: ASDANQualificationId
  ): Promise<ASDANProgress | null> {
    const key = this.makeKey(studentId, qualificationId);
    return this.progressMap.get(key) ?? null;
  }

  async findByStudent(studentId: StudentId): Promise<ASDANProgress[]> {
    return Array.from(this.progressMap.values()).filter((progress) =>
      progress.studentId.equals(studentId)
    );
  }

  async findByQualification(
    qualificationId: ASDANQualificationId
  ): Promise<ASDANProgress[]> {
    return Array.from(this.progressMap.values()).filter((progress) =>
      progress.qualificationId.equals(qualificationId)
    );
  }

  async save(progress: ASDANProgress): Promise<void> {
    const key = this.makeKey(progress.studentId, progress.qualificationId);
    this.progressMap.set(key, progress);
  }
}

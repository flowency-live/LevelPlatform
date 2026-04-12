import { ASDANProgress } from './ASDANProgress';
import { ASDANQualificationId } from './ASDANQualificationId';
import { StudentId } from '../student/StudentId';

export interface ASDANProgressRepository {
  findById(
    studentId: StudentId,
    qualificationId: ASDANQualificationId
  ): Promise<ASDANProgress | null>;
  findByStudent(studentId: StudentId): Promise<ASDANProgress[]>;
  findByQualification(
    qualificationId: ASDANQualificationId
  ): Promise<ASDANProgress[]>;
  save(progress: ASDANProgress): Promise<void>;
}

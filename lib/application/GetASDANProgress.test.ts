import { GetASDANProgress, StudentNotFoundError } from './GetASDANProgress';
import { InMemoryASDANProgressRepository } from '../domain/asdan/InMemoryASDANProgressRepository';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { ASDANProgress } from '../domain/asdan/ASDANProgress';
import { ASDANQualificationId } from '../domain/asdan/ASDANQualificationId';
import { ASDANUnitId } from '../domain/asdan/ASDANUnitId';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { SubdivisionId } from '../domain/tenant/SubdivisionId';

describe('GetASDANProgress', () => {
  let asdanProgressRepository: InMemoryASDANProgressRepository;
  let studentRepository: InMemoryStudentRepository;
  let useCase: GetASDANProgress;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');
  const locationId = LocationId.create('LOC-EAST');

  const createStudent = (id: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName: 'Alice',
      lastName: 'Thompson',
      email: `${id.toLowerCase().replace('student-', '')}@school.uk`,
      tenantId,
      locationId,
      subdivisionId: SubdivisionId.create('SUB-YEAR10'),
      createdAt: now,
      updatedAt: now,
    });
  };

  const createProgress = (
    studentId: string,
    qualificationId: string,
    completedUnits: string[] = []
  ) => {
    return ASDANProgress.create({
      studentId: StudentId.create(studentId),
      qualificationId: ASDANQualificationId.create(qualificationId),
      completedUnitIds: completedUnits.map((u) => ASDANUnitId.create(u)),
      enrolledAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    asdanProgressRepository = new InMemoryASDANProgressRepository();
    studentRepository = new InMemoryStudentRepository();
    useCase = new GetASDANProgress(asdanProgressRepository, studentRepository);
  });

  describe('execute', () => {
    it('returns all ASDAN progress for a student', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);
      await asdanProgressRepository.save(
        createProgress('STUDENT-ABC123', 'COPE-L1', ['ASDAN-COPE001'])
      );
      await asdanProgressRepository.save(
        createProgress('STUDENT-ABC123', 'EMP-L1', ['ASDAN-EMP001'])
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result).toHaveLength(2);
    });

    it('returns empty array if student has no ASDAN progress', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result).toHaveLength(0);
    });

    it('throws StudentNotFoundError if student not found', async () => {
      await expect(
        useCase.execute({
          studentId: StudentId.create('STUDENT-NOTFOUND'),
        })
      ).rejects.toThrow(StudentNotFoundError);
    });

    it('includes percentage complete in results', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);
      await asdanProgressRepository.save(
        createProgress('STUDENT-ABC123', 'COPE-L1', ['ASDAN-COPE001'])
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result[0].percentageComplete).toBeGreaterThanOrEqual(0);
      expect(result[0].percentageComplete).toBeLessThanOrEqual(100);
    });

    it('includes qualification details in results', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);
      await asdanProgressRepository.save(
        createProgress('STUDENT-ABC123', 'COPE-L1', [])
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result[0].qualificationId).toBe('COPE-L1');
      expect(result[0].completedUnits).toEqual([]);
    });

    it('does not return progress from other students', async () => {
      const student1 = createStudent('STUDENT-ABC123');
      const student2 = createStudent('STUDENT-XYZ789');
      await studentRepository.save(student1);
      await studentRepository.save(student2);
      await asdanProgressRepository.save(
        createProgress('STUDENT-ABC123', 'COPE-L1', [])
      );
      await asdanProgressRepository.save(
        createProgress('STUDENT-XYZ789', 'EMP-L1', [])
      );

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result).toHaveLength(1);
      expect(result[0].qualificationId).toBe('COPE-L1');
    });
  });
});

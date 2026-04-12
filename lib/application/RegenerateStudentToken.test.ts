import { RegenerateStudentToken, StudentNotFoundError } from './RegenerateStudentToken';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { SubdivisionId } from '../domain/tenant/SubdivisionId';

describe('RegenerateStudentToken', () => {
  let studentRepository: InMemoryStudentRepository;
  let useCase: RegenerateStudentToken;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');
  const locationId = LocationId.create('LOC-EAST');
  const subdivisionId = SubdivisionId.create('SUB-EAGLE');

  const createStudent = (id: string, firstName: string, lastName: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName,
      lastName,
      email: `${id.toLowerCase().replace('student-', '')}@school.uk`,
      tenantId,
      locationId,
      subdivisionId,
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    useCase = new RegenerateStudentToken(studentRepository);
  });

  describe('execute', () => {
    it('generates new token for student without existing token', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson');
      await studentRepository.save(student);

      const result = await useCase.execute({
        studentId: 'STUDENT-ABC123',
      });

      expect(result.accessToken).toBeDefined();
      expect(result.accessToken.length).toBe(24);

      const updated = await studentRepository.findById(student.id);
      expect(updated!.hasValidAccessToken).toBe(true);
      expect(updated!.accessToken!.toString()).toBe(result.accessToken);
    });

    it('generates new token replacing existing token', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson').generateAccessToken();
      const originalToken = student.accessToken!.toString();
      await studentRepository.save(student);

      const result = await useCase.execute({
        studentId: 'STUDENT-ABC123',
      });

      expect(result.accessToken).not.toBe(originalToken);

      const updated = await studentRepository.findById(student.id);
      expect(updated!.accessToken!.toString()).toBe(result.accessToken);
    });

    it('throws StudentNotFoundError for non-existent student', async () => {
      await expect(
        useCase.execute({
          studentId: 'STUDENT-NOTFOUND',
        })
      ).rejects.toThrow(StudentNotFoundError);
    });

    it('reactivates revoked token with new token', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson')
        .generateAccessToken()
        .revokeAccessToken(new Date('2026-04-10T10:00:00Z'));
      await studentRepository.save(student);

      expect(student.hasValidAccessToken).toBe(false);

      const result = await useCase.execute({
        studentId: 'STUDENT-ABC123',
      });

      const updated = await studentRepository.findById(student.id);
      expect(updated!.hasValidAccessToken).toBe(true);
      expect(result.accessToken).toBeDefined();
    });

    it('returns student info for URL construction', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson');
      await studentRepository.save(student);

      const result = await useCase.execute({
        studentId: 'STUDENT-ABC123',
      });

      expect(result.studentId).toBe('STUDENT-ABC123');
      expect(result.displayName).toBe('AT'); // Initials
    });

    it('new token can be found via repository', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson');
      await studentRepository.save(student);

      const result = await useCase.execute({
        studentId: 'STUDENT-ABC123',
      });

      const { AccessToken } = await import('../domain/auth/AccessToken');
      const token = AccessToken.create(result.accessToken);
      const found = await studentRepository.findByAccessToken(token);

      expect(found).not.toBeNull();
      expect(found!.id.equals(student.id)).toBe(true);
    });
  });
});

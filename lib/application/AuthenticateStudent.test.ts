import { AuthenticateStudent, InvalidTokenError, RevokedTokenError } from './AuthenticateStudent';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { SubdivisionId } from '../domain/tenant/SubdivisionId';
import { AccessToken } from '../domain/auth/AccessToken';

describe('AuthenticateStudent', () => {
  let studentRepository: InMemoryStudentRepository;
  let useCase: AuthenticateStudent;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');
  const locationId = LocationId.create('LOC-EAST');

  const createStudent = (id: string, firstName: string, lastName: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName,
      lastName,
      email: `${id.toLowerCase().replace('student-', '')}@school.uk`,
      tenantId,
      locationId,
      subdivisionId: SubdivisionId.create('SUB-EAGLE'),
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository();
    useCase = new AuthenticateStudent(studentRepository);
  });

  describe('execute', () => {
    it('returns student info for valid token', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson').generateAccessToken();
      await studentRepository.save(student);

      const result = await useCase.execute({
        accessToken: student.accessToken!.toString(),
      });

      expect(result.studentId).toBe('STUDENT-ABC123');
      expect(result.tenantId).toBe('TENANT-ARNFIELD');
      expect(result.locationId).toBe('LOC-EAST');
    });

    it('returns anonymized display name (not real name)', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson').generateAccessToken();
      await studentRepository.save(student);

      const result = await useCase.execute({
        accessToken: student.accessToken!.toString(),
      });

      // Should return initials, not full name
      expect(result.displayName).toBe('AT');
      expect(result.displayName).not.toContain('Alice');
      expect(result.displayName).not.toContain('Thompson');
    });

    it('throws InvalidTokenError for unknown token', async () => {
      const unknownToken = AccessToken.generate();

      await expect(
        useCase.execute({
          accessToken: unknownToken.toString(),
        })
      ).rejects.toThrow(InvalidTokenError);
    });

    it('throws InvalidTokenError for invalid token format', async () => {
      await expect(
        useCase.execute({
          accessToken: 'invalid-short-token',
        })
      ).rejects.toThrow(InvalidTokenError);
    });

    it('throws RevokedTokenError if token revoked', async () => {
      const revokedAt = new Date('2026-04-11T10:00:00Z');
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson')
        .generateAccessToken()
        .revokeAccessToken(revokedAt);
      await studentRepository.save(student);

      await expect(
        useCase.execute({
          accessToken: student.accessToken!.toString(),
        })
      ).rejects.toThrow(RevokedTokenError);
    });

    it('returns subdivisionId for session context', async () => {
      const student = createStudent('STUDENT-ABC123', 'Alice', 'Thompson').generateAccessToken();
      await studentRepository.save(student);

      const result = await useCase.execute({
        accessToken: student.accessToken!.toString(),
      });

      expect(result.subdivisionId).toBe('SUB-EAGLE');
    });
  });
});

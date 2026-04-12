import { Student } from './Student';
import { StudentId } from './StudentId';
import { TenantId } from '../tenant/TenantId';
import { LocationId } from '../tenant/LocationId';
import { SubdivisionId } from '../tenant/SubdivisionId';
import { AccessToken } from '../auth/AccessToken';

describe('Student', () => {
  const now = new Date('2026-03-29T10:00:00Z');

  const validProps = {
    id: StudentId.create('STUDENT-001'),
    firstName: 'Oliver',
    lastName: 'Smith',
    email: 'oliver.smith@school.uk',
    tenantId: TenantId.create('TENANT-ARNFIELD'),
    locationId: LocationId.create('LOC-EAST'),
    subdivisionId: SubdivisionId.create('SUB-EAGLE'),
    createdAt: now,
    updatedAt: now,
  };

  describe('create', () => {
    it('creates valid Student', () => {
      const student = Student.create(validProps);

      expect(student.id.equals(validProps.id)).toBe(true);
      expect(student.firstName).toBe('Oliver');
      expect(student.lastName).toBe('Smith');
      expect(student.email).toBe('oliver.smith@school.uk');
      expect(student.subdivisionId.toString()).toBe('SUB-EAGLE');
    });

    it('throws for empty firstName', () => {
      expect(() => Student.create({ ...validProps, firstName: '' })).toThrow();
    });

    it('throws for empty lastName', () => {
      expect(() => Student.create({ ...validProps, lastName: '' })).toThrow();
    });

    it('throws for invalid email', () => {
      expect(() => Student.create({ ...validProps, email: 'not-an-email' })).toThrow();
    });
  });

  describe('fullName', () => {
    it('returns full name', () => {
      const student = Student.create(validProps);
      expect(student.fullName).toBe('Oliver Smith');
    });
  });

  describe('initials', () => {
    it('returns initials from first and last name', () => {
      const student = Student.create(validProps);
      expect(student.initials).toBe('OS');
    });

    it('handles lowercase names', () => {
      const student = Student.create({
        ...validProps,
        firstName: 'jane',
        lastName: 'doe',
      });
      expect(student.initials).toBe('JD');
    });
  });

  describe('equals', () => {
    it('returns true for same student id', () => {
      const student1 = Student.create(validProps);
      const student2 = Student.create(validProps);
      expect(student1.equals(student2)).toBe(true);
    });

    it('returns false for different student id', () => {
      const student1 = Student.create(validProps);
      const student2 = Student.create({
        ...validProps,
        id: StudentId.create('STUDENT-002'),
      });
      expect(student1.equals(student2)).toBe(false);
    });
  });

  describe('accessToken', () => {
    it('creates student without access token by default', () => {
      const student = Student.create(validProps);
      expect(student.accessToken).toBeUndefined();
    });

    it('creates student with access token', () => {
      const token = AccessToken.generate();
      const student = Student.create({
        ...validProps,
        accessToken: token,
      });
      expect(student.accessToken?.toString()).toBe(token.toString());
    });

    it('generates new access token', () => {
      const student = Student.create(validProps);
      const withToken = student.generateAccessToken();

      expect(withToken.accessToken).toBeDefined();
      expect(withToken.accessToken?.toString()).toHaveLength(24);
      expect(student.accessToken).toBeUndefined(); // Immutability
    });

    it('regenerates different access token', () => {
      const student = Student.create(validProps).generateAccessToken();
      const regenerated = student.regenerateAccessToken();

      expect(regenerated.accessToken).toBeDefined();
      expect(regenerated.accessToken?.toString()).not.toBe(student.accessToken?.toString());
    });

    it('revokes access token', () => {
      const revokedAt = new Date('2026-04-12T10:00:00Z');
      const student = Student.create(validProps).generateAccessToken();
      const revoked = student.revokeAccessToken(revokedAt);

      expect(revoked.accessTokenRevokedAt).toEqual(revokedAt);
      expect(student.accessTokenRevokedAt).toBeUndefined(); // Immutability
    });

    it('hasValidAccessToken returns false when no token', () => {
      const student = Student.create(validProps);
      expect(student.hasValidAccessToken).toBe(false);
    });

    it('hasValidAccessToken returns true when token exists and not revoked', () => {
      const student = Student.create(validProps).generateAccessToken();
      expect(student.hasValidAccessToken).toBe(true);
    });

    it('hasValidAccessToken returns false when token is revoked', () => {
      const revokedAt = new Date('2026-04-12T10:00:00Z');
      const student = Student.create(validProps).generateAccessToken().revokeAccessToken(revokedAt);
      expect(student.hasValidAccessToken).toBe(false);
    });
  });
});

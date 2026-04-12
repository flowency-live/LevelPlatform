import { AnonymityService } from './AnonymityService';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { SubdivisionId } from '../domain/tenant/SubdivisionId';
import { Subdivision } from '../domain/tenant/Subdivision';

describe('AnonymityService', () => {
  const now = new Date('2026-03-29T10:00:00Z');

  const createStudent = (overrides: Partial<{
    id: string;
    firstName: string;
    lastName: string;
  }> = {}): Student => {
    return Student.create({
      id: StudentId.create(overrides.id ?? 'STUDENT-001'),
      firstName: overrides.firstName ?? 'John',
      lastName: overrides.lastName ?? 'Smith',
      email: 'student@school.uk',
      tenantId: TenantId.create('TENANT-ARNFIELD'),
      locationId: LocationId.create('LOC-EAST'),
      subdivisionId: SubdivisionId.create('SUB-EAGLE'),
      createdAt: now,
      updatedAt: now,
    });
  };

  const createSubdivision = (name: string = 'Eagle'): Subdivision => {
    return Subdivision.create({
      id: SubdivisionId.create(`SUB-${name.toUpperCase()}`),
      locationId: LocationId.create('LOC-EAST'),
      name,
    });
  };

  describe('getDisplayName', () => {
    it('returns subdivision name + initials', () => {
      const service = new AnonymityService();
      const student = createStudent({ firstName: 'John', lastName: 'Smith' });
      const subdivision = createSubdivision('Eagle');

      const result = service.getDisplayName(student, subdivision);

      expect(result).toBe('Eagle JS');
    });

    it('handles different subdivision names', () => {
      const service = new AnonymityService();
      const student = createStudent({ firstName: 'Jane', lastName: 'Doe' });
      const subdivision = createSubdivision('Hawk');

      const result = service.getDisplayName(student, subdivision);

      expect(result).toBe('Hawk JD');
    });

    it('handles lowercase first/last names', () => {
      const service = new AnonymityService();
      const student = Student.create({
        id: StudentId.create('STUDENT-001'),
        firstName: 'oliver',
        lastName: 'smith',
        email: 'student@school.uk',
        tenantId: TenantId.create('TENANT-ARNFIELD'),
        locationId: LocationId.create('LOC-EAST'),
        subdivisionId: SubdivisionId.create('SUB-RAVEN'),
        createdAt: now,
        updatedAt: now,
      });
      const subdivision = createSubdivision('Raven');

      const result = service.getDisplayName(student, subdivision);

      expect(result).toBe('Raven OS');
    });
  });

  describe('getDisplayNamesWithDuplicateHandling', () => {
    it('returns unique display names when no duplicates', () => {
      const service = new AnonymityService();
      const subdivision = createSubdivision('Eagle');
      const students = [
        createStudent({ id: 'STUDENT-001', firstName: 'John', lastName: 'Smith' }),
        createStudent({ id: 'STUDENT-002', firstName: 'Jane', lastName: 'Doe' }),
        createStudent({ id: 'STUDENT-003', firstName: 'Bob', lastName: 'Wilson' }),
      ];

      const result = service.getDisplayNamesWithDuplicateHandling(students, subdivision);

      expect(result.get('STUDENT-001')).toBe('Eagle JS');
      expect(result.get('STUDENT-002')).toBe('Eagle JD');
      expect(result.get('STUDENT-003')).toBe('Eagle BW');
    });

    it('adds number suffix for duplicate initials', () => {
      const service = new AnonymityService();
      const subdivision = createSubdivision('Eagle');
      const students = [
        createStudent({ id: 'STUDENT-001', firstName: 'John', lastName: 'Smith' }),
        createStudent({ id: 'STUDENT-002', firstName: 'Jane', lastName: 'Sullivan' }),
        createStudent({ id: 'STUDENT-003', firstName: 'James', lastName: 'Stone' }),
      ];

      const result = service.getDisplayNamesWithDuplicateHandling(students, subdivision);

      expect(result.get('STUDENT-001')).toBe('Eagle JS');
      expect(result.get('STUDENT-002')).toBe('Eagle JS2');
      expect(result.get('STUDENT-003')).toBe('Eagle JS3');
    });

    it('handles multiple duplicate groups', () => {
      const service = new AnonymityService();
      const subdivision = createSubdivision('Hawk');
      const students = [
        createStudent({ id: 'STUDENT-001', firstName: 'John', lastName: 'Smith' }),
        createStudent({ id: 'STUDENT-002', firstName: 'Jane', lastName: 'Doe' }),
        createStudent({ id: 'STUDENT-003', firstName: 'James', lastName: 'Stone' }),
        createStudent({ id: 'STUDENT-004', firstName: 'Julia', lastName: 'Davis' }),
      ];

      const result = service.getDisplayNamesWithDuplicateHandling(students, subdivision);

      expect(result.get('STUDENT-001')).toBe('Hawk JS');
      expect(result.get('STUDENT-002')).toBe('Hawk JD');
      expect(result.get('STUDENT-003')).toBe('Hawk JS2');
      expect(result.get('STUDENT-004')).toBe('Hawk JD2');
    });

    it('returns empty map for empty student list', () => {
      const service = new AnonymityService();
      const subdivision = createSubdivision('Eagle');

      const result = service.getDisplayNamesWithDuplicateHandling([], subdivision);

      expect(result.size).toBe(0);
    });
  });
});

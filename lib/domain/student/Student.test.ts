import { Student } from './Student';
import { StudentId } from './StudentId';
import { TenantId } from '../tenant/TenantId';
import { LocationId } from '../tenant/LocationId';
import { CohortId } from '../tenant/CohortId';

describe('Student', () => {
  const validProps = {
    id: StudentId.create('STUDENT-001'),
    firstName: 'Oliver',
    lastName: 'Smith',
    email: 'oliver.smith@school.uk',
    tenantId: TenantId.create('TENANT-ARNFIELD'),
    locationId: LocationId.create('LOC-EAST'),
    cohortId: CohortId.create('COHORT-Y10-2025'),
    yearGroup: 10,
  };

  describe('create', () => {
    it('creates valid Student', () => {
      const student = Student.create(validProps);

      expect(student.id.equals(validProps.id)).toBe(true);
      expect(student.firstName).toBe('Oliver');
      expect(student.lastName).toBe('Smith');
      expect(student.email).toBe('oliver.smith@school.uk');
      expect(student.yearGroup).toBe(10);
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

    it('throws for invalid yearGroup', () => {
      expect(() => Student.create({ ...validProps, yearGroup: 0 })).toThrow();
      expect(() => Student.create({ ...validProps, yearGroup: 14 })).toThrow();
    });
  });

  describe('fullName', () => {
    it('returns full name', () => {
      const student = Student.create(validProps);
      expect(student.fullName).toBe('Oliver Smith');
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
});

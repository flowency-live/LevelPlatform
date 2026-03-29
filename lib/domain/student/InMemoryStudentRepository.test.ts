import { InMemoryStudentRepository } from './InMemoryStudentRepository';
import { Student } from './Student';
import { StudentId } from './StudentId';
import { TenantId } from '../tenant/TenantId';
import { LocationId } from '../tenant/LocationId';
import { CohortId } from '../tenant/CohortId';

describe('InMemoryStudentRepository', () => {
  let repository: InMemoryStudentRepository;
  const now = new Date('2026-03-29T10:00:00Z');

  const createStudent = (overrides: Partial<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    tenantId: string;
    locationId: string;
    cohortId: string;
    yearGroup: number;
  }> = {}) => {
    return Student.create({
      id: StudentId.create(overrides.id ?? 'STUDENT-001'),
      firstName: overrides.firstName ?? 'Oliver',
      lastName: overrides.lastName ?? 'Smith',
      email: overrides.email ?? 'oliver.smith@school.uk',
      tenantId: TenantId.create(overrides.tenantId ?? 'TENANT-ARNFIELD'),
      locationId: LocationId.create(overrides.locationId ?? 'LOC-EAST'),
      cohortId: CohortId.create(overrides.cohortId ?? 'COHORT-Y10-2025'),
      yearGroup: overrides.yearGroup ?? 10,
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    repository = new InMemoryStudentRepository();
  });

  describe('save and findById', () => {
    it('saves and retrieves a student', async () => {
      const student = createStudent();

      await repository.save(student);
      const found = await repository.findById(student.id);

      expect(found).not.toBeNull();
      expect(found!.id.equals(student.id)).toBe(true);
      expect(found!.firstName).toBe('Oliver');
    });

    it('returns null for non-existent student', async () => {
      const found = await repository.findById(StudentId.create('STUDENT-NOTFOUND'));

      expect(found).toBeNull();
    });

    it('overwrites existing student on save', async () => {
      const student1 = createStudent({ firstName: 'Oliver' });
      const student2 = Student.create({
        id: student1.id,
        firstName: 'Updated',
        lastName: 'Smith',
        email: 'oliver.smith@school.uk',
        tenantId: TenantId.create('TENANT-ARNFIELD'),
        locationId: LocationId.create('LOC-EAST'),
        cohortId: CohortId.create('COHORT-Y10-2025'),
        yearGroup: 10,
        createdAt: now,
        updatedAt: now,
      });

      await repository.save(student1);
      await repository.save(student2);
      const found = await repository.findById(student1.id);

      expect(found!.firstName).toBe('Updated');
    });

    it('preserves timestamps through save/retrieve', async () => {
      const student = createStudent();

      await repository.save(student);
      const found = await repository.findById(student.id);

      expect(found!.createdAt).toEqual(now);
      expect(found!.updatedAt).toEqual(now);
    });
  });

  describe('findByTenantId', () => {
    it('returns students for tenant', async () => {
      const student1 = createStudent({ id: 'STUDENT-001', tenantId: 'TENANT-A' });
      const student2 = createStudent({ id: 'STUDENT-002', tenantId: 'TENANT-A', email: 's2@school.uk' });
      const student3 = createStudent({ id: 'STUDENT-003', tenantId: 'TENANT-B', email: 's3@school.uk' });

      await repository.save(student1);
      await repository.save(student2);
      await repository.save(student3);

      const found = await repository.findByTenantId(TenantId.create('TENANT-A'));

      expect(found).toHaveLength(2);
      expect(found.some(s => s.id.equals(student1.id))).toBe(true);
      expect(found.some(s => s.id.equals(student2.id))).toBe(true);
    });

    it('returns empty array when no students for tenant', async () => {
      const found = await repository.findByTenantId(TenantId.create('TENANT-EMPTY'));

      expect(found).toEqual([]);
    });
  });

  describe('findByCohortId', () => {
    it('returns students for cohort', async () => {
      const student1 = createStudent({ id: 'STUDENT-001', cohortId: 'COHORT-A' });
      const student2 = createStudent({ id: 'STUDENT-002', cohortId: 'COHORT-A', email: 's2@school.uk' });
      const student3 = createStudent({ id: 'STUDENT-003', cohortId: 'COHORT-B', email: 's3@school.uk' });

      await repository.save(student1);
      await repository.save(student2);
      await repository.save(student3);

      const found = await repository.findByCohortId(CohortId.create('COHORT-A'));

      expect(found).toHaveLength(2);
    });

    it('returns empty array when no students for cohort', async () => {
      const found = await repository.findByCohortId(CohortId.create('COHORT-EMPTY'));

      expect(found).toEqual([]);
    });
  });

  describe('findByLocationId', () => {
    it('returns students for location', async () => {
      const student1 = createStudent({ id: 'STUDENT-001', locationId: 'LOC-NORTH' });
      const student2 = createStudent({ id: 'STUDENT-002', locationId: 'LOC-NORTH', email: 's2@school.uk' });
      const student3 = createStudent({ id: 'STUDENT-003', locationId: 'LOC-SOUTH', email: 's3@school.uk' });

      await repository.save(student1);
      await repository.save(student2);
      await repository.save(student3);

      const found = await repository.findByLocationId(LocationId.create('LOC-NORTH'));

      expect(found).toHaveLength(2);
    });

    it('returns empty array when no students for location', async () => {
      const found = await repository.findByLocationId(LocationId.create('LOC-EMPTY'));

      expect(found).toEqual([]);
    });
  });
});

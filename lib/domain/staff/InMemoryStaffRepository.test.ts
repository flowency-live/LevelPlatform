import { InMemoryStaffRepository } from './InMemoryStaffRepository';
import { StaffMember } from './StaffMember';
import { StaffId } from './StaffId';
import { TenantId } from '../tenant/TenantId';
import { Role } from './Role';
import { StaffType } from './StaffType';

describe('InMemoryStaffRepository', () => {
  let repository: InMemoryStaffRepository;

  const arnfieldId = TenantId.create('TENANT-ARNFIELD');
  const otherId = TenantId.create('TENANT-OTHER');

  const teacher = StaffMember.create({
    id: StaffId.create('STAFF-TEACHER01'),
    schoolId: arnfieldId,
    name: 'Jane Doe',
    email: 'jdoe@arnfield.edu',
    staffType: StaffType.Teaching,
    roles: [Role.Teacher],
  });

  const seniorTeacher = StaffMember.create({
    id: StaffId.create('STAFF-SENIOR01'),
    schoolId: arnfieldId,
    name: 'John Smith',
    email: 'jsmith@arnfield.edu',
    staffType: StaffType.Teaching,
    roles: [Role.SeniorTeacher, Role.GatsbyLead],
  });

  const careStaff = StaffMember.create({
    id: StaffId.create('STAFF-CARE01'),
    schoolId: arnfieldId,
    name: 'Mary Jones',
    email: 'mjones@arnfield.edu',
    staffType: StaffType.Care,
    roles: [],
  });

  const otherSchoolStaff = StaffMember.create({
    id: StaffId.create('STAFF-OTHER01'),
    schoolId: otherId,
    name: 'Bob Wilson',
    email: 'bwilson@other.edu',
    staffType: StaffType.Teaching,
    roles: [Role.Teacher],
  });

  beforeEach(() => {
    repository = new InMemoryStaffRepository();
  });

  describe('save and findById', () => {
    it('saves and retrieves a staff member', async () => {
      await repository.save(teacher);
      const found = await repository.findById(teacher.id);
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Jane Doe');
    });

    it('returns null for non-existent staff', async () => {
      const found = await repository.findById(StaffId.create('STAFF-NOTFOUND'));
      expect(found).toBeNull();
    });
  });

  describe('findBySchool', () => {
    it('returns all staff for a school', async () => {
      await repository.save(teacher);
      await repository.save(seniorTeacher);
      await repository.save(careStaff);
      await repository.save(otherSchoolStaff);

      const arnfieldStaff = await repository.findBySchool(arnfieldId);
      expect(arnfieldStaff).toHaveLength(3);
    });

    it('returns empty array for school with no staff', async () => {
      const staff = await repository.findBySchool(TenantId.create('TENANT-EMPTY'));
      expect(staff).toEqual([]);
    });
  });

  describe('findByRole', () => {
    it('returns staff with specific role', async () => {
      await repository.save(teacher);
      await repository.save(seniorTeacher);
      await repository.save(careStaff);

      const gatsbyLeads = await repository.findByRole(arnfieldId, Role.GatsbyLead);
      expect(gatsbyLeads).toHaveLength(1);
      expect(gatsbyLeads[0].name).toBe('John Smith');
    });

    it('returns multiple staff with same role', async () => {
      await repository.save(teacher);
      await repository.save(seniorTeacher);

      const seniorTeachers = await repository.findByRole(arnfieldId, Role.SeniorTeacher);
      expect(seniorTeachers).toHaveLength(1);

      const teachers = await repository.findByRole(arnfieldId, Role.Teacher);
      expect(teachers).toHaveLength(1);
    });

    it('returns empty array when no staff have role', async () => {
      await repository.save(teacher);

      const heads = await repository.findByRole(arnfieldId, Role.Head);
      expect(heads).toEqual([]);
    });
  });

  describe('findByStaffType', () => {
    it('returns teaching staff', async () => {
      await repository.save(teacher);
      await repository.save(seniorTeacher);
      await repository.save(careStaff);

      const teachingStaff = await repository.findByStaffType(arnfieldId, StaffType.Teaching);
      expect(teachingStaff).toHaveLength(2);
    });

    it('returns care staff', async () => {
      await repository.save(teacher);
      await repository.save(seniorTeacher);
      await repository.save(careStaff);

      const careStaffList = await repository.findByStaffType(arnfieldId, StaffType.Care);
      expect(careStaffList).toHaveLength(1);
      expect(careStaffList[0].name).toBe('Mary Jones');
    });

    it('returns empty array when no staff of type', async () => {
      await repository.save(teacher);

      const careStaffList = await repository.findByStaffType(arnfieldId, StaffType.Care);
      expect(careStaffList).toEqual([]);
    });
  });
});

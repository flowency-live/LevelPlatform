import { StaffMember, StaffMemberProps } from './StaffMember';
import { StaffId } from './StaffId';
import { TenantId } from '../tenant/TenantId';
import { Role } from './Role';
import { StaffType } from './StaffType';

describe('StaffMember', () => {
  const validProps: StaffMemberProps = {
    id: StaffId.create('STAFF-JSMITH01'),
    schoolId: TenantId.create('TENANT-ARNFIELD'),
    name: 'John Smith',
    email: 'jsmith@arnfield.edu',
    staffType: StaffType.Teaching,
    roles: [Role.Teacher],
  };

  describe('create', () => {
    it('creates a valid staff member', () => {
      const member = StaffMember.create(validProps);
      expect(member.id.toString()).toBe('STAFF-JSMITH01');
      expect(member.schoolId.toString()).toBe('TENANT-ARNFIELD');
      expect(member.name).toBe('John Smith');
      expect(member.email).toBe('jsmith@arnfield.edu');
      expect(member.staffType).toBe(StaffType.Teaching);
      expect(member.roles).toEqual([Role.Teacher]);
    });

    it('creates staff member with multiple roles', () => {
      const member = StaffMember.create({
        ...validProps,
        roles: [Role.SeniorTeacher, Role.GatsbyLead, Role.ASDANCoordinator],
      });
      expect(member.roles).toHaveLength(3);
    });
  });

  describe('hasRole', () => {
    it('returns true when staff member has role', () => {
      const member = StaffMember.create({
        ...validProps,
        roles: [Role.Teacher, Role.GatsbyLead],
      });
      expect(member.hasRole(Role.Teacher)).toBe(true);
      expect(member.hasRole(Role.GatsbyLead)).toBe(true);
    });

    it('returns false when staff member lacks role', () => {
      const member = StaffMember.create(validProps);
      expect(member.hasRole(Role.Head)).toBe(false);
      expect(member.hasRole(Role.GatsbyLead)).toBe(false);
    });
  });

  describe('isGatsbyLead', () => {
    it('returns true when staff member is Gatsby Lead', () => {
      const member = StaffMember.create({
        ...validProps,
        roles: [Role.Teacher, Role.GatsbyLead],
      });
      expect(member.isGatsbyLead()).toBe(true);
    });

    it('returns false when staff member is not Gatsby Lead', () => {
      const member = StaffMember.create(validProps);
      expect(member.isGatsbyLead()).toBe(false);
    });
  });

  describe('isASDANCoordinator', () => {
    it('returns true when staff member is ASDAN Coordinator', () => {
      const member = StaffMember.create({
        ...validProps,
        roles: [Role.Teacher, Role.ASDANCoordinator],
      });
      expect(member.isASDANCoordinator()).toBe(true);
    });

    it('returns false when staff member is not ASDAN Coordinator', () => {
      const member = StaffMember.create(validProps);
      expect(member.isASDANCoordinator()).toBe(false);
    });
  });

  describe('isSeniorTeacher', () => {
    it('returns true when staff member is Senior Teacher', () => {
      const member = StaffMember.create({
        ...validProps,
        roles: [Role.SeniorTeacher],
      });
      expect(member.isSeniorTeacher()).toBe(true);
    });

    it('returns false when staff member is not Senior Teacher', () => {
      const member = StaffMember.create(validProps);
      expect(member.isSeniorTeacher()).toBe(false);
    });
  });

  describe('isHead', () => {
    it('returns true when staff member is Head', () => {
      const member = StaffMember.create({
        ...validProps,
        roles: [Role.Head],
      });
      expect(member.isHead()).toBe(true);
    });

    it('returns false when staff member is not Head', () => {
      const member = StaffMember.create(validProps);
      expect(member.isHead()).toBe(false);
    });
  });

  describe('canInput', () => {
    it('returns true for Teaching Staff', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Teaching,
      });
      expect(member.canInput()).toBe(true);
    });

    it('returns false for Care Staff', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Care,
      });
      expect(member.canInput()).toBe(false);
    });
  });

  describe('canApprove', () => {
    it('returns true for Teaching Staff with Senior Teacher role', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Teaching,
        roles: [Role.SeniorTeacher],
      });
      expect(member.canApprove()).toBe(true);
    });

    it('returns true for Teaching Staff with Gatsby Lead role', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Teaching,
        roles: [Role.GatsbyLead],
      });
      expect(member.canApprove()).toBe(true);
    });

    it('returns true for Teaching Staff with ASDAN Coordinator role', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Teaching,
        roles: [Role.ASDANCoordinator],
      });
      expect(member.canApprove()).toBe(true);
    });

    it('returns true for Teaching Staff with Head role', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Teaching,
        roles: [Role.Head],
      });
      expect(member.canApprove()).toBe(true);
    });

    it('returns false for Teaching Staff with only Teacher role', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Teaching,
        roles: [Role.Teacher],
      });
      expect(member.canApprove()).toBe(false);
    });

    it('returns false for Care Staff even with approval role', () => {
      const member = StaffMember.create({
        ...validProps,
        staffType: StaffType.Care,
        roles: [Role.GatsbyLead],
      });
      expect(member.canApprove()).toBe(false);
    });
  });

  describe('immutability', () => {
    it('roles array is immutable', () => {
      const member = StaffMember.create(validProps);
      const roles = member.roles;
      expect(() => {
        (roles as Role[]).push(Role.Head);
      }).toThrow();
    });
  });
});

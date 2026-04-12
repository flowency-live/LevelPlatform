import { Role, isRole, ALL_ROLES, APPROVAL_ROLES } from './Role';

describe('Role', () => {
  describe('enum values', () => {
    it('has teacher role', () => {
      expect(Role.Teacher).toBe('teacher');
    });

    it('has senior-teacher role', () => {
      expect(Role.SeniorTeacher).toBe('senior-teacher');
    });

    it('has gatsby-lead role', () => {
      expect(Role.GatsbyLead).toBe('gatsby-lead');
    });

    it('has asdan-coordinator role', () => {
      expect(Role.ASDANCoordinator).toBe('asdan-coordinator');
    });

    it('has head role', () => {
      expect(Role.Head).toBe('head');
    });
  });

  describe('isRole', () => {
    it('returns true for valid roles', () => {
      expect(isRole('teacher')).toBe(true);
      expect(isRole('senior-teacher')).toBe(true);
      expect(isRole('gatsby-lead')).toBe(true);
      expect(isRole('asdan-coordinator')).toBe(true);
      expect(isRole('head')).toBe(true);
    });

    it('returns false for invalid roles', () => {
      expect(isRole('admin')).toBe(false);
      expect(isRole('student')).toBe(false);
      expect(isRole('')).toBe(false);
      expect(isRole('TEACHER')).toBe(false);
    });
  });

  describe('ALL_ROLES', () => {
    it('contains all five roles', () => {
      expect(ALL_ROLES).toHaveLength(5);
      expect(ALL_ROLES).toContain(Role.Teacher);
      expect(ALL_ROLES).toContain(Role.SeniorTeacher);
      expect(ALL_ROLES).toContain(Role.GatsbyLead);
      expect(ALL_ROLES).toContain(Role.ASDANCoordinator);
      expect(ALL_ROLES).toContain(Role.Head);
    });
  });

  describe('APPROVAL_ROLES', () => {
    it('contains roles that can approve evidence', () => {
      expect(APPROVAL_ROLES).toContain(Role.SeniorTeacher);
      expect(APPROVAL_ROLES).toContain(Role.GatsbyLead);
      expect(APPROVAL_ROLES).toContain(Role.ASDANCoordinator);
      expect(APPROVAL_ROLES).toContain(Role.Head);
    });

    it('does not contain basic teacher role', () => {
      expect(APPROVAL_ROLES).not.toContain(Role.Teacher);
    });
  });
});

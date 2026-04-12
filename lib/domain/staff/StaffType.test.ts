import { StaffType, isStaffType, ALL_STAFF_TYPES } from './StaffType';

describe('StaffType', () => {
  describe('enum values', () => {
    it('has teaching staff type', () => {
      expect(StaffType.Teaching).toBe('teaching');
    });

    it('has care staff type', () => {
      expect(StaffType.Care).toBe('care');
    });
  });

  describe('isStaffType', () => {
    it('returns true for valid staff types', () => {
      expect(isStaffType('teaching')).toBe(true);
      expect(isStaffType('care')).toBe(true);
    });

    it('returns false for invalid staff types', () => {
      expect(isStaffType('admin')).toBe(false);
      expect(isStaffType('support')).toBe(false);
      expect(isStaffType('')).toBe(false);
      expect(isStaffType('TEACHING')).toBe(false);
    });
  });

  describe('ALL_STAFF_TYPES', () => {
    it('contains both staff types', () => {
      expect(ALL_STAFF_TYPES).toHaveLength(2);
      expect(ALL_STAFF_TYPES).toContain(StaffType.Teaching);
      expect(ALL_STAFF_TYPES).toContain(StaffType.Care);
    });
  });
});

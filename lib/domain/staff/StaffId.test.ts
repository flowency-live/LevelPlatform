import { StaffId, InvalidStaffIdError } from './StaffId';

describe('StaffId', () => {
  describe('create', () => {
    it('creates valid StaffId', () => {
      const id = StaffId.create('STAFF-ABC123');
      expect(id.toString()).toBe('STAFF-ABC123');
    });

    it('throws InvalidStaffIdError for missing prefix', () => {
      expect(() => StaffId.create('ABC123')).toThrow(InvalidStaffIdError);
    });

    it('throws InvalidStaffIdError for empty string', () => {
      expect(() => StaffId.create('')).toThrow(InvalidStaffIdError);
    });

    it('throws InvalidStaffIdError for prefix only', () => {
      expect(() => StaffId.create('STAFF-')).toThrow(InvalidStaffIdError);
    });
  });

  describe('equals', () => {
    it('returns true for same staff id', () => {
      const id1 = StaffId.create('STAFF-ABC123');
      const id2 = StaffId.create('STAFF-ABC123');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different staff ids', () => {
      const id1 = StaffId.create('STAFF-ABC123');
      const id2 = StaffId.create('STAFF-XYZ789');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid staff ids', () => {
      expect(StaffId.isValid('STAFF-ABC123')).toBe(true);
      expect(StaffId.isValid('STAFF-jsmith01')).toBe(true);
    });

    it('returns false for invalid staff ids', () => {
      expect(StaffId.isValid('STAFF-')).toBe(false);
      expect(StaffId.isValid('')).toBe(false);
      expect(StaffId.isValid('staff-abc')).toBe(false);
      expect(StaffId.isValid('USER-ABC123')).toBe(false);
    });
  });
});

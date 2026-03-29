import { TenantId, InvalidTenantIdError } from './TenantId';

describe('TenantId', () => {
  describe('create', () => {
    it('creates valid TenantId', () => {
      const id = TenantId.create('TENANT-ARNFIELD');
      expect(id.toString()).toBe('TENANT-ARNFIELD');
    });

    it('throws InvalidTenantIdError for missing prefix', () => {
      expect(() => TenantId.create('ARNFIELD')).toThrow(InvalidTenantIdError);
    });

    it('throws InvalidTenantIdError for empty string', () => {
      expect(() => TenantId.create('')).toThrow(InvalidTenantIdError);
    });
  });

  describe('equals', () => {
    it('returns true for same tenant id', () => {
      const id1 = TenantId.create('TENANT-ARNFIELD');
      const id2 = TenantId.create('TENANT-ARNFIELD');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different tenant ids', () => {
      const id1 = TenantId.create('TENANT-ARNFIELD');
      const id2 = TenantId.create('TENANT-OTHER');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid tenant ids', () => {
      expect(TenantId.isValid('TENANT-ARNFIELD')).toBe(true);
    });

    it('returns false for invalid tenant ids', () => {
      expect(TenantId.isValid('TENANT-')).toBe(false);
      expect(TenantId.isValid('')).toBe(false);
    });
  });
});

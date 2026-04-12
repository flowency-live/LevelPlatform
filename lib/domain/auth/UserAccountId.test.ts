import { UserAccountId } from './UserAccountId';

describe('UserAccountId', () => {
  describe('create', () => {
    it('creates a valid user account ID', () => {
      const id = UserAccountId.create('ACCOUNT-ABC123');
      expect(id.toString()).toBe('ACCOUNT-ABC123');
    });

    it('accepts alphanumeric characters after prefix', () => {
      const id = UserAccountId.create('ACCOUNT-XYZ789DEF');
      expect(id.toString()).toBe('ACCOUNT-XYZ789DEF');
    });

    it('rejects IDs without ACCOUNT- prefix', () => {
      expect(() => UserAccountId.create('USER-ABC123')).toThrow('Invalid UserAccountId format');
    });

    it('rejects IDs with lowercase prefix', () => {
      expect(() => UserAccountId.create('account-ABC123')).toThrow('Invalid UserAccountId format');
    });

    it('rejects empty string', () => {
      expect(() => UserAccountId.create('')).toThrow('Invalid UserAccountId format');
    });

    it('rejects IDs with only prefix', () => {
      expect(() => UserAccountId.create('ACCOUNT-')).toThrow('Invalid UserAccountId format');
    });

    it('rejects IDs with special characters in identifier', () => {
      expect(() => UserAccountId.create('ACCOUNT-ABC@123')).toThrow('Invalid UserAccountId format');
    });
  });

  describe('generate', () => {
    it('generates ID with ACCOUNT- prefix', () => {
      const id = UserAccountId.generate();
      expect(id.toString()).toMatch(/^ACCOUNT-[A-Z0-9]+$/);
    });

    it('generates different IDs each time', () => {
      const id1 = UserAccountId.generate();
      const id2 = UserAccountId.generate();
      expect(id1.toString()).not.toBe(id2.toString());
    });

    it('generated ID passes validation', () => {
      const generated = UserAccountId.generate();
      const validated = UserAccountId.create(generated.toString());
      expect(validated.toString()).toBe(generated.toString());
    });
  });

  describe('equals', () => {
    it('returns true for same value', () => {
      const id1 = UserAccountId.create('ACCOUNT-ABC123');
      const id2 = UserAccountId.create('ACCOUNT-ABC123');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different values', () => {
      const id1 = UserAccountId.create('ACCOUNT-ABC123');
      const id2 = UserAccountId.create('ACCOUNT-XYZ789');
      expect(id1.equals(id2)).toBe(false);
    });
  });
});

import { AccessToken } from './AccessToken';

describe('AccessToken', () => {
  describe('create', () => {
    it('creates a valid access token', () => {
      const token = AccessToken.create('xK9mP2vL8nQ4wR7tYbHj3sNc');
      expect(token.toString()).toBe('xK9mP2vL8nQ4wR7tYbHj3sNc');
    });

    it('accepts 24 alphanumeric characters', () => {
      const token = AccessToken.create('ABCDEFGHIJKLMNOPQRSTUVWX');
      expect(token.toString()).toBe('ABCDEFGHIJKLMNOPQRSTUVWX');
    });

    it('accepts lowercase letters', () => {
      const token = AccessToken.create('abcdefghijklmnopqrstuvwx');
      expect(token.toString()).toBe('abcdefghijklmnopqrstuvwx');
    });

    it('accepts numbers', () => {
      const token = AccessToken.create('123456789012345678901234');
      expect(token.toString()).toBe('123456789012345678901234');
    });

    it('rejects tokens shorter than 24 characters', () => {
      expect(() => AccessToken.create('abc123')).toThrow('Invalid access token format');
    });

    it('rejects tokens longer than 24 characters', () => {
      expect(() => AccessToken.create('xK9mP2vL8nQ4wR7tYbHj3sNcXXX')).toThrow(
        'Invalid access token format'
      );
    });

    it('rejects tokens with special characters', () => {
      expect(() => AccessToken.create('xK9mP2vL8nQ4wR7t-bHj3sNc')).toThrow(
        'Invalid access token format'
      );
    });

    it('rejects tokens with spaces', () => {
      expect(() => AccessToken.create('xK9mP2vL8nQ4 R7tYbHj3sNc')).toThrow(
        'Invalid access token format'
      );
    });

    it('rejects empty string', () => {
      expect(() => AccessToken.create('')).toThrow('Invalid access token format');
    });
  });

  describe('generate', () => {
    it('generates a 24 character token', () => {
      const token = AccessToken.generate();
      expect(token.toString()).toHaveLength(24);
    });

    it('generates only alphanumeric characters', () => {
      const token = AccessToken.generate();
      expect(token.toString()).toMatch(/^[A-Za-z0-9]{24}$/);
    });

    it('generates different tokens each time', () => {
      const token1 = AccessToken.generate();
      const token2 = AccessToken.generate();
      expect(token1.toString()).not.toBe(token2.toString());
    });

    it('generated token passes validation', () => {
      const generated = AccessToken.generate();
      const validated = AccessToken.create(generated.toString());
      expect(validated.toString()).toBe(generated.toString());
    });
  });

  describe('equals', () => {
    it('returns true for same value', () => {
      const token1 = AccessToken.create('xK9mP2vL8nQ4wR7tYbHj3sNc');
      const token2 = AccessToken.create('xK9mP2vL8nQ4wR7tYbHj3sNc');
      expect(token1.equals(token2)).toBe(true);
    });

    it('returns false for different values', () => {
      const token1 = AccessToken.create('xK9mP2vL8nQ4wR7tYbHj3sNc');
      const token2 = AccessToken.create('ABCDEFGHIJKLMNOPQRSTUVWX');
      expect(token1.equals(token2)).toBe(false);
    });
  });
});

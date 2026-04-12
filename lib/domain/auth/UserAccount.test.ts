import { UserAccount } from './UserAccount';
import { UserAccountId } from './UserAccountId';
import { StaffId } from '../staff/StaffId';
import { TenantId } from '../tenant/TenantId';

describe('UserAccount', () => {
  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');

  const createAccount = (overrides: Partial<Parameters<typeof UserAccount.create>[0]> = {}) => {
    return UserAccount.create({
      id: UserAccountId.create('ACCOUNT-ABC123'),
      staffId: StaffId.create('STAFF-TEACHER01'),
      tenantId,
      email: 'teacher@school.uk',
      createdAt: now,
      ...overrides,
    });
  };

  describe('create', () => {
    it('creates a user account with required fields', () => {
      const account = createAccount();

      expect(account.id.toString()).toBe('ACCOUNT-ABC123');
      expect(account.staffId.toString()).toBe('STAFF-TEACHER01');
      expect(account.tenantId.toString()).toBe('TENANT-ARNFIELD');
      expect(account.email).toBe('teacher@school.uk');
      expect(account.createdAt).toEqual(now);
    });

    it('creates account with optional invite token', () => {
      const expiresAt = new Date('2026-04-13T10:00:00Z');
      const account = createAccount({
        inviteToken: 'invite-token-123',
        inviteExpiresAt: expiresAt,
      });

      expect(account.inviteToken).toBe('invite-token-123');
      expect(account.inviteExpiresAt).toEqual(expiresAt);
    });

    it('creates account without password or Azure AD', () => {
      const account = createAccount();

      expect(account.passwordHash).toBeUndefined();
      expect(account.azureAdId).toBeUndefined();
    });
  });

  describe('isActivated', () => {
    it('returns false when no password and no Azure AD', () => {
      const account = createAccount();
      expect(account.isActivated).toBe(false);
    });

    it('returns true when password is set', () => {
      const account = createAccount().setPassword('hashed-password-123');
      expect(account.isActivated).toBe(true);
    });

    it('returns true when Azure AD is linked', () => {
      const account = createAccount().linkAzureAd('azure-id-123');
      expect(account.isActivated).toBe(true);
    });

    it('returns true when both password and Azure AD are set', () => {
      const account = createAccount()
        .setPassword('hashed-password-123')
        .linkAzureAd('azure-id-123');
      expect(account.isActivated).toBe(true);
    });
  });

  describe('canLoginWithPassword', () => {
    it('returns false when no password', () => {
      const account = createAccount();
      expect(account.canLoginWithPassword).toBe(false);
    });

    it('returns true when password is set', () => {
      const account = createAccount().setPassword('hashed-password-123');
      expect(account.canLoginWithPassword).toBe(true);
    });
  });

  describe('canLoginWithAzureAd', () => {
    it('returns false when no Azure AD', () => {
      const account = createAccount();
      expect(account.canLoginWithAzureAd).toBe(false);
    });

    it('returns true when Azure AD is linked', () => {
      const account = createAccount().linkAzureAd('azure-id-123');
      expect(account.canLoginWithAzureAd).toBe(true);
    });
  });

  describe('setPassword', () => {
    it('returns new account with password hash', () => {
      const original = createAccount();
      const updated = original.setPassword('hashed-password-123');

      expect(updated.passwordHash).toBe('hashed-password-123');
      expect(original.passwordHash).toBeUndefined(); // Immutability
    });

    it('preserves other fields', () => {
      const original = createAccount();
      const updated = original.setPassword('hashed-password-123');

      expect(updated.id).toEqual(original.id);
      expect(updated.staffId).toEqual(original.staffId);
      expect(updated.email).toBe(original.email);
    });

    it('clears invite token after setting password', () => {
      const original = createAccount({
        inviteToken: 'invite-123',
        inviteExpiresAt: new Date(),
      });
      const updated = original.setPassword('hashed-password-123');

      expect(updated.inviteToken).toBeUndefined();
      expect(updated.inviteExpiresAt).toBeUndefined();
    });
  });

  describe('linkAzureAd', () => {
    it('returns new account with Azure AD ID', () => {
      const original = createAccount();
      const updated = original.linkAzureAd('azure-id-123');

      expect(updated.azureAdId).toBe('azure-id-123');
      expect(original.azureAdId).toBeUndefined(); // Immutability
    });

    it('preserves other fields', () => {
      const original = createAccount();
      const updated = original.linkAzureAd('azure-id-123');

      expect(updated.id).toEqual(original.id);
      expect(updated.staffId).toEqual(original.staffId);
      expect(updated.email).toBe(original.email);
    });
  });

  describe('recordLogin', () => {
    it('returns new account with last login timestamp', () => {
      const loginTime = new Date('2026-04-12T12:00:00Z');
      const original = createAccount();
      const updated = original.recordLogin(loginTime);

      expect(updated.lastLoginAt).toEqual(loginTime);
      expect(original.lastLoginAt).toBeUndefined(); // Immutability
    });

    it('preserves other fields', () => {
      const loginTime = new Date('2026-04-12T12:00:00Z');
      const original = createAccount().setPassword('hash');
      const updated = original.recordLogin(loginTime);

      expect(updated.id).toEqual(original.id);
      expect(updated.passwordHash).toBe(original.passwordHash);
    });
  });

  describe('hasValidInvite', () => {
    it('returns false when no invite token', () => {
      const account = createAccount();
      expect(account.hasValidInvite(now)).toBe(false);
    });

    it('returns false when invite expired', () => {
      const expiredAt = new Date('2026-04-11T10:00:00Z'); // Yesterday
      const account = createAccount({
        inviteToken: 'invite-123',
        inviteExpiresAt: expiredAt,
      });
      expect(account.hasValidInvite(now)).toBe(false);
    });

    it('returns true when invite not expired', () => {
      const expiresAt = new Date('2026-04-13T10:00:00Z'); // Tomorrow
      const account = createAccount({
        inviteToken: 'invite-123',
        inviteExpiresAt: expiresAt,
      });
      expect(account.hasValidInvite(now)).toBe(true);
    });
  });
});

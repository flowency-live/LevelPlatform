import { InMemoryUserAccountRepository } from './InMemoryUserAccountRepository';
import { UserAccount } from './UserAccount';
import { UserAccountId } from './UserAccountId';
import { StaffId } from '../staff/StaffId';
import { TenantId } from '../tenant/TenantId';

describe('InMemoryUserAccountRepository', () => {
  let repository: InMemoryUserAccountRepository;
  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');

  const createAccount = (
    id: string,
    staffId: string,
    email: string,
    overrides: Partial<Parameters<typeof UserAccount.create>[0]> = {}
  ) => {
    return UserAccount.create({
      id: UserAccountId.create(id),
      staffId: StaffId.create(staffId),
      tenantId,
      email,
      createdAt: now,
      ...overrides,
    });
  };

  beforeEach(() => {
    repository = new InMemoryUserAccountRepository();
  });

  describe('save and findById', () => {
    it('saves and retrieves an account by ID', async () => {
      const account = createAccount('ACCOUNT-ABC123', 'STAFF-TEACHER01', 'teacher@school.uk');

      await repository.save(account);
      const found = await repository.findById(UserAccountId.create('ACCOUNT-ABC123'));

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe('ACCOUNT-ABC123');
      expect(found?.email).toBe('teacher@school.uk');
    });

    it('returns null for non-existent ID', async () => {
      const found = await repository.findById(UserAccountId.create('ACCOUNT-NOTFOUND'));
      expect(found).toBeNull();
    });

    it('updates existing account', async () => {
      const account = createAccount('ACCOUNT-ABC123', 'STAFF-TEACHER01', 'teacher@school.uk');
      await repository.save(account);

      const updated = account.setPassword('hashed-password');
      await repository.save(updated);

      const found = await repository.findById(UserAccountId.create('ACCOUNT-ABC123'));
      expect(found?.passwordHash).toBe('hashed-password');
    });
  });

  describe('findByStaffId', () => {
    it('finds account by staff ID', async () => {
      const account = createAccount('ACCOUNT-ABC123', 'STAFF-TEACHER01', 'teacher@school.uk');
      await repository.save(account);

      const found = await repository.findByStaffId(StaffId.create('STAFF-TEACHER01'));

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe('ACCOUNT-ABC123');
    });

    it('returns null for non-existent staff ID', async () => {
      const found = await repository.findByStaffId(StaffId.create('STAFF-NOTFOUND'));
      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('finds account by email', async () => {
      const account = createAccount('ACCOUNT-ABC123', 'STAFF-TEACHER01', 'teacher@school.uk');
      await repository.save(account);

      const found = await repository.findByEmail('teacher@school.uk');

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe('ACCOUNT-ABC123');
    });

    it('returns null for non-existent email', async () => {
      const found = await repository.findByEmail('notfound@school.uk');
      expect(found).toBeNull();
    });

    it('is case-insensitive', async () => {
      const account = createAccount('ACCOUNT-ABC123', 'STAFF-TEACHER01', 'teacher@school.uk');
      await repository.save(account);

      const found = await repository.findByEmail('TEACHER@SCHOOL.UK');

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe('ACCOUNT-ABC123');
    });
  });

  describe('findByAzureAdId', () => {
    it('finds account by Azure AD ID', async () => {
      const account = createAccount(
        'ACCOUNT-ABC123',
        'STAFF-TEACHER01',
        'teacher@school.uk'
      ).linkAzureAd('azure-id-123');
      await repository.save(account);

      const found = await repository.findByAzureAdId('azure-id-123');

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe('ACCOUNT-ABC123');
    });

    it('returns null for non-existent Azure AD ID', async () => {
      const found = await repository.findByAzureAdId('azure-notfound');
      expect(found).toBeNull();
    });
  });

  describe('findByInviteToken', () => {
    it('finds account by invite token', async () => {
      const account = createAccount('ACCOUNT-ABC123', 'STAFF-TEACHER01', 'teacher@school.uk', {
        inviteToken: 'invite-token-123',
        inviteExpiresAt: new Date('2026-04-13T10:00:00Z'),
      });
      await repository.save(account);

      const found = await repository.findByInviteToken('invite-token-123');

      expect(found).not.toBeNull();
      expect(found?.id.toString()).toBe('ACCOUNT-ABC123');
    });

    it('returns null for non-existent invite token', async () => {
      const found = await repository.findByInviteToken('token-notfound');
      expect(found).toBeNull();
    });

    it('returns null after token is cleared', async () => {
      const account = createAccount('ACCOUNT-ABC123', 'STAFF-TEACHER01', 'teacher@school.uk', {
        inviteToken: 'invite-token-123',
        inviteExpiresAt: new Date('2026-04-13T10:00:00Z'),
      });
      await repository.save(account);

      // Clear token by setting password
      const activated = account.setPassword('hashed-password');
      await repository.save(activated);

      const found = await repository.findByInviteToken('invite-token-123');
      expect(found).toBeNull();
    });
  });
});

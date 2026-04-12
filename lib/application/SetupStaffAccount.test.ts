import { SetupStaffAccount, InvalidInviteError, ExpiredInviteError } from './SetupStaffAccount';
import { InMemoryUserAccountRepository } from '../domain/auth/InMemoryUserAccountRepository';
import { UserAccount } from '../domain/auth/UserAccount';
import { UserAccountId } from '../domain/auth/UserAccountId';
import { StaffId } from '../domain/staff/StaffId';
import { TenantId } from '../domain/tenant/TenantId';

describe('SetupStaffAccount', () => {
  let userAccountRepository: InMemoryUserAccountRepository;
  let useCase: SetupStaffAccount;

  const now = new Date('2026-04-12T10:00:00Z');
  const staffId = StaffId.create('STAFF-001');
  const tenantId = TenantId.create('TENANT-ARNFIELD');

  const createPendingAccount = (overrides: Partial<{
    inviteToken: string;
    inviteExpiresAt: Date;
  }> = {}) => {
    return UserAccount.create({
      id: UserAccountId.generate(),
      staffId,
      tenantId,
      email: 'sarah@school.uk',
      inviteToken: overrides.inviteToken ?? 'validInviteToken123456789012',
      inviteExpiresAt: overrides.inviteExpiresAt ?? new Date('2026-04-19T10:00:00Z'), // 7 days from now
      createdAt: new Date('2026-04-05T10:00:00Z'),
    });
  };

  beforeEach(() => {
    userAccountRepository = new InMemoryUserAccountRepository();
    useCase = new SetupStaffAccount(userAccountRepository, () => now);
  });

  describe('execute', () => {
    it('sets password for valid invite token', async () => {
      const account = createPendingAccount();
      await userAccountRepository.save(account);

      const result = await useCase.execute({
        inviteToken: 'validInviteToken123456789012',
        password: 'SecurePassword123!',
      });

      expect(result.success).toBe(true);
      expect(result.accountId).toBe(account.id.toString());

      const updated = await userAccountRepository.findById(account.id);
      expect(updated!.canLoginWithPassword).toBe(true);
    });

    it('throws InvalidInviteError for unknown token', async () => {
      await expect(
        useCase.execute({
          inviteToken: 'unknownToken1234567890123',
          password: 'SecurePassword123!',
        })
      ).rejects.toThrow(InvalidInviteError);
    });

    it('throws ExpiredInviteError for expired token', async () => {
      const account = createPendingAccount({
        inviteExpiresAt: new Date('2026-04-10T10:00:00Z'), // Expired 2 days ago
      });
      await userAccountRepository.save(account);

      await expect(
        useCase.execute({
          inviteToken: 'validInviteToken123456789012',
          password: 'SecurePassword123!',
        })
      ).rejects.toThrow(ExpiredInviteError);
    });

    it('clears invite token after setup', async () => {
      const account = createPendingAccount();
      await userAccountRepository.save(account);

      await useCase.execute({
        inviteToken: 'validInviteToken123456789012',
        password: 'SecurePassword123!',
      });

      const updated = await userAccountRepository.findById(account.id);
      expect(updated!.inviteToken).toBeUndefined();
      expect(updated!.inviteExpiresAt).toBeUndefined();
    });

    it('account becomes activated after setup', async () => {
      const account = createPendingAccount();
      await userAccountRepository.save(account);

      expect(account.isActivated).toBe(false);

      await useCase.execute({
        inviteToken: 'validInviteToken123456789012',
        password: 'SecurePassword123!',
      });

      const updated = await userAccountRepository.findById(account.id);
      expect(updated!.isActivated).toBe(true);
    });

    it('stores hashed password, not plain text', async () => {
      const account = createPendingAccount();
      await userAccountRepository.save(account);

      await useCase.execute({
        inviteToken: 'validInviteToken123456789012',
        password: 'SecurePassword123!',
      });

      const updated = await userAccountRepository.findById(account.id);
      expect(updated!.passwordHash).toBeDefined();
      expect(updated!.passwordHash).not.toBe('SecurePassword123!');
    });

    it('invite token cannot be reused after setup', async () => {
      const account = createPendingAccount();
      await userAccountRepository.save(account);

      await useCase.execute({
        inviteToken: 'validInviteToken123456789012',
        password: 'SecurePassword123!',
      });

      // Try to use the same token again
      await expect(
        useCase.execute({
          inviteToken: 'validInviteToken123456789012',
          password: 'AnotherPassword456!',
        })
      ).rejects.toThrow(InvalidInviteError);
    });

    it('returns staff info in response', async () => {
      const account = createPendingAccount();
      await userAccountRepository.save(account);

      const result = await useCase.execute({
        inviteToken: 'validInviteToken123456789012',
        password: 'SecurePassword123!',
      });

      expect(result.staffId).toBe('STAFF-001');
      expect(result.email).toBe('sarah@school.uk');
    });
  });
});

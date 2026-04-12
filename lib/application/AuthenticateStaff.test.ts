import { AuthenticateStaff, InvalidCredentialsError, AccountNotActivatedError } from './AuthenticateStaff';
import { InMemoryStaffRepository } from '../domain/staff/InMemoryStaffRepository';
import { InMemoryUserAccountRepository } from '../domain/auth/InMemoryUserAccountRepository';
import { StaffMember } from '../domain/staff/StaffMember';
import { StaffId } from '../domain/staff/StaffId';
import { TenantId } from '../domain/tenant/TenantId';
import { Role } from '../domain/staff/Role';
import { StaffType } from '../domain/staff/StaffType';
import { UserAccount } from '../domain/auth/UserAccount';
import { UserAccountId } from '../domain/auth/UserAccountId';

describe('AuthenticateStaff', () => {
  let staffRepository: InMemoryStaffRepository;
  let userAccountRepository: InMemoryUserAccountRepository;
  let useCase: AuthenticateStaff;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');

  const createStaff = (id: string, email: string, roles: Role[] = [Role.Teacher]) => {
    return StaffMember.create({
      id: StaffId.create(id),
      schoolId: tenantId,
      name: 'Sarah Williams',
      email,
      staffType: StaffType.Teaching,
      roles,
    });
  };

  const createActivatedAccount = (staffId: string, email: string, passwordHash: string) => {
    return UserAccount.create({
      id: UserAccountId.generate(),
      staffId: StaffId.create(staffId),
      tenantId,
      email,
      createdAt: now,
    }).setPassword(passwordHash);
  };

  const createInactiveAccount = (staffId: string, email: string) => {
    return UserAccount.create({
      id: UserAccountId.generate(),
      staffId: StaffId.create(staffId),
      tenantId,
      email,
      inviteToken: 'pending-invite',
      inviteExpiresAt: new Date('2026-04-19T10:00:00Z'),
      createdAt: now,
    });
  };

  // Mock password verification - in real impl, this would use bcrypt
  const mockVerifyPassword = jest.fn();

  beforeEach(() => {
    staffRepository = new InMemoryStaffRepository();
    userAccountRepository = new InMemoryUserAccountRepository();
    mockVerifyPassword.mockReset();
    useCase = new AuthenticateStaff(
      staffRepository,
      userAccountRepository,
      mockVerifyPassword,
      () => now
    );
  });

  describe('execute', () => {
    it('returns staff info for valid credentials', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk', [Role.Teacher, Role.GatsbyLead]);
      await staffRepository.save(staff);

      const account = createActivatedAccount('STAFF-001', 'sarah@school.uk', 'hashed-password');
      await userAccountRepository.save(account);

      mockVerifyPassword.mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'sarah@school.uk',
        password: 'correct-password',
      });

      expect(result.accountId).toBe(account.id.toString());
      expect(result.staffId).toBe('STAFF-001');
      expect(result.email).toBe('sarah@school.uk');
      expect(result.name).toBe('Sarah Williams');
      expect(result.tenantId).toBe('TENANT-ARNFIELD');
      expect(result.roles).toEqual([Role.Teacher, Role.GatsbyLead]);

      expect(mockVerifyPassword).toHaveBeenCalledWith('correct-password', 'hashed-password');
    });

    it('throws InvalidCredentialsError for wrong password', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      const account = createActivatedAccount('STAFF-001', 'sarah@school.uk', 'hashed-password');
      await userAccountRepository.save(account);

      mockVerifyPassword.mockResolvedValue(false);

      await expect(
        useCase.execute({
          email: 'sarah@school.uk',
          password: 'wrong-password',
        })
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('throws InvalidCredentialsError for unknown email', async () => {
      await expect(
        useCase.execute({
          email: 'unknown@school.uk',
          password: 'any-password',
        })
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('throws AccountNotActivatedError if no password set', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      const account = createInactiveAccount('STAFF-001', 'sarah@school.uk');
      await userAccountRepository.save(account);

      await expect(
        useCase.execute({
          email: 'sarah@school.uk',
          password: 'any-password',
        })
      ).rejects.toThrow(AccountNotActivatedError);
    });

    it('records login timestamp on success', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      const account = createActivatedAccount('STAFF-001', 'sarah@school.uk', 'hashed-password');
      await userAccountRepository.save(account);

      mockVerifyPassword.mockResolvedValue(true);

      await useCase.execute({
        email: 'sarah@school.uk',
        password: 'correct-password',
      });

      const updatedAccount = await userAccountRepository.findByEmail('sarah@school.uk');
      expect(updatedAccount!.lastLoginAt).toEqual(now);
    });

    it('is case insensitive for email lookup', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      const account = createActivatedAccount('STAFF-001', 'sarah@school.uk', 'hashed-password');
      await userAccountRepository.save(account);

      mockVerifyPassword.mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'SARAH@SCHOOL.UK',
        password: 'correct-password',
      });

      expect(result.email).toBe('sarah@school.uk');
    });
  });
});

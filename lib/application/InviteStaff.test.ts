import { InviteStaff, StaffNotFoundError, StaffAlreadyHasAccountError } from './InviteStaff';
import { InMemoryStaffRepository } from '../domain/staff/InMemoryStaffRepository';
import { InMemoryUserAccountRepository } from '../domain/auth/InMemoryUserAccountRepository';
import { StaffMember } from '../domain/staff/StaffMember';
import { StaffId } from '../domain/staff/StaffId';
import { TenantId } from '../domain/tenant/TenantId';
import { Role } from '../domain/staff/Role';
import { StaffType } from '../domain/staff/StaffType';
import { UserAccount } from '../domain/auth/UserAccount';
import { UserAccountId } from '../domain/auth/UserAccountId';

describe('InviteStaff', () => {
  let staffRepository: InMemoryStaffRepository;
  let userAccountRepository: InMemoryUserAccountRepository;
  let useCase: InviteStaff;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');

  const createStaff = (id: string, email: string) => {
    return StaffMember.create({
      id: StaffId.create(id),
      schoolId: tenantId,
      name: 'Sarah Williams',
      email,
      staffType: StaffType.Teaching,
      roles: [Role.Teacher],
    });
  };

  beforeEach(() => {
    staffRepository = new InMemoryStaffRepository();
    userAccountRepository = new InMemoryUserAccountRepository();
    useCase = new InviteStaff(staffRepository, userAccountRepository, () => now);
  });

  describe('execute', () => {
    it('creates user account with invite token for valid staff', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      const result = await useCase.execute({
        staffId: 'STAFF-001',
      });

      expect(result.inviteToken).toBeDefined();
      expect(result.inviteToken.length).toBeGreaterThan(0);

      const account = await userAccountRepository.findByStaffId(staff.id);
      expect(account).not.toBeNull();
      expect(account!.email).toBe('sarah@school.uk');
      expect(account!.inviteToken).toBe(result.inviteToken);
    });

    it('throws StaffNotFoundError for non-existent staff', async () => {
      await expect(
        useCase.execute({
          staffId: 'STAFF-NOTFOUND',
        })
      ).rejects.toThrow(StaffNotFoundError);
    });

    it('throws StaffAlreadyHasAccountError if account exists', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      const existingAccount = UserAccount.create({
        id: UserAccountId.generate(),
        staffId: staff.id,
        tenantId,
        email: 'sarah@school.uk',
        createdAt: now,
      });
      await userAccountRepository.save(existingAccount);

      await expect(
        useCase.execute({
          staffId: 'STAFF-001',
        })
      ).rejects.toThrow(StaffAlreadyHasAccountError);
    });

    it('sets invite expiry to 7 days from now', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      await useCase.execute({
        staffId: 'STAFF-001',
      });

      const account = await userAccountRepository.findByStaffId(staff.id);
      expect(account!.inviteExpiresAt).toBeDefined();

      const expectedExpiry = new Date('2026-04-19T10:00:00Z'); // 7 days from now
      expect(account!.inviteExpiresAt).toEqual(expectedExpiry);
    });

    it('generates unique invite token', async () => {
      const staff1 = createStaff('STAFF-001', 'sarah@school.uk');
      const staff2 = createStaff('STAFF-002', 'john@school.uk');
      await staffRepository.save(staff1);
      await staffRepository.save(staff2);

      const result1 = await useCase.execute({ staffId: 'STAFF-001' });
      const result2 = await useCase.execute({ staffId: 'STAFF-002' });

      expect(result1.inviteToken).not.toBe(result2.inviteToken);
    });

    it('account is not activated until setup complete', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      await useCase.execute({
        staffId: 'STAFF-001',
      });

      const account = await userAccountRepository.findByStaffId(staff.id);
      expect(account!.isActivated).toBe(false);
      expect(account!.canLoginWithPassword).toBe(false);
      expect(account!.canLoginWithAzureAd).toBe(false);
    });

    it('invite token can be found via repository', async () => {
      const staff = createStaff('STAFF-001', 'sarah@school.uk');
      await staffRepository.save(staff);

      const result = await useCase.execute({
        staffId: 'STAFF-001',
      });

      const account = await userAccountRepository.findByInviteToken(result.inviteToken);
      expect(account).not.toBeNull();
      expect(account!.staffId.equals(staff.id)).toBe(true);
    });
  });
});

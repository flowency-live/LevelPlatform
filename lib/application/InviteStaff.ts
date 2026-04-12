import { StaffRepository } from '../domain/staff/StaffRepository';
import { UserAccountRepository } from '../domain/auth/UserAccountRepository';
import { StaffId } from '../domain/staff/StaffId';
import { UserAccount } from '../domain/auth/UserAccount';
import { UserAccountId } from '../domain/auth/UserAccountId';

export class StaffNotFoundError extends Error {
  constructor(staffId: string) {
    super(`Staff member not found: ${staffId}`);
    this.name = 'StaffNotFoundError';
  }
}

export class StaffAlreadyHasAccountError extends Error {
  constructor(staffId: string) {
    super(`Staff member already has an account: ${staffId}`);
    this.name = 'StaffAlreadyHasAccountError';
  }
}

export interface InviteStaffRequest {
  staffId: string;
}

export interface InviteStaffResponse {
  inviteToken: string;
  accountId: string;
}

const INVITE_EXPIRY_DAYS = 7;

function generateInviteToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export class InviteStaff {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly getCurrentTime: () => Date = () => new Date()
  ) {}

  async execute(request: InviteStaffRequest): Promise<InviteStaffResponse> {
    const staffId = StaffId.create(request.staffId);

    const staff = await this.staffRepository.findById(staffId);
    if (!staff) {
      throw new StaffNotFoundError(request.staffId);
    }

    const existingAccount = await this.userAccountRepository.findByStaffId(staffId);
    if (existingAccount) {
      throw new StaffAlreadyHasAccountError(request.staffId);
    }

    const now = this.getCurrentTime();
    const inviteToken = generateInviteToken();
    const inviteExpiresAt = new Date(now.getTime() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const account = UserAccount.create({
      id: UserAccountId.generate(),
      staffId,
      tenantId: staff.schoolId,
      email: staff.email,
      inviteToken,
      inviteExpiresAt,
      createdAt: now,
    });

    await this.userAccountRepository.save(account);

    return {
      inviteToken,
      accountId: account.id.toString(),
    };
  }
}

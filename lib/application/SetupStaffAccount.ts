import { UserAccountRepository } from '../domain/auth/UserAccountRepository';
import { createHash, randomBytes } from 'crypto';

export class InvalidInviteError extends Error {
  constructor(message: string = 'Invalid invite token') {
    super(message);
    this.name = 'InvalidInviteError';
  }
}

export class ExpiredInviteError extends Error {
  constructor(message: string = 'Invite token has expired') {
    super(message);
    this.name = 'ExpiredInviteError';
  }
}

export interface SetupStaffAccountRequest {
  inviteToken: string;
  password: string;
}

export interface SetupStaffAccountResponse {
  success: boolean;
  accountId: string;
  staffId: string;
  email: string;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(salt + password).digest('hex');
  return `${salt}:${hash}`;
}

export class SetupStaffAccount {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly getCurrentTime: () => Date = () => new Date()
  ) {}

  async execute(request: SetupStaffAccountRequest): Promise<SetupStaffAccountResponse> {
    const account = await this.userAccountRepository.findByInviteToken(request.inviteToken);

    if (!account) {
      throw new InvalidInviteError();
    }

    const now = this.getCurrentTime();
    if (!account.hasValidInvite(now)) {
      throw new ExpiredInviteError();
    }

    const passwordHash = hashPassword(request.password);
    const updatedAccount = account.setPassword(passwordHash);

    await this.userAccountRepository.save(updatedAccount);

    return {
      success: true,
      accountId: updatedAccount.id.toString(),
      staffId: updatedAccount.staffId.toString(),
      email: updatedAccount.email,
    };
  }
}

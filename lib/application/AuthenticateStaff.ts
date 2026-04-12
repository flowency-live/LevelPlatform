import { StaffRepository } from '../domain/staff/StaffRepository';
import { UserAccountRepository } from '../domain/auth/UserAccountRepository';
import { Role } from '../domain/staff/Role';

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class AccountNotActivatedError extends Error {
  constructor(email: string) {
    super(`Account not activated: ${email}`);
    this.name = 'AccountNotActivatedError';
  }
}

export interface AuthenticateStaffRequest {
  email: string;
  password: string;
}

export interface AuthenticateStaffResponse {
  accountId: string;
  staffId: string;
  email: string;
  name: string;
  tenantId: string;
  roles: Role[];
}

export type PasswordVerifier = (password: string, hash: string) => Promise<boolean>;

export class AuthenticateStaff {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly verifyPassword: PasswordVerifier,
    private readonly getCurrentTime: () => Date = () => new Date()
  ) {}

  async execute(request: AuthenticateStaffRequest): Promise<AuthenticateStaffResponse> {
    const normalizedEmail = request.email.toLowerCase();

    const account = await this.userAccountRepository.findByEmail(normalizedEmail);
    if (!account) {
      throw new InvalidCredentialsError();
    }

    if (!account.isActivated || !account.passwordHash) {
      throw new AccountNotActivatedError(account.email);
    }

    const isValid = await this.verifyPassword(request.password, account.passwordHash);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const staff = await this.staffRepository.findById(account.staffId);
    if (!staff) {
      throw new InvalidCredentialsError();
    }

    const now = this.getCurrentTime();
    const updatedAccount = account.recordLogin(now);
    await this.userAccountRepository.save(updatedAccount);

    return {
      accountId: account.id.toString(),
      staffId: staff.id.toString(),
      email: account.email,
      name: staff.name,
      tenantId: account.tenantId.toString(),
      roles: [...staff.roles],
    };
  }
}

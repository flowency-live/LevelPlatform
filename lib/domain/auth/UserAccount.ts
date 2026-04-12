import { UserAccountId } from './UserAccountId';
import { StaffId } from '../staff/StaffId';
import { TenantId } from '../tenant/TenantId';

export interface UserAccountProps {
  id: UserAccountId;
  staffId: StaffId;
  tenantId: TenantId;
  email: string;
  passwordHash?: string;
  azureAdId?: string;
  inviteToken?: string;
  inviteExpiresAt?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
}

export class UserAccount {
  private constructor(private readonly props: UserAccountProps) {}

  static create(props: UserAccountProps): UserAccount {
    return new UserAccount(props);
  }

  get id(): UserAccountId {
    return this.props.id;
  }

  get staffId(): StaffId {
    return this.props.staffId;
  }

  get tenantId(): TenantId {
    return this.props.tenantId;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string | undefined {
    return this.props.passwordHash;
  }

  get azureAdId(): string | undefined {
    return this.props.azureAdId;
  }

  get inviteToken(): string | undefined {
    return this.props.inviteToken;
  }

  get inviteExpiresAt(): Date | undefined {
    return this.props.inviteExpiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  get isActivated(): boolean {
    return this.canLoginWithPassword || this.canLoginWithAzureAd;
  }

  get canLoginWithPassword(): boolean {
    return this.props.passwordHash !== undefined;
  }

  get canLoginWithAzureAd(): boolean {
    return this.props.azureAdId !== undefined;
  }

  setPassword(hash: string): UserAccount {
    return new UserAccount({
      ...this.props,
      passwordHash: hash,
      inviteToken: undefined,
      inviteExpiresAt: undefined,
    });
  }

  linkAzureAd(azureAdId: string): UserAccount {
    return new UserAccount({
      ...this.props,
      azureAdId,
    });
  }

  recordLogin(at: Date): UserAccount {
    return new UserAccount({
      ...this.props,
      lastLoginAt: at,
    });
  }

  hasValidInvite(currentTime: Date): boolean {
    if (!this.props.inviteToken || !this.props.inviteExpiresAt) {
      return false;
    }
    return currentTime < this.props.inviteExpiresAt;
  }
}

import { UserAccountRepository } from './UserAccountRepository';
import { UserAccount } from './UserAccount';
import { UserAccountId } from './UserAccountId';
import { StaffId } from '../staff/StaffId';

export class InMemoryUserAccountRepository implements UserAccountRepository {
  private accounts: Map<string, UserAccount> = new Map();

  async findById(id: UserAccountId): Promise<UserAccount | null> {
    return this.accounts.get(id.toString()) ?? null;
  }

  async findByStaffId(staffId: StaffId): Promise<UserAccount | null> {
    for (const account of this.accounts.values()) {
      if (account.staffId.toString() === staffId.toString()) {
        return account;
      }
    }
    return null;
  }

  async findByEmail(email: string): Promise<UserAccount | null> {
    const normalizedEmail = email.toLowerCase();
    for (const account of this.accounts.values()) {
      if (account.email.toLowerCase() === normalizedEmail) {
        return account;
      }
    }
    return null;
  }

  async findByAzureAdId(azureAdId: string): Promise<UserAccount | null> {
    for (const account of this.accounts.values()) {
      if (account.azureAdId === azureAdId) {
        return account;
      }
    }
    return null;
  }

  async findByInviteToken(token: string): Promise<UserAccount | null> {
    for (const account of this.accounts.values()) {
      if (account.inviteToken === token) {
        return account;
      }
    }
    return null;
  }

  async save(account: UserAccount): Promise<void> {
    this.accounts.set(account.id.toString(), account);
  }
}

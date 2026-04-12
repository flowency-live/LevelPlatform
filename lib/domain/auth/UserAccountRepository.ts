import { UserAccount } from './UserAccount';
import { UserAccountId } from './UserAccountId';
import { StaffId } from '../staff/StaffId';

export interface UserAccountRepository {
  findById(id: UserAccountId): Promise<UserAccount | null>;
  findByStaffId(staffId: StaffId): Promise<UserAccount | null>;
  findByEmail(email: string): Promise<UserAccount | null>;
  findByAzureAdId(azureAdId: string): Promise<UserAccount | null>;
  findByInviteToken(token: string): Promise<UserAccount | null>;
  save(account: UserAccount): Promise<void>;
}

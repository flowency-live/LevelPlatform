import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { UserAccountRepository } from '../../domain/auth/UserAccountRepository';
import { UserAccount } from '../../domain/auth/UserAccount';
import { UserAccountId } from '../../domain/auth/UserAccountId';
import { StaffId } from '../../domain/staff/StaffId';
import { TenantId } from '../../domain/tenant/TenantId';

interface UserAccountItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  GSI3PK?: string;
  GSI3SK?: string;
  GSI4PK?: string;
  GSI4SK?: string;
  email: string;
  passwordHash?: string;
  azureAdId?: string;
  inviteToken?: string;
  inviteExpiresAt?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export class DynamoDBUserAccountRepository implements UserAccountRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async findById(id: UserAccountId): Promise<UserAccount | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        FilterExpression: 'begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `ACCOUNT#${id.toString()}`,
          ':skPrefix': 'ACCOUNT#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as UserAccountItem);
  }

  async findByStaffId(staffId: StaffId): Promise<UserAccount | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        FilterExpression: 'begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `STAFF#${staffId.toString()}`,
          ':skPrefix': 'ACCOUNT#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as UserAccountItem);
  }

  async findByEmail(email: string): Promise<UserAccount | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `EMAIL#${email}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as UserAccountItem);
  }

  async findByAzureAdId(azureAdId: string): Promise<UserAccount | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI4',
        KeyConditionExpression: 'GSI4PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `AZURE#${azureAdId}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as UserAccountItem);
  }

  async findByInviteToken(token: string): Promise<UserAccount | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI3',
        KeyConditionExpression: 'GSI3PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `INVITE#${token}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as UserAccountItem);
  }

  async save(account: UserAccount): Promise<void> {
    const item = this.toItem(account);

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  private toItem(account: UserAccount): UserAccountItem {
    const item: UserAccountItem = {
      PK: `TENANT#${account.tenantId.toString()}`,
      SK: `ACCOUNT#${account.id.toString()}`,
      GSI1PK: `STAFF#${account.staffId.toString()}`,
      GSI1SK: 'ACCOUNT',
      GSI2PK: `EMAIL#${account.email}`,
      GSI2SK: 'ACCOUNT',
      email: account.email,
      createdAt: account.createdAt.toISOString(),
    };

    if (account.passwordHash) {
      item.passwordHash = account.passwordHash;
    }

    if (account.azureAdId) {
      item.azureAdId = account.azureAdId;
      item.GSI4PK = `AZURE#${account.azureAdId}`;
      item.GSI4SK = 'ACCOUNT';
    }

    if (account.inviteToken) {
      item.inviteToken = account.inviteToken;
      item.GSI3PK = `INVITE#${account.inviteToken}`;
      item.GSI3SK = 'ACCOUNT';
    }

    if (account.inviteExpiresAt) {
      item.inviteExpiresAt = account.inviteExpiresAt.toISOString();
    }

    if (account.lastLoginAt) {
      item.lastLoginAt = account.lastLoginAt.toISOString();
    }

    return item;
  }

  private toDomain(item: UserAccountItem): UserAccount {
    const tenantId = TenantId.create(this.extractId(item.PK, 'TENANT#'));
    const accountId = UserAccountId.create(this.extractId(item.SK, 'ACCOUNT#'));
    const staffId = StaffId.create(this.extractId(item.GSI1PK, 'STAFF#'));

    let account = UserAccount.create({
      id: accountId,
      staffId,
      tenantId,
      email: item.email,
      inviteToken: item.inviteToken,
      inviteExpiresAt: item.inviteExpiresAt ? new Date(item.inviteExpiresAt) : undefined,
      createdAt: new Date(item.createdAt),
      lastLoginAt: item.lastLoginAt ? new Date(item.lastLoginAt) : undefined,
    });

    if (item.passwordHash) {
      account = account.setPassword(item.passwordHash);
    }

    if (item.azureAdId) {
      account = account.linkAzureAd(item.azureAdId);
    }

    return account;
  }

  private extractId(compositeKey: string, prefix: string): string {
    return compositeKey.replace(prefix, '');
  }
}

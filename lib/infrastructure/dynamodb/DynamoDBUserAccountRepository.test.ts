import { DynamoDBUserAccountRepository } from './DynamoDBUserAccountRepository';
import { UserAccount } from '../../domain/auth/UserAccount';
import { UserAccountId } from '../../domain/auth/UserAccountId';
import { StaffId } from '../../domain/staff/StaffId';
import { TenantId } from '../../domain/tenant/TenantId';

const mockSend = jest.fn();

const mockClient = {
  send: mockSend,
};

describe('DynamoDBUserAccountRepository', () => {
  const tableName = 'test-table';
  let repository: DynamoDBUserAccountRepository;

  const now = new Date('2026-04-12T10:00:00Z');

  const createTestAccount = (overrides: Partial<{
    id: string;
    staffId: string;
    tenantId: string;
    email: string;
    passwordHash: string;
    azureAdId: string;
    inviteToken: string;
    inviteExpiresAt: Date;
    lastLoginAt: Date;
  }> = {}): UserAccount => {
    const account = UserAccount.create({
      id: UserAccountId.create(overrides.id ?? 'ACCOUNT-ABC123'),
      staffId: StaffId.create(overrides.staffId ?? 'STAFF-TEACHER01'),
      tenantId: TenantId.create(overrides.tenantId ?? 'TENANT-ARNFIELD'),
      email: overrides.email ?? 'teacher@school.uk',
      inviteToken: overrides.inviteToken,
      inviteExpiresAt: overrides.inviteExpiresAt,
      createdAt: now,
      lastLoginAt: overrides.lastLoginAt,
    });

    let result = account;
    if (overrides.passwordHash) {
      result = result.setPassword(overrides.passwordHash);
    }
    if (overrides.azureAdId) {
      result = result.linkAzureAd(overrides.azureAdId);
    }
    return result;
  };

  beforeEach(() => {
    mockSend.mockReset();
    repository = new DynamoDBUserAccountRepository(
      mockClient as unknown as Parameters<typeof DynamoDBUserAccountRepository['prototype']['constructor']>[0],
      tableName
    );
  });

  describe('save', () => {
    it('saves account with correct PK, SK, and GSI attributes', async () => {
      const account = createTestAccount({
        passwordHash: 'hashed-password',
      });

      mockSend.mockResolvedValueOnce({});

      await repository.save(account);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Item).toEqual(expect.objectContaining({
        PK: 'TENANT#TENANT-ARNFIELD',
        SK: 'ACCOUNT#ACCOUNT-ABC123',
        GSI1PK: 'STAFF#STAFF-TEACHER01',
        GSI1SK: 'ACCOUNT',
        GSI2PK: 'EMAIL#teacher@school.uk',
        GSI2SK: 'ACCOUNT',
        email: 'teacher@school.uk',
        passwordHash: 'hashed-password',
      }));
    });

    it('includes GSI3 when invite token present', async () => {
      const account = createTestAccount({
        inviteToken: 'invite-token-123',
        inviteExpiresAt: new Date('2026-04-19T10:00:00Z'),
      });

      mockSend.mockResolvedValueOnce({});

      await repository.save(account);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.Item.GSI3PK).toBe('INVITE#invite-token-123');
      expect(command.input.Item.GSI3SK).toBe('ACCOUNT');
      expect(command.input.Item.inviteToken).toBe('invite-token-123');
    });

    it('includes GSI4 when Azure AD linked', async () => {
      const account = createTestAccount({
        azureAdId: 'azure-id-123',
      });

      mockSend.mockResolvedValueOnce({});

      await repository.save(account);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.Item.GSI4PK).toBe('AZURE#azure-id-123');
      expect(command.input.Item.GSI4SK).toBe('ACCOUNT');
      expect(command.input.Item.azureAdId).toBe('azure-id-123');
    });
  });

  describe('findById', () => {
    it('returns account when found via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-ARNFIELD',
          SK: 'ACCOUNT#ACCOUNT-ABC123',
          GSI1PK: 'STAFF#STAFF-TEACHER01',
          GSI1SK: 'ACCOUNT',
          GSI2PK: 'EMAIL#teacher@school.uk',
          GSI2SK: 'ACCOUNT',
          email: 'teacher@school.uk',
          passwordHash: 'hashed-password',
          createdAt: '2026-04-12T10:00:00.000Z',
        }],
      });

      const result = await repository.findById(UserAccountId.create('ACCOUNT-ABC123'));

      expect(result).not.toBeNull();
      expect(result?.id.toString()).toBe('ACCOUNT-ABC123');
      expect(result?.staffId.toString()).toBe('STAFF-TEACHER01');
      expect(result?.tenantId.toString()).toBe('TENANT-ARNFIELD');
      expect(result?.email).toBe('teacher@school.uk');
      expect(result?.passwordHash).toBe('hashed-password');
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findById(UserAccountId.create('ACCOUNT-NOTFOUND'));

      expect(result).toBeNull();
    });
  });

  describe('findByStaffId', () => {
    it('returns account when found via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-ARNFIELD',
          SK: 'ACCOUNT#ACCOUNT-ABC123',
          GSI1PK: 'STAFF#STAFF-TEACHER01',
          GSI1SK: 'ACCOUNT',
          GSI2PK: 'EMAIL#teacher@school.uk',
          GSI2SK: 'ACCOUNT',
          email: 'teacher@school.uk',
          createdAt: '2026-04-12T10:00:00.000Z',
        }],
      });

      const result = await repository.findByStaffId(StaffId.create('STAFF-TEACHER01'));

      expect(result).not.toBeNull();
      expect(result?.staffId.toString()).toBe('STAFF-TEACHER01');

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI1');
      expect(command.input.KeyConditionExpression).toBe('GSI1PK = :pk');
      expect(command.input.FilterExpression).toBe('begins_with(SK, :skPrefix)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'STAFF#STAFF-TEACHER01',
        ':skPrefix': 'ACCOUNT#',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByStaffId(StaffId.create('STAFF-NOTFOUND'));

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('returns account when found via GSI2', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-ARNFIELD',
          SK: 'ACCOUNT#ACCOUNT-ABC123',
          GSI1PK: 'STAFF#STAFF-TEACHER01',
          GSI1SK: 'ACCOUNT',
          GSI2PK: 'EMAIL#teacher@school.uk',
          GSI2SK: 'ACCOUNT',
          email: 'teacher@school.uk',
          createdAt: '2026-04-12T10:00:00.000Z',
        }],
      });

      const result = await repository.findByEmail('teacher@school.uk');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('teacher@school.uk');

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI2');
      expect(command.input.KeyConditionExpression).toBe('GSI2PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'EMAIL#teacher@school.uk',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByEmail('notfound@school.uk');

      expect(result).toBeNull();
    });
  });

  describe('findByInviteToken', () => {
    it('returns account when found via GSI3', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-ARNFIELD',
          SK: 'ACCOUNT#ACCOUNT-ABC123',
          GSI1PK: 'STAFF#STAFF-TEACHER01',
          GSI1SK: 'ACCOUNT',
          GSI2PK: 'EMAIL#teacher@school.uk',
          GSI2SK: 'ACCOUNT',
          GSI3PK: 'INVITE#invite-token-123',
          GSI3SK: 'ACCOUNT',
          email: 'teacher@school.uk',
          inviteToken: 'invite-token-123',
          inviteExpiresAt: '2026-04-19T10:00:00.000Z',
          createdAt: '2026-04-12T10:00:00.000Z',
        }],
      });

      const result = await repository.findByInviteToken('invite-token-123');

      expect(result).not.toBeNull();
      expect(result?.inviteToken).toBe('invite-token-123');

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI3');
      expect(command.input.KeyConditionExpression).toBe('GSI3PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'INVITE#invite-token-123',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByInviteToken('token-notfound');

      expect(result).toBeNull();
    });
  });

  describe('findByAzureAdId', () => {
    it('returns account when found via GSI4', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-ARNFIELD',
          SK: 'ACCOUNT#ACCOUNT-ABC123',
          GSI1PK: 'STAFF#STAFF-TEACHER01',
          GSI1SK: 'ACCOUNT',
          GSI2PK: 'EMAIL#teacher@school.uk',
          GSI2SK: 'ACCOUNT',
          GSI4PK: 'AZURE#azure-id-123',
          GSI4SK: 'ACCOUNT',
          email: 'teacher@school.uk',
          azureAdId: 'azure-id-123',
          createdAt: '2026-04-12T10:00:00.000Z',
        }],
      });

      const result = await repository.findByAzureAdId('azure-id-123');

      expect(result).not.toBeNull();
      expect(result?.azureAdId).toBe('azure-id-123');

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI4');
      expect(command.input.KeyConditionExpression).toBe('GSI4PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'AZURE#azure-id-123',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByAzureAdId('azure-notfound');

      expect(result).toBeNull();
    });
  });
});

import { DynamoDBStudentRepository } from './DynamoDBStudentRepository';
import { Student } from '../../domain/student/Student';
import { StudentId } from '../../domain/student/StudentId';
import { TenantId } from '../../domain/tenant/TenantId';
import { LocationId } from '../../domain/tenant/LocationId';
import { SubdivisionId } from '../../domain/tenant/SubdivisionId';
import { AccessToken } from '../../domain/auth/AccessToken';

const mockSend = jest.fn();

const mockClient = {
  send: mockSend,
};

describe('DynamoDBStudentRepository', () => {
  const tableName = 'test-table';
  let repository: DynamoDBStudentRepository;

  const createTestStudent = (overrides: Partial<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    tenantId: string;
    locationId: string;
    subdivisionId: string;
  }> = {}): Student => {
    return Student.create({
      id: StudentId.create(overrides.id ?? 'STUDENT-ABC123'),
      firstName: overrides.firstName ?? 'John',
      lastName: overrides.lastName ?? 'Doe',
      email: overrides.email ?? 'john.doe@example.com',
      tenantId: TenantId.create(overrides.tenantId ?? 'TENANT-TEST1'),
      locationId: LocationId.create(overrides.locationId ?? 'LOC-EAST'),
      subdivisionId: SubdivisionId.create(overrides.subdivisionId ?? 'SUB-YEAR10'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });
  };

  beforeEach(() => {
    mockSend.mockReset();
    repository = new DynamoDBStudentRepository(mockClient as any, tableName);
  });

  describe('save', () => {
    it('saves a student with correct PK, SK, and GSI attributes', async () => {
      const student = createTestStudent();

      mockSend.mockResolvedValueOnce({});

      await repository.save(student);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Item).toEqual(expect.objectContaining({
        PK: 'TENANT#TENANT-TEST1',
        SK: 'STUDENT#STUDENT-ABC123',
        GSI1PK: 'STUDENT#STUDENT-ABC123',
        GSI1SK: 'METADATA',
        GSI2PK: 'LOC#LOC-EAST',
        GSI2SK: 'STUDENT#STUDENT-ABC123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        subdivisionId: 'SUB-YEAR10',
      }));
    });
  });

  describe('findById', () => {
    it('returns student when found via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-TEST1',
          SK: 'STUDENT#STUDENT-ABC123',
          GSI1PK: 'STUDENT#STUDENT-ABC123',
          GSI1SK: 'METADATA',
          GSI2PK: 'LOC#LOC-EAST',
          GSI2SK: 'STUDENT#STUDENT-ABC123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          subdivisionId: 'SUB-YEAR10',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }],
      });

      const result = await repository.findById(StudentId.create('STUDENT-ABC123'));

      expect(result).not.toBeNull();
      expect(result?.id.toString()).toBe('STUDENT-ABC123');
      expect(result?.firstName).toBe('John');
      expect(result?.lastName).toBe('Doe');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.IndexName).toBe('GSI1');
      expect(command.input.KeyConditionExpression).toBe('GSI1PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'STUDENT#STUDENT-ABC123',
      });
    });

    it('returns null when student not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findById(StudentId.create('STUDENT-NOTFOUND'));

      expect(result).toBeNull();
    });
  });

  describe('findByTenantId', () => {
    it('returns all students for a tenant', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'TENANT#TENANT-TEST1',
            SK: 'STUDENT#STUDENT-ABC123',
            GSI1PK: 'STUDENT#STUDENT-ABC123',
            GSI1SK: 'METADATA',
            GSI2PK: 'LOC#LOC-EAST',
            GSI2SK: 'STUDENT#STUDENT-ABC123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            subdivisionId: 'SUB-YEAR10',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          {
            PK: 'TENANT#TENANT-TEST1',
            SK: 'STUDENT#STUDENT-DEF456',
            GSI1PK: 'STUDENT#STUDENT-DEF456',
            GSI1SK: 'METADATA',
            GSI2PK: 'LOC#LOC-WEST',
            GSI2SK: 'STUDENT#STUDENT-DEF456',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            subdivisionId: 'SUB-YEAR11',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByTenantId(TenantId.create('TENANT-TEST1'));

      expect(result).toHaveLength(2);
      expect(result[0].firstName).toBe('John');
      expect(result[1].firstName).toBe('Jane');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'TENANT#TENANT-TEST1',
        ':skPrefix': 'STUDENT#',
      });
    });

    it('returns empty array when no students found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByTenantId(TenantId.create('TENANT-EMPTY'));

      expect(result).toEqual([]);
    });
  });

  describe('findByLocationId', () => {
    it('returns all students for a location via GSI2', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'TENANT#TENANT-TEST1',
            SK: 'STUDENT#STUDENT-ABC123',
            GSI1PK: 'STUDENT#STUDENT-ABC123',
            GSI1SK: 'METADATA',
            GSI2PK: 'LOC#LOC-EAST',
            GSI2SK: 'STUDENT#STUDENT-ABC123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            subdivisionId: 'SUB-YEAR10',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByLocationId(LocationId.create('LOC-EAST'));

      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.IndexName).toBe('GSI2');
      expect(command.input.KeyConditionExpression).toBe('GSI2PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'LOC#LOC-EAST',
      });
    });

    it('returns empty array when no students found at location', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByLocationId(LocationId.create('LOC-EMPTY'));

      expect(result).toEqual([]);
    });
  });

  describe('findByAccessToken', () => {
    it('returns student when found via GSI3 (access token)', async () => {
      const token = AccessToken.create('xK9mP2vL8nQ4wR7tAb3cDe6f');

      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-TEST1',
          SK: 'STUDENT#STUDENT-ABC123',
          GSI1PK: 'STUDENT#STUDENT-ABC123',
          GSI1SK: 'METADATA',
          GSI2PK: 'LOC#LOC-EAST',
          GSI2SK: 'STUDENT#STUDENT-ABC123',
          GSI3PK: 'TOKEN#xK9mP2vL8nQ4wR7tAb3cDe6f',
          GSI3SK: 'STUDENT#STUDENT-ABC123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          subdivisionId: 'SUB-YEAR10',
          accessToken: 'xK9mP2vL8nQ4wR7tAb3cDe6f',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }],
      });

      const result = await repository.findByAccessToken(token);

      expect(result).not.toBeNull();
      expect(result?.id.toString()).toBe('STUDENT-ABC123');
      expect(result?.accessToken?.toString()).toBe('xK9mP2vL8nQ4wR7tAb3cDe6f');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.IndexName).toBe('GSI3');
      expect(command.input.KeyConditionExpression).toBe('GSI3PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'TOKEN#xK9mP2vL8nQ4wR7tAb3cDe6f',
      });
    });

    it('returns null when token not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const token = AccessToken.create('nonExistentToken12345678');
      const result = await repository.findByAccessToken(token);

      expect(result).toBeNull();
    });
  });
});

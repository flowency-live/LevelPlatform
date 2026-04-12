import { DynamoDBStaffRepository } from './DynamoDBStaffRepository';
import { StaffMember } from '../../domain/staff/StaffMember';
import { StaffId } from '../../domain/staff/StaffId';
import { TenantId } from '../../domain/tenant/TenantId';
import { Role } from '../../domain/staff/Role';
import { StaffType } from '../../domain/staff/StaffType';

const mockSend = jest.fn();

const mockClient = {
  send: mockSend,
};

describe('DynamoDBStaffRepository', () => {
  const tableName = 'test-table';
  let repository: DynamoDBStaffRepository;

  const createTestStaff = (overrides: Partial<{
    id: string;
    schoolId: string;
    name: string;
    email: string;
    staffType: StaffType;
    roles: Role[];
  }> = {}): StaffMember => {
    return StaffMember.create({
      id: StaffId.create(overrides.id ?? 'STAFF-ABC123'),
      schoolId: TenantId.create(overrides.schoolId ?? 'TENANT-TEST1'),
      name: overrides.name ?? 'John Smith',
      email: overrides.email ?? 'john.smith@school.example.com',
      staffType: overrides.staffType ?? StaffType.Teaching,
      roles: overrides.roles ?? [Role.Teacher],
    });
  };

  beforeEach(() => {
    mockSend.mockReset();
    repository = new DynamoDBStaffRepository(mockClient as unknown as Parameters<typeof DynamoDBStaffRepository['prototype']['constructor']>[0], tableName);
  });

  describe('save', () => {
    it('saves staff member with correct PK, SK, and GSI attributes', async () => {
      const staff = createTestStaff({
        roles: [Role.Teacher, Role.GatsbyLead],
      });

      mockSend.mockResolvedValueOnce({});

      await repository.save(staff);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Item).toEqual(expect.objectContaining({
        PK: 'TENANT#TENANT-TEST1',
        SK: 'STAFF#STAFF-ABC123',
        GSI1PK: 'STAFF#STAFF-ABC123',
        GSI1SK: 'METADATA',
        name: 'John Smith',
        email: 'john.smith@school.example.com',
        staffType: 'teaching',
        roles: ['teacher', 'gatsby-lead'],
      }));
    });
  });

  describe('findById', () => {
    it('returns staff member when found via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'TENANT#TENANT-TEST1',
          SK: 'STAFF#STAFF-ABC123',
          GSI1PK: 'STAFF#STAFF-ABC123',
          GSI1SK: 'METADATA',
          name: 'John Smith',
          email: 'john.smith@school.example.com',
          staffType: 'teaching',
          roles: ['teacher', 'gatsby-lead'],
        }],
      });

      const result = await repository.findById(StaffId.create('STAFF-ABC123'));

      expect(result).not.toBeNull();
      expect(result?.id.toString()).toBe('STAFF-ABC123');
      expect(result?.name).toBe('John Smith');
      expect(result?.roles).toEqual([Role.Teacher, Role.GatsbyLead]);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI1');
      expect(command.input.KeyConditionExpression).toBe('GSI1PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'STAFF#STAFF-ABC123',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findById(StaffId.create('STAFF-NOTFOUND'));

      expect(result).toBeNull();
    });
  });

  describe('findBySchool', () => {
    it('returns all staff for a school', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'TENANT#TENANT-TEST1',
            SK: 'STAFF#STAFF-ABC123',
            GSI1PK: 'STAFF#STAFF-ABC123',
            name: 'John Smith',
            email: 'john.smith@school.example.com',
            staffType: 'teaching',
            roles: ['teacher'],
          },
          {
            PK: 'TENANT#TENANT-TEST1',
            SK: 'STAFF#STAFF-DEF456',
            GSI1PK: 'STAFF#STAFF-DEF456',
            name: 'Jane Doe',
            email: 'jane.doe@school.example.com',
            staffType: 'care',
            roles: ['teacher', 'senior-teacher'],
          },
        ],
      });

      const result = await repository.findBySchool(TenantId.create('TENANT-TEST1'));

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Smith');
      expect(result[1].name).toBe('Jane Doe');

      const command = mockSend.mock.calls[0][0];
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'TENANT#TENANT-TEST1',
        ':skPrefix': 'STAFF#',
      });
    });

    it('returns empty array when no staff found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findBySchool(TenantId.create('TENANT-EMPTY'));

      expect(result).toEqual([]);
    });
  });

  describe('findByRole', () => {
    it('returns staff with specific role using filter', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'TENANT#TENANT-TEST1',
            SK: 'STAFF#STAFF-ABC123',
            GSI1PK: 'STAFF#STAFF-ABC123',
            name: 'Lead Teacher',
            email: 'lead@school.example.com',
            staffType: 'teaching',
            roles: ['teacher', 'gatsby-lead'],
          },
        ],
      });

      const result = await repository.findByRole(
        TenantId.create('TENANT-TEST1'),
        Role.GatsbyLead
      );

      expect(result).toHaveLength(1);
      expect(result[0].hasRole(Role.GatsbyLead)).toBe(true);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.FilterExpression).toBe('contains(roles, :role)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'TENANT#TENANT-TEST1',
        ':skPrefix': 'STAFF#',
        ':role': 'gatsby-lead',
      });
    });
  });

  describe('findByStaffType', () => {
    it('returns staff with specific staff type using filter', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'TENANT#TENANT-TEST1',
            SK: 'STAFF#STAFF-ABC123',
            GSI1PK: 'STAFF#STAFF-ABC123',
            name: 'Care Worker',
            email: 'care@school.example.com',
            staffType: 'care',
            roles: ['teacher'],
          },
        ],
      });

      const result = await repository.findByStaffType(
        TenantId.create('TENANT-TEST1'),
        StaffType.Care
      );

      expect(result).toHaveLength(1);
      expect(result[0].staffType).toBe(StaffType.Care);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.FilterExpression).toBe('staffType = :staffType');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'TENANT#TENANT-TEST1',
        ':skPrefix': 'STAFF#',
        ':staffType': 'care',
      });
    });
  });
});

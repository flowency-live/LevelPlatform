import { DynamoDBSchoolActivityRepository } from './DynamoDBSchoolActivityRepository';
import { SchoolActivity } from '../../domain/activity/SchoolActivity';
import { ActivityId } from '../../domain/activity/ActivityId';
import { ActivityStatus } from '../../domain/activity/ActivityStatus';
import { EvidenceRequirement } from '../../domain/activity/EvidenceRequirement';
import { EvidenceType } from '../../domain/activity/EvidenceType';
import { LocationId } from '../../domain/tenant/LocationId';
import { BenchmarkId } from '../../domain/benchmark/BenchmarkId';
import { StaffId } from '../../domain/staff/StaffId';
import { ASDANUnitId } from '../../domain/asdan/ASDANUnitId';

const mockSend = jest.fn();

const mockClient = {
  send: mockSend,
};

describe('DynamoDBSchoolActivityRepository', () => {
  const tableName = 'test-table';
  let repository: DynamoDBSchoolActivityRepository;

  const createTestActivity = (overrides: Partial<{
    id: string;
    name: string;
    description: string;
    locationId: string;
    benchmarkIds: string[];
    asdanUnitId: string;
    status: ActivityStatus;
  }> = {}): SchoolActivity => {
    return SchoolActivity.create({
      id: ActivityId.create(overrides.id ?? 'ACT-TEST01'),
      name: overrides.name ?? 'Test Activity',
      description: overrides.description ?? 'A test activity description',
      locationId: LocationId.create(overrides.locationId ?? 'LOC-EAST'),
      gatsbyBenchmarkIds: (overrides.benchmarkIds ?? ['GB1']).map(BenchmarkId.create),
      asdanUnitId: overrides.asdanUnitId ? ASDANUnitId.create(overrides.asdanUnitId) : undefined,
      evidenceRequirements: [
        EvidenceRequirement.create({
          type: EvidenceType.Photo,
          description: 'Take a photo of your work',
          mandatory: true,
        }),
      ],
      status: overrides.status ?? ActivityStatus.Draft,
      createdBy: StaffId.create('STAFF-CREATOR1'),
      createdAt: new Date('2024-01-01T10:00:00.000Z'),
      updatedAt: new Date('2024-01-01T10:00:00.000Z'),
    });
  };

  beforeEach(() => {
    mockSend.mockReset();
    repository = new DynamoDBSchoolActivityRepository(mockClient as unknown as Parameters<typeof DynamoDBSchoolActivityRepository['prototype']['constructor']>[0], tableName);
  });

  describe('save', () => {
    it('saves activity with correct PK, SK, and GSI attributes', async () => {
      const activity = createTestActivity({
        benchmarkIds: ['GB1', 'GB3'],
        asdanUnitId: 'ASDAN-COP1',
      });

      mockSend.mockResolvedValueOnce({});

      await repository.save(activity);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Item).toEqual(expect.objectContaining({
        PK: 'LOC#LOC-EAST',
        SK: 'ACTIVITY#ACT-TEST01',
        GSI1PK: 'ACTIVITY#ACT-TEST01',
        GSI1SK: 'METADATA',
        GSI2PK: 'BENCHMARK#GB1',
        GSI2SK: 'ACTIVITY#ACT-TEST01',
        name: 'Test Activity',
        description: 'A test activity description',
        status: 'draft',
        gatsbyBenchmarkIds: ['GB1', 'GB3'],
        asdanUnitId: 'ASDAN-COP1',
        createdBy: 'STAFF-CREATOR1',
      }));
    });

    it('saves activity without ASDAN unit ID when not provided', async () => {
      const activity = createTestActivity();

      mockSend.mockResolvedValueOnce({});

      await repository.save(activity);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.Item.asdanUnitId).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('returns activity when found via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'LOC#LOC-EAST',
          SK: 'ACTIVITY#ACT-TEST01',
          GSI1PK: 'ACTIVITY#ACT-TEST01',
          GSI1SK: 'METADATA',
          GSI2PK: 'BENCHMARK#GB1',
          GSI2SK: 'ACTIVITY#ACT-TEST01',
          name: 'Test Activity',
          description: 'A test activity description',
          status: 'active',
          gatsbyBenchmarkIds: ['GB1', 'GB3'],
          asdanUnitId: 'ASDAN-COP1',
          evidenceRequirements: [
            { type: 'photo', description: 'Take a photo', mandatory: true },
          ],
          createdBy: 'STAFF-CREATOR1',
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-01-01T10:00:00.000Z',
        }],
      });

      const result = await repository.findById(ActivityId.create('ACT-TEST01'));

      expect(result).not.toBeNull();
      expect(result?.id.toString()).toBe('ACT-TEST01');
      expect(result?.name).toBe('Test Activity');
      expect(result?.isActive()).toBe(true);
      expect(result?.gatsbyBenchmarkIds).toHaveLength(2);
      expect(result?.asdanUnitId?.toString()).toBe('ASDAN-COP1');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI1');
      expect(command.input.KeyConditionExpression).toBe('GSI1PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'ACTIVITY#ACT-TEST01',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findById(ActivityId.create('ACT-NOTFOUND'));

      expect(result).toBeNull();
    });
  });

  describe('findByLocation', () => {
    it('returns all activities for a location', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'LOC#LOC-EAST',
            SK: 'ACTIVITY#ACT-TEST01',
            GSI1PK: 'ACTIVITY#ACT-TEST01',
            name: 'Activity 1',
            description: 'First activity',
            status: 'active',
            gatsbyBenchmarkIds: ['GB1'],
            evidenceRequirements: [],
            createdBy: 'STAFF-CREATOR1',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
          {
            PK: 'LOC#LOC-EAST',
            SK: 'ACTIVITY#ACT-TEST02',
            GSI1PK: 'ACTIVITY#ACT-TEST02',
            name: 'Activity 2',
            description: 'Second activity',
            status: 'draft',
            gatsbyBenchmarkIds: ['GB2'],
            evidenceRequirements: [],
            createdBy: 'STAFF-CREATOR1',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByLocation(LocationId.create('LOC-EAST'));

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Activity 1');
      expect(result[1].name).toBe('Activity 2');

      const command = mockSend.mock.calls[0][0];
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'LOC#LOC-EAST',
        ':skPrefix': 'ACTIVITY#',
      });
    });

    it('returns empty array when no activities found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByLocation(LocationId.create('LOC-EMPTY'));

      expect(result).toEqual([]);
    });
  });

  describe('findByLocationAndStatus', () => {
    it('returns activities with specific status using filter', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'LOC#LOC-EAST',
            SK: 'ACTIVITY#ACT-TEST01',
            GSI1PK: 'ACTIVITY#ACT-TEST01',
            name: 'Active Activity',
            description: 'An active activity',
            status: 'active',
            gatsbyBenchmarkIds: ['GB1'],
            evidenceRequirements: [],
            createdBy: 'STAFF-CREATOR1',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByLocationAndStatus(
        LocationId.create('LOC-EAST'),
        ActivityStatus.Active
      );

      expect(result).toHaveLength(1);
      expect(result[0].isActive()).toBe(true);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.FilterExpression).toBe('#status = :status');
      expect(command.input.ExpressionAttributeNames).toEqual({
        '#status': 'status',
      });
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'LOC#LOC-EAST',
        ':skPrefix': 'ACTIVITY#',
        ':status': 'active',
      });
    });
  });

  describe('findByBenchmark', () => {
    it('returns activities for a benchmark via GSI2', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'LOC#LOC-EAST',
            SK: 'ACTIVITY#ACT-TEST01',
            GSI2PK: 'BENCHMARK#GB1',
            GSI2SK: 'ACTIVITY#ACT-TEST01',
            name: 'Benchmark 1 Activity',
            description: 'Activity for benchmark 1',
            status: 'active',
            gatsbyBenchmarkIds: ['GB1', 'GB2'],
            evidenceRequirements: [],
            createdBy: 'STAFF-CREATOR1',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByBenchmark(BenchmarkId.create('GB1'));

      expect(result).toHaveLength(1);
      expect(result[0].hasBenchmark(BenchmarkId.create('GB1'))).toBe(true);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI2');
      expect(command.input.KeyConditionExpression).toBe('GSI2PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'BENCHMARK#GB1',
      });
    });
  });
});

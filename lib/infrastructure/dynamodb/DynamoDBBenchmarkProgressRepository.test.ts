import { DynamoDBBenchmarkProgressRepository } from './DynamoDBBenchmarkProgressRepository';
import { BenchmarkProgress } from '../../domain/benchmark/BenchmarkProgress';
import { BenchmarkId } from '../../domain/benchmark/BenchmarkId';
import { BenchmarkActivityId } from '../../domain/benchmark/BenchmarkActivityId';
import { StudentId } from '../../domain/student/StudentId';

const mockSend = jest.fn();

const mockClient = {
  send: mockSend,
};

describe('DynamoDBBenchmarkProgressRepository', () => {
  const tableName = 'test-table';
  let repository: DynamoDBBenchmarkProgressRepository;

  const createTestProgress = (overrides: Partial<{
    studentId: string;
    benchmarkId: string;
    completedActivityIds: string[];
    totalActivities: number;
  }> = {}): BenchmarkProgress => {
    const completedActivities = (overrides.completedActivityIds ?? ['GB1-01']).map(id => ({
      activityId: BenchmarkActivityId.create(id),
      completedAt: new Date('2024-01-15'),
    }));

    return BenchmarkProgress.create({
      studentId: StudentId.create(overrides.studentId ?? 'STUDENT-ABC123'),
      benchmarkId: BenchmarkId.create(overrides.benchmarkId ?? 'GB1'),
      completedActivities,
      totalActivities: overrides.totalActivities ?? 5,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    });
  };

  beforeEach(() => {
    mockSend.mockReset();
    repository = new DynamoDBBenchmarkProgressRepository(mockClient as any, tableName);
  });

  describe('save', () => {
    it('saves benchmark progress with correct PK, SK, and attributes', async () => {
      const progress = createTestProgress();

      mockSend.mockResolvedValueOnce({});

      await repository.save(progress);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Item).toEqual(expect.objectContaining({
        PK: 'STUDENT#STUDENT-ABC123',
        SK: 'BENCHMARK#GB1',
        GSI1PK: 'BENCHMARK#GB1',
        GSI1SK: 'STUDENT#STUDENT-ABC123',
        totalActivities: 5,
      }));
      expect(command.input.Item.completedActivities).toHaveLength(1);
    });
  });

  describe('findByStudentAndBenchmark', () => {
    it('returns progress when found', async () => {
      mockSend.mockResolvedValueOnce({
        Item: {
          PK: 'STUDENT#STUDENT-ABC123',
          SK: 'BENCHMARK#GB1',
          GSI1PK: 'BENCHMARK#GB1',
          GSI1SK: 'STUDENT#STUDENT-ABC123',
          completedActivities: [
            { activityId: 'GB1-01', completedAt: '2024-01-15T00:00:00.000Z' },
          ],
          totalActivities: 5,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
        },
      });

      const result = await repository.findByStudentAndBenchmark(
        StudentId.create('STUDENT-ABC123'),
        BenchmarkId.create('GB1')
      );

      expect(result).not.toBeNull();
      expect(result?.studentId.toString()).toBe('STUDENT-ABC123');
      expect(result?.benchmarkId.toString()).toBe('GB1');
      expect(result?.completedActivities).toHaveLength(1);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Key).toEqual({
        PK: 'STUDENT#STUDENT-ABC123',
        SK: 'BENCHMARK#GB1',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({});

      const result = await repository.findByStudentAndBenchmark(
        StudentId.create('STUDENT-NOTFOUND'),
        BenchmarkId.create('GB1')
      );

      expect(result).toBeNull();
    });
  });

  describe('findByStudentId', () => {
    it('returns all benchmark progress for a student', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'BENCHMARK#GB1',
            GSI1PK: 'BENCHMARK#GB1',
            GSI1SK: 'STUDENT#STUDENT-ABC123',
            completedActivities: [{ activityId: 'GB1-01', completedAt: '2024-01-15T00:00:00.000Z' }],
            totalActivities: 5,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z',
          },
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'BENCHMARK#GB2',
            GSI1PK: 'BENCHMARK#GB2',
            GSI1SK: 'STUDENT#STUDENT-ABC123',
            completedActivities: [],
            totalActivities: 3,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByStudentId(StudentId.create('STUDENT-ABC123'));

      expect(result).toHaveLength(2);
      expect(result[0].benchmarkId.toString()).toBe('GB1');
      expect(result[1].benchmarkId.toString()).toBe('GB2');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'STUDENT#STUDENT-ABC123',
        ':skPrefix': 'BENCHMARK#',
      });
    });

    it('returns empty array when no progress found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByStudentId(StudentId.create('STUDENT-EMPTY'));

      expect(result).toEqual([]);
    });
  });

  describe('findByBenchmarkId', () => {
    it('returns all progress for a benchmark via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'BENCHMARK#GB1',
            GSI1PK: 'BENCHMARK#GB1',
            GSI1SK: 'STUDENT#STUDENT-ABC123',
            completedActivities: [{ activityId: 'GB1-01', completedAt: '2024-01-15T00:00:00.000Z' }],
            totalActivities: 5,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z',
          },
          {
            PK: 'STUDENT#STUDENT-DEF456',
            SK: 'BENCHMARK#GB1',
            GSI1PK: 'BENCHMARK#GB1',
            GSI1SK: 'STUDENT#STUDENT-DEF456',
            completedActivities: [],
            totalActivities: 5,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByBenchmarkId(BenchmarkId.create('GB1'));

      expect(result).toHaveLength(2);
      expect(result[0].studentId.toString()).toBe('STUDENT-ABC123');
      expect(result[1].studentId.toString()).toBe('STUDENT-DEF456');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.IndexName).toBe('GSI1');
      expect(command.input.KeyConditionExpression).toBe('GSI1PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'BENCHMARK#GB1',
      });
    });

    it('returns empty array when no progress found for benchmark', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByBenchmarkId(BenchmarkId.create('GB8'));

      expect(result).toEqual([]);
    });
  });
});

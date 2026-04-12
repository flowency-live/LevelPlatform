import { DynamoDBASDANProgressRepository } from './DynamoDBASDANProgressRepository';
import { ASDANProgress } from '../../domain/asdan/ASDANProgress';
import { ASDANQualificationId } from '../../domain/asdan/ASDANQualificationId';
import { ASDANUnitId } from '../../domain/asdan/ASDANUnitId';
import { StudentId } from '../../domain/student/StudentId';

const mockSend = jest.fn();

const mockClient = {
  send: mockSend,
};

describe('DynamoDBASDANProgressRepository', () => {
  const tableName = 'test-table';
  let repository: DynamoDBASDANProgressRepository;

  const createTestProgress = (overrides: Partial<{
    studentId: string;
    qualificationId: string;
    completedUnitIds: string[];
  }> = {}): ASDANProgress => {
    return ASDANProgress.create({
      studentId: StudentId.create(overrides.studentId ?? 'STUDENT-ABC123'),
      qualificationId: ASDANQualificationId.create(overrides.qualificationId ?? 'COPE-L1'),
      completedUnitIds: (overrides.completedUnitIds ?? ['ASDAN-UNIT1']).map(id => ASDANUnitId.create(id)),
      enrolledAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    });
  };

  beforeEach(() => {
    mockSend.mockReset();
    repository = new DynamoDBASDANProgressRepository(mockClient as any, tableName);
  });

  describe('save', () => {
    it('saves ASDAN progress with correct PK, SK, and attributes', async () => {
      const progress = createTestProgress();

      mockSend.mockResolvedValueOnce({});

      await repository.save(progress);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Item).toEqual(expect.objectContaining({
        PK: 'STUDENT#STUDENT-ABC123',
        SK: 'ASDAN#COPE-L1',
        GSI1PK: 'ASDAN#COPE-L1',
        GSI1SK: 'STUDENT#STUDENT-ABC123',
        completedUnitIds: ['ASDAN-UNIT1'],
      }));
    });
  });

  describe('findById', () => {
    it('returns progress when found', async () => {
      mockSend.mockResolvedValueOnce({
        Item: {
          PK: 'STUDENT#STUDENT-ABC123',
          SK: 'ASDAN#COPE-L1',
          GSI1PK: 'ASDAN#COPE-L1',
          GSI1SK: 'STUDENT#STUDENT-ABC123',
          completedUnitIds: ['ASDAN-UNIT1'],
          enrolledAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
        },
      });

      const result = await repository.findById(
        StudentId.create('STUDENT-ABC123'),
        ASDANQualificationId.create('COPE-L1')
      );

      expect(result).not.toBeNull();
      expect(result?.studentId.toString()).toBe('STUDENT-ABC123');
      expect(result?.qualificationId.toString()).toBe('COPE-L1');
      expect(result?.completedUnitIds).toHaveLength(1);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Key).toEqual({
        PK: 'STUDENT#STUDENT-ABC123',
        SK: 'ASDAN#COPE-L1',
      });
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({});

      const result = await repository.findById(
        StudentId.create('STUDENT-NOTFOUND'),
        ASDANQualificationId.create('COPE-L1')
      );

      expect(result).toBeNull();
    });
  });

  describe('findByStudent', () => {
    it('returns all ASDAN progress for a student', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'ASDAN#COPE-L1',
            GSI1PK: 'ASDAN#COPE-L1',
            GSI1SK: 'STUDENT#STUDENT-ABC123',
            completedUnitIds: ['ASDAN-UNIT1'],
            enrolledAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z',
          },
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'ASDAN#EMP-L1',
            GSI1PK: 'ASDAN#EMP-L1',
            GSI1SK: 'STUDENT#STUDENT-ABC123',
            completedUnitIds: [],
            enrolledAt: '2024-01-05T00:00:00.000Z',
            updatedAt: '2024-01-05T00:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByStudent(StudentId.create('STUDENT-ABC123'));

      expect(result).toHaveLength(2);
      expect(result[0].qualificationId.toString()).toBe('COPE-L1');
      expect(result[1].qualificationId.toString()).toBe('EMP-L1');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'STUDENT#STUDENT-ABC123',
        ':skPrefix': 'ASDAN#',
      });
    });

    it('returns empty array when no progress found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByStudent(StudentId.create('STUDENT-EMPTY'));

      expect(result).toEqual([]);
    });
  });

  describe('findByQualification', () => {
    it('returns all progress for a qualification via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'ASDAN#COPE-L1',
            GSI1PK: 'ASDAN#COPE-L1',
            GSI1SK: 'STUDENT#STUDENT-ABC123',
            completedUnitIds: ['ASDAN-UNIT1'],
            enrolledAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z',
          },
          {
            PK: 'STUDENT#STUDENT-DEF456',
            SK: 'ASDAN#COPE-L1',
            GSI1PK: 'ASDAN#COPE-L1',
            GSI1SK: 'STUDENT#STUDENT-DEF456',
            completedUnitIds: [],
            enrolledAt: '2024-01-10T00:00:00.000Z',
            updatedAt: '2024-01-10T00:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByQualification(ASDANQualificationId.create('COPE-L1'));

      expect(result).toHaveLength(2);
      expect(result[0].studentId.toString()).toBe('STUDENT-ABC123');
      expect(result[1].studentId.toString()).toBe('STUDENT-DEF456');

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.IndexName).toBe('GSI1');
      expect(command.input.KeyConditionExpression).toBe('GSI1PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'ASDAN#COPE-L1',
      });
    });

    it('returns empty array when no progress found for qualification', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findByQualification(ASDANQualificationId.create('EMP-L2'));

      expect(result).toEqual([]);
    });
  });
});

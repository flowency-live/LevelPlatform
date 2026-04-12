import { DynamoDBEvidenceRepository } from './DynamoDBEvidenceRepository';
import { EvidenceSubmission } from '../../domain/evidence/EvidenceSubmission';
import { EvidenceId } from '../../domain/evidence/EvidenceId';
import { EvidenceContent } from '../../domain/evidence/EvidenceContent';
import { EvidenceType } from '../../domain/activity/EvidenceType';
import { StudentId } from '../../domain/student/StudentId';
import { ActivityId } from '../../domain/activity/ActivityId';

const mockSend = jest.fn();

const mockClient = {
  send: mockSend,
};

describe('DynamoDBEvidenceRepository', () => {
  const tableName = 'test-table';
  let repository: DynamoDBEvidenceRepository;

  const createTestSubmission = (overrides: Partial<{
    id: string;
    studentId: string;
    activityId: string;
  }> = {}): EvidenceSubmission => {
    return EvidenceSubmission.create({
      id: EvidenceId.create(overrides.id ?? 'EVD-ABC123'),
      studentId: StudentId.create(overrides.studentId ?? 'STUDENT-ABC123'),
      activityId: ActivityId.create(overrides.activityId ?? 'ACT-TEST01'),
      content: EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://s3.example.com/photo.jpg',
        uploadedAt: new Date('2024-01-15T10:00:00.000Z'),
      }),
      submittedAt: new Date('2024-01-15T10:00:00.000Z'),
      updatedAt: new Date('2024-01-15T10:00:00.000Z'),
    });
  };

  beforeEach(() => {
    mockSend.mockReset();
    repository = new DynamoDBEvidenceRepository(mockClient as any, tableName);
  });

  describe('save', () => {
    it('saves evidence submission with correct PK, SK, and GSI attributes', async () => {
      const submission = createTestSubmission();

      mockSend.mockResolvedValueOnce({});

      await repository.save(submission);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.TableName).toBe(tableName);
      expect(command.input.Item).toEqual(expect.objectContaining({
        PK: 'STUDENT#STUDENT-ABC123',
        SK: 'EVIDENCE#EVD-ABC123',
        GSI1PK: 'EVIDENCE#EVD-ABC123',
        GSI1SK: 'METADATA',
        GSI2PK: 'STATUS#pending',
        GSI2SK: 'EVIDENCE#EVD-ABC123',
        GSI3PK: 'ACTIVITY#ACT-TEST01',
        GSI3SK: 'EVIDENCE#EVD-ABC123',
        status: 'pending',
        activityId: 'ACT-TEST01',
      }));
    });
  });

  describe('findById', () => {
    it('returns submission when found via GSI1', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{
          PK: 'STUDENT#STUDENT-ABC123',
          SK: 'EVIDENCE#EVD-ABC123',
          GSI1PK: 'EVIDENCE#EVD-ABC123',
          GSI1SK: 'METADATA',
          GSI2PK: 'STATUS#pending',
          GSI2SK: 'EVIDENCE#EVD-ABC123',
          GSI3PK: 'ACTIVITY#ACT-TEST01',
          GSI3SK: 'EVIDENCE#EVD-ABC123',
          activityId: 'ACT-TEST01',
          status: 'pending',
          contentType: 'photo',
          contentUrl: 'https://s3.example.com/photo.jpg',
          contentUploadedAt: '2024-01-15T10:00:00.000Z',
          submittedAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z',
        }],
      });

      const result = await repository.findById(EvidenceId.create('EVD-ABC123'));

      expect(result).not.toBeNull();
      expect(result?.id.toString()).toBe('EVD-ABC123');
      expect(result?.studentId.toString()).toBe('STUDENT-ABC123');
      expect(result?.isPending()).toBe(true);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI1');
      expect(command.input.KeyConditionExpression).toBe('GSI1PK = :pk');
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValueOnce({ Items: [] });

      const result = await repository.findById(EvidenceId.create('EVD-NOTFOUND'));

      expect(result).toBeNull();
    });
  });

  describe('findByStudent', () => {
    it('returns all evidence for a student', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'EVIDENCE#EVD-ABC123',
            GSI1PK: 'EVIDENCE#EVD-ABC123',
            activityId: 'ACT-TEST01',
            status: 'pending',
            contentType: 'photo',
            contentUrl: 'https://s3.example.com/photo.jpg',
            contentUploadedAt: '2024-01-15T10:00:00.000Z',
            submittedAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z',
          },
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'EVIDENCE#EVD-DEF456',
            GSI1PK: 'EVIDENCE#EVD-DEF456',
            activityId: 'ACT-TEST02',
            status: 'approved',
            contentType: 'document',
            contentUrl: 'https://s3.example.com/doc.pdf',
            contentUploadedAt: '2024-01-14T10:00:00.000Z',
            submittedAt: '2024-01-14T10:00:00.000Z',
            updatedAt: '2024-01-15T12:00:00.000Z',
            reviewStatus: 'approved',
            reviewedBy: 'STAFF-TEACHER1',
            reviewedAt: '2024-01-15T12:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByStudent(StudentId.create('STUDENT-ABC123'));

      expect(result).toHaveLength(2);
      expect(result[0].id.toString()).toBe('EVD-ABC123');
      expect(result[1].id.toString()).toBe('EVD-DEF456');

      const command = mockSend.mock.calls[0][0];
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'STUDENT#STUDENT-ABC123',
        ':skPrefix': 'EVIDENCE#',
      });
    });
  });

  describe('findByActivity', () => {
    it('returns all evidence for an activity via GSI3', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'EVIDENCE#EVD-ABC123',
            GSI3PK: 'ACTIVITY#ACT-TEST01',
            activityId: 'ACT-TEST01',
            status: 'pending',
            contentType: 'photo',
            contentUrl: 'https://s3.example.com/photo.jpg',
            contentUploadedAt: '2024-01-15T10:00:00.000Z',
            submittedAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByActivity(ActivityId.create('ACT-TEST01'));

      expect(result).toHaveLength(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI3');
      expect(command.input.KeyConditionExpression).toBe('GSI3PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'ACTIVITY#ACT-TEST01',
      });
    });
  });

  describe('findByStudentAndActivity', () => {
    it('returns evidence for student and activity', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'EVIDENCE#EVD-ABC123',
            activityId: 'ACT-TEST01',
            status: 'pending',
            contentType: 'photo',
            contentUrl: 'https://s3.example.com/photo.jpg',
            contentUploadedAt: '2024-01-15T10:00:00.000Z',
            submittedAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z',
          },
        ],
      });

      const result = await repository.findByStudentAndActivity(
        StudentId.create('STUDENT-ABC123'),
        ActivityId.create('ACT-TEST01')
      );

      expect(result).toHaveLength(1);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.KeyConditionExpression).toBe('PK = :pk AND begins_with(SK, :skPrefix)');
      expect(command.input.FilterExpression).toBe('activityId = :activityId');
    });
  });

  describe('findPending', () => {
    it('returns all pending evidence via GSI2', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            PK: 'STUDENT#STUDENT-ABC123',
            SK: 'EVIDENCE#EVD-ABC123',
            GSI2PK: 'STATUS#pending',
            activityId: 'ACT-TEST01',
            status: 'pending',
            contentType: 'photo',
            contentUrl: 'https://s3.example.com/photo.jpg',
            contentUploadedAt: '2024-01-15T10:00:00.000Z',
            submittedAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z',
          },
        ],
      });

      const result = await repository.findPending();

      expect(result).toHaveLength(1);
      expect(result[0].isPending()).toBe(true);

      const command = mockSend.mock.calls[0][0];
      expect(command.input.IndexName).toBe('GSI2');
      expect(command.input.KeyConditionExpression).toBe('GSI2PK = :pk');
      expect(command.input.ExpressionAttributeValues).toEqual({
        ':pk': 'STATUS#pending',
      });
    });
  });
});

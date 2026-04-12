import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { EvidenceRepository } from '../../domain/evidence/EvidenceRepository';
import { EvidenceSubmission } from '../../domain/evidence/EvidenceSubmission';
import { EvidenceId } from '../../domain/evidence/EvidenceId';
import { EvidenceContent } from '../../domain/evidence/EvidenceContent';
import { EvidenceType } from '../../domain/activity/EvidenceType';
import { SubmissionStatus } from '../../domain/evidence/SubmissionStatus';
import { ReviewOutcome } from '../../domain/evidence/ReviewOutcome';
import { StudentId } from '../../domain/student/StudentId';
import { ActivityId } from '../../domain/activity/ActivityId';
import { StaffId } from '../../domain/staff/StaffId';

interface EvidenceItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  GSI3PK: string;
  GSI3SK: string;
  activityId: string;
  status: string;
  contentType: string;
  contentUrl: string;
  contentUploadedAt: string;
  submittedAt: string;
  updatedAt: string;
  reviewStatus?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewFeedback?: string;
}

export class DynamoDBEvidenceRepository implements EvidenceRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async findById(id: EvidenceId): Promise<EvidenceSubmission | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `EVIDENCE#${id.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as EvidenceItem);
  }

  async findByStudent(studentId: StudentId): Promise<EvidenceSubmission[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `STUDENT#${studentId.toString()}`,
          ':skPrefix': 'EVIDENCE#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as EvidenceItem));
  }

  async findByActivity(activityId: ActivityId): Promise<EvidenceSubmission[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI3',
        KeyConditionExpression: 'GSI3PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `ACTIVITY#${activityId.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as EvidenceItem));
  }

  async findByStudentAndActivity(
    studentId: StudentId,
    activityId: ActivityId
  ): Promise<EvidenceSubmission[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: 'activityId = :activityId',
        ExpressionAttributeValues: {
          ':pk': `STUDENT#${studentId.toString()}`,
          ':skPrefix': 'EVIDENCE#',
          ':activityId': activityId.toString(),
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as EvidenceItem));
  }

  async findPending(): Promise<EvidenceSubmission[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: {
          ':pk': 'STATUS#pending',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as EvidenceItem));
  }

  async save(submission: EvidenceSubmission): Promise<void> {
    const item = this.toItem(submission);

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  private toItem(submission: EvidenceSubmission): EvidenceItem {
    const item: EvidenceItem = {
      PK: `STUDENT#${submission.studentId.toString()}`,
      SK: `EVIDENCE#${submission.id.toString()}`,
      GSI1PK: `EVIDENCE#${submission.id.toString()}`,
      GSI1SK: 'METADATA',
      GSI2PK: `STATUS#${submission.status}`,
      GSI2SK: `EVIDENCE#${submission.id.toString()}`,
      GSI3PK: `ACTIVITY#${submission.activityId.toString()}`,
      GSI3SK: `EVIDENCE#${submission.id.toString()}`,
      activityId: submission.activityId.toString(),
      status: submission.status,
      contentType: submission.content.type,
      contentUrl: submission.content.url,
      contentUploadedAt: submission.content.uploadedAt.toISOString(),
      submittedAt: submission.submittedAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
    };

    if (submission.review) {
      item.reviewStatus = submission.review.status;
      item.reviewedBy = submission.review.reviewedBy.toString();
      item.reviewedAt = submission.review.reviewedAt.toISOString();
      if (submission.review.feedback) {
        item.reviewFeedback = submission.review.feedback;
      }
    }

    return item;
  }

  private toDomain(item: EvidenceItem): EvidenceSubmission {
    const studentId = StudentId.create(this.extractId(item.PK, 'STUDENT#'));
    const evidenceId = EvidenceId.create(this.extractId(item.SK, 'EVIDENCE#'));
    const activityId = ActivityId.create(item.activityId);

    const content = EvidenceContent.create({
      type: item.contentType as EvidenceType,
      url: item.contentUrl,
      uploadedAt: new Date(item.contentUploadedAt),
    });

    // Create a pending submission first
    const submission = EvidenceSubmission.create({
      id: evidenceId,
      studentId,
      activityId,
      content,
      submittedAt: new Date(item.submittedAt),
      updatedAt: new Date(item.updatedAt),
    });

    // Apply review if present
    if (item.reviewStatus && item.reviewedBy && item.reviewedAt) {
      const staffId = StaffId.create(item.reviewedBy);
      const reviewedAt = new Date(item.reviewedAt);

      if (item.reviewStatus === SubmissionStatus.Approved) {
        return submission.approve(staffId, reviewedAt, item.reviewFeedback);
      } else if (item.reviewStatus === SubmissionStatus.Rejected) {
        return submission.reject(staffId, reviewedAt, item.reviewFeedback ?? '');
      }
    }

    return submission;
  }

  private extractId(compositeKey: string, prefix: string): string {
    return compositeKey.replace(prefix, '');
  }
}

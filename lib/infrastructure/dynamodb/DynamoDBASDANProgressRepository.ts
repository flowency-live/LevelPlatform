import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ASDANProgress } from '../../domain/asdan/ASDANProgress';
import { ASDANProgressRepository } from '../../domain/asdan/ASDANProgressRepository';
import { ASDANQualificationId } from '../../domain/asdan/ASDANQualificationId';
import { ASDANUnitId } from '../../domain/asdan/ASDANUnitId';
import { StudentId } from '../../domain/student/StudentId';

interface ASDANProgressItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  completedUnitIds: string[];
  enrolledAt: string;
  updatedAt: string;
}

function extractId(prefixedId: string): string {
  const parts = prefixedId.split('#');
  return parts[parts.length - 1];
}

function toItem(progress: ASDANProgress): ASDANProgressItem {
  return {
    PK: `STUDENT#${progress.studentId.toString()}`,
    SK: `ASDAN#${progress.qualificationId.toString()}`,
    GSI1PK: `ASDAN#${progress.qualificationId.toString()}`,
    GSI1SK: `STUDENT#${progress.studentId.toString()}`,
    completedUnitIds: progress.completedUnitIds.map(id => id.toString()),
    enrolledAt: progress.enrolledAt.toISOString(),
    updatedAt: progress.updatedAt.toISOString(),
  };
}

function toDomain(item: ASDANProgressItem): ASDANProgress {
  return ASDANProgress.create({
    studentId: StudentId.create(extractId(item.PK)),
    qualificationId: ASDANQualificationId.create(extractId(item.SK)),
    completedUnitIds: item.completedUnitIds.map(id => ASDANUnitId.create(id)),
    enrolledAt: new Date(item.enrolledAt),
    updatedAt: new Date(item.updatedAt),
  });
}

export class DynamoDBASDANProgressRepository implements ASDANProgressRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async findById(
    studentId: StudentId,
    qualificationId: ASDANQualificationId
  ): Promise<ASDANProgress | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `STUDENT#${studentId.toString()}`,
          SK: `ASDAN#${qualificationId.toString()}`,
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return toDomain(result.Item as ASDANProgressItem);
  }

  async findByStudent(studentId: StudentId): Promise<ASDANProgress[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `STUDENT#${studentId.toString()}`,
          ':skPrefix': 'ASDAN#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map(item => toDomain(item as ASDANProgressItem));
  }

  async findByQualification(qualificationId: ASDANQualificationId): Promise<ASDANProgress[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `ASDAN#${qualificationId.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map(item => toDomain(item as ASDANProgressItem));
  }

  async save(progress: ASDANProgress): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: toItem(progress),
      })
    );
  }
}

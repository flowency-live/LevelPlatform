import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { BenchmarkProgress, CompletedActivity } from '../../domain/benchmark/BenchmarkProgress';
import { BenchmarkProgressRepository } from '../../domain/benchmark/BenchmarkProgressRepository';
import { BenchmarkId } from '../../domain/benchmark/BenchmarkId';
import { BenchmarkActivityId } from '../../domain/benchmark/BenchmarkActivityId';
import { StudentId } from '../../domain/student/StudentId';

interface CompletedActivityItem {
  activityId: string;
  completedAt: string;
}

interface BenchmarkProgressItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  completedActivities: CompletedActivityItem[];
  totalActivities: number;
  createdAt: string;
  updatedAt: string;
}

function extractId(prefixedId: string): string {
  const parts = prefixedId.split('#');
  return parts[parts.length - 1];
}

function toItem(progress: BenchmarkProgress): BenchmarkProgressItem {
  return {
    PK: `STUDENT#${progress.studentId.toString()}`,
    SK: `BENCHMARK#${progress.benchmarkId.toString()}`,
    GSI1PK: `BENCHMARK#${progress.benchmarkId.toString()}`,
    GSI1SK: `STUDENT#${progress.studentId.toString()}`,
    completedActivities: progress.completedActivities.map(ca => ({
      activityId: ca.activityId.toString(),
      completedAt: ca.completedAt.toISOString(),
    })),
    totalActivities: progress.totalActivities,
    createdAt: progress.createdAt.toISOString(),
    updatedAt: progress.updatedAt.toISOString(),
  };
}

function toDomain(item: BenchmarkProgressItem): BenchmarkProgress {
  const completedActivities: CompletedActivity[] = item.completedActivities.map(ca => ({
    activityId: BenchmarkActivityId.create(ca.activityId),
    completedAt: new Date(ca.completedAt),
  }));

  return BenchmarkProgress.create({
    studentId: StudentId.create(extractId(item.PK)),
    benchmarkId: BenchmarkId.create(extractId(item.SK)),
    completedActivities,
    totalActivities: item.totalActivities,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  });
}

export class DynamoDBBenchmarkProgressRepository implements BenchmarkProgressRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async findByStudentAndBenchmark(
    studentId: StudentId,
    benchmarkId: BenchmarkId
  ): Promise<BenchmarkProgress | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `STUDENT#${studentId.toString()}`,
          SK: `BENCHMARK#${benchmarkId.toString()}`,
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return toDomain(result.Item as BenchmarkProgressItem);
  }

  async findByStudentId(studentId: StudentId): Promise<BenchmarkProgress[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `STUDENT#${studentId.toString()}`,
          ':skPrefix': 'BENCHMARK#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map(item => toDomain(item as BenchmarkProgressItem));
  }

  async findByBenchmarkId(benchmarkId: BenchmarkId): Promise<BenchmarkProgress[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `BENCHMARK#${benchmarkId.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map(item => toDomain(item as BenchmarkProgressItem));
  }

  async save(progress: BenchmarkProgress): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: toItem(progress),
      })
    );
  }
}

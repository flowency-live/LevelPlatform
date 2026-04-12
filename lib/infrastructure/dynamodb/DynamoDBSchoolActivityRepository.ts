import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { SchoolActivityRepository } from '../../domain/activity/SchoolActivityRepository';
import { SchoolActivity } from '../../domain/activity/SchoolActivity';
import { ActivityId } from '../../domain/activity/ActivityId';
import { ActivityStatus } from '../../domain/activity/ActivityStatus';
import { EvidenceRequirement } from '../../domain/activity/EvidenceRequirement';
import { EvidenceType } from '../../domain/activity/EvidenceType';
import { LocationId } from '../../domain/tenant/LocationId';
import { BenchmarkId } from '../../domain/benchmark/BenchmarkId';
import { StaffId } from '../../domain/staff/StaffId';
import { ASDANUnitId } from '../../domain/asdan/ASDANUnitId';

interface EvidenceRequirementItem {
  type: string;
  description: string;
  mandatory: boolean;
}

interface SchoolActivityItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  name: string;
  description: string;
  status: string;
  gatsbyBenchmarkIds: string[];
  asdanUnitId?: string;
  evidenceRequirements: EvidenceRequirementItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export class DynamoDBSchoolActivityRepository implements SchoolActivityRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async findById(id: ActivityId): Promise<SchoolActivity | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `ACTIVITY#${id.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as SchoolActivityItem);
  }

  async findByLocation(locationId: LocationId): Promise<SchoolActivity[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `LOC#${locationId.toString()}`,
          ':skPrefix': 'ACTIVITY#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as SchoolActivityItem));
  }

  async findByLocationAndStatus(
    locationId: LocationId,
    status: ActivityStatus
  ): Promise<SchoolActivity[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':pk': `LOC#${locationId.toString()}`,
          ':skPrefix': 'ACTIVITY#',
          ':status': status,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as SchoolActivityItem));
  }

  async findByBenchmark(benchmarkId: BenchmarkId): Promise<SchoolActivity[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `BENCHMARK#${benchmarkId.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as SchoolActivityItem));
  }

  async save(activity: SchoolActivity): Promise<void> {
    const item = this.toItem(activity);

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  private toItem(activity: SchoolActivity): SchoolActivityItem {
    const primaryBenchmarkId = activity.gatsbyBenchmarkIds[0];

    const item: SchoolActivityItem = {
      PK: `LOC#${activity.locationId.toString()}`,
      SK: `ACTIVITY#${activity.id.toString()}`,
      GSI1PK: `ACTIVITY#${activity.id.toString()}`,
      GSI1SK: 'METADATA',
      GSI2PK: `BENCHMARK#${primaryBenchmarkId.toString()}`,
      GSI2SK: `ACTIVITY#${activity.id.toString()}`,
      name: activity.name,
      description: activity.description,
      status: activity.status,
      gatsbyBenchmarkIds: activity.gatsbyBenchmarkIds.map((id) => id.toString()),
      evidenceRequirements: activity.evidenceRequirements.map((req) => ({
        type: req.type,
        description: req.description,
        mandatory: req.mandatory,
      })),
      createdBy: activity.createdBy.toString(),
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString(),
    };

    if (activity.asdanUnitId) {
      item.asdanUnitId = activity.asdanUnitId.toString();
    }

    return item;
  }

  private toDomain(item: SchoolActivityItem): SchoolActivity {
    const locationId = LocationId.create(this.extractId(item.PK, 'LOC#'));
    const activityId = ActivityId.create(this.extractId(item.SK, 'ACTIVITY#'));

    return SchoolActivity.create({
      id: activityId,
      name: item.name,
      description: item.description,
      locationId,
      gatsbyBenchmarkIds: item.gatsbyBenchmarkIds.map((id) => BenchmarkId.create(id)),
      asdanUnitId: item.asdanUnitId ? ASDANUnitId.create(item.asdanUnitId) : undefined,
      evidenceRequirements: item.evidenceRequirements.map((req) =>
        EvidenceRequirement.create({
          type: req.type as EvidenceType,
          description: req.description,
          mandatory: req.mandatory,
        })
      ),
      status: item.status as ActivityStatus,
      createdBy: StaffId.create(item.createdBy),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    });
  }

  private extractId(compositeKey: string, prefix: string): string {
    return compositeKey.replace(prefix, '');
  }
}

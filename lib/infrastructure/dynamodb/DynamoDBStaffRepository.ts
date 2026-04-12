import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { StaffRepository } from '../../domain/staff/StaffRepository';
import { StaffMember } from '../../domain/staff/StaffMember';
import { StaffId } from '../../domain/staff/StaffId';
import { TenantId } from '../../domain/tenant/TenantId';
import { Role } from '../../domain/staff/Role';
import { StaffType } from '../../domain/staff/StaffType';

interface StaffItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  name: string;
  email: string;
  staffType: string;
  roles: string[];
}

export class DynamoDBStaffRepository implements StaffRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async findById(id: StaffId): Promise<StaffMember | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `STAFF#${id.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toDomain(result.Items[0] as StaffItem);
  }

  async findBySchool(schoolId: TenantId): Promise<StaffMember[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `TENANT#${schoolId.toString()}`,
          ':skPrefix': 'STAFF#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as StaffItem));
  }

  async findByRole(schoolId: TenantId, role: Role): Promise<StaffMember[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: 'contains(roles, :role)',
        ExpressionAttributeValues: {
          ':pk': `TENANT#${schoolId.toString()}`,
          ':skPrefix': 'STAFF#',
          ':role': role,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as StaffItem));
  }

  async findByStaffType(schoolId: TenantId, staffType: StaffType): Promise<StaffMember[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: 'staffType = :staffType',
        ExpressionAttributeValues: {
          ':pk': `TENANT#${schoolId.toString()}`,
          ':skPrefix': 'STAFF#',
          ':staffType': staffType,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => this.toDomain(item as StaffItem));
  }

  async save(member: StaffMember): Promise<void> {
    const item = this.toItem(member);

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  private toItem(member: StaffMember): StaffItem {
    return {
      PK: `TENANT#${member.schoolId.toString()}`,
      SK: `STAFF#${member.id.toString()}`,
      GSI1PK: `STAFF#${member.id.toString()}`,
      GSI1SK: 'METADATA',
      name: member.name,
      email: member.email,
      staffType: member.staffType,
      roles: [...member.roles],
    };
  }

  private toDomain(item: StaffItem): StaffMember {
    const schoolId = TenantId.create(this.extractId(item.PK, 'TENANT#'));
    const staffId = StaffId.create(this.extractId(item.SK, 'STAFF#'));

    return StaffMember.create({
      id: staffId,
      schoolId,
      name: item.name,
      email: item.email,
      staffType: item.staffType as StaffType,
      roles: item.roles as Role[],
    });
  }

  private extractId(compositeKey: string, prefix: string): string {
    return compositeKey.replace(prefix, '');
  }
}

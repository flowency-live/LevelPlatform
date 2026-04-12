import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Student } from '../../domain/student/Student';
import { StudentId } from '../../domain/student/StudentId';
import { StudentRepository } from '../../domain/student/StudentRepository';
import { TenantId } from '../../domain/tenant/TenantId';
import { LocationId } from '../../domain/tenant/LocationId';
import { SubdivisionId } from '../../domain/tenant/SubdivisionId';
import { AccessToken } from '../../domain/auth/AccessToken';

interface StudentItem {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  GSI3PK?: string;
  GSI3SK?: string;
  firstName: string;
  lastName: string;
  email: string;
  subdivisionId: string;
  accessToken?: string;
  accessTokenRevokedAt?: string;
  createdAt: string;
  updatedAt: string;
}

function extractId(prefixedId: string): string {
  const parts = prefixedId.split('#');
  return parts[parts.length - 1];
}

function toItem(student: Student): StudentItem {
  const item: StudentItem = {
    PK: `TENANT#${student.tenantId.toString()}`,
    SK: `STUDENT#${student.id.toString()}`,
    GSI1PK: `STUDENT#${student.id.toString()}`,
    GSI1SK: 'METADATA',
    GSI2PK: `LOC#${student.locationId.toString()}`,
    GSI2SK: `STUDENT#${student.id.toString()}`,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    subdivisionId: student.subdivisionId.toString(),
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };

  if (student.accessToken) {
    item.accessToken = student.accessToken.toString();
    item.GSI3PK = `TOKEN#${student.accessToken.toString()}`;
    item.GSI3SK = `STUDENT#${student.id.toString()}`;
  }

  if (student.accessTokenRevokedAt) {
    item.accessTokenRevokedAt = student.accessTokenRevokedAt.toISOString();
  }

  return item;
}

function toDomain(item: StudentItem): Student {
  return Student.create({
    id: StudentId.create(extractId(item.SK)),
    tenantId: TenantId.create(extractId(item.PK)),
    locationId: LocationId.create(extractId(item.GSI2PK)),
    subdivisionId: SubdivisionId.create(item.subdivisionId),
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    accessToken: item.accessToken ? AccessToken.create(item.accessToken) : undefined,
    accessTokenRevokedAt: item.accessTokenRevokedAt ? new Date(item.accessTokenRevokedAt) : undefined,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  });
}

export class DynamoDBStudentRepository implements StudentRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  async findById(id: StudentId): Promise<Student | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `STUDENT#${id.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return toDomain(result.Items[0] as StudentItem);
  }

  async findByAccessToken(token: AccessToken): Promise<Student | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI3',
        KeyConditionExpression: 'GSI3PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `TOKEN#${token.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return toDomain(result.Items[0] as StudentItem);
  }

  async save(student: Student): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: toItem(student),
      })
    );
  }

  async findByTenantId(tenantId: TenantId): Promise<Student[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `TENANT#${tenantId.toString()}`,
          ':skPrefix': 'STUDENT#',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => toDomain(item as StudentItem));
  }

  async findByLocationId(locationId: LocationId): Promise<Student[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `LOC#${locationId.toString()}`,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => toDomain(item as StudentItem));
  }
}

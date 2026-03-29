import * as cdk from 'aws-cdk-lib/core';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { SharedStack } from '../lib/shared-stack';

describe('SharedStack', () => {
  let app: cdk.App;
  let stack: SharedStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new SharedStack(app, 'TestSharedStack', {
      env: { account: '123456789012', region: 'eu-west-2' },
    });
    template = Template.fromStack(stack);
  });

  describe('DynamoDB Table', () => {
    it('creates a single-table with PK and SK', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        KeySchema: [
          { AttributeName: 'PK', KeyType: 'HASH' },
          { AttributeName: 'SK', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: Match.arrayWith([
          { AttributeName: 'PK', AttributeType: 'S' },
          { AttributeName: 'SK', AttributeType: 'S' },
        ]),
      });
    });

    it('uses PAY_PER_REQUEST billing mode', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        BillingMode: 'PAY_PER_REQUEST',
      });
    });

    it('enables point-in-time recovery', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        PointInTimeRecoverySpecification: Match.objectLike({
          PointInTimeRecoveryEnabled: true,
        }),
      });
    });

    it('creates GSI1 for location-based queries', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        GlobalSecondaryIndexes: Match.arrayWith([
          Match.objectLike({
            IndexName: 'GSI1',
            KeySchema: [
              { AttributeName: 'GSI1PK', KeyType: 'HASH' },
              { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
            ],
          }),
        ]),
      });
    });

    it('creates GSI2 for cohort-based queries', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        GlobalSecondaryIndexes: Match.arrayWith([
          Match.objectLike({
            IndexName: 'GSI2',
            KeySchema: [
              { AttributeName: 'GSI2PK', KeyType: 'HASH' },
              { AttributeName: 'GSI2SK', KeyType: 'RANGE' },
            ],
          }),
        ]),
      });
    });

    it('creates GSI3 for tenant-wide queries', () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        GlobalSecondaryIndexes: Match.arrayWith([
          Match.objectLike({
            IndexName: 'GSI3',
            KeySchema: [
              { AttributeName: 'GSI3PK', KeyType: 'HASH' },
              { AttributeName: 'GSI3SK', KeyType: 'RANGE' },
            ],
          }),
        ]),
      });
    });

    it('uses deletion protection in production', () => {
      const prodApp = new cdk.App();
      const prodStack = new SharedStack(prodApp, 'ProdSharedStack', {
        env: { account: '123456789012', region: 'eu-west-2' },
        stage: 'prod',
      });
      const prodTemplate = Template.fromStack(prodStack);

      prodTemplate.hasResourceProperties('AWS::DynamoDB::Table', {
        DeletionProtectionEnabled: true,
      });
    });
  });

  describe('S3 Evidence Bucket', () => {
    it('creates an S3 bucket for evidence uploads', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
        },
      });
    });

    it('blocks public access', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });
    });

    it('enables versioning', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: {
          Status: 'Enabled',
        },
      });
    });
  });

  describe('Stack Outputs', () => {
    it('exports the table name', () => {
      template.hasOutput('TableName', {});
    });

    it('exports the table ARN', () => {
      template.hasOutput('TableArn', {});
    });

    it('exports the bucket name', () => {
      template.hasOutput('EvidenceBucketName', {});
    });

    it('exports the bucket ARN', () => {
      template.hasOutput('EvidenceBucketArn', {});
    });
  });
});

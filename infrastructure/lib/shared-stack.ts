import * as cdk from 'aws-cdk-lib/core';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface SharedStackProps extends cdk.StackProps {
  readonly stage?: 'dev' | 'staging' | 'prod';
}

export class SharedStack extends cdk.Stack {
  public readonly table: dynamodb.Table;
  public readonly evidenceBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: SharedStackProps) {
    super(scope, id, props);

    const stage = props?.stage ?? 'dev';
    const isProd = stage === 'prod';

    this.table = new dynamodb.Table(this, 'ElevateTable', {
      tableName: `elevate-${stage}`,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      deletionProtection: isProd,
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI2',
      partitionKey: { name: 'GSI2PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI2SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI3',
      partitionKey: { name: 'GSI3PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI3SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.evidenceBucket = new s3.Bucket(this, 'EvidenceBucket', {
      bucketName: `elevate-evidence-${stage}-${this.account}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: this.table.tableName,
      description: 'DynamoDB table name',
      exportName: `elevate-${stage}-table-name`,
    });

    new cdk.CfnOutput(this, 'TableArn', {
      value: this.table.tableArn,
      description: 'DynamoDB table ARN',
      exportName: `elevate-${stage}-table-arn`,
    });

    new cdk.CfnOutput(this, 'EvidenceBucketName', {
      value: this.evidenceBucket.bucketName,
      description: 'Evidence S3 bucket name',
      exportName: `elevate-${stage}-evidence-bucket-name`,
    });

    new cdk.CfnOutput(this, 'EvidenceBucketArn', {
      value: this.evidenceBucket.bucketArn,
      description: 'Evidence S3 bucket ARN',
      exportName: `elevate-${stage}-evidence-bucket-arn`,
    });
  }
}

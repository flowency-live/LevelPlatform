import * as cdk from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface CicdStackProps extends cdk.StackProps {
  readonly githubOrg: string;
  readonly githubRepo: string;
  readonly stage?: 'dev' | 'staging' | 'prod';
}

export class CicdStack extends cdk.Stack {
  public readonly deployRole: iam.Role;

  constructor(scope: Construct, id: string, props: CicdStackProps) {
    super(scope, id, props);

    const { githubOrg, githubRepo } = props;
    const stage = props.stage ?? 'dev';

    // Import existing GitHub OIDC provider (account-level prerequisite)
    const oidcProviderArn = `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`;
    const oidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
      this,
      'GitHubOidcProvider',
      oidcProviderArn
    );

    this.deployRole = new iam.Role(this, 'GitHubActionsRole', {
      roleName: `elevate-github-actions-${stage}`,
      assumedBy: new iam.WebIdentityPrincipal(
        oidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${githubOrg}/${githubRepo}:*`,
          },
        }
      ),
      description: `GitHub Actions deploy role for Elevate ${stage}`,
      maxSessionDuration: cdk.Duration.hours(1),
    });

    const deployPolicy = new iam.Policy(this, 'DeployPolicy', {
      policyName: `elevate-deploy-policy-${stage}`,
      statements: [
        new iam.PolicyStatement({
          sid: 'CloudFormationAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            'cloudformation:CreateStack',
            'cloudformation:UpdateStack',
            'cloudformation:DeleteStack',
            'cloudformation:DescribeStacks',
            'cloudformation:DescribeStackEvents',
            'cloudformation:DescribeStackResources',
            'cloudformation:GetTemplate',
            'cloudformation:GetTemplateSummary',
            'cloudformation:ListStackResources',
            'cloudformation:ValidateTemplate',
            'cloudformation:CreateChangeSet',
            'cloudformation:DescribeChangeSet',
            'cloudformation:ExecuteChangeSet',
            'cloudformation:DeleteChangeSet',
            'cloudformation:SetStackPolicy',
          ],
          resources: [
            `arn:aws:cloudformation:${this.region}:${this.account}:stack/Elevate-*/*`,
            `arn:aws:cloudformation:${this.region}:${this.account}:stack/CDKToolkit/*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'S3AssetAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            's3:GetObject',
            's3:GetObjectVersion',
            's3:PutObject',
            's3:ListBucket',
            's3:GetBucketLocation',
            's3:GetBucketVersioning',
          ],
          resources: [
            `arn:aws:s3:::cdk-*-assets-${this.account}-${this.region}`,
            `arn:aws:s3:::cdk-*-assets-${this.account}-${this.region}/*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'S3ElevateAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            's3:CreateBucket',
            's3:DeleteBucket',
            's3:GetObject',
            's3:PutObject',
            's3:DeleteObject',
            's3:ListBucket',
            's3:GetBucketLocation',
            's3:GetBucketPolicy',
            's3:PutBucketPolicy',
            's3:DeleteBucketPolicy',
            's3:GetBucketVersioning',
            's3:PutBucketVersioning',
            's3:GetBucketPublicAccessBlock',
            's3:PutBucketPublicAccessBlock',
            's3:GetEncryptionConfiguration',
            's3:PutEncryptionConfiguration',
            's3:PutBucketTagging',
            's3:GetBucketTagging',
          ],
          resources: [
            `arn:aws:s3:::elevate-evidence-${stage}-${this.account}`,
            `arn:aws:s3:::elevate-evidence-${stage}-${this.account}/*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'DynamoDBAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            'dynamodb:CreateTable',
            'dynamodb:DeleteTable',
            'dynamodb:DescribeTable',
            'dynamodb:DescribeTimeToLive',
            'dynamodb:UpdateTable',
            'dynamodb:UpdateTimeToLive',
            'dynamodb:UpdateContinuousBackups',
            'dynamodb:DescribeContinuousBackups',
            'dynamodb:TagResource',
            'dynamodb:UntagResource',
            'dynamodb:ListTagsOfResource',
          ],
          resources: [
            `arn:aws:dynamodb:${this.region}:${this.account}:table/elevate-${stage}`,
            `arn:aws:dynamodb:${this.region}:${this.account}:table/elevate-${stage}/index/*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'IAMRoleAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:GetRole',
            'iam:CreateRole',
            'iam:DeleteRole',
            'iam:AttachRolePolicy',
            'iam:DetachRolePolicy',
            'iam:PutRolePolicy',
            'iam:DeleteRolePolicy',
            'iam:GetRolePolicy',
            'iam:PassRole',
            'iam:TagRole',
            'iam:UntagRole',
            'iam:UpdateAssumeRolePolicy',
          ],
          resources: [
            `arn:aws:iam::${this.account}:role/elevate-*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'IAMPolicyAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:CreatePolicy',
            'iam:DeletePolicy',
            'iam:GetPolicy',
            'iam:GetPolicyVersion',
            'iam:ListPolicyVersions',
            'iam:CreatePolicyVersion',
            'iam:DeletePolicyVersion',
          ],
          resources: [
            `arn:aws:iam::${this.account}:policy/elevate-*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'CDKAssumeRole',
          effect: iam.Effect.ALLOW,
          actions: ['sts:AssumeRole'],
          resources: [
            `arn:aws:iam::${this.account}:role/cdk-*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'SSMAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            'ssm:GetParameter',
            'ssm:GetParameters',
            'ssm:PutParameter',
            'ssm:DeleteParameter',
            'ssm:AddTagsToResource',
          ],
          resources: [
            `arn:aws:ssm:${this.region}:${this.account}:parameter/elevate/${stage}/*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'LambdaAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            'lambda:CreateFunction',
            'lambda:DeleteFunction',
            'lambda:UpdateFunctionCode',
            'lambda:UpdateFunctionConfiguration',
            'lambda:GetFunction',
            'lambda:GetFunctionConfiguration',
            'lambda:PublishVersion',
            'lambda:CreateAlias',
            'lambda:UpdateAlias',
            'lambda:DeleteAlias',
            'lambda:AddPermission',
            'lambda:RemovePermission',
            'lambda:TagResource',
            'lambda:UntagResource',
            'lambda:ListTags',
            'lambda:InvokeFunction',
          ],
          resources: [
            `arn:aws:lambda:${this.region}:${this.account}:function:elevate-${stage}-*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'CloudWatchLogsAccess',
          effect: iam.Effect.ALLOW,
          actions: [
            'logs:CreateLogGroup',
            'logs:DeleteLogGroup',
            'logs:DescribeLogGroups',
            'logs:PutRetentionPolicy',
            'logs:TagLogGroup',
            'logs:UntagLogGroup',
          ],
          resources: [
            `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/elevate-${stage}-*`,
          ],
        }),
      ],
    });

    this.deployRole.attachInlinePolicy(deployPolicy);

    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: this.deployRole.roleArn,
      description: 'ARN of the GitHub Actions deploy role',
      exportName: `elevate-${stage}-github-role-arn`,
    });
  }
}

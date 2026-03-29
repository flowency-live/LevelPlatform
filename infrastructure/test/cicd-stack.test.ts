import * as cdk from 'aws-cdk-lib/core';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CicdStack } from '../lib/cicd-stack';

const OIDC_ARN = 'arn:aws:iam::771551874768:oidc-provider/token.actions.githubusercontent.com';

describe('CicdStack', () => {
  let app: cdk.App;
  let stack: CicdStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new CicdStack(app, 'TestCicdStack', {
      env: { account: '771551874768', region: 'eu-west-2' },
      githubOrg: 'flowency-live',
      githubRepo: 'LevelPlatform',
    });
    template = Template.fromStack(stack);
  });

  describe('GitHub Actions Deploy Role', () => {
    it('creates an IAM role for GitHub Actions', () => {
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'sts:AssumeRoleWithWebIdentity',
              Effect: 'Allow',
              Principal: {
                Federated: OIDC_ARN,
              },
            }),
          ]),
        }),
      });
    });

    it('restricts role assumption to the correct repository', () => {
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Condition: Match.objectLike({
                StringLike: {
                  'token.actions.githubusercontent.com:sub': 'repo:flowency-live/LevelPlatform:*',
                },
              }),
            }),
          ]),
        }),
      });
    });

    it('grants scoped CloudFormation permissions (no wildcards)', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Sid: 'CloudFormationAccess',
              Effect: 'Allow',
              Resource: Match.arrayWith([
                Match.stringLikeRegexp('arn:aws:cloudformation:.*:stack/Elevate-\\*/\\*'),
              ]),
            }),
          ]),
        }),
      });
    });

    it('grants scoped S3 permissions for CDK assets', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Sid: 'S3AssetAccess',
              Effect: 'Allow',
            }),
          ]),
        }),
      });
    });

    it('grants scoped DynamoDB permissions', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Sid: 'DynamoDBAccess',
              Effect: 'Allow',
              Resource: Match.arrayWith([
                Match.stringLikeRegexp('arn:aws:dynamodb:.*:table/elevate-dev'),
              ]),
            }),
          ]),
        }),
      });
    });

    it('grants Lambda permissions for future development', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Sid: 'LambdaAccess',
              Effect: 'Allow',
            }),
          ]),
        }),
      });
    });

    it('grants CloudWatch Logs permissions', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Sid: 'CloudWatchLogsAccess',
              Effect: 'Allow',
            }),
          ]),
        }),
      });
    });
  });

  describe('Least Privilege Verification', () => {
    it('does not contain wildcard cloudformation:* action', () => {
      const templateJson = template.toJSON();
      const policies = Object.values(templateJson.Resources).filter(
        (r: unknown) => (r as { Type: string }).Type === 'AWS::IAM::Policy'
      );

      policies.forEach((policy: unknown) => {
        const statements = (policy as { Properties: { PolicyDocument: { Statement: unknown[] } } })
          .Properties.PolicyDocument.Statement;
        statements.forEach((stmt: unknown) => {
          const action = (stmt as { Action: string | string[] }).Action;
          if (typeof action === 'string') {
            expect(action).not.toBe('cloudformation:*');
            expect(action).not.toBe('s3:*');
            expect(action).not.toBe('dynamodb:*');
          }
        });
      });
    });

    it('does not contain resource wildcards except where necessary', () => {
      const templateJson = template.toJSON();
      const policies = Object.values(templateJson.Resources).filter(
        (r: unknown) => (r as { Type: string }).Type === 'AWS::IAM::Policy'
      );

      policies.forEach((policy: unknown) => {
        const statements = (policy as { Properties: { PolicyDocument: { Statement: unknown[] } } })
          .Properties.PolicyDocument.Statement;
        statements.forEach((stmt: unknown) => {
          const resource = (stmt as { Resource: string | string[] }).Resource;
          if (typeof resource === 'string') {
            expect(resource).not.toBe('*');
          }
        });
      });
    });
  });

  describe('Stack Outputs', () => {
    it('exports the deploy role ARN', () => {
      template.hasOutput('GitHubActionsRoleArn', {});
    });
  });
});

#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { SharedStack } from '../lib/shared-stack';
import { CicdStack } from '../lib/cicd-stack';

const app = new cdk.App();

const stage = (app.node.tryGetContext('stage') as 'dev' | 'staging' | 'prod') ?? 'dev';

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;

if (!account) {
  throw new Error(
    'CDK_DEFAULT_ACCOUNT environment variable is required. ' +
    'Run: export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)'
  );
}

if (!region) {
  throw new Error(
    'CDK_DEFAULT_REGION environment variable is required. ' +
    'Run: export CDK_DEFAULT_REGION=eu-west-2'
  );
}

const env = { account, region };

const commonTags = {
  Project: 'Elevate',
  Stage: stage,
  ManagedBy: 'CDK',
};

new SharedStack(app, `Elevate-Shared-${stage}`, {
  env,
  stage,
  description: `Elevate shared resources (DynamoDB, S3) - ${stage}`,
  tags: commonTags,
});

new CicdStack(app, `Elevate-CICD-${stage}`, {
  env,
  stage,
  githubOrg: 'flowency-live',
  githubRepo: 'LevelPlatform',
  description: `Elevate CI/CD resources (deploy role) - ${stage}`,
  tags: commonTags,
});

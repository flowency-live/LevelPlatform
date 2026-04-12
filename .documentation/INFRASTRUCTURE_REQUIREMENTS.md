# Infrastructure for LevelPlatform

## Current Status

| Component | Status | Details |
|-----------|--------|---------|
| CDK Stacks | **DEPLOYED** | Production ready |
| DynamoDB Table | **DEPLOYED** | `elevate-prod` |
| S3 Evidence Bucket | **DEPLOYED** | `elevate-evidence-prod-771551874768` |
| GitHub OIDC | **DEPLOYED** | `elevate-github-actions-prod` |
| DynamoDB Adapters | **COMPLETE** | 58 tests passing |
| repositories.ts | **SWITCHED** | Using DynamoDB (not InMemory) |
| First Staff User | **CREATED** | teacher.kitty@arnfieldcare.co.uk |

---

## AWS Resources (Production)

| Resource | Value |
|----------|-------|
| DynamoDB Table | `elevate-prod` |
| S3 Bucket | `elevate-evidence-prod-771551874768` |
| GitHub Actions Role | `arn:aws:iam::771551874768:role/elevate-github-actions-prod` |
| AWS Region | `eu-west-2` |
| AWS Account | `771551874768` |

---

## Amplify Environment Variables

Set these in Amplify Console:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Yes |
| `DYNAMODB_TABLE_NAME` | `elevate-prod` | Yes |

Note: `AWS_REGION` is auto-detected by the SDK on Amplify.

---

## First Staff User

| Field | Value |
|-------|-------|
| Email | teacher.kitty@arnfieldcare.co.uk |
| Name | Kitty Teacher |
| Role | teacher |
| Staff ID | STAFF-SBELRB |
| Setup Token | `vUoZjoAruYWCoc25BATKdakrJKKqNZVC` |
| Expires | 2026-04-19 |

**Setup URL:** `https://{your-domain}/setup/vUoZjoAruYWCoc25BATKdakrJKKqNZVC`

---

## DynamoDB Adapters (Complete)

All adapters implemented in `lib/infrastructure/dynamodb/`:

| Adapter | Tests |
|---------|-------|
| DynamoDBUserAccountRepository | 13 |
| DynamoDBStaffRepository | 8 |
| DynamoDBStudentRepository | 10 |
| DynamoDBBenchmarkProgressRepository | 9 |
| DynamoDBASDANProgressRepository | 6 |
| DynamoDBEvidenceRepository | 6 |
| DynamoDBSchoolActivityRepository | 6 |

**Total:** 58 tests passing

---

## Repository Configuration

`lib/infrastructure/repositories.ts` now uses DynamoDB:

```typescript
import { docClient, tableName } from './dynamodb/client';
import { DynamoDBStudentRepository } from './dynamodb/DynamoDBStudentRepository';
import { DynamoDBBenchmarkProgressRepository } from './dynamodb/DynamoDBBenchmarkProgressRepository';
import { DynamoDBStaffRepository } from './dynamodb/DynamoDBStaffRepository';
import { DynamoDBUserAccountRepository } from './dynamodb/DynamoDBUserAccountRepository';

export const studentRepository = new DynamoDBStudentRepository(docClient, tableName);
export const progressRepository = new DynamoDBBenchmarkProgressRepository(docClient, tableName);
export const staffRepository = new DynamoDBStaffRepository(docClient, tableName);
export const userAccountRepository = new DynamoDBUserAccountRepository(docClient, tableName);
```

---

## CLI Commands

### Invite Staff (Production)

```bash
npx cross-env DYNAMODB_TABLE_NAME=elevate-prod tsx scripts/invite-staff.ts \
  --email user@example.com \
  --name "User Name" \
  --role head \
  --tenant TENANT-ARNFIELD
```

Roles: `teacher`, `senior-teacher`, `gatsby-lead`, `asdan-coordinator`, `head`

### Deploy CDK (if needed)

```bash
cd infrastructure
npm run cdk deploy Elevate-Shared-prod -- --context stage=prod --require-approval never
npm run cdk deploy Elevate-CICD-prod -- --context stage=prod --require-approval never
```

---

## DynamoDB Single-Table Design

### Key Patterns

| Entity | PK | SK | GSI1PK | GSI2PK | GSI3PK |
|--------|----|----|--------|--------|--------|
| Staff | `TENANT#{id}` | `STAFF#{id}` | `STAFF#{id}` | - | - |
| UserAccount | `TENANT#{id}` | `ACCOUNT#{id}` | `STAFF#{id}` | `EMAIL#{email}` | `INVITE#{token}` |
| Student | `TENANT#{id}` | `STUDENT#{id}` | `STUDENT#{id}` | `LOC#{locationId}` | `TOKEN#{token}` |
| BenchmarkProgress | `STUDENT#{id}` | `BENCHMARK#{id}` | `BENCHMARK#{id}` | - | - |

---

## Deployment Checklist

- [x] CDK stacks deployed (SharedStack, CICDStack)
- [x] DynamoDB table exists (`elevate-prod`)
- [x] S3 bucket exists (`elevate-evidence-prod-771551874768`)
- [x] DynamoDB adapters implemented (58 tests)
- [x] `repositories.ts` switched to DynamoDB
- [x] First staff user created (teacher.kitty@arnfieldcare.co.uk)
- [ ] Environment variables set in Amplify Console
- [ ] First login via `/setup/{token}`

---

## Architecture

```
                                    ┌─────────────────┐
                                    │  AWS Amplify    │
                                    │  (Next.js App)  │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
           ┌────────────────┐      ┌────────────────┐       ┌────────────────┐
           │   DynamoDB     │      │      S3        │       │   CloudWatch   │
           │  elevate-prod  │      │    Evidence    │       │     Logs       │
           └────────────────┘      └────────────────┘       └────────────────┘
```

---

*Last updated: 2026-04-12*

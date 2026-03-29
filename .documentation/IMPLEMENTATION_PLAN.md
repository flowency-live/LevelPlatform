# Level: My Career Plan - Implementation Plan

## Architecture: DDD + Multi-Role Lenses (Learned from AIDashQA)

### Core Principle: Same Data, Multiple Views

Like AIDashQA, Level will use **normalized data with role-based lenses**:

| Role | View | Data Access |
|------|------|-------------|
| **Student** | Own benchmark progress, activities, evidence | Self only |
| **Teacher** | Student heatmap, drill-down, bulk validation | Assigned students |
| **Management** | School-wide compliance, Ofsted reports, trends | All students |

### Route-Based Role Switching (No Auth Modal)

```
Home (/):
  ├─ Student Portal (/student)      → Student's own career plan
  ├─ Teacher Dashboard (/teacher)   → Class heatmap + drill-down
  └─ Management Dashboard (/admin)  → School-wide analytics + Ofsted
```

---

## Domain Model (DDD)

### Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────┐
│ CAREER GUIDANCE CONTEXT                                         │
│                                                                  │
│  Entities:                                                       │
│  ├─ Student (Aggregate Root)                                     │
│  ├─ BenchmarkProgress                                            │
│  ├─ Activity                                                     │
│  ├─ Evidence                                                     │
│  ├─ SMARTTarget                                                  │
│  ├─ EmployerEncounter                                            │
│  └─ TutorReview                                                  │
│                                                                  │
│  Value Objects:                                                  │
│  ├─ StudentId, BenchmarkId, ActivityId                           │
│  ├─ EvidenceType (Photo | Voice | Document)                      │
│  ├─ ProgressPercentage                                           │
│  └─ CompletionStatus                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ MULTI-TENANT CONTEXT                                             │
│                                                                  │
│  Hierarchy:                                                      │
│  Tenant (Arnfield Care)                                          │
│    └─ Organization (Arnfield Schools)                            │
│         └─ Location (East School, West School)                   │
│              └─ AcademicYear (2025-26)                           │
│                   └─ Cohort (Year 10)                            │
│                        └─ Student                                │
│                                                                  │
│  Entities:                                                       │
│  ├─ Tenant                                                       │
│  ├─ Organization                                                 │
│  ├─ Location                                                     │
│  ├─ AcademicYear                                                 │
│  ├─ Cohort                                                       │
│  └─ User (with roles)                                            │
│                                                                  │
│  Value Objects:                                                  │
│  ├─ TenantId, OrganizationId, LocationId                         │
│  ├─ Role (Student | Teacher | Admin | Management)                │
│  └─ AcademicYearPeriod                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ QUALIFICATION CONTEXT (ASDAN)                                    │
│                                                                  │
│  Entities:                                                       │
│  ├─ ASDANUnit                                                    │
│  ├─ ASDANCredit                                                  │
│  └─ CoordinatorVerification                                      │
│                                                                  │
│  Mapping:                                                        │
│  Activity → ASDANUnit (many-to-one)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model (DynamoDB Single-Table)

### Access Patterns

| Pattern | PK | SK | Use Case |
|---------|----|----|----------|
| Get student | `STUDENT#<id>` | `PROFILE` | Load student profile |
| Get benchmark progress | `STUDENT#<id>` | `BENCHMARK#<id>` | Load one benchmark |
| List all benchmarks | `STUDENT#<id>` | `BENCHMARK#` (begins_with) | Student dashboard |
| Get activity | `STUDENT#<id>` | `ACTIVITY#<id>` | Activity detail |
| List activities for benchmark | `STUDENT#<id>` | `ACTIVITY#<benchmarkId>#` | Benchmark page |
| Get evidence | `EVIDENCE#<id>` | `METADATA` | Load evidence |
| List student evidence | `STUDENT#<id>` | `EVIDENCE#` (begins_with) | Evidence gallery |
| **Teacher: List students** | `LOCATION#<id>` | `STUDENT#` (begins_with) | Heatmap |
| **Teacher: Student progress** | `STUDENT#<id>` | `BENCHMARK#` | Drill-down |
| **Admin: Location summary** | `LOCATION#<id>` | `SUMMARY#<yearId>` | School dashboard |
| **Admin: Cohort compliance** | `COHORT#<id>` | `COMPLIANCE#<benchmarkId>` | Ofsted report |

### GSI for Role-Based Queries

**GSI1: Location-based queries (Teacher/Admin view)**
- PK: `LOCATION#<locationId>`
- SK: `STUDENT#<studentId>`

**GSI2: Cohort-based queries (Year group view)**
- PK: `COHORT#<cohortId>`
- SK: `STUDENT#<studentId>`

**GSI3: Tenant-wide queries (Management view)**
- PK: `TENANT#<tenantId>`
- SK: `LOCATION#<locationId>`

---

## Three Portals (Role-Based Views)

### 1. Student Portal (`/student`)

**What they see:** Own career plan only

```
Student Dashboard
├─ Progress Overview (8 benchmark cards with %)
├─ "What's Next" prompts
├─ Recent activity feed
└─ Quick actions (add evidence, set target)

Benchmark Detail (/student/benchmark/[id])
├─ Benchmark description
├─ Activity checklist (tick + auto-date)
├─ Evidence gallery for this benchmark
└─ Reflection prompt (voice/text)

SMART Targets (/student/targets)
├─ 3 targets with progress
├─ Add new target form
└─ Target history

Employer Log (/student/employers)
├─ Encounter list
├─ Add encounter form
└─ Progress indicator (2 of 3 required)
```

### 2. Teacher Portal (`/teacher`)

**What they see:** Students in their assigned cohorts/locations

```
Teacher Dashboard
├─ Persona Switcher (if multiple roles)
├─ Student Heatmap (students × benchmarks)
│   └─ Color-coded: Green (80%+), Yellow (50-79%), Red (<50%)
├─ Low-progress alerts
└─ Pending reviews count

Student Drill-Down (/teacher/student/[id])
├─ Student profile
├─ Benchmark progress (same as student sees, read-only)
├─ Evidence gallery (can validate)
├─ Add tutor review
└─ AI Insights (on-demand)

Bulk Actions
├─ Mark attendance at careers event
├─ Validate multiple evidence items
└─ Export cohort progress
```

**Heatmap Component (from AIDashQA pattern):**

```typescript
interface HeatmapData {
  studentId: StudentId;
  studentName: string;
  benchmarks: {
    benchmarkId: BenchmarkId;
    percentComplete: number;
    status: 'complete' | 'in-progress' | 'not-started';
  }[];
}

// Color mapping:
80+ = Green (Complete/On Track)
50-79 = Yellow (In Progress)
1-49 = Orange (Needs Attention)
0 = Red (Not Started)
```

### 3. Management Portal (`/admin`)

**What they see:** School-wide and cross-location analytics

```
Management Dashboard
├─ Overview Cards
│   ├─ Total Students
│   ├─ Overall Benchmark Compliance %
│   ├─ Employer Encounters This Term
│   └─ Ofsted Readiness Score
├─ Location Comparison (if multi-site)
├─ Benchmark Compliance by Year Group
└─ At-risk students list

Drill-Down Hierarchy (from AIDashQA)
├─ Level 1: School/Organization Overview
│   └─ Click location →
├─ Level 2: Location Detail
│   └─ Click cohort →
├─ Level 3: Cohort Detail
│   └─ Click student →
├─ Level 4: Student Detail
│   └─ AI Insights button →
└─ AI Analysis Panel

Ofsted Reports (/admin/reports)
├─ One-click PDF generation
├─ Benchmark compliance evidence
├─ Employer encounter summary
└─ Work experience coverage

ASDAN Summary (/admin/asdan)
├─ Credits earned by student
├─ Unit completion rates
└─ Coordinator verification queue
```

---

## Parallel Implementation Tracks

Frontend and backend can be built in parallel by sharing TypeScript interfaces.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SHARED CONTRACTS (Build First)                    │
│                                                                          │
│  lib/types/           ← TypeScript interfaces used by both tracks        │
│  ├─ student.ts        ← Student, BenchmarkProgress, Activity interfaces │
│  ├─ tenant.ts         ← TenantId, LocationId, CohortId types            │
│  └─ api.ts            ← Request/response shapes                         │
│                                                                          │
│  lib/reference-data/  ← Static data (already done)                      │
│  └─ benchmarks.ts     ← GB1-GB8 definitions ✓                           │
│                                                                          │
│  lib/mock-data/       ← Seed data for frontend development              │
│  └─ students.ts       ← 50 demo students with varied progress           │
└─────────────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           ▼                                     ▼
┌─────────────────────────┐        ┌─────────────────────────┐
│   TRACK A: BACKEND      │        │   TRACK B: FRONTEND     │
│   (This thread)         │        │   (Separate thread)     │
│                         │        │                         │
│ 1. Domain value objects │        │ 1. Mock data service    │
│    - StudentId          │        │    - InMemoryDataStore  │
│    - TenantId, etc.     │        │    - useMockData hook   │
│                         │        │                         │
│ 2. Domain entities      │        │ 2. UI Components        │
│    - Student            │        │    - BenchmarkCard      │
│    - BenchmarkProgress  │        │    - ProgressRing       │
│                         │        │    - ActivityCheckbox   │
│ 3. Repository layer     │        │                         │
│    - Interface          │        │ 3. Pages (Student view) │
│    - In-memory impl     │        │    - Dashboard          │
│    - DynamoDB impl      │        │    - Benchmark detail   │
│                         │        │                         │
│ 4. Application services │        │ 4. Pages (Teacher view) │
│    - GetStudentProgress │        │    - Heatmap            │
│    - CompleteActivity   │        │    - Drill-down         │
│                         │        │                         │
│ 5. API endpoints        │        │ 5. Pages (Admin view)   │
│    - Next.js routes     │        │    - Dashboard          │
│    - Lambda migration   │        │    - Reports            │
└─────────────────────────┘        └─────────────────────────┘
           │                                     │
           └──────────────────┬──────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        INTEGRATION POINT                                 │
│                                                                          │
│  When backend API is ready:                                             │
│  1. Replace mock data service with real API calls                       │
│  2. Frontend already uses correct types - minimal changes               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Shared Contracts (Build First - Both Tracks Need These)

| File | Purpose | Status |
|------|---------|--------|
| `lib/types/student.ts` | Student, BenchmarkProgress, Activity interfaces | TODO |
| `lib/types/tenant.ts` | TenantId, LocationId, CohortId types | TODO |
| `lib/types/api.ts` | API request/response shapes | TODO |
| `lib/reference-data/benchmarks.ts` | GB1-GB8 definitions | ✓ Done |
| `lib/mock-data/students.ts` | 50 demo students with varied progress | TODO |

---

## Track A: Backend (This Thread)

### A1. Domain Value Objects

| Task | Test File | Status |
|------|-----------|--------|
| BenchmarkId | `lib/domain/benchmark/BenchmarkId.test.ts` | ✓ Done |
| ActivityId | `lib/domain/benchmark/ActivityId.test.ts` | ✓ Done |
| StudentId | `lib/domain/student/StudentId.test.ts` | TODO |
| TenantId | `lib/domain/tenant/TenantId.test.ts` | TODO |
| LocationId | `lib/domain/tenant/LocationId.test.ts` | TODO |
| CohortId | `lib/domain/tenant/CohortId.test.ts` | TODO |

### A2. Domain Entities

| Task | Test File | Status |
|------|-----------|--------|
| Student entity | `lib/domain/student/Student.test.ts` | TODO |
| BenchmarkProgress entity | `lib/domain/benchmark/BenchmarkProgress.test.ts` | TODO |
| Activity entity | `lib/domain/benchmark/Activity.test.ts` | TODO |

### A3. Repository Layer

| Task | Test File | Status |
|------|-----------|--------|
| StudentRepository interface | `lib/domain/student/StudentRepository.ts` | TODO |
| InMemoryStudentRepository | `lib/infrastructure/InMemoryStudentRepository.test.ts` | TODO |
| DynamoDBStudentRepository | `lib/infrastructure/DynamoDBStudentRepository.test.ts` | TODO |

### A4. Application Services

| Task | Test File | Status |
|------|-----------|--------|
| GetStudentProgress | `lib/application/GetStudentProgress.test.ts` | TODO |
| CompleteActivity | `lib/application/CompleteActivity.test.ts` | TODO |
| GetBenchmarkHeatmap | `lib/application/GetBenchmarkHeatmap.test.ts` | TODO |

### A5. API Endpoints

| Task | Test File | Status |
|------|-----------|--------|
| GET /api/student/progress | `app/api/student/progress/route.test.ts` | TODO |
| POST /api/student/activity | `app/api/student/activity/route.test.ts` | TODO |
| GET /api/teacher/heatmap | `app/api/teacher/heatmap/route.test.ts` | TODO |

---

## Track B: Frontend (Separate Thread)

### B1. Mock Data Service

| Task | File | Status |
|------|------|--------|
| Mock data store | `lib/mock-data/store.ts` | TODO |
| Seed students (50) | `lib/mock-data/students.ts` | TODO |
| useMockData hook | `lib/hooks/useMockData.ts` | TODO |

### B2. Shared Components

| Task | Test File | Status |
|------|-----------|--------|
| ProgressRing | `components/shared/ProgressRing.test.tsx` | TODO |
| BenchmarkCard | `components/benchmark/BenchmarkCard.test.tsx` | TODO |
| ActivityCheckbox | `components/benchmark/ActivityCheckbox.test.tsx` | TODO |
| Navigation | `components/shared/Navigation.test.tsx` | TODO |

### B3. Student Portal Pages

| Task | Test File | Status |
|------|-----------|--------|
| Student Dashboard | `app/(student)/page.test.tsx` | TODO |
| Benchmark Detail | `app/(student)/benchmark/[id]/page.test.tsx` | TODO |
| SMART Targets | `app/(student)/targets/page.test.tsx` | TODO |

### B4. Teacher Portal Pages

| Task | Test File | Status |
|------|-----------|--------|
| Teacher Dashboard (Heatmap) | `app/(teacher)/page.test.tsx` | TODO |
| Student Drill-down | `app/(teacher)/student/[id]/page.test.tsx` | TODO |

### B5. Admin Portal Pages

| Task | Test File | Status |
|------|-----------|--------|
| Admin Dashboard | `app/(admin)/page.test.tsx` | TODO |
| Ofsted Reports | `app/(admin)/reports/page.test.tsx` | TODO |

---

## Integration Checklist

When connecting frontend to real backend:

- [ ] Replace `useMockData` with `useSWR`/`useQuery` + real API
- [ ] Remove mock data imports
- [ ] Verify types match (should be identical)
- [ ] Test with real DynamoDB data

---

## Folder Structure

```
app/
├─ page.tsx                     # Home with role selector buttons
├─ (student)/                   # Student portal (route group)
│   ├─ layout.tsx               # Student nav
│   ├─ page.tsx                 # Student dashboard
│   ├─ benchmark/
│   │   └─ [id]/page.tsx        # Benchmark detail
│   ├─ targets/page.tsx         # SMART targets
│   └─ employers/page.tsx       # Employer log
├─ (teacher)/                   # Teacher portal
│   ├─ layout.tsx               # Teacher nav + persona switcher
│   ├─ page.tsx                 # Heatmap dashboard
│   ├─ student/
│   │   └─ [id]/page.tsx        # Student drill-down
│   └─ reviews/page.tsx         # Pending reviews
├─ (admin)/                     # Management portal
│   ├─ layout.tsx               # Admin nav
│   ├─ page.tsx                 # School dashboard
│   ├─ reports/page.tsx         # Ofsted reports
│   └─ asdan/page.tsx           # ASDAN summary
└─ api/                         # API routes
    ├─ student/
    ├─ teacher/
    └─ admin/

lib/
├─ domain/                      # DDD domain layer
│   ├─ student/
│   │   ├─ Student.ts
│   │   ├─ StudentId.ts
│   │   └─ StudentRepository.ts
│   ├─ benchmark/
│   │   ├─ BenchmarkProgress.ts
│   │   ├─ Activity.ts
│   │   └─ BenchmarkId.ts
│   ├─ tenant/
│   │   ├─ Tenant.ts
│   │   ├─ Organization.ts
│   │   └─ Location.ts
│   └─ qualification/
│       └─ ASDANUnit.ts
├─ application/                 # Use cases
│   ├─ GetStudentProgress.ts
│   ├─ CompleteActivity.ts
│   ├─ GetBenchmarkHeatmap.ts
│   └─ GetSchoolCompliance.ts
├─ infrastructure/              # External dependencies
│   ├─ InMemoryStudentRepository.ts
│   └─ DynamoDBStudentRepository.ts
└─ reference-data/              # Static reference data
    ├─ benchmarks.ts            # GB1-GB8 definitions
    └─ asdan.ts                 # ASDAN unit mappings

components/
├─ benchmark/
│   ├─ BenchmarkCard.tsx
│   ├─ ActivityCheckbox.tsx
│   └─ BenchmarkGrid.tsx
├─ teacher/
│   ├─ BenchmarkHeatmap.tsx
│   ├─ PersonaSwitcher.tsx
│   └─ StudentDrillDown.tsx
├─ admin/
│   ├─ ComplianceOverview.tsx
│   ├─ DrillDownPanel.tsx
│   └─ OfstedReport.tsx
└─ shared/
    ├─ ProgressRing.tsx
    ├─ RoleSelector.tsx
    └─ Navigation.tsx
```

---

## Demo Data (Arnfield Care)

For initial demo, seed with realistic data:

```typescript
const DEMO_TENANT = {
  id: 'TENANT-ARNFIELD',
  name: 'Arnfield Care',
  organizations: [{
    id: 'ORG-ARNFIELD-SCHOOLS',
    name: 'Arnfield Schools',
    locations: [
      { id: 'LOC-EAST', name: 'Arnfield School East', studentCount: 25 },
      { id: 'LOC-WEST', name: 'Arnfield School West', studentCount: 25 },
    ]
  }]
};

// 50 students with varied progress:
// - 10 students: 80%+ complete (green)
// - 20 students: 40-79% complete (yellow/orange)
// - 15 students: 10-39% complete (orange/red)
// - 5 students: <10% complete (red)

// This creates realistic heatmap visualization
```

---

## Key Architectural Decisions

### 1. No UI Mockups - Build Real Foundation

Instead of mocking, we build:
- Real domain entities with validation
- Real repositories (in-memory for dev, DynamoDB for prod)
- Real API routes
- Real components that consume real data

### 2. Multi-Tenant from Day 1

Every query includes tenant context. No retrofitting required.

### 3. Role-Based Data Access

API guards enforce:
- Students → own data only
- Teachers → assigned students only
- Management → organization-wide

### 4. Hierarchical Drill-Down (AIDashQA Pattern)

```
School → Location → Cohort → Student → AI Insights
```

Each level preserves navigation context (back buttons work).

### 5. Heatmap as Primary Staff View

Students × Benchmarks grid with color-coded cells. Click to drill down.

---

## Implementation Phases

### Phase 1: Infrastructure Foundation
- CDK stack setup (`infrastructure/`)
- DynamoDB single-table design
- CI/CD pipeline (GitHub Actions + OIDC)
- S3 bucket for evidence uploads

### Phase 2: Domain Foundation (DDD + TDD)
- Value objects: StudentId, BenchmarkId, TenantId, etc.
- Domain entities: Student, Activity, BenchmarkProgress, Evidence
- Reference data: GB1-GB8 definitions, ASDAN mappings

### Phase 3: Repository Layer
- Repository interfaces
- In-memory implementations (dev/test)
- DynamoDB implementations (prod)

### Phase 4: Application Services
- GetStudentProgress, CompleteActivity, AddEvidence
- GetBenchmarkHeatmap, GetSchoolCompliance
- CreateSMARTTarget

### Phase 5: API Layer
- Next.js API routes (initial)
- Lambda migration (future)

### Phase 6: UI Components
- Shared: ProgressRing, Card, Button, Navigation
- Benchmark: BenchmarkCard, ActivityCheckbox, BenchmarkGrid
- Teacher: BenchmarkHeatmap, StudentDrillDown, PersonaSwitcher
- Admin: ComplianceOverview, DrillDownPanel

### Phase 7: Pages (Three Portals)
- Home with role selector
- Student portal: Dashboard, Benchmark detail, Targets, Employers
- Teacher portal: Heatmap, Student drill-down, Reviews
- Admin portal: Dashboard, Ofsted reports, ASDAN summary

### Phase 8: Demo Data
- Arnfield Care tenant seed
- 50 students with varied progress
- Seed script for DynamoDB

---

## Progress Tracking

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| Phase 1: Infrastructure | In Progress | 26/03/2026 | - |
| Phase 2: Domain Foundation | In Progress | 26/03/2026 | - |
| Phase 3: Repository Layer | Not Started | - | - |
| Phase 4: Application Services | Not Started | - | - |
| Phase 5: API Layer | Not Started | - | - |
| Phase 6: UI Components | Not Started | - | - |
| Phase 7: Pages | Not Started | - | - |
| Phase 8: Demo Data | Not Started | - | - |

### Completed Items

**Phase 1: Infrastructure Foundation**
- [x] CDK project setup (`infrastructure/`)
- [x] SharedStack with DynamoDB single-table (3 GSIs) and S3 evidence bucket
- [x] CicdStack - per-stage deploy role with least-privilege IAM (imports existing OIDC provider)
- [x] GitHub Actions workflow (`deploy-infrastructure.yml`)
- [x] CTO Audit & Remediation (29/03/2026) - see details below
- [x] Infrastructure deployed to dev (29/03/2026)

**Phase 2: Domain Foundation**
- [x] BenchmarkId value object with tests (`lib/domain/benchmark/BenchmarkId.ts`)
- [x] ActivityId value object with tests (`lib/domain/benchmark/ActivityId.ts`)
- [x] Gatsby Benchmarks reference data with tests (`lib/reference-data/benchmarks.ts`)
- [ ] StudentId value object
- [ ] TenantId, LocationId, CohortId value objects
- [ ] Student entity
- [ ] BenchmarkProgress entity

---

## CTO Audit & Remediation (29/03/2026)

### Critical Issues Fixed

| Issue | Problem | Resolution |
|-------|---------|------------|
| C1 | Orphaned infrastructure-stack.ts | Deleted unused template files |
| C2 | Hardcoded OIDC thumbprint (outdated) | Removed thumbprint, AWS handles automatically |
| C3 | CloudFormation wildcard `*` permissions | Scoped to `Elevate-*` and `CDKToolkit` stacks |
| C4 | S3 wildcard `s3:*` permissions | Scoped to specific actions (no Delete on assets) |

### High Issues Fixed

| Issue | Problem | Resolution |
|-------|---------|------------|
| H1 | DynamoDB wildcard permissions | Scoped to specific CDK deployment actions |
| H6 | Duplicate OIDC provider per stage | Split into shared OidcProviderStack + per-stage CicdStack |
| H3 | Missing Lambda permissions | Added scoped Lambda permissions for future use |
| M6 | Missing CloudWatch Logs permissions | Added scoped log group permissions |

### Architecture (Simplified 29/03/2026)

**Prerequisite:** GitHub OIDC provider exists at account level (shared by all projects).

**Stack Architecture:**
```
Elevate-Shared-{stage}  → DynamoDB table, S3 bucket
Elevate-CICD-{stage}    → Deploy role (imports existing OIDC provider)
```

### Deployment Order

1. Ensure GitHub OIDC provider exists (account-level prerequisite)
2. `Elevate-Shared-{stage}` - Deploy per stage (DynamoDB, S3)
3. `Elevate-CICD-{stage}` - Deploy per stage (deploy role)

### Test Coverage

- Infrastructure: 24 tests passing (2 stacks)
- Domain: 44 tests passing
- Total: 68 tests

### Deployed Resources (dev)

| Resource | ARN/Name |
|----------|----------|
| DynamoDB | `elevate-dev` |
| S3 Bucket | `elevate-evidence-dev-771551874768` |
| Deploy Role | `elevate-github-actions-dev` |

---

All following TDD: test file first, then implementation.
CDK/CI/CD from the start - no manual AWS resource creation.

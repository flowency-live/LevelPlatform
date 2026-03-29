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
| `lib/types/student.ts` | Student, BenchmarkProgress, Activity interfaces | ✓ Done |
| `lib/types/tenant.ts` | TenantId, LocationId, CohortId types | ✓ Done (in student.ts) |
| `lib/types/api.ts` | API request/response shapes | TODO |
| `lib/reference-data/benchmarks.ts` | GB1-GB8 definitions | ✓ Done |
| `lib/mock-data/students.ts` | 20 demo students with varied progress (none 100%) | ✓ Done |

---

## Track A: Backend (This Thread)

### A1. Domain Value Objects ✅ COMPLETE

| Task | Test File | Status |
|------|-----------|--------|
| BenchmarkId | `lib/domain/benchmark/BenchmarkId.test.ts` | ✓ Done |
| ActivityId | `lib/domain/benchmark/ActivityId.test.ts` | ✓ Done |
| StudentId | `lib/domain/student/StudentId.test.ts` | ✓ Done |
| TenantId | `lib/domain/tenant/TenantId.test.ts` | ✓ Done |
| LocationId | `lib/domain/tenant/LocationId.test.ts` | ✓ Done |
| CohortId | `lib/domain/tenant/CohortId.test.ts` | ✓ Done |

### A2. Domain Entities ✅ COMPLETE

| Task | Test File | Status |
|------|-----------|--------|
| Student entity | `lib/domain/student/Student.test.ts` | ✓ Done |
| BenchmarkProgress entity | `lib/domain/benchmark/BenchmarkProgress.test.ts` | ✓ Done |
| Activity entity | Reference data only - no entity needed | N/A |

### A3. Repository Layer ✅ IN-MEMORY COMPLETE

| Task | Test File | Status |
|------|-----------|--------|
| StudentRepository interface | `lib/domain/student/StudentRepository.ts` | ✓ Done |
| InMemoryStudentRepository | `lib/domain/student/InMemoryStudentRepository.test.ts` | ✓ Done (9 tests) |
| BenchmarkProgressRepository interface | `lib/domain/benchmark/BenchmarkProgressRepository.ts` | ✓ Done |
| InMemoryBenchmarkProgressRepository | `lib/domain/benchmark/InMemoryBenchmarkProgressRepository.test.ts` | ✓ Done (7 tests) |
| DynamoDBStudentRepository | `lib/infrastructure/DynamoDBStudentRepository.test.ts` | TODO (Phase 4) |
| DynamoDBBenchmarkProgressRepository | `lib/infrastructure/DynamoDBBenchmarkProgressRepository.test.ts` | TODO (Phase 4) |

### A4. Application Services ✅ COMPLETE

| Task | Test File | Status |
|------|-----------|--------|
| GetStudentProgress | `lib/application/GetStudentProgress.test.ts` | ✓ Done (5 tests) |
| CompleteActivity | `lib/application/CompleteActivity.test.ts` | ✓ Done (8 tests) |
| GetBenchmarkHeatmap | `lib/application/GetBenchmarkHeatmap.test.ts` | ✓ Done (6 tests) |

### A5. API Endpoints ✅ COMPLETE (Next.js Routes)

| Task | Route | Status |
|------|-------|--------|
| GET /api/student/[id]/progress | `app/api/student/[id]/progress/route.ts` | ✓ Done |
| POST /api/student/[id]/activity | `app/api/student/[id]/activity/route.ts` | ✓ Done |
| GET /api/teacher/heatmap | `app/api/teacher/heatmap/route.ts` | ✓ Done |

### A6. AWS Lambda Handlers (Phase 4 - NOT STARTED)

| Task | File | Status |
|------|------|--------|
| DynamoDBStudentRepository | `lib/infrastructure/DynamoDBStudentRepository.ts` | TODO |
| DynamoDBBenchmarkProgressRepository | `lib/infrastructure/DynamoDBBenchmarkProgressRepository.ts` | TODO |
| Lambda handlers | `infrastructure/lib/lambdas/` | TODO |

---

## Track B: Frontend (Separate Thread)

### B1. Mock Data Service ✅ COMPLETE

| Task | File | Status |
|------|------|--------|
| Shared TypeScript interfaces | `lib/types/student.ts` | ✓ Done |
| Seed students (20) | `lib/mock-data/students.ts` | ✓ Done |
| useMockData hook | `lib/hooks/useMockData.ts` | TODO (use in components) |

### B2. Core UI Components ✅ COMPLETE

| Task | Test File | Status |
|------|-----------|--------|
| Button | `components/ui/Button.test.tsx` | ✓ Done (18 tests) |
| Input | `components/ui/Input.test.tsx` | ✓ Done (19 tests) |
| Card | `components/ui/Card.test.tsx` | ✓ Done (15 tests) |
| Checkbox | `components/ui/Checkbox.test.tsx` | ✓ Done (11 tests) |

### B2b. Domain Components ✅ COMPLETE

| Task | Test File | Status |
|------|-----------|--------|
| ProgressRing | `components/shared/ProgressRing.test.tsx` | ✓ Done (19 tests) |
| BenchmarkCard | `components/benchmark/BenchmarkCard.test.tsx` | ✓ Done (15 tests) |
| ActivityBlock | `components/benchmark/ActivityBlock.test.tsx` | ✓ Done (17 tests) |
| BottomNav | `components/shared/BottomNav.test.tsx` | ✓ Done (17 tests) |
| TopNav | `components/shared/TopNav.test.tsx` | ✓ Done (13 tests) |
| EvidenceUpload | `components/evidence/EvidenceUpload.test.tsx` | ✓ Done (14 tests) |

### B2c. Auth Pages ✅ COMPLETE

| Task | Test File | Status |
|------|-----------|--------|
| Auth redirect logic | `lib/auth/redirect.test.ts` | ✓ Done (6 tests) |
| Auth layout | `app/(auth)/layout.test.tsx` | ✓ Done (4 tests) |
| Login page | `app/(auth)/login/page.test.tsx` | ✓ Done (9 tests) |
| MFA page (staff only) | `app/(auth)/login/mfa/page.test.tsx` | TODO |

### B3. Student Portal Pages 🟡 IN PROGRESS

| Task | Test File | Status |
|------|-----------|--------|
| Student Layout | `app/(student)/layout.test.tsx` | ✓ Done (10 tests) |
| Student Dashboard | `app/(student)/page.test.tsx` | ✓ Done (11 tests) |
| Benchmark Detail | `app/(student)/benchmark/[id]/page.test.tsx` | ✓ Done (11 tests) |
| useStudentProgress hook | `lib/hooks/useStudentProgress.ts` | ✓ Done |
| SMART Targets | `app/(student)/targets/page.test.tsx` | TODO |
| Employers Page | `app/(student)/employers/page.test.tsx` | TODO |

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
      { id: 'LOC-EAST', name: 'Arnfield School East', studentCount: 10 },
      { id: 'LOC-WEST', name: 'Arnfield School West', studentCount: 10 },
    ]
  }]
};

// 20 students with varied progress (none 100% complete):
// - 5 students: 70-90% complete (green, almost there)
// - 8 students: 40-69% complete (yellow/orange)
// - 5 students: 15-39% complete (orange/red)
// - 2 students: <15% complete (red, just started)

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
- 20 students with varied progress (none 100% complete)
- Seed script for DynamoDB

---

## Progress Tracking

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| Phase 1: Infrastructure | ✅ Complete | 26/03/2026 | 29/03/2026 |
| Phase 2: Domain Foundation | ✅ Complete | 26/03/2026 | 29/03/2026 |
| Phase 3: Repository Layer (In-Memory) | ✅ Complete | 29/03/2026 | 29/03/2026 |
| Phase 4: Application Services | ✅ Complete | 29/03/2026 | 29/03/2026 |
| Phase 5: API Layer (Next.js Routes) | ✅ Complete | 29/03/2026 | 29/03/2026 |
| Phase 5b: AWS Lambda Handlers | Not Started | - | - |
| Phase 6: UI Components | ✅ Complete | 29/03/2026 | 29/03/2026 |
| Phase 7: Pages (Student) | 🟡 In Progress | 29/03/2026 | - |
| Phase 7: Pages (Teacher) | Not Started | - | - |
| Phase 7: Pages (Admin) | Not Started | - | - |
| Phase 8: Demo Data | ✅ Complete | 29/03/2026 | 29/03/2026 |

### Test Coverage Summary

| Category | Tests |
|----------|-------|
| Infrastructure (CDK) | 27 |
| Domain (value objects, entities, repos) | 81 |
| Application Services | 19 |
| Backend Total (lib/) | 138 |
| UI Components (Core) | 63 |
| Shared Components (ProgressRing, Nav, etc.) | 95 |
| Student Portal Pages | 32 |
| **Total** | **340** |

### Completed Items

**Phase 1: Infrastructure Foundation**
- [x] CDK project setup (`infrastructure/`)
- [x] SharedStack with DynamoDB single-table (3 GSIs) and S3 evidence bucket
- [x] CicdStack - per-stage deploy role with least-privilege IAM (imports existing OIDC provider)
- [x] GitHub Actions workflow (`deploy-infrastructure.yml`) with Slack notifications
- [x] CTO Audit & Remediation (29/03/2026) - see details below
- [x] Infrastructure deployed to dev (29/03/2026)

**Phase 2: Domain Foundation**
- [x] BenchmarkId value object with tests (`lib/domain/benchmark/BenchmarkId.ts`)
- [x] ActivityId value object with tests (`lib/domain/benchmark/ActivityId.ts`)
- [x] StudentId value object with tests (`lib/domain/student/StudentId.ts`)
- [x] TenantId value object with tests (`lib/domain/tenant/TenantId.ts`)
- [x] LocationId value object with tests (`lib/domain/tenant/LocationId.ts`)
- [x] CohortId value object with tests (`lib/domain/tenant/CohortId.ts`)
- [x] Student entity with timestamps (`createdAt`, `updatedAt`)
- [x] BenchmarkProgress entity with timestamps (`createdAt`, `updatedAt`, `completedAt` per activity)
- [x] Gatsby Benchmarks reference data with tests (`lib/reference-data/benchmarks.ts`)

**Phase 3: Repository Layer**
- [x] StudentRepository interface (`lib/domain/student/StudentRepository.ts`)
- [x] InMemoryStudentRepository with tests (10 tests, includes timestamp preservation)
- [x] BenchmarkProgressRepository interface (`lib/domain/benchmark/BenchmarkProgressRepository.ts`)
- [x] InMemoryBenchmarkProgressRepository with tests (8 tests, includes timestamp preservation)

**Phase 4: Application Services** ✅ COMPLETE
- [x] GetStudentProgress use case (5 tests) - `lib/application/GetStudentProgress.ts`
- [x] GetBenchmarkHeatmap use case (6 tests) - `lib/application/GetBenchmarkHeatmap.ts`
- [x] CompleteActivity use case (8 tests) - `lib/application/CompleteActivity.ts`

**Phase 5: API Layer (Next.js Routes)** ✅ COMPLETE
- [x] GET `/api/student/[id]/progress` - Get student with benchmark progress
- [x] POST `/api/student/[id]/activity` - Mark activity as complete (Zod validation)
- [x] GET `/api/teacher/heatmap` - Get heatmap data by cohortId

**Phase 8: Demo Data (Frontend Support)**
- [x] Shared TypeScript interfaces (`lib/types/student.ts`)
- [x] Mock data with 20 demo students, none 100% complete (`lib/mock-data/students.ts`)

**Phase 6: UI Components (Elevate Design System)**
- [x] Design tokens - Elevate four-layer color system (`app/globals.css`)
- [x] Tailwind config with tenant/framework/persona colors (`tailwind.config.ts`)
- [x] Source Sans 3 font integration (`app/layout.tsx`)
- [x] Button component with CVA variants (18 tests) - `components/ui/Button.tsx`
- [x] Input component with password toggle (19 tests) - `components/ui/Input.tsx`
- [x] Card component with interactive variant (15 tests) - `components/ui/Card.tsx`
- [x] Checkbox component with 44px touch target (11 tests) - `components/ui/Checkbox.tsx`

**Phase 6: Shared Components (Dashboard)** ✅ COMPLETE
- [x] ProgressRing - circular progress indicator (19 tests) - `components/shared/ProgressRing.tsx`
- [x] BenchmarkCard - benchmark summary card (15 tests) - `components/benchmark/BenchmarkCard.tsx`
- [x] ActivityBlock - checkbox activity completion (17 tests) - `components/benchmark/ActivityBlock.tsx`
- [x] BottomNav - mobile student navigation (17 tests) - `components/shared/BottomNav.tsx`
- [x] TopNav - staff horizontal navigation (13 tests) - `components/shared/TopNav.tsx`
- [x] EvidenceUpload - mocked upload UI (14 tests) - `components/evidence/EvidenceUpload.tsx`

**Phase 7: Pages (Login)**
- [x] Auth redirect logic with role-based routing (6 tests) - `lib/auth/redirect.ts`
- [x] Auth layout centered container (4 tests) - `app/(auth)/layout.tsx`
- [x] Login page with form validation (9 tests) - `app/(auth)/login/page.tsx`

**Phase 7: Pages (Student Portal)** 🟡 IN PROGRESS
- [x] Student layout with bottom nav (10 tests) - `app/(student)/layout.tsx`
- [x] Student dashboard with benchmark grid (11 tests) - `app/(student)/page.tsx`
- [x] Benchmark detail with activity list (11 tests) - `app/(student)/benchmark/[id]/page.tsx`
- [x] useStudentProgress hook - `lib/hooks/useStudentProgress.ts`
- [ ] SMARTTargetCard component - TODO
- [ ] SMART Targets page - TODO
- [ ] EmployerCard component - TODO
- [ ] Employers page - TODO

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

- Infrastructure: 27 tests passing (2 stacks)
- Domain + Application: 138 tests passing (value objects, entities, repositories, use cases)
- Core UI Components: 63 tests passing (Button, Input, Card, Checkbox)
- Auth Pages: 19 tests passing (redirect, layout, login)
- Shared Components: 95 tests passing (ProgressRing, BenchmarkCard, ActivityBlock, BottomNav, TopNav, EvidenceUpload)
- Student Portal: 32 tests passing (layout, dashboard, benchmark detail)
- **Total: 340 tests passing** (excluding 1 pre-existing broken test for missing seeded-repositories module)

### Deployed Resources (dev)

| Resource | ARN/Name |
|----------|----------|
| DynamoDB | `elevate-dev` |
| S3 Bucket | `elevate-evidence-dev-771551874768` |
| Deploy Role | `elevate-github-actions-dev` |

---

All following TDD: test file first, then implementation.
CDK/CI/CD from the start - no manual AWS resource creation.

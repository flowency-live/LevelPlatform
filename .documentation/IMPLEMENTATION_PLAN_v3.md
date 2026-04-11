# Level Platform: Implementation Plan v3

## Architecture Principles

This implementation follows the principles defined in `CLAUDE.md`:

| Principle | Application |
|-----------|-------------|
| **TDD** | Tests written BEFORE implementation. Every feature starts with a failing test. |
| **DDD** | Domain-driven design with bounded contexts, value objects, aggregates. |
| **Hexagonal** | Domain core has no infrastructure dependencies. Ports and adapters pattern. |
| **Clean Code** | Single responsibility, early returns, no comments (self-documenting). |
| **DRY** | No duplication. Extract when pattern repeats. |
| **Immutability** | No mutations. Return new objects. |
| **Type Safety** | No `any`, no `as` assertions, Zod validation at boundaries. |

---

## Current State

| Component | Status | Notes |
|-----------|--------|-------|
| Design System | Complete | HSL colors, Inter font, animations |
| Student Domain | Complete | StudentId, BenchmarkProgress |
| Benchmark Domain | Complete | BenchmarkId, ActivityId |
| Tenant Domain | Complete | TenantId, LocationId, CohortId |
| Student Portal UI | 80% | Dashboard done, needs refactor to hide Gatsby |
| Teacher Portal | Not started | - |
| Management Portal | Not started | - |
| Tests | 383 passing | Good coverage |

---

## Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────┐
│ STAFF CONTEXT                                                    │
│ StaffMember, Role, Permission                                    │
│ "Who can do what"                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ACTIVITY CONTEXT                                                 │
│ SchoolActivity, EvidenceSubmission, EvidenceReview               │
│ "What students do and how it's tracked"                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ GATSBY COMPLIANCE CONTEXT                                        │
│ GatsbyBenchmark, BenchmarkCriteria, ComplianceStatus             │
│ "School's statutory compliance tracking"                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ASDAN QUALIFICATION CONTEXT                                      │
│ ASDANUnit, ASDANQualification, ASDANProgress                     │
│ "Student's qualification tracking"                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STUDENT CAREER PLAN CONTEXT (existing, to be updated)            │
│ Student, CareerPlan, Progress                                    │
│ "What the student sees"                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Staff Domain

Build the foundation for permissions and roles.

### 1.1 Value Objects

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/staff/StaffId.ts` | `StaffId.test.ts` | Format: `STAFF-{uuid}` |
| `lib/domain/staff/Role.ts` | `Role.test.ts` | Enum: teacher, subject-lead, gatsby-lead, asdan-coordinator, head |

### 1.2 Entity

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/staff/StaffMember.ts` | `StaffMember.test.ts` | id, schoolId, name, email, roles[] |

### 1.3 Repository

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/staff/StaffRepository.ts` | Interface | findById, findBySchool, findByRole |
| `lib/domain/staff/InMemoryStaffRepository.ts` | `InMemoryStaffRepository.test.ts` | In-memory implementation |

### 1.4 Mock Data

| File | Implementation |
|------|----------------|
| `lib/mock-data/staff.ts` | Sample staff for demo school |

**Deliverables:**
- [ ] StaffId value object with validation
- [ ] Role enum with all 5 roles
- [ ] StaffMember entity with role checking
- [ ] Repository interface and in-memory implementation
- [ ] All tests passing

---

## Phase 2: Activity Domain

Activities created by Gatsby Lead, completed by students.

### 2.1 Value Objects

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/activity/ActivityId.ts` | `ActivityId.test.ts` | Format: `ACT-{uuid}` |
| `lib/domain/activity/EvidenceRequirement.ts` | `EvidenceRequirement.test.ts` | type, description, mandatory |
| `lib/domain/activity/ActivityStatus.ts` | - | Enum: draft, active, archived |

### 2.2 Entity

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/activity/SchoolActivity.ts` | `SchoolActivity.test.ts` | See PRD for fields |

### 2.3 Repository

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/activity/SchoolActivityRepository.ts` | Interface | findById, findBySchool, findByBenchmark |
| `lib/domain/activity/InMemorySchoolActivityRepository.ts` | `InMemory...test.ts` | In-memory implementation |

**Deliverables:**
- [ ] ActivityId value object
- [ ] SchoolActivity entity with Gatsby + ASDAN mapping
- [ ] Repository with filtering by benchmark
- [ ] All tests passing

---

## Phase 3: Evidence Domain

Student submissions and Gatsby Lead reviews.

### 3.1 Value Objects

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/evidence/EvidenceId.ts` | `EvidenceId.test.ts` | Format: `EVD-{uuid}` |
| `lib/domain/evidence/SubmissionStatus.ts` | - | Enum: pending, approved, rejected |

### 3.2 Entity

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/evidence/EvidenceSubmission.ts` | `EvidenceSubmission.test.ts` | studentId, activityId, content, status, review |

### 3.3 Repository

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/evidence/EvidenceRepository.ts` | Interface | findById, findByStudent, findPending |
| `lib/domain/evidence/InMemoryEvidenceRepository.ts` | `InMemory...test.ts` | In-memory implementation |

**Deliverables:**
- [ ] EvidenceId value object
- [ ] EvidenceSubmission entity with status workflow
- [ ] Repository with pending queue query
- [ ] All tests passing

---

## Phase 4: ASDAN Domain

Qualification tracking visible to students.

### 4.1 Reference Data

| File | Implementation |
|------|----------------|
| `lib/reference-data/asdan-units.ts` | All ASDAN units with metadata |
| `lib/reference-data/asdan-qualifications.ts` | CoPE, Employability, etc. |

### 4.2 Value Objects

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/asdan/ASDANUnitId.ts` | `ASDANUnitId.test.ts` | Format: `ASDAN-{code}` |

### 4.3 Entity

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/asdan/ASDANProgress.ts` | `ASDANProgress.test.ts` | studentId, qualificationId, unitsCompleted[] |

### 4.4 Repository

| File | Test First | Implementation |
|------|------------|----------------|
| `lib/domain/asdan/ASDANProgressRepository.ts` | Interface | findByStudent |
| `lib/domain/asdan/InMemoryASDANProgressRepository.ts` | `InMemory...test.ts` | In-memory implementation |

**Deliverables:**
- [ ] ASDAN reference data (units, qualifications)
- [ ] ASDANProgress entity
- [ ] Calculation of % complete
- [ ] All tests passing

---

## Phase 5: Application Services

Use cases orchestrating domain operations.

### 5.1 Activity Management

| Service | Test First | Description |
|---------|------------|-------------|
| `CreateSchoolActivity` | `CreateSchoolActivity.test.ts` | Gatsby Lead creates activity |
| `UpdateSchoolActivity` | `UpdateSchoolActivity.test.ts` | Edit activity |
| `ArchiveSchoolActivity` | `ArchiveSchoolActivity.test.ts` | Archive (soft delete) |
| `GetSchoolFramework` | `GetSchoolFramework.test.ts` | All activities by benchmark |

### 5.2 Evidence Management

| Service | Test First | Description |
|---------|------------|-------------|
| `SubmitEvidence` | `SubmitEvidence.test.ts` | Student submits evidence |
| `ReviewEvidence` | `ReviewEvidence.test.ts` | Gatsby Lead approves/rejects |
| `GetPendingEvidence` | `GetPendingEvidence.test.ts` | Queue for review |

### 5.3 Progress Calculation

| Service | Test First | Description |
|---------|------------|-------------|
| `GetStudentCareerPlan` | `GetStudentCareerPlan.test.ts` | Student's view (no Gatsby) |
| `GetGatsbyCompliance` | `GetGatsbyCompliance.test.ts` | Educator's view (full Gatsby) |
| `GetSchoolHeatmap` | `GetSchoolHeatmap.test.ts` | Grid of students × benchmarks |
| `GetASDANProgress` | `GetASDANProgress.test.ts` | Student's qualification progress |

**Deliverables:**
- [ ] All application services with tests
- [ ] Clear separation of student view vs educator view
- [ ] ASDAN progress calculation
- [ ] Gatsby compliance calculation

---

## Phase 6: Student Portal Refactor

Update existing student portal to hide Gatsby.

### 6.1 Page Updates

| File | Changes |
|------|---------|
| `app/student/page.tsx` | Remove GB references, show stats |
| `app/student/layout.tsx` | Update navigation |
| `app/student/activities/page.tsx` | New: Activity list grouped by theme |
| `app/student/activities/[id]/page.tsx` | New: Activity detail + evidence submission |
| `app/student/qualifications/page.tsx` | New: ASDAN progress |

### 6.2 Component Updates

| Component | Changes |
|-----------|---------|
| `BenchmarkCard.tsx` | Rename to ActivityCard, remove GB styling |
| New: `QualificationCard.tsx` | ASDAN qualification progress |
| New: `EvidenceForm.tsx` | Text + URL submission |
| New: `SubmissionStatus.tsx` | Pending/approved/rejected indicator |

### 6.3 Hooks

| Hook | Description |
|------|-------------|
| `useStudentCareerPlan` | Fetches career plan (no Gatsby) |
| `useASDANProgress` | Fetches ASDAN progress |
| `useSubmitEvidence` | Submits evidence |

**Deliverables:**
- [ ] Student dashboard shows activities, not benchmarks
- [ ] ASDAN progress visible
- [ ] Evidence submission working
- [ ] All tests passing

---

## Phase 7: Teacher Portal

New portal for Gatsby Lead and educators.

### 7.1 Pages

| File | Test First | Description |
|------|------------|-------------|
| `app/teacher/page.tsx` | `page.test.tsx` | Dashboard with GB compliance |
| `app/teacher/layout.tsx` | - | Teacher portal layout |
| `app/teacher/students/page.tsx` | `students.test.tsx` | Student heatmap |
| `app/teacher/students/[id]/page.tsx` | - | Individual student detail |
| `app/teacher/activities/page.tsx` | `activities.test.tsx` | Activity management |
| `app/teacher/activities/create/page.tsx` | `create.test.tsx` | Create activity form |
| `app/teacher/activities/[id]/page.tsx` | - | Edit activity |
| `app/teacher/evidence/page.tsx` | `evidence.test.tsx` | Evidence review queue |
| `app/teacher/evidence/[id]/page.tsx` | - | Single evidence review |

### 7.2 Components

| Component | Description |
|-----------|-------------|
| `GatsbyOverview.tsx` | 8 benchmarks with % |
| `StudentHeatmap.tsx` | Grid of students × benchmarks |
| `EvidenceQueue.tsx` | Pending submissions list |
| `ActivityForm.tsx` | Create/edit activity |
| `BenchmarkSelector.tsx` | Multi-select for benchmarks |
| `ASDANUnitSelector.tsx` | Auto-suggest ASDAN units |

### 7.3 Hooks

| Hook | Description |
|------|-------------|
| `useGatsbyCompliance` | School-wide compliance data |
| `useStudentHeatmap` | All students' benchmark status |
| `usePendingEvidence` | Evidence queue |
| `useCreateActivity` | Create activity mutation |
| `useReviewEvidence` | Approve/reject mutation |

**Deliverables:**
- [ ] Gatsby dashboard functional
- [ ] Student heatmap working
- [ ] Activity creation working
- [ ] Evidence review queue working
- [ ] All tests passing

---

## Phase 8: Management Portal

Executive dashboard for School Head.

### 8.1 Pages

| File | Test First | Description |
|------|------------|-------------|
| `app/admin/page.tsx` | `page.test.tsx` | Executive dashboard |
| `app/admin/layout.tsx` | - | Admin layout |
| `app/admin/reports/page.tsx` | `reports.test.tsx` | Export page |

### 8.2 Components

| Component | Description |
|-----------|-------------|
| `SchoolOverview.tsx` | High-level stats |
| `BenchmarkCoverage.tsx` | % of students per benchmark |
| `TrendChart.tsx` | Progress over time |
| `ExportButton.tsx` | PDF/CSV generation |

**Deliverables:**
- [ ] Executive dashboard
- [ ] School-wide heatmap
- [ ] PDF export working
- [ ] All tests passing

---

## Phase 9: Integration & Polish

Final integration and quality assurance.

### 9.1 Tasks

- [ ] End-to-end flow: Create activity → Student completes → Evidence approved → Compliance updated
- [ ] Permission enforcement across all routes
- [ ] Error boundaries and loading states
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile responsiveness verification
- [ ] Performance optimization

### 9.2 Mock Data

- [ ] Realistic demo data for all entities
- [ ] Different schools to demonstrate multi-tenant
- [ ] Students at various progress levels

---

## File Structure (Final)

```
lib/
├── domain/
│   ├── staff/
│   │   ├── StaffId.ts
│   │   ├── StaffId.test.ts
│   │   ├── Role.ts
│   │   ├── StaffMember.ts
│   │   ├── StaffMember.test.ts
│   │   ├── StaffRepository.ts
│   │   ├── InMemoryStaffRepository.ts
│   │   └── InMemoryStaffRepository.test.ts
│   ├── activity/
│   │   ├── ActivityId.ts
│   │   ├── ActivityId.test.ts
│   │   ├── SchoolActivity.ts
│   │   ├── SchoolActivity.test.ts
│   │   ├── SchoolActivityRepository.ts
│   │   ├── InMemorySchoolActivityRepository.ts
│   │   └── InMemorySchoolActivityRepository.test.ts
│   ├── evidence/
│   │   ├── EvidenceId.ts
│   │   ├── EvidenceId.test.ts
│   │   ├── EvidenceSubmission.ts
│   │   ├── EvidenceSubmission.test.ts
│   │   ├── EvidenceRepository.ts
│   │   ├── InMemoryEvidenceRepository.ts
│   │   └── InMemoryEvidenceRepository.test.ts
│   ├── asdan/
│   │   ├── ASDANUnitId.ts
│   │   ├── ASDANUnitId.test.ts
│   │   ├── ASDANProgress.ts
│   │   ├── ASDANProgress.test.ts
│   │   ├── ASDANProgressRepository.ts
│   │   ├── InMemoryASDANProgressRepository.ts
│   │   └── InMemoryASDANProgressRepository.test.ts
│   └── (existing: student/, benchmark/, tenant/)
├── application/
│   ├── CreateSchoolActivity.ts
│   ├── CreateSchoolActivity.test.ts
│   ├── SubmitEvidence.ts
│   ├── SubmitEvidence.test.ts
│   ├── ReviewEvidence.ts
│   ├── ReviewEvidence.test.ts
│   ├── GetStudentCareerPlan.ts
│   ├── GetStudentCareerPlan.test.ts
│   ├── GetGatsbyCompliance.ts
│   ├── GetGatsbyCompliance.test.ts
│   ├── GetSchoolHeatmap.ts
│   ├── GetSchoolHeatmap.test.ts
│   └── (existing services)
├── hooks/
│   ├── useStudentCareerPlan.ts
│   ├── useASDANProgress.ts
│   ├── useGatsbyCompliance.ts
│   ├── useStudentHeatmap.ts
│   └── (existing hooks)
├── reference-data/
│   ├── gatsby-benchmarks.ts (existing)
│   ├── asdan-units.ts
│   └── asdan-qualifications.ts
└── mock-data/
    ├── students.ts (existing)
    ├── staff.ts
    ├── activities.ts
    └── evidence.ts

app/
├── student/
│   ├── page.tsx (refactored)
│   ├── layout.tsx
│   ├── activities/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── qualifications/page.tsx
├── teacher/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── students/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── activities/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   └── evidence/
│       ├── page.tsx
│       └── [id]/page.tsx
└── admin/
    ├── page.tsx
    ├── layout.tsx
    └── reports/page.tsx

components/
├── ui/ (existing)
├── shared/ (existing)
├── student/
│   ├── ActivityCard.tsx
│   ├── QualificationCard.tsx
│   ├── EvidenceForm.tsx
│   └── SubmissionStatus.tsx
├── teacher/
│   ├── GatsbyOverview.tsx
│   ├── StudentHeatmap.tsx
│   ├── EvidenceQueue.tsx
│   ├── ActivityForm.tsx
│   └── BenchmarkSelector.tsx
└── admin/
    ├── SchoolOverview.tsx
    ├── BenchmarkCoverage.tsx
    └── ExportButton.tsx
```

---

## Execution Guidelines

### TDD Workflow (Every Feature)

1. **Write test first** - Test file before implementation
2. **Run test** - Verify it fails (RED)
3. **Write minimum code** - Just enough to pass
4. **Run test** - Verify it passes (GREEN)
5. **Refactor** - Only if needed, run tests again
6. **Commit** - Small, focused commits

### Todo Structure (Every Phase)

```
✅ - Write StaffId.test.ts (failing)
✅ - Implement StaffId (make tests pass)
✅ - Write Role.test.ts (failing)
✅ - Implement Role (make tests pass)
...
```

### Commit Messages

Single line, conventional format:
```
test: add StaffId value object tests
feat: implement StaffId value object
test: add StaffMember entity tests
feat: implement StaffMember entity
```

---

## Dependencies

No new dependencies required. Using existing:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Jest + Testing Library

---

## Timeline Estimates

Phases are sequential, each depending on the previous:

| Phase | Description | Estimated Effort |
|-------|-------------|------------------|
| 1 | Staff Domain | Small |
| 2 | Activity Domain | Medium |
| 3 | Evidence Domain | Medium |
| 4 | ASDAN Domain | Small |
| 5 | Application Services | Medium |
| 6 | Student Portal Refactor | Medium |
| 7 | Teacher Portal | Large |
| 8 | Management Portal | Medium |
| 9 | Integration & Polish | Medium |

---

*Implementation follows CLAUDE.md principles. Tests first, always.*

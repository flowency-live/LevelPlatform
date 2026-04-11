# LevelPlatform Project Guidelines

> **Project-specific context for Claude Code sessions**
>
> This file supplements `C:\VSProjects\CLAUDE.md` with LevelPlatform-specific domain knowledge.
> **Global rules cannot be overridden** - this file provides context, not exceptions.

---

## Project Overview

**Level: My Career Plan** is a digital platform for UK careers guidance in schools.

**Core Features:**
- **Gatsby Benchmarks** - UK's 8 statutory benchmarks (GB1-GB8) for careers education
- **ASDAN Integration** - Award Scheme Development and Accreditation Network qualifications
- **Multi-tenant architecture** - Schools, organizations, cohorts, students
- **Role-based lenses** - Same data, different views (Student/Teacher/Management)

**Stack:**
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS (Elevate Design System)
- Jest for testing
- DDD architecture with in-memory repositories (DynamoDB planned)

---

## ABSOLUTE RULE: Present Options Before Any Non-Trivial Implementation

**Before implementing ANY solution that involves:**
- Working around a limitation
- Adding defensive code
- Touching more than 3 files
- Changing existing architecture
- Adding dependencies

**YOU MUST:**
1. **EXPLAIN** the problem clearly
2. **PRESENT OPTIONS** (minimum 2, maximum 4):
   - Option A: [Recommended approach with trade-offs]
   - Option B: [Alternative approach with trade-offs]
   - Option C: Do nothing / defer (always valid)
3. **WAIT** for user selection before writing any code

**BANNED behavior:**
- "I'll just add this quick fix"
- "Let me work around this"
- Implementing without presenting alternatives
- Rationalizing a workaround internally without asking

**This is NON-NEGOTIABLE. No "just this once" exceptions.**

---

## SELF-CHECK: Complexity Budget

Before ANY implementation, ask:

1. **Lines of code:** Is this proportionate to the problem?
   - Simple bug fix = 1-10 lines
   - Feature addition = 10-100 lines
   - If >100 lines → STOP and discuss scope

2. **Files touched:** Is this focused?
   - Bug fix = 1-2 files
   - Feature = 2-5 files
   - If >5 files → STOP and break into smaller PRs

3. **New concepts introduced:** Am I adding complexity?
   - 0 new concepts = ideal
   - 1 new pattern = acceptable with justification
   - 2+ new patterns → STOP and present options

**If any check fails → Present options to user before proceeding.**

---

## Domain Model

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
│  Value Objects:                                                  │
│  ├─ TenantId, OrganizationId, LocationId, CohortId               │
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

### Value Objects (Implemented)

| Value Object | Location | Format |
|--------------|----------|--------|
| `StudentId` | `lib/domain/student/StudentId.ts` | `STU-{6 alphanumeric}` |
| `BenchmarkId` | `lib/domain/benchmark/BenchmarkId.ts` | `GB1` through `GB8` |
| `ActivityId` | `lib/domain/benchmark/ActivityId.ts` | `GB{n}-ACT-{3 digits}` |
| `TenantId` | `lib/domain/tenant/TenantId.ts` | `TENANT-{alphanumeric}` |
| `LocationId` | `lib/domain/tenant/LocationId.ts` | `LOC-{alphanumeric}` |
| `CohortId` | `lib/domain/tenant/CohortId.ts` | `COHORT-{alphanumeric}` |

**All value objects have:**
- Factory `create()` method with validation
- Immutability (readonly properties)
- Equality by value
- Tests in adjacent `.test.ts` files

---

## Hexagonal Architecture (This Project)

```
┌─────────────────────────────────────────────────────┐
│                    app/ (Pages)                     │
│  - Fetch data via hooks                             │
│  - Render UI components                             │
│  - NO business logic here                           │
│  - NO direct repository access                      │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              lib/hooks/ (Application Layer)         │
│  - useStudentProgress, useBenchmarks, etc.          │
│  - Orchestrate service/repository calls             │
│  - Transform domain objects for UI consumption      │
│  - Can call application services                    │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│         lib/application/ (Use Cases)                │
│  - GetStudentProgress, CompleteActivity             │
│  - GetBenchmarkHeatmap                              │
│  - Business workflow orchestration                  │
│  - Calls repositories, returns domain objects       │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              lib/domain/ (Domain Layer)             │
│  - Entities: Student, BenchmarkProgress             │
│  - Value Objects: StudentId, BenchmarkId, etc.      │
│  - Repository interfaces (ports)                    │
│  - NO infrastructure dependencies                   │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│         lib/domain/*/InMemory*.ts (Adapters)        │
│  - Currently: In-memory implementations             │
│  - Future: lib/infrastructure/DynamoDB*.ts          │
│  - Parse/validate at this boundary                  │
│  - Implement repository interfaces                  │
└─────────────────────────────────────────────────────┘
```

### Layer Rules

| Layer | Can Import | Cannot Import |
|-------|------------|---------------|
| `app/` | `lib/hooks/`, `components/` | `lib/domain/`, `lib/application/` directly |
| `lib/hooks/` | `lib/application/`, `lib/mock-data/` | Infrastructure |
| `lib/application/` | `lib/domain/` interfaces | Infrastructure implementations |
| `lib/domain/` | Nothing external | `lib/hooks/`, `app/`, `lib/mock-data/` |
| `components/` | Nothing from `lib/` | `lib/domain/`, `lib/application/` |

---

## Three Portals (Role-Based Views)

| Route | Role | Data Access |
|-------|------|-------------|
| `/student` | Student | Own data only |
| `/teacher` | Teacher/Staff | Assigned students |
| `/admin` | Management | Organization-wide |

**Same underlying data, different lenses.**

---

## Design System: Elevate

**Four-Layer Color Architecture:**

| Layer | Purpose | Example |
|-------|---------|---------|
| **Tenant** | School/org branding | `tenant-primary`, `tenant-accent` |
| **Framework** | Gatsby=Blue, ASDAN=Green | `gatsby`, `asdan`, `individual` |
| **Persona** | Student=Blue, Teacher=Teal, Management=Slate | `persona-student`, `persona-teacher` |
| **System** | Surfaces, text, borders | `surface-page`, `text-primary`, `border-default` |

**Key Colors:**
- Gatsby Blue: `#3B82F6`
- ASDAN Green: `#22C55E`
- Individual Orange: `#F97316`
- Student Blue: `#3B82F6`
- Teacher Teal: `#14B8A6`
- Management Slate: `#64748B`

**Typography:** Source Sans 3 (Google Fonts)

**Touch Targets:** Minimum 44px for mobile accessibility (WCAG 2.1 AA+)

---

## File Structure Reference

```
app/
├─ page.tsx                     # Portal selector (Student/Teacher/Admin)
├─ student/                     # Student portal
│   ├─ page.tsx                 # Student dashboard
│   ├─ benchmark/[id]/page.tsx  # Benchmark detail
│   ├─ targets/page.tsx         # SMART targets (TODO)
│   └─ employers/page.tsx       # Employer log (TODO)
├─ teacher/                     # Teacher portal (TODO)
├─ admin/                       # Management portal (TODO)
└─ api/                         # API routes

lib/
├─ domain/                      # DDD domain layer
│   ├─ student/                 # Student aggregate
│   ├─ benchmark/               # Benchmark value objects & progress
│   └─ tenant/                  # Multi-tenant value objects
├─ application/                 # Use cases
├─ hooks/                       # React hooks (application layer)
├─ types/                       # Shared TypeScript interfaces
├─ mock-data/                   # Demo data (20 students)
└─ reference-data/              # GB1-GB8 definitions

components/
├─ ui/                          # Core UI (Button, Input, Card, Checkbox)
├─ shared/                      # ProgressRing, BottomNav, TopNav
├─ benchmark/                   # BenchmarkCard, ActivityBlock
└─ evidence/                    # EvidenceUpload
```

---

## Current Progress (340 Tests Passing)

| Phase | Status |
|-------|--------|
| Infrastructure (CDK) | Complete |
| Domain Foundation | Complete |
| Repository Layer (In-Memory) | Complete |
| Application Services | Complete |
| API Layer (Next.js Routes) | Complete |
| UI Components | Complete |
| Student Pages | 80% (Targets, Employers TODO) |
| Teacher Pages | Not Started |
| Admin Pages | Not Started |

---

## Common Patterns in This Codebase

### Creating a Value Object Test (TDD First)

```typescript
// lib/domain/student/StudentId.test.ts
describe('StudentId', () => {
  it('creates valid StudentId', () => {
    const id = StudentId.create('STU-ABC123');
    expect(id.value).toBe('STU-ABC123');
  });

  it('rejects invalid format', () => {
    expect(() => StudentId.create('invalid')).toThrow();
  });
});
```

### Using Hooks in Pages

```typescript
// app/student/page.tsx
export default function StudentDashboard() {
  const progress = useStudentProgress();  // Hook handles data fetching

  if (!progress) return <Loading />;

  return <Dashboard data={progress} />;  // Pure rendering
}
```

### Component with Design System Colors

```typescript
// Uses framework colors
<div className="bg-gatsby text-white">Gatsby Benchmark</div>

// Uses persona colors
<div className="bg-persona-student">Student View</div>

// Uses system colors
<div className="bg-surface-page text-text-primary border-border-default">
```

---

## Before Starting Any Task

1. **Read this file** - Understand the domain model
2. **Check `IMPLEMENTATION_PLAN.md`** - What's already built?
3. **State test-first approach** - "I will write tests for X, Y, Z first"
4. **Wait for approval** - TDD protocol requires explicit go-ahead
5. **Present options** - If task is non-trivial, present alternatives

---

## Quick Reference

| Concept | Implementation |
|---------|----------------|
| IDs | Value objects with validation (`StudentId.create()`) |
| Progress | `BenchmarkProgress` entity with activity tracking |
| Data access | Hooks → Application services → Repositories |
| Styling | Tailwind with Elevate design tokens |
| Testing | Jest + Testing Library, TDD workflow |

---

*This file provides project context. Global rules in `C:\VSProjects\CLAUDE.md` always apply.*

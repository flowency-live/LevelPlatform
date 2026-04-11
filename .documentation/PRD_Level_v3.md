# Level: My Career Plan

## Product Requirements Document v3

**Version:** 3.0
**Date:** April 2026
**Status:** Active

---

## 1. Executive Summary

### 1.1 Product Vision

Level is a digital career guidance platform that transforms how UK schools deliver and track career education. It separates **what students see** (their career plan and qualifications) from **what educators track** (statutory Gatsby compliance), creating a system that serves both audiences without compromising either.

### 1.2 Target Users

Primary: UK alternative provision and specialist settings for vulnerable children
- Students with varied life circumstances requiring specialist education
- Mixed ability, age, and needs (no form groups or year structures)
- Staff delivering career guidance across the curriculum
- School leadership requiring Ofsted-ready compliance evidence

**Note:** While these settings are often categorised alongside SEND provision, students may not have formal SEND classifications. They are vulnerable due to life circumstances (e.g., looked after children, exclusions, trauma, family situations) rather than diagnosed learning disabilities.

### 1.3 Key Differentiators

| Capability | Paper-Based | Generic Systems | Level |
|------------|-------------|-----------------|-------|
| Gatsby Tracking | Manual spreadsheets | Visible to students | Hidden from students |
| ASDAN Integration | Separate system | None | Native, student-facing |
| Accessibility | Limited | Retrofitted | Built-in from day one |
| Evidence Capture | Filing cabinets | Basic upload | Text + URLs, mobile-first |
| Ofsted Reporting | Days to compile | Generic | One-click export |
| Cross-curriculum | Hard to track | Per-subject | Activities span subjects |

---

## 2. Problem Statement

### 2.1 Statutory Requirements

UK schools must deliver career guidance against the **8 Gatsby Benchmarks** - a framework established by the Gatsby Foundation and mandated by the Department for Education. Every school must demonstrate progress against all 8 benchmarks during Ofsted inspections.

### 2.2 Current Challenges

**For Students:**
- Paper booklets are uninspiring and easily lost
- Career guidance feels disconnected from daily learning
- No clear connection between activities and qualifications

**For Educators:**
- Gatsby tracking requires spreadsheets and manual work
- Evidence gathering is reactive (scrambling before Ofsted)
- Activities span subjects but tracking is siloed
- One person (Gatsby Lead) can't see everything happening

**For Leadership:**
- No real-time visibility into benchmark compliance
- Cannot identify at-risk students until too late
- Ofsted evidence takes days to compile
- Cannot demonstrate impact to governors

### 2.3 Root Cause

Current systems either:
1. **Expose Gatsby to students** - Adding cognitive burden without value (students don't need to know "GB5")
2. **Ignore Gatsby** - Leaving compliance tracking entirely manual
3. **Separate systems** - ASDAN, Gatsby, and activities tracked in different places

---

## 3. Solution Overview

### 3.1 Dual-Track System

Level operates two parallel tracking systems with different visibility:

| Track | Purpose | Who Sees It | What They See |
|-------|---------|-------------|---------------|
| **Gatsby Compliance** | School meets statutory benchmarks | Educators, Management | GB1-GB8 progress, heatmaps, Ofsted reports |
| **ASDAN Qualifications** | Students earn recognised awards | Students, Educators | Certificate progress, units completed |

### 3.2 Core Principle

> **Students** focus on their career plan and qualifications.
> **Educators** track compliance behind the scenes.
> **Same activities** serve both purposes.

### 3.3 How It Works

1. **Gatsby Lead creates activities** that map to benchmark(s) AND optionally ASDAN units
2. **Students complete activities** and see them as "things to do for my career"
3. **Evidence flows to Gatsby Lead** for review and approval
4. **System automatically updates** both Gatsby compliance AND ASDAN progress
5. **Management sees compliance** at any time, Ofsted-ready

---

## 4. User Personas

### 4.1 Student

**Profile:**
- Vulnerable young person, ages 11-19
- Alternative provision or specialist setting
- Mixed ability, age, and needs
- No assumptions about form groups or year structures
- May have varied support needs based on life circumstances

**Needs:**
- Simple interface with minimal typing
- Large touch targets, clear visual feedback
- Photo and voice as primary input modes
- Clear progress indicators
- Understanding of what qualifications they're working towards

**What They See:**
- "My Career Plan" - activities grouped by theme
- "My Qualifications" - ASDAN progress
- Stats: activities completed, employers met, workplaces visited

**What They DON'T See:**
- Gatsby benchmarks (GB1-GB8)
- Compliance percentages
- Educator dashboards

### 4.2 Teacher

**Profile:**
- Subject teacher or support staff
- Delivers career-linked activities within their subject
- May work with multiple students across different needs

**Needs:**
- See progress for students they work with
- Facilitate activities from the school pool
- Add notes or flags for individual students

**What They See:**
- Student progress (activities, not benchmarks)
- Activity pool (what they can deliver)
- Their students' career plans

**What They DON'T See:**
- Gatsby compliance dashboards
- Evidence approval queues
- School-wide analytics

### 4.3 Gatsby Lead (Careers Leader)

**Profile:**
- Designated staff member responsible for Gatsby compliance
- Cross-cutting role spanning all subjects
- May also be ASDAN Coordinator (or different person)

**Needs:**
- Create and manage school activities
- Track which benchmarks are being met
- Approve evidence submissions
- Identify students falling behind
- Prepare for Ofsted inspections

**What They See:**
- Full Gatsby dashboard (GB1-GB8)
- Student heatmap (RAG status per student per benchmark)
- Evidence review queue
- Activity management
- Compliance reports

**Responsibilities:**
- Create activities that map to benchmarks
- Review and approve student evidence
- Ensure all benchmarks are covered
- Report to leadership on compliance

### 4.4 ASDAN Coordinator

**Profile:**
- Staff member managing ASDAN qualifications
- May be same person as Gatsby Lead or different
- Responsible for external verification

**Needs:**
- Track student progress towards qualifications
- Verify completed units
- Sign off for external moderation
- Link activities to ASDAN units

**What They See:**
- ASDAN progress for all students
- Units pending verification
- Qualification completion dashboard

### 4.5 School Head (Management)

**Profile:**
- Headteacher, Deputy Head, or SLT member
- Responsible for overall compliance
- Reports to governors and Ofsted

**Needs:**
- School-wide compliance overview
- Early warning for at-risk students
- Trend analysis over time
- One-click Ofsted reports
- Governor-ready summaries

**What They See:**
- School-wide benchmark coverage (%)
- Student heatmap
- Trend charts
- Export functions
- Full access to all data

---

## 5. Features

### 5.1 Student Portal: My Career Plan

#### 5.1.1 Dashboard

**Description:**
The student's home screen, showing their overall progress and next steps.

**Elements:**
- Welcome message with student name
- Progress stats (activities completed, employers met, workplaces visited)
- ASDAN qualification progress bars
- "Up Next" suggested activity
- Navigation to activities and qualifications

**Acceptance Criteria:**
- [ ] No Gatsby terminology visible (no "GB1", "Benchmark 5", etc.)
- [ ] Progress shown as simple, friendly stats
- [ ] ASDAN progress shown with actual qualification names
- [ ] At least one "up next" activity suggested
- [ ] All touch targets minimum 48px

#### 5.1.2 Activity List

**Description:**
All activities available to the student, with completion status.

**Elements:**
- Activities grouped by theme (e.g., "Meeting Employers", "Exploring Careers")
- Status per activity (not started, in progress, complete)
- Filter by status
- Tap to view details

**Acceptance Criteria:**
- [ ] Activities grouped by theme, NOT by Gatsby benchmark
- [ ] Clear visual distinction between complete/incomplete
- [ ] Filter options: All, To Do, Completed
- [ ] Activity cards show: name, brief description, status icon

#### 5.1.3 Activity Detail

**Description:**
Full details of an activity and evidence submission.

**Elements:**
- Activity name and description
- What evidence is needed
- Evidence submission form (text area with URL support)
- Previous submissions list
- Submission status (pending, approved, rejected)

**Acceptance Criteria:**
- [ ] Clear description of what's required
- [ ] Evidence submission is a simple text field
- [ ] URLs in text are displayed as clickable links
- [ ] Previous submissions show status with visual indicator
- [ ] Rejection shows reviewer feedback

#### 5.1.4 My Qualifications (ASDAN)

**Description:**
Student's progress towards ASDAN qualifications.

**Elements:**
- List of qualifications being worked towards
- Progress bar per qualification
- Fraction completed (e.g., "2/6 units")
- Tap to see unit breakdown

**Acceptance Criteria:**
- [ ] Shows actual ASDAN qualification names
- [ ] Progress shown as both percentage and fraction
- [ ] Units listed with completion status
- [ ] Completed units clearly marked

### 5.2 Educator Portal: Gatsby Framework

#### 5.2.1 Dashboard

**Description:**
Gatsby Lead's home screen showing compliance overview.

**Elements:**
- All 8 benchmarks with completion percentage
- Visual progress bars
- Pending evidence count (badge)
- Quick action buttons
- Recent activity feed

**Acceptance Criteria:**
- [ ] All 8 Gatsby Benchmarks displayed
- [ ] Each shows percentage of students meeting it
- [ ] Evidence queue shows count prominently
- [ ] Quick actions: Create Activity, View Students, Review Evidence

#### 5.2.2 Student Heatmap

**Description:**
Grid showing every student's status against every benchmark.

**Elements:**
- Rows: Students (alphabetical)
- Columns: GB1-GB8
- Cells: RAG status (Red, Amber, Green)
- Click cell to drill down
- Filter by status

**Acceptance Criteria:**
- [ ] All students visible (scrollable)
- [ ] All 8 benchmarks as columns
- [ ] RAG status per cell (colour-coded)
- [ ] Click cell shows that student's detail for that benchmark
- [ ] Can filter to show only Red/Amber students

#### 5.2.3 Activity Management

**Description:**
Create and manage activities that contribute to benchmarks.

**Elements:**
- Activity list grouped by benchmark
- Create new activity form
- Edit existing activities
- Archive inactive activities

**Create Form Fields:**
- Activity name
- Description
- Evidence requirements (what student should submit)
- Gatsby benchmark(s) this satisfies
- ASDAN unit(s) this contributes to (auto-suggested)
- Status (draft, active, archived)

**Acceptance Criteria:**
- [ ] Activities organised by which benchmark they satisfy
- [ ] Create form validates all required fields
- [ ] ASDAN units auto-suggested based on benchmark selection
- [ ] Can assign activity to multiple benchmarks
- [ ] Archive doesn't delete, just hides from students

#### 5.2.4 Evidence Review Queue

**Description:**
Queue of student submissions awaiting approval.

**Elements:**
- List of pending submissions
- Student name, activity, submission date
- Preview of evidence content
- Approve/Reject buttons
- Notes field for feedback
- Bulk actions

**Acceptance Criteria:**
- [ ] Sorted by submission date (oldest first)
- [ ] Can filter by benchmark, student
- [ ] Approve button marks complete, updates progress
- [ ] Reject button requires feedback note
- [ ] Bulk approve for multiple submissions

### 5.3 Management Portal: Compliance Overview

#### 5.3.1 School Dashboard

**Description:**
Executive view of school-wide Gatsby compliance.

**Elements:**
- Benchmark coverage (% of students meeting each)
- Trend over time (term by term)
- At-risk student count
- Employer encounter summary
- Work experience coverage

**Acceptance Criteria:**
- [ ] All 8 benchmarks with school-wide percentage
- [ ] Trend shown as line chart or comparison
- [ ] At-risk count links to student list
- [ ] Key stats prominently displayed

#### 5.3.2 Exports

**Description:**
Generate reports for Ofsted and governors.

**Elements:**
- One-click PDF report
- CSV data export
- Per-student summary
- Date range selection

**Report Contents:**
- School compliance overview
- Per-benchmark breakdown
- Evidence count
- Student list with RAG status
- Employer encounter log
- Work experience summary

**Acceptance Criteria:**
- [ ] PDF generates in under 10 seconds
- [ ] PDF is formatted, professional, Ofsted-ready
- [ ] CSV includes all relevant data fields
- [ ] Per-student report available

---

## 6. Wireframe Descriptions

### 6.1 Student Dashboard

```
┌────────────────────────────────────────────┐
│ [Logo]                    [Avatar] [Menu] │
├────────────────────────────────────────────┤
│ Hi, Emma                                   │
│ Here's your career plan progress           │
├────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │    12    │ │    3     │ │    1     │    │
│ │Activities│ │Employers │ │Workplace │    │
│ │completed │ │   met    │ │ visited  │    │
│ └──────────┘ └──────────┘ └──────────┘    │
├────────────────────────────────────────────┤
│ My Qualifications                          │
│ ┌────────────────────────────────────┐    │
│ │ Certificate of Personal Effectiveness│   │
│ │ ████████░░░░ 40%                    │    │
│ └────────────────────────────────────┘    │
│ ┌────────────────────────────────────┐    │
│ │ Employability Level 1              │    │
│ │ ██████░░░░░░ 33% (2/6 units)       │    │
│ └────────────────────────────────────┘    │
├────────────────────────────────────────────┤
│ Up Next                                    │
│ ┌────────────────────────────────────┐    │
│ │ Visit a local workplace            │    │
│ │ [Start Activity →]                 │    │
│ └────────────────────────────────────┘    │
├────────────────────────────────────────────┤
│ [Home] [Activities] [Quals] [Profile]     │
└────────────────────────────────────────────┘
```

### 6.2 Activity List (Student)

```
┌────────────────────────────────────────────┐
│ [←] Activities                    [Filter] │
├────────────────────────────────────────────┤
│ Meeting Employers                          │
│ ┌────────────────────────────────────┐    │
│ │ ✓ Talk to someone in healthcare    │    │
│ │   Completed 15 Mar                 │    │
│ └────────────────────────────────────┘    │
│ ┌────────────────────────────────────┐    │
│ │ ○ Visit a local business           │    │
│ │   Not started                      │    │
│ └────────────────────────────────────┘    │
├────────────────────────────────────────────┤
│ Exploring Careers                          │
│ ┌────────────────────────────────────┐    │
│ │ ◐ Research 3 careers I like        │    │
│ │   In progress                      │    │
│ └────────────────────────────────────┘    │
│ ┌────────────────────────────────────┐    │
│ │ ○ Complete my skills profile       │    │
│ │   Not started                      │    │
│ └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```

### 6.3 Educator Dashboard

```
┌────────────────────────────────────────────┐
│ [Logo] Gatsby Framework         [Profile] │
├────────────────────────────────────────────┤
│ School Compliance                          │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│ │GB1 82% │ │GB2 71% │ │GB3 89% │ │GB4 58%│ │
│ │████████│ │███████ │ │████████│ │██████ │ │
│ └────────┘ └────────┘ └────────┘ └──────┘ │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│ │GB5 96% │ │GB6 45% │ │GB7 68% │ │GB8 78%│ │
│ │████████│ │████    │ │███████ │ │██████ │ │
│ └────────┘ └────────┘ └────────┘ └──────┘ │
├────────────────────────────────────────────┤
│ 12 evidence submissions pending            │
│ [Review Evidence →]                        │
├────────────────────────────────────────────┤
│ Quick Actions                              │
│ [+ Create Activity] [View Students]        │
├────────────────────────────────────────────┤
│ [Dashboard] [Students] [Activities] [More] │
└────────────────────────────────────────────┘
```

### 6.4 Student Heatmap

```
┌────────────────────────────────────────────────────────┐
│ Student Progress                    [Export] [Filter] │
├────────────────────────────────────────────────────────┤
│              GB1  GB2  GB3  GB4  GB5  GB6  GB7  GB8   │
├────────────────────────────────────────────────────────┤
│ Emma W.      🟢   🟢   🟢   🟡   🟢   🔴   🟡   🟢    │
│ James T.     🟢   🟡   🟢   🟢   🟢   🟡   🔴   🟢    │
│ Sophie M.    🟡   🔴   🟢   🟡   🟢   🔴   🔴   🟡    │
│ Oliver P.    🟢   🟢   🟢   🟢   🟢   🟢   🟢   🟢    │
│ Amelia K.    🟢   🟢   🟡   🟢   🟢   🟡   🟢   🟢    │
│ ...                                                    │
├────────────────────────────────────────────────────────┤
│ 🟢 Met (100%)  🟡 Partial (>0%)  🔴 Not met (0%)       │
└────────────────────────────────────────────────────────┘
```

### 6.5 Evidence Review

```
┌────────────────────────────────────────────┐
│ [←] Evidence Review                        │
├────────────────────────────────────────────┤
│ 12 submissions pending                     │
├────────────────────────────────────────────┤
│ ┌────────────────────────────────────┐    │
│ │ Emma Wilson                        │    │
│ │ Activity: Talk to healthcare worker│    │
│ │ Submitted: 10 Apr 2026             │    │
│ │                                    │    │
│ │ "I talked to Sarah who is a nurse │    │
│ │  at the local hospital. She told  │    │
│ │  me about her training..."        │    │
│ │                                    │    │
│ │ [Approve ✓]  [Reject ✗]           │    │
│ └────────────────────────────────────┘    │
│ ┌────────────────────────────────────┐    │
│ │ James Thompson                     │    │
│ │ Activity: Research 3 careers       │    │
│ │ Submitted: 9 Apr 2026              │    │
│ │ ...                                │    │
│ └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```

---

## 7. Permission Model

### 7.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────┐
│ SCHOOL HEAD                                         │
│ Full oversight of all systems                       │
├─────────────────────┬───────────────────────────────┤
│ GATSBY LEAD         │ ASDAN COORDINATOR             │
│ Cross-cutting       │ Cross-cutting                 │
│ • Create activities │ • Verify ASDAN credits        │
│ • Approve evidence  │ • Sign off qualifications     │
│ • Gatsby compliance │ • ASDAN administration        │
├─────────────────────┴───────────────────────────────┤
│ SUBJECT LEAD (optional)                             │
├─────────────────────────────────────────────────────┤
│ TEACHER                                             │
│ • Facilitate activities                             │
│ • View assigned student progress                    │
│ • Add notes/flags                                   │
├─────────────────────────────────────────────────────┤
│ STUDENT                                             │
│ • View own career plan                              │
│ • Submit evidence                                   │
│ • View own ASDAN progress                           │
└─────────────────────────────────────────────────────┘
```

### 7.2 Permission Matrix

| Capability | Student | Teacher | Gatsby Lead | ASDAN Coord | School Head |
|------------|---------|---------|-------------|-------------|-------------|
| View own progress | ✅ | - | - | - | - |
| View student progress | Own only | Assigned | All | All | All |
| Submit evidence | ✅ | - | - | - | - |
| Approve evidence | - | - | ✅ | - | ✅ |
| Create activities | - | - | ✅ | - | ✅ |
| View Gatsby dashboard | - | - | ✅ | View only | ✅ |
| View ASDAN dashboard | Own only | Assigned | View only | ✅ | ✅ |
| Verify ASDAN credits | - | - | - | ✅ | ✅ |
| Export reports | - | - | ✅ | ✅ | ✅ |
| Manage staff roles | - | - | - | - | ✅ |

---

## 8. Reference: Gatsby Benchmarks

The 8 Gatsby Benchmarks are the UK's statutory framework for careers guidance.

| ID | Benchmark | Description | Key Activities |
|----|-----------|-------------|----------------|
| GB1 | Stable Careers Programme | Embedded programme known to all | Careers week, termly check-ins, know the Careers Leader |
| GB2 | Learning from Career Info | Understand opportunities and labour market | Research careers, explore job market, sector spotlights |
| GB3 | Addressing Individual Needs | Tailored advice for each student | 1:1 discussions, personal profiles, guidance interviews |
| GB4 | Linking Curriculum to Careers | Teachers connect subjects to careers | Subject-career links, skills passports |
| GB5 | Employer Encounters | Multiple opportunities to learn from employers | Careers fairs, employer visits, mock interviews |
| GB6 | Workplace Experience | First-hand workplace experience | Work experience, work shadowing, workplace visits |
| GB7 | Further Education Awareness | Understanding of pathways | College visits, pathway research, options events |
| GB8 | Personal Guidance | At least one interview with qualified adviser | 1:1 guidance, SMART targets, career plan reviews |

---

## 9. Reference: ASDAN Qualifications

Common qualifications for alternative provision and specialist settings:

| Qualification | Levels | Description |
|---------------|--------|-------------|
| Certificate of Personal Effectiveness (CoPE) | 1, 2, 3 | Develops personal skills through challenges |
| Personal Development Programme | Bronze, Silver, Gold | Portfolio-based personal development |
| Employability | 1, 2 | Work-related skills and preparation |
| Personal Progress | Entry Level | For learners needing additional support |
| Short Courses | Various | 10-60 hour focused programmes |

---

## 10. Non-Functional Requirements

### 10.1 Accessibility (WCAG 2.1 AA)

- Screen reader compatible
- Full keyboard navigation
- High contrast mode
- Large touch targets (minimum 48px)
- Dyslexia-friendly font (Inter)
- Reduced motion support
- Clear focus indicators

### 10.2 Performance

- Page load under 2 seconds
- Mobile-first responsive design
- Works on tablets and phones
- Offline capability (future phase)

### 10.3 Security & Data Protection

- UK data residency (AWS eu-west-2)
- GDPR compliant
- Role-based access control
- Audit trail for all actions
- Encrypted at rest and in transit
- Regular security audits

### 10.4 Compatibility

- Modern browsers (Chrome, Safari, Edge, Firefox)
- iOS and Android devices
- Tablet-optimised
- Progressive Web App (future)

---

## 11. Out of Scope (MVP)

The following are explicitly NOT included in the MVP:

- File uploads (use URLs instead)
- Voice recording and transcription
- Offline mode (PWA)
- AI-powered suggestions
- Parent/carer portal
- Multi-school federation view
- External API integrations
- Employer CRM features
- Calendar/scheduling
- Messaging system

---

## 12. Success Metrics

### 12.1 Efficiency

| Metric | Current State | Target |
|--------|---------------|--------|
| Time to compile Ofsted report | 2-3 days | < 5 minutes |
| Admin time per student per term | 30 minutes | 5 minutes |
| Evidence retrieval time | 15+ minutes | Instant |

### 12.2 Engagement

| Metric | Target |
|--------|--------|
| Student activity completion rate | 80% |
| Evidence submission rate | 70% |
| First-time evidence approval rate | 90% |

### 12.3 Compliance

| Metric | Target |
|--------|--------|
| Students meeting all 8 benchmarks | 85% |
| Benchmark with lowest coverage | > 60% |
| At-risk students identified early | 100% |

---

## 13. Glossary

| Term | Definition |
|------|------------|
| Gatsby Benchmarks | UK's 8 statutory standards for career guidance in schools |
| ASDAN | Award Scheme Development and Accreditation Network - provider of qualifications |
| CoPE | Certificate of Personal Effectiveness (ASDAN qualification) |
| Gatsby Lead | Staff member responsible for Gatsby compliance (also called Careers Leader) |
| RAG | Red, Amber, Green - status indicators |
| Alternative Provision | Education outside mainstream for vulnerable students |
| Ofsted | UK education inspection body |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2025 | - | Initial "My Career Plan" booklet digitisation |
| 2.0 | Mar 2026 | - | Added detailed Gatsby tracking |
| 3.0 | Apr 2026 | - | Dual-track system: Gatsby hidden from students, ASDAN visible |

---

*End of PRD v3*

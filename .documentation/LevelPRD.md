# Level: My Career Plan

## Digital Career Guidance Platform for UK Schools

**Version 2.0** | **March 2026**

---

## Executive Summary

Level is a digital career guidance platform that transforms the statutory Gatsby Benchmark framework into an accessible, evidence-based student journey. Designed specifically for UK schools supporting students with additional needs, Level digitises the "My Career Plan" booklet while adding real-time progress tracking, evidence capture, and Ofsted-ready reporting.

### The Opportunity

UK schools are legally required to deliver careers guidance against the 8 Gatsby Benchmarks. Currently, most schools rely on paper-based tracking that creates administrative burden, lacks real-time visibility, and makes Ofsted evidence gathering reactive rather than proactive.

Level solves this by providing:

- **For Students**: A simple, accessible interface to track career activities with photo and voice evidence
- **For Staff**: Real-time dashboards showing student progress without additional admin
- **For Leadership**: Instant Ofsted-ready reports demonstrating benchmark compliance

### Key Differentiators

| Capability | Paper-Based | Competitors | Level |
|------------|-------------|-------------|-------|
| ASDAN Integration | Manual mapping | None | Native |
| SEN Accessibility | Limited | Retrofitted | Built-in |
| Evidence Capture | Filing cabinets | Basic upload | Photo + Voice + Offline |
| Ofsted Reporting | Manual compilation | Generic reports | One-click export |
| Staff Admin Burden | High | Medium | Minimal |

---

## The Gatsby Benchmark Framework

The Gatsby Benchmarks are the UK's statutory framework for careers guidance in schools, established by the Gatsby Foundation and adopted by the Department for Education. Every school must demonstrate progress against all 8 benchmarks.

### The 8 Gatsby Benchmarks

<div class="benchmark-grid">

#### GB1: A Stable Careers Programme
Every school should have an embedded programme of careers education and guidance that is known and understood by students, parents, teachers, and employers.

**Student Activities:**
- Attend careers week activities
- Have termly check-ins with form tutor
- Know their Careers Leader/Adviser
- Complete their career plan

---

#### GB2: Learning About the Job Market
Every student should understand the full range of opportunities available to them, including academic and vocational routes and labour market information.

**Student Activities:**
- Research 3+ careers of interest
- Explore local job market growth areas
- Attend sector spotlight assemblies
- Set up National Careers Service account (Y10+)

---

#### GB3: Support for Individual Needs
Students have different career guidance needs at different stages. Advice should be tailored to individual circumstances and backgrounds.

**Student Activities:**
- Discuss goals with tutor/careers adviser
- Complete personal profile
- Attend 1:1 careers guidance interview
- Share additional needs with adviser

---

#### GB4: Careers in the Curriculum
All teachers should link curriculum learning to careers, helping students understand the relevance of their subjects to future pathways.

**Student Activities:**
- Find career links for each subject
- Complete subject-career activities in lessons
- Use careers skills passport
- Ask teachers how subjects link to jobs

---

#### GB5: Employer Encounters
Every student should have multiple opportunities to learn from employers about work and the skills that are valued in the workplace.

**Student Activities:**
- Attend careers fairs/employer assemblies
- Participate in virtual employer Q&As
- Complete mock interviews with employers (Y11+)
- Reflect on each employer encounter

---

#### GB6: Workplace Experience
Every student should have first-hand experience of the workplace through work visits, work shadowing, or work experience.

**Student Activities:**
- Complete work experience placement (Y10)
- Write reflection journal during placement
- Complete volunteering/community project
- Attend curriculum-linked workplace visits

---

#### GB7: Further Education Awareness
All students should understand the full range of academic and vocational qualifications and pathways available post-16 and post-18.

**Student Activities:**
- Attend post-16/18 options events
- Visit colleges, sixth forms, or universities
- Research 2+ different pathways
- Complete Pathways Planner

---

#### GB8: Personal Guidance
Every student should have at least one personal careers guidance interview with a qualified adviser.

**Student Activities:**
- Attend 1:1 careers guidance interview
- Set 3 SMART targets
- Review targets termly with tutor
- Update career plan after every activity

</div>

---

## ASDAN Qualification Integration

Level natively integrates with ASDAN (Award Scheme Development and Accreditation Network) qualifications, allowing career activities to contribute directly toward recognised awards.

### Mapped ASDAN Units

| Career Activity | ASDAN Qualification |
|-----------------|---------------------|
| Career planning activities | CoPE: Planning for the Future |
| Self-reflection exercises | Personal Development Short Course |
| Career research | Research Skills / Using the Internet |
| Goal setting | Managing Emotions / Self-Review |
| Interview preparation | Action Planning Unit |
| Employer interactions | Enterprise / Young Enterprise |
| Work experience | Work Experience Prep & Review |
| Volunteering | Community Volunteering Unit |
| Post-16 exploration | Preparing for College / Higher Education Awareness |
| Target tracking | Managing My Learning |

### ASDAN Award Summary

Students can track ASDAN credits earned through career activities:

- **Unit Title**: Which ASDAN unit the activity contributes to
- **Award Level**: Entry Level, Level 1, or Level 2
- **Date Completed**: Automatic date stamp on completion
- **Coordinator Verification**: Digital signature from ASDAN coordinator

---

## User Personas

### Student (Ages 12-16)

**Needs:**
- Simple, low-friction interaction
- Visual progress indicators
- Minimal typing requirements
- Photo and voice input options
- Offline capability for activities without WiFi

**Interface Principles:**
- One action per screen
- Large touch targets (48px minimum)
- Consistent navigation patterns
- Immediate visual feedback
- Photo + voice as primary input modes

### Teaching Staff

**Needs:**
- Quick validation of student completions
- Bulk actions for group activities
- Notes and feedback on individual students
- Term review workflow
- No additional admin burden

**Interface Principles:**
- Dashboard-first view
- Filter by student/benchmark/term
- Quick-add for evidence and notes
- Export for handover and reporting

### School Leadership

**Needs:**
- School-wide benchmark compliance view
- Ofsted-ready evidence and reports
- Trend analysis over time
- Early warning for students falling behind
- Employer encounter tracking

**Interface Principles:**
- Executive dashboard with KPIs
- Drill-down from school → cohort → student
- One-click PDF/CSV exports
- Historical comparison views

---

## Core Features

### 1. Benchmark Progress Tracking

Each of the 8 Gatsby Benchmarks has a dedicated section with:
- Clear explanation of the benchmark
- Checklist of required activities
- Tick + auto-date on completion
- ASDAN unit mapping for each activity
- Reflection prompt (voice or text)

### 2. Evidence Capture

**Primary Methods:**
- Photo capture (mobile-first)
- Voice reflection (tap to speak, auto-transcribe)
- File upload (documents, certificates)

**Offline Capability:**
- Evidence stored locally when offline
- Automatic sync when connection restored
- Visual indicator for pending uploads

### 3. SMART Targets

After careers guidance interviews, students set 3 minimum SMART targets:
- **S**pecific target description
- Steps to achieve the target
- Deadline (time-bound)
- Progress tracking and completion status

### 4. Employer Encounter Log

Structured logging of employer interactions:
- Date of encounter
- Employer/organisation name
- Industry/sector
- Key learnings
- Progress indicator (e.g., "2 of 3 required encounters")

### 5. Tutor Review Record

Staff-completed review tracking:
- Review date
- Reviewer name
- Progress notes and next steps
- Digital signature
- Termly review cadence

### 6. Dashboards & Reporting

**Student Dashboard:**
- GB1-GB8 progress bars
- "What's next" prompts
- Missing items highlighted
- Achievement celebrations

**Staff Dashboard:**
- Student heatmap (students × benchmarks)
- Colour-coded engagement levels
- Drill-down to individual students
- Bulk action capabilities

**Leadership Dashboard:**
- School-wide completion rates per benchmark
- Employer encounter compliance
- Work experience coverage
- Cohort comparison
- Export to PDF/CSV

---

## Technical Architecture

### Platform

- **Framework**: Next.js 14 (React 18) with App Router
- **Styling**: Tailwind CSS with accessible colour system
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints with Zod validation
- **Hosting**: AWS Amplify (UK region)

### Mobile & Offline

- Progressive Web App (PWA) architecture
- Service Worker for offline functionality
- IndexedDB for local evidence storage
- Background sync for data upload

### Accessibility

- WCAG 2.1 AA compliance minimum
- Screen reader compatibility
- Keyboard navigation throughout
- High contrast mode support
- Dyslexia-friendly font options

---

## Security & Data Protection

### Data Classification

| Data Type | Classification | Retention |
|-----------|---------------|-----------|
| Student identity | Personal Data | Duration of enrolment + 7 years |
| Career reflections | Personal Data | Duration of enrolment + 7 years |
| Photo/video evidence | Personal Data | Duration of enrolment + 7 years |
| Voice recordings | Special Category | Duration of enrolment + 3 years |
| Staff notes | Professional Record | Duration of enrolment + 7 years |

### GDPR Compliance

- **Lawful Basis**: Legitimate interests (educational provision) and consent for voice recordings
- **Data Minimisation**: Only collect data necessary for career tracking
- **Right to Access**: Student/parent data export on request
- **Right to Erasure**: Data deletion workflow with audit trail
- **Data Portability**: Export in standard formats (PDF, CSV, JSON)

### UK Data Residency

- All data stored in AWS UK regions (eu-west-2)
- No data transfer outside UK/EEA
- UK-based support and incident response

### Encryption

- **At Rest**: AES-256 encryption for all stored data
- **In Transit**: TLS 1.3 for all connections
- **Backups**: Encrypted and stored in separate UK region

---

## Safeguarding

### Design Principles

Level is designed with safeguarding as a foundational principle, not an afterthought.

### Access Control

| Role | Access Scope |
|------|--------------|
| Student | Own data only |
| Teacher | Assigned students only |
| Careers Adviser | All students (read), assigned students (write) |
| Safeguarding Lead | All students (read + audit trail) |
| Headteacher | All students + staff activity logs |

### Audit Trail

Every data access and modification is logged:
- Who accessed what data
- When access occurred
- What action was taken
- IP address and device fingerprint

### Content Moderation

- Voice transcriptions reviewed before public visibility
- Photo uploads scanned for inappropriate content
- Staff approval required for external profile sharing
- Flagging system for concerning content

### Reporting Integration

- Export capability for safeguarding referrals
- Timestamped evidence for multi-agency meetings
- Integration ready for CPOMS and similar systems

### Staff Training

- Platform includes safeguarding guidance
- Clear escalation pathways documented
- Regular review prompts for concerning patterns

---

## Anonymisation & Analytics

### School-Level Analytics

Aggregated data for school improvement:
- Benchmark completion rates (anonymised)
- Engagement trends by year group
- Most/least completed activities
- Employer encounter distribution by sector

### No Individual Tracking in Analytics

- Analytics use cohort-level data only
- No individual student data in dashboards
- Minimum cohort size of 10 for any statistic
- Suppression of small numbers to prevent identification

### Research & Improvement

- Opt-in research participation (school level)
- Fully anonymised datasets only
- No third-party data sharing without explicit consent
- Academic research partnerships with ethics approval only

---

## Cyber Security

### Infrastructure

- AWS Well-Architected Framework compliance
- Web Application Firewall (WAF) protection
- DDoS mitigation via AWS Shield
- Regular penetration testing (annual minimum)
- Vulnerability scanning (continuous)

### Authentication

- Multi-factor authentication for staff
- Single Sign-On (SSO) integration ready
- Session management with automatic timeout
- Password policy enforcement
- Account lockout after failed attempts

### Incident Response

- 24-hour breach notification commitment
- Documented incident response plan
- Regular tabletop exercises
- Third-party incident response support

### Certifications & Standards

- ISO 27001 alignment (certification roadmap)
- Cyber Essentials Plus certification
- ICO registration maintained
- Annual security audit by independent firm

---

## Compliance Summary

| Requirement | Status | Evidence |
|-------------|--------|----------|
| GDPR (UK) | Compliant | DPA, DPIA on file |
| Gatsby Benchmarks | Native support | 1:1 benchmark mapping |
| ASDAN | Integrated | Unit mapping table |
| Ofsted requirements | Export ready | One-click reports |
| Keeping Children Safe in Education | Aligned | Safeguarding controls |
| Accessibility (WCAG 2.1 AA) | Target | Accessibility statement |
| Cyber Essentials Plus | Target | Certification pending |

---

## Roadmap

### Phase 1: Core Platform (Current)

- GB1-GB8 benchmark tracking
- ASDAN unit mapping
- Photo evidence capture
- Basic dashboards
- PDF export

### Phase 2: Enhanced Engagement

- Voice reflection with transcription
- Offline mode (PWA)
- Push notifications
- Employer encounter alerts
- Student achievements/badges

### Phase 3: Intelligence Layer

- AI-powered career suggestions
- Pattern recognition for at-risk students
- Automated Ofsted report generation
- Predictive analytics for intervention
- Integration with careers services APIs

### Phase 4: Ecosystem

- Multi-school federation view
- MAT-level reporting
- External careers platform integrations
- Parent/carer portal
- Alumni tracking (post-16 destinations)

---

## About Level

Level is developed by OpStack, specialists in cloud-native software for education. Our mission is to remove administrative burden from educators so they can focus on what matters: supporting students.

**Contact:**
- Web: [level.opstack.uk](https://level.opstack.uk)
- Email: hello@opstack.uk

---

*Document version 2.0 | Last updated March 2026*

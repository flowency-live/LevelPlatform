# Flowency Education - Product Requirements Document

## Executive Summary

**Product Name:** Flowency Education  
**Client:** Arnfield Care  
**Purpose:** Comprehensive special education school management system for Arnfield Care, supporting 8 subjects, 15 students (ages 12-16), 8 subject teachers, and 1 headteacher.

**Core Value Proposition:** Streamline educational processes by integrating the UK National Curriculum, ASDAN qualifications, AI-powered assessments, and robust student progress tracking with an innovative AI timetabling engine designed to optimize student engagement and performance.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [User Roles & Portals](#user-roles--portals)
3. [Feature Specifications](#feature-specifications)
4. [Technical Architecture](#technical-architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [AI Integration](#ai-integration)
8. [UI/UX Design System](#uiux-design-system)
9. [Security & Authentication](#security--authentication)
10. [Deployment & Infrastructure](#deployment--infrastructure)

---

## System Overview

### School Profile
- **Institution:** Arnfield Care Special Education
- **Students:** 15 students (ages 12-16)
- **Teachers:** 8 subject teachers
- **Headteacher:** 1 headteacher
- **Subjects:** 8 subjects mapped to UK National Curriculum

### Subjects Covered
| Subject | Key Stages |
|---------|-----------|
| Mathematics | KS3, KS4 |
| English | KS3, KS4 |
| Modern Languages (French) | KS3, KS4 |
| Science | KS3, KS4 |
| History | KS3, KS4 |
| Geography | KS3, KS4 |
| Religious Education (RE) | KS3, KS4 |
| Personal, Social, Health & Citizenship (PSHC) | KS3, KS4 |

### Weekly Schedule Structure
- **Days:** Monday, Tuesday, Wednesday (3-day week)
- **Sessions:** Morning (09:00-12:00), Afternoon (13:00-16:00)
- **Group Size:** Maximum 4 students per teaching group

---

## User Roles & Portals

### 1. Student Portal (`/student`)

**Purpose:** Daily learning dashboard for students to access their schedule, complete exercises, and track progress.

**Features:**
- **Daily Schedule View**
  - Morning Session: Subject with teacher info, learning activities, progress tracking
  - Lunch Break indicator
  - Afternoon Session: Subject with teacher info, learning activities, progress tracking
  - "View Quiz" buttons linking to interactive assessments

- **AI Learning Assistant Sidebar**
  - Contextual help buttons (verb conjugations, pronunciation practice, lesson questions)
  - "Open AI Chat" for real-time AI assistance

- **Today's Resources Sidebar**
  - Subject-specific learning materials
  - PDF guides, audio clips, videos, interactive flashcards

- **Weekly Achievement Tracker**
  - Attendance progress (days attended)
  - Lessons completed progress bar
  - Words/concepts mastered counter

**Student Assessment Interface (`/student/assessments`):**
- Exercise progress indicator (X/Y questions, % complete)
- Question type badges (Fill in Blank, Multiple Choice, Short Answer)
- Level indicators (Level 1, Level 2, etc.)
- Interactive input fields
- Submit Answer button with instant feedback
- Correct/Incorrect visual feedback with explanations
- Next Question navigation
- Completion summary with celebration

### 2. Teacher Portal (`/teacher`)

**Purpose:** Comprehensive teaching management dashboard for lesson planning, assessment creation, and student progress tracking.

**Sidebar Navigation:**
- Overview
- Lesson Plans
- Assessments
- Curriculum Browser
- Student Progress
- Back to Home

**Features:**
- **Teacher Persona Switcher**
  - Switch between 8 teacher personas for demo purposes
  - Default: Mrs. Sophie Dubois (Modern Languages)

- **Modern Languages Dashboard** (specialized view)
  - 4 Key Metrics Cards:
    - Active Students count
    - Average Vocabulary Mastery %
    - Total Exercises completed
    - Self-Corrections count
  - Student Progress Table:
    - Student name, Vocabulary %, Exercises, Self-Corrections, Engagement, Improvement
  - Class Average Progress Line Chart (8 weeks)
  - Vocabulary Mastery by Word Bar Chart
  - Weekly Engagement Heatmap (5 days x students)

- **Lesson Plans View**
  - Create new lesson plans
  - Link to UK National Curriculum standards
  - Manage existing lesson plans

- **Assessments View**
  - Create manual assessments
  - AI-generated assessment creation
  - View assessment performance

- **Curriculum Browser**
  - UK National Curriculum standards explorer
  - Key Stage filtering (KS3, KS4)
  - Subject-specific standards

- **Student Progress View**
  - Real-time progress analytics
  - Per-subject performance metrics
  - Historical trend data

### 3. Headteacher Portal (`/headteacher`)

**Purpose:** School-wide analytics, engagement tracking, and management dashboard.

**Sidebar Navigation:**
- School Dashboard
- Cross-Subject Analytics
- Student Trends
- Teacher Performance
- Timetable
- Back to Home

**School Dashboard Features:**

**Overview Statistics (4 Cards):**
| Metric | Value | Description |
|--------|-------|-------------|
| Total Students | 15 | Ages 12-16 |
| Subjects Taught | 8 | All UK National Curriculum |
| Active Assessments | 42 | Teacher & AI-generated |
| Lesson Plans | 38 | Across all subjects |

**School Average Engagement:**
- Large percentage display with color coding
- Calculated across all 8 subjects

**Subject Engagement Overview:**
- List of all 8 subjects with:
  - Subject name
  - Active students count (X/15 students active)
  - Engagement percentage badge (color-coded)
  - Click to drill down

**4-Week Student Engagement Heatmap (Drill-down View):**
- Triggered by clicking any subject
- Table format: Students x Week 1-4 + Average
- Sticky first column (student names)
- Color-coded engagement cells:
  - Red: <40% (Critical)
  - Orange: 40-60% (Low)
  - Yellow: 60-80% (Good)
  - Green: 80%+ (Excellent)
- Mobile-optimized with horizontal scroll
- "Back to Overview" button

**Additional Headteacher Views:**
- Cross-Subject Analytics (bar charts, metrics)
- Student Trends (individual progress over time)
- Teacher Performance (metrics for all 8 teachers)
- Timetable Management (AI-powered scheduling)

---

## Feature Specifications

### F1: Consolidated School Dashboard
**Description:** Single landing page replacing separate Overview and Engagement views.

**Components:**
1. Stats grid (4 cards)
2. School Average Engagement metric
3. Subject Engagement List (clickable)
4. 4-Week Student Heatmap (drill-down)

**User Flow:**
1. Headteacher lands on School Dashboard
2. Sees overview statistics at a glance
3. Clicks subject to view 4-week student engagement
4. Identifies struggling students via color coding
5. Returns to overview via "Back to Overview" button

### F2: AI-Powered Assessments
**Description:** Generate and evaluate student exercises using AI.

**Capabilities:**
- Multi-question assessment generation
- Subject-specific content
- Difficulty levels
- Instant response evaluation
- Detailed feedback generation
- Strengths/improvement identification
- Teaching recommendations

**Question Types:**
- Fill in the Blank
- Multiple Choice
- Short Answer

### F3: Student Progress Tracking
**Description:** Real-time analytics on student performance across subjects.

**Metrics Tracked:**
- Engagement percentage
- Vocabulary mastery
- Exercises completed
- Self-corrections made
- Attendance
- Weekly trends
- Historical performance

### F4: UK National Curriculum Integration
**Description:** Full mapping to UK National Curriculum standards.

**Coverage:**
- Key Stage 3 (KS3) standards
- Key Stage 4 (KS4) standards
- Subject-specific learning objectives
- Curriculum unit organization

### F5: ASDAN Qualifications Integration
**Description:** Schema ready for ASDAN certification tracking.

**Tables:**
- asdan_qualifications
- asdan_modules
- asdan_evidence
- asdan_assessments

### F6: AI Timetabling System
**Description:** Intelligent schedule generation based on student performance and engagement patterns.

**Features:**
- 3-day weekly schedule (Mon, Tue, Wed)
- Morning/Afternoon sessions
- Maximum 4 students per group
- AI rationale for scheduling decisions
- Optimization for engagement

---

## Technical Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Routing | Wouter |
| State | TanStack Query (React Query v5) |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL (Neon via Replit) |
| ORM | Drizzle ORM + Drizzle Kit |
| AI | OpenAI GPT-5 (via Replit AI Integrations) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Build | Vite |

### Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── headteacher/     # Headteacher-specific components
│   │   │   │   ├── school-dashboard.tsx
│   │   │   │   ├── cross-subject-analytics.tsx
│   │   │   │   ├── student-trends.tsx
│   │   │   │   ├── teacher-performance.tsx
│   │   │   │   ├── timetable-view.tsx
│   │   │   │   └── engagement-panel.tsx
│   │   │   └── teacher/         # Teacher-specific components
│   │   │       ├── modern-languages-dashboard.tsx
│   │   │       ├── lesson-plans-view.tsx
│   │   │       ├── assessments-view.tsx
│   │   │       ├── curriculum-view.tsx
│   │   │       ├── student-progress-view.tsx
│   │   │       └── persona-switcher.tsx
│   │   ├── pages/
│   │   │   ├── home.tsx
│   │   │   ├── student-daily-schedule.tsx
│   │   │   ├── student-assessments.tsx
│   │   │   ├── teacher-dashboard.tsx
│   │   │   └── headteacher-dashboard.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.tsx
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── auth-middleware.ts
│   └── vite.ts
├── shared/
│   └── schema.ts                # Drizzle schema + types
└── attached_assets/
    └── image_*.png              # Logo and assets
```

### Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Portal selection (Student/Teacher/Headteacher) |
| `/student` | StudentDailySchedule | Student daily learning dashboard |
| `/student/assessments` | StudentAssessments | Interactive quiz/exercise interface |
| `/student/modern-languages` | StudentModernLanguages | Modern Languages specific view |
| `/teacher` | TeacherDashboard | Teacher management portal |
| `/headteacher` | HeadteacherDashboard | School management portal |

---

## Database Schema

### 27-Table PostgreSQL Schema

**User Management:**
- `users` - All system users
- `students` - Student profiles (15 students)
- `teachers` - Teacher profiles (8 teachers + 1 headteacher)

**Curriculum & Subjects:**
- `subjects` - 8 subjects
- `curriculumStandards` - UK National Curriculum standards
- `asdan_qualifications` - ASDAN qualification definitions

**Teaching & Learning:**
- `lessonPlans` - Teacher lesson plans
- `lessonPlanStandards` - Lesson plan to curriculum standard mapping
- `teachingAssignments` - Teacher to subject assignments
- `studentGroups` - Student groupings
- `groupMemberships` - Student to group assignments

**Assessments & Progress:**
- `assessments` - Assessment definitions
- `questions` - Assessment questions
- `responses` - Student responses
- `selfCorrections` - Self-correction tracking
- `vocabularyMastery` - Vocabulary progress
- `engagementMetrics` - Engagement data

**Timetabling:**
- `timetableSlots` - Available time slots
- `timetableAssignments` - Schedule assignments
- `timetableConstraints` - Scheduling rules

**Analytics & Reporting:**
- `studentProgress` - Progress records
- `teacherNotes` - Teacher observations
- `exportReports` - Generated reports

**ASDAN Integration:**
- `asdan_modules` - ASDAN module definitions
- `asdan_evidence` - Student evidence uploads
- `asdan_assessments` - ASDAN assessment records

---

## API Endpoints

### Subject Endpoints
```
GET  /api/subjects              - Get all subjects
GET  /api/subjects/:id          - Get subject by ID
```

### Curriculum Endpoints
```
GET  /api/curriculum/standards/:subjectId  - Get curriculum standards for a subject
GET  /api/curriculum/units                  - Get all curriculum units
```

### Lesson Plan Endpoints
```
GET    /api/lesson-plans/teacher/:teacherId  - Get teacher's lesson plans
POST   /api/lesson-plans                     - Create new lesson plan
DELETE /api/lesson-plans/:id                 - Delete lesson plan
```

### Assessment Endpoints
```
GET  /api/assessments/subject/:subjectId   - Get assessments for a subject
GET  /api/assessments/teacher/:teacherId   - Get teacher's assessments
GET  /api/assessments/:id                  - Get assessment by ID
POST /api/assessments                      - Create new assessment
GET  /api/assessments/:id/questions        - Get assessment questions
```

### Student Exercise Endpoints
```
GET  /api/students/:studentId/responses  - Get student's responses
POST /api/students/responses             - Submit a student response
```

### AI Endpoints
```
POST /api/ai/generate-assessment     - Generate AI assessment
POST /api/ai/evaluate-response       - Evaluate student response with AI
POST /api/ai/generate-recommendation - Generate teaching recommendations
```

### Analytics Endpoints
```
GET /api/analytics/student-progress/:teacherId/:subjectId - Get student progress analytics
```

### Timetabling Endpoints
```
POST /api/timetable/generate      - Generate AI-optimized timetable
GET  /api/timetable/blocks        - Get all timetable blocks
GET  /api/timetable/assignments   - Get assignments for a week
```

### School Management Endpoints
```
GET  /api/school-management/engagement   - Hierarchical engagement data
POST /api/school-management/generate-insights - AI insights for low engagement
GET  /api/teachers                       - List all teachers
```

### Modern Languages Dashboard
```
GET /api/subjects/modern-languages/dashboard/:teacherId - Modern Languages metrics
```

---

## AI Integration

### OpenAI GPT-5 via Replit AI Integrations

**Capabilities:**

1. **Assessment Generation**
   - Subject-specific question generation
   - Multiple question types
   - Difficulty calibration
   - Age-appropriate content (12-16 years)

2. **Response Evaluation**
   - Automatic answer scoring
   - Detailed feedback generation
   - Strengths identification
   - Improvement area suggestions

3. **Recommendation Generation**
   - Teaching strategy recommendations
   - Student-specific interventions
   - Engagement improvement suggestions

4. **Timetable Optimization**
   - Performance-based scheduling
   - Engagement pattern analysis
   - Group composition optimization

**Safety Measures:**
- Subject-specific prompt engineering
- Structured output validation (Zod schemas)
- Fallback handling for API failures
- Content appropriateness filters for ages 12-16

---

## UI/UX Design System

### Branding
- **Name:** Flowency Education (powered by Arnfield Care)
- **Aesthetic:** Nature-inspired, growth-focused
- **Logo:** Arnfield Care logo prominently displayed

### Color Palette
| Usage | Theme |
|-------|-------|
| Primary | Forest greens |
| Secondary | Sky blues |
| Accent | Warm earth tones |
| Success | Green |
| Warning | Yellow/Orange |
| Error | Red |

### Typography
- **Font Family:** Inter (Google Fonts)
- **Heading Sizes:** Responsive (text-xl to text-4xl)
- **Body:** text-sm to text-base

### Component Library
- **Base:** Shadcn UI
- **Icons:** Lucide React
- **Charts:** Recharts

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Sticky headers on mobile
- Horizontal scroll for data tables
- Collapsible sidebars

### Accessibility
- WCAG AA compliance
- Color-blind friendly palette
- Keyboard navigation support
- Screen reader compatible
- Focus indicators

### Dark Mode
- Full dark mode support
- CSS custom properties for theming
- Automatic system preference detection

### Engagement Color Coding
| Range | Color | Label |
|-------|-------|-------|
| 80%+ | Green | Excellent |
| 60-80% | Yellow | Good |
| 40-60% | Orange | Low |
| <40% | Red | Critical |

---

## Security & Authentication

### Role-Based Access Control (RBAC)

**Roles:**
1. **Student** - Access to student portal only
2. **Teacher** - Access to teacher portal + assigned subjects
3. **Headteacher** - Full system access

**Permission Matrix:**
| Resource | Student | Teacher | Headteacher |
|----------|---------|---------|-------------|
| View own progress | Yes | No | Yes |
| Complete assessments | Yes | No | No |
| Create lesson plans | No | Yes | Yes |
| Create assessments | No | Yes | Yes |
| View all students | No | Own subjects | Yes |
| View analytics | No | Own subjects | Yes |
| Manage timetable | No | No | Yes |

### Current Implementation
- Mock authentication for MVP demonstration
- Automatic user assignment based on endpoint paths
- UUID-based user identification

### Security Features
- Session management with express-session
- HTTPS/TLS in production
- Environment variable secret management
- SQL injection protection via Drizzle ORM
- XSS protection via React

---

## Deployment & Infrastructure

### Replit Environment
- **Platform:** Replit
- **Database:** Neon PostgreSQL
- **Runtime:** Node.js
- **Build Tool:** Vite

### Environment Variables
```
DATABASE_URL     - PostgreSQL connection string
PGDATABASE       - Database name
PGHOST           - Database host
PGPASSWORD       - Database password (secret)
PGPORT           - Database port
PGUSER           - Database username
SESSION_SECRET   - Express session secret (secret)
```

### Workflows
- **Start application:** `npm run dev`
  - Starts Express server on port 5000
  - Runs Vite dev server for frontend

### Database Management
- **Push schema:** `npm run db:push`
- **Force push:** `npm run db:push --force`
- **Seed data:** Automatic seeding of demo data

---

## Appendix

### Demo Data

**15 Students:**
Sofia Müller, Liam O'Connor, Aisha Patel, Noah Zhang, Emma Johnson, Oliver Smith, Ava Williams, James Brown, Isabella Davis, Ethan Wilson, Mia Anderson, Lucas Martinez, Charlotte Taylor, Benjamin Lee, Amelia Garcia

**8 Teachers:**
- Mathematics: Mr. James Wilson
- English: Ms. Sarah Thompson
- Modern Languages: Mrs. Sophie Dubois (Default persona)
- Science: Dr. Michael Chen
- History: Mr. Robert Hughes
- Geography: Ms. Emily Carter
- RE: Mrs. Patricia Brown
- PSHC: Mr. David Green

**1 Headteacher:**
- Mrs. Margaret Arnfield

### Mock Engagement Data
All engagement metrics are mocked for instant dashboard loading and compelling demos. Real data integration is ready via the database schema.

### Testing Notes
- Playwright testing available for e2e validation
- Radix UI Select components have testing limitations
- All portals manually verified functional
- data-testid attributes throughout for future automation

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2025 | Initial release with all three portals |
| 1.1 | Nov 2025 | Consolidated School Dashboard with engagement heatmap |
| 1.2 | Nov 2025 | Mobile optimization for heatmap views |
| 1.3 | Nov 2025 | Interactive student assessment interface |

---

*Document generated for Arnfield Care - Flowency Education*

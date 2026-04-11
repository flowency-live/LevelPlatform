# Elevate — Design System (v3)

*A comprehensive design system for UK careers guidance in education*

---

## 1. Design Philosophy

### 1.1 Core Principles

**Guided, not constrained**
Users are led through clear flows without feeling locked into oversimplified patterns. The system supports progression, not just completion. Every screen answers: "What should I do next?"

**Structured flexibility**
Core flows are predictable and learnable. Advanced interactions surface when needed. The system scales with user confidence—a Year 7 student on day one and a Year 11 completing their final review use the same interface, but it reveals complexity progressively.

**Achievement without gamification**
Progress is meaningful, not points. Completing a benchmark isn't a "level up"—it's tangible evidence of growth. Visual celebration is warm, not hyper.

**Accessibility as foundation**
Not an afterthought. Every decision starts with: "Does this work for a student with additional needs using this on their phone?"

### 1.2 Familiar Digital Behaviours

- **Swipe** — Navigate between benchmarks, dismiss cards
- **Tap-to-complete** — Single action to mark done (large touch targets)
- **Pull-to-refresh** — Sync latest data
- **Long-press** — Access secondary actions without cluttering UI
- **Expand/collapse** — Progressive disclosure within cards
- **Inline editing** — Never navigate away to change a value

### 1.3 Progress as First-Class

Progress indicators are:
- **Always visible** — Never hidden behind navigation
- **Always contextual** — "3 of 8 benchmarks" not "37.5%"
- **Behaviour-driving** — Suggests what to do next
- **Celebratory but calm** — Acknowledges achievement without excessive animation

---

## 2. Visual Identity

### 2.1 Brand Essence

**Warm Institutional** — The calm credibility of a well-funded public institution combined with the approachable warmth of a progressive learning environment. Professional enough for Ofsted, welcoming enough for a nervous Year 7.

### 2.2 Colour Architecture

The system uses **four colour layers** that don't compete:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. TENANT BRAND          Customisable per school/organisation  │
│    Header, logo, primary buttons                                │
├─────────────────────────────────────────────────────────────────┤
│ 2. FRAMEWORK THEMES      Fixed — represents the frameworks      │
│    Gatsby (Blue) · ASDAN (Green) · Individual (Peach/Orange)   │
├─────────────────────────────────────────────────────────────────┤
│ 3. PERSONA ACCENTS       Differentiates user roles              │
│    Student (Blue) · Teacher (Teal) · Management (Slate)        │
├─────────────────────────────────────────────────────────────────┤
│ 4. SYSTEM NEUTRALS       Consistent across all contexts         │
│    Backgrounds, text, borders, status colours                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Layer 1: Tenant Brand (Customisable)

Each tenant can apply their own brand colours. Default uses Arnfield Care palette:

```css
:root {
  /* Arnfield Care — Default Tenant Theme */
  --tenant-primary: #2F5D50;        /* Dark teal — from logo letterform */
  --tenant-primary-dark: #1E3D35;   /* Hover states */
  --tenant-secondary: #6B9B8A;      /* Grey-green — from logo circle */
  --tenant-accent: #A8D5C9;         /* Light mint — from logo triangle */

  /* Tenant colours are used for: */
  /* - App header/navbar */
  /* - Primary action buttons */
  /* - Brand moments (login, welcome) */
}

/* Future tenants override these values */
/* Example: Another school might use: */
/* --tenant-primary: #1E3A8A; (navy) */
/* --tenant-accent: #FBBF24; (gold) */
```

**Tenant colour usage:**
- Header bar background: `--tenant-primary`
- Primary buttons: `--tenant-primary`
- Logo placement: Tenant-supplied
- Welcome/login screens: Tenant colours
- Footer: `--tenant-primary` or neutral

---

### 2.4 Layer 2: Framework Themes (Fixed)

These colours represent the **three frameworks** and should NEVER change:

```css
:root {
  /* GATSBY BENCHMARKS — Blue family */
  /* The UK statutory careers framework */
  --gatsby-primary: #3B82F6;        /* Blue-500 */
  --gatsby-dark: #2563EB;           /* Blue-600 */
  --gatsby-light: #93C5FD;          /* Blue-300 */
  --gatsby-bg: #EFF6FF;             /* Blue-50 */
  --gatsby-border: #BFDBFE;         /* Blue-200 */

  /* ASDAN — Green family */
  /* Qualification/accreditation framework */
  --asdan-primary: #22C55E;         /* Green-500 */
  --asdan-dark: #16A34A;            /* Green-600 */
  --asdan-light: #86EFAC;           /* Green-300 */
  --asdan-bg: #F0FDF4;              /* Green-50 */
  --asdan-border: #BBF7D0;          /* Green-200 */

  /* INDIVIDUAL/SELF-DEVELOPMENT — Peach/Orange family */
  /* Personal development, targets, reflections */
  --individual-primary: #F97316;    /* Orange-500 */
  --individual-dark: #EA580C;       /* Orange-600 */
  --individual-light: #FDBA74;      /* Orange-300 */
  --individual-bg: #FFF7ED;         /* Orange-50 */
  --individual-border: #FED7AA;     /* Orange-200 */
}
```

**Framework colour usage:**

| Framework | Used For |
|-----------|----------|
| **Gatsby (Blue)** | GB1-GB8 benchmark cards, progress rings, benchmark headers |
| **ASDAN (Green)** | Qualification badges, credit indicators, ASDAN-linked activities |
| **Individual (Orange)** | SMART targets, personal reflections, self-assessment, employer log |

**Visual example:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ▌ GB3: Addressing Individual Needs         [━━━━━━━━━━] 75%    │
│ ▌                                                    GATSBY    │
├─────────────────────────────────────────────────────────────────┤
│   ☑ Discuss goals with tutor              ✓ ASDAN: Self-Review │
│   ☑ Complete personal profile                                  │
│   ☐ Attend 1:1 careers guidance                                │
└─────────────────────────────────────────────────────────────────┘
       │                                            │
       │ Blue left border = Gatsby                  │ Green badge = ASDAN
```

---

### 2.5 Layer 3: Persona Accents (Role Differentiation)

Different roles see different accent colours to reinforce context:

```css
:root {
  /* STUDENT — Friendly, approachable */
  --persona-student: #3B82F6;       /* Blue-500 — matches Gatsby */
  --persona-student-bg: #EFF6FF;    /* Blue-50 */

  /* TEACHER / CARE STAFF — Supportive, professional */
  --persona-teacher: #14B8A6;       /* Teal-500 */
  --persona-teacher-bg: #F0FDFA;    /* Teal-50 */

  /* MANAGEMENT / LEADERSHIP — Authority, oversight */
  --persona-management: #64748B;    /* Slate-500 */
  --persona-management-bg: #F8FAFC; /* Slate-50 */
}
```

**How personas manifest:**

| Element | Student | Teacher | Management |
|---------|---------|---------|------------|
| Nav active indicator | Blue | Teal | Slate |
| Avatar ring | Blue | Teal | Slate |
| Action button (secondary) | Blue | Teal | Slate |
| Dashboard card accent | Blue | Teal | Slate |
| Empty state illustrations | Warmer | Neutral | Data-focused |

**The persona colour is subtle** — it reinforces "where am I?" without dominating the UI.

---

### 2.6 Layer 4: System Neutrals (Consistent)

These never change across tenants or personas:

```css
:root {
  /* Text */
  --text-primary: #1F2937;          /* Gray-800 — headings, body */
  --text-secondary: #4B5563;        /* Gray-600 — supporting text */
  --text-muted: #9CA3AF;            /* Gray-400 — placeholders, disabled */
  --text-inverse: #FFFFFF;          /* On dark backgrounds */

  /* Surfaces */
  --surface-page: #F9FAFB;          /* Gray-50 — page background */
  --surface-card: #FFFFFF;          /* White — cards, inputs */
  --surface-elevated: #FFFFFF;      /* Modals, dropdowns */
  --surface-overlay: rgba(0,0,0,0.5); /* Behind modals */

  /* Borders */
  --border-default: #E5E7EB;        /* Gray-200 — cards, dividers */
  --border-strong: #D1D5DB;         /* Gray-300 — inputs, emphasis */

  /* Status — these override all other colours when showing state */
  --status-success: #22C55E;        /* Green-500 */
  --status-success-bg: #F0FDF4;
  --status-warning: #F59E0B;        /* Amber-500 */
  --status-warning-bg: #FFFBEB;
  --status-error: #EF4444;          /* Red-500 */
  --status-error-bg: #FEF2F2;
  --status-info: #3B82F6;           /* Blue-500 */
  --status-info-bg: #EFF6FF;

  /* Progress States */
  --state-not-started: #9CA3AF;     /* Gray-400 */
  --state-in-progress: #3B82F6;     /* Blue-500 */
  --state-complete: #22C55E;        /* Green-500 */
  --state-needs-review: #F59E0B;    /* Amber-500 */
}
```

---

### 2.7 Gatsby Benchmark Colours (Within Blue Family)

All 8 benchmarks use the **Gatsby blue** as their base, but each has a subtle variation for differentiation in heatmaps:

```css
:root {
  /* GB colours — variations within blue family */
  /* Used for heatmap cells when showing all 8 at once */
  --gb1: #3B82F6;   /* Blue-500 — Stable Careers Programme */
  --gb2: #60A5FA;   /* Blue-400 — Learning from Career & LMI */
  --gb3: #2563EB;   /* Blue-600 — Addressing Individual Needs */
  --gb4: #1D4ED8;   /* Blue-700 — Linking Curriculum to Careers */
  --gb5: #3B82F6;   /* Blue-500 — Encounters with Employers */
  --gb6: #1E40AF;   /* Blue-800 — Workplace Experiences */
  --gb7: #60A5FA;   /* Blue-400 — Encounters with FE/HE */
  --gb8: #2563EB;   /* Blue-600 — Personal Guidance */
}
```

**In practice:** When viewing a single benchmark, use `--gatsby-primary`. When viewing all 8 in a heatmap, use the GB-specific variants for visual differentiation, combined with the benchmark number label.

---

### 2.8 Colour Layers in Practice

**Student Dashboard — showing all layers:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← TENANT (Arnfield teal)
│ 🏠 Arnfield Care              Emma Wilson      [Profile]       │   Header bar
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  My Career Plan                    Overall: 62% complete        │ ← SYSTEM (neutral text)
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▌ GB1: A Stable Careers Programme    [━━━━━━━━━] 4/5   │   │ ← GATSBY (blue border)
│  │ ▌                                                       │   │
│  │ ▌  ☑ Attend careers week         ✓ ASDAN              │   │ ← ASDAN (green badge)
│  │ ▌  ☑ Termly check-ins                                  │   │
│  │ ▌  ☑ Know careers adviser                              │   │
│  │ ▌  ☑ Complete career plan                              │   │
│  │ ▌  ☐ Set SMART targets            ★ Individual        │   │ ← INDIVIDUAL (orange tag)
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ★ My SMART Targets                              2 of 3 │   │ ← INDIVIDUAL (orange section)
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Research 3 healthcare careers        [━━━━━━] 2/3  │ │   │
│  │ │ Due: April 2026                                     │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🏠 Home    📊 Plan    🎯 Targets    👤 Profile                │ ← PERSONA (student blue)
│     ●                                                           │   Active indicator
└─────────────────────────────────────────────────────────────────┘
```

**Teacher Dashboard — different persona accent:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← TENANT (same Arnfield teal)
│ 🏠 Arnfield Care              Ms Smith         [Staff]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Year 10 Progress                       25 students             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         GB1   GB2   GB3   GB4   GB5   GB6   GB7   GB8   │   │ ← GATSBY (blue headers)
│  │ Emma    ███   ███   ▒▒▒   ▒▒▒   ░░░   ░░░   ▒▒▒   ███   │   │
│  │ Jack    ▒▒▒   ▒▒▒   ▒▒▒   ░░░   ░░░   ░░░   ░░░   ░░░   │   │ ← PROGRESS (red→green)
│  │ Sophie  ███   ███   ███   ███   ▒▒▒   ▒▒▒   ███   ███   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Legend: ███ Complete  ▒▒▒ In Progress  ░░░ Not Started        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📊 Dashboard   👥 Students   ✓ Reviews    ⚙ Settings          │ ← PERSONA (teacher teal)
│        ●                                                        │   Active indicator
└─────────────────────────────────────────────────────────────────┘
```

**Key principle:** The TENANT colour stays consistent (header), FRAMEWORK colours identify the content type, PERSONA colours identify the user context, and SYSTEM colours handle everything else.

---

## 3. Typography

### 3.1 Font Stack

**Primary: Source Sans 3**
A humanist sans-serif with excellent readability at all sizes. Professional but not cold. Strong accessibility credentials.

**Fallback: system-ui**
For performance and native feel on mobile.

```css
:root {
  --font-primary: 'Source Sans 3', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

**Why not Inter?** Inter is excellent but ubiquitous. Source Sans 3 has similar legibility with slightly more character. It was designed for UI readability and has strong Latin support for UK names.

### 3.2 Type Scale

Mobile-first scale with responsive adjustments:

```css
:root {
  /* Mobile Base */
  --text-xs: 0.75rem;     /* 12px — Timestamps, metadata */
  --text-sm: 0.875rem;    /* 14px — Secondary text, labels */
  --text-base: 1rem;      /* 16px — Body text, inputs */
  --text-lg: 1.125rem;    /* 18px — Lead text, card titles */
  --text-xl: 1.25rem;     /* 20px — Section headers */
  --text-2xl: 1.5rem;     /* 24px — Page titles (mobile) */
  --text-3xl: 1.875rem;   /* 30px — Page titles (desktop) */
  --text-4xl: 2.25rem;    /* 36px — Dashboard hero numbers */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 3.3 Typography Rules

**Line Length**
- Maximum 65–75 characters for body text
- On mobile: full width minus padding is acceptable
- Activity descriptions: 2 lines max, truncate with expansion

**Hierarchy**
- One H1 per page
- Clear visual distinction between levels
- Never skip heading levels (H1 → H3)

**Dense Text**
- Avoid paragraphs over 3 lines on mobile
- Break content into scannable chunks
- Use bullet points for lists of 3+ items

**Numbers**
- Use tabular figures for data alignment
- Large numbers: use separators (1,234 not 1234)
- Progress: "3 of 8" not "3/8" or "37.5%"

---

## 4. Layout & Spatial System

### 4.1 Spacing Scale

8px base unit, following a modified harmonic scale:

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px — Icon padding, tight gaps */
  --space-2: 0.5rem;    /* 8px — Inline spacing, small gaps */
  --space-3: 0.75rem;   /* 12px — Component internal padding */
  --space-4: 1rem;      /* 16px — Standard padding, gaps */
  --space-5: 1.25rem;   /* 20px — Card padding */
  --space-6: 1.5rem;    /* 24px — Section gaps */
  --space-8: 2rem;      /* 32px — Large section gaps */
  --space-10: 2.5rem;   /* 40px — Page section separation */
  --space-12: 3rem;     /* 48px — Major divisions */
  --space-16: 4rem;     /* 64px — Hero spacing */
}
```

### 4.2 Grid System

**Mobile (default):** 4 columns, 16px gutters, 16px edge margins
**Tablet (768px+):** 8 columns, 24px gutters, 24px edge margins
**Desktop (1024px+):** 12 columns, 24px gutters, auto margins
**Max content width:** 1200px

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-6);
  }
}
```

### 4.3 Page Structure

Every page follows this hierarchy:

```
┌─────────────────────────────────────────┐
│ Header (sticky on mobile)                │
├─────────────────────────────────────────┤
│ Page Title + Progress Indicator          │
├─────────────────────────────────────────┤
│ Primary Action Zone                      │
│ (What can I do right now?)               │
├─────────────────────────────────────────┤
│ Main Content                             │
│ (Cards, lists, forms)                    │
├─────────────────────────────────────────┤
│ Supporting Information                   │
│ (History, related items)                 │
├─────────────────────────────────────────┤
│ Navigation (fixed bottom on mobile)      │
└─────────────────────────────────────────┘
```

### 4.4 Touch Targets

**Minimum sizes (WCAG 2.5.5):**
- Interactive elements: 44×44px minimum
- Buttons: 48px height, 44px minimum width
- List items: 56px minimum height
- Spacing between targets: 8px minimum

**Thumb Zone (mobile):**
- Primary actions: bottom third of screen
- Navigation: fixed bottom bar
- Destructive actions: require confirmation, not in thumb zone

---

## 5. Surface & Elevation

### 5.1 Card System

Cards are the primary content container. They use subtle elevation through border and shadow rather than heavy drop shadows.

```css
:root {
  /* Border Radii */
  --radius-sm: 0.375rem;   /* 6px — Buttons, inputs */
  --radius-md: 0.5rem;     /* 8px — Small cards, tags */
  --radius-lg: 0.75rem;    /* 12px — Standard cards */
  --radius-xl: 1rem;       /* 16px — Modal, large cards */
  --radius-full: 9999px;   /* Pills, avatars */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-focus: 0 0 0 3px var(--elevate-sage-light);
}

/* Standard Card */
.card {
  background: var(--elevate-white);
  border: 1px solid var(--elevate-mist);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* Interactive Card */
.card-interactive {
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.card-interactive:hover {
  border-color: var(--elevate-sage);
  box-shadow: var(--shadow-md);
}

.card-interactive:focus-visible {
  outline: none;
  border-color: var(--elevate-forest);
  box-shadow: var(--shadow-focus);
}
```

### 5.2 Elevation Hierarchy

1. **Base layer:** Page background (`--elevate-cloud`)
2. **Content layer:** Cards, inputs (`--elevate-white` + border)
3. **Overlay layer:** Dropdowns, tooltips (shadow-lg)
4. **Modal layer:** Dialogs, sheets (fixed + backdrop blur)

**Rule:** Never use more than one shadow weight in the same view. Pick a level and stay there.

---

## 6. Components

### 6.1 Activity Block

The core interaction unit. Students mark activities complete here.

```
┌─────────────────────────────────────────────────┐
│ ○ ─────────────────────────────────────── □     │
│ ◯ Activity title goes here                  ▾   │
│   Completed 15 Mar 2026 · 📷 2 photos          │
└─────────────────────────────────────────────────┘
     │                                        │
     │                                        └── Expand toggle
     └── Checkbox (44×44 touch target)

Expanded state:
┌─────────────────────────────────────────────────┐
│ ● Activity title goes here                  ▴   │
│   Completed 15 Mar 2026 · 📷 2 photos          │
├─────────────────────────────────────────────────┤
│ Photos                                          │
│ ┌───────┐ ┌───────┐ ┌─────────┐                │
│ │       │ │       │ │  + Add  │                │
│ │  📷   │ │  📷   │ │         │                │
│ └───────┘ └───────┘ └─────────┘                │
├─────────────────────────────────────────────────┤
│ My reflection                                   │
│ "I learned about different jobs..."            │
│                                    [Edit]       │
├─────────────────────────────────────────────────┤
│ Staff note                                      │
│ "Good engagement" — Ms Smith, 15 Mar           │
└─────────────────────────────────────────────────┘
```

**States:**
- Not started: Empty checkbox, muted text
- In progress: Has evidence but not marked complete
- Complete: Filled checkbox (✓), full contrast
- Needs review: Amber indicator, staff action required

### 6.2 Progress Ring

Circular progress for benchmark completion. Used on dashboard cards.

```
     ╭───────╮
   ╱           ╲
  │     75%     │    ← Percentage in centre
  │    ━━━━     │    ← Fraction below (6 of 8)
   ╲           ╱
     ╰───────╯
```

- Ring stroke: 8px (thicker for larger sizes)
- Background stroke: `--elevate-mist`
- Progress stroke: Benchmark colour
- Animation: Smooth fill on load (0.6s ease-out)

### 6.3 Benchmark Card

Dashboard summary of one benchmark.

```
┌─────────────────────────────────────────────────┐
│ ▌GB1                                            │
│ ▌                                               │
│ ▌ A Stable Careers       ╭─────╮               │
│ ▌ Programme              │ 75% │               │
│ ▌                        │ 6/8 │               │
│ ▌                        ╰─────╯               │
│                                                 │
│ ▸ Next: Attend careers assembly                │
└─────────────────────────────────────────────────┘
     │
     └── Coloured left border (benchmark colour)
```

- Left border: 4px, benchmark primary colour
- Card background: White (or benchmark muted on hover)
- "Next" action: Most impactful incomplete activity

### 6.4 Evidence Capture

Mobile-optimised evidence collection.

```
┌─────────────────────────────────────────────────┐
│            Add Evidence                         │
├─────────────────────────────────────────────────┤
│                                                 │
│     ┌─────────────┐    ┌─────────────┐         │
│     │             │    │             │         │
│     │   📷 Photo  │    │   🎤 Voice  │         │
│     │             │    │             │         │
│     └─────────────┘    └─────────────┘         │
│                                                 │
│     ┌─────────────┐    ┌─────────────┐         │
│     │             │    │             │         │
│     │   📄 File   │    │   ✍️ Note   │         │
│     │             │    │             │         │
│     └─────────────┘    └─────────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
```

- 2×2 grid, large touch targets (minimum 88×88px)
- Photo opens camera immediately (iOS/Android native)
- Voice shows recording interface with waveform
- File opens system picker
- Note opens inline text input

### 6.5 SMART Target Card

Goal tracking with clear progress.

```
┌─────────────────────────────────────────────────┐
│ Target 1 of 3                          Due: Apr │
├─────────────────────────────────────────────────┤
│ Research 3 careers in healthcare               │
│                                                 │
│ Progress ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2 of 3  │
│                                                 │
│ ☑ Research GP role                             │
│ ☑ Research nursing role                        │
│ ☐ Research physiotherapy role                  │
│                                                 │
│ [Mark step complete]              [Add note]   │
└─────────────────────────────────────────────────┘
```

### 6.6 Staff Heatmap Cell

For teacher/admin views showing student × benchmark grid.

The heatmap uses **progress-based colours** (not framework colours):

```css
/* Heatmap colour scale — progress states */
.heatmap-cell {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

/* Not started */
.heatmap-cell[data-progress="0"] {
  background: #F3F4F6; /* Gray-100 */
  color: #6B7280;      /* Gray-500 */
}

/* Just begun — needs attention */
.heatmap-cell[data-progress="1-25"] {
  background: #FEE2E2; /* Red-100 */
  color: #991B1B;      /* Red-800 */
}

/* Early progress */
.heatmap-cell[data-progress="26-50"] {
  background: #FED7AA; /* Orange-200 */
  color: #9A3412;      /* Orange-800 */
}

/* Good progress */
.heatmap-cell[data-progress="51-75"] {
  background: #FEF08A; /* Yellow-200 */
  color: #854D0E;      /* Yellow-800 */
}

/* Nearly there */
.heatmap-cell[data-progress="76-99"] {
  background: #BBF7D0; /* Green-200 */
  color: #166534;      /* Green-800 */
}

/* Complete */
.heatmap-cell[data-progress="100"] {
  background: var(--status-success); /* Green-500 */
  color: white;
}
```

**Heatmap header row uses Gatsby blue** (since it's showing benchmark columns):

```css
.heatmap-header {
  background: var(--gatsby-bg);
  color: var(--gatsby-dark);
  font-weight: var(--font-semibold);
}
```

---

## 7. Interaction & Motion

### 7.1 Principles

**Purposeful, not decorative**
Every animation serves a function: confirming action, showing relationship, or guiding attention.

**Fast and responsive**
Mobile users expect immediate feedback. Keep durations short.

**Reduced motion**
Respect `prefers-reduced-motion`. Fall back to opacity transitions only.

### 7.2 Timing

```css
:root {
  --duration-instant: 100ms;   /* Button press, checkbox */
  --duration-fast: 200ms;      /* Hover states, small changes */
  --duration-normal: 300ms;    /* Card expand, modal enter */
  --duration-slow: 500ms;      /* Page transitions, celebrations */

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 7.3 Standard Transitions

**Hover/Focus:**
```css
.interactive {
  transition:
    background-color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}
```

**Expand/Collapse:**
```css
.expandable-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-normal) var(--ease-default);
}

.expandable-content[data-expanded="true"] {
  grid-template-rows: 1fr;
}
```

**Checkbox completion:**
```css
.checkbox-complete {
  animation: complete var(--duration-fast) var(--ease-bounce);
}

@keyframes complete {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

### 7.4 Celebration Moments

When a student completes a benchmark (all 8 activities done):

- Progress ring fills to 100% (0.6s ease-out)
- Brief scale pulse on the card (0.3s)
- Subtle confetti or sparkle effect (CSS-only, 1s)
- "Benchmark Complete" toast notification

**Not excessive. Not gamified. Just acknowledging achievement.**

### 7.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Navigation

### 8.1 Student Navigation

**Mobile:** Fixed bottom tab bar (4 items max)

```
┌───────────┬───────────┬───────────┬───────────┐
│  🏠 Home  │ 📊 Plan   │ 🎯 Goals  │ 👤 Me     │
└───────────┴───────────┴───────────┴───────────┘
```

- 56px height
- Icons above labels
- Active state: filled icon + colour highlight
- Badge indicators for pending actions

**Desktop:** Left sidebar, collapsible

### 8.2 Staff Navigation

**Tabs within header** (more navigation items needed):

- Dashboard
- Students
- Reviews
- Reports
- Settings

**Plus:** Role/persona switcher dropdown

### 8.3 Breadcrumbs (Staff Only)

For drill-down views:

```
School Dashboard › Year 10 › Emma Wilson › GB3
```

Always show path back. Never more than 4 levels.

---

## 9. Forms & Inputs

### 9.1 Text Input

```css
.input {
  width: 100%;
  height: 48px;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  background: var(--elevate-white);
  border: 1px solid var(--elevate-mist);
  border-radius: var(--radius-sm);
  transition: border-color var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
}

.input:focus {
  outline: none;
  border-color: var(--elevate-forest);
  box-shadow: var(--shadow-focus);
}

.input::placeholder {
  color: var(--elevate-stone);
}

.input:disabled {
  background: var(--elevate-cloud);
  cursor: not-allowed;
}

.input[aria-invalid="true"] {
  border-color: var(--status-error);
}
```

### 9.2 Buttons

**Primary:**
```css
.btn-primary {
  height: 48px;
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: white;
  background: var(--elevate-forest);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.btn-primary:hover {
  background: var(--elevate-forest-dark);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.btn-primary:disabled {
  background: var(--elevate-stone);
  cursor: not-allowed;
}
```

**Secondary:**
```css
.btn-secondary {
  background: transparent;
  color: var(--elevate-forest);
  border: 1px solid var(--elevate-forest);
}

.btn-secondary:hover {
  background: var(--elevate-sage-light);
}
```

**Ghost:**
```css
.btn-ghost {
  background: transparent;
  color: var(--elevate-graphite);
  border: none;
}

.btn-ghost:hover {
  background: var(--elevate-mist);
}
```

### 9.3 Checkbox

Large touch target, clear states:

```css
.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--elevate-stone);
  border-radius: var(--radius-sm);
  transition: all var(--duration-instant) var(--ease-default);
}

/* Touch target wrapper */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.checkbox:checked {
  background: var(--status-success);
  border-color: var(--status-success);
}

.checkbox:checked::after {
  content: '✓';
  color: white;
  font-size: 16px;
}
```

---

## 10. Accessibility (WCAG 2.1 AA+)

### 10.1 Colour Contrast

All text must meet minimum contrast ratios:
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px or 14px bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

**Verified combinations:**
- `--elevate-ink` on `--elevate-white`: 12.6:1 ✓
- `--elevate-ink` on `--elevate-cloud`: 11.2:1 ✓
- `--elevate-graphite` on `--elevate-white`: 7.1:1 ✓
- `--elevate-forest` on `--elevate-white`: 5.9:1 ✓
- White on `--elevate-forest`: 5.9:1 ✓

### 10.2 Focus Management

**Visible focus states:** Every interactive element has `:focus-visible` styling
**Focus order:** Logical tab order following visual layout
**Focus trapping:** Modals trap focus; Escape closes
**Skip links:** "Skip to main content" link on every page

### 10.3 Screen Reader Support

- Semantic HTML throughout (nav, main, section, article)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic updates
- Form labels properly associated
- Error messages linked to inputs

### 10.4 Keyboard Navigation

- All functionality available via keyboard
- No keyboard traps
- Escape closes overlays
- Arrow keys navigate within components (tabs, menus)
- Enter/Space activate buttons and checkboxes

### 10.5 Content Accessibility

- Reading level appropriate for age 12+ (SEN consideration)
- Short sentences, clear language
- Icons paired with text labels
- No information conveyed by colour alone
- Captions for video content

---

## 11. Mobile Experience

### 11.1 Touch Interactions

**Primary gestures:**
- Tap: Select, activate
- Swipe horizontal: Navigate between benchmarks
- Swipe down: Pull to refresh
- Long press: Secondary actions (share, edit, delete)

**Touch target requirements:**
- All interactive elements: 44×44px minimum
- Buttons: 48px height
- List items: 56px minimum height
- Spacing between targets: 8px minimum

### 11.2 Bottom Sheet Pattern

For actions, filters, and detail views on mobile:

```
┌─────────────────────────────────────────────────┐
│ ═══════                                         │ ← Drag handle
├─────────────────────────────────────────────────┤
│ Add Evidence                            ✕ Close │
├─────────────────────────────────────────────────┤
│                                                 │
│ Content...                                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

- Drag to dismiss
- Tap outside to close (with scrim)
- Fixed action button at bottom if needed

### 11.3 Offline Support

PWA capabilities:
- Offline indicator in header
- Queue evidence captures locally
- Sync indicator when reconnected
- Clear messaging about offline state

---

## 12. Voice & Tone

### 12.1 Writing Principles

**Direct:** Say what you mean. "Mark as done" not "Would you like to mark this as complete?"

**Action-led:** Lead with verbs. "Add evidence" not "Evidence can be added here."

**Encouraging:** Acknowledge effort. "Nice work!" not "Task completed."

**Clear:** No jargon. "Your careers plan" not "Your GB framework progress."

### 12.2 UI Copy Examples

| Context | Good | Avoid |
|---------|------|-------|
| Empty state | "No activities yet. Let's add one!" | "No data to display" |
| Success | "Done! That's 3 of 4 complete." | "Activity marked as complete" |
| Error | "Couldn't save. Try again?" | "Error 500: Server failure" |
| Prompt | "What did you learn?" | "Enter reflection text" |
| Help | "Photos help show what you did" | "Evidence documentation" |

### 12.3 Reading Level

Target reading age: 11-12 years (UK Year 7)

- Short sentences (max 20 words)
- Common words over technical terms
- Active voice
- One idea per sentence

---

## 13. Role-Specific Patterns

### 13.1 Students (`--persona-student`: Blue)

**Visual identity:**
- Nav active indicator: Blue underline
- Progress rings: Match framework (Gatsby blue, ASDAN green, Individual orange)
- Empty states: Warm, encouraging illustrations
- Avatar ring: Blue

**Design priorities:**
- Large touch targets (thumb-friendly, 48px minimum)
- Visual progress indicators (rings > bars > numbers)
- Immediate feedback on actions (checkmark animation)
- Celebration moments (subtle, not gamified)
- Simple language (Year 7 reading level)

**Key patterns:**
- Dashboard shows "What's next" prominently
- Activities are checkbox-first (tap to complete)
- Evidence capture is camera-first (opens native camera)
- Voice input available everywhere (tap-to-record)
- One action per screen on mobile

**Information density:** Low — one primary action visible at a time

### 13.2 Teachers / Care Staff (`--persona-teacher`: Teal)

**Visual identity:**
- Nav active indicator: Teal underline
- Action buttons (secondary): Teal outline
- Student cards: Neutral with teal hover accent
- Avatar ring: Teal

**Design priorities:**
- Efficiency for repeated tasks
- Batch actions (select multiple students)
- Quick student switching (dropdown or sidebar)
- At-a-glance progress views (heatmap)
- Note-taking speed (keyboard shortcuts)

**Key patterns:**
- Heatmap overview of all students × benchmarks
- Drill-down from overview to individual detail
- Bulk "mark attended" for careers events
- Quick add notes (Cmd/Ctrl + N)
- Filter and sort student lists
- Persona switcher if user has multiple roles

**Information density:** Medium — show overview with drill-down capability

### 13.3 School Leadership (`--persona-management`: Slate)

**Visual identity:**
- Nav active indicator: Slate underline
- Dashboard cards: White with slate borders
- Charts: Slate/gray colour scheme with framework accents
- Avatar ring: Slate

**Design priorities:**
- High-level metrics first
- Trend visibility (week-over-week, term-over-term)
- Ofsted evidence generation (one-click)
- Cross-cohort/cross-location comparison
- Export capabilities (PDF, CSV)

**Key patterns:**
- Dashboard cards with headline numbers
- Time-series charts (completion trends)
- Benchmark compliance percentage scores
- At-risk student alerts (automatic flagging)
- One-click PDF reports (Ofsted-ready)
- Drill-down hierarchy: School → Location → Cohort → Student

**Information density:** High — dense data views, tables, multiple metrics visible

---

## 14. Data Visualisation

### 14.1 Progress Rings

Circular progress for individual benchmarks:
- Stroke width: 8px (12px for large)
- Background: `--elevate-mist`
- Fill: Benchmark colour
- Centre: Percentage + fraction

### 14.2 Heatmaps

Student × Benchmark grid for staff:
- Cell size: 48×48px minimum
- Colour scale: Grey → Red → Orange → Yellow → Light Green → Green
- Hover: Show student name + percentage
- Click: Navigate to student/benchmark detail

### 14.3 Bar Charts

Benchmark completion by cohort:
- Horizontal bars (better for long labels)
- Sorted by completion (highest first)
- Benchmark colours
- Labels inside or outside based on width

### 14.4 Trend Lines

Progress over time:
- Simple line chart
- X-axis: Weeks/months
- Y-axis: Percentage (0-100)
- Benchmark colour for line
- Light fill under line

---

## 15. Implementation Notes

### 15.1 CSS Custom Properties

All design tokens are CSS custom properties. This enables:
- Runtime theming
- Easy updates
- Dark mode potential
- Component encapsulation

### 15.2 Tailwind Mapping

If using Tailwind, extend the config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Layer 1: Tenant (CSS variables for runtime theming)
        tenant: {
          primary: 'var(--tenant-primary)',
          'primary-dark': 'var(--tenant-primary-dark)',
          secondary: 'var(--tenant-secondary)',
          accent: 'var(--tenant-accent)',
        },

        // Layer 2: Framework Themes (fixed)
        gatsby: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#93C5FD',
          bg: '#EFF6FF',
          border: '#BFDBFE',
        },
        asdan: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
          light: '#86EFAC',
          bg: '#F0FDF4',
          border: '#BBF7D0',
        },
        individual: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FDBA74',
          bg: '#FFF7ED',
          border: '#FED7AA',
        },

        // Layer 3: Persona Accents
        persona: {
          student: '#3B82F6',
          'student-bg': '#EFF6FF',
          teacher: '#14B8A6',
          'teacher-bg': '#F0FDFA',
          management: '#64748B',
          'management-bg': '#F8FAFC',
        },

        // Layer 4: System (uses Tailwind gray scale)
        // gray-50 through gray-900 already available
      },
      fontFamily: {
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
}
```

**Usage examples:**
```jsx
// Tenant-branded header
<header className="bg-tenant-primary text-white">

// Gatsby benchmark card
<div className="border-l-4 border-gatsby bg-gatsby-bg">

// ASDAN badge
<span className="bg-asdan-bg text-asdan-dark border border-asdan-border">

// Individual/self-development target
<div className="bg-individual-bg border-individual">

// Persona-specific accent
<nav className="border-b-2 border-persona-teacher">
```
```

### 15.3 Component Library

Recommended structure:
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Checkbox.tsx
│   └── ProgressRing.tsx
├── benchmark/
│   ├── BenchmarkCard.tsx
│   ├── ActivityBlock.tsx
│   └── BenchmarkGrid.tsx
├── evidence/
│   ├── EvidenceCapture.tsx
│   ├── PhotoUpload.tsx
│   └── VoiceRecorder.tsx
└── layout/
    ├── PageHeader.tsx
    ├── BottomNav.tsx
    └── Container.tsx
```

---

## 16. Design Checklist

Before shipping any screen, verify:

**Accessibility**
- [ ] Colour contrast passes (4.5:1 minimum)
- [ ] Focus states visible
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Touch targets 44×44px+

**Mobile**
- [ ] Thumb-friendly action placement
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Forms work with mobile keyboard
- [ ] Bottom nav doesn't overlap content

**Content**
- [ ] Language is Year 7 reading level
- [ ] Actions are clear
- [ ] Error messages are helpful
- [ ] Empty states guide user

**Visual**
- [ ] Consistent spacing
- [ ] Typography hierarchy clear
- [ ] Brand colours used correctly
- [ ] Benchmark colours applied consistently
- [ ] No orphaned elements

---

## 17. Summary

Elevate's design system prioritises:

1. **Accessibility first** — Every student can use this
2. **Progress visibility** — Always know where you are
3. **Action clarity** — Always know what to do next
4. **Mobile excellence** — Works brilliantly on a phone
5. **Professional warmth** — Credible for Ofsted, welcoming for students

The visual language is calm and institutional but never cold. Progress feels meaningful, not gamified. The interface gets out of the way and lets students focus on their career journey.

---

*Version 3.0 — March 2026*
*Elevate by OpStack*

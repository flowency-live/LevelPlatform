/**
 * Shared TypeScript interfaces for Student domain.
 * Used by both backend (domain entities) and frontend (UI components).
 */

// ============================================================================
// Value Object Types (branded strings for type safety)
// ============================================================================

export type StudentId = string & { readonly _brand: 'StudentId' };
export type TenantId = string & { readonly _brand: 'TenantId' };
export type LocationId = string & { readonly _brand: 'LocationId' };
export type SubdivisionId = string & { readonly _brand: 'SubdivisionId' };
export type BenchmarkId = 'GB1' | 'GB2' | 'GB3' | 'GB4' | 'GB5' | 'GB6' | 'GB7' | 'GB8';
export type ActivityId = string & { readonly _brand: 'ActivityId' };

// ============================================================================
// Enums
// ============================================================================

export type CompletionStatus = 'not-started' | 'in-progress' | 'complete';

export type EvidenceType = 'photo' | 'voice' | 'document';

export type Role = 'student' | 'teacher' | 'admin' | 'management';

// ============================================================================
// Core Interfaces
// ============================================================================

export interface Student {
  id: StudentId;
  firstName: string;
  lastName: string;
  email: string;
  tenantId: TenantId;
  locationId: LocationId;
  subdivisionId: SubdivisionId;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Activity {
  id: ActivityId;
  benchmarkId: BenchmarkId;
  name: string;
  description: string;
  order: number;
}

export interface ActivityCompletion {
  activityId: ActivityId;
  completedAt: string; // ISO 8601
  evidence?: Evidence[];
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  url: string;
  caption?: string;
  uploadedAt: string; // ISO 8601
}

export interface BenchmarkProgress {
  studentId: StudentId;
  benchmarkId: BenchmarkId;
  activitiesCompleted: ActivityCompletion[];
  percentComplete: number; // 0-100
  status: CompletionStatus;
  lastUpdated: string; // ISO 8601
}

export interface SMARTTarget {
  id: string;
  studentId: StudentId;
  description: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string; // ISO 8601 deadline
  progress: number; // 0-100
  status: CompletionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerEncounter {
  id: string;
  studentId: StudentId;
  employerName: string;
  date: string; // ISO 8601
  type: 'visit' | 'talk' | 'work-experience' | 'mentoring' | 'other';
  description: string;
  duration: number; // minutes
  verified: boolean;
  verifiedBy?: string;
}

// ============================================================================
// Aggregates (for UI display)
// ============================================================================

export interface StudentProgress {
  student: Student;
  displayName: string; // Anonymized: "Eagle JS" - students never see their full name
  benchmarks: BenchmarkProgress[];
  overallPercent: number;
  targets: SMARTTarget[];
  employerEncounters: EmployerEncounter[];
}

export interface StudentSummary {
  id: StudentId;
  displayName: string; // Anonymized: "Eagle JS" or full name based on tenant config
  overallPercent: number;
  benchmarkStatuses: Record<BenchmarkId, CompletionStatus>;
}

// ============================================================================
// Heatmap Types (Teacher view)
// ============================================================================

export interface HeatmapCell {
  studentId: StudentId;
  benchmarkId: BenchmarkId;
  percentComplete: number;
  status: CompletionStatus;
}

export interface HeatmapRow {
  student: StudentSummary;
  cells: HeatmapCell[];
}

export interface HeatmapData {
  rows: HeatmapRow[];
  benchmarkIds: BenchmarkId[];
}

// ============================================================================
// Compliance Types (Admin view)
// ============================================================================

export interface ComplianceMetrics {
  totalStudents: number;
  fullyCompliant: number; // All 8 benchmarks complete
  partiallyCompliant: number; // Some benchmarks complete
  notStarted: number;
  complianceRate: number; // 0-100
  employerEncounterRate: number; // % with 2+ encounters
}

export interface LocationCompliance {
  locationId: LocationId;
  locationName: string;
  metrics: ComplianceMetrics;
}

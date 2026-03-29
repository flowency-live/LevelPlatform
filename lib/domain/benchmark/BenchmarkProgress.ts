import { BenchmarkId } from './BenchmarkId';
import { ActivityId } from './ActivityId';
import { StudentId } from '../student/StudentId';

export type CompletionStatus = 'not-started' | 'in-progress' | 'complete';

export interface CompletedActivity {
  activityId: ActivityId;
  completedAt: Date;
}

export interface BenchmarkProgressProps {
  studentId: StudentId;
  benchmarkId: BenchmarkId;
  completedActivities: CompletedActivity[];
  totalActivities: number;
  createdAt: Date;
  updatedAt: Date;
}

export class InvalidBenchmarkProgressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBenchmarkProgressError';
  }
}

export class BenchmarkProgress {
  private constructor(private readonly props: BenchmarkProgressProps) {}

  static create(props: BenchmarkProgressProps): BenchmarkProgress {
    if (props.totalActivities < 0) {
      throw new InvalidBenchmarkProgressError('totalActivities cannot be negative');
    }
    return new BenchmarkProgress(props);
  }

  get studentId(): StudentId {
    return this.props.studentId;
  }

  get benchmarkId(): BenchmarkId {
    return this.props.benchmarkId;
  }

  get completedActivities(): CompletedActivity[] {
    return [...this.props.completedActivities];
  }

  get completedActivityIds(): ActivityId[] {
    return this.props.completedActivities.map(ca => ca.activityId);
  }

  get totalActivities(): number {
    return this.props.totalActivities;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get percentComplete(): number {
    if (this.props.totalActivities === 0) return 0;
    return Math.round(
      (this.props.completedActivities.length / this.props.totalActivities) * 100
    );
  }

  get status(): CompletionStatus {
    if (this.props.completedActivities.length === 0) return 'not-started';
    if (this.props.completedActivities.length >= this.props.totalActivities) return 'complete';
    return 'in-progress';
  }

  isActivityCompleted(activityId: ActivityId): boolean {
    return this.props.completedActivities.some(ca => ca.activityId.equals(activityId));
  }

  getActivityCompletedAt(activityId: ActivityId): Date | null {
    const completed = this.props.completedActivities.find(ca => ca.activityId.equals(activityId));
    return completed?.completedAt ?? null;
  }

  completeActivity(activityId: ActivityId, completedAt: Date): BenchmarkProgress {
    if (this.isActivityCompleted(activityId)) {
      return this;
    }

    return new BenchmarkProgress({
      ...this.props,
      completedActivities: [
        ...this.props.completedActivities,
        { activityId, completedAt },
      ],
      updatedAt: completedAt,
    });
  }
}

import { BenchmarkId } from './BenchmarkId';
import { ActivityId } from './ActivityId';
import { StudentId } from '../student/StudentId';

export type CompletionStatus = 'not-started' | 'in-progress' | 'complete';

export interface BenchmarkProgressProps {
  studentId: StudentId;
  benchmarkId: BenchmarkId;
  completedActivityIds: ActivityId[];
  totalActivities: number;
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

  get completedActivityIds(): ActivityId[] {
    return [...this.props.completedActivityIds];
  }

  get totalActivities(): number {
    return this.props.totalActivities;
  }

  get percentComplete(): number {
    if (this.props.totalActivities === 0) return 0;
    return Math.round(
      (this.props.completedActivityIds.length / this.props.totalActivities) * 100
    );
  }

  get status(): CompletionStatus {
    if (this.props.completedActivityIds.length === 0) return 'not-started';
    if (this.props.completedActivityIds.length >= this.props.totalActivities) return 'complete';
    return 'in-progress';
  }

  isActivityCompleted(activityId: ActivityId): boolean {
    return this.props.completedActivityIds.some(id => id.equals(activityId));
  }

  completeActivity(activityId: ActivityId): BenchmarkProgress {
    if (this.isActivityCompleted(activityId)) {
      return this;
    }

    return new BenchmarkProgress({
      ...this.props,
      completedActivityIds: [...this.props.completedActivityIds, activityId],
    });
  }
}

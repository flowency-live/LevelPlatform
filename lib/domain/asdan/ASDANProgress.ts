import { StudentId } from '../student/StudentId';
import { ASDANQualificationId } from './ASDANQualificationId';
import { ASDANUnitId } from './ASDANUnitId';
import { getQualification } from '../../reference-data/asdan-qualifications';

export interface ASDANProgressProps {
  readonly studentId: StudentId;
  readonly qualificationId: ASDANQualificationId;
  readonly completedUnitIds: readonly ASDANUnitId[];
  readonly enrolledAt: Date;
  readonly updatedAt: Date;
}

export class InvalidASDANProgressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidASDANProgressError';
  }
}

export class ASDANProgress {
  readonly studentId: StudentId;
  readonly qualificationId: ASDANQualificationId;
  readonly completedUnitIds: readonly ASDANUnitId[];
  readonly enrolledAt: Date;
  readonly updatedAt: Date;

  private constructor(props: ASDANProgressProps) {
    this.studentId = props.studentId;
    this.qualificationId = props.qualificationId;
    this.completedUnitIds = Object.freeze([...props.completedUnitIds]);
    this.enrolledAt = props.enrolledAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: ASDANProgressProps): ASDANProgress {
    return new ASDANProgress(props);
  }

  completeUnit(unitId: ASDANUnitId, completedAt: Date): ASDANProgress {
    if (this.isUnitCompleted(unitId)) {
      return this;
    }

    return new ASDANProgress({
      studentId: this.studentId,
      qualificationId: this.qualificationId,
      completedUnitIds: [...this.completedUnitIds, unitId],
      enrolledAt: this.enrolledAt,
      updatedAt: completedAt,
    });
  }

  getCompletedUnits(): ASDANUnitId[] {
    return [...this.completedUnitIds];
  }

  isUnitCompleted(unitId: ASDANUnitId): boolean {
    return this.completedUnitIds.some((id) => id.equals(unitId));
  }

  getPercentageComplete(): number {
    const qualification = getQualification(this.qualificationId.toString());
    if (!qualification) {
      return 0;
    }

    const totalUnits =
      qualification.requiredUnits.length + qualification.optionalUnits.length;
    if (totalUnits === 0) {
      return 0;
    }

    const minRequired = qualification.minUnitsRequired;
    const completed = this.completedUnitIds.length;

    if (completed >= minRequired) {
      return 100;
    }

    return Math.round((completed / minRequired) * 100);
  }

  isComplete(): boolean {
    const qualification = getQualification(this.qualificationId.toString());
    if (!qualification) {
      return false;
    }

    return this.completedUnitIds.length >= qualification.minUnitsRequired;
  }

  getRemainingUnits(): ASDANUnitId[] {
    const qualification = getQualification(this.qualificationId.toString());
    if (!qualification) {
      return [];
    }

    const allUnitIds = [
      ...qualification.requiredUnits,
      ...qualification.optionalUnits,
    ];

    const completedIds = this.completedUnitIds.map((id) => id.toString());

    return allUnitIds
      .filter((unitId) => !completedIds.includes(unitId))
      .map((unitId) => ASDANUnitId.create(unitId));
  }

  equals(other: ASDANProgress): boolean {
    return (
      this.studentId.equals(other.studentId) &&
      this.qualificationId.equals(other.qualificationId)
    );
  }
}

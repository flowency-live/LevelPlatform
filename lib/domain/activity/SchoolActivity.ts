import { ActivityId } from './ActivityId';
import { ActivityStatus } from './ActivityStatus';
import { EvidenceRequirement } from './EvidenceRequirement';
import { BenchmarkId } from '../benchmark/BenchmarkId';
import { LocationId } from '../tenant/LocationId';
import { StaffId } from '../staff/StaffId';
import { ASDANUnitId } from '../asdan/ASDANUnitId';

export interface SchoolActivityProps {
  readonly id: ActivityId;
  readonly name: string;
  readonly description: string;
  readonly locationId: LocationId;
  readonly gatsbyBenchmarkIds: readonly BenchmarkId[];
  readonly asdanUnitId?: ASDANUnitId;
  readonly evidenceRequirements: readonly EvidenceRequirement[];
  readonly status?: ActivityStatus;
  readonly createdBy: StaffId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class InvalidSchoolActivityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSchoolActivityError';
  }
}

export class SchoolActivity {
  readonly id: ActivityId;
  readonly name: string;
  readonly description: string;
  readonly locationId: LocationId;
  readonly gatsbyBenchmarkIds: readonly BenchmarkId[];
  readonly asdanUnitId: ASDANUnitId | undefined;
  readonly evidenceRequirements: readonly EvidenceRequirement[];
  readonly status: ActivityStatus;
  readonly createdBy: StaffId;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: SchoolActivityProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.locationId = props.locationId;
    this.gatsbyBenchmarkIds = Object.freeze([...props.gatsbyBenchmarkIds]);
    this.asdanUnitId = props.asdanUnitId;
    this.evidenceRequirements = Object.freeze([...props.evidenceRequirements]);
    this.status = props.status ?? ActivityStatus.Draft;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: SchoolActivityProps): SchoolActivity {
    const trimmedName = props.name.trim();

    if (trimmedName.length === 0) {
      throw new InvalidSchoolActivityError('Activity name cannot be empty');
    }

    if (props.gatsbyBenchmarkIds.length === 0) {
      throw new InvalidSchoolActivityError(
        'Activity must have at least one Gatsby benchmark'
      );
    }

    return new SchoolActivity({
      ...props,
      name: trimmedName,
    });
  }

  hasBenchmark(benchmarkId: BenchmarkId): boolean {
    return this.gatsbyBenchmarkIds.some((id) => id.equals(benchmarkId));
  }

  hasASDANUnit(): boolean {
    return this.asdanUnitId !== undefined;
  }

  isDraft(): boolean {
    return this.status === ActivityStatus.Draft;
  }

  isActive(): boolean {
    return this.status === ActivityStatus.Active;
  }

  isArchived(): boolean {
    return this.status === ActivityStatus.Archived;
  }

  activate(updatedAt: Date): SchoolActivity {
    return new SchoolActivity({
      id: this.id,
      name: this.name,
      description: this.description,
      locationId: this.locationId,
      gatsbyBenchmarkIds: this.gatsbyBenchmarkIds,
      asdanUnitId: this.asdanUnitId,
      evidenceRequirements: this.evidenceRequirements,
      status: ActivityStatus.Active,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt,
    });
  }

  archive(updatedAt: Date): SchoolActivity {
    return new SchoolActivity({
      id: this.id,
      name: this.name,
      description: this.description,
      locationId: this.locationId,
      gatsbyBenchmarkIds: this.gatsbyBenchmarkIds,
      asdanUnitId: this.asdanUnitId,
      evidenceRequirements: this.evidenceRequirements,
      status: ActivityStatus.Archived,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt,
    });
  }

  equals(other: SchoolActivity): boolean {
    return this.id.equals(other.id);
  }
}

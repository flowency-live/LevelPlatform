import { SchoolActivity } from '../domain/activity/SchoolActivity';
import { SchoolActivityRepository } from '../domain/activity/SchoolActivityRepository';
import { ActivityId } from '../domain/activity/ActivityId';
import { EvidenceRequirement, EvidenceRequirementProps } from '../domain/activity/EvidenceRequirement';
import { StaffRepository } from '../domain/staff/StaffRepository';
import { StaffId } from '../domain/staff/StaffId';
import { LocationId } from '../domain/tenant/LocationId';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { ASDANUnitId } from '../domain/asdan/ASDANUnitId';

export class StaffNotFoundError extends Error {
  constructor(staffId: StaffId) {
    super(`Staff member not found: ${staffId.toString()}`);
    this.name = 'StaffNotFoundError';
  }
}

export interface CreateSchoolActivityRequest {
  name: string;
  description: string;
  locationId: LocationId;
  gatsbyBenchmarkIds: BenchmarkId[];
  asdanUnitId?: ASDANUnitId;
  evidenceRequirements: EvidenceRequirementProps[];
  createdBy: StaffId;
  createdAt: Date;
}

export interface IdGenerator {
  generateActivityId(): ActivityId;
}

class DefaultIdGenerator implements IdGenerator {
  generateActivityId(): ActivityId {
    const uuid = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
    return ActivityId.create(`ACT-${uuid.toUpperCase()}`);
  }
}

export class CreateSchoolActivity {
  private readonly idGenerator: IdGenerator;

  constructor(
    private readonly activityRepository: SchoolActivityRepository,
    private readonly staffRepository: StaffRepository,
    idGenerator?: IdGenerator
  ) {
    this.idGenerator = idGenerator ?? new DefaultIdGenerator();
  }

  async execute(request: CreateSchoolActivityRequest): Promise<SchoolActivity> {
    const {
      name,
      description,
      locationId,
      gatsbyBenchmarkIds,
      asdanUnitId,
      evidenceRequirements,
      createdBy,
      createdAt,
    } = request;

    const staff = await this.staffRepository.findById(createdBy);
    if (!staff) {
      throw new StaffNotFoundError(createdBy);
    }

    const activityId = this.idGenerator.generateActivityId();

    const evidenceReqs = evidenceRequirements.map((props) =>
      EvidenceRequirement.create(props)
    );

    const activity = SchoolActivity.create({
      id: activityId,
      name,
      description,
      locationId,
      gatsbyBenchmarkIds,
      asdanUnitId,
      evidenceRequirements: evidenceReqs,
      createdBy,
      createdAt,
      updatedAt: createdAt,
    });

    await this.activityRepository.save(activity);

    return activity;
  }
}

import { SchoolActivity } from '../domain/activity/SchoolActivity';
import { SchoolActivityRepository } from '../domain/activity/SchoolActivityRepository';
import { ActivityId } from '../domain/activity/ActivityId';
import { ActivityStatus } from '../domain/activity/ActivityStatus';

export class ActivityNotFoundError extends Error {
  constructor(activityId: ActivityId) {
    super(`Activity not found: ${activityId.toString()}`);
    this.name = 'ActivityNotFoundError';
  }
}

export class InvalidActivityStatusError extends Error {
  constructor(activityId: ActivityId, currentStatus: ActivityStatus, expectedStatus: ActivityStatus) {
    super(
      `Activity ${activityId.toString()} has status ${currentStatus}, expected ${expectedStatus}`
    );
    this.name = 'InvalidActivityStatusError';
  }
}

export interface ArchiveSchoolActivityRequest {
  activityId: ActivityId;
  archivedAt: Date;
}

export class ArchiveSchoolActivity {
  constructor(private readonly activityRepository: SchoolActivityRepository) {}

  async execute(request: ArchiveSchoolActivityRequest): Promise<SchoolActivity> {
    const { activityId, archivedAt } = request;

    const activity = await this.activityRepository.findById(activityId);
    if (!activity) {
      throw new ActivityNotFoundError(activityId);
    }

    if (activity.status !== ActivityStatus.Active) {
      throw new InvalidActivityStatusError(activityId, activity.status, ActivityStatus.Active);
    }

    const archivedActivity = activity.archive(archivedAt);

    await this.activityRepository.save(archivedActivity);

    return archivedActivity;
  }
}

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

export interface ActivateSchoolActivityRequest {
  activityId: ActivityId;
  activatedAt: Date;
}

export class ActivateSchoolActivity {
  constructor(private readonly activityRepository: SchoolActivityRepository) {}

  async execute(request: ActivateSchoolActivityRequest): Promise<SchoolActivity> {
    const { activityId, activatedAt } = request;

    const activity = await this.activityRepository.findById(activityId);
    if (!activity) {
      throw new ActivityNotFoundError(activityId);
    }

    if (activity.status !== ActivityStatus.Draft) {
      throw new InvalidActivityStatusError(activityId, activity.status, ActivityStatus.Draft);
    }

    const activatedActivity = activity.activate(activatedAt);

    await this.activityRepository.save(activatedActivity);

    return activatedActivity;
  }
}

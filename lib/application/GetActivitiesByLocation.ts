import { SchoolActivity } from '../domain/activity/SchoolActivity';
import { SchoolActivityRepository } from '../domain/activity/SchoolActivityRepository';
import { ActivityStatus } from '../domain/activity/ActivityStatus';
import { LocationId } from '../domain/tenant/LocationId';

export interface GetActivitiesByLocationRequest {
  locationId: LocationId;
  status?: ActivityStatus;
}

export class GetActivitiesByLocation {
  constructor(private readonly activityRepository: SchoolActivityRepository) {}

  async execute(request: GetActivitiesByLocationRequest): Promise<SchoolActivity[]> {
    const { locationId, status } = request;

    if (status !== undefined) {
      return this.activityRepository.findByLocationAndStatus(locationId, status);
    }

    return this.activityRepository.findByLocation(locationId);
  }
}

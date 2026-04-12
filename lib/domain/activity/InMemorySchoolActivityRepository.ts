import { SchoolActivityRepository } from './SchoolActivityRepository';
import { SchoolActivity } from './SchoolActivity';
import { ActivityId } from './ActivityId';
import { ActivityStatus } from './ActivityStatus';
import { LocationId } from '../tenant/LocationId';
import { BenchmarkId } from '../benchmark/BenchmarkId';

export class InMemorySchoolActivityRepository implements SchoolActivityRepository {
  private readonly activities: Map<string, SchoolActivity> = new Map();

  async findById(id: ActivityId): Promise<SchoolActivity | null> {
    return this.activities.get(id.toString()) ?? null;
  }

  async findByLocation(locationId: LocationId): Promise<SchoolActivity[]> {
    return Array.from(this.activities.values()).filter((activity) =>
      activity.locationId.equals(locationId)
    );
  }

  async findByLocationAndStatus(
    locationId: LocationId,
    status: ActivityStatus
  ): Promise<SchoolActivity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) =>
        activity.locationId.equals(locationId) && activity.status === status
    );
  }

  async findByBenchmark(benchmarkId: BenchmarkId): Promise<SchoolActivity[]> {
    return Array.from(this.activities.values()).filter((activity) =>
      activity.hasBenchmark(benchmarkId)
    );
  }

  async save(activity: SchoolActivity): Promise<void> {
    this.activities.set(activity.id.toString(), activity);
  }
}

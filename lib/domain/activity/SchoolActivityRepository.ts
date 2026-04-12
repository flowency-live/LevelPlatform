import { SchoolActivity } from './SchoolActivity';
import { ActivityId } from './ActivityId';
import { ActivityStatus } from './ActivityStatus';
import { LocationId } from '../tenant/LocationId';
import { BenchmarkId } from '../benchmark/BenchmarkId';

export interface SchoolActivityRepository {
  findById(id: ActivityId): Promise<SchoolActivity | null>;
  findByLocation(locationId: LocationId): Promise<SchoolActivity[]>;
  findByLocationAndStatus(
    locationId: LocationId,
    status: ActivityStatus
  ): Promise<SchoolActivity[]>;
  findByBenchmark(benchmarkId: BenchmarkId): Promise<SchoolActivity[]>;
  save(activity: SchoolActivity): Promise<void>;
}

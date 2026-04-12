import { GetActivitiesByLocation } from './GetActivitiesByLocation';
import { InMemorySchoolActivityRepository } from '../domain/activity/InMemorySchoolActivityRepository';
import { SchoolActivity } from '../domain/activity/SchoolActivity';
import { ActivityId } from '../domain/activity/ActivityId';
import { ActivityStatus } from '../domain/activity/ActivityStatus';
import { EvidenceRequirement } from '../domain/activity/EvidenceRequirement';
import { EvidenceType } from '../domain/activity/EvidenceType';
import { StaffId } from '../domain/staff/StaffId';
import { LocationId } from '../domain/tenant/LocationId';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';

describe('GetActivitiesByLocation', () => {
  let activityRepository: InMemorySchoolActivityRepository;
  let useCase: GetActivitiesByLocation;

  const now = new Date('2026-04-12T10:00:00Z');
  const eastLocationId = LocationId.create('LOC-EAST');
  const westLocationId = LocationId.create('LOC-WEST');

  const createActivity = (
    id: string,
    locationId: LocationId,
    status: ActivityStatus = ActivityStatus.Draft
  ) => {
    const activity = SchoolActivity.create({
      id: ActivityId.create(id),
      name: `Activity ${id}`,
      description: 'Test activity',
      locationId,
      gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
      evidenceRequirements: [
        EvidenceRequirement.create({
          type: EvidenceType.Photo,
          description: 'Photo evidence',
        }),
      ],
      status: ActivityStatus.Draft,
      createdBy: StaffId.create('STAFF-GATSBY01'),
      createdAt: now,
      updatedAt: now,
    });

    if (status === ActivityStatus.Active) {
      return activity.activate(now);
    }
    if (status === ActivityStatus.Archived) {
      return activity.activate(now).archive(now);
    }
    return activity;
  };

  beforeEach(() => {
    activityRepository = new InMemorySchoolActivityRepository();
    useCase = new GetActivitiesByLocation(activityRepository);
  });

  describe('execute', () => {
    it('returns all activities for a location', async () => {
      await activityRepository.save(createActivity('ACT-001', eastLocationId, ActivityStatus.Draft));
      await activityRepository.save(createActivity('ACT-002', eastLocationId, ActivityStatus.Active));
      await activityRepository.save(createActivity('ACT-003', westLocationId, ActivityStatus.Active));

      const result = await useCase.execute({ locationId: eastLocationId });

      expect(result).toHaveLength(2);
      expect(result.map((a) => a.id.toString())).toContain('ACT-001');
      expect(result.map((a) => a.id.toString())).toContain('ACT-002');
    });

    it('returns empty array if no activities for location', async () => {
      await activityRepository.save(createActivity('ACT-001', westLocationId));

      const result = await useCase.execute({ locationId: eastLocationId });

      expect(result).toHaveLength(0);
    });

    it('filters by status when provided', async () => {
      await activityRepository.save(createActivity('ACT-001', eastLocationId, ActivityStatus.Draft));
      await activityRepository.save(createActivity('ACT-002', eastLocationId, ActivityStatus.Active));
      await activityRepository.save(createActivity('ACT-003', eastLocationId, ActivityStatus.Archived));

      const result = await useCase.execute({
        locationId: eastLocationId,
        status: ActivityStatus.Active,
      });

      expect(result).toHaveLength(1);
      expect(result[0].id.toString()).toBe('ACT-002');
    });

    it('returns all statuses when status not provided', async () => {
      await activityRepository.save(createActivity('ACT-001', eastLocationId, ActivityStatus.Draft));
      await activityRepository.save(createActivity('ACT-002', eastLocationId, ActivityStatus.Active));
      await activityRepository.save(createActivity('ACT-003', eastLocationId, ActivityStatus.Archived));

      const result = await useCase.execute({ locationId: eastLocationId });

      expect(result).toHaveLength(3);
    });

    it('does not return activities from other locations when filtering by status', async () => {
      await activityRepository.save(createActivity('ACT-001', eastLocationId, ActivityStatus.Active));
      await activityRepository.save(createActivity('ACT-002', westLocationId, ActivityStatus.Active));

      const result = await useCase.execute({
        locationId: eastLocationId,
        status: ActivityStatus.Active,
      });

      expect(result).toHaveLength(1);
      expect(result[0].id.toString()).toBe('ACT-001');
    });
  });
});

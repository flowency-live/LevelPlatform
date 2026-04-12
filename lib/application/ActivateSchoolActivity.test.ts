import {
  ActivateSchoolActivity,
  ActivityNotFoundError,
  InvalidActivityStatusError,
} from './ActivateSchoolActivity';
import { InMemorySchoolActivityRepository } from '../domain/activity/InMemorySchoolActivityRepository';
import { SchoolActivity } from '../domain/activity/SchoolActivity';
import { ActivityId } from '../domain/activity/ActivityId';
import { ActivityStatus } from '../domain/activity/ActivityStatus';
import { EvidenceRequirement } from '../domain/activity/EvidenceRequirement';
import { EvidenceType } from '../domain/activity/EvidenceType';
import { StaffId } from '../domain/staff/StaffId';
import { LocationId } from '../domain/tenant/LocationId';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';

describe('ActivateSchoolActivity', () => {
  let activityRepository: InMemorySchoolActivityRepository;
  let useCase: ActivateSchoolActivity;

  const now = new Date('2026-04-12T10:00:00Z');
  const later = new Date('2026-04-12T14:00:00Z');
  const locationId = LocationId.create('LOC-EAST');

  const createActivity = (
    id: string,
    status: ActivityStatus = ActivityStatus.Draft
  ) => {
    const activity = SchoolActivity.create({
      id: ActivityId.create(id),
      name: 'Career Research',
      description: 'Research careers',
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
    useCase = new ActivateSchoolActivity(activityRepository);
  });

  describe('execute', () => {
    it('activates a draft activity', async () => {
      const activity = createActivity('ACT-001', ActivityStatus.Draft);
      await activityRepository.save(activity);

      const result = await useCase.execute({
        activityId: ActivityId.create('ACT-001'),
        activatedAt: later,
      });

      expect(result.status).toBe(ActivityStatus.Active);
      expect(result.isActive()).toBe(true);
    });

    it('updates the updatedAt timestamp', async () => {
      const activity = createActivity('ACT-001', ActivityStatus.Draft);
      await activityRepository.save(activity);

      const result = await useCase.execute({
        activityId: ActivityId.create('ACT-001'),
        activatedAt: later,
      });

      expect(result.updatedAt).toEqual(later);
    });

    it('persists the activated activity', async () => {
      const activity = createActivity('ACT-001', ActivityStatus.Draft);
      await activityRepository.save(activity);

      await useCase.execute({
        activityId: ActivityId.create('ACT-001'),
        activatedAt: later,
      });

      const found = await activityRepository.findById(ActivityId.create('ACT-001'));
      expect(found!.status).toBe(ActivityStatus.Active);
    });

    it('throws ActivityNotFoundError if activity not found', async () => {
      await expect(
        useCase.execute({
          activityId: ActivityId.create('ACT-NOTFOUND'),
          activatedAt: later,
        })
      ).rejects.toThrow(ActivityNotFoundError);
    });

    it('throws InvalidActivityStatusError if activity already active', async () => {
      const activity = createActivity('ACT-001', ActivityStatus.Active);
      await activityRepository.save(activity);

      await expect(
        useCase.execute({
          activityId: ActivityId.create('ACT-001'),
          activatedAt: later,
        })
      ).rejects.toThrow(InvalidActivityStatusError);
    });

    it('throws InvalidActivityStatusError if activity archived', async () => {
      const activity = createActivity('ACT-001', ActivityStatus.Archived);
      await activityRepository.save(activity);

      await expect(
        useCase.execute({
          activityId: ActivityId.create('ACT-001'),
          activatedAt: later,
        })
      ).rejects.toThrow(InvalidActivityStatusError);
    });

    it('preserves all other properties', async () => {
      const activity = createActivity('ACT-001', ActivityStatus.Draft);
      await activityRepository.save(activity);

      const result = await useCase.execute({
        activityId: ActivityId.create('ACT-001'),
        activatedAt: later,
      });

      expect(result.name).toBe('Career Research');
      expect(result.gatsbyBenchmarkIds).toHaveLength(1);
      expect(result.evidenceRequirements).toHaveLength(1);
      expect(result.createdAt).toEqual(now);
    });
  });
});

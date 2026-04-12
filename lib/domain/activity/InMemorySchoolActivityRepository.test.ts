import { InMemorySchoolActivityRepository } from './InMemorySchoolActivityRepository';
import { SchoolActivity } from './SchoolActivity';
import { ActivityId } from './ActivityId';
import { ActivityStatus } from './ActivityStatus';
import { EvidenceRequirement } from './EvidenceRequirement';
import { EvidenceType } from './EvidenceType';
import { BenchmarkId } from '../benchmark/BenchmarkId';
import { LocationId } from '../tenant/LocationId';
import { StaffId } from '../staff/StaffId';
import { ASDANUnitId } from '../asdan/ASDANUnitId';

describe('InMemorySchoolActivityRepository', () => {
  let repository: InMemorySchoolActivityRepository;
  const now = new Date('2026-04-12T10:00:00Z');

  const photoEvidence = EvidenceRequirement.create({
    type: EvidenceType.Photo,
    description: 'Upload a photo',
    mandatory: true,
  });

  const createActivity = (
    overrides: Partial<{
      id: string;
      name: string;
      locationId: string;
      benchmarkIds: string[];
      status: ActivityStatus;
    }> = {}
  ) => {
    return SchoolActivity.create({
      id: ActivityId.create(overrides.id ?? 'ACT-001'),
      name: overrides.name ?? 'Career Research Project',
      description: 'Research a career path',
      locationId: LocationId.create(overrides.locationId ?? 'LOC-EAST'),
      gatsbyBenchmarkIds: (overrides.benchmarkIds ?? ['GB1']).map((id) =>
        BenchmarkId.create(id)
      ),
      asdanUnitId: ASDANUnitId.create('ASDAN-COPE001'),
      evidenceRequirements: [photoEvidence],
      status: overrides.status ?? ActivityStatus.Draft,
      createdBy: StaffId.create('STAFF-GATSBY01'),
      createdAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    repository = new InMemorySchoolActivityRepository();
  });

  describe('save and findById', () => {
    it('saves and retrieves an activity', async () => {
      const activity = createActivity();

      await repository.save(activity);
      const found = await repository.findById(activity.id);

      expect(found).not.toBeNull();
      expect(found!.id.equals(activity.id)).toBe(true);
      expect(found!.name).toBe('Career Research Project');
    });

    it('returns null for non-existent activity', async () => {
      const found = await repository.findById(ActivityId.create('ACT-NOTFOUND'));

      expect(found).toBeNull();
    });

    it('overwrites existing activity on save', async () => {
      const activity1 = createActivity({ id: 'ACT-001', name: 'Original Name' });
      const activity2 = createActivity({ id: 'ACT-001', name: 'Updated Name' });

      await repository.save(activity1);
      await repository.save(activity2);

      const found = await repository.findById(ActivityId.create('ACT-001'));

      expect(found!.name).toBe('Updated Name');
    });

    it('preserves all properties through save/retrieve', async () => {
      const activity = createActivity({
        benchmarkIds: ['GB1', 'GB2', 'GB3'],
      });

      await repository.save(activity);
      const found = await repository.findById(activity.id);

      expect(found!.gatsbyBenchmarkIds).toHaveLength(3);
      expect(found!.evidenceRequirements).toHaveLength(1);
      expect(found!.asdanUnitId?.toString()).toBe('ASDAN-COPE001');
      expect(found!.createdBy.toString()).toBe('STAFF-GATSBY01');
    });

    it('preserves timestamps through save/retrieve', async () => {
      const activity = createActivity();

      await repository.save(activity);
      const found = await repository.findById(activity.id);

      expect(found!.createdAt).toEqual(now);
      expect(found!.updatedAt).toEqual(now);
    });
  });

  describe('findByLocation', () => {
    it('returns activities for location', async () => {
      const activity1 = createActivity({ id: 'ACT-001', locationId: 'LOC-EAST' });
      const activity2 = createActivity({ id: 'ACT-002', locationId: 'LOC-EAST' });
      const activity3 = createActivity({ id: 'ACT-003', locationId: 'LOC-WEST' });

      await repository.save(activity1);
      await repository.save(activity2);
      await repository.save(activity3);

      const found = await repository.findByLocation(LocationId.create('LOC-EAST'));

      expect(found).toHaveLength(2);
      expect(found.some((a) => a.id.equals(ActivityId.create('ACT-001')))).toBe(true);
      expect(found.some((a) => a.id.equals(ActivityId.create('ACT-002')))).toBe(true);
    });

    it('returns empty array when no activities for location', async () => {
      const activity = createActivity({ locationId: 'LOC-EAST' });
      await repository.save(activity);

      const found = await repository.findByLocation(LocationId.create('LOC-EMPTY'));

      expect(found).toEqual([]);
    });

    it('returns all statuses by default', async () => {
      const draft = createActivity({ id: 'ACT-001', status: ActivityStatus.Draft });
      const active = createActivity({ id: 'ACT-002', status: ActivityStatus.Active });
      const archived = createActivity({ id: 'ACT-003', status: ActivityStatus.Archived });

      await repository.save(draft);
      await repository.save(active);
      await repository.save(archived);

      const found = await repository.findByLocation(LocationId.create('LOC-EAST'));

      expect(found).toHaveLength(3);
    });
  });

  describe('findByLocationAndStatus', () => {
    it('returns only active activities when status is active', async () => {
      const draft = createActivity({ id: 'ACT-001', status: ActivityStatus.Draft });
      const active = createActivity({ id: 'ACT-002', status: ActivityStatus.Active });
      const archived = createActivity({ id: 'ACT-003', status: ActivityStatus.Archived });

      await repository.save(draft);
      await repository.save(active);
      await repository.save(archived);

      const found = await repository.findByLocationAndStatus(
        LocationId.create('LOC-EAST'),
        ActivityStatus.Active
      );

      expect(found).toHaveLength(1);
      expect(found[0].id.equals(ActivityId.create('ACT-002'))).toBe(true);
    });

    it('returns only draft activities when status is draft', async () => {
      const draft1 = createActivity({ id: 'ACT-001', status: ActivityStatus.Draft });
      const draft2 = createActivity({ id: 'ACT-002', status: ActivityStatus.Draft });
      const active = createActivity({ id: 'ACT-003', status: ActivityStatus.Active });

      await repository.save(draft1);
      await repository.save(draft2);
      await repository.save(active);

      const found = await repository.findByLocationAndStatus(
        LocationId.create('LOC-EAST'),
        ActivityStatus.Draft
      );

      expect(found).toHaveLength(2);
    });

    it('returns empty array when no matching activities', async () => {
      const draft = createActivity({ status: ActivityStatus.Draft });
      await repository.save(draft);

      const found = await repository.findByLocationAndStatus(
        LocationId.create('LOC-EAST'),
        ActivityStatus.Active
      );

      expect(found).toEqual([]);
    });

    it('filters by both location and status', async () => {
      const eastActive = createActivity({
        id: 'ACT-001',
        locationId: 'LOC-EAST',
        status: ActivityStatus.Active,
      });
      const westActive = createActivity({
        id: 'ACT-002',
        locationId: 'LOC-WEST',
        status: ActivityStatus.Active,
      });
      const eastDraft = createActivity({
        id: 'ACT-003',
        locationId: 'LOC-EAST',
        status: ActivityStatus.Draft,
      });

      await repository.save(eastActive);
      await repository.save(westActive);
      await repository.save(eastDraft);

      const found = await repository.findByLocationAndStatus(
        LocationId.create('LOC-EAST'),
        ActivityStatus.Active
      );

      expect(found).toHaveLength(1);
      expect(found[0].id.equals(ActivityId.create('ACT-001'))).toBe(true);
    });
  });

  describe('findByBenchmark', () => {
    it('returns activities containing benchmark', async () => {
      const activity1 = createActivity({ id: 'ACT-001', benchmarkIds: ['GB1'] });
      const activity2 = createActivity({ id: 'ACT-002', benchmarkIds: ['GB2'] });

      await repository.save(activity1);
      await repository.save(activity2);

      const found = await repository.findByBenchmark(BenchmarkId.create('GB1'));

      expect(found).toHaveLength(1);
      expect(found[0].id.equals(ActivityId.create('ACT-001'))).toBe(true);
    });

    it('returns activities with multiple benchmarks if one matches', async () => {
      const activity = createActivity({
        id: 'ACT-001',
        benchmarkIds: ['GB1', 'GB2', 'GB3'],
      });

      await repository.save(activity);

      const foundGB1 = await repository.findByBenchmark(BenchmarkId.create('GB1'));
      const foundGB2 = await repository.findByBenchmark(BenchmarkId.create('GB2'));
      const foundGB3 = await repository.findByBenchmark(BenchmarkId.create('GB3'));

      expect(foundGB1).toHaveLength(1);
      expect(foundGB2).toHaveLength(1);
      expect(foundGB3).toHaveLength(1);
    });

    it('returns empty array when no activities contain benchmark', async () => {
      const activity = createActivity({ benchmarkIds: ['GB1'] });
      await repository.save(activity);

      const found = await repository.findByBenchmark(BenchmarkId.create('GB8'));

      expect(found).toEqual([]);
    });

    it('returns activities from all locations', async () => {
      const east = createActivity({
        id: 'ACT-001',
        locationId: 'LOC-EAST',
        benchmarkIds: ['GB1'],
      });
      const west = createActivity({
        id: 'ACT-002',
        locationId: 'LOC-WEST',
        benchmarkIds: ['GB1'],
      });

      await repository.save(east);
      await repository.save(west);

      const found = await repository.findByBenchmark(BenchmarkId.create('GB1'));

      expect(found).toHaveLength(2);
    });
  });
});

import { CreateSchoolActivity, StaffNotFoundError } from './CreateSchoolActivity';
import { InMemorySchoolActivityRepository } from '../domain/activity/InMemorySchoolActivityRepository';
import { InMemoryStaffRepository } from '../domain/staff/InMemoryStaffRepository';
import { StaffMember } from '../domain/staff/StaffMember';
import { StaffId } from '../domain/staff/StaffId';
import { Role } from '../domain/staff/Role';
import { StaffType } from '../domain/staff/StaffType';
import { TenantId } from '../domain/tenant/TenantId';
import { LocationId } from '../domain/tenant/LocationId';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { ASDANUnitId } from '../domain/asdan/ASDANUnitId';
import { EvidenceType } from '../domain/activity/EvidenceType';
import { ActivityStatus } from '../domain/activity/ActivityStatus';

describe('CreateSchoolActivity', () => {
  let activityRepository: InMemorySchoolActivityRepository;
  let staffRepository: InMemoryStaffRepository;
  let useCase: CreateSchoolActivity;

  const now = new Date('2026-04-12T10:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');
  const locationId = LocationId.create('LOC-EAST');

  const createStaffMember = (id: string, roles: Role[] = [Role.GatsbyLead]) => {
    return StaffMember.create({
      id: StaffId.create(id),
      schoolId: tenantId,
      name: 'Sarah Johnson',
      email: `${id.toLowerCase()}@school.uk`,
      staffType: StaffType.Teaching,
      roles,
    });
  };

  beforeEach(() => {
    activityRepository = new InMemorySchoolActivityRepository();
    staffRepository = new InMemoryStaffRepository();
    useCase = new CreateSchoolActivity(activityRepository, staffRepository);
  });

  describe('execute', () => {
    it('creates activity with valid inputs', async () => {
      const creator = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(creator);

      const result = await useCase.execute({
        name: 'Career Research Project',
        description: 'Research a career path of interest',
        locationId,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
        evidenceRequirements: [
          { type: EvidenceType.Photo, description: 'Photo of research', mandatory: true },
        ],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      expect(result.name).toBe('Career Research Project');
      expect(result.description).toBe('Research a career path of interest');
      expect(result.locationId.equals(locationId)).toBe(true);
      expect(result.gatsbyBenchmarkIds).toHaveLength(1);
    });

    it('creates activity with multiple benchmarks', async () => {
      const creator = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(creator);

      const result = await useCase.execute({
        name: 'Multi-Benchmark Activity',
        description: 'Covers multiple benchmarks',
        locationId,
        gatsbyBenchmarkIds: [
          BenchmarkId.create('GB1'),
          BenchmarkId.create('GB2'),
          BenchmarkId.create('GB3'),
        ],
        evidenceRequirements: [],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      expect(result.gatsbyBenchmarkIds).toHaveLength(3);
    });

    it('creates activity with ASDAN unit', async () => {
      const creator = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(creator);

      const result = await useCase.execute({
        name: 'ASDAN Linked Activity',
        description: 'Links to ASDAN qualification',
        locationId,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
        asdanUnitId: ASDANUnitId.create('ASDAN-COPE001'),
        evidenceRequirements: [],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      expect(result.hasASDANUnit()).toBe(true);
      expect(result.asdanUnitId?.toString()).toBe('ASDAN-COPE001');
    });

    it('sets status to Draft', async () => {
      const creator = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(creator);

      const result = await useCase.execute({
        name: 'New Activity',
        description: 'Description',
        locationId,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
        evidenceRequirements: [],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      expect(result.status).toBe(ActivityStatus.Draft);
      expect(result.isDraft()).toBe(true);
    });

    it('generates unique ActivityId', async () => {
      const creator = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(creator);

      const result1 = await useCase.execute({
        name: 'Activity 1',
        description: 'Description',
        locationId,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
        evidenceRequirements: [],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      const result2 = await useCase.execute({
        name: 'Activity 2',
        description: 'Description',
        locationId,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
        evidenceRequirements: [],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      expect(result1.id.equals(result2.id)).toBe(false);
    });

    it('persists the created activity', async () => {
      const creator = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(creator);

      const result = await useCase.execute({
        name: 'Persisted Activity',
        description: 'Description',
        locationId,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
        evidenceRequirements: [],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      const found = await activityRepository.findById(result.id);
      expect(found).not.toBeNull();
      expect(found!.name).toBe('Persisted Activity');
    });

    it('throws StaffNotFoundError if creator not found', async () => {
      await expect(
        useCase.execute({
          name: 'Activity',
          description: 'Description',
          locationId,
          gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
          evidenceRequirements: [],
          createdBy: StaffId.create('STAFF-NOTFOUND'),
          createdAt: now,
        })
      ).rejects.toThrow(StaffNotFoundError);
    });

    it('sets timestamps correctly', async () => {
      const creator = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(creator);

      const result = await useCase.execute({
        name: 'Activity',
        description: 'Description',
        locationId,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
        evidenceRequirements: [],
        createdBy: StaffId.create('STAFF-GATSBY01'),
        createdAt: now,
      });

      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
    });
  });
});

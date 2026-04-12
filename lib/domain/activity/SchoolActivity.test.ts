import { SchoolActivity, InvalidSchoolActivityError } from './SchoolActivity';
import { ActivityId } from './ActivityId';
import { ActivityStatus } from './ActivityStatus';
import { EvidenceRequirement } from './EvidenceRequirement';
import { EvidenceType } from './EvidenceType';
import { BenchmarkId } from '../benchmark/BenchmarkId';
import { LocationId } from '../tenant/LocationId';
import { StaffId } from '../staff/StaffId';
import { ASDANUnitId } from '../asdan/ASDANUnitId';

describe('SchoolActivity', () => {
  const now = new Date('2026-04-12T10:00:00Z');
  const later = new Date('2026-04-12T11:00:00Z');

  const photoEvidence = EvidenceRequirement.create({
    type: EvidenceType.Photo,
    description: 'Upload a photo of your work',
    mandatory: true,
  });

  const validProps = {
    id: ActivityId.create('ACT-001'),
    name: 'Career Research Project',
    description: 'Research a career path of your choice',
    locationId: LocationId.create('LOC-EAST'),
    gatsbyBenchmarkIds: [BenchmarkId.create('GB1'), BenchmarkId.create('GB2')],
    asdanUnitId: ASDANUnitId.create('ASDAN-COPE001'),
    evidenceRequirements: [photoEvidence],
    status: ActivityStatus.Draft,
    createdBy: StaffId.create('STAFF-GATSBY01'),
    createdAt: now,
    updatedAt: now,
  };

  describe('create', () => {
    it('creates valid school activity', () => {
      const activity = SchoolActivity.create(validProps);

      expect(activity.id.equals(validProps.id)).toBe(true);
      expect(activity.name).toBe('Career Research Project');
      expect(activity.description).toBe('Research a career path of your choice');
      expect(activity.locationId.equals(validProps.locationId)).toBe(true);
    });

    it('creates activity with single benchmark', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        gatsbyBenchmarkIds: [BenchmarkId.create('GB1')],
      });

      expect(activity.gatsbyBenchmarkIds).toHaveLength(1);
    });

    it('creates activity with multiple benchmarks', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        gatsbyBenchmarkIds: [
          BenchmarkId.create('GB1'),
          BenchmarkId.create('GB2'),
          BenchmarkId.create('GB3'),
        ],
      });

      expect(activity.gatsbyBenchmarkIds).toHaveLength(3);
    });

    it('creates activity with ASDAN unit reference', () => {
      const activity = SchoolActivity.create(validProps);

      expect(activity.asdanUnitId?.toString()).toBe('ASDAN-COPE001');
    });

    it('creates activity without ASDAN unit reference', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        asdanUnitId: undefined,
      });

      expect(activity.asdanUnitId).toBeUndefined();
    });

    it('creates activity with evidence requirements', () => {
      const activity = SchoolActivity.create(validProps);

      expect(activity.evidenceRequirements).toHaveLength(1);
      expect(activity.evidenceRequirements[0].type).toBe(EvidenceType.Photo);
    });

    it('creates activity with empty evidence requirements', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        evidenceRequirements: [],
      });

      expect(activity.evidenceRequirements).toHaveLength(0);
    });

    it('defaults status to draft', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: undefined,
      });

      expect(activity.status).toBe(ActivityStatus.Draft);
    });

    it('sets createdAt and updatedAt timestamps', () => {
      const activity = SchoolActivity.create(validProps);

      expect(activity.createdAt).toEqual(now);
      expect(activity.updatedAt).toEqual(now);
    });

    it('trims whitespace from name', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        name: '  Career Research Project  ',
      });

      expect(activity.name).toBe('Career Research Project');
    });
  });

  describe('validation', () => {
    it('throws for empty name', () => {
      expect(() =>
        SchoolActivity.create({
          ...validProps,
          name: '',
        })
      ).toThrow(InvalidSchoolActivityError);
    });

    it('throws for whitespace-only name', () => {
      expect(() =>
        SchoolActivity.create({
          ...validProps,
          name: '   ',
        })
      ).toThrow(InvalidSchoolActivityError);
    });

    it('throws for empty benchmarkIds array', () => {
      expect(() =>
        SchoolActivity.create({
          ...validProps,
          gatsbyBenchmarkIds: [],
        })
      ).toThrow(InvalidSchoolActivityError);
    });

    it('error message mentions missing benchmark', () => {
      try {
        SchoolActivity.create({
          ...validProps,
          gatsbyBenchmarkIds: [],
        });
      } catch (error) {
        expect((error as Error).message).toContain('benchmark');
      }
    });
  });

  describe('properties', () => {
    it('exposes id property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.id.toString()).toBe('ACT-001');
    });

    it('exposes name property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.name).toBe('Career Research Project');
    });

    it('exposes description property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.description).toBe('Research a career path of your choice');
    });

    it('exposes locationId property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.locationId.toString()).toBe('LOC-EAST');
    });

    it('exposes gatsbyBenchmarkIds property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.gatsbyBenchmarkIds).toHaveLength(2);
    });

    it('exposes asdanUnitId property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.asdanUnitId?.toString()).toBe('ASDAN-COPE001');
    });

    it('exposes evidenceRequirements property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.evidenceRequirements).toHaveLength(1);
    });

    it('exposes status property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.status).toBe(ActivityStatus.Draft);
    });

    it('exposes createdBy property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.createdBy.toString()).toBe('STAFF-GATSBY01');
    });

    it('exposes createdAt property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.createdAt).toEqual(now);
    });

    it('exposes updatedAt property', () => {
      const activity = SchoolActivity.create(validProps);
      expect(activity.updatedAt).toEqual(now);
    });
  });

  describe('hasBenchmark', () => {
    it('returns true when activity has benchmark', () => {
      const activity = SchoolActivity.create(validProps);

      expect(activity.hasBenchmark(BenchmarkId.create('GB1'))).toBe(true);
      expect(activity.hasBenchmark(BenchmarkId.create('GB2'))).toBe(true);
    });

    it('returns false when activity lacks benchmark', () => {
      const activity = SchoolActivity.create(validProps);

      expect(activity.hasBenchmark(BenchmarkId.create('GB5'))).toBe(false);
    });
  });

  describe('hasASDANUnit', () => {
    it('returns true when activity has ASDAN unit', () => {
      const activity = SchoolActivity.create(validProps);

      expect(activity.hasASDANUnit()).toBe(true);
    });

    it('returns false when activity lacks ASDAN unit', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        asdanUnitId: undefined,
      });

      expect(activity.hasASDANUnit()).toBe(false);
    });
  });

  describe('isDraft', () => {
    it('returns true for draft status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Draft,
      });

      expect(activity.isDraft()).toBe(true);
    });

    it('returns false for active status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Active,
      });

      expect(activity.isDraft()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('returns true for active status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Active,
      });

      expect(activity.isActive()).toBe(true);
    });

    it('returns false for draft status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Draft,
      });

      expect(activity.isActive()).toBe(false);
    });
  });

  describe('isArchived', () => {
    it('returns true for archived status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Archived,
      });

      expect(activity.isArchived()).toBe(true);
    });

    it('returns false for active status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Active,
      });

      expect(activity.isArchived()).toBe(false);
    });
  });

  describe('activate', () => {
    it('returns new activity with active status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Draft,
      });

      const activated = activity.activate(later);

      expect(activated.status).toBe(ActivityStatus.Active);
      expect(activity.status).toBe(ActivityStatus.Draft); // Original unchanged
    });

    it('updates updatedAt timestamp', () => {
      const activity = SchoolActivity.create(validProps);

      const activated = activity.activate(later);

      expect(activated.updatedAt).toEqual(later);
      expect(activated.createdAt).toEqual(now); // createdAt preserved
    });

    it('does not mutate original activity', () => {
      const activity = SchoolActivity.create(validProps);

      activity.activate(later);

      expect(activity.status).toBe(ActivityStatus.Draft);
      expect(activity.updatedAt).toEqual(now);
    });
  });

  describe('archive', () => {
    it('returns new activity with archived status', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Active,
      });

      const archived = activity.archive(later);

      expect(archived.status).toBe(ActivityStatus.Archived);
      expect(activity.status).toBe(ActivityStatus.Active); // Original unchanged
    });

    it('updates updatedAt timestamp', () => {
      const activity = SchoolActivity.create(validProps);

      const archived = activity.archive(later);

      expect(archived.updatedAt).toEqual(later);
      expect(archived.createdAt).toEqual(now); // createdAt preserved
    });

    it('does not mutate original activity', () => {
      const activity = SchoolActivity.create({
        ...validProps,
        status: ActivityStatus.Active,
      });

      activity.archive(later);

      expect(activity.status).toBe(ActivityStatus.Active);
      expect(activity.updatedAt).toEqual(now);
    });
  });

  describe('immutability', () => {
    it('gatsbyBenchmarkIds array is frozen', () => {
      const activity = SchoolActivity.create(validProps);

      expect(() => {
        (activity.gatsbyBenchmarkIds as BenchmarkId[]).push(BenchmarkId.create('GB3'));
      }).toThrow();
    });

    it('evidenceRequirements array is frozen', () => {
      const activity = SchoolActivity.create(validProps);
      const newReq = EvidenceRequirement.create({
        type: EvidenceType.Voice,
        description: 'Voice note',
      });

      expect(() => {
        (activity.evidenceRequirements as EvidenceRequirement[]).push(newReq);
      }).toThrow();
    });
  });

  describe('equals', () => {
    it('returns true for same id', () => {
      const activity1 = SchoolActivity.create(validProps);
      const activity2 = SchoolActivity.create({
        ...validProps,
        name: 'Different Name',
      });

      expect(activity1.equals(activity2)).toBe(true);
    });

    it('returns false for different ids', () => {
      const activity1 = SchoolActivity.create(validProps);
      const activity2 = SchoolActivity.create({
        ...validProps,
        id: ActivityId.create('ACT-002'),
      });

      expect(activity1.equals(activity2)).toBe(false);
    });
  });
});

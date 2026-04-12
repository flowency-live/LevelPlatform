import {
  SubmitEvidence,
  StudentNotFoundError,
  ActivityNotFoundError,
  ActivityNotActiveError,
} from './SubmitEvidence';
import { InMemoryStudentRepository } from '../domain/student/InMemoryStudentRepository';
import { InMemorySchoolActivityRepository } from '../domain/activity/InMemorySchoolActivityRepository';
import { InMemoryEvidenceRepository } from '../domain/evidence/InMemoryEvidenceRepository';
import { Student } from '../domain/student/Student';
import { StudentId } from '../domain/student/StudentId';
import { SchoolActivity } from '../domain/activity/SchoolActivity';
import { ActivityId } from '../domain/activity/ActivityId';
import { ActivityStatus } from '../domain/activity/ActivityStatus';
import { EvidenceType } from '../domain/activity/EvidenceType';
import { EvidenceRequirement } from '../domain/activity/EvidenceRequirement';
import { StaffId } from '../domain/staff/StaffId';
import { LocationId } from '../domain/tenant/LocationId';
import { BenchmarkId } from '../domain/benchmark/BenchmarkId';
import { SubmissionStatus } from '../domain/evidence/SubmissionStatus';
import { SubdivisionId } from '../domain/tenant/SubdivisionId';
import { TenantId } from '../domain/tenant/TenantId';

describe('SubmitEvidence', () => {
  let studentRepository: InMemoryStudentRepository;
  let activityRepository: InMemorySchoolActivityRepository;
  let evidenceRepository: InMemoryEvidenceRepository;
  let useCase: SubmitEvidence;

  const now = new Date('2026-04-12T10:00:00Z');
  const locationId = LocationId.create('LOC-EAST');
  const tenantId = TenantId.create('TENANT-ARNFIELD');

  const createStudent = (id: string) => {
    return Student.create({
      id: StudentId.create(id),
      firstName: 'Alice',
      lastName: 'Thompson',
      email: `${id.toLowerCase().replace('student-', '')}@school.uk`,
      tenantId,
      locationId,
      subdivisionId: SubdivisionId.create('SUB-YEAR10'),
      createdAt: now,
      updatedAt: now,
    });
  };

  const createActivity = (id: string, status: ActivityStatus = ActivityStatus.Active) => {
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
    studentRepository = new InMemoryStudentRepository();
    activityRepository = new InMemorySchoolActivityRepository();
    evidenceRepository = new InMemoryEvidenceRepository();
    useCase = new SubmitEvidence(studentRepository, activityRepository, evidenceRepository);
  });

  describe('execute', () => {
    it('creates evidence submission with valid inputs', async () => {
      const student = createStudent('STUDENT-ABC123');
      const activity = createActivity('ACT-001', ActivityStatus.Active);
      await studentRepository.save(student);
      await activityRepository.save(activity);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
        evidenceType: EvidenceType.Photo,
        url: 'https://storage.example.com/evidence/photo123.jpg',
        submittedAt: now,
      });

      expect(result.studentId.toString()).toBe('STUDENT-ABC123');
      expect(result.activityId.toString()).toBe('ACT-001');
      expect(result.content.type).toBe(EvidenceType.Photo);
      expect(result.content.url).toBe('https://storage.example.com/evidence/photo123.jpg');
    });

    it('sets status to Pending', async () => {
      const student = createStudent('STUDENT-ABC123');
      const activity = createActivity('ACT-001', ActivityStatus.Active);
      await studentRepository.save(student);
      await activityRepository.save(activity);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
        evidenceType: EvidenceType.Photo,
        url: 'https://storage.example.com/evidence/photo123.jpg',
        submittedAt: now,
      });

      expect(result.status).toBe(SubmissionStatus.Pending);
      expect(result.isPending()).toBe(true);
    });

    it('generates unique EvidenceId', async () => {
      const student = createStudent('STUDENT-ABC123');
      const activity = createActivity('ACT-001', ActivityStatus.Active);
      await studentRepository.save(student);
      await activityRepository.save(activity);

      const result1 = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
        evidenceType: EvidenceType.Photo,
        url: 'https://storage.example.com/evidence/photo1.jpg',
        submittedAt: now,
      });

      const result2 = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
        evidenceType: EvidenceType.Photo,
        url: 'https://storage.example.com/evidence/photo2.jpg',
        submittedAt: now,
      });

      expect(result1.id.equals(result2.id)).toBe(false);
    });

    it('persists the evidence submission', async () => {
      const student = createStudent('STUDENT-ABC123');
      const activity = createActivity('ACT-001', ActivityStatus.Active);
      await studentRepository.save(student);
      await activityRepository.save(activity);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
        evidenceType: EvidenceType.Photo,
        url: 'https://storage.example.com/evidence/photo123.jpg',
        submittedAt: now,
      });

      const found = await evidenceRepository.findById(result.id);
      expect(found).not.toBeNull();
      expect(found!.studentId.toString()).toBe('STUDENT-ABC123');
    });

    it('throws StudentNotFoundError if student not found', async () => {
      const activity = createActivity('ACT-001', ActivityStatus.Active);
      await activityRepository.save(activity);

      await expect(
        useCase.execute({
          studentId: StudentId.create('STUDENT-NOTFOUND'),
          activityId: ActivityId.create('ACT-001'),
          evidenceType: EvidenceType.Photo,
          url: 'https://storage.example.com/evidence/photo123.jpg',
          submittedAt: now,
        })
      ).rejects.toThrow(StudentNotFoundError);
    });

    it('throws ActivityNotFoundError if activity not found', async () => {
      const student = createStudent('STUDENT-ABC123');
      await studentRepository.save(student);

      await expect(
        useCase.execute({
          studentId: StudentId.create('STUDENT-ABC123'),
          activityId: ActivityId.create('ACT-NOTFOUND'),
          evidenceType: EvidenceType.Photo,
          url: 'https://storage.example.com/evidence/photo123.jpg',
          submittedAt: now,
        })
      ).rejects.toThrow(ActivityNotFoundError);
    });

    it('throws ActivityNotActiveError if activity is draft', async () => {
      const student = createStudent('STUDENT-ABC123');
      const activity = createActivity('ACT-001', ActivityStatus.Draft);
      await studentRepository.save(student);
      await activityRepository.save(activity);

      await expect(
        useCase.execute({
          studentId: StudentId.create('STUDENT-ABC123'),
          activityId: ActivityId.create('ACT-001'),
          evidenceType: EvidenceType.Photo,
          url: 'https://storage.example.com/evidence/photo123.jpg',
          submittedAt: now,
        })
      ).rejects.toThrow(ActivityNotActiveError);
    });

    it('throws ActivityNotActiveError if activity is archived', async () => {
      const student = createStudent('STUDENT-ABC123');
      const activity = createActivity('ACT-001', ActivityStatus.Archived);
      await studentRepository.save(student);
      await activityRepository.save(activity);

      await expect(
        useCase.execute({
          studentId: StudentId.create('STUDENT-ABC123'),
          activityId: ActivityId.create('ACT-001'),
          evidenceType: EvidenceType.Photo,
          url: 'https://storage.example.com/evidence/photo123.jpg',
          submittedAt: now,
        })
      ).rejects.toThrow(ActivityNotActiveError);
    });

    it('sets correct timestamps', async () => {
      const student = createStudent('STUDENT-ABC123');
      const activity = createActivity('ACT-001', ActivityStatus.Active);
      await studentRepository.save(student);
      await activityRepository.save(activity);

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
        evidenceType: EvidenceType.Photo,
        url: 'https://storage.example.com/evidence/photo123.jpg',
        submittedAt: now,
      });

      expect(result.submittedAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
    });
  });
});

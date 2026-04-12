import {
  ReviewEvidence,
  EvidenceNotFoundError,
  StaffNotFoundError,
  EvidenceNotPendingError,
  RejectionFeedbackRequiredError,
} from './ReviewEvidence';
import { InMemoryEvidenceRepository } from '../domain/evidence/InMemoryEvidenceRepository';
import { InMemoryStaffRepository } from '../domain/staff/InMemoryStaffRepository';
import { EvidenceSubmission } from '../domain/evidence/EvidenceSubmission';
import { EvidenceId } from '../domain/evidence/EvidenceId';
import { EvidenceContent } from '../domain/evidence/EvidenceContent';
import { SubmissionStatus } from '../domain/evidence/SubmissionStatus';
import { StaffMember } from '../domain/staff/StaffMember';
import { StaffId } from '../domain/staff/StaffId';
import { Role } from '../domain/staff/Role';
import { StaffType } from '../domain/staff/StaffType';
import { StudentId } from '../domain/student/StudentId';
import { ActivityId } from '../domain/activity/ActivityId';
import { EvidenceType } from '../domain/activity/EvidenceType';
import { TenantId } from '../domain/tenant/TenantId';

describe('ReviewEvidence', () => {
  let evidenceRepository: InMemoryEvidenceRepository;
  let staffRepository: InMemoryStaffRepository;
  let useCase: ReviewEvidence;

  const now = new Date('2026-04-12T10:00:00Z');
  const later = new Date('2026-04-12T14:00:00Z');
  const tenantId = TenantId.create('TENANT-ARNFIELD');

  const createEvidence = (id: string, status: 'pending' | 'approved' | 'rejected' = 'pending') => {
    const evidence = EvidenceSubmission.create({
      id: EvidenceId.create(id),
      studentId: StudentId.create('STUDENT-ABC123'),
      activityId: ActivityId.create('ACT-001'),
      content: EvidenceContent.create({
        type: EvidenceType.Photo,
        url: 'https://storage.example.com/evidence/photo123.jpg',
        uploadedAt: now,
      }),
      submittedAt: now,
      updatedAt: now,
    });

    if (status === 'approved') {
      return evidence.approve(StaffId.create('STAFF-REVIEWER01'), now, 'Great work!');
    }
    if (status === 'rejected') {
      return evidence.reject(StaffId.create('STAFF-REVIEWER01'), now, 'Needs improvement');
    }
    return evidence;
  };

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
    evidenceRepository = new InMemoryEvidenceRepository();
    staffRepository = new InMemoryStaffRepository();
    useCase = new ReviewEvidence(evidenceRepository, staffRepository);
  });

  describe('execute - approve', () => {
    it('approves pending evidence', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      const result = await useCase.execute({
        evidenceId: EvidenceId.create('EVD-001'),
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        decision: 'approve',
        reviewedAt: later,
      });

      expect(result.status).toBe(SubmissionStatus.Approved);
      expect(result.isApproved()).toBe(true);
    });

    it('updates the updatedAt timestamp', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      const result = await useCase.execute({
        evidenceId: EvidenceId.create('EVD-001'),
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        decision: 'approve',
        reviewedAt: later,
      });

      expect(result.updatedAt).toEqual(later);
    });

    it('persists the approved evidence', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      await useCase.execute({
        evidenceId: EvidenceId.create('EVD-001'),
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        decision: 'approve',
        reviewedAt: later,
      });

      const found = await evidenceRepository.findById(EvidenceId.create('EVD-001'));
      expect(found!.status).toBe(SubmissionStatus.Approved);
    });

    it('includes optional feedback when approving', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      const result = await useCase.execute({
        evidenceId: EvidenceId.create('EVD-001'),
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        decision: 'approve',
        feedback: 'Excellent work!',
        reviewedAt: later,
      });

      expect(result.review?.feedback).toBe('Excellent work!');
    });
  });

  describe('execute - reject', () => {
    it('rejects pending evidence with feedback', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      const result = await useCase.execute({
        evidenceId: EvidenceId.create('EVD-001'),
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        decision: 'reject',
        feedback: 'Photo is too blurry, please retake.',
        reviewedAt: later,
      });

      expect(result.status).toBe(SubmissionStatus.Rejected);
      expect(result.isRejected()).toBe(true);
    });

    it('requires feedback when rejecting', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      await expect(
        useCase.execute({
          evidenceId: EvidenceId.create('EVD-001'),
          reviewedBy: StaffId.create('STAFF-GATSBY01'),
          decision: 'reject',
          reviewedAt: later,
        })
      ).rejects.toThrow(RejectionFeedbackRequiredError);
    });

    it('includes feedback in rejection review', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      const result = await useCase.execute({
        evidenceId: EvidenceId.create('EVD-001'),
        reviewedBy: StaffId.create('STAFF-GATSBY01'),
        decision: 'reject',
        feedback: 'Photo is too blurry, please retake.',
        reviewedAt: later,
      });

      expect(result.review?.feedback).toBe('Photo is too blurry, please retake.');
    });
  });

  describe('execute - error cases', () => {
    it('throws EvidenceNotFoundError if evidence not found', async () => {
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await staffRepository.save(reviewer);

      await expect(
        useCase.execute({
          evidenceId: EvidenceId.create('EVD-NOTFOUND'),
          reviewedBy: StaffId.create('STAFF-GATSBY01'),
          decision: 'approve',
          reviewedAt: later,
        })
      ).rejects.toThrow(EvidenceNotFoundError);
    });

    it('throws StaffNotFoundError if reviewer not found', async () => {
      const evidence = createEvidence('EVD-001', 'pending');
      await evidenceRepository.save(evidence);

      await expect(
        useCase.execute({
          evidenceId: EvidenceId.create('EVD-001'),
          reviewedBy: StaffId.create('STAFF-NOTFOUND'),
          decision: 'approve',
          reviewedAt: later,
        })
      ).rejects.toThrow(StaffNotFoundError);
    });

    it('throws EvidenceNotPendingError if evidence already approved', async () => {
      const evidence = createEvidence('EVD-001', 'approved');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      await expect(
        useCase.execute({
          evidenceId: EvidenceId.create('EVD-001'),
          reviewedBy: StaffId.create('STAFF-GATSBY01'),
          decision: 'approve',
          reviewedAt: later,
        })
      ).rejects.toThrow(EvidenceNotPendingError);
    });

    it('throws EvidenceNotPendingError if evidence already rejected', async () => {
      const evidence = createEvidence('EVD-001', 'rejected');
      const reviewer = createStaffMember('STAFF-GATSBY01');
      await evidenceRepository.save(evidence);
      await staffRepository.save(reviewer);

      await expect(
        useCase.execute({
          evidenceId: EvidenceId.create('EVD-001'),
          reviewedBy: StaffId.create('STAFF-GATSBY01'),
          decision: 'reject',
          feedback: 'More feedback',
          reviewedAt: later,
        })
      ).rejects.toThrow(EvidenceNotPendingError);
    });
  });
});

import { GetPendingEvidence } from './GetPendingEvidence';
import { InMemoryEvidenceRepository } from '../domain/evidence/InMemoryEvidenceRepository';
import { EvidenceSubmission } from '../domain/evidence/EvidenceSubmission';
import { EvidenceId } from '../domain/evidence/EvidenceId';
import { EvidenceContent } from '../domain/evidence/EvidenceContent';
import { StudentId } from '../domain/student/StudentId';
import { ActivityId } from '../domain/activity/ActivityId';
import { EvidenceType } from '../domain/activity/EvidenceType';
import { StaffId } from '../domain/staff/StaffId';

describe('GetPendingEvidence', () => {
  let evidenceRepository: InMemoryEvidenceRepository;
  let useCase: GetPendingEvidence;

  const now = new Date('2026-04-12T10:00:00Z');

  const createEvidence = (
    id: string,
    studentId: string = 'STUDENT-ABC123',
    status: 'pending' | 'approved' | 'rejected' = 'pending'
  ) => {
    const evidence = EvidenceSubmission.create({
      id: EvidenceId.create(id),
      studentId: StudentId.create(studentId),
      activityId: ActivityId.create('ACT-001'),
      content: EvidenceContent.create({
        type: EvidenceType.Photo,
        url: `https://storage.example.com/evidence/${id.toLowerCase()}.jpg`,
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

  beforeEach(() => {
    evidenceRepository = new InMemoryEvidenceRepository();
    useCase = new GetPendingEvidence(evidenceRepository);
  });

  describe('execute', () => {
    it('returns all pending evidence submissions', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'pending'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-XYZ789', 'pending'));
      await evidenceRepository.save(createEvidence('EVD-003', 'STUDENT-ABC123', 'approved'));

      const result = await useCase.execute({});

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id.toString())).toContain('EVD-001');
      expect(result.map((e) => e.id.toString())).toContain('EVD-002');
    });

    it('returns empty array if no pending evidence', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'approved'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-XYZ789', 'rejected'));

      const result = await useCase.execute({});

      expect(result).toHaveLength(0);
    });

    it('excludes approved evidence', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'pending'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-XYZ789', 'approved'));

      const result = await useCase.execute({});

      expect(result).toHaveLength(1);
      expect(result[0].id.toString()).toBe('EVD-001');
    });

    it('excludes rejected evidence', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'pending'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-XYZ789', 'rejected'));

      const result = await useCase.execute({});

      expect(result).toHaveLength(1);
      expect(result[0].id.toString()).toBe('EVD-001');
    });

    it('returns pending evidence from multiple students', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'pending'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-XYZ789', 'pending'));
      await evidenceRepository.save(createEvidence('EVD-003', 'STUDENT-DEF456', 'pending'));

      const result = await useCase.execute({});

      expect(result).toHaveLength(3);
    });
  });
});

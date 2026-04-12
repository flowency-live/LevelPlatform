import { GetStudentEvidence } from './GetStudentEvidence';
import { InMemoryEvidenceRepository } from '../domain/evidence/InMemoryEvidenceRepository';
import { EvidenceSubmission } from '../domain/evidence/EvidenceSubmission';
import { EvidenceId } from '../domain/evidence/EvidenceId';
import { EvidenceContent } from '../domain/evidence/EvidenceContent';
import { StudentId } from '../domain/student/StudentId';
import { ActivityId } from '../domain/activity/ActivityId';
import { EvidenceType } from '../domain/activity/EvidenceType';
import { StaffId } from '../domain/staff/StaffId';

describe('GetStudentEvidence', () => {
  let evidenceRepository: InMemoryEvidenceRepository;
  let useCase: GetStudentEvidence;

  const now = new Date('2026-04-12T10:00:00Z');

  const createEvidence = (
    id: string,
    studentId: string,
    activityId: string,
    status: 'pending' | 'approved' | 'rejected' = 'pending'
  ) => {
    const evidence = EvidenceSubmission.create({
      id: EvidenceId.create(id),
      studentId: StudentId.create(studentId),
      activityId: ActivityId.create(activityId),
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
    useCase = new GetStudentEvidence(evidenceRepository);
  });

  describe('execute', () => {
    it('returns all evidence for a student', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'ACT-001'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-ABC123', 'ACT-002'));
      await evidenceRepository.save(createEvidence('EVD-003', 'STUDENT-XYZ789', 'ACT-001'));

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id.toString())).toContain('EVD-001');
      expect(result.map((e) => e.id.toString())).toContain('EVD-002');
    });

    it('returns empty array if student has no evidence', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-XYZ789', 'ACT-001'));

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result).toHaveLength(0);
    });

    it('filters by activity when provided', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'ACT-001'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-ABC123', 'ACT-002'));
      await evidenceRepository.save(createEvidence('EVD-003', 'STUDENT-ABC123', 'ACT-001'));

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
      });

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id.toString())).toContain('EVD-001');
      expect(result.map((e) => e.id.toString())).toContain('EVD-003');
    });

    it('returns evidence of all statuses', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'ACT-001', 'pending'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-ABC123', 'ACT-002', 'approved'));
      await evidenceRepository.save(createEvidence('EVD-003', 'STUDENT-ABC123', 'ACT-003', 'rejected'));

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
      });

      expect(result).toHaveLength(3);
    });

    it('does not return evidence from other students when filtering by activity', async () => {
      await evidenceRepository.save(createEvidence('EVD-001', 'STUDENT-ABC123', 'ACT-001'));
      await evidenceRepository.save(createEvidence('EVD-002', 'STUDENT-XYZ789', 'ACT-001'));

      const result = await useCase.execute({
        studentId: StudentId.create('STUDENT-ABC123'),
        activityId: ActivityId.create('ACT-001'),
      });

      expect(result).toHaveLength(1);
      expect(result[0].id.toString()).toBe('EVD-001');
    });
  });
});

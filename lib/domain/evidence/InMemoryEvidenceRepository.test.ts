import { InMemoryEvidenceRepository } from './InMemoryEvidenceRepository';
import { EvidenceSubmission } from './EvidenceSubmission';
import { EvidenceId } from './EvidenceId';
import { EvidenceContent } from './EvidenceContent';
import { SubmissionStatus } from './SubmissionStatus';
import { StudentId } from '../student/StudentId';
import { ActivityId } from '../activity/ActivityId';
import { StaffId } from '../staff/StaffId';
import { EvidenceType } from '../activity/EvidenceType';

describe('InMemoryEvidenceRepository', () => {
  let repository: InMemoryEvidenceRepository;
  const now = new Date('2026-04-12T10:00:00Z');
  const reviewedAt = new Date('2026-04-12T14:00:00Z');

  const createContent = (type: EvidenceType = EvidenceType.Photo) =>
    EvidenceContent.create({
      type,
      url: `https://storage.example.com/${type}/evidence.${type === EvidenceType.Photo ? 'jpg' : 'mp3'}`,
      uploadedAt: now,
    });

  const createSubmission = (
    overrides: Partial<{
      id: string;
      studentId: string;
      activityId: string;
      type: EvidenceType;
    }> = {}
  ) => {
    return EvidenceSubmission.create({
      id: EvidenceId.create(overrides.id ?? 'EVD-001'),
      studentId: StudentId.create(overrides.studentId ?? 'STUDENT-001'),
      activityId: ActivityId.create(overrides.activityId ?? 'ACT-001'),
      content: createContent(overrides.type ?? EvidenceType.Photo),
      submittedAt: now,
      updatedAt: now,
    });
  };

  beforeEach(() => {
    repository = new InMemoryEvidenceRepository();
  });

  describe('save and findById', () => {
    it('saves and retrieves a submission', async () => {
      const submission = createSubmission();

      await repository.save(submission);
      const found = await repository.findById(submission.id);

      expect(found).not.toBeNull();
      expect(found!.id.equals(submission.id)).toBe(true);
      expect(found!.studentId.equals(submission.studentId)).toBe(true);
    });

    it('returns null for non-existent submission', async () => {
      const found = await repository.findById(EvidenceId.create('EVD-NOTFOUND'));

      expect(found).toBeNull();
    });

    it('overwrites existing submission on save', async () => {
      const original = createSubmission({ id: 'EVD-001' });
      await repository.save(original);

      const approved = original.approve(StaffId.create('STAFF-GATSBY01'), reviewedAt);
      await repository.save(approved);

      const found = await repository.findById(EvidenceId.create('EVD-001'));

      expect(found!.status).toBe(SubmissionStatus.Approved);
    });

    it('preserves all properties through save/retrieve', async () => {
      const submission = createSubmission();

      await repository.save(submission);
      const found = await repository.findById(submission.id);

      expect(found!.content.type).toBe(EvidenceType.Photo);
      expect(found!.status).toBe(SubmissionStatus.Pending);
      expect(found!.submittedAt).toEqual(now);
    });
  });

  describe('findByStudent', () => {
    it('returns submissions for student', async () => {
      const submission1 = createSubmission({ id: 'EVD-001', studentId: 'STUDENT-001' });
      const submission2 = createSubmission({ id: 'EVD-002', studentId: 'STUDENT-001' });
      const submission3 = createSubmission({ id: 'EVD-003', studentId: 'STUDENT-002' });

      await repository.save(submission1);
      await repository.save(submission2);
      await repository.save(submission3);

      const found = await repository.findByStudent(StudentId.create('STUDENT-001'));

      expect(found).toHaveLength(2);
      expect(found.some((s) => s.id.equals(EvidenceId.create('EVD-001')))).toBe(true);
      expect(found.some((s) => s.id.equals(EvidenceId.create('EVD-002')))).toBe(true);
    });

    it('returns empty array when no submissions for student', async () => {
      const submission = createSubmission({ studentId: 'STUDENT-001' });
      await repository.save(submission);

      const found = await repository.findByStudent(StudentId.create('STUDENT-EMPTY'));

      expect(found).toEqual([]);
    });
  });

  describe('findByActivity', () => {
    it('returns submissions for activity', async () => {
      const submission1 = createSubmission({ id: 'EVD-001', activityId: 'ACT-001' });
      const submission2 = createSubmission({ id: 'EVD-002', activityId: 'ACT-001' });
      const submission3 = createSubmission({ id: 'EVD-003', activityId: 'ACT-002' });

      await repository.save(submission1);
      await repository.save(submission2);
      await repository.save(submission3);

      const found = await repository.findByActivity(ActivityId.create('ACT-001'));

      expect(found).toHaveLength(2);
    });

    it('returns empty array when no submissions for activity', async () => {
      const submission = createSubmission({ activityId: 'ACT-001' });
      await repository.save(submission);

      const found = await repository.findByActivity(ActivityId.create('ACT-EMPTY'));

      expect(found).toEqual([]);
    });
  });

  describe('findByStudentAndActivity', () => {
    it('returns submissions matching both student and activity', async () => {
      const submission1 = createSubmission({
        id: 'EVD-001',
        studentId: 'STUDENT-001',
        activityId: 'ACT-001',
      });
      const submission2 = createSubmission({
        id: 'EVD-002',
        studentId: 'STUDENT-001',
        activityId: 'ACT-002',
      });
      const submission3 = createSubmission({
        id: 'EVD-003',
        studentId: 'STUDENT-002',
        activityId: 'ACT-001',
      });

      await repository.save(submission1);
      await repository.save(submission2);
      await repository.save(submission3);

      const found = await repository.findByStudentAndActivity(
        StudentId.create('STUDENT-001'),
        ActivityId.create('ACT-001')
      );

      expect(found).toHaveLength(1);
      expect(found[0].id.equals(EvidenceId.create('EVD-001'))).toBe(true);
    });

    it('returns empty array when no matching submissions', async () => {
      const submission = createSubmission({
        studentId: 'STUDENT-001',
        activityId: 'ACT-001',
      });
      await repository.save(submission);

      const found = await repository.findByStudentAndActivity(
        StudentId.create('STUDENT-001'),
        ActivityId.create('ACT-002')
      );

      expect(found).toEqual([]);
    });
  });

  describe('findPending', () => {
    it('returns only pending submissions', async () => {
      const pending = createSubmission({ id: 'EVD-001' });
      const approved = createSubmission({ id: 'EVD-002' }).approve(
        StaffId.create('STAFF-001'),
        reviewedAt
      );
      const rejected = createSubmission({ id: 'EVD-003' }).reject(
        StaffId.create('STAFF-001'),
        reviewedAt,
        'Feedback'
      );

      await repository.save(pending);
      await repository.save(approved);
      await repository.save(rejected);

      const found = await repository.findPending();

      expect(found).toHaveLength(1);
      expect(found[0].id.equals(EvidenceId.create('EVD-001'))).toBe(true);
    });

    it('returns empty array when no pending submissions', async () => {
      const approved = createSubmission({ id: 'EVD-001' }).approve(
        StaffId.create('STAFF-001'),
        reviewedAt
      );

      await repository.save(approved);

      const found = await repository.findPending();

      expect(found).toEqual([]);
    });

    it('returns all pending submissions from different students', async () => {
      const pending1 = createSubmission({ id: 'EVD-001', studentId: 'STUDENT-001' });
      const pending2 = createSubmission({ id: 'EVD-002', studentId: 'STUDENT-002' });

      await repository.save(pending1);
      await repository.save(pending2);

      const found = await repository.findPending();

      expect(found).toHaveLength(2);
    });
  });

  describe('multiple operations', () => {
    it('handles multiple submissions from same student for same activity', async () => {
      const submission1 = createSubmission({
        id: 'EVD-001',
        studentId: 'STUDENT-001',
        activityId: 'ACT-001',
      });
      const submission2 = createSubmission({
        id: 'EVD-002',
        studentId: 'STUDENT-001',
        activityId: 'ACT-001',
      });

      await repository.save(submission1);
      await repository.save(submission2);

      const found = await repository.findByStudentAndActivity(
        StudentId.create('STUDENT-001'),
        ActivityId.create('ACT-001')
      );

      expect(found).toHaveLength(2);
    });
  });
});

import { InMemoryASDANProgressRepository } from './InMemoryASDANProgressRepository';
import { ASDANProgress } from './ASDANProgress';
import { ASDANQualificationId } from './ASDANQualificationId';
import { ASDANUnitId } from './ASDANUnitId';
import { StudentId } from '../student/StudentId';

describe('InMemoryASDANProgressRepository', () => {
  let repository: InMemoryASDANProgressRepository;
  const enrolledAt = new Date('2024-01-01');
  const updatedAt = new Date('2024-01-01');

  const createProgress = (
    overrides: Partial<{
      studentId: string;
      qualificationId: string;
      completedUnitIds: string[];
    }> = {}
  ) => {
    return ASDANProgress.create({
      studentId: StudentId.create(overrides.studentId ?? 'STUDENT-001'),
      qualificationId: ASDANQualificationId.create(
        overrides.qualificationId ?? 'COPE-L1'
      ),
      completedUnitIds: (overrides.completedUnitIds ?? []).map((id) =>
        ASDANUnitId.create(id)
      ),
      enrolledAt,
      updatedAt,
    });
  };

  beforeEach(() => {
    repository = new InMemoryASDANProgressRepository();
  });

  describe('save and findById', () => {
    it('saves and retrieves a progress', async () => {
      const progress = createProgress();

      await repository.save(progress);
      const found = await repository.findById(
        progress.studentId,
        progress.qualificationId
      );

      expect(found).not.toBeNull();
      expect(found!.studentId.equals(progress.studentId)).toBe(true);
      expect(found!.qualificationId.equals(progress.qualificationId)).toBe(
        true
      );
    });

    it('returns null for non-existent progress', async () => {
      const found = await repository.findById(
        StudentId.create('STUDENT-NOTFOUND'),
        ASDANQualificationId.create('COPE-L1')
      );

      expect(found).toBeNull();
    });

    it('overwrites existing progress on save', async () => {
      const original = createProgress();
      await repository.save(original);

      const updated = original.completeUnit(
        ASDANUnitId.create('ASDAN-COPE001'),
        new Date('2024-03-15')
      );
      await repository.save(updated);

      const found = await repository.findById(
        original.studentId,
        original.qualificationId
      );

      expect(found!.completedUnitIds).toHaveLength(1);
    });

    it('preserves all properties through save/retrieve', async () => {
      const progress = createProgress({
        completedUnitIds: ['ASDAN-COPE001'],
      });

      await repository.save(progress);
      const found = await repository.findById(
        progress.studentId,
        progress.qualificationId
      );

      expect(found!.completedUnitIds).toHaveLength(1);
      expect(found!.enrolledAt).toEqual(enrolledAt);
    });
  });

  describe('findByStudent', () => {
    it('returns all progress for student', async () => {
      const progress1 = createProgress({
        studentId: 'STUDENT-001',
        qualificationId: 'COPE-L1',
      });
      const progress2 = createProgress({
        studentId: 'STUDENT-001',
        qualificationId: 'EMP-L1',
      });
      const progress3 = createProgress({
        studentId: 'STUDENT-002',
        qualificationId: 'COPE-L1',
      });

      await repository.save(progress1);
      await repository.save(progress2);
      await repository.save(progress3);

      const found = await repository.findByStudent(
        StudentId.create('STUDENT-001')
      );

      expect(found).toHaveLength(2);
      expect(
        found.some((p) =>
          p.qualificationId.equals(ASDANQualificationId.create('COPE-L1'))
        )
      ).toBe(true);
      expect(
        found.some((p) =>
          p.qualificationId.equals(ASDANQualificationId.create('EMP-L1'))
        )
      ).toBe(true);
    });

    it('returns empty array when no progress for student', async () => {
      const progress = createProgress({ studentId: 'STUDENT-001' });
      await repository.save(progress);

      const found = await repository.findByStudent(
        StudentId.create('STUDENT-EMPTY')
      );

      expect(found).toEqual([]);
    });
  });

  describe('findByQualification', () => {
    it('returns all progress for qualification', async () => {
      const progress1 = createProgress({
        studentId: 'STUDENT-001',
        qualificationId: 'COPE-L1',
      });
      const progress2 = createProgress({
        studentId: 'STUDENT-002',
        qualificationId: 'COPE-L1',
      });
      const progress3 = createProgress({
        studentId: 'STUDENT-001',
        qualificationId: 'EMP-L1',
      });

      await repository.save(progress1);
      await repository.save(progress2);
      await repository.save(progress3);

      const found = await repository.findByQualification(
        ASDANQualificationId.create('COPE-L1')
      );

      expect(found).toHaveLength(2);
      expect(
        found.some((p) => p.studentId.equals(StudentId.create('STUDENT-001')))
      ).toBe(true);
      expect(
        found.some((p) => p.studentId.equals(StudentId.create('STUDENT-002')))
      ).toBe(true);
    });

    it('returns empty array when no progress for qualification', async () => {
      const progress = createProgress({ qualificationId: 'COPE-L1' });
      await repository.save(progress);

      const found = await repository.findByQualification(
        ASDANQualificationId.create('EMP-L2')
      );

      expect(found).toEqual([]);
    });
  });

  describe('multiple qualifications for same student', () => {
    it('stores progress for multiple qualifications separately', async () => {
      const progress1 = createProgress({
        studentId: 'STUDENT-001',
        qualificationId: 'COPE-L1',
        completedUnitIds: ['ASDAN-COPE001'],
      });
      const progress2 = createProgress({
        studentId: 'STUDENT-001',
        qualificationId: 'EMP-L1',
        completedUnitIds: ['ASDAN-EMP001', 'ASDAN-EMP002'],
      });

      await repository.save(progress1);
      await repository.save(progress2);

      const foundCope = await repository.findById(
        StudentId.create('STUDENT-001'),
        ASDANQualificationId.create('COPE-L1')
      );
      const foundEmp = await repository.findById(
        StudentId.create('STUDENT-001'),
        ASDANQualificationId.create('EMP-L1')
      );

      expect(foundCope!.completedUnitIds).toHaveLength(1);
      expect(foundEmp!.completedUnitIds).toHaveLength(2);
    });
  });
});

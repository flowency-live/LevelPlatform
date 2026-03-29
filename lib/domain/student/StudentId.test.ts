import { StudentId, InvalidStudentIdError } from './StudentId';

describe('StudentId', () => {
  describe('create', () => {
    it('creates valid StudentId', () => {
      const id = StudentId.create('STUDENT-001');
      expect(id.toString()).toBe('STUDENT-001');
    });

    it('creates StudentId with alphanumeric suffix', () => {
      const id = StudentId.create('STUDENT-ABC123');
      expect(id.toString()).toBe('STUDENT-ABC123');
    });

    it('throws InvalidStudentIdError for missing prefix', () => {
      expect(() => StudentId.create('001')).toThrow(InvalidStudentIdError);
    });

    it('throws InvalidStudentIdError for wrong prefix', () => {
      expect(() => StudentId.create('USER-001')).toThrow(InvalidStudentIdError);
    });

    it('throws InvalidStudentIdError for empty string', () => {
      expect(() => StudentId.create('')).toThrow(InvalidStudentIdError);
    });

    it('throws InvalidStudentIdError for missing suffix', () => {
      expect(() => StudentId.create('STUDENT-')).toThrow(InvalidStudentIdError);
    });

    it('includes invalid value in error message', () => {
      try {
        StudentId.create('invalid');
        fail('Expected InvalidStudentIdError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidStudentIdError);
        expect((error as Error).message).toContain('invalid');
      }
    });
  });

  describe('equals', () => {
    it('returns true for same student id', () => {
      const id1 = StudentId.create('STUDENT-001');
      const id2 = StudentId.create('STUDENT-001');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different student ids', () => {
      const id1 = StudentId.create('STUDENT-001');
      const id2 = StudentId.create('STUDENT-002');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid student ids', () => {
      expect(StudentId.isValid('STUDENT-001')).toBe(true);
      expect(StudentId.isValid('STUDENT-ABC')).toBe(true);
    });

    it('returns false for invalid student ids', () => {
      expect(StudentId.isValid('USER-001')).toBe(false);
      expect(StudentId.isValid('STUDENT-')).toBe(false);
      expect(StudentId.isValid('')).toBe(false);
    });
  });
});

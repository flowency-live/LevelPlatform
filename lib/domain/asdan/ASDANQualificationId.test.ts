import {
  ASDANQualificationId,
  InvalidASDANQualificationIdError,
} from './ASDANQualificationId';

describe('ASDANQualificationId', () => {
  describe('create', () => {
    it('creates valid CoPE qualification IDs', () => {
      const validIds = ['COPE-L1', 'COPE-L2', 'COPE-L3'];
      validIds.forEach((value) => {
        const id = ASDANQualificationId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('creates valid Employability qualification IDs', () => {
      const validIds = ['EMP-L1', 'EMP-L2'];
      validIds.forEach((value) => {
        const id = ASDANQualificationId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('creates valid PDP qualification IDs', () => {
      const validIds = ['PDP-BRONZE', 'PDP-SILVER', 'PDP-GOLD'];
      validIds.forEach((value) => {
        const id = ASDANQualificationId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('creates valid Personal Progress qualification ID', () => {
      const id = ASDANQualificationId.create('PP-ENTRY');
      expect(id.toString()).toBe('PP-ENTRY');
    });

    it('creates valid Short Course qualification IDs', () => {
      const validIds = ['SC-FINANCE', 'SC-DIGITAL', 'SC-FIRSTAID'];
      validIds.forEach((value) => {
        const id = ASDANQualificationId.create(value);
        expect(id.toString()).toBe(value);
      });
    });

    it('throws InvalidASDANQualificationIdError for empty string', () => {
      expect(() => ASDANQualificationId.create('')).toThrow(
        InvalidASDANQualificationIdError
      );
    });

    it('throws InvalidASDANQualificationIdError for invalid format', () => {
      expect(() => ASDANQualificationId.create('INVALID')).toThrow(
        InvalidASDANQualificationIdError
      );
      expect(() => ASDANQualificationId.create('cope-l1')).toThrow(
        InvalidASDANQualificationIdError
      );
      expect(() => ASDANQualificationId.create('COPE_L1')).toThrow(
        InvalidASDANQualificationIdError
      );
    });

    it('throws InvalidASDANQualificationIdError for unknown prefix', () => {
      expect(() => ASDANQualificationId.create('XYZ-L1')).toThrow(
        InvalidASDANQualificationIdError
      );
    });

    it('throws InvalidASDANQualificationIdError for prefix only', () => {
      expect(() => ASDANQualificationId.create('COPE-')).toThrow(
        InvalidASDANQualificationIdError
      );
    });

    it('throws InvalidASDANQualificationIdError for suffix only', () => {
      expect(() => ASDANQualificationId.create('-L1')).toThrow(
        InvalidASDANQualificationIdError
      );
    });

    it('includes invalid value in error message', () => {
      try {
        ASDANQualificationId.create('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidASDANQualificationIdError);
        expect((error as Error).message).toContain('invalid');
      }
    });
  });

  describe('equals', () => {
    it('returns true for same qualification id', () => {
      const id1 = ASDANQualificationId.create('COPE-L1');
      const id2 = ASDANQualificationId.create('COPE-L1');
      expect(id1.equals(id2)).toBe(true);
    });

    it('returns false for different qualification ids', () => {
      const id1 = ASDANQualificationId.create('COPE-L1');
      const id2 = ASDANQualificationId.create('COPE-L2');
      expect(id1.equals(id2)).toBe(false);
    });

    it('returns false for different qualification types', () => {
      const id1 = ASDANQualificationId.create('COPE-L1');
      const id2 = ASDANQualificationId.create('EMP-L1');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid qualification ids', () => {
      expect(ASDANQualificationId.isValid('COPE-L1')).toBe(true);
      expect(ASDANQualificationId.isValid('EMP-L2')).toBe(true);
      expect(ASDANQualificationId.isValid('PDP-BRONZE')).toBe(true);
      expect(ASDANQualificationId.isValid('PP-ENTRY')).toBe(true);
      expect(ASDANQualificationId.isValid('SC-FINANCE')).toBe(true);
    });

    it('returns false for invalid qualification ids', () => {
      expect(ASDANQualificationId.isValid('')).toBe(false);
      expect(ASDANQualificationId.isValid('INVALID')).toBe(false);
      expect(ASDANQualificationId.isValid('cope-l1')).toBe(false);
      expect(ASDANQualificationId.isValid('COPE_L1')).toBe(false);
      expect(ASDANQualificationId.isValid('XYZ-L1')).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the string value', () => {
      const id = ASDANQualificationId.create('COPE-L1');
      expect(id.toString()).toBe('COPE-L1');
    });
  });

  describe('getType', () => {
    it('returns COPE for CoPE qualifications', () => {
      const id = ASDANQualificationId.create('COPE-L1');
      expect(id.getType()).toBe('COPE');
    });

    it('returns EMP for Employability qualifications', () => {
      const id = ASDANQualificationId.create('EMP-L2');
      expect(id.getType()).toBe('EMP');
    });

    it('returns PDP for Personal Development Programme', () => {
      const id = ASDANQualificationId.create('PDP-GOLD');
      expect(id.getType()).toBe('PDP');
    });

    it('returns PP for Personal Progress', () => {
      const id = ASDANQualificationId.create('PP-ENTRY');
      expect(id.getType()).toBe('PP');
    });

    it('returns SC for Short Courses', () => {
      const id = ASDANQualificationId.create('SC-DIGITAL');
      expect(id.getType()).toBe('SC');
    });
  });

  describe('getLevel', () => {
    it('returns level suffix for level-based qualifications', () => {
      expect(ASDANQualificationId.create('COPE-L1').getLevel()).toBe('L1');
      expect(ASDANQualificationId.create('COPE-L2').getLevel()).toBe('L2');
      expect(ASDANQualificationId.create('EMP-L1').getLevel()).toBe('L1');
    });

    it('returns named level for PDP qualifications', () => {
      expect(ASDANQualificationId.create('PDP-BRONZE').getLevel()).toBe(
        'BRONZE'
      );
      expect(ASDANQualificationId.create('PDP-SILVER').getLevel()).toBe(
        'SILVER'
      );
      expect(ASDANQualificationId.create('PDP-GOLD').getLevel()).toBe('GOLD');
    });

    it('returns ENTRY for Personal Progress', () => {
      expect(ASDANQualificationId.create('PP-ENTRY').getLevel()).toBe('ENTRY');
    });

    it('returns course code for Short Courses', () => {
      expect(ASDANQualificationId.create('SC-FINANCE').getLevel()).toBe(
        'FINANCE'
      );
    });
  });
});

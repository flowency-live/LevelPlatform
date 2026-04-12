import {
  ASDAN_QUALIFICATIONS,
  ASDANQualification,
  getQualification,
  getQualificationsByLevel,
  getAllQualifications,
} from './asdan-qualifications';
import { ASDAN_UNITS } from './asdan-units';

describe('ASDAN Qualifications Reference Data', () => {
  describe('ASDAN_QUALIFICATIONS', () => {
    it('contains qualifications', () => {
      expect(Object.keys(ASDAN_QUALIFICATIONS).length).toBeGreaterThan(0);
    });

    it('each qualification has required properties', () => {
      Object.values(ASDAN_QUALIFICATIONS).forEach(
        (qual: ASDANQualification) => {
          expect(qual.id).toBeDefined();
          expect(qual.name).toBeDefined();
          expect(typeof qual.level).toBe('number');
          expect(qual.description).toBeDefined();
          expect(qual.requiredUnits).toBeInstanceOf(Array);
          expect(qual.optionalUnits).toBeInstanceOf(Array);
          expect(typeof qual.minUnitsRequired).toBe('number');
        }
      );
    });

    it('all required units exist in ASDAN_UNITS', () => {
      Object.values(ASDAN_QUALIFICATIONS).forEach((qual) => {
        qual.requiredUnits.forEach((unitId) => {
          expect(ASDAN_UNITS[unitId]).toBeDefined();
        });
      });
    });

    it('all optional units exist in ASDAN_UNITS', () => {
      Object.values(ASDAN_QUALIFICATIONS).forEach((qual) => {
        qual.optionalUnits.forEach((unitId) => {
          expect(ASDAN_UNITS[unitId]).toBeDefined();
        });
      });
    });
  });

  describe('CoPE Qualifications', () => {
    it('has CoPE Level 1', () => {
      const qual = ASDAN_QUALIFICATIONS['COPE-L1'];
      expect(qual).toBeDefined();
      expect(qual.name).toContain('Certificate of Personal Effectiveness');
      expect(qual.level).toBe(1);
    });

    it('has CoPE Level 2', () => {
      const qual = ASDAN_QUALIFICATIONS['COPE-L2'];
      expect(qual).toBeDefined();
      expect(qual.level).toBe(2);
    });

    it('has CoPE Level 3', () => {
      const qual = ASDAN_QUALIFICATIONS['COPE-L3'];
      expect(qual).toBeDefined();
      expect(qual.level).toBe(3);
    });
  });

  describe('Employability Qualifications', () => {
    it('has Employability Level 1', () => {
      const qual = ASDAN_QUALIFICATIONS['EMP-L1'];
      expect(qual).toBeDefined();
      expect(qual.name).toContain('Employability');
      expect(qual.level).toBe(1);
    });

    it('has Employability Level 2', () => {
      const qual = ASDAN_QUALIFICATIONS['EMP-L2'];
      expect(qual).toBeDefined();
      expect(qual.level).toBe(2);
    });
  });

  describe('Personal Development Programme', () => {
    it('has PDP Bronze', () => {
      const qual = ASDAN_QUALIFICATIONS['PDP-BRONZE'];
      expect(qual).toBeDefined();
      expect(qual.name).toContain('Personal Development');
    });

    it('has PDP Silver', () => {
      const qual = ASDAN_QUALIFICATIONS['PDP-SILVER'];
      expect(qual).toBeDefined();
    });

    it('has PDP Gold', () => {
      const qual = ASDAN_QUALIFICATIONS['PDP-GOLD'];
      expect(qual).toBeDefined();
    });
  });

  describe('Personal Progress', () => {
    it('has Personal Progress Entry Level', () => {
      const qual = ASDAN_QUALIFICATIONS['PP-ENTRY'];
      expect(qual).toBeDefined();
      expect(qual.name).toContain('Personal Progress');
      expect(qual.level).toBe(0);
    });
  });

  describe('Short Courses', () => {
    it('has at least one short course', () => {
      const shortCourses = Object.values(ASDAN_QUALIFICATIONS).filter((q) =>
        q.id.startsWith('SC-')
      );
      expect(shortCourses.length).toBeGreaterThan(0);
    });
  });

  describe('getQualification', () => {
    it('returns qualification for valid ID', () => {
      const qual = getQualification('COPE-L1');
      expect(qual).toBeDefined();
      expect(qual?.id).toBe('COPE-L1');
    });

    it('returns undefined for invalid ID', () => {
      const qual = getQualification('INVALID');
      expect(qual).toBeUndefined();
    });
  });

  describe('getQualificationsByLevel', () => {
    it('returns Level 1 qualifications', () => {
      const quals = getQualificationsByLevel(1);
      expect(quals.length).toBeGreaterThan(0);
      quals.forEach((qual) => {
        expect(qual.level).toBe(1);
      });
    });

    it('returns Entry Level qualifications', () => {
      const quals = getQualificationsByLevel(0);
      expect(quals.length).toBeGreaterThan(0);
      quals.forEach((qual) => {
        expect(qual.level).toBe(0);
      });
    });

    it('returns empty array for unused level', () => {
      const quals = getQualificationsByLevel(99);
      expect(quals).toEqual([]);
    });
  });

  describe('getAllQualifications', () => {
    it('returns all qualifications', () => {
      const all = getAllQualifications();
      expect(all.length).toBe(Object.keys(ASDAN_QUALIFICATIONS).length);
    });

    it('returns qualifications sorted by ID', () => {
      const all = getAllQualifications();
      const ids = all.map((q) => q.id);
      const sortedIds = [...ids].sort();
      expect(ids).toEqual(sortedIds);
    });
  });

  describe('minUnitsRequired validation', () => {
    it('minUnitsRequired is at least 1 for each qualification', () => {
      Object.values(ASDAN_QUALIFICATIONS).forEach((qual) => {
        expect(qual.minUnitsRequired).toBeGreaterThanOrEqual(1);
      });
    });

    it('minUnitsRequired does not exceed total available units', () => {
      Object.values(ASDAN_QUALIFICATIONS).forEach((qual) => {
        const totalUnits =
          qual.requiredUnits.length + qual.optionalUnits.length;
        expect(qual.minUnitsRequired).toBeLessThanOrEqual(totalUnits);
      });
    });
  });
});

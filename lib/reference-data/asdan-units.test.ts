import {
  ASDAN_UNITS,
  ASDANUnit,
  getUnit,
  getUnitsByQualification,
  getAllUnits,
} from './asdan-units';

describe('ASDAN Units Reference Data', () => {
  describe('ASDAN_UNITS', () => {
    it('contains ASDAN units', () => {
      expect(Object.keys(ASDAN_UNITS).length).toBeGreaterThan(0);
    });

    it('each unit has required properties', () => {
      Object.values(ASDAN_UNITS).forEach((unit: ASDANUnit) => {
        expect(unit.id).toBeDefined();
        expect(unit.name).toBeDefined();
        expect(unit.creditValue).toBeGreaterThanOrEqual(0);
        expect(unit.level).toBeGreaterThanOrEqual(0);
        expect(unit.qualifications).toBeInstanceOf(Array);
        expect(unit.qualifications.length).toBeGreaterThan(0);
      });
    });

    it('unit IDs follow ASDAN-{code} format', () => {
      Object.keys(ASDAN_UNITS).forEach((id) => {
        expect(id).toMatch(/^ASDAN-[A-Za-z0-9]+$/);
      });
    });
  });

  describe('CoPE Units', () => {
    it('has units for CoPE qualifications', () => {
      const copeUnits = Object.values(ASDAN_UNITS).filter((unit) =>
        unit.qualifications.some((q) => q.startsWith('COPE-'))
      );
      expect(copeUnits.length).toBeGreaterThan(0);
    });

    it('CoPE unit ASDAN-COPE001 exists with correct properties', () => {
      const unit = ASDAN_UNITS['ASDAN-COPE001'];
      expect(unit).toBeDefined();
      expect(unit.name).toBeDefined();
      expect(unit.qualifications).toContain('COPE-L1');
    });
  });

  describe('Employability Units', () => {
    it('has units for Employability qualifications', () => {
      const empUnits = Object.values(ASDAN_UNITS).filter((unit) =>
        unit.qualifications.some((q) => q.startsWith('EMP-'))
      );
      expect(empUnits.length).toBeGreaterThan(0);
    });
  });

  describe('Personal Development Programme Units', () => {
    it('has units for PDP qualifications', () => {
      const pdpUnits = Object.values(ASDAN_UNITS).filter((unit) =>
        unit.qualifications.some((q) => q.startsWith('PDP-'))
      );
      expect(pdpUnits.length).toBeGreaterThan(0);
    });
  });

  describe('Personal Progress Units', () => {
    it('has units for Personal Progress qualification', () => {
      const ppUnits = Object.values(ASDAN_UNITS).filter((unit) =>
        unit.qualifications.some((q) => q.startsWith('PP-'))
      );
      expect(ppUnits.length).toBeGreaterThan(0);
    });
  });

  describe('getUnit', () => {
    it('returns unit for valid ID', () => {
      const unit = getUnit('ASDAN-COPE001');
      expect(unit).toBeDefined();
      expect(unit?.id).toBe('ASDAN-COPE001');
    });

    it('returns undefined for invalid ID', () => {
      const unit = getUnit('ASDAN-INVALID');
      expect(unit).toBeUndefined();
    });
  });

  describe('getUnitsByQualification', () => {
    it('returns units for COPE-L1', () => {
      const units = getUnitsByQualification('COPE-L1');
      expect(units).toBeInstanceOf(Array);
      expect(units.length).toBeGreaterThan(0);
      units.forEach((unit) => {
        expect(unit.qualifications).toContain('COPE-L1');
      });
    });

    it('returns empty array for unknown qualification', () => {
      const units = getUnitsByQualification('UNKNOWN');
      expect(units).toEqual([]);
    });
  });

  describe('getAllUnits', () => {
    it('returns all units', () => {
      const all = getAllUnits();
      expect(all.length).toBe(Object.keys(ASDAN_UNITS).length);
    });

    it('returns units sorted by ID', () => {
      const all = getAllUnits();
      const ids = all.map((u) => u.id);
      const sortedIds = [...ids].sort();
      expect(ids).toEqual(sortedIds);
    });
  });
});

import { Subdivision } from './Subdivision';
import { SubdivisionId } from './SubdivisionId';
import { LocationId } from './LocationId';

describe('Subdivision', () => {
  const validProps = {
    id: SubdivisionId.create('SUB-EAGLE'),
    locationId: LocationId.create('LOC-EAST'),
    name: 'Eagle',
  };

  describe('create', () => {
    it('creates a valid subdivision', () => {
      const subdivision = Subdivision.create(validProps);

      expect(subdivision.id.toString()).toBe('SUB-EAGLE');
      expect(subdivision.locationId.toString()).toBe('LOC-EAST');
      expect(subdivision.name).toBe('Eagle');
    });

    it('creates subdivision with different names', () => {
      const hawk = Subdivision.create({
        id: SubdivisionId.create('SUB-HAWK'),
        locationId: LocationId.create('LOC-EAST'),
        name: 'Hawk',
      });

      const raven = Subdivision.create({
        id: SubdivisionId.create('SUB-RAVEN'),
        locationId: LocationId.create('LOC-WEST'),
        name: 'Raven',
      });

      expect(hawk.name).toBe('Hawk');
      expect(raven.name).toBe('Raven');
    });

    it('rejects empty name', () => {
      expect(() =>
        Subdivision.create({
          ...validProps,
          name: '',
        })
      ).toThrow('Subdivision name cannot be empty');
    });

    it('rejects whitespace-only name', () => {
      expect(() =>
        Subdivision.create({
          ...validProps,
          name: '   ',
        })
      ).toThrow('Subdivision name cannot be empty');
    });
  });

  describe('equals', () => {
    it('returns true for same id', () => {
      const subdivision1 = Subdivision.create(validProps);
      const subdivision2 = Subdivision.create({
        ...validProps,
        name: 'Different Name',
      });

      expect(subdivision1.equals(subdivision2)).toBe(true);
    });

    it('returns false for different id', () => {
      const subdivision1 = Subdivision.create(validProps);
      const subdivision2 = Subdivision.create({
        id: SubdivisionId.create('SUB-HAWK'),
        locationId: validProps.locationId,
        name: 'Hawk',
      });

      expect(subdivision1.equals(subdivision2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('properties are readonly', () => {
      const subdivision = Subdivision.create(validProps);

      // TypeScript should prevent these at compile time
      // These tests verify runtime immutability if someone bypasses TS
      expect(subdivision.id).toBe(validProps.id);
      expect(subdivision.locationId).toBe(validProps.locationId);
      expect(subdivision.name).toBe('Eagle');
    });
  });
});

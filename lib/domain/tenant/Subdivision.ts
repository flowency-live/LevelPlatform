import { SubdivisionId } from './SubdivisionId';
import { LocationId } from './LocationId';

export interface SubdivisionProps {
  id: SubdivisionId;
  locationId: LocationId;
  name: string;
}

export class InvalidSubdivisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSubdivisionError';
  }
}

export class Subdivision {
  readonly id: SubdivisionId;
  readonly locationId: LocationId;
  readonly name: string;

  private constructor(props: SubdivisionProps) {
    this.id = props.id;
    this.locationId = props.locationId;
    this.name = props.name;
  }

  static create(props: SubdivisionProps): Subdivision {
    const trimmedName = props.name.trim();

    if (!trimmedName) {
      throw new InvalidSubdivisionError('Subdivision name cannot be empty');
    }

    return new Subdivision({
      ...props,
      name: trimmedName,
    });
  }

  equals(other: Subdivision): boolean {
    return this.id.equals(other.id);
  }
}

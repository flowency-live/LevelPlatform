import { StudentId } from './StudentId';
import { TenantId } from '../tenant/TenantId';
import { LocationId } from '../tenant/LocationId';
import { CohortId } from '../tenant/CohortId';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_YEAR_GROUP = 7;
const MAX_YEAR_GROUP = 13;

export interface StudentProps {
  id: StudentId;
  firstName: string;
  lastName: string;
  email: string;
  tenantId: TenantId;
  locationId: LocationId;
  cohortId: CohortId;
  yearGroup: number;
}

export class InvalidStudentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStudentError';
  }
}

export class Student {
  private constructor(private readonly props: StudentProps) {}

  static create(props: StudentProps): Student {
    if (!props.firstName.trim()) {
      throw new InvalidStudentError('firstName is required');
    }
    if (!props.lastName.trim()) {
      throw new InvalidStudentError('lastName is required');
    }
    if (!EMAIL_PATTERN.test(props.email)) {
      throw new InvalidStudentError(`Invalid email: ${props.email}`);
    }
    if (props.yearGroup < MIN_YEAR_GROUP || props.yearGroup > MAX_YEAR_GROUP) {
      throw new InvalidStudentError(`yearGroup must be ${MIN_YEAR_GROUP}-${MAX_YEAR_GROUP}`);
    }

    return new Student(props);
  }

  get id(): StudentId {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get email(): string {
    return this.props.email;
  }

  get tenantId(): TenantId {
    return this.props.tenantId;
  }

  get locationId(): LocationId {
    return this.props.locationId;
  }

  get cohortId(): CohortId {
    return this.props.cohortId;
  }

  get yearGroup(): number {
    return this.props.yearGroup;
  }

  equals(other: Student): boolean {
    return this.id.equals(other.id);
  }
}

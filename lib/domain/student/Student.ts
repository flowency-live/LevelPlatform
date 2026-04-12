import { StudentId } from './StudentId';
import { TenantId } from '../tenant/TenantId';
import { LocationId } from '../tenant/LocationId';
import { SubdivisionId } from '../tenant/SubdivisionId';
import { AccessToken } from '../auth/AccessToken';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface StudentProps {
  id: StudentId;
  firstName: string;
  lastName: string;
  email: string;
  tenantId: TenantId;
  locationId: LocationId;
  subdivisionId: SubdivisionId;
  accessToken?: AccessToken;
  accessTokenRevokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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

  get subdivisionId(): SubdivisionId {
    return this.props.subdivisionId;
  }

  get initials(): string {
    const firstInitial = this.props.firstName.charAt(0).toUpperCase();
    const lastInitial = this.props.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  get accessToken(): AccessToken | undefined {
    return this.props.accessToken;
  }

  get accessTokenRevokedAt(): Date | undefined {
    return this.props.accessTokenRevokedAt;
  }

  get hasValidAccessToken(): boolean {
    return this.props.accessToken !== undefined && this.props.accessTokenRevokedAt === undefined;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  generateAccessToken(): Student {
    return new Student({
      ...this.props,
      accessToken: AccessToken.generate(),
      accessTokenRevokedAt: undefined,
    });
  }

  regenerateAccessToken(): Student {
    return new Student({
      ...this.props,
      accessToken: AccessToken.generate(),
      accessTokenRevokedAt: undefined,
    });
  }

  revokeAccessToken(revokedAt: Date): Student {
    return new Student({
      ...this.props,
      accessTokenRevokedAt: revokedAt,
    });
  }

  equals(other: Student): boolean {
    return this.id.equals(other.id);
  }
}

import { StaffId } from './StaffId';
import { TenantId } from '../tenant/TenantId';
import { Role, APPROVAL_ROLES } from './Role';
import { StaffType } from './StaffType';

export interface StaffMemberProps {
  readonly id: StaffId;
  readonly schoolId: TenantId;
  readonly name: string;
  readonly email: string;
  readonly staffType: StaffType;
  readonly roles: readonly Role[];
}

export class StaffMember {
  readonly id: StaffId;
  readonly schoolId: TenantId;
  readonly name: string;
  readonly email: string;
  readonly staffType: StaffType;
  readonly roles: readonly Role[];

  private constructor(props: StaffMemberProps) {
    this.id = props.id;
    this.schoolId = props.schoolId;
    this.name = props.name;
    this.email = props.email;
    this.staffType = props.staffType;
    this.roles = Object.freeze([...props.roles]);
  }

  static create(props: StaffMemberProps): StaffMember {
    return new StaffMember(props);
  }

  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }

  isGatsbyLead(): boolean {
    return this.hasRole(Role.GatsbyLead);
  }

  isASDANCoordinator(): boolean {
    return this.hasRole(Role.ASDANCoordinator);
  }

  isSeniorTeacher(): boolean {
    return this.hasRole(Role.SeniorTeacher);
  }

  isHead(): boolean {
    return this.hasRole(Role.Head);
  }

  canInput(): boolean {
    return this.staffType === StaffType.Teaching;
  }

  canApprove(): boolean {
    if (this.staffType !== StaffType.Teaching) {
      return false;
    }
    return this.roles.some((role) => APPROVAL_ROLES.includes(role));
  }
}

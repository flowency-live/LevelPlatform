import { StaffId } from './StaffId';
import { StaffMember } from './StaffMember';
import { TenantId } from '../tenant/TenantId';
import { Role } from './Role';
import { StaffType } from './StaffType';

export interface StaffRepository {
  findById(id: StaffId): Promise<StaffMember | null>;
  findBySchool(schoolId: TenantId): Promise<StaffMember[]>;
  findByRole(schoolId: TenantId, role: Role): Promise<StaffMember[]>;
  findByStaffType(schoolId: TenantId, staffType: StaffType): Promise<StaffMember[]>;
  save(member: StaffMember): Promise<void>;
}

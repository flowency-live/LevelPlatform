import { StaffRepository } from './StaffRepository';
import { StaffMember } from './StaffMember';
import { StaffId } from './StaffId';
import { TenantId } from '../tenant/TenantId';
import { Role } from './Role';
import { StaffType } from './StaffType';

export class InMemoryStaffRepository implements StaffRepository {
  private readonly staff: Map<string, StaffMember> = new Map();

  async findById(id: StaffId): Promise<StaffMember | null> {
    return this.staff.get(id.toString()) ?? null;
  }

  async findBySchool(schoolId: TenantId): Promise<StaffMember[]> {
    return Array.from(this.staff.values()).filter(
      (member) => member.schoolId.equals(schoolId)
    );
  }

  async findByRole(schoolId: TenantId, role: Role): Promise<StaffMember[]> {
    return Array.from(this.staff.values()).filter(
      (member) => member.schoolId.equals(schoolId) && member.hasRole(role)
    );
  }

  async findByStaffType(schoolId: TenantId, staffType: StaffType): Promise<StaffMember[]> {
    return Array.from(this.staff.values()).filter(
      (member) => member.schoolId.equals(schoolId) && member.staffType === staffType
    );
  }

  async save(member: StaffMember): Promise<void> {
    this.staff.set(member.id.toString(), member);
  }
}

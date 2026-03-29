import { Student } from './Student';
import { StudentId } from './StudentId';
import { TenantId } from '../tenant/TenantId';
import { CohortId } from '../tenant/CohortId';
import { LocationId } from '../tenant/LocationId';

export interface StudentRepository {
  findById(id: StudentId): Promise<Student | null>;
  save(student: Student): Promise<void>;
  findByTenantId(tenantId: TenantId): Promise<Student[]>;
  findByCohortId(cohortId: CohortId): Promise<Student[]>;
  findByLocationId(locationId: LocationId): Promise<Student[]>;
}

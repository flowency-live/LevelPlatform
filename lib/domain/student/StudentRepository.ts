import { Student } from './Student';
import { StudentId } from './StudentId';
import { TenantId } from '../tenant/TenantId';
import { LocationId } from '../tenant/LocationId';
import { AccessToken } from '../auth/AccessToken';

export interface StudentRepository {
  findById(id: StudentId): Promise<Student | null>;
  findByAccessToken(token: AccessToken): Promise<Student | null>;
  save(student: Student): Promise<void>;
  findByTenantId(tenantId: TenantId): Promise<Student[]>;
  findByLocationId(locationId: LocationId): Promise<Student[]>;
}

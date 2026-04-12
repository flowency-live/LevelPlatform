import { Student } from './Student';
import { StudentId } from './StudentId';
import { StudentRepository } from './StudentRepository';
import { TenantId } from '../tenant/TenantId';
import { LocationId } from '../tenant/LocationId';
import { AccessToken } from '../auth/AccessToken';

export class InMemoryStudentRepository implements StudentRepository {
  private readonly students: Map<string, Student> = new Map();

  async findById(id: StudentId): Promise<Student | null> {
    return this.students.get(id.toString()) ?? null;
  }

  async findByAccessToken(token: AccessToken): Promise<Student | null> {
    for (const student of this.students.values()) {
      if (student.accessToken?.toString() === token.toString()) {
        return student;
      }
    }
    return null;
  }

  async save(student: Student): Promise<void> {
    this.students.set(student.id.toString(), student);
  }

  async findByTenantId(tenantId: TenantId): Promise<Student[]> {
    return [...this.students.values()].filter(
      (student) => student.tenantId.equals(tenantId)
    );
  }

  async findByLocationId(locationId: LocationId): Promise<Student[]> {
    return [...this.students.values()].filter(
      (student) => student.locationId.equals(locationId)
    );
  }
}

import { StudentRepository } from '../domain/student/StudentRepository';
import { AccessToken } from '../domain/auth/AccessToken';

export class InvalidTokenError extends Error {
  constructor(message: string = 'Invalid access token') {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export class RevokedTokenError extends Error {
  constructor(message: string = 'Access token has been revoked') {
    super(message);
    this.name = 'RevokedTokenError';
  }
}

export interface AuthenticateStudentRequest {
  accessToken: string;
}

export interface AuthenticateStudentResponse {
  studentId: string;
  tenantId: string;
  locationId: string;
  subdivisionId: string;
  displayName: string;
}

export class AuthenticateStudent {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(request: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    let token: AccessToken;

    try {
      token = AccessToken.create(request.accessToken);
    } catch {
      throw new InvalidTokenError('Invalid access token format');
    }

    const student = await this.studentRepository.findByAccessToken(token);

    if (!student) {
      throw new InvalidTokenError('Access token not found');
    }

    if (!student.hasValidAccessToken) {
      throw new RevokedTokenError();
    }

    return {
      studentId: student.id.toString(),
      tenantId: student.tenantId.toString(),
      locationId: student.locationId.toString(),
      subdivisionId: student.subdivisionId.toString(),
      displayName: student.initials,
    };
  }
}

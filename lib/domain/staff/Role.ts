export enum Role {
  Teacher = 'teacher',
  SeniorTeacher = 'senior-teacher',
  GatsbyLead = 'gatsby-lead',
  ASDANCoordinator = 'asdan-coordinator',
  Head = 'head',
}

export const ALL_ROLES: readonly Role[] = [
  Role.Teacher,
  Role.SeniorTeacher,
  Role.GatsbyLead,
  Role.ASDANCoordinator,
  Role.Head,
] as const;

export const APPROVAL_ROLES: readonly Role[] = [
  Role.SeniorTeacher,
  Role.GatsbyLead,
  Role.ASDANCoordinator,
  Role.Head,
] as const;

export function isRole(value: string): value is Role {
  return ALL_ROLES.includes(value as Role);
}

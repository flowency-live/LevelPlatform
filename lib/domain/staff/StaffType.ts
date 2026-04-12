export enum StaffType {
  Teaching = 'teaching',
  Care = 'care',
}

export const ALL_STAFF_TYPES: readonly StaffType[] = [
  StaffType.Teaching,
  StaffType.Care,
] as const;

export function isStaffType(value: string): value is StaffType {
  return ALL_STAFF_TYPES.includes(value as StaffType);
}

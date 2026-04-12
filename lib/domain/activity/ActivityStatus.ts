export enum ActivityStatus {
  Draft = 'draft',
  Active = 'active',
  Archived = 'archived',
}

export const ALL_ACTIVITY_STATUSES: readonly ActivityStatus[] = Object.freeze([
  ActivityStatus.Draft,
  ActivityStatus.Active,
  ActivityStatus.Archived,
]);

export function isActivityStatus(value: string): value is ActivityStatus {
  return ALL_ACTIVITY_STATUSES.includes(value as ActivityStatus);
}

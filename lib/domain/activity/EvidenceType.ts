export enum EvidenceType {
  Photo = 'photo',
  Voice = 'voice',
  Document = 'document',
}

export const ALL_EVIDENCE_TYPES: readonly EvidenceType[] = Object.freeze([
  EvidenceType.Photo,
  EvidenceType.Voice,
  EvidenceType.Document,
]);

export function isEvidenceType(value: string): value is EvidenceType {
  return ALL_EVIDENCE_TYPES.includes(value as EvidenceType);
}

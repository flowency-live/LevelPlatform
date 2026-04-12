export interface ASDANUnit {
  readonly id: string;
  readonly name: string;
  readonly creditValue: number;
  readonly level: number;
  readonly qualifications: readonly string[];
}

export const ASDAN_UNITS: Record<string, ASDANUnit> = {
  // CoPE Level 1 Units
  'ASDAN-COPE001': {
    id: 'ASDAN-COPE001',
    name: 'Working with Others',
    creditValue: 3,
    level: 1,
    qualifications: ['COPE-L1', 'COPE-L2'],
  },
  'ASDAN-COPE002': {
    id: 'ASDAN-COPE002',
    name: 'Improving Own Learning',
    creditValue: 3,
    level: 1,
    qualifications: ['COPE-L1', 'COPE-L2'],
  },
  'ASDAN-COPE003': {
    id: 'ASDAN-COPE003',
    name: 'Problem Solving',
    creditValue: 3,
    level: 1,
    qualifications: ['COPE-L1', 'COPE-L2', 'COPE-L3'],
  },
  'ASDAN-COPE004': {
    id: 'ASDAN-COPE004',
    name: 'Communication Skills',
    creditValue: 3,
    level: 1,
    qualifications: ['COPE-L1'],
  },
  'ASDAN-COPE005': {
    id: 'ASDAN-COPE005',
    name: 'Leadership Skills',
    creditValue: 3,
    level: 2,
    qualifications: ['COPE-L2', 'COPE-L3'],
  },
  'ASDAN-COPE006': {
    id: 'ASDAN-COPE006',
    name: 'Research Skills',
    creditValue: 3,
    level: 3,
    qualifications: ['COPE-L3'],
  },

  // Employability Units
  'ASDAN-EMP001': {
    id: 'ASDAN-EMP001',
    name: 'Preparing for Work',
    creditValue: 2,
    level: 1,
    qualifications: ['EMP-L1', 'EMP-L2'],
  },
  'ASDAN-EMP002': {
    id: 'ASDAN-EMP002',
    name: 'Job Search Skills',
    creditValue: 2,
    level: 1,
    qualifications: ['EMP-L1', 'EMP-L2'],
  },
  'ASDAN-EMP003': {
    id: 'ASDAN-EMP003',
    name: 'Interview Skills',
    creditValue: 2,
    level: 1,
    qualifications: ['EMP-L1', 'EMP-L2'],
  },
  'ASDAN-EMP004': {
    id: 'ASDAN-EMP004',
    name: 'Workplace Behaviour',
    creditValue: 2,
    level: 1,
    qualifications: ['EMP-L1'],
  },
  'ASDAN-EMP005': {
    id: 'ASDAN-EMP005',
    name: 'Career Planning',
    creditValue: 2,
    level: 2,
    qualifications: ['EMP-L2'],
  },

  // Personal Development Programme Units
  'ASDAN-PDP001': {
    id: 'ASDAN-PDP001',
    name: 'Personal Goals',
    creditValue: 1,
    level: 1,
    qualifications: ['PDP-BRONZE', 'PDP-SILVER', 'PDP-GOLD'],
  },
  'ASDAN-PDP002': {
    id: 'ASDAN-PDP002',
    name: 'Community Challenge',
    creditValue: 1,
    level: 1,
    qualifications: ['PDP-BRONZE', 'PDP-SILVER', 'PDP-GOLD'],
  },
  'ASDAN-PDP003': {
    id: 'ASDAN-PDP003',
    name: 'Adventure Challenge',
    creditValue: 1,
    level: 1,
    qualifications: ['PDP-BRONZE', 'PDP-SILVER', 'PDP-GOLD'],
  },
  'ASDAN-PDP004': {
    id: 'ASDAN-PDP004',
    name: 'World of Work',
    creditValue: 1,
    level: 1,
    qualifications: ['PDP-SILVER', 'PDP-GOLD'],
  },
  'ASDAN-PDP005': {
    id: 'ASDAN-PDP005',
    name: 'Independent Living',
    creditValue: 1,
    level: 2,
    qualifications: ['PDP-GOLD'],
  },

  // Personal Progress Units (Entry Level)
  'ASDAN-PP001': {
    id: 'ASDAN-PP001',
    name: 'Personal Care',
    creditValue: 1,
    level: 0,
    qualifications: ['PP-ENTRY'],
  },
  'ASDAN-PP002': {
    id: 'ASDAN-PP002',
    name: 'Social Skills',
    creditValue: 1,
    level: 0,
    qualifications: ['PP-ENTRY'],
  },
  'ASDAN-PP003': {
    id: 'ASDAN-PP003',
    name: 'Daily Living',
    creditValue: 1,
    level: 0,
    qualifications: ['PP-ENTRY'],
  },
  'ASDAN-PP004': {
    id: 'ASDAN-PP004',
    name: 'Community Awareness',
    creditValue: 1,
    level: 0,
    qualifications: ['PP-ENTRY'],
  },

  // Short Course Units
  'ASDAN-SC001': {
    id: 'ASDAN-SC001',
    name: 'Financial Literacy',
    creditValue: 1,
    level: 1,
    qualifications: ['SC-FINANCE'],
  },
  'ASDAN-SC002': {
    id: 'ASDAN-SC002',
    name: 'Digital Skills',
    creditValue: 1,
    level: 1,
    qualifications: ['SC-DIGITAL'],
  },
  'ASDAN-SC003': {
    id: 'ASDAN-SC003',
    name: 'First Aid Awareness',
    creditValue: 1,
    level: 1,
    qualifications: ['SC-FIRSTAID'],
  },
};

export function getUnit(id: string): ASDANUnit | undefined {
  return ASDAN_UNITS[id];
}

export function getUnitsByQualification(qualificationId: string): ASDANUnit[] {
  return Object.values(ASDAN_UNITS)
    .filter((unit) => unit.qualifications.includes(qualificationId))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getAllUnits(): ASDANUnit[] {
  return Object.values(ASDAN_UNITS).sort((a, b) => a.id.localeCompare(b.id));
}

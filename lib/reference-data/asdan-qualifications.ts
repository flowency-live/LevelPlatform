export interface ASDANQualification {
  readonly id: string;
  readonly name: string;
  readonly level: number;
  readonly description: string;
  readonly requiredUnits: readonly string[];
  readonly optionalUnits: readonly string[];
  readonly minUnitsRequired: number;
}

export const ASDAN_QUALIFICATIONS: Record<string, ASDANQualification> = {
  // CoPE (Certificate of Personal Effectiveness)
  'COPE-L1': {
    id: 'COPE-L1',
    name: 'Certificate of Personal Effectiveness Level 1',
    level: 1,
    description:
      'Develops personal skills through challenges and activities at Level 1.',
    requiredUnits: ['ASDAN-COPE001', 'ASDAN-COPE002'],
    optionalUnits: ['ASDAN-COPE003', 'ASDAN-COPE004'],
    minUnitsRequired: 3,
  },
  'COPE-L2': {
    id: 'COPE-L2',
    name: 'Certificate of Personal Effectiveness Level 2',
    level: 2,
    description:
      'Develops personal skills through challenges and activities at Level 2.',
    requiredUnits: ['ASDAN-COPE001', 'ASDAN-COPE002', 'ASDAN-COPE003'],
    optionalUnits: ['ASDAN-COPE005'],
    minUnitsRequired: 4,
  },
  'COPE-L3': {
    id: 'COPE-L3',
    name: 'Certificate of Personal Effectiveness Level 3',
    level: 3,
    description:
      'Develops personal skills through challenges and activities at Level 3.',
    requiredUnits: ['ASDAN-COPE003', 'ASDAN-COPE005', 'ASDAN-COPE006'],
    optionalUnits: [],
    minUnitsRequired: 3,
  },

  // Employability
  'EMP-L1': {
    id: 'EMP-L1',
    name: 'Employability Level 1',
    level: 1,
    description: 'Develops work-related skills and preparation at Level 1.',
    requiredUnits: ['ASDAN-EMP001', 'ASDAN-EMP002'],
    optionalUnits: ['ASDAN-EMP003', 'ASDAN-EMP004'],
    minUnitsRequired: 3,
  },
  'EMP-L2': {
    id: 'EMP-L2',
    name: 'Employability Level 2',
    level: 2,
    description: 'Develops work-related skills and preparation at Level 2.',
    requiredUnits: ['ASDAN-EMP001', 'ASDAN-EMP002', 'ASDAN-EMP003'],
    optionalUnits: ['ASDAN-EMP005'],
    minUnitsRequired: 4,
  },

  // Personal Development Programme
  'PDP-BRONZE': {
    id: 'PDP-BRONZE',
    name: 'Personal Development Programme Bronze',
    level: 1,
    description: 'Portfolio-based personal development at Bronze level.',
    requiredUnits: ['ASDAN-PDP001'],
    optionalUnits: ['ASDAN-PDP002', 'ASDAN-PDP003'],
    minUnitsRequired: 2,
  },
  'PDP-SILVER': {
    id: 'PDP-SILVER',
    name: 'Personal Development Programme Silver',
    level: 1,
    description: 'Portfolio-based personal development at Silver level.',
    requiredUnits: ['ASDAN-PDP001', 'ASDAN-PDP002'],
    optionalUnits: ['ASDAN-PDP003', 'ASDAN-PDP004'],
    minUnitsRequired: 3,
  },
  'PDP-GOLD': {
    id: 'PDP-GOLD',
    name: 'Personal Development Programme Gold',
    level: 2,
    description: 'Portfolio-based personal development at Gold level.',
    requiredUnits: ['ASDAN-PDP001', 'ASDAN-PDP002', 'ASDAN-PDP003'],
    optionalUnits: ['ASDAN-PDP004', 'ASDAN-PDP005'],
    minUnitsRequired: 4,
  },

  // Personal Progress (Entry Level)
  'PP-ENTRY': {
    id: 'PP-ENTRY',
    name: 'Personal Progress Entry Level',
    level: 0,
    description: 'For learners needing additional support at Entry Level.',
    requiredUnits: ['ASDAN-PP001'],
    optionalUnits: ['ASDAN-PP002', 'ASDAN-PP003', 'ASDAN-PP004'],
    minUnitsRequired: 2,
  },

  // Short Courses
  'SC-FINANCE': {
    id: 'SC-FINANCE',
    name: 'Financial Literacy Short Course',
    level: 1,
    description: '10-60 hour focused programme on financial literacy.',
    requiredUnits: ['ASDAN-SC001'],
    optionalUnits: [],
    minUnitsRequired: 1,
  },
  'SC-DIGITAL': {
    id: 'SC-DIGITAL',
    name: 'Digital Skills Short Course',
    level: 1,
    description: '10-60 hour focused programme on digital skills.',
    requiredUnits: ['ASDAN-SC002'],
    optionalUnits: [],
    minUnitsRequired: 1,
  },
  'SC-FIRSTAID': {
    id: 'SC-FIRSTAID',
    name: 'First Aid Awareness Short Course',
    level: 1,
    description: '10-60 hour focused programme on first aid awareness.',
    requiredUnits: ['ASDAN-SC003'],
    optionalUnits: [],
    minUnitsRequired: 1,
  },
};

export function getQualification(id: string): ASDANQualification | undefined {
  return ASDAN_QUALIFICATIONS[id];
}

export function getQualificationsByLevel(level: number): ASDANQualification[] {
  return Object.values(ASDAN_QUALIFICATIONS)
    .filter((qual) => qual.level === level)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getAllQualifications(): ASDANQualification[] {
  return Object.values(ASDAN_QUALIFICATIONS).sort((a, b) =>
    a.id.localeCompare(b.id)
  );
}

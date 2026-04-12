import { EvidenceType } from './EvidenceType';

export interface EvidenceRequirementProps {
  readonly type: EvidenceType;
  readonly description: string;
  readonly mandatory?: boolean;
}

export class InvalidEvidenceRequirementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEvidenceRequirementError';
  }
}

export class EvidenceRequirement {
  readonly type: EvidenceType;
  readonly description: string;
  readonly mandatory: boolean;

  private constructor(props: EvidenceRequirementProps) {
    this.type = props.type;
    this.description = props.description;
    this.mandatory = props.mandatory ?? true;
  }

  static create(props: EvidenceRequirementProps): EvidenceRequirement {
    const trimmedDescription = props.description.trim();

    if (trimmedDescription.length === 0) {
      throw new InvalidEvidenceRequirementError(
        'Evidence requirement description cannot be empty'
      );
    }

    return new EvidenceRequirement({
      ...props,
      description: trimmedDescription,
    });
  }

  equals(other: EvidenceRequirement): boolean {
    return (
      this.type === other.type &&
      this.description === other.description &&
      this.mandatory === other.mandatory
    );
  }
}

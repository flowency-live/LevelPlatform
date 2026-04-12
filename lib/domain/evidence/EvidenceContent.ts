import { EvidenceType } from '../activity/EvidenceType';

export interface EvidenceContentProps {
  readonly type: EvidenceType;
  readonly url: string;
  readonly uploadedAt: Date;
}

export class InvalidEvidenceContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEvidenceContentError';
  }
}

export class EvidenceContent {
  readonly type: EvidenceType;
  readonly url: string;
  readonly uploadedAt: Date;

  private constructor(props: EvidenceContentProps) {
    this.type = props.type;
    this.url = props.url;
    this.uploadedAt = props.uploadedAt;
  }

  static create(props: EvidenceContentProps): EvidenceContent {
    const trimmedUrl = props.url.trim();

    if (trimmedUrl.length === 0) {
      throw new InvalidEvidenceContentError(
        'Evidence content url cannot be empty'
      );
    }

    return new EvidenceContent({
      ...props,
      url: trimmedUrl,
    });
  }

  equals(other: EvidenceContent): boolean {
    return (
      this.type === other.type &&
      this.url === other.url &&
      this.uploadedAt.getTime() === other.uploadedAt.getTime()
    );
  }
}

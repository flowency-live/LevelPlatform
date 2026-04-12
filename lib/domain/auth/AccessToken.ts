const ACCESS_TOKEN_PATTERN = /^[A-Za-z0-9]{24}$/;
const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export class AccessToken {
  private constructor(private readonly value: string) {}

  static create(value: string): AccessToken {
    if (!ACCESS_TOKEN_PATTERN.test(value)) {
      throw new Error('Invalid access token format');
    }
    return new AccessToken(value);
  }

  static generate(): AccessToken {
    let token = '';
    for (let i = 0; i < 24; i++) {
      const randomIndex = Math.floor(Math.random() * ALPHANUMERIC_CHARS.length);
      token += ALPHANUMERIC_CHARS.charAt(randomIndex);
    }
    return new AccessToken(token);
  }

  toString(): string {
    return this.value;
  }

  equals(other: AccessToken): boolean {
    return this.value === other.value;
  }
}

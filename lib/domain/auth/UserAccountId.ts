const USER_ACCOUNT_ID_PATTERN = /^ACCOUNT-[A-Z0-9]+$/;

export class UserAccountId {
  private constructor(private readonly value: string) {}

  static create(value: string): UserAccountId {
    if (!USER_ACCOUNT_ID_PATTERN.test(value)) {
      throw new Error('Invalid UserAccountId format');
    }
    return new UserAccountId(value);
  }

  static generate(): UserAccountId {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      id += chars.charAt(randomIndex);
    }
    return new UserAccountId(`ACCOUNT-${id}`);
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserAccountId): boolean {
    return this.value === other.value;
  }
}

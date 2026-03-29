import { getPostLoginPath, Role } from './redirect';

describe('getPostLoginPath', () => {
  it('returns /student for student role', () => {
    expect(getPostLoginPath('student')).toBe('/student');
  });

  it('returns /teacher for teacher role', () => {
    expect(getPostLoginPath('teacher')).toBe('/teacher');
  });

  it('returns /admin for admin role', () => {
    expect(getPostLoginPath('admin')).toBe('/admin');
  });

  it('returns /admin for management role', () => {
    expect(getPostLoginPath('management')).toBe('/admin');
  });

  it('returns / for unknown role', () => {
    expect(getPostLoginPath('unknown' as Role)).toBe('/');
  });
});

describe('Role type', () => {
  it('includes all expected roles', () => {
    const roles: Role[] = ['student', 'teacher', 'admin', 'management'];
    expect(roles).toHaveLength(4);
  });
});

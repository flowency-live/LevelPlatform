export type Role = 'student' | 'teacher' | 'admin' | 'management';

export function getPostLoginPath(role: Role): string {
  switch (role) {
    case 'student':
      return '/student';
    case 'teacher':
      return '/teacher';
    case 'admin':
    case 'management':
      return '/admin';
    default:
      return '/';
  }
}

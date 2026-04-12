import { Student } from '../domain/student/Student';
import { Subdivision } from '../domain/tenant/Subdivision';

export class AnonymityService {
  /**
   * Get anonymized display name for a single student.
   * Format: "{SubdivisionName} {Initials}" e.g., "Eagle JS"
   */
  getDisplayName(student: Student, subdivision: Subdivision): string {
    return `${subdivision.name} ${student.initials}`;
  }

  /**
   * Get anonymized display names for multiple students, handling duplicate initials.
   * Duplicates get number suffix: "Eagle JS", "Eagle JS2", "Eagle JS3"
   *
   * @returns Map of studentId.toString() -> displayName
   */
  getDisplayNamesWithDuplicateHandling(
    students: Student[],
    subdivision: Subdivision
  ): Map<string, string> {
    const result = new Map<string, string>();

    if (students.length === 0) {
      return result;
    }

    // Group students by their base initials
    const initialGroups = new Map<string, Student[]>();

    for (const student of students) {
      const initials = student.initials;
      const existing = initialGroups.get(initials) || [];
      existing.push(student);
      initialGroups.set(initials, existing);
    }

    // Assign display names with duplicate handling
    for (const [initials, groupStudents] of initialGroups) {
      if (groupStudents.length === 1) {
        // No duplicates - use base format
        result.set(
          groupStudents[0].id.toString(),
          `${subdivision.name} ${initials}`
        );
      } else {
        // Duplicates - add number suffix (first gets no suffix, rest get 2, 3, etc.)
        groupStudents.forEach((student, index) => {
          const suffix = index === 0 ? '' : String(index + 1);
          result.set(
            student.id.toString(),
            `${subdivision.name} ${initials}${suffix}`
          );
        });
      }
    }

    return result;
  }
}

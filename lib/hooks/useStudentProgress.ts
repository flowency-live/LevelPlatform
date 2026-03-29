/**
 * Hook to fetch student progress data.
 * Initially uses mock data, can be swapped to real API later.
 */

import { getMockStudentProgress } from '@/lib/mock-data/students';
import type { StudentProgress, StudentId } from '@/lib/types/student';

// For MVP, we use a hardcoded student ID
// Later this will come from auth context
const CURRENT_STUDENT_ID = 'STUDENT-001' as StudentId;

export function useStudentProgress(studentId?: StudentId): StudentProgress | null {
  const id = studentId ?? CURRENT_STUDENT_ID;
  return getMockStudentProgress(id);
}

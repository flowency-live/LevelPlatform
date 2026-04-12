/**
 * Hook to fetch student progress data from the API.
 */

import { useState, useEffect } from 'react';
import type { StudentProgress, StudentId } from '@/lib/types/student';

export function useStudentProgress(studentId?: StudentId): StudentProgress | null {
  const [progress, setProgress] = useState<StudentProgress | null>(null);

  useEffect(() => {
    if (!studentId) {
      setProgress(null);
      return;
    }

    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/student/${studentId}/progress`);
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        } else {
          setProgress(null);
        }
      } catch {
        setProgress(null);
      }
    };

    fetchProgress();
  }, [studentId]);

  return progress;
}

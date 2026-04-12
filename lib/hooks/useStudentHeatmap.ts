/**
 * Hook to fetch student heatmap data for the teacher portal.
 * Returns all students with their benchmark progress.
 */

import { useState, useEffect } from 'react';

export interface BenchmarkStatus {
  benchmarkId: string;
  percentComplete: number;
  status: 'not-started' | 'in-progress' | 'complete';
}

export interface StudentHeatmapRow {
  studentId: string;
  displayName: string;
  benchmarks: BenchmarkStatus[];
  overallPercent: number;
}

export interface StudentHeatmapData {
  students: StudentHeatmapRow[];
  summary: {
    totalStudents: number;
    averageCompletion: number;
  };
}

export function useStudentHeatmap(): StudentHeatmapData | null {
  const [data, setData] = useState<StudentHeatmapData | null>(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await fetch('/api/teacher/heatmap');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          // Return demo data if API not available
          setData(getDemoData());
        }
      } catch {
        // Return demo data on error
        setData(getDemoData());
      }
    };

    fetchHeatmap();
  }, []);

  return data;
}

function getDemoData(): StudentHeatmapData {
  const students: StudentHeatmapRow[] = [
    {
      studentId: 'STU-001',
      displayName: 'Eagle JS',
      benchmarks: [
        { benchmarkId: 'GB1', percentComplete: 75, status: 'in-progress' },
        { benchmarkId: 'GB2', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB3', percentComplete: 50, status: 'in-progress' },
        { benchmarkId: 'GB4', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB5', percentComplete: 25, status: 'in-progress' },
        { benchmarkId: 'GB6', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB7', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB8', percentComplete: 50, status: 'in-progress' },
      ],
      overallPercent: 50,
    },
    {
      studentId: 'STU-002',
      displayName: 'Hawk AB',
      benchmarks: [
        { benchmarkId: 'GB1', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB2', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB3', percentComplete: 75, status: 'in-progress' },
        { benchmarkId: 'GB4', percentComplete: 50, status: 'in-progress' },
        { benchmarkId: 'GB5', percentComplete: 25, status: 'in-progress' },
        { benchmarkId: 'GB6', percentComplete: 100, status: 'complete' },
        { benchmarkId: 'GB7', percentComplete: 75, status: 'in-progress' },
        { benchmarkId: 'GB8', percentComplete: 100, status: 'complete' },
      ],
      overallPercent: 78,
    },
    {
      studentId: 'STU-003',
      displayName: 'Falcon CD',
      benchmarks: [
        { benchmarkId: 'GB1', percentComplete: 25, status: 'in-progress' },
        { benchmarkId: 'GB2', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB3', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB4', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB5', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB6', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB7', percentComplete: 0, status: 'not-started' },
        { benchmarkId: 'GB8', percentComplete: 0, status: 'not-started' },
      ],
      overallPercent: 3,
    },
  ];

  const totalStudents = students.length;
  const averageCompletion = Math.round(
    students.reduce((sum, s) => sum + s.overallPercent, 0) / totalStudents
  );

  return {
    students,
    summary: {
      totalStudents,
      averageCompletion,
    },
  };
}

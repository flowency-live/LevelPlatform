/**
 * Hook to fetch teacher dashboard data.
 * Returns Gatsby compliance overview and quick stats.
 */

import { useState, useEffect } from 'react';

export interface BenchmarkCompliance {
  benchmarkId: string;
  name: string;
  percentComplete: number;
  studentCount: number;
}

export interface TeacherDashboardData {
  compliance: {
    benchmarks: BenchmarkCompliance[];
    overallPercent: number;
  };
  stats: {
    studentCount: number;
    pendingEvidence: number;
    activitiesThisWeek: number;
  };
}

// Reference data for benchmark names
const BENCHMARK_NAMES: Record<string, string> = {
  GB1: 'Careers Programme',
  GB2: 'Labour Market',
  GB3: 'Individual Needs',
  GB4: 'Curriculum Links',
  GB5: 'Employer Encounters',
  GB6: 'Work Experience',
  GB7: 'Education Pathways',
  GB8: 'Personal Guidance',
};

export function useTeacherDashboard(): TeacherDashboardData | null {
  const [data, setData] = useState<TeacherDashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/teacher/dashboard');
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

    fetchDashboard();
  }, []);

  return data;
}

function getDemoData(): TeacherDashboardData {
  const benchmarks: BenchmarkCompliance[] = [
    { benchmarkId: 'GB1', name: BENCHMARK_NAMES.GB1, percentComplete: 75, studentCount: 18 },
    { benchmarkId: 'GB2', name: BENCHMARK_NAMES.GB2, percentComplete: 60, studentCount: 14 },
    { benchmarkId: 'GB3', name: BENCHMARK_NAMES.GB3, percentComplete: 85, studentCount: 20 },
    { benchmarkId: 'GB4', name: BENCHMARK_NAMES.GB4, percentComplete: 40, studentCount: 10 },
    { benchmarkId: 'GB5', name: BENCHMARK_NAMES.GB5, percentComplete: 55, studentCount: 13 },
    { benchmarkId: 'GB6', name: BENCHMARK_NAMES.GB6, percentComplete: 30, studentCount: 7 },
    { benchmarkId: 'GB7', name: BENCHMARK_NAMES.GB7, percentComplete: 70, studentCount: 17 },
    { benchmarkId: 'GB8', name: BENCHMARK_NAMES.GB8, percentComplete: 45, studentCount: 11 },
  ];

  const overallPercent = Math.round(
    benchmarks.reduce((sum, b) => sum + b.percentComplete, 0) / benchmarks.length
  );

  return {
    compliance: {
      benchmarks,
      overallPercent,
    },
    stats: {
      studentCount: 24,
      pendingEvidence: 12,
      activitiesThisWeek: 5,
    },
  };
}

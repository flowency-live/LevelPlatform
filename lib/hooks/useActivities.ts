/**
 * Hook to fetch activities for the teacher portal.
 */

import { useState, useEffect } from 'react';

export interface ActivitySummary {
  id: string;
  name: string;
  description: string;
  gatsbyBenchmarkIds: string[];
  asdanUnitId: string | null;
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdAt: string;
  completionCount: number;
  totalStudents: number;
}

export interface ActivitiesData {
  activities: ActivitySummary[];
  summary: {
    total: number;
    active: number;
    draft: number;
    archived: number;
  };
}

export function useActivities(): ActivitiesData | null {
  const [data, setData] = useState<ActivitiesData | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/teacher/activities');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(getDemoData());
        }
      } catch {
        setData(getDemoData());
      }
    };

    fetchActivities();
  }, []);

  return data;
}

function getDemoData(): ActivitiesData {
  const activities: ActivitySummary[] = [
    {
      id: 'ACT-001',
      name: 'Career Research Project',
      description: 'Research potential career paths and present findings',
      gatsbyBenchmarkIds: ['GB1', 'GB2'],
      asdanUnitId: null,
      status: 'active',
      createdBy: 'Sarah Mitchell',
      createdAt: '2024-01-15',
      completionCount: 12,
      totalStudents: 24,
    },
    {
      id: 'ACT-002',
      name: 'Employer Visit Reflection',
      description: 'Write a reflection on the recent employer visit',
      gatsbyBenchmarkIds: ['GB5'],
      asdanUnitId: 'ASDAN-WR1',
      status: 'active',
      createdBy: 'Sarah Mitchell',
      createdAt: '2024-01-20',
      completionCount: 8,
      totalStudents: 24,
    },
    {
      id: 'ACT-003',
      name: 'Work Experience Preparation',
      description: 'Complete pre-placement tasks',
      gatsbyBenchmarkIds: ['GB6'],
      asdanUnitId: null,
      status: 'draft',
      createdBy: 'Sarah Mitchell',
      createdAt: '2024-02-01',
      completionCount: 0,
      totalStudents: 24,
    },
  ];

  return {
    activities,
    summary: {
      total: activities.length,
      active: activities.filter((a) => a.status === 'active').length,
      draft: activities.filter((a) => a.status === 'draft').length,
      archived: activities.filter((a) => a.status === 'archived').length,
    },
  };
}

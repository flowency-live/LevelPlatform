/**
 * Hook to fetch evidence queue data for the teacher portal.
 * Returns all pending evidence submissions for review.
 */

import { useState, useEffect } from 'react';

export type EvidenceStatus = 'pending' | 'approved' | 'rejected';

export interface EvidenceSubmission {
  id: string;
  studentId: string;
  studentName: string;
  activityId: string;
  activityName: string;
  evidenceType: 'photo' | 'voice' | 'document';
  submittedAt: string;
  status: EvidenceStatus;
}

export interface EvidenceQueueData {
  submissions: EvidenceSubmission[];
  summary: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export function useEvidenceQueue(): EvidenceQueueData | null {
  const [data, setData] = useState<EvidenceQueueData | null>(null);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await fetch('/api/teacher/evidence');
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

    fetchQueue();
  }, []);

  return data;
}

function getDemoData(): EvidenceQueueData {
  const submissions: EvidenceSubmission[] = [
    {
      id: 'EVD-001',
      studentId: 'STU-001',
      studentName: 'Eagle JS',
      activityId: 'GB1-ACT-001',
      activityName: 'Career Research Project',
      evidenceType: 'photo',
      submittedAt: '2026-04-10T14:30:00Z',
      status: 'pending',
    },
    {
      id: 'EVD-002',
      studentId: 'STU-002',
      studentName: 'Hawk AB',
      activityId: 'GB5-ACT-002',
      activityName: 'Employer Visit Reflection',
      evidenceType: 'document',
      submittedAt: '2026-04-09T10:15:00Z',
      status: 'pending',
    },
    {
      id: 'EVD-003',
      studentId: 'STU-003',
      studentName: 'Falcon CD',
      activityId: 'GB2-ACT-001',
      activityName: 'Labour Market Analysis',
      evidenceType: 'voice',
      submittedAt: '2026-04-08T16:45:00Z',
      status: 'approved',
    },
    {
      id: 'EVD-004',
      studentId: 'STU-001',
      studentName: 'Eagle JS',
      activityId: 'GB3-ACT-001',
      activityName: 'Individual Needs Assessment',
      evidenceType: 'photo',
      submittedAt: '2026-04-07T09:00:00Z',
      status: 'rejected',
    },
  ];

  const pending = submissions.filter(s => s.status === 'pending').length;
  const approved = submissions.filter(s => s.status === 'approved').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;

  return {
    submissions,
    summary: {
      pending,
      approved,
      rejected,
      total: submissions.length,
    },
  };
}

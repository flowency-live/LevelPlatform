/**
 * Hook to fetch a single evidence submission for review.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { EvidenceStatus } from './useEvidenceQueue';

export interface GatsbyBenchmarkRef {
  id: string;
  name: string;
}

export interface ASDANUnitRef {
  id: string;
  name: string;
}

export interface EvidenceDetail {
  id: string;
  studentId: string;
  studentName: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  evidenceType: 'photo' | 'voice' | 'document';
  evidenceUrl: string;
  submittedAt: string;
  status: EvidenceStatus;
  gatsbyBenchmarks: GatsbyBenchmarkRef[];
  asdanUnit: ASDANUnitRef | null;
  studentNotes: string;
}

export function useEvidenceDetail(): EvidenceDetail | null {
  const params = useParams();
  const evidenceId = params?.id as string;
  const [data, setData] = useState<EvidenceDetail | null>(null);

  useEffect(() => {
    if (!evidenceId) return;

    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/teacher/evidence/${evidenceId}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setData(getDemoData(evidenceId));
        }
      } catch {
        setData(getDemoData(evidenceId));
      }
    };

    fetchDetail();
  }, [evidenceId]);

  return data;
}

function getDemoData(evidenceId: string): EvidenceDetail {
  const demoEvidence: Record<string, EvidenceDetail> = {
    'EVD-001': {
      id: 'EVD-001',
      studentId: 'STU-001',
      studentName: 'Eagle JS',
      activityId: 'GB1-ACT-001',
      activityName: 'Career Research Project',
      activityDescription: 'Research and present information about a career of interest.',
      evidenceType: 'photo',
      evidenceUrl: '/uploads/evidence/EVD-001.jpg',
      submittedAt: '2026-04-10T14:30:00Z',
      status: 'pending',
      gatsbyBenchmarks: [
        { id: 'GB1', name: 'Careers Programme' },
        { id: 'GB4', name: 'Curriculum Links' },
      ],
      asdanUnit: {
        id: 'ASDAN-CA1',
        name: 'Career Awareness 1',
      },
      studentNotes: 'I researched software engineering careers and found it very interesting.',
    },
    'EVD-002': {
      id: 'EVD-002',
      studentId: 'STU-002',
      studentName: 'Hawk AB',
      activityId: 'GB5-ACT-002',
      activityName: 'Employer Visit Reflection',
      activityDescription: 'Write a reflection on your recent employer visit experience.',
      evidenceType: 'document',
      evidenceUrl: '/uploads/evidence/EVD-002.pdf',
      submittedAt: '2026-04-09T10:15:00Z',
      status: 'pending',
      gatsbyBenchmarks: [
        { id: 'GB5', name: 'Employer Encounters' },
      ],
      asdanUnit: null,
      studentNotes: 'My reflection on visiting the local engineering firm.',
    },
    'EVD-003': {
      id: 'EVD-003',
      studentId: 'STU-003',
      studentName: 'Falcon CD',
      activityId: 'GB2-ACT-001',
      activityName: 'Labour Market Analysis',
      activityDescription: 'Record a voice note analysing local labour market trends.',
      evidenceType: 'voice',
      evidenceUrl: '/uploads/evidence/EVD-003.mp3',
      submittedAt: '2026-04-08T16:45:00Z',
      status: 'approved',
      gatsbyBenchmarks: [
        { id: 'GB2', name: 'Labour Market' },
      ],
      asdanUnit: {
        id: 'ASDAN-CA2',
        name: 'Career Awareness 2',
      },
      studentNotes: 'I discussed the growing tech sector in our area.',
    },
  };

  return demoEvidence[evidenceId] || demoEvidence['EVD-001'];
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useEvidenceQueue, EvidenceStatus } from '@/lib/hooks/useEvidenceQueue';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  return `${day} ${month}`;
}

function getEvidenceTypeIcon(type: 'photo' | 'voice' | 'document'): JSX.Element {
  switch (type) {
    case 'photo':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'voice':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    case 'document':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
}

function getStatusBadge(status: EvidenceStatus): JSX.Element {
  const styles: Record<EvidenceStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function EvidenceQueuePage() {
  const evidence = useEvidenceQueue();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('pending');

  if (!evidence) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-persona-teacher" />
      </div>
    );
  }

  const filteredSubmissions = activeFilter === 'all'
    ? evidence.submissions
    : evidence.submissions.filter(s => s.status === activeFilter);

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: evidence.summary.total },
    { id: 'pending', label: 'Pending', count: evidence.summary.pending },
    { id: 'approved', label: 'Approved', count: evidence.summary.approved },
    { id: 'rejected', label: 'Rejected', count: evidence.summary.rejected },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Evidence Review</h1>
        <p className="text-text-secondary mt-1">
          {evidence.summary.pending} pending review{evidence.summary.pending !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === tab.id
                ? 'bg-persona-teacher text-white'
                : 'bg-surface-card text-text-secondary hover:bg-surface-page'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Evidence List */}
      <div className="bg-surface-card rounded-xl border border-border-default overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No evidence submissions found
          </div>
        ) : (
          <ul className="divide-y divide-border-default" role="list">
            {filteredSubmissions.map((submission) => (
              <li key={submission.id} className="hover:bg-surface-page/50 transition-colors">
                <Link
                  href={`/teacher/evidence/${submission.id}`}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 text-text-secondary">
                        {getEvidenceTypeIcon(submission.evidenceType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {submission.activityName}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {submission.studentName} • {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-page text-text-secondary capitalize">
                      {submission.evidenceType}
                    </span>
                    {getStatusBadge(submission.status)}
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

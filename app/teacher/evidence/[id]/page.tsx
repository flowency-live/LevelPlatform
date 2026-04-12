'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEvidenceDetail } from '@/lib/hooks/useEvidenceDetail';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function getEvidenceTypeIcon(type: 'photo' | 'voice' | 'document'): JSX.Element {
  switch (type) {
    case 'photo':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'voice':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    case 'document':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
}

export default function EvidenceReviewPage() {
  const router = useRouter();
  const params = useParams();
  const evidenceId = params?.id as string;
  const evidence = useEvidenceDetail();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleReview = async (decision: 'approved' | 'rejected') => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/teacher/evidence/${evidenceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decision,
          feedback: feedback.trim(),
        }),
      });

      if (response.ok) {
        router.push('/teacher/evidence');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!evidence) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-persona-teacher" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-surface-page transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Review Evidence</h1>
          <p className="text-text-secondary mt-1">
            Submitted by {evidence.studentName}
          </p>
        </div>
      </div>

      {/* Evidence Details Card */}
      <div className="bg-surface-card rounded-xl border border-border-default overflow-hidden">
        {/* Activity Info */}
        <div className="p-6 border-b border-border-default">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{evidence.activityName}</h2>
              <p className="text-text-secondary mt-1">{evidence.activityDescription}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              evidence.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
              evidence.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {evidence.status}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="px-6 py-4 bg-surface-page/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-text-secondary block">Student</span>
            <span className="text-text-primary font-medium">{evidence.studentName}</span>
          </div>
          <div>
            <span className="text-text-secondary block">Evidence Type</span>
            <span className="text-text-primary font-medium flex items-center gap-1.5 capitalize">
              {getEvidenceTypeIcon(evidence.evidenceType)}
              {evidence.evidenceType}
            </span>
          </div>
          <div>
            <span className="text-text-secondary block">Submitted</span>
            <span className="text-text-primary font-medium">{formatDate(evidence.submittedAt)}</span>
          </div>
          <div>
            <span className="text-text-secondary block">Status</span>
            <span className="text-text-primary font-medium capitalize">{evidence.status}</span>
          </div>
        </div>

        {/* Gatsby Benchmarks */}
        <div className="p-6 border-t border-border-default">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Gatsby Benchmarks</h3>
          <div className="flex flex-wrap gap-2">
            {evidence.gatsbyBenchmarks.map((benchmark) => (
              <span
                key={benchmark.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gatsby/10 text-gatsby"
              >
                <span className="font-semibold">{benchmark.id}</span>
                <span className="text-sm">{benchmark.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ASDAN Unit */}
        {evidence.asdanUnit && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-3">ASDAN Unit</h3>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-asdan/10 text-asdan">
              <span className="font-semibold">{evidence.asdanUnit.id}</span>
              <span className="text-sm">{evidence.asdanUnit.name}</span>
            </span>
          </div>
        )}
      </div>

      {/* Evidence Preview */}
      <div className="bg-surface-card rounded-xl border border-border-default overflow-hidden">
        <div className="p-6 border-b border-border-default">
          <h3 className="text-lg font-semibold text-text-primary">Evidence Submitted</h3>
        </div>
        <div className="p-6">
          {evidence.evidenceType === 'photo' && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
              <span className="text-text-secondary">Photo preview would appear here</span>
            </div>
          )}
          {evidence.evidenceType === 'voice' && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-persona-teacher/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-persona-teacher" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-text-secondary">Voice recording player would appear here</span>
            </div>
          )}
          {evidence.evidenceType === 'document' && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-text-secondary">Document preview would appear here</span>
            </div>
          )}
        </div>
      </div>

      {/* Student Notes */}
      {evidence.studentNotes && (
        <div className="bg-surface-card rounded-xl border border-border-default overflow-hidden">
          <div className="p-6 border-b border-border-default">
            <h3 className="text-lg font-semibold text-text-primary">Student Notes</h3>
          </div>
          <div className="p-6">
            <p className="text-text-primary">{evidence.studentNotes}</p>
          </div>
        </div>
      )}

      {/* Feedback & Actions */}
      <div className="bg-surface-card rounded-xl border border-border-default overflow-hidden">
        <div className="p-6 border-b border-border-default">
          <h3 className="text-lg font-semibold text-text-primary">Your Review</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-text-primary mb-2">
              Feedback (optional)
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Add feedback for the student..."
              className="w-full px-4 py-2 rounded-lg border border-border-default bg-surface-card text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-persona-teacher focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleReview('rejected')}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => handleReview('approved')}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

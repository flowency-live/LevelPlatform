'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { ActivityBlock } from '@/components/benchmark/ActivityBlock';
import { useStudentProgress } from '@/lib/hooks/useStudentProgress';
import { GATSBY_BENCHMARKS } from '@/lib/reference-data/benchmarks';
import type { BenchmarkId, ActivityId } from '@/lib/types/student';

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function BenchmarkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const benchmarkId = params.id as BenchmarkId;

  const progress = useStudentProgress();
  const benchmark = GATSBY_BENCHMARKS[benchmarkId];

  // Local state for optimistic updates
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(() => {
    const benchmarkProgress = progress?.benchmarks.find(b => b.benchmarkId === benchmarkId);
    const completed = benchmarkProgress?.activitiesCompleted.map(a => a.activityId) ?? [];
    return new Set(completed);
  });

  // Get completion dates from progress
  const completionDates = useMemo(() => {
    const benchmarkProgress = progress?.benchmarks.find(b => b.benchmarkId === benchmarkId);
    const dates: Record<string, string> = {};
    benchmarkProgress?.activitiesCompleted.forEach(a => {
      dates[a.activityId] = a.completedAt;
    });
    return dates;
  }, [progress, benchmarkId]);

  if (!progress || !benchmark) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  const activities = benchmark.activities;
  const totalActivities = activities.length;
  const completedCount = completedActivities.size;
  const percentComplete = Math.round((completedCount / totalActivities) * 100);

  const handleToggle = (activityId: ActivityId) => {
    setCompletedActivities(prev => {
      const next = new Set(prev);
      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Back"
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="inline-block px-2 py-0.5 mb-2 text-xs font-semibold text-gatsby-dark bg-gatsby-bg rounded">
            {benchmarkId}
          </span>
          <h1 className="text-xl font-bold text-text-primary">
            {benchmark.shortName}
          </h1>
        </div>
        <ProgressRing
          percent={percentComplete}
          size="md"
          showLabel
          showFraction={`${completedCount} of ${totalActivities}`}
        />
      </div>

      {/* Description */}
      <div className="bg-gray-50 border border-border-default rounded-lg p-4">
        <p className="text-sm text-text-secondary">{benchmark.description}</p>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Activities</h2>
        {activities.map((activity) => {
          const activityId = activity.id as ActivityId;
          const isComplete = completedActivities.has(activityId);
          const completedAt = completionDates[activityId];

          return (
            <ActivityBlock
              key={activityId}
              activity={{
                id: activityId,
                benchmarkId,
                name: activity.name,
                description: activity.description,
                order: 0,
              }}
              isComplete={isComplete}
              completedAt={completedAt ? formatDate(completedAt) : undefined}
              onToggle={handleToggle}
            />
          );
        })}
      </div>
    </div>
  );
}

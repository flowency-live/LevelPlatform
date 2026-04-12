'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useActivities } from '@/lib/hooks/useActivities';

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'draft':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'archived':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function ActivitiesPage() {
  const activitiesData = useActivities();
  const [filter, setFilter] = useState<FilterStatus>('all');

  if (!activitiesData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-persona-teacher" />
      </div>
    );
  }

  const filteredActivities =
    filter === 'all'
      ? activitiesData.activities
      : activitiesData.activities.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Activities</h1>
          <p className="text-text-secondary mt-1">
            {activitiesData.summary.total} activities • {activitiesData.summary.active} active
          </p>
        </div>
        <Link
          href="/teacher/activities/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-persona-teacher text-white rounded-lg hover:bg-persona-teacher/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Activity
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'draft', 'archived'] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-persona-teacher text-white'
                : 'bg-surface-card text-text-secondary hover:bg-surface-page border border-border-default'
            }`}
          >
            {status}
            {status !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({activitiesData.summary[status as keyof typeof activitiesData.summary]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-surface-card rounded-xl border border-border-default p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Link
                    href={`/teacher/activities/${activity.id}`}
                    className="text-lg font-semibold text-text-primary hover:text-persona-teacher"
                  >
                    {activity.name}
                  </Link>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusBadgeClass(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-3">{activity.description}</p>

                {/* Benchmark & ASDAN Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {activity.gatsbyBenchmarkIds.map((gbId) => (
                    <span
                      key={gbId}
                      className="px-2 py-1 rounded bg-gatsby/10 text-gatsby text-xs font-medium"
                    >
                      {gbId}
                    </span>
                  ))}
                  {activity.asdanUnitId && (
                    <span className="px-2 py-1 rounded bg-asdan/10 text-asdan text-xs font-medium">
                      ASDAN
                    </span>
                  )}
                </div>
              </div>

              {/* Completion Stats */}
              <div className="text-right">
                <div className="text-2xl font-bold text-text-primary">
                  {activity.completionCount}/{activity.totalStudents}
                </div>
                <div className="text-xs text-text-secondary">completed</div>
                <div className="mt-2 w-24 h-2 bg-surface-page rounded-full overflow-hidden">
                  <div
                    className="h-full bg-persona-teacher rounded-full"
                    style={{
                      width: `${(activity.completionCount / activity.totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-border-default flex items-center justify-between text-sm text-text-secondary">
              <span>Created by {activity.createdBy}</span>
              <span>{activity.createdAt}</span>
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            No {filter === 'all' ? '' : filter} activities found.
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTeacherDashboard } from '@/lib/hooks/useTeacherDashboard';

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const dashboard = useTeacherDashboard();

  const userName = session?.user?.name?.split(' ')[0] || 'Teacher';

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-persona-teacher" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome, {userName}
          </h1>
          <p className="text-text-secondary mt-1">
            Here&apos;s your Gatsby compliance overview
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-persona-teacher">
            {dashboard.compliance.overallPercent}%
          </div>
          <div className="text-sm text-text-secondary">Overall Compliance</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-testid="stats-grid">
        <div className="bg-surface-card rounded-xl p-5 border border-border-default">
          <div className="text-3xl font-bold text-text-primary">
            {dashboard.stats.studentCount}
          </div>
          <div className="text-sm text-text-secondary mt-1">Students</div>
          <Link
            href="/teacher/students"
            className="text-sm text-persona-teacher hover:underline mt-3 inline-block"
          >
            View Students →
          </Link>
        </div>

        <div className="bg-surface-card rounded-xl p-5 border border-border-default">
          <div className="text-3xl font-bold text-text-primary">
            {dashboard.stats.pendingEvidence}
          </div>
          <div className="text-sm text-text-secondary mt-1">Pending Review</div>
          <Link
            href="/teacher/evidence"
            className="text-sm text-persona-teacher hover:underline mt-3 inline-block"
          >
            Review Evidence →
          </Link>
        </div>

        <div className="bg-surface-card rounded-xl p-5 border border-border-default">
          <div className="text-3xl font-bold text-text-primary">
            {dashboard.stats.activitiesThisWeek}
          </div>
          <div className="text-sm text-text-secondary mt-1">This Week</div>
          <Link
            href="/teacher/activities/create"
            className="text-sm text-persona-teacher hover:underline mt-3 inline-block"
          >
            Create Activity →
          </Link>
        </div>
      </div>

      {/* Gatsby Benchmarks */}
      <div className="bg-surface-card rounded-xl border border-border-default">
        <div className="px-6 py-4 border-b border-border-default">
          <h2 className="text-lg font-semibold text-text-primary">
            Gatsby Benchmarks
          </h2>
        </div>
        <div className="divide-y divide-border-default">
          {dashboard.compliance.benchmarks.map((benchmark) => (
            <div
              key={benchmark.benchmarkId}
              className="px-6 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-gatsby/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-gatsby">
                  {benchmark.benchmarkId}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">
                  {benchmark.name}
                </div>
                <div className="mt-2 h-2 bg-surface-page rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gatsby rounded-full transition-all"
                    style={{ width: `${benchmark.percentComplete}%` }}
                    role="progressbar"
                    aria-valuenow={benchmark.percentComplete}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-text-primary">
                  {benchmark.percentComplete}%
                </div>
                <div className="text-xs text-text-secondary">
                  {benchmark.studentCount} students
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

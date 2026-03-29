'use client';

import { useRouter } from 'next/navigation';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { BenchmarkCard } from '@/components/benchmark/BenchmarkCard';
import { useStudentProgress } from '@/lib/hooks/useStudentProgress';
import { GATSBY_BENCHMARKS } from '@/lib/reference-data/benchmarks';
import type { BenchmarkId } from '@/lib/types/student';

const BENCHMARK_IDS: BenchmarkId[] = ['GB1', 'GB2', 'GB3', 'GB4', 'GB5', 'GB6', 'GB7', 'GB8'];

export default function StudentDashboard() {
  const router = useRouter();
  const progress = useStudentProgress();

  if (!progress) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  const { student, benchmarks, overallPercent, employerEncounters, targets } = progress;
  const firstName = student.firstName;

  // Find the next activity to complete
  const nextBenchmark = benchmarks.find(b => b.status !== 'complete');
  const nextActivity = nextBenchmark
    ? GATSBY_BENCHMARKS[nextBenchmark.benchmarkId]?.activities.find(
        (_, index) => index >= nextBenchmark.activitiesCompleted.length
      )?.name
    : null;

  return (
    <div className="p-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">Welcome back, {firstName}</p>
          <h1 className="text-2xl font-bold text-text-primary">My Career Plan</h1>
        </div>
        <ProgressRing
          percent={overallPercent}
          size="lg"
          showLabel
        />
      </div>

      {/* What's Next Section */}
      {nextActivity && (
        <div className="bg-gatsby-bg border border-gatsby rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gatsby-dark mb-1">What&apos;s Next</h2>
          <p className="text-text-primary">{nextActivity}</p>
        </div>
      )}

      {/* Benchmark Grid */}
      <div data-testid="benchmark-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BENCHMARK_IDS.map(benchmarkId => {
          const benchmark = GATSBY_BENCHMARKS[benchmarkId];
          const benchmarkProgress = benchmarks.find(b => b.benchmarkId === benchmarkId);
          const percentComplete = benchmarkProgress?.percentComplete ?? 0;
          const activitiesTotal = benchmark?.activities.length ?? 0;
          const activitiesComplete = benchmarkProgress?.activitiesCompleted.length ?? 0;

          // Find next activity for this benchmark
          const nextActivityForBenchmark = benchmark?.activities.find(
            (_, index) => index >= (benchmarkProgress?.activitiesCompleted.length ?? 0)
          )?.name;

          return (
            <BenchmarkCard
              key={benchmarkId}
              benchmarkId={benchmarkId}
              title={benchmark?.shortName ?? benchmarkId}
              percentComplete={percentComplete}
              activitiesComplete={activitiesComplete}
              activitiesTotal={activitiesTotal}
              nextActivity={nextActivityForBenchmark}
              onClick={() => router.push(`/student/benchmark/${benchmarkId}`)}
            />
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-border-default rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-1">Employer Encounters</h3>
          <p className="text-xl font-bold text-text-primary">
            {employerEncounters.length} of 3
          </p>
          <p className="text-xs text-text-secondary">required encounters</p>
        </div>
        <div className="bg-white border border-border-default rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-1">SMART Targets</h3>
          <p className="text-xl font-bold text-text-primary">{targets.length}</p>
          <p className="text-xs text-text-secondary">active targets</p>
        </div>
      </div>
    </div>
  );
}

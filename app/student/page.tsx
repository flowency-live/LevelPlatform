'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gatsby border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Loading your plan...</p>
        </div>
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

  const completedCount = benchmarks.filter(b => b.status === 'complete').length;

  return (
    <div className="px-5 py-6 space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Hero Section - matches mockup style */}
      <section>
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-tight">
          Hi, {firstName}
        </h1>
        <p className="text-[15px] text-text-secondary mt-1">
          Here&apos;s your career development progress so far.
        </p>
      </section>

      {/* Progress Card - prominent encouragement */}
      <section className="bg-white border border-border-default rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-5">
          <ProgressRing
            percent={overallPercent}
            size="lg"
            showLabel
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-semibold text-text-primary mb-1">
              You&apos;re making great progress!
            </h2>
            <p className="text-[14px] text-text-secondary mb-4">
              You&apos;ve fully completed {completedCount} out of 8 Gatsby Benchmarks. Keep going!
            </p>

            {/* What's Next Card */}
            {nextActivity && (
              <div className="bg-surface-page border border-border-default rounded-xl p-4">
                <span className="text-[11px] font-semibold text-gatsby uppercase tracking-wide">
                  What&apos;s Next
                </span>
                <p className="text-[14px] text-text-primary mt-1 mb-2">{nextActivity}</p>
                <Link
                  href={`/student/benchmark/${nextBenchmark?.benchmarkId}`}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-gatsby hover:text-gatsby-dark transition-colors"
                >
                  Continue {nextBenchmark?.benchmarkId}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SMART Targets Card */}
        <article className="bg-gradient-to-br from-individual-bg to-white border border-individual-border rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-individual/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-individual" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-semibold text-text-primary mb-1">SMART Targets</h3>
          <p className="text-[13px] text-text-secondary mb-3">
            You have <span className="font-semibold text-individual">{targets.length}</span> active targets to focus on.
          </p>
          <Link
            href="/student/targets"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-individual hover:text-individual-dark transition-colors"
          >
            View Targets
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </article>

        {/* Employer Encounters Card */}
        <article className="bg-gradient-to-br from-gatsby-bg to-white border border-gatsby-border rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gatsby/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-gatsby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-semibold text-text-primary mb-1">Employer Encounters</h3>
          <p className="text-[13px] text-text-secondary mb-3">
            You&apos;ve logged <span className="font-semibold text-gatsby">{employerEncounters.length} of 3</span> required encounters.
          </p>
          <Link
            href="/student/employers"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-gatsby hover:text-gatsby-dark transition-colors"
          >
            Log Encounter
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </article>
      </section>

      {/* Benchmark Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-semibold text-text-primary">
            Gatsby Benchmarks
          </h2>
          <Link
            href="/student/plan"
            className="text-[13px] font-medium text-gatsby hover:text-gatsby-dark transition-colors"
          >
            View All Plan
          </Link>
        </div>

        <div data-testid="benchmark-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
      </section>
    </div>
  );
}

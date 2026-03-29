import { NextRequest, NextResponse } from 'next/server';
import { CohortId } from '@/lib/domain/tenant/CohortId';
import { GetBenchmarkHeatmap } from '@/lib/application/GetBenchmarkHeatmap';
import { InMemoryStudentRepository } from '@/lib/domain/student/InMemoryStudentRepository';
import { InMemoryBenchmarkProgressRepository } from '@/lib/domain/benchmark/InMemoryBenchmarkProgressRepository';

// TODO: Replace with DI container / singleton pattern
const studentRepository = new InMemoryStudentRepository();
const progressRepository = new InMemoryBenchmarkProgressRepository();
const getBenchmarkHeatmap = new GetBenchmarkHeatmap(studentRepository, progressRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cohortIdParam = searchParams.get('cohortId');

    if (!cohortIdParam) {
      return NextResponse.json(
        { error: 'cohortId query parameter is required' },
        { status: 400 }
      );
    }

    if (!CohortId.isValid(cohortIdParam)) {
      return NextResponse.json(
        { error: `Invalid cohort ID: ${cohortIdParam}` },
        { status: 400 }
      );
    }

    const cohortId = CohortId.create(cohortIdParam);
    const result = await getBenchmarkHeatmap.execute(cohortId);

    return NextResponse.json({
      rows: result.rows.map(row => ({
        studentId: row.studentId.toString(),
        studentName: row.studentName,
        overallPercentComplete: row.overallPercentComplete,
        benchmarks: row.benchmarks.map(b => ({
          benchmarkId: b.benchmarkId.toString(),
          percentComplete: b.percentComplete,
          status: b.status,
        })),
      })),
      summary: result.summary,
    });
  } catch (error) {
    throw error;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { LocationId } from '@/lib/domain/tenant/LocationId';
import { GetBenchmarkHeatmap } from '@/lib/application/GetBenchmarkHeatmap';
import { studentRepository, progressRepository } from '@/lib/infrastructure/repositories';

const getBenchmarkHeatmap = new GetBenchmarkHeatmap(studentRepository, progressRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationIdParam = searchParams.get('locationId');

    if (!locationIdParam) {
      return NextResponse.json(
        { error: 'locationId query parameter is required' },
        { status: 400 }
      );
    }

    if (!LocationId.isValid(locationIdParam)) {
      return NextResponse.json(
        { error: `Invalid location ID: ${locationIdParam}` },
        { status: 400 }
      );
    }

    const locationId = LocationId.create(locationIdParam);
    const result = await getBenchmarkHeatmap.execute(locationId);

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

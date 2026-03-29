import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { StudentId } from '@/lib/domain/student/StudentId';
import { BenchmarkId } from '@/lib/domain/benchmark/BenchmarkId';
import { ActivityId } from '@/lib/domain/benchmark/ActivityId';
import { CompleteActivity } from '@/lib/application/CompleteActivity';
import { studentRepository, progressRepository } from '@/lib/infrastructure/seeded-repositories';

const completeActivity = new CompleteActivity(studentRepository, progressRepository);

const CompleteActivitySchema = z.object({
  benchmarkId: z.string().regex(/^GB[1-8]$/, 'Invalid benchmark ID'),
  activityId: z.string().regex(/^GB[1-8]-0[1-9]$/, 'Invalid activity ID'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!StudentId.isValid(params.id)) {
      return NextResponse.json(
        { error: `Invalid student ID: ${params.id}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = CompleteActivitySchema.parse(body);

    const result = await completeActivity.execute({
      studentId: StudentId.create(params.id),
      benchmarkId: BenchmarkId.create(validated.benchmarkId),
      activityId: ActivityId.create(validated.activityId),
      completedAt: new Date(),
    });

    return NextResponse.json({
      benchmarkId: result.benchmarkId.toString(),
      percentComplete: result.percentComplete,
      status: result.status,
      completedActivities: result.completedActivities.map(a => ({
        activityId: a.activityId.toString(),
        completedAt: a.completedAt.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.name === 'StudentNotFoundError') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    throw error;
  }
}

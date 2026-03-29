import { NextRequest, NextResponse } from 'next/server';
import { StudentId } from '@/lib/domain/student/StudentId';
import { GetStudentProgress } from '@/lib/application/GetStudentProgress';
import { InMemoryStudentRepository } from '@/lib/domain/student/InMemoryStudentRepository';
import { InMemoryBenchmarkProgressRepository } from '@/lib/domain/benchmark/InMemoryBenchmarkProgressRepository';

// TODO: Replace with DI container / singleton pattern
const studentRepository = new InMemoryStudentRepository();
const progressRepository = new InMemoryBenchmarkProgressRepository();
const getStudentProgress = new GetStudentProgress(studentRepository, progressRepository);

export async function GET(
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

    const studentId = StudentId.create(params.id);
    const result = await getStudentProgress.execute(studentId);

    return NextResponse.json({
      student: {
        id: result.student.id.toString(),
        firstName: result.student.firstName,
        lastName: result.student.lastName,
        fullName: result.student.fullName,
        email: result.student.email,
        yearGroup: result.student.yearGroup,
      },
      benchmarkProgress: result.benchmarkProgress.map(p => ({
        benchmarkId: p.benchmarkId.toString(),
        percentComplete: p.percentComplete,
        status: p.status,
        completedActivities: p.completedActivities.map(a => ({
          activityId: a.activityId.toString(),
          completedAt: a.completedAt.toISOString(),
        })),
      })),
      overallPercentComplete: result.overallPercentComplete,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'StudentNotFoundError') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    throw error;
  }
}

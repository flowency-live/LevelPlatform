import { NextRequest, NextResponse } from 'next/server';
import { userAccountRepository } from '@/lib/infrastructure/repositories';
import { SetupStaffAccount, InvalidInviteError, ExpiredInviteError } from '@/lib/application/SetupStaffAccount';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { token } = await context.params;

  const account = await userAccountRepository.findByInviteToken(token);

  if (!account) {
    return NextResponse.json(
      { error: 'Invalid invite token' },
      { status: 404 }
    );
  }

  const now = new Date();
  if (!account.hasValidInvite(now)) {
    return NextResponse.json(
      { error: 'Invite token has expired' },
      { status: 410 }
    );
  }

  return NextResponse.json({ email: account.email });
}

export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { token } = await context.params;

  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const useCase = new SetupStaffAccount(userAccountRepository);
    const result = await useCase.execute({
      inviteToken: token,
      password,
    });

    return NextResponse.json({
      success: result.success,
      email: result.email,
    });
  } catch (error) {
    if (error instanceof InvalidInviteError) {
      return NextResponse.json(
        { error: 'Invalid invite token' },
        { status: 404 }
      );
    }
    if (error instanceof ExpiredInviteError) {
      return NextResponse.json(
        { error: 'Invite token has expired' },
        { status: 410 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

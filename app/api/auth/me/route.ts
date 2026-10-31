import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { getAuthenticatedUser } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Invalid or missing Bearer token.' },
        { status: 401 }
      );
    }

    const user = await Repository.findUserById(authUser.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve profile';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

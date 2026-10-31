import { NextRequest, NextResponse } from 'next/server';
import { Repository, sanitizeUser } from '@/lib/db/repository';
import { comparePassword, generateToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const userWithPw = await Repository.findUserByEmail(email);
    if (!userWithPw || !userWithPw.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, userWithPw.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const safeUser = sanitizeUser(userWithPw)!;
    const token = generateToken(safeUser);

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

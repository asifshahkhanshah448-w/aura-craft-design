import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { hashPassword, generateToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, address } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email, and password.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = await Repository.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await Repository.createUser({
      name,
      email,
      passwordHash,
      role: 'customer',
      phone,
      address,
    });

    const token = generateToken(user);

    return NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully.',
        token,
        user,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

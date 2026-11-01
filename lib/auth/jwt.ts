import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { IUser } from '../types';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('Server configuration error: JWT_SECRET environment variable is missing.');
  }
  return secret;
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  name: string;
}

export function generateToken(user: { _id: string; email: string; role: 'customer' | 'admin'; name: string }): string {
  const secret = getJwtSecret();
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      console.error('[JWT Configuration Error]', error.message);
    }
    return null;
  }
}

export function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}

export function getAuthenticatedUser(req: NextRequest): TokenPayload | null {
  const token = extractBearerToken(req);
  if (!token) return null;
  return verifyToken(token);
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

import jwt from 'jsonwebtoken';
import type { UserRole } from './user-store.js';

const JWT_SECRET =
  process.env.JWT_SECRET ?? 'pmc-pedier-aid-jwt-secret-xk9mq8n2w5v3r1-2024';

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface JwtTokenPayload {
  userId: string;
  role: 'citizen' | 'vle' | 'admin';
  phone?: string;
  email?: string;
  name: string;
}

export function signJwt(payload: JwtTokenPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyJwt<T extends object = JwtTokenPayload>(token: string): T | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
}

import type { Request, Response, NextFunction } from 'express';
import { verifyJwt, type JwtTokenPayload } from '../utils/auth.js';
import { sendError } from '../utils/response.js';

// Extend Express Request type to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  // Fallback to cookie if present
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

export function authenticateJwt(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    sendError(res, 'Authentication token missing. Please sign in.', 'UNAUTHORIZED', 401);
    return;
  }

  const payload = verifyJwt<JwtTokenPayload>(token);

  if (!payload || !payload.userId) {
    sendError(res, 'Invalid or expired session token. Please sign in again.', 'TOKEN_EXPIRED', 401);
    return;
  }

  req.user = payload;
  next();
}

export function optionalAuthenticateJwt(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (token) {
    const payload = verifyJwt<JwtTokenPayload>(token);
    if (payload && payload.userId) {
      req.user = payload;
    }
  }
  next();
}


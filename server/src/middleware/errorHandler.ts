import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedIssues = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    sendError(res, 'Request validation failed', 'VALIDATION_ERROR', 422, formattedIssues);
    return;
  }

  // Handle standard errors
  if (err instanceof Error) {
    console.error(`[Server Error] ${err.name}: ${err.message}`);
    // Avoid exposing stack trace or internal database/system details
    sendError(
      res,
      err.message || 'An internal server error occurred',
      'INTERNAL_SERVER_ERROR',
      500
    );
    return;
  }

  console.error('[Server Error] Unknown error:', err);
  sendError(res, 'An unexpected error occurred', 'UNKNOWN_ERROR', 500);
}

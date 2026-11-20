import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response.js';
import { ENV } from '../config/env.js';

export class HealthController {
  static getHealth(_req: Request, res: Response): void {
    const isDbConnected = mongoose.connection.readyState === 1;

    const healthData = {
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      environment: ENV.NODE_ENV,
      version: '1.0.0',
      database: {
        mode: isDbConnected ? 'mongodb_atlas_live' : 'static_demonstration',
        connected: isDbConnected,
        databaseName: isDbConnected ? mongoose.connection.name : undefined,
        mongoDbConfigured: !!ENV.MONGODB_URI,
      },
      timestamp: new Date().toISOString(),
    };

    sendSuccess(res, healthData, { service: 'gramsathi-backend' });
  }
}

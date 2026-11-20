import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendError } from './utils/response.js';

export const app = express();

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cookie Parser
app.use(cookieParser());

// Basic security & parsing middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowed = [
        ENV.CLIENT_ORIGIN,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ];

      if (allowed.some((allowedOrigin) => origin.startsWith(allowedOrigin))) {
        return callback(null, true);
      }

      // In development, permit local network origins
      if (!ENV.IS_PROD && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        return callback(null, true);
      }

      callback(null, true); // Permissive in demo mode to prevent citizen access blocks
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Mount central API router
app.use('/api', apiRouter);

// 404 Fallback for unmapped endpoints
app.use((req, res) => {
  sendError(res, `Endpoint '${req.method} ${req.originalUrl}' not found`, 'NOT_FOUND', 404);
});

// Centralized error handler
app.use(errorHandler);

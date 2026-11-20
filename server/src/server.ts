import { app } from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const server = app.listen(ENV.PORT, async () => {
  console.log(`[GramSathi Server] Running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
  console.log(`[GramSathi Server] Health check available at http://localhost:${ENV.PORT}/api/health`);
  console.log(`[GramSathi Server] Allowed client origin: ${ENV.CLIENT_ORIGIN}`);

  // Initialize database connection safely without blocking startup
  try {
    const dbStatus = await connectDatabase();
    if (dbStatus.isConnected) {
      console.log(`[GramSathi Server] MongoDB Atlas connected successfully: ${dbStatus.databaseName}`);
    } else {
      console.log(`[GramSathi Server] MongoDB notice: ${dbStatus.error || 'Running in offline/in-memory fallback mode.'}`);
    }
  } catch (err) {
    console.warn('[GramSathi Server] MongoDB connection attempt warning:', err);
  }
});

process.on('SIGTERM', async () => {
  console.log('[GramSathi Server] SIGTERM received. Gracefully shutting down...');
  await disconnectDatabase();
  server.close(() => {
    console.log('[GramSathi Server] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('[GramSathi Server] SIGINT received. Shutting down...');
  await disconnectDatabase();
  server.close(() => {
    process.exit(0);
  });
});


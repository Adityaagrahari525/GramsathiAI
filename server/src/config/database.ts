import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Ensure Atlas SRV records resolve cleanly on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignored if custom DNS servers restricted
}

dotenv.config();

export interface DbConnectionStatus {
  isConnected: boolean;
  uriConfigured: boolean;
  databaseName?: string;
  error?: string;
}

export async function connectDatabase(): Promise<DbConnectionStatus> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri || uri === '' || uri.includes('<username>') || uri.includes('<password>')) {
    return {
      isConnected: false,
      uriConfigured: false,
      error: 'MongoDB connection string (MONGODB_URI) is not provided or contains unconfigured placeholders.',
    };
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    return {
      isConnected: true,
      uriConfigured: true,
      databaseName: conn.connection.name,
    };
  } catch (err: any) {
    return {
      isConnected: false,
      uriConfigured: true,
      error: err.message || 'Failed to connect to MongoDB cluster.',
    };
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

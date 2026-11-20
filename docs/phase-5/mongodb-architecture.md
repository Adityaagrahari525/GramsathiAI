# GramSathi AI — MongoDB Architecture & Integration

## 1. Overview
GramSathi AI utilizes **MongoDB Atlas** with **Mongoose** as its primary persistent document store. The architecture provides a dual-mode hybrid runtime:
- **Connected Mode**: When `MONGODB_URI` is provided in environment variables, the system executes high-throughput queries, compound index-assisted filtering, and persistent document lifecycle operations.
- **Offline / Demonstration Fallback**: If `MONGODB_URI` is not configured, contains template placeholders, or the database cluster is momentarily unreachable, the application starts immediately in offline fallback mode without crashing.

## 2. Connection Lifecycle & Resilience
- **Config Module**: `server/src/config/database.ts`
- **Environment Management**: `server/src/config/env.ts` reads `MONGODB_URI` cleanly. No credentials are committed or hardcoded.
- **Connection Configuration**:
  ```ts
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: true,
  });
  ```
- **Graceful Shutdown**: SIGINT and SIGTERM handlers disconnect Mongoose cleanly upon process exit.
- **Zero Single Point of Failure**: All controllers (`AuthController`, `UserController`, `SchemeController`) check database state dynamically via `mongoose.connection.readyState === 1`.

## 3. High-Throughput Indexing Strategy
- **Schemes**:
  - `{ state: 1, 'governance.verificationStatus': 1 }` — High-efficiency state filtering.
  - `{ 'eligibility.structured.incomeMax': 1 }` — Income-bounded matching.
  - `{ 'eligibility.structured.gender': 1 }` — Demographic matching.
  - `{ category: 1, state: 1 }` — Category queries.
- **Users**:
  - `{ phone: 1 }` (unique, sparse)
  - `{ email: 1 }` (unique, sparse, lowercase)
- **Saved Schemes**:
  - Compound unique index `{ userId: 1, schemeId: 1 }` preventing duplicate bookmarks.
- **Journeys**:
  - Compound unique index `{ userId: 1, schemeId: 1 }` ensuring a single active state machine per citizen per scheme.

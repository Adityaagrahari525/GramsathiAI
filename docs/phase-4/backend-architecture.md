# GramSathi AI — Phase 4 Backend Architecture

## 1. Architectural Overview

Phase 4 establishes an enterprise-grade, lightweight Node.js + Express + TypeScript backend service for **GramSathi AI**. The backend acts as the authoritative REST API server for scheme discovery, categorization, multi-criteria eligibility calculation, and reverse need matching.

```
┌──────────────────────────────────────────────────────────┐
│                   React 19 Frontend                      │
│             (Vite + Tailwind CSS + Stitch UI)            │
└────────────────────────────┬─────────────────────────────┘
                             │  HTTP / JSON (REST API)
                             ▼
┌──────────────────────────────────────────────────────────┐
│             Node.js + Express REST API Server            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ App Middleware: CORS, JSON Size Limits (1MB), Error│  │
│  └─────────────────────────┬──────────────────────────┘  │
│                            ▼                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ API Routing & Zod Request Validation Middleware   │  │
│  └─────────────────────────┬──────────────────────────┘  │
│                            ▼                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Controllers (Health, Schemes, Eligibility, Disc.)  │  │
│  └─────────────────────────┬──────────────────────────┘  │
│                            ▼                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Services (Business Logic & Deterministic Engine)   │  │
│  └─────────────────────────┬──────────────────────────┘  │
│                            ▼                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Repository Adapter Layer (ISchemeRepository)       │  │
│  │   ├── StaticSchemeRepository (Phase 4 Active)      │  │
│  │   └── MongoSchemeRepository (Phase 5 Slot)         │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

The backend code is situated in `server/src/`:

```
server/
├── src/
│   ├── config/
│   │   ├── env.ts                   # Environment variables (PORT, CORS, NODE_ENV)
│   │   └── database.ts              # Database connection manager (prepared for MongoDB)
│   ├── controllers/
│   │   ├── healthController.ts      # Health check controller
│   │   ├── schemeController.ts      # Schemes, categories, departments, search
│   │   ├── eligibilityController.ts # Multi-criteria eligibility assessment
│   │   └── discoveryController.ts   # Reverse need recommendation
│   ├── routes/
│   │   ├── healthRoutes.ts          # /api/health
│   │   ├── schemeRoutes.ts          # /api/schemes/*
│   │   ├── eligibilityRoutes.ts     # /api/eligibility/*
│   │   ├── discoveryRoutes.ts       # /api/discovery/*
│   │   └── index.ts                 # Central /api router
│   ├── services/
│   │   ├── schemeService.ts         # Scheme retrieval & aggregation
│   │   ├── eligibilityService.ts    # 3-state deterministic eligibility engine
│   │   └── discoveryService.ts      # Rule & keyword reverse discovery matching
│   ├── middleware/
│   │   ├── errorHandler.ts          # Centralized error handler (hides stack traces)
│   │   └── validateRequest.ts       # Generic Zod request validator
│   ├── repositories/
│   │   └── schemeRepository.ts      # ISchemeRepository interface & StaticSchemeRepository
│   ├── data/
│   │   └── schemes.ts               # Structured demonstration scheme records
│   ├── types/
│   │   ├── scheme.ts                # Scheme and filter interfaces
│   │   ├── api.ts                   # ApiResponse & ApiError interfaces
│   │   ├── eligibility.ts           # Profile input and evaluation types
│   │   └── discovery.ts             # Need recommendation types
│   ├── utils/
│   │   └── response.ts              # Consistent JSON response builders
│   ├── test_endpoints.ts            # Integration test suite
│   ├── app.ts                       # Express application setup
│   └── server.ts                    # HTTP server listener
├── .env.example                     # Environment template
├── package.json                     # Server dependencies & scripts
└── tsconfig.json                    # TypeScript NodeNext configuration
```

---

## 3. Key Design Patterns

### 3.1 Modular Repository Pattern
To adhere strictly to the Phase 4 requirement:
> *"Keep the repository layer modular so MongoDB can replace the temporary data source in Phase 5."*

The repository layer defines `ISchemeRepository`:
```typescript
export interface ISchemeRepository {
  getAll(filters?: SchemeFilters): Promise<{ schemes: Scheme[]; total: number }>;
  getById(id: string): Promise<Scheme | null>;
  search(query: string, limit?: number): Promise<Scheme[]>;
  getCategories(): Promise<CategoryItem[]>;
  getDepartments(): Promise<DepartmentItem[]>;
}
```
In Phase 4, `StaticSchemeRepository` implements this interface using the verified Phase 3 dataset. In Phase 5, `MongoSchemeRepository` can be substituted without changing a single line of controller or route code.

### 3.2 Consistent Envelope Pattern
All API endpoints return a standardized JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "total": 8,
    "count": 8
  }
}
```
Errors adhere to a uniform structure with HTTP status codes:
```json
{
  "success": false,
  "error": {
    "code": "SCHEME_NOT_FOUND",
    "message": "Scheme with ID 'invalid' was not found",
    "details": null
  },
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z"
  }
}
```

### 3.3 Defensive Security & Safe Error Handling
- **CORS**: Configured for the client origin (`http://localhost:5173`, `http://localhost:3000`).
- **Request Size Limits**: `express.json({ limit: '1mb' })` protects against payload bombing.
- **Zod Validation**: Rejects invalid schemas with `422 Unprocessable Entity`.
- **Zero Stack Traces**: Internal exceptions return safe messages to avoid leaking implementation details.

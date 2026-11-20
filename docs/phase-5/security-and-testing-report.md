# GramSathi AI — Security Audit & Automated Testing Report

## 1. Security Architecture & Controls

### 1.1 UIDAI / Civic Privacy Compliance
- **Zero Aadhaar Ingestion**: Aadhaar numbers are explicitly prohibited from the database schema and JWT payloads. Only masked demonstration displays (`**** **** 8921`) are shown on client screens.
- **Sensitive Credentials Omission**: Password hashes are stored using `bcryptjs` (salt rounds: 10) and marked with `select: false` in Mongoose to prevent accidental exposure in API responses.

### 1.2 Access Control & Data Isolation
- **Role & Identity Binding**: All protected routes derive identity strictly from the cryptographically verified JWT token (`req.user.userId`).
- **Horizontal Access Control**: Citizens cannot query, read, or modify other users' bookmarks, profiles, or journey progress.

### 1.3 Transport & Header Hardening
- **Helmet**: Integrated in Express pipeline, establishing CSP, HSTS, X-Content-Type-Options, and Frameguard.
- **CORS**: Configured with strict origin validation matching `CLIENT_ORIGIN`.
- **Cookie Security**: HTTP-only, `sameSite: 'lax'`, and conditional secure flag in production.

---

## 2. Automated Test Suite (20 Endpoints — 100% Pass Rate)

An automated endpoint test suite (`server/src/test_endpoints.ts`) was executed against the running Express application.

### Test Results

| # | Test Case | HTTP Verb & Path | Expected Result | Status |
|---|---|---|---|---|
| 1 | Health Check | `GET /api/health` | HTTP 200, healthy status | **PASS** |
| 2 | Schemes Listing | `GET /api/schemes` | HTTP 200, 8 verified schemes | **PASS** |
| 3 | Scheme Details | `GET /api/schemes/saur-krushi-vahini` | HTTP 200, matching scheme ID | **PASS** |
| 4 | Scheme Not Found | `GET /api/schemes/non-existent-scheme` | HTTP 404, `SCHEME_NOT_FOUND` | **PASS** |
| 5 | Categories | `GET /api/schemes/categories` | HTTP 200, 5 categories | **PASS** |
| 6 | Departments | `GET /api/schemes/departments` | HTTP 200, 8 departments | **PASS** |
| 7 | Search | `GET /api/schemes/search?q=solar` | HTTP 200, solar scheme matches | **PASS** |
| 8 | Multi-Criteria Eligibility | `POST /api/eligibility/check` | HTTP 200, evaluated scores | **PASS** |
| 9 | Reverse Discovery | `POST /api/discovery/recommend` | HTTP 200, recommended matches | **PASS** |
| 10 | Request Validation | `POST /api/discovery/recommend` | HTTP 422, `VALIDATION_ERROR` | **PASS** |
| 11 | Citizen Registration | `POST /api/auth/register` | HTTP 201, JWT token issued, no hash | **PASS** |
| 12 | Duplicate Registration Rejection | `POST /api/auth/register` | HTTP 409, `ACCOUNT_ALREADY_EXISTS` | **PASS** |
| 13 | Citizen Login (Valid) | `POST /api/auth/login` | HTTP 200, JWT token returned | **PASS** |
| 14 | Citizen Login (Invalid) | `POST /api/auth/login` | HTTP 401, `INVALID_CREDENTIALS` | **PASS** |
| 15 | Authenticated Current User | `GET /api/auth/me` | HTTP 200, safe user profile | **PASS** |
| 16 | Missing Token Protection | `GET /api/auth/me` | HTTP 401, `AUTH_TOKEN_MISSING` | **PASS** |
| 17 | Profile Update | `PUT /api/user/profile` | HTTP 200, updated village & acres | **PASS** |
| 18 | Saved Schemes Lifecycle & Dedup | `POST/GET /api/user/saved-schemes` | HTTP 200, saved & deduplicated | **PASS** |
| 19 | Scheme Journey Tracking | `PUT/GET /api/user/journey/:schemeId` | HTTP 200, stage 3 saved | **PASS** |
| 20 | Per-User Data Isolation | Data Isolation Check | HTTP 200, User B isolated from User A | **PASS** |

**Summary**: 20/20 tests passed successfully (100% Pass Rate).

# GramSathi AI — Phase 4 Frontend-Backend Integration

## 1. Overview

Phase 4 connected the React 19 / Vite client to the Node.js / Express backend via a centralized, typed API client (`apiClient.ts`). The integration preserves all Google Stitch visual components, design aesthetics, responsive behavior, and accessibility while enabling real-time REST communication with offline resilience.

---

## 2. API Client Architecture (`client/src/services/apiClient.ts`)

### Configuration & Base URL
The client reads the environment variable `VITE_API_URL` with a sensible default:
```typescript
const BASE_URL =
  (import.meta.env?.VITE_API_URL as string) || 'http://localhost:5000/api';
```

### Safety & Resilience Guarantee
The `ApiClient` class wraps native browser `fetch` and guarantees:
1. Automatic JSON request serialization and deserialization.
2. Unified `ApiResponse<T>` return shape matching the backend contract.
3. Network error interception: if the backend server is unreachable or offline, the client does not crash or throw unhandled promise rejections; instead, it returns `{ success: false, error: { code: 'NETWORK_ERROR', message: ... } }`.
4. Downstream services (`SchemeService`, `EligibilityService`, `ReverseDiscoveryService`) catch network errors and transparently fall back to the local Phase 3 dataset so rural citizen workflows remain uninterrupted.

---

## 3. Connected Frontend Features

| Frontend Feature | Primary Component | Backend API Endpoint | Integration Method | Fallback Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Scheme Directory** | `client/src/pages/SchemesPage.tsx` | `GET /api/schemes` | `SchemeService.fetchAllAsync()` | Local Phase 3 schemes dataset |
| **Scheme Details** | `client/src/pages/SchemeDetailPage.tsx` | `GET /api/schemes/:id` | `SchemeService.fetchByIdAsync(id)` | Local scheme record by id |
| **Search Console** | `client/src/services/schemeService.ts` | `GET /api/schemes/search?q=` | `SchemeService.searchAsync(query)` | Multi-field string matching |
| **Category Browsing** | `client/src/services/schemeService.ts` | `GET /api/schemes/categories` | `apiClient.getCategories()` | `SECTORS_LIST` constant |
| **Eligibility Tool** | `client/src/pages/EligibilityCheckerPage.tsx` | `POST /api/eligibility/check` | `EligibilityService.evaluateAsync(profile)` | Local deterministic evaluator |
| **Reverse Discovery**| `client/src/pages/NeedDiscoveryPage.tsx` | `POST /api/discovery/recommend` | `ReverseDiscoveryService.matchNeedsAsync(q)` | Local keyword rule pattern matching |

---

## 4. UI States Handled

### 4.1 Loading States
- Asynchronous calls maintain internal boolean flags (`isLoading`, `isApiLoading`).
- Components render instant data from the static store while hydrating fresh data from the API in the background (stale-while-revalidate pattern), eliminating blank screens or visual layout shifts.

### 4.2 Error States
- If the REST API returns a non-200 code or a validation failure (`422`), error toasts are surfaced via `ToastContext`.
- No raw error stacks or internal database connection strings are displayed to the user.

### 4.3 Empty States
- When no schemes match search parameters, clean civic empty-state cards prompt the user to reset filters or modify their query without breaking the page layout.

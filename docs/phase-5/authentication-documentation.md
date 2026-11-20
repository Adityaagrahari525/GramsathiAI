# GramSathi AI — Authentication Architecture & API Documentation

## 1. Authentication Strategy
GramSathi AI implements standard **JWT (JSON Web Token)** bearer token authentication and secure HTTP cookies:
- **Hashing**: `bcryptjs` with salt rounds = 10 for password encryption.
- **Signing**: HMAC SHA-256 via `jsonwebtoken`, using `JWT_SECRET` with configurable expiration (default: `7d`).
- **Token Delivery**: Dual support for `Authorization: Bearer <token>` HTTP header and `token` HTTP-only cookie.
- **Payload**: Contains non-sensitive identifiers (`userId`, `role`, `phone`, `email`, `name`). Zero Aadhaar numbers.

---

## 2. Authentication Middleware
Defined in `server/src/middleware/authenticateJwt.ts`:
- **`authenticateJwt`**: Enforces valid JWT token on protected endpoints. Extracts token from `Authorization` header or HTTP-only cookie. Returns HTTP 401 with `AUTH_TOKEN_MISSING` if absent or `TOKEN_EXPIRED` if invalid. Sets `req.user`.
- **`optionalAuthenticateJwt`**: Checks token if provided, attaching `req.user` without failing the request if unauthenticated.

---

## 3. Endpoints

### 3.1 Citizen Registration
- **Route**: `POST /api/auth/register`
- **Validation**: Zod `RegisterSchema`
- **Request Body**:
  ```json
  {
    "name": "Sunil Shinde",
    "phone": "9822114455",
    "password": "SecurePassword@2026",
    "district": "Satara",
    "taluka": "Karad",
    "preferredLanguage": "mr"
  }
  ```
- **Responses**:
  - `201 Created`: Returns JWT token and sanitized `user` object without password hash.
  - `409 Conflict`: If account with the phone or email already exists.
  - `422 Unprocessable Entity`: If validation fails.

### 3.2 Citizen Login
- **Route**: `POST /api/auth/login`
- **Validation**: Zod `LoginSchema`
- **Request Body**:
  ```json
  {
    "identifier": "9822114455",
    "password": "SecurePassword@2026"
  }
  ```
- **Responses**:
  - `200 OK`: Returns JWT token, HTTP-only cookie, and `user` object.
  - `401 Unauthorized`: For incorrect credentials (`INVALID_CREDENTIALS`).
  - `404 Not Found`: If phone/email is not registered.

### 3.3 Current User Session
- **Route**: `GET /api/auth/me`
- **Protection**: JWT required
- **Response**: `200 OK` with sanitized user profile.

### 3.4 Logout
- **Route**: `POST /api/auth/logout`
- **Response**: `200 OK`, clears session cookie.

---

## 4. User Profile & Persistence Endpoints (`/api/user`)
- `GET /api/user/profile`: Returns authenticated user's profile.
- `PUT /api/user/profile`: Updates profile fields (taluka, village, landholding, etc.).
- `GET /api/user/saved-schemes`: Returns list of scheme IDs saved by the citizen.
- `POST /api/user/saved-schemes`: Saves a scheme ID (idempotent; prevents duplicate entries).
- `DELETE /api/user/saved-schemes/:schemeId`: Removes a saved scheme.
- `GET /api/user/journey/:schemeId`: Fetches 5-stage progress for a scheme.
- `PUT /api/user/journey/:schemeId`: Updates current stage, completed stages, and status.

## 5. Strict Per-User Data Isolation
All `/api/user/*` routes extract `userId` strictly from the cryptographically verified JWT payload (`req.user.userId`). Citizens cannot view or alter another citizen's saved schemes, dossiers, or journeys.

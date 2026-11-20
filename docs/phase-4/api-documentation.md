# GramSathi AI — Phase 4 REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Health & Status

### `GET /api/health`
Returns server operational health, uptime, and database operational mode.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptimeSeconds": 42,
    "environment": "development",
    "version": "1.0.0",
    "database": {
      "mode": "static_demonstration",
      "recordsLoaded": 8,
      "mongoDbConfigured": false
    },
    "timestamp": "2026-11-17T11:14:15.000Z"
  },
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "service": "gramsathi-backend"
  }
}
```

---

## 2. Schemes Endpoints

### `GET /api/schemes`
Returns a paginated and filterable list of government schemes.

**Query Parameters**:
- `sector` (string, optional): Category slug (`agriculture`, `education`, `women`, `msme`, `social`)
- `level` (string, optional): `Maharashtra` | `Central` | `Joint`
- `benefitType` (string, optional): `subsidy` | `cash` | `loan` | `scholarship` | `employment`
- `search` (string, optional): Keyword query
- `page` (number, optional): Page number (default: `1`)
- `limit` (number, optional): Schemes per page (default: `20`)

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "saur-krushi-vahini",
      "name": "Mukhyamantri Saur Krushi Vahini Yojana (Solar Agriculture Pump Scheme)",
      "nameMr": "मुख्यमंत्री सौर कृषी वाहिनी योजना (सौर कृषी पंप योजना)",
      "sector": "agriculture",
      "department": "Department of Energy & Non-Conventional Energy, Government of Maharashtra",
      "departmentShort": "Dept of Energy, Maharashtra",
      "level": "Joint",
      "benefitAmount": "90% to 95% capital subsidy",
      "benefitType": "subsidy",
      "verificationStatus": "demonstration",
      "lastVerifiedDate": "2026-11-15",
      "officialUrl": "https://www.mahaurja.com",
      "applicationSteps": [
        "Step 1: Check landholding (7/12 & 8-A)...",
        "Step 2: Verify zero existing grid connection...",
        "Step 3: Register online via solar portal...",
        "Step 4: MSEDCL Junior Engineer site survey...",
        "Step 5: Pay demand note and vendor installs pump..."
      ]
    }
  ],
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "total": 8,
    "count": 8,
    "page": 1,
    "limit": 20
  }
}
```

---

### `GET /api/schemes/:id`
Retrieves a specific scheme by ID or alias.

**Response `200 OK`** (found):
```json
{
  "success": true,
  "data": {
    "id": "saur-krushi-vahini",
    "name": "Mukhyamantri Saur Krushi Vahini Yojana...",
    "eligibility": [ ... ],
    "documents": [ ... ],
    "applicationSteps": [ ... ]
  },
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z"
  }
}
```

**Response `404 Not Found`** (invalid ID):
```json
{
  "success": false,
  "error": {
    "code": "SCHEME_NOT_FOUND",
    "message": "Scheme with ID 'unknown-id' was not found"
  },
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z"
  }
}
```

---

### `GET /api/schemes/categories`
Returns sectors and thematic categories.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "all",
      "title": "All Schemes",
      "titleMr": "सर्व योजना",
      "schemesCount": 532,
      "color": "blue"
    },
    {
      "id": "agriculture",
      "title": "Agriculture & Farmers",
      "titleMr": "कृषी व शेतकरी कल्याण",
      "schemesCount": 144,
      "color": "emerald"
    }
  ],
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "count": 5
  }
}
```

---

### `GET /api/schemes/departments`
Returns government departments with scheme count distributions.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "name": "Department of Agriculture, Government of Maharashtra",
      "departmentShort": "Agriculture Dept, Maharashtra",
      "count": 2
    }
  ],
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "count": 8
  }
}
```

---

### `GET /api/schemes/search?q=:query`
Performs keyword search across scheme titles, summaries, tags, and departments.

**Query Parameters**:
- `q` (string, required): Search query
- `limit` (number, optional): Maximum results (default: `10`)

---

## 3. Eligibility Assessment

### `POST /api/eligibility/check`
Performs deterministic multi-criteria statutory evaluation against all schemes.

**Request Body**:
```json
{
  "age": 42,
  "gender": "Male",
  "state": "Maharashtra",
  "district": "Baramati / Pune",
  "landholdingAcres": 2.5,
  "waterSource": "Open Well",
  "hasElectricPump": false,
  "socialCategory": "OBC",
  "incomeSlab": "below_250k",
  "occupation": "Farmer / Shetkari"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "totalEvaluated": 8,
    "eligibleCount": 6,
    "actionRequiredCount": 1,
    "ineligibleCount": 1,
    "topMatches": [
      {
        "scheme": { "id": "saur-krushi-vahini", "name": "Mukhyamantri Saur Krushi Vahini..." },
        "verdict": "potentially_eligible",
        "score": 100,
        "matchedCriteria": [
          "Maharashtra State Domicile Verified",
          "Gender criteria universally eligible",
          "Agricultural Landholding: 2.5 Acres registered on 7/12",
          "Assured Perennial Water Source: Open Well",
          "No existing conventional grid agricultural electricity connection"
        ],
        "missingCriteria": [],
        "recommendationReason": "Matches 100% of verified statutory criteria for your profile in Baramati / Pune.",
        "estimatedBenefit": "90% to 95% capital subsidy"
      }
    ],
    "actionRequiredMatches": []
  },
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "evaluatedCount": 8,
    "eligibleCount": 6,
    "actionRequiredCount": 1
  }
}
```

---

## 4. Reverse Scheme Discovery

### `POST /api/discovery/recommend`
Translates conversational civic needs into tailored scheme recommendations.

**Request Body**:
```json
{
  "query": "I want financial support for farming and a solar pump",
  "options": {
    "eligibleOnly": true,
    "userHolding": 2.5
  }
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "scheme": {
        "id": "saur-krushi-vahini",
        "name": "Mukhyamantri Saur Krushi Vahini Yojana (Solar Agriculture Pump Scheme)"
      },
      "matchScore": 95,
      "matchedReason": "Provides direct support for agricultural cultivation and farm operations (Key Financial Subsidy: 90% to 95% capital subsidy).",
      "relevantEligibility": "Farmer holding cultivable land with borewell/well/water source",
      "detailUrl": "/scheme/saur-krushi-vahini",
      "matchedKeywords": ["farming", "farm", "farmer", "agriculture", "pump", "solar"]
    }
  ],
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z",
    "query": "I want financial support for farming and a solar pump",
    "totalMatches": 4
  }
}
```

**Response `422 Unprocessable Entity`** (validation failure on empty query):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "path": "query",
        "message": "Need query cannot be empty",
        "code": "too_small"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-11-17T11:14:15.000Z"
  }
}
```

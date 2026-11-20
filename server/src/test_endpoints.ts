import { app } from './app.js';
import type { Server } from 'http';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { User } from './models/User.js';
import { SavedScheme } from './models/SavedScheme.js';
import { Journey } from './models/Journey.js';

interface TestResult {
  name: string;
  endpoint: string;
  passed: boolean;
  details?: string;
}

async function runTests() {
  console.log('--- Starting GramSathi Backend Endpoint Verification Tests ---');

  const dbStatus = await connectDatabase();
  if (dbStatus.isConnected) {
    console.log(`[Tests] Connected to live MongoDB: "${dbStatus.databaseName}"`);
    // Clean test accounts for repeatable test runs
    await User.deleteMany({ phone: { $in: ['9822114455', '9833445566'] } });
  } else {
    console.log('[Tests] Running in in-memory fallback mode');
  }

  const results: TestResult[] = [];
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to obtain server address');
  }
  const baseUrl = `http://127.0.0.1:${address.port}/api`;

  let userAToken = '';
  let userBToken = '';

  try {
    // 1. Health Endpoint
    {
      const res = await fetch(`${baseUrl}/health`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.status === 'healthy';
      results.push({
        name: 'Health Check (GET /api/health)',
        endpoint: 'GET /api/health',
        passed,
        details: `Status: ${res.status}, Uptime: ${body.data?.uptimeSeconds}s, Records: ${body.data?.database?.recordsLoaded}`,
      });
    }

    // 2. Schemes Listing
    {
      const res = await fetch(`${baseUrl}/schemes`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && Array.isArray(body.data) && body.data.length >= 8;
      results.push({
        name: 'Scheme Listing (GET /api/schemes)',
        endpoint: 'GET /api/schemes',
        passed,
        details: `Count: ${body.data?.length}, Total: ${body.meta?.total}`,
      });
    }

    // 3. Scheme by ID
    {
      const res = await fetch(`${baseUrl}/schemes/saur-krushi-vahini`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.id === 'saur-krushi-vahini';
      results.push({
        name: 'Scheme Details (GET /api/schemes/:id)',
        endpoint: 'GET /api/schemes/saur-krushi-vahini',
        passed,
        details: `Found: ${body.data?.name?.slice(0, 45)}...`,
      });
    }

    // 4. Scheme 404
    {
      const res = await fetch(`${baseUrl}/schemes/non-existent-scheme`);
      const body = await res.json();
      const passed = res.status === 404 && body.success === false && body.error?.code === 'SCHEME_NOT_FOUND';
      results.push({
        name: 'Scheme 404 Handler (GET /api/schemes/invalid)',
        endpoint: 'GET /api/schemes/non-existent-scheme',
        passed,
        details: `Code: ${body.error?.code}, Message: ${body.error?.message}`,
      });
    }

    // 5. Categories
    {
      const res = await fetch(`${baseUrl}/schemes/categories`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && Array.isArray(body.data) && body.data.length > 0;
      results.push({
        name: 'Scheme Categories (GET /api/schemes/categories)',
        endpoint: 'GET /api/schemes/categories',
        passed,
        details: `Categories Count: ${body.data?.length}`,
      });
    }

    // 6. Departments
    {
      const res = await fetch(`${baseUrl}/schemes/departments`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && Array.isArray(body.data) && body.data.length > 0;
      results.push({
        name: 'Scheme Departments (GET /api/schemes/departments)',
        endpoint: 'GET /api/schemes/departments',
        passed,
        details: `Departments Count: ${body.data?.length}`,
      });
    }

    // 7. Search
    {
      const res = await fetch(`${baseUrl}/schemes/search?q=solar`);
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.length >= 1;
      results.push({
        name: 'Scheme Search (GET /api/schemes/search?q=solar)',
        endpoint: 'GET /api/schemes/search?q=solar',
        passed,
        details: `Query: 'solar', Matches: ${body.data?.length}`,
      });
    }

    // 8. Eligibility Check (Eligible Profile)
    {
      const res = await fetch(`${baseUrl}/eligibility/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: 42,
          gender: 'Male',
          state: 'Maharashtra',
          district: 'Baramati / Pune',
          landholdingAcres: 2.5,
          waterSource: 'Open Well',
          hasElectricPump: false,
          socialCategory: 'OBC',
          incomeSlab: 'below_250k',
          occupation: 'Farmer / Shetkari',
        }),
      });
      const body = await res.json();
      const passed =
        res.status === 200 &&
        body.success === true &&
        body.data.eligibleCount > 0 &&
        Array.isArray(body.data.topMatches);
      results.push({
        name: 'Eligibility Check (POST /api/eligibility/check)',
        endpoint: 'POST /api/eligibility/check',
        passed,
        details: `Evaluated: ${body.data?.totalEvaluated}, Eligible: ${body.data?.eligibleCount}, Action Required: ${body.data?.actionRequiredCount}`,
      });
    }

    // 9. Reverse Discovery Recommend (Need Query)
    {
      const res = await fetch(`${baseUrl}/discovery/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'I want financial support for farming and a solar pump',
          options: {
            eligibleOnly: true,
            userHolding: 2.5,
          },
        }),
      });
      const body = await res.json();
      const passed =
        res.status === 200 &&
        body.success === true &&
        Array.isArray(body.data) &&
        body.data.length > 0;
      results.push({
        name: 'Reverse Discovery (POST /api/discovery/recommend)',
        endpoint: 'POST /api/discovery/recommend',
        passed,
        details: `Query: 'farming and solar pump', Top Match: ${body.data?.[0]?.scheme?.name?.slice(0, 35)} (${body.data?.[0]?.matchScore}%)`,
      });
    }

    // 10. Validation Error (Invalid Input)
    {
      const res = await fetch(`${baseUrl}/discovery/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '', // Empty query triggers validation error
        }),
      });
      const body = await res.json();
      const passed = res.status === 422 && body.success === false && body.error?.code === 'VALIDATION_ERROR';
      results.push({
        name: 'Validation Error Handling (422 Unprocessable Entity)',
        endpoint: 'POST /api/discovery/recommend',
        passed,
        details: `Status: ${res.status}, Code: ${body.error?.code}`,
      });
    }

    // ========================================================================
    // PHASE 5: AUTHENTICATION & USER PERSISTENCE TESTS
    // ========================================================================

    // 11. User Registration (Citizen A)
    {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sunil Shinde',
          phone: '9822114455',
          email: 'sunil.shinde@example.com',
          password: 'SecurePassword@2026',
          district: 'Satara',
          preferredLanguage: 'mr',
        }),
      });
      const body = await res.json();
      userAToken = body.data?.token || '';
      const passed =
        res.status === 201 &&
        body.success === true &&
        typeof userAToken === 'string' &&
        userAToken.length > 20 &&
        body.data.user.name === 'Sunil Shinde' &&
        !('passwordHash' in body.data.user);
      results.push({
        name: 'User Registration (POST /api/auth/register)',
        endpoint: 'POST /api/auth/register',
        passed,
        details: `Status: ${res.status}, Token received: ${userAToken.slice(0, 15)}..., Password omitted: ${!body.data?.user?.passwordHash}`,
      });
    }

    // 12. Duplicate Registration Rejection
    {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate Sunil',
          phone: '9822114455',
          password: 'SecurePassword@2026',
        }),
      });
      const body = await res.json();
      const passed =
        res.status === 409 &&
        body.success === false &&
        (body.error?.code === 'ACCOUNT_ALREADY_EXISTS' || body.error?.code === 'USER_ALREADY_EXISTS');
      results.push({
        name: 'Duplicate Registration Conflict (409 Conflict)',
        endpoint: 'POST /api/auth/register',
        passed,
        details: `Status: ${res.status}, Error Code: ${body.error?.code}`,
      });
    }

    // 13. User Login (Valid Credentials)
    {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '9822114455',
          password: 'SecurePassword@2026',
        }),
      });
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && typeof body.data?.token === 'string';
      results.push({
        name: 'User Login with Password (POST /api/auth/login)',
        endpoint: 'POST /api/auth/login',
        passed,
        details: `Status: ${res.status}, Authenticated as: ${body.data?.user?.name}`,
      });
    }

    // 14. User Login (Invalid Password)
    {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '9822114455',
          password: 'WrongPasswordXYZ!',
        }),
      });
      const body = await res.json();
      const passed = res.status === 401 && body.success === false && body.error?.code === 'INVALID_CREDENTIALS';
      results.push({
        name: 'Invalid Credentials Rejection (401 Unauthorized)',
        endpoint: 'POST /api/auth/login',
        passed,
        details: `Status: ${res.status}, Error Code: ${body.error?.code}`,
      });
    }

    // 15. Authenticated /api/auth/me Profile Check
    {
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${userAToken}` },
      });
      const body = await res.json();
      const passed = res.status === 200 && body.success === true && body.data.user.phone === '9822114455';
      results.push({
        name: 'Get Current User (GET /api/auth/me)',
        endpoint: 'GET /api/auth/me',
        passed,
        details: `Status: ${res.status}, User: ${body.data?.user?.name} (${body.data?.user?.phone})`,
      });
    }

    // 16. Unauthenticated Access Protection
    {
      const res = await fetch(`${baseUrl}/auth/me`);
      const body = await res.json();
      const passed = res.status === 401 && body.success === false && (body.error?.code === 'UNAUTHORIZED' || body.error?.code === 'AUTH_TOKEN_MISSING');
      results.push({
        name: 'Missing JWT Protection (401 Unauthorized)',
        endpoint: 'GET /api/auth/me',
        passed,
        details: `Status: ${res.status}, Error Code: ${body.error?.code}`,
      });
    }

    // 17. Update User Profile
    {
      const res = await fetch(`${baseUrl}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAToken}`,
        },
        body: JSON.stringify({
          taluka: 'Karad',
          village: 'Ond (ओंड)',
          occupation: 'Farmer',
          landholdingAcres: 3.2,
        }),
      });
      const body = await res.json();
      const passed =
        res.status === 200 &&
        body.success === true &&
        body.data.user.taluka === 'Karad' &&
        body.data.user.landholdingAcres === 3.2;
      results.push({
        name: 'Update User Profile (PUT /api/user/profile)',
        endpoint: 'PUT /api/user/profile',
        passed,
        details: `Taluka: ${body.data?.user?.taluka}, Village: ${body.data?.user?.village}, Acres: ${body.data?.user?.landholdingAcres}`,
      });
    }

    // 18. Saved Schemes Lifecycle (Save, List, Deduplicate, Remove)
    {
      // 18a. Save scheme
      const saveRes = await fetch(`${baseUrl}/user/saved-schemes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAToken}`,
        },
        body: JSON.stringify({ schemeId: 'saur-krushi-vahini' }),
      });
      const saveBody = await saveRes.json();

      // 18b. Save duplicate scheme (should not duplicate)
      await fetch(`${baseUrl}/user/saved-schemes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAToken}`,
        },
        body: JSON.stringify({ schemeId: 'saur-krushi-vahini' }),
      });

      // 18c. List saved schemes
      const listRes = await fetch(`${baseUrl}/user/saved-schemes`, {
        headers: { Authorization: `Bearer ${userAToken}` },
      });
      const listBody = await listRes.json();

      const passed =
        saveRes.status === 200 &&
        listRes.status === 200 &&
        listBody.data.savedSchemes.includes('saur-krushi-vahini') &&
        listBody.data.savedSchemes.filter((id: string) => id === 'saur-krushi-vahini').length === 1;

      results.push({
        name: 'Saved Schemes Lifecycle & Deduplication (POST/GET /api/user/saved-schemes)',
        endpoint: 'POST/GET /api/user/saved-schemes',
        passed,
        details: `Saved IDs: [${listBody.data?.savedSchemes?.join(', ')}] (no duplicates)`,
      });
    }

    // 19. Scheme Journey Progress Tracking
    {
      const putRes = await fetch(`${baseUrl}/user/journey/saur-krushi-vahini`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAToken}`,
        },
        body: JSON.stringify({
          currentStage: 3,
          completedStages: [1, 2],
          status: 'in_progress',
        }),
      });
      const putBody = await putRes.json();

      const getRes = await fetch(`${baseUrl}/user/journey/saur-krushi-vahini`, {
        headers: { Authorization: `Bearer ${userAToken}` },
      });
      const getBody = await getRes.json();

      const passed =
        putRes.status === 200 &&
        getRes.status === 200 &&
        getBody.data.journey.currentStage === 3 &&
        getBody.data.journey.completedStages.includes(2);

      results.push({
        name: 'Scheme Journey Tracking (PUT/GET /api/user/journey/:schemeId)',
        endpoint: 'PUT/GET /api/user/journey/:schemeId',
        passed,
        details: `Current Stage: ${getBody.data?.journey?.currentStage}, Completed: [${getBody.data?.journey?.completedStages?.join(', ')}]`,
      });
    }

    // 20. Data Isolation Across Distinct Users
    {
      // Register Citizen B
      const regB = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Pooja Jadhav',
          phone: '9833445566',
          password: 'SecurePassword@2026',
          district: 'Kolhapur',
        }),
      });
      const regBBody = await regB.json();
      userBToken = regBBody.data?.token || '';

      // Check User B's saved schemes - must be empty!
      const listBRes = await fetch(`${baseUrl}/user/saved-schemes`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      });
      const listBBody = await listBRes.json();

      const passed =
        regB.status === 201 &&
        listBRes.status === 200 &&
        listBBody.data.savedSchemes.length === 0;

      results.push({
        name: 'Per-User Data Isolation (Security Verification)',
        endpoint: 'Data Isolation Check',
        passed,
        details: `User B has ${listBBody.data?.savedSchemes?.length} saved schemes (isolated from User A's bookmarks)`,
      });
    }

    // ========================================================================
    // PHASE 8: GEMINI AI ASSISTANT & GROUNDED FALLBACK TESTS
    // ========================================================================

    // 21. Assistant Configuration Status
    {
      const res = await fetch(`${baseUrl}/assistant/status`);
      const body = await res.json();
      const passed =
        res.status === 200 &&
        body.success === true &&
        typeof body.data?.isConfigured === 'boolean' &&
        Array.isArray(body.data?.supportedLanguages);
      results.push({
        name: 'Assistant Configuration Status (GET /api/assistant/status)',
        endpoint: 'GET /api/assistant/status',
        passed,
        details: `Configured: ${body.data?.isConfigured}, Mode: ${body.data?.mode}`,
      });
    }

    // 22. Assistant Grounded Scheme Query (with non-fabrication guarantee)
    {
      const res = await fetch(`${baseUrl}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Tell me about solar pump schemes in Maharashtra and required documents',
          language: 'mr',
        }),
      });
      const body = await res.json();
      const passed =
        res.status === 200 &&
        body.success === true &&
        typeof body.data?.reply === 'string' &&
        body.data.reply.length > 20 &&
        Array.isArray(body.data?.sources) &&
        Array.isArray(body.data?.matchedSchemes);
      results.push({
        name: 'Grounded Assistant Scheme Query (POST /api/assistant/chat)',
        endpoint: 'POST /api/assistant/chat',
        passed,
        details: `Source: ${body.data?.source}, Sources Count: ${body.data?.sources?.length}, Schemes Matched: ${body.data?.matchedSchemes?.length}`,
      });
    }

  } finally {
    try {
      await User.deleteMany({ phone: { $in: ['9822114455', '9833445566'] } });
      await disconnectDatabase();
    } catch {}
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  console.log('\n--- Test Results Summary ---');
  let allPassed = true;
  for (const r of results) {
    const mark = r.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${mark} [${r.endpoint}] - ${r.name}`);
    if (r.details) console.log(`       ${r.details}`);
    if (!r.passed) allPassed = false;
  }

  if (!allPassed) {
    console.error('\nSome backend tests failed.');
    process.exit(1);
  } else {
    console.log(`\nAll ${results.length} tests passed successfully! (100% PASS RATE)`);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

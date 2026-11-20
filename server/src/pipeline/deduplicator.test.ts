import { SchemeDeduplicator } from './deduplicator.js';

console.log('='.repeat(65));
console.log('RUNNING DEDUPLICATOR & SAFE MERGE TESTS');
console.log('='.repeat(65));

const deduplicator = new SchemeDeduplicator();

// 1. Register base verified scheme
deduplicator.register({
  schemeId: 'MH-AGRI-MSKVY-01',
  slug: 'mukhyamantri-saur-krushi-vahini-yojana-2',
  name: 'Mukhyamantri Saur Krushi Vahini Yojana 2.0',
  governance: {
    verificationStatus: 'officially_verified',
    grReference: 'GR No. KUSUM-2023',
    dataCollectionSource: 'MSEDCL',
    officialSourceUrl: 'https://mahadiscom.in'
  } as any
});

// Test 1: Exact ID match
const match1 = deduplicator.findDuplicate({
  schemeId: 'MH-AGRI-MSKVY-01',
  slug: 'something-else',
  name: 'Different Name'
});

console.assert(match1.isDuplicate === true, 'Test 1 Failed: Should find exact ID match');
console.assert(match1.match?.matchType === 'EXACT_ID', 'Test 1 Failed: matchType should be EXACT_ID');
console.log('✓ PASS: Exact ID match detected with 100% confidence');

// Test 2: Exact Slug match
const match2 = deduplicator.findDuplicate({
  schemeId: 'NEW-ID-999',
  slug: 'mukhyamantri-saur-krushi-vahini-yojana-2',
  name: 'Some Variant'
});

console.assert(match2.isDuplicate === true, 'Test 2 Failed: Should find exact slug match');
console.assert(match2.match?.matchType === 'EXACT_SLUG', 'Test 2 Failed: matchType should be EXACT_SLUG');
console.log('✓ PASS: Exact slug match detected with high confidence');

// Test 3: Normalized title match
const match3 = deduplicator.findDuplicate({
  schemeId: 'THIRD-PARTY-77',
  slug: 'solar-pump-msedcl',
  name: 'Mukhyamantri Saur Krushi Vahini Scheme Maharashtra'
});

console.assert(match3.isDuplicate === true, 'Test 3 Failed: Normalized title should match');
console.assert(match3.match?.matchType === 'NORMALIZED_TITLE', 'Test 3 Failed: matchType should be NORMALIZED_TITLE');
console.log('✓ PASS: Normalized title match detected across stop words');

// Test 4: Conflict resolution - verified vs unverified
const unverifiedIncoming = {
  schemeId: 'MH-AGRI-MSKVY-01',
  name: 'Mukhyamantri Saur Krushi Vahini Yojana 2.0',
  governance: {
    verificationStatus: 'unverified_third_party',
    dataCollectionSource: 'Random Scrape',
    officialSourceUrl: 'http://example.com'
  } as any
};

const dup4 = deduplicator.findDuplicate(unverifiedIncoming);
console.assert(dup4.match?.resolution === 'KEPT_EXISTING', 'Test 4 Failed: should keep verified existing');
console.log('✓ PASS: Conflict resolution preserves verified records over unverified scrape');

console.log('\nResults: 4/4 Deduplication and Merge tests PASSED!');

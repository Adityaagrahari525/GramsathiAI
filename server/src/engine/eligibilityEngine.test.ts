import { EligibilityEngine, CitizenProfile } from './eligibilityEngine.js';
import { IScheme } from '../models/Scheme.js';

// Mock verified Maharashtra Scheme for testing
const mockSolarPumpScheme: Pick<IScheme, 'schemeId' | 'name' | 'state' | 'eligibility'> = {
  schemeId: 'saur-krushi-vahini',
  name: 'Mukhyamantri Saur Krushi Vahini Yojana 2.0',
  state: 'Maharashtra',
  eligibility: {
    rawText: 'Farmer residing in Maharashtra with assured water source and land up to 5 acres.',
    structured: {
      ageMin: 18,
      ageMax: 75,
      gender: 'all',
      caste: ['General', 'OBC', 'SC', 'ST', 'VJNT', 'SEBC'],
      incomeMax: null, // No strict income ceiling
      residence: 'rural',
      states: ['Maharashtra'],
      disabilityRequired: null,
      bplRequired: null,
      landholdingMaxAcres: 5.0,
      otherConditions: ['Must have perennial water source on 7/12'],
    },
    exclusions: ['Farmers who previously received solar subsidies under MMGSY'],
  },
};

const mockWomenScheme: Pick<IScheme, 'schemeId' | 'name' | 'state' | 'eligibility'> = {
  schemeId: 'ladki-bahin',
  name: 'Mukhyamantri Majhi Ladki Bahin Yojana',
  state: 'Maharashtra',
  eligibility: {
    rawText: 'Women aged 21-65 resident of Maharashtra with annual income <= 250000.',
    structured: {
      ageMin: 21,
      ageMax: 65,
      gender: 'female',
      caste: null,
      incomeMax: 250000,
      residence: null,
      states: ['Maharashtra'],
      disabilityRequired: null,
      bplRequired: null,
      landholdingMaxAcres: null,
      otherConditions: ['Aadhaar linked bank account'],
    },
    exclusions: ['Income tax payers in family'],
  },
};

function runTests() {
  console.log('================================================================');
  console.log('RUNNING GRAMSATHI AI DETERMINISTIC ELIGIBILITY ENGINE TESTS');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(testName: string, condition: boolean, details?: string) {
    totalTests++;
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`✗ FAIL: ${testName}`);
      if (details) console.error(`  Details: ${details}`);
    }
  }

  // TEST 1: Potentially Eligible (Farmer meets all verified criteria)
  {
    const profile: CitizenProfile = {
      age: 42,
      gender: 'male',
      caste: 'OBC',
      state: 'Maharashtra',
      residence: 'rural',
      agriculturalLandholdingAcres: 2.5,
      hasWaterSource: true,
    };

    const res = EligibilityEngine.evaluate(mockSolarPumpScheme, profile);
    assert(
      'Farmer with 2.5 acres in rural Maharashtra is potentially eligible',
      res.status === 'potentially_eligible' && res.confidenceScore === 1.0,
      `Expected 'potentially_eligible', got '${res.status}' (Confidence: ${res.confidenceScore})`
    );
  }

  // TEST 2: Ineligible (Age outside criteria)
  {
    const profile: CitizenProfile = {
      age: 16, // Under 18
      gender: 'male',
      caste: 'General',
      state: 'Maharashtra',
      residence: 'rural',
      agriculturalLandholdingAcres: 2.0,
    };

    const res = EligibilityEngine.evaluate(mockSolarPumpScheme, profile);
    assert(
      'Underage applicant (16 yrs) does not match criteria',
      res.status === 'does_not_match' && res.failedCriteria.some((c) => c.field === 'age'),
      `Expected 'does_not_match', got '${res.status}'`
    );
  }

  // TEST 3: Ineligible (Gender restriction)
  {
    const profile: CitizenProfile = {
      age: 30,
      gender: 'male', // Ladki Bahin is female-only
      state: 'Maharashtra',
      annualFamilyIncome: 150000,
    };

    const res = EligibilityEngine.evaluate(mockWomenScheme, profile);
    assert(
      'Male applicant fails women-only scheme',
      res.status === 'does_not_match' && res.failedCriteria.some((c) => c.field === 'gender'),
      `Expected 'does_not_match', got '${res.status}'`
    );
  }

  // TEST 4: Ineligible (Income exceeds ceiling)
  {
    const profile: CitizenProfile = {
      age: 32,
      gender: 'female',
      state: 'Maharashtra',
      annualFamilyIncome: 450000, // Ceiling is 250000
    };

    const res = EligibilityEngine.evaluate(mockWomenScheme, profile);
    assert(
      'Income of ₹4.5L fails ₹2.5L income ceiling',
      res.status === 'does_not_match' && res.failedCriteria.some((c) => c.field === 'income'),
      `Expected 'does_not_match', got '${res.status}'`
    );
  }

  // TEST 5: More Information Required (Missing citizen income)
  // Missing data MUST NOT automatically fail eligibility!
  {
    const profile: CitizenProfile = {
      age: 28,
      gender: 'female',
      state: 'Maharashtra',
      annualFamilyIncome: null, // Not yet declared by citizen
    };

    const res = EligibilityEngine.evaluate(mockWomenScheme, profile);
    assert(
      'Undeclared income returns more_info_required (not failure)',
      res.status === 'more_info_required' &&
        res.missingCriteria.some((c) => c.field === 'income') &&
        res.failedCriteria.length === 0,
      `Expected 'more_info_required', got '${res.status}'`
    );
  }

  // TEST 6: Ineligible (State mismatch)
  {
    const profile: CitizenProfile = {
      age: 40,
      gender: 'female',
      state: 'Karnataka', // Outside Maharashtra
      annualFamilyIncome: 120000,
    };

    const res = EligibilityEngine.evaluate(mockWomenScheme, profile);
    assert(
      'Non-Maharashtra resident fails state criteria',
      res.status === 'does_not_match' && res.failedCriteria.some((c) => c.field === 'state'),
      `Expected 'does_not_match', got '${res.status}'`
    );
  }

  console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
  if (passedTests === totalTests) {
    console.log('✓ All deterministic rule evaluation tests PASSED successfully!\n');
  } else {
    process.exit(1);
  }
}

runTests();

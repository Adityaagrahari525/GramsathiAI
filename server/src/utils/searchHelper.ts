/**
 * searchHelper.ts — Server-side Multilingual & Intent-Aware Keyword Search
 */

export interface KeywordSynonymMapping {
  concepts: string[];
  sectors: string[];
  categories: string[];
  tags: string[];
}

export const CIVIC_CONCEPT_MAP: KeywordSynonymMapping[] = [
  // 1. Agriculture / Farming / Farmer
  {
    concepts: [
      'farmer', 'farmers', 'farming', 'farm', 'agriculture', 'agricultural', 'krishi', 'krushi',
      'shetkari', 'shet', 'sheti', 'kisan', 'kisaan', 'annadata', 'fashal', 'crop', 'pik', 'biyane',
      'pharming', 'farmar', 'farmars',
      'शेतकरी', 'शेतकऱ्यांसाठी', 'शेती', 'कृषी', 'शेतजमीन', 'किसान', 'फसल', 'पीक', 'बियाणे', 'खते',
      'फाउंड', 'स्कीम्स', 'फॉर', 'फार्मर्स', 'फार्मर', 'स्कीम'
    ],
    sectors: ['agriculture'],
    categories: ['Farmer', 'Small / Marginal Farmer', 'All Citizens'],
    tags: ['solar', 'drip', 'subsidy', 'crop insurance', 'tractor', 'pm-kisan', 'pik vima', 'farm equipment']
  },

  // 2. Solar Pump / Irrigation / Water / Well
  {
    concepts: [
      'pump', 'solar', 'kusum', 'solar pump', 'irrigation', 'water', 'well', 'borewell', 'drip', 'sprinkler',
      'paani', 'sinchan', 'thibak', 'tushar', 'vahir', 'vihir', 'solarpump', 'motor',
      'सौर', 'सौर कृषी', 'सौर पंप', 'पंप', 'सिंचन', 'ठिबक', 'तुषार', 'विहीर', 'पाणी', 'कुसुम'
    ],
    sectors: ['agriculture', 'energy'],
    categories: ['Farmer', 'Small / Marginal Farmer'],
    tags: ['solar', 'irrigation', 'drip', 'pump', 'water']
  },

  // 3. Women Empowerment / Ladki Bahin / SHG
  {
    concepts: [
      'women', 'woman', 'female', 'girl', 'girls', 'mother', 'sister', 'ladki', 'bahin', 'ladkibahin',
      'shg', 'bachat', 'gat', 'mahila', 'yuvati', 'widow', 'vidhava', 'suhasini', 'maternity',
      'महिला', 'स्त्री', 'मुलगी', 'लाडकी', 'बहीण', 'लाडकी बहीण', 'बचत गट', 'विधवा', 'माता'
    ],
    sectors: ['women', 'social'],
    categories: ['Women', 'Self-Help Groups (SHG)', 'Female Entrepreneur'],
    tags: ['ladki bahin', 'monthly assistance', 'shg loan', 'women entrepreneur']
  },

  // 4. Students / Education / Scholarship / Youth
  {
    concepts: [
      'student', 'students', 'education', 'scholarship', 'school', 'college', 'exam', 'fees', 'hostel',
      'degree', 'post-matric', 'youth', 'tarun', 'tarunya', 'vidyarthi', 'shikshan', 'shishyavrutti',
      'विद्यार्थी', 'शिक्षण', 'शिष्यवृत्ती', 'शाळा', 'महाविद्यालय', 'वसतिगृह', 'तरुण', 'युवक'
    ],
    sectors: ['education', 'employment'],
    categories: ['Students', 'Youth / Unemployed', 'OBC / VJNT / SBC Students', 'SC / ST Students'],
    tags: ['scholarship', 'freeship', 'hostel allowance', 'swadhar', 'mahadbt']
  },

  // 5. Business / Entrepreneurship / Loan / Mudra / MSME
  {
    concepts: [
      'business', 'startup', 'shop', 'loan', 'mudra', 'finance', 'subsidy', 'karj', 'vyavasay',
      'udhyog', 'udyam', 'self-employed', 'artisan', 'dukan', 'dukaan', 'pme GP', 'pmegp', 'cme GP',
      'व्यवसाय', 'उद्योग', 'कर्ज', 'मुद्रा', 'दुकान', 'आर्थिक सहाय्य', 'स्टार्टअप', 'लघुउद्योग'
    ],
    sectors: ['msme', 'employment'],
    categories: ['Micro Entrepreneur / Self-Employed', 'Artisans / Rural Craftsmen', 'Youth / Unemployed'],
    tags: ['loan subsidy', 'mudra', 'pmegp', 'interest subvention', 'working capital']
  },

  // 6. Housing / PMAY / Gharkul
  {
    concepts: [
      'house', 'home', 'housing', 'gharkul', 'pmay', 'awaas', 'awas', 'shelter', 'chhat',
      'घर', 'घरकूल', 'आवास', 'पीएम आवास', 'निवारा', 'घरकुल'
    ],
    sectors: ['housing', 'rural_dev', 'social'],
    categories: ['All Citizens', 'BPL / Economically Weaker Sections', 'Rural Poor'],
    tags: ['pmay', 'ramai gharkul', 'shabari gharkul', 'pucca house']
  },

  // 7. Pension / Elderly / Senior Citizen / Divyang / Disability
  {
    concepts: [
      'pension', 'elderly', 'old', 'old age', 'senior citizen', 'vridha', 'divyang', 'handicap',
      'disability', 'sanjay gandhi', 'shravanbal', 'niradhar', 'apang',
      'पेन्शन', 'निवृत्तीवेतन', 'वृद्ध', 'ज्येष्ठ नागरिक', 'दिव्यांग', 'अपंग', 'संजय गांधी निराधार', 'श्रावणबाळ'
    ],
    sectors: ['social', 'pension'],
    categories: ['Senior Citizens', 'Persons with Disabilities (PwD)', 'Destitute / Niradhar'],
    tags: ['pension', 'sanjay gandhi', 'shravanbal', 'monthly pension']
  }
];

export function extractQueryTokens(query: string): string[] {
  if (!query) return [];
  return query
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'।]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

export function matchIntentFromQuery(query: string): {
  matchedSectors: string[];
  matchedCategories: string[];
  matchedTags: string[];
  matchedConcepts: string[];
  isMatchFound: boolean;
} {
  const tokens = extractQueryTokens(query);
  const matchedSectors = new Set<string>();
  const matchedCategories = new Set<string>();
  const matchedTags = new Set<string>();
  const matchedConcepts = new Set<string>();

  const fullQueryLower = query.toLowerCase();

  for (const entry of CIVIC_CONCEPT_MAP) {
    let conceptHit = false;

    for (const concept of entry.concepts) {
      if (
        fullQueryLower.includes(concept) ||
        tokens.some((token) => token === concept || token.startsWith(concept) || concept.startsWith(token) && token.length >= 3)
      ) {
        conceptHit = true;
        matchedConcepts.add(concept);
      }
    }

    if (conceptHit) {
      entry.sectors.forEach((s) => matchedSectors.add(s));
      entry.categories.forEach((c) => matchedCategories.add(c));
      entry.tags.forEach((t) => matchedTags.add(t));
    }
  }

  return {
    matchedSectors: Array.from(matchedSectors),
    matchedCategories: Array.from(matchedCategories),
    matchedTags: Array.from(matchedTags),
    matchedConcepts: Array.from(matchedConcepts),
    isMatchFound: matchedSectors.size > 0 || matchedCategories.size > 0
  };
}

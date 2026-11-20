export interface Scheme {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  sector: string;
  sectorMr: string;
  department: string;
  departmentShort: string;
  level: 'Maharashtra' | 'Central' | 'Joint';
  benefitAmount: string;
  benefits?: string;
  benefitType: 'cash' | 'subsidy' | 'loan' | 'scholarship' | 'employment';
  accentColor: 'emerald' | 'blue' | 'amber' | 'indigo';
  headerBadges: Array<{ text: string; variant: 'green' | 'blue' | 'amber' | 'gray' }>;
  highlightTitle: string;
  highlightText: string;
  highlightVariant: 'green' | 'blue' | 'amber' | 'purple';
  targetBeneficiaryText: string;
  mandatoryDocs: string[];
  bottomMeta: {
    icon: 'mode' | 'beneficiaries' | 'deadline' | 'location';
    text: string;
  };
  summary: string;
  description?: string;
  eligibility: string[];
  documents: string[];
  applicationSteps?: string[];
  officialUrl: string;
  sourceUrl?: string;
  tags: string[];
  targetBeneficiaries: string[];
  verified: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'demonstration';
  applicationMode: string;
  lastUpdated: string;
  lastVerifiedDate?: string;
  schemeNo?: string;
}

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'saur-krushi-vahini',
    name: 'Mukhyamantri Saur Krushi Vahini Yojana (Solar Agriculture Pump Scheme)',
    nameMr: 'मुख्यमंत्री सौर कृषी वाहिनी योजना (सौर कृषी पंप योजना)',
    nameHi: 'मुख्यमंत्री सौर कृषि वाहिनी योजना',
    sector: 'agriculture',
    sectorMr: 'कृषी व शेतकरी',
    department: 'Department of Energy & Non-Conventional Energy, Government of Maharashtra (MSEDCL/MEDA)',
    departmentShort: 'Dept of Energy, Maharashtra',
    level: 'Joint',
    benefitAmount: '90% to 95% capital subsidy',
    benefitType: 'subsidy',
    accentColor: 'emerald',
    headerBadges: [
      { text: '✓ Maharashtra State + Central (PM-KUSUM)', variant: 'green' },
      { text: 'Component B: Solar Agriculture Pumps', variant: 'gray' },
      { text: '📅 Open for FY 2024-25', variant: 'blue' }
    ],
    highlightTitle: 'Key Financial Subsidy:',
    highlightText: '90% to 95% capital subsidy for 3 HP, 5 HP, and 7.5 HP off-grid solar agriculture pump sets. General farmers pay only 10% cost; SC/ST farmers contribute only 5% of beneficiary share.',
    highlightVariant: 'green',
    targetBeneficiaryText: 'Farmers holding agricultural land with assured irrigation water source, without conventional electrified agriculture pump.',
    mandatoryDocs: ['7/12 Extract (सातबारा)', '8-A Extract (८-अ)', 'Aadhaar Card', 'Bank Passbook'],
    bottomMeta: {
      icon: 'mode',
      text: 'Mode: Paperless online via MahaDBT/Mahaurja Portal'
    },
    summary: 'Subsidized 3 HP, 5 HP, and 7.5 HP off-grid solar agriculture pumps for farmers without grid electricity connection, guaranteeing daytime irrigation.',
    description: 'Subsidized 3 HP, 5 HP, and 7.5 HP off-grid solar agriculture pumps for farmers without grid electricity connection, guaranteeing daytime irrigation.',
    benefits: '90% to 95% capital subsidy for 3 HP, 5 HP, and 7.5 HP off-grid solar agriculture pump sets. General farmers pay 10%; SC/ST pay 5%.',
    eligibility: [
      'Farmer holding cultivable land with borewell/well/water source',
      'Plot must not have an existing commercial or MSEDCL electric agricultural connection',
      'SC/ST farmers get 95% subsidy; General category gets 90% subsidy',
      'Valid Aadhaar linked to bank account and active land title'
    ],
    documents: ['7/12 & 8-A Extract with water source stamp', 'Aadhaar Card', 'Caste Certificate (for SC/ST 95% rate)', 'Bank Passbook'],
    applicationSteps: [
      'Step 1: Check landholding (7/12 & 8-A) and ensure assured water source on plot.',
      'Step 2: Verify zero existing grid agricultural power connection.',
      'Step 3: Register and apply online via Mahavitaran / Mahaurja solar portal.',
      'Step 4: MSEDCL Junior Engineer conducts physical site survey & GPS geo-tagging.',
      'Step 5: Pay demand note (5%-10% farmer share) and empanelled vendor installs solar pump within 60 days.'
    ],
    officialUrl: 'https://www.mahaurja.com',
    sourceUrl: 'https://www.mahadiscom.in/solar_MSKVY/index_mr.html',
    tags: ['PM-KUSUM Solar Pump', 'Solar Pump', 'Agriculture', 'Irrigation', 'Subsidy'],
    targetBeneficiaries: ['Small & Marginal Farmers', 'SC/ST Farmers', 'Individual Landholders'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Online via MahaDBT / Mahaurja Portal',
    lastUpdated: 'Nov 2026',
    lastVerifiedDate: '2026-11-15',
    schemeNo: 'MSKVY-2024'
  },
  {
    id: 'ladki-bahin',
    name: 'Mukhyamantri Majhi Ladki Bahin Yojana (मुख्यमंत्री माझी लाडकी बहीण योजना)',
    nameMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    nameHi: 'मुख्यमंत्री माझी लाड़की बहिन योजना',
    sector: 'women',
    sectorMr: 'महिला सक्षमीकरण',
    department: 'Department of Women and Child Development, Government of Maharashtra',
    departmentShort: 'WCD Dept, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: '₹1,500 / Month (₹18,000 / Year)',
    benefitType: 'cash',
    accentColor: 'blue',
    headerBadges: [
      { text: '★ Flagship State Welfare Scheme', variant: 'amber' },
      { text: '₹1,500/Month Direct DBT Cash', variant: 'green' },
      { text: 'Nari Shakti Doot App', variant: 'gray' }
    ],
    highlightTitle: 'Monthly DBT Support:',
    highlightText: 'Direct financial aid of ₹1,500 every calendar month directly transferred into the beneficiary woman\'s Aadhaar-seeded active bank account.',
    highlightVariant: 'blue',
    targetBeneficiaryText: 'Resident women aged 21 to 65 years, with annual combined household family income not exceeding ₹2,50,000/-. Yellow/Orange ration card holders eligible without separate income certificate.',
    mandatoryDocs: ['Aadhaar Card', 'Ration Card (Yellow/Orange)', 'Maharashtra Domicile', 'Bank Passbook (DBT Active)'],
    bottomMeta: {
      icon: 'beneficiaries',
      text: 'Direct Beneficiary: 2.1 Crore Women Enrolled'
    },
    summary: 'Direct monthly financial assistance of ₹1,500 to women aged 21-65 in Maharashtra from families earning under ₹2.5 Lakh annually.',
    description: 'Direct monthly financial assistance of ₹1,500 to women aged 21-65 in Maharashtra from families earning under ₹2.5 Lakh annually.',
    benefits: 'Direct financial aid of ₹1,500 every calendar month directly transferred into Aadhaar-seeded active bank account (₹18,000/year).',
    eligibility: [
      'Resident woman of Maharashtra aged 21 to 65 years',
      'Combined family annual income below ₹2.5 Lakh (or possess Yellow/Orange ration card)',
      'Bank account must be seeded and authenticated with Aadhaar for DBT',
      'Family must not have a sitting MP/MLA or income-tax paying member'
    ],
    documents: ['Aadhaar Card', 'Yellow or Orange Ration Card / Income Certificate', 'Domicile Certificate / 15-year Ration Card', 'Aadhaar-seeded Bank Passbook'],
    applicationSteps: [
      'Step 1: Download Nari Shakti Doot App or visit nearest Anganwadi / Setu Kendra.',
      'Step 2: Enter Aadhaar details and complete OTP biometric authentication.',
      'Step 3: Upload Yellow/Orange Ration Card or Tehsildar income certificate (< ₹2.5 Lakh).',
      'Step 4: Submit Aadhaar-seeded bank account details for Direct Benefit Transfer.',
      'Step 5: Ward/Panchayat committee scrutiny and instant DBT monthly payout.'
    ],
    officialUrl: 'https://ladakibahin.maharashtra.gov.in',
    sourceUrl: 'https://ladakibahin.maharashtra.gov.in',
    tags: ['★ Majhi Ladki Bahin', 'Ladki Bahin', 'Women Empowerment', 'DBT Cash', 'Direct Benefit'],
    targetBeneficiaries: ['Women (21–65 yrs)', 'Rural Women', 'BPL Families', 'Self-employed Women'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Online via Nari Shakti Doot App / Anganwadi / Setu Kendra',
    lastUpdated: 'Nov 2026',
    lastVerifiedDate: '2026-11-15',
    schemeNo: 'MMLBY-2024'
  },
  {
    id: 'ebc-scholarship',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC Scholarship)',
    nameMr: 'राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना (EBC)',
    nameHi: 'राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना',
    sector: 'education',
    sectorMr: 'शिक्षण व शिष्यवृत्ती',
    department: 'Directorate of Higher Education (DHE) & Technical Education (DTE), Maharashtra',
    departmentShort: 'Higher & Tech Education, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: '50% to 100% Tuition Fee Waiver',
    benefitType: 'scholarship',
    accentColor: 'blue',
    headerBadges: [
      { text: '🎓 Higher & Technical Education', variant: 'blue' },
      { text: 'MahaDBT Integrated Portal', variant: 'gray' },
      { text: '100% Tuition Fee Reimbursement', variant: 'green' }
    ],
    highlightTitle: 'Key Financial Benefit:',
    highlightText: '50% tuition and examination fee waiver for Economically Backward Class (EBC) students admitted through CAP in engineering, medical, MBA, diploma, and degree institutions across Maharashtra.',
    highlightVariant: 'purple',
    targetBeneficiaryText: 'Students whose total annual family income is up to ₹8.00 Lakh admitted through centralized admission process (CAP) in approved government/aided/unaided colleges.',
    mandatoryDocs: ['Tehsildar Income Certificate', 'CAP Seat Allotment Letter', 'Maharashtra Domicile', 'Previous Marksheet'],
    bottomMeta: {
      icon: 'deadline',
      text: 'Application Deadline: 31st March 2025'
    },
    summary: 'Full/partial reimbursement of tuition and examination fees for EBC and Open category students admitted through merit-based CAP in Maharashtra colleges.',
    description: 'Full/partial reimbursement of tuition and examination fees for EBC and Open category students admitted through merit-based CAP in Maharashtra colleges.',
    benefits: '50% to 100% tuition and examination fee waiver for EBC students whose family income is up to ₹8.00 Lakh.',
    eligibility: [
      'Domicile of Maharashtra and belonging to General / Open or EBC category',
      'Admitted through CAP round into recognized professional or non-professional degree/diploma',
      'Annual family income within ₹8,00,000 threshold (certified by Tehsildar)',
      'Minimum 75% attendance in previous semester/year'
    ],
    documents: ['Income Certificate (under ₹8L)', 'CAP Allotment Letter', 'Domicile Certificate', 'Fee Receipt & College Bonafide'],
    applicationSteps: [
      'Step 1: Obtain Tehsildar Income Certificate (< ₹8.00 Lakh) and Maharashtra Domicile.',
      'Step 2: Log in to MahaDBT portal (Post-Matric Scholarship section).',
      'Step 3: Select Directorate of Higher/Technical Education scheme and input CAP allotment ID.',
      'Step 4: Upload fee receipt, marksheet, and college bonafide certificate.',
      'Step 5: College desk verification followed by direct DBT credit to student/college account.'
    ],
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    sourceUrl: 'https://mahadbt.maharashtra.gov.in',
    tags: ['EBC Scholarship', 'MahaDBT Post-Matric', 'Education', 'Scholarship', 'Students'],
    targetBeneficiaries: ['Students & Youth (18-35)', 'Open / General Students', 'EBC Students'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Online via MahaDBT Portal (Post-Matric Section)',
    lastUpdated: 'Oct 2026',
    lastVerifiedDate: '2026-10-28',
    schemeNo: 'RCSM-EBC-24'
  },
  {
    id: 'cmegp-msme',
    name: 'Chief Minister Employment Generation Programme (CMEGP Maharashtra)',
    nameMr: 'मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP महाराष्ट्र)',
    nameHi: 'मुख्यमंत्री रोजगार सृजन कार्यक्रम',
    sector: 'msme',
    sectorMr: 'ग्रामीण उद्योग',
    department: 'Industries, Energy & Labour Department, Government of Maharashtra',
    departmentShort: 'Industries Dept, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: 'Up to ₹50 Lakh (15% to 35% Govt Subsidy)',
    benefitType: 'loan',
    accentColor: 'amber',
    headerBadges: [
      { text: 'Rural MSME & Self-Employment', variant: 'amber' },
      { text: 'Up to ₹50 Lakh Project Cost', variant: 'blue' },
      { text: '35% Govt Margin Subsidy', variant: 'green' }
    ],
    highlightTitle: 'Credit-linked Capital Subsidy:',
    highlightText: '15% to 35% margin money assistance on project investments up to ₹50 Lakh for manufacturing and ₹10 Lakh for service units. Special priority for rural youth and women entrepreneurs.',
    highlightVariant: 'amber',
    targetBeneficiaryText: 'Unemployed youth aged 18 to 45 years resident in Maharashtra, minimum 7th/10th standard qualification based on project size.',
    mandatoryDocs: ['Detailed Project Report (DPR)', 'Aadhaar Card', 'Educational Certificate', 'Domicile Certificate'],
    bottomMeta: {
      icon: 'mode',
      text: 'Mode: Online via maha-cmegp.gov.in'
    },
    summary: 'Financial support and margin money subsidy for unemployed rural and urban youth setting up new manufacturing or service micro-enterprises in Maharashtra.',
    description: 'Financial support and margin money subsidy for unemployed rural and urban youth setting up new manufacturing or service micro-enterprises in Maharashtra.',
    benefits: '15% to 35% margin money government subsidy on project investments up to ₹50 Lakh for manufacturing and ₹10 Lakh for service units.',
    eligibility: [
      'Age between 18 and 45 years (relaxation up to 50 years for SC/ST/Women/Divyang)',
      'Minimum educational qualification 7th pass for projects above ₹10L; 10th pass for above ₹25L',
      'New business enterprise in manufacturing or service sector',
      'No loan default in any commercial or cooperative bank'
    ],
    documents: ['Detailed Project Report (DPR)', 'Aadhaar & PAN Card', '7th/10th/12th Passing Certificate', 'Maharashtra Domicile Certificate'],
    applicationSteps: [
      'Step 1: Prepare Detailed Project Report (DPR) and business investment breakdown.',
      'Step 2: Register on maha-cmegp.gov.in and submit Aadhaar, educational & domicile certificates.',
      'Step 3: District Task Force Committee (DTFC) reviews and forwards dossier to nominated bank.',
      'Step 4: Bank sanctions term loan and working capital with subsidized margin release.',
      'Step 5: Mandatory EDP entrepreneurship training and fund disbursement.'
    ],
    officialUrl: 'https://maha-cmegp.gov.in',
    sourceUrl: 'https://maha-cmegp.gov.in',
    tags: ['CMEGP', 'Rural MSME', 'Startup Loan', 'Self-Employment', 'Subsidy'],
    targetBeneficiaries: ['Students & Youth (18-35)', 'Rural Artisans / Traditional Labor', 'Women Entrepreneurs'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Online via maha-cmegp.gov.in',
    lastUpdated: 'Nov 2026',
    lastVerifiedDate: '2026-11-10',
    schemeNo: 'CMEGP-2024'
  },
  {
    id: 'pm-kisan',
    name: 'PM KISAN Samman Nidhi (19th Tranche)',
    nameMr: 'पीएम किसान सन्मान निधी (१९ वा हप्ता)',
    nameHi: 'पीएम किसान सम्मान निधि',
    sector: 'agriculture',
    sectorMr: 'कृषी व शेतकरी',
    department: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    departmentShort: 'Ministry of Agriculture, GoI',
    level: 'Central',
    benefitAmount: '₹6,000 / Year (3 Tranches of ₹2,000)',
    benefits: '₹6,000 per year transferred directly to Aadhaar-seeded bank accounts in three four-monthly installments of ₹2,000 each.',
    benefitType: 'cash',
    accentColor: 'emerald',
    headerBadges: [
      { text: '🏛 Central Govt (100% Funded)', variant: 'blue' },
      { text: '₹6,000 / Year Direct DBT', variant: 'green' },
      { text: 'e-KYC Mandatory', variant: 'amber' }
    ],
    highlightTitle: 'Direct DBT Income Support:',
    highlightText: '₹6,000 per year transferred directly to Aadhaar-seeded bank accounts of small and marginal farmer families in three four-monthly installments of ₹2,000 each.',
    highlightVariant: 'green',
    targetBeneficiaryText: 'All landholding eligible farmer families having cultivable landholding in their names across rural Maharashtra.',
    mandatoryDocs: ['7/12 Land Record Extract', 'Aadhaar Card', 'Bank Passbook (Aadhaar Seeded)', 'e-KYC Biometric Verification'],
    bottomMeta: {
      icon: 'beneficiaries',
      text: 'Direct Beneficiary: 85+ Lakh Maharashtra Farmers'
    },
    summary: 'Central income support of ₹6,000 per year in three installments directly credited to farmer bank accounts under PM-KISAN scheme.',
    description: 'Central income support of ₹6,000 per year in three installments directly credited to farmer bank accounts under PM-KISAN scheme.',
    eligibility: [
      'Farmer family holding cultivable agricultural land registered in Maharashtra Bhulekh 7/12',
      'e-KYC completed via OTP or biometric CSC verification',
      'Active bank account linked with NPCI Aadhaar payment bridge',
      'No institutional landholders or income-tax payers in household'
    ],
    documents: ['7/12 & 8-A Extract', 'Aadhaar Card', 'Bank Passbook', 'Land Title Document'],
    applicationSteps: [
      'Step 1: Register on pmkisan.gov.in portal or through local CSC VLE operator.',
      'Step 2: Enter Aadhaar number, state (Maharashtra), district, taluka, and village.',
      'Step 3: Input 7/12 land record Khata and survey number details.',
      'Step 4: Complete biometric/OTP e-KYC authentication.',
      'Step 5: State agriculture department approval and quarterly direct DBT disbursement.'
    ],
    officialUrl: 'https://pmkisan.gov.in',
    sourceUrl: 'https://pmkisan.gov.in',
    tags: ['PM-KISAN', 'Farmers', 'DBT', 'Income Support'],
    targetBeneficiaries: ['Small & Marginal Farmer', 'Landholding Farmers'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Online via pmkisan.gov.in / CSC VLE Center',
    lastUpdated: 'Nov 2026',
    lastVerifiedDate: '2026-11-12',
    schemeNo: 'PMKISAN-19'
  },
  {
    id: 'tractor-subsidy',
    name: 'MahaDBT Agricultural Mechanization (Tractor Subsidy)',
    nameMr: 'महाडीबीटी कृषी यांत्रिकीकरण (ट्रॅक्टर अनुदान)',
    nameHi: 'महाडीबीटी कृषि यंत्रीकरण ट्रैक्टर सब्सिडी',
    sector: 'agriculture',
    sectorMr: 'कृषी व शेतकरी',
    department: 'Department of Agriculture, Government of Maharashtra',
    departmentShort: 'Agriculture Dept, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: 'Up to ₹1,25,000 or 50% Subsidy',
    benefits: '50% capital subsidy (up to ₹1,25,000) for purchase of new tractors and farm machinery.',
    benefitType: 'subsidy',
    accentColor: 'emerald',
    headerBadges: [
      { text: 'Maharashtra State Scheme', variant: 'green' },
      { text: 'Lottery Based Selection', variant: 'blue' },
      { text: 'Up to ₹1.25 Lakh Subsidy', variant: 'amber' }
    ],
    highlightTitle: 'Farm Mechanization Grant:',
    highlightText: '50% capital subsidy (up to ₹1,25,000) for purchase of new tractors and farm machinery. Special preference and fast-track lottery draw for SC/ST and women farmers.',
    highlightVariant: 'green',
    targetBeneficiaryText: 'Farmers holding registered agricultural land in Maharashtra seeking to modernize agricultural operations.',
    mandatoryDocs: ['7/12 & 8-A Extract', 'Aadhaar Card', 'Caste Certificate (if SC/ST)', 'Tractor Quotation from Dealer'],
    bottomMeta: {
      icon: 'mode',
      text: 'Mode: Lottery Selection via mahadbt.maharashtra.gov.in'
    },
    summary: 'Financial subsidy on purchasing new tractors, rotavators, power tillers, and implements through the MahaDBT Agriculture Portal.',
    description: 'Financial subsidy on purchasing new tractors, rotavators, power tillers, and implements through the MahaDBT Agriculture Portal.',
    eligibility: [
      'Farmer owning cultivable land in Maharashtra (minimum 1 acre)',
      'Family has not availed tractor subsidy benefit in preceding 10 years',
      'Purchased from registered authorized tractor manufacturer dealer',
      'Selected via computer lottery on MahaDBT portal'
    ],
    documents: ['7/12 Extract', 'Aadhaar Card', 'Dealer Quotation', 'Bank Passbook'],
    applicationSteps: [
      'Step 1: Log in to MahaDBT Farmer Schemes with Aadhaar or user credentials.',
      'Step 2: Select Agricultural Mechanization component and chosen tractor HP.',
      'Step 3: Upload 7/12 extract, 8-A, and authorized dealer quotation.',
      'Step 4: Participate in transparent computerized lottery draw.',
      'Step 5: On selection, purchase tractor, upload invoice and GPS photo for DBT grant release.'
    ],
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    sourceUrl: 'https://mahadbt.maharashtra.gov.in',
    tags: ['Tractor Subsidy', 'Mechanization', 'MahaDBT', 'Agriculture'],
    targetBeneficiaries: ['Small & Marginal Farmer', 'Women & SHG Members'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Online via MahaDBT Agriculture Schemes',
    lastUpdated: 'Oct 2026',
    lastVerifiedDate: '2026-10-20',
    schemeNo: 'MAHADBT-AGRI-01'
  },
  {
    id: 'pik-vima',
    name: 'Pradhan Mantri Fasal Bima Yojana (Pik Vima — ₹1 Farmer Share)',
    nameMr: 'प्रधानमंत्री पीक विमा योजना (१ रुपयात पीक विमा)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना (₹1 में फसल बीमा)',
    sector: 'agriculture',
    sectorMr: 'कृषी व शेतकरी',
    department: 'Department of Agriculture, Government of Maharashtra & Central MoA',
    departmentShort: 'Agriculture Dept, Maharashtra',
    level: 'Joint',
    benefitAmount: 'Comprehensive Crop Damage Compensation',
    benefits: 'Comprehensive crop damage compensation covering drought, unseasonal rain, and flood losses at ₹1 farmer share.',
    benefitType: 'subsidy',
    accentColor: 'emerald',
    headerBadges: [
      { text: '★ ₹1 Farmer Premium Only', variant: 'green' },
      { text: 'Kharif & Rabi Season', variant: 'blue' },
      { text: 'Drought & Flood Protection', variant: 'amber' }
    ],
    highlightTitle: 'Complete Crop Loss Cover at Just ₹1:',
    highlightText: 'Maharashtra farmers pay only ₹1 premium per crop application; entire remaining premium share is subsidized by Maharashtra State Government.',
    highlightVariant: 'green',
    targetBeneficiaryText: 'All loanee and non-loanee farmers cultivating notified crops in notified areas across all 36 Maharashtra districts.',
    mandatoryDocs: ['7/12 Land Record Extract (e-Pik Pahani Crop Sowing)', 'Aadhaar Card', 'Bank Passbook', 'Sowing Self-Declaration'],
    bottomMeta: {
      icon: 'deadline',
      text: 'Seasonal Deadline: 31st July (Kharif) / 15th Dec (Rabi)'
    },
    summary: 'Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest stages for just ₹1 farmer premium.',
    description: 'Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest stages for just ₹1 farmer premium.',
    eligibility: [
      'Cultivating notified crops in Maharashtra registered in e-Pik Pahani app',
      'Both loanee and non-loanee farmers eligible',
      'Landholding recorded on 7/12 extract in farmer name or registered tenant',
      'Timely insurance application before seasonal cutoff date'
    ],
    documents: ['7/12 Extract with e-Pik Pahani crop entry', 'Aadhaar Card', 'Bank Passbook', 'Crop Sowing Certificate'],
    applicationSteps: [
      'Step 1: Ensure crop sowing is registered on Maharashtra e-Pik Pahani mobile app.',
      'Step 2: Log in to PMFBY portal or visit nearest Aaple Sarkar / CSC Center.',
      'Step 3: Select notified crop, district, and survey Gat number from 7/12 extract.',
      'Step 4: Pay ₹1 token premium (state covers remaining insurance premium).',
      'Step 5: Download insured crop policy receipt; claim automatically triggered on area yield/weather distress.'
    ],
    officialUrl: 'https://pmfby.gov.in',
    sourceUrl: 'https://pmfby.gov.in',
    tags: ['Pik Vima (Crop Insurance 1₹)', 'Crop Insurance', 'Farmer', 'PMFBY'],
    targetBeneficiaries: ['Small & Marginal Farmer', 'All Landholders'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Online via pmfby.gov.in or CSC Center',
    lastUpdated: 'Nov 2026',
    lastVerifiedDate: '2026-11-14',
    schemeNo: 'PMFBY-MH-2024'
  },
  {
    id: 'sanjay-gandhi-niradhar',
    name: 'Sanjay Gandhi Niradhar Anudan Yojana (Destitute Pension Scheme)',
    nameMr: 'संजय गांधी निराधार अनुदान योजना (मासिक निवृत्तीवेतन)',
    nameHi: 'संजय गांधी निराधार अनुदान योजना',
    sector: 'social',
    sectorMr: 'सामाजिक न्याय व निवृत्तीवेतन',
    department: 'Social Justice & Special Assistance Department, Government of Maharashtra',
    departmentShort: 'Social Justice Dept, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: '₹1,500 / Month Pension',
    benefits: '₹1,500 monthly social security financial pension transferred directly into beneficiary bank account.',
    benefitType: 'cash',
    accentColor: 'indigo',
    headerBadges: [
      { text: 'Maharashtra State Welfare', variant: 'blue' },
      { text: 'Monthly Pension ₹1,500', variant: 'green' },
      { text: 'Widow, Elderly & Divyang', variant: 'amber' }
    ],
    highlightTitle: 'Monthly Social Security Allowance:',
    highlightText: '₹1,500 monthly financial pension transferred directly into the bank accounts of destitute persons, widows, disabled citizens, and terminally ill individuals.',
    highlightVariant: 'blue',
    targetBeneficiaryText: 'Destitute individuals under 65, widows, divorced women, persons with 40%+ disability, and orphaned children residing in Maharashtra.',
    mandatoryDocs: ['Tehsildar Income Certificate (Family Income under ₹21,000/yr)', 'Age / Birth Certificate', 'Civil Surgeon Disability Certificate (if Divyang)', 'Aadhaar Card'],
    bottomMeta: {
      icon: 'mode',
      text: 'Mode: Tehsildar / Sanjay Gandhi Niradhar Committee Approval'
    },
    summary: 'Monthly pension and livelihood assistance for destitutes, widows, blind, disabled, and terminally ill persons in Maharashtra.',
    description: 'Monthly pension and livelihood assistance for destitutes, widows, blind, disabled, and terminally ill persons in Maharashtra.',
    eligibility: [
      'Resident of Maharashtra for at least 15 years',
      'Family annual income must be below ₹21,000 per year',
      'No adult son earning a regular livelihood',
      'For Divyang category: 40% or higher permanent medical disability'
    ],
    documents: ['Income Certificate (below ₹21K)', 'Residence Certificate (15 yrs)', 'Disability Certificate (if applicable)', 'Bank Passbook'],
    applicationSteps: [
      'Step 1: Collect application form from Taluka Tehsil Office or download via Aaple Sarkar.',
      'Step 2: Attach Tehsildar income certificate (< ₹21,000/yr) and 15-year Maharashtra residence proof.',
      'Step 3: Attach Civil Surgeon medical certificate (for Divyang/illness) or death certificate (for widows).',
      'Step 4: Submit to Taluka Sanjay Gandhi Niradhar Committee.',
      'Step 5: Committee sanction and monthly direct bank pension credit.'
    ],
    officialUrl: 'https://sjsa.maharashtra.gov.in',
    sourceUrl: 'https://sjsa.maharashtra.gov.in',
    tags: ['Sanjay Gandhi Niradhar', 'Pension', 'Widow', 'Divyang', 'Social Welfare'],
    targetBeneficiaries: ['Senior Citizens (60+)', 'Divyangjan (Persons with Disability)', 'Women & SHG Members'],
    verified: true,
    verificationStatus: 'demonstration',
    applicationMode: 'Offline via Taluka Tehsil Office / Aaple Sarkar Portal',
    lastUpdated: 'Nov 2026',
    lastVerifiedDate: '2026-11-05',
    schemeNo: 'SGNY-MH-2024'
  }
];

export const SECTORS_LIST = [
  {
    id: 'all',
    title: 'All Schemes',
    titleMr: 'सर्व योजना',
    schemesCount: 532,
    highlights: 'Complete catalog of Maharashtra State and Central Government welfare initiatives.',
    color: 'blue'
  },
  {
    id: 'agriculture',
    title: 'Agriculture & Farmers',
    titleMr: 'कृषी व शेतकरी कल्याण',
    schemesCount: 144,
    highlights: 'Kisan Credit, Agri-Infra, Crop Insurance (Pik Vima), Magel Tyala Shettale, and Tech equipment subsidies.',
    color: 'emerald'
  },
  {
    id: 'education',
    title: 'Education & Scholarships',
    titleMr: 'शिक्षण व शिष्यवृत्ती',
    schemesCount: 84,
    highlights: 'Post-Matric Scholarship, Rajarshi Shahu Maharaj fee reimbursement, hostel allowances, and tuition waivers.',
    color: 'blue'
  },
  {
    id: 'women',
    title: 'Women & Child Welfare',
    titleMr: 'महिला व बालकल्याण',
    schemesCount: 76,
    highlights: 'Mukhyamantri Majhi Ladki Bahin, Lakhpati Didi, SHG Revolving Funds, and maternity financial benefits.',
    color: 'rose'
  },
  {
    id: 'msme',
    title: 'MSME & Entrepreneurship',
    titleMr: 'ग्रामीण उद्योग व उपजीविका',
    schemesCount: 48,
    highlights: 'PMEGP loans, PMMY Mudra, CMEGP (Chief Minister Employment Generation), and artisan tool-kit grants.',
    color: 'amber'
  }
];

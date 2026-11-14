export interface Scheme {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  sector: string;
  sectorMr: string;
  department: string;
  level: 'Maharashtra' | 'Central';
  benefitAmount: string;
  summary: string;
  eligibility: string[];
  documents: string[];
  officialUrl: string;
}

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM KISAN Samman Nidhi (19th Tranche)',
    nameMr: 'पीएम किसान सन्मान निधी (१९ वा हप्ता)',
    nameHi: 'पीएम किसान सम्मान निधि',
    sector: 'agriculture',
    sectorMr: 'कृषी व शेतकरी',
    department: 'Department of Agriculture & Farmers Welfare',
    level: 'Central',
    benefitAmount: '₹6,000 / year (Direct DBT)',
    summary: 'Income support of ₹6,000 per year in three equal installments directly transferred to farmer Aadhaar-linked bank accounts.',
    eligibility: ['Small and marginal landholder farmer family', 'Cultivable landholding in state land records (7/12 extract)', 'Valid Aadhaar and e-KYC completed on portal'],
    documents: ['Aadhaar Card', '7/12 & 8-A Land Record Extract', 'Aadhaar-seeded Bank Passbook'],
    officialUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'ladki-bahin',
    name: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    nameMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    nameHi: 'मुख्यमंत्री माझी लाड़की बहिन योजना',
    sector: 'women',
    sectorMr: 'महिला सक्षमीकरण',
    department: 'Women and Child Development Department, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: '₹1,500 / month (₹18,000 / year)',
    summary: 'Direct monthly financial assistance to eligible women between 21 to 65 years of age to promote economic self-reliance and health nutrition.',
    eligibility: ['Resident of Maharashtra State', 'Women aged 21 to 65 years', 'Annual family income less than ₹2.5 Lakh', 'Family members should not be regular income tax payers'],
    documents: ['Aadhaar Card', 'Maharashtra Domicile Certificate or Ration Card issued 15+ years ago', 'Income Certificate (under ₹2.5 Lakh) or Yellow/Orange Ration Card', 'Aadhaar-seeded Bank Account Passbook'],
    officialUrl: 'https://ladakibahin.maharashtra.gov.in'
  },
  {
    id: 'tractor-subsidy',
    name: 'MahaDBT Agricultural Mechanization (Tractor Subsidy)',
    nameMr: 'महाडीबीटी कृषी यांत्रिकीकरण (ट्रॅक्टर अनुदान)',
    nameHi: 'महाडीबीटी कृषि यंत्रीकरण ट्रैक्टर सब्सिडी',
    sector: 'agriculture',
    sectorMr: 'कृषी व शेतकरी',
    department: 'Department of Agriculture, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: 'Up to ₹1,25,000 or 50% subsidy',
    summary: 'Financial subsidy for purchasing new tractors, power tillers, and mechanized farm equipment to modernize farming practices.',
    eligibility: ['Farmer holding land in Maharashtra (7/12 record)', 'SC/ST/Women/Small farmers receive priority 50% subsidy', 'One tractor subsidy per family once in 10 years'],
    documents: ['7/12 & 8-A Extract', 'Caste Certificate (for SC/ST priority)', 'Quotation from authorized tractor dealer', 'Aadhaar Card & Bank Passbook'],
    officialUrl: 'https://mahadbt.maharashtra.gov.in'
  },
  {
    id: 'shettale-subsidy',
    name: 'Magel Tyala Shettale (Farm Pond Scheme)',
    nameMr: 'मागेल त्याला शेततळे योजना',
    nameHi: 'मांगे उसे खेत तलाब योजना',
    sector: 'irrigation',
    sectorMr: 'जलसंधारण व सौर',
    department: 'Department of Agriculture & Water Conservation, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: 'Up to ₹75,000 subsidy',
    summary: 'Demand-based farm pond construction grant to ensure protective irrigation during drought periods.',
    eligibility: ['Minimum 0.60 hectare cultivable land', 'Land must be technically suitable for water storage', 'Applicant should not have availed farm pond benefit previously'],
    documents: ['7/12 and 8-A Land Extract', 'Consent letter of co-owners (if joint holding)', 'Bank account details linked to Aadhaar'],
    officialUrl: 'https://mahadbt.maharashtra.gov.in'
  },
  {
    id: 'post-matric-scholarship',
    name: 'Government of India Post-Matric Scholarship (Maharashtra)',
    nameMr: 'भारत सरकार मॅट्रिकोत्तर शिष्यवृत्ती',
    nameHi: 'पोस्ट-मैट्रिक छात्रवृत्ति',
    sector: 'education',
    sectorMr: 'शिक्षण व शिष्यवृत्ती',
    department: 'Social Justice & Special Assistance Department, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: '100% Tuition & Exam Fees + Monthly Maintenance',
    summary: 'Full reimbursement of tuition and examination fees for students pursuing higher education across degree, diploma, and technical courses.',
    eligibility: ['Resident of Maharashtra', 'SC/ST/VJNT/OBC category student admitted to recognized college', 'Annual family income under ₹2.5 Lakh (SC/ST) or ₹1.5 Lakh (OBC)'],
    documents: ['Caste Certificate and Caste Validity Certificate', 'Income Certificate issued by Tehsildar', '10th & 12th Marksheets', 'College Admission Fee Receipt'],
    officialUrl: 'https://mahadbt.maharashtra.gov.in'
  },
  {
    id: 'pmay-gramin',
    name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    nameMr: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    nameHi: 'प्रधानमंत्री आवास योजना ग्रामीण',
    sector: 'housing',
    sectorMr: 'गृहनिर्माण व स्वच्छता',
    department: 'Ministry of Rural Development / Rural Development Dept Maharashtra',
    level: 'Central',
    benefitAmount: '₹1,20,000 to ₹1,30,000 + MGNREGA wages',
    summary: 'Financial assistance for construction of a pucca house with basic amenities for homeless and households living in kutcha/dilapidated houses.',
    eligibility: ['Houseless households or living in zero/one/two room kutcha houses', 'Verified in SECC 2011 / Awas+ list', 'No family member in regular government employment'],
    documents: ['Aadhaar Card', 'Job Card under MGNREGA', 'Bank Account Passbook', 'Land allotment or house site ownership document'],
    officialUrl: 'https://pmayg.nic.in'
  },
  {
    id: 'pm-kusum',
    name: 'PM KUSUM Solar Agriculture Pump Scheme (Component B)',
    nameMr: 'पीएम कुसुम सौर कृषी पंप योजना',
    nameHi: 'पीएम कुसुम सोलर पंप योजना',
    sector: 'irrigation',
    sectorMr: 'जलसंधारण व सौर',
    department: 'MSEDCL & Mahaurja (MEDA), Maharashtra',
    level: 'Maharashtra',
    benefitAmount: '90% Subsidy for Off-Grid Solar Pumps',
    summary: 'Subsidized 3 HP, 5 HP, and 7.5 HP standalone solar agriculture pumps for farmers without grid electricity connection.',
    eligibility: ['Individual farmer with water source (well/borewell/river)', 'No existing electric connection for the agricultural plot', 'Adequate cultivable landholding'],
    documents: ['7/12 Land Record Extract with water source remark', 'Aadhaar Card', 'Caste Certificate (for SC/ST 95% subsidy rate)', 'Bank Passbook'],
    officialUrl: 'https://www.mahaurja.com'
  },
  {
    id: 'cmegp-msme',
    name: 'Chief Minister Employment Generation Programme (CMEGP)',
    nameMr: 'मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP)',
    nameHi: 'मुख्यमंत्री रोजगार सृजन कार्यक्रम',
    sector: 'msme',
    sectorMr: 'ग्रामीण उद्योग',
    department: 'Industries Department, Maharashtra',
    level: 'Maharashtra',
    benefitAmount: 'Up to ₹50 Lakh project cost (15% to 35% subsidy)',
    summary: 'Credit-linked subsidy program to generate self-employment ventures in manufacturing and rural service enterprises.',
    eligibility: ['Resident of Maharashtra aged 18 to 45 years (50 for special category)', 'Minimum 7th pass for projects above ₹10 Lakh; 10th pass for above ₹25 Lakh', 'New micro/small business setup'],
    documents: ['Detailed Project Report (DPR)', 'Educational qualification certificates', 'Aadhaar and PAN Card', 'Domicile Certificate of Maharashtra'],
    officialUrl: 'https://maha-cmegp.gov.in'
  }
];

export const SECTORS_LIST = [
  {
    id: 'agriculture',
    title: 'Agriculture & Farmer Welfare',
    titleMr: 'कृषी व शेतकरी कल्याण',
    schemesCount: 144,
    highlights: 'Kisan Credit, Agri-Infra, Crop Insurance (Pik Vima), Magel Tyala Shettale, and Tech equipment subsidies.',
    color: 'emerald'
  },
  {
    id: 'women',
    title: 'Women Empowerment & SHG',
    titleMr: 'महिला सक्षमीकरण व बचत गट',
    schemesCount: 68,
    highlights: 'Mukhyamantri Majhi Ladki Bahin, Lakhpati Didi, SHG Revolving Funds, and maternity financial benefits.',
    color: 'rose'
  },
  {
    id: 'msme',
    title: 'Rural Entrepreneurship & MSME',
    titleMr: 'ग्रामीण उद्योग व उपजीविका',
    schemesCount: 46,
    highlights: 'PMEGP loans, PMMY Mudra, CMEGP (Chief Minister Employment Generation), and artisan tool-kit grants.',
    color: 'blue'
  },
  {
    id: 'education',
    title: 'Education & Student Welfare',
    titleMr: 'शिक्षण व शिष्यवृत्ती',
    schemesCount: 84,
    highlights: 'Post-Matric Scholarship, Rajarshi Shahu Maharaj fee reimbursement, Dr. Punjabrao Deshmukh hostel allowances, and tuition waivers.',
    color: 'amber'
  },
  {
    id: 'housing',
    title: 'Housing & Sanitation',
    titleMr: 'गृहनिर्माण व स्वच्छता योजना',
    schemesCount: 32,
    highlights: 'Pradhan Mantri Awas Yojana (PMAY-G), Ramai Gharkul, Shabari Awas, and rural household sanitation grants.',
    color: 'teal'
  },
  {
    id: 'social',
    title: 'Social Welfare & Pensions',
    titleMr: 'सामाजिक न्याय व निवृत्तीवेतन',
    schemesCount: 59,
    highlights: 'Sanjay Gandhi Niradhar, Shravanbal Old Age Pension, Divyang monthly allowances, and widow support benefits.',
    color: 'indigo'
  },
  {
    id: 'irrigation',
    title: 'Irrigation & Solar Power',
    titleMr: 'जलसंधारण व सौर कृषी पंप',
    schemesCount: 38,
    highlights: 'PM-KUSUM Component A/B/C, Mukhyamantri Saur Krushi Vahini, micro-irrigation subsidies, and farm ponds.',
    color: 'orange'
  },
  {
    id: 'skill',
    title: 'Skill Training & Jobs',
    titleMr: 'कौशल्य विकास व रोजगार',
    schemesCount: 52,
    highlights: 'Pramod Mahajan Kaushalya Vikas, Mukhyamantri Yuva Karya Prashikshan, CSM vocational courses, and job fairs.',
    color: 'sky'
  }
];

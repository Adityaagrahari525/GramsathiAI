# Requirements: GramSathi AI — Public Civic Service Platform

**Defined:** 2026-11-14
**Core Value:** Demystifying complex government scheme notifications and eligibility criteria into transparent, accessible, and actionable guidance in native languages (Marathi, Hindi, English) so every eligible rural citizen receives their rightful benefits directly.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Stitch UI & Frontend Shell
- [ ] **UI-01**: User sees pixel-accurate reproduction of the approved Stitch UI design (`a34146bdd91840658c41a2b10a75db5e`) with exact civic colors, typography, cards, and banners.
- [ ] **UI-02**: Layout is fully responsive across desktop, tablet, and mobile devices with touch-friendly accessible controls.
- [ ] **UI-03**: Interactive frontend navigation connects all top-bar items, popular search pills, sector cards, and step modules.

### Scheme Discovery
- [ ] **DISC-01**: User can browse government schemes categorized by sector (Agriculture, Women, MSME, Education, Housing, Social Welfare, Irrigation, Skill).
- [ ] **DISC-02**: User can search schemes by keyword, department, life stage, trade, and caste/category with real-time filtering.
- [ ] **DISC-03**: User can view verified scheme details with benefits breakdown, official department sources, and application guidelines.

### Structured Eligibility Checker
- [ ] **ELIG-01**: User can complete a guided 4-step eligibility evaluation (age, landholding, annual family income, category/gender, district).
- [ ] **ELIG-02**: System evaluates deterministic criteria and returns an instant qualification breakdown highlighting met and unmet rules.
- [ ] **ELIG-03**: User receives a tailored document readiness checklist (Aadhaar, 7/12 extract, income certificate, bank passbook).

### AI Scheme Assistant & Gemini Integration
- [ ] **AIA-01**: User can ask questions in simple conversational language (Marathi, Hindi, English) about schemes and procedures.
- [ ] **AIA-02**: Server-side Google Gemini API processes queries with zero-hallucination prompts strictly grounded in verified scheme facts.
- [ ] **AIA-03**: AI responses provide direct citations to official state and national portals (MahaDBT, Aaple Sarkar, India.gov.in).

### Reverse Scheme Discovery
- [ ] **REV-01**: User can describe their life challenge or livelihood need in everyday terms without knowing scheme names.
- [ ] **REV-02**: Engine analyzes situational descriptions and maps them to relevant welfare and financial support programs.

### Scheme Journey Map
- [ ] **JOUR-01**: User can follow a 5-stage progress roadmap: Eligibility -> Document Prep -> Application Form -> Verification/CSC Visit -> DBT Disbursement.
- [ ] **JOUR-02**: User can generate an offline-ready Application Reference Slip for presenting at local Gram Panchayat or CSC Seva Kendra.

### Multilingual Assistance
- [ ] **LANG-01**: User can instantly toggle the interface between Marathi (मराठी), Hindi (हिंदी), and English.
- [ ] **LANG-02**: All terminology uses verified rural civic vocabulary rather than raw machine translation.

### Voice Assistance & Form Filler
- [ ] **VOIC-01**: User can speak scheme queries via microphone with multilingual speech-to-text recognition.
- [ ] **VOIC-02**: User can complete scheme application forms through voice assistance, with explicit review and confirmation before save.

### Scheme Combination Engine
- [ ] **COMB-01**: System detects and suggests synergistic scheme bundles (e.g. drip irrigation subsidy + solar pump + PM-KISAN).
- [ ] **COMB-02**: System validates exclusion rules and income overlap restrictions between concurrent schemes.

### Fraud & Scam Detection
- [ ] **SCAM-01**: User can consult a verification tool that clarifies official rules, free application guarantees, and authorized portals.
- [ ] **SCAM-02**: User can analyze suspicious SMS messages or website links to identify common rural welfare fraud patterns.

### Saved Schemes & Citizen Profile
- [ ] **PROF-01**: User can bookmark schemes and track their preparation status.
- [ ] **PROF-02**: User can store personal preferences (district, landholding, language) for fast recurring evaluations.

### Backend REST APIs & Persistence
- [ ] **API-01**: Express.js REST API provides endpoints for scheme search, sector filtering, and rule evaluation.
- [ ] **API-02**: MongoDB with Mongoose manages verified scheme documents, category schemas, and user activity records.
- [ ] **AUTH-01**: User and facilitator accounts are protected with secure JWT authentication and encrypted credentials.

## v2 Requirements

Deferred to future releases. Tracked but not in current roadmap.

### Direct Government Portal Integration
- **GOV-01**: Direct OAuth login via MahaDBT / DigiLocker.
- **GOV-02**: Live API status tracking for submitted applications.

### Offline Village Kiosk Mode
- **KIOSK-01**: Progressive Web App (PWA) offline sync for Gram Panchayat kiosk tablets.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Direct Application Approval | GramSathi AI is a civic discovery and preparation assistant; only official government officers can approve applications. |
| Non-civic Dark/Neon Themes | Civic accessibility requires high contrast light public-service visual styling adhering strictly to the Stitch design. |
| AI-Invented Eligibility Rules | AI must strictly explain verified database criteria, never guess or synthesize unverified eligibility rules. |
| Client-Side API Keys | Exposing Gemini API keys in frontend code is a critical security vulnerability; all LLM calls stay on backend. |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01, UI-02, UI-03 | Phase 2, Phase 3 | Pending |
| DISC-01, DISC-02, DISC-03 | Phase 3, Phase 4, Phase 7 | Pending |
| ELIG-01, ELIG-02, ELIG-03 | Phase 4, Phase 8 | Pending |
| AIA-01, AIA-02, AIA-03 | Phase 9 | Pending |
| REV-01, REV-02 | Phase 11 | Pending |
| JOUR-01, JOUR-02 | Phase 11 | Pending |
| LANG-01, LANG-02 | Phase 10 | Pending |
| VOIC-01, VOIC-02 | Phase 10 | Pending |
| COMB-01, COMB-02 | Phase 11 | Pending |
| SCAM-01, SCAM-02 | Phase 11 | Pending |
| PROF-01, PROF-02 | Phase 4, Phase 6 | Pending |
| API-01, API-02 | Phase 5, Phase 6, Phase 7 | Pending |
| AUTH-01 | Phase 6 | Pending |

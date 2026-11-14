# Roadmap: GramSathi AI — Public Civic Service Platform

## Overview

GramSathi AI is built through a disciplined 12-phase pipeline starting with exact Stitch UI recreation and interactive frontend navigation, moving into centralized mock data and Express/MongoDB backend architecture, followed by verified scheme databases, deterministic eligibility evaluation, server-side Gemini AI assistance, multilingual and voice capabilities, and signature civic tools (Reverse Discovery, Journey Maps, Scheme Bundling, and Scam Detection).

## Phases

- [ ] **Phase 1: Environment & Stitch UI Asset Inspection** - Initialize React + TypeScript + Tailwind workspace and catalog Stitch visual design tokens.
- [ ] **Phase 2: Stitch UI Screen Integration (Visual Fidelity)** - Replicate approved Stitch screen (`a34146bdd91840658c41a2b10a75db5e`) with pixel-level civic fidelity.
- [ ] **Phase 3: Frontend Navigation & Interactive Routing** - Connect top-bar navigation, search bars, category filters, and step cards into a cohesive flow.
- [ ] **Phase 4: Centralized Application State & Structured Mock Schemes** - Implement client store and comprehensive initial Maharashtra & Central scheme dataset.
- [ ] **Phase 5: Node.js & Express REST API Backend** - Build backend service with modular routes, controllers, and validation for scheme catalog.
- [ ] **Phase 6: MongoDB Persistence & Citizen Authentication** - Implement Mongoose models, database connections, and secure JWT authentication.
- [ ] **Phase 7: Verified Government Scheme Information Engine** - Populate verified scheme data from official sources (Aaple Sarkar, MahaDBT, Central portals).
- [ ] **Phase 8: Structured Multi-Step Eligibility Evaluation** - Build the 4-step eligibility wizard, criteria evaluator, and document checklist generator.
- [ ] **Phase 9: Secure Gemini AI Scheme Assistant** - Integrate Google Gemini server-side for natural language Q&A with strict grounding and citations.
- [ ] **Phase 10: Multilingual Civic Localization & Voice Assistance** - Implement Marathi, Hindi, and English toggle plus speech-to-text and voice form filling.
- [ ] **Phase 11: Specialized Civic Tools (Reverse Discovery, Journey Map, Combinations, Fraud Detection)** - Deploy high-impact modules for rural citizens.
- [ ] **Phase 12: Security Hardening, Responsive Polish & Production Readiness** - E2E verification, mobile responsiveness audit, rate limiting, and build packaging.

## Phase Details

### Phase 1: Environment & Stitch UI Asset Inspection
**Goal**: Initialize the project codebase with React, TypeScript, and Tailwind CSS; configure design tokens matching the approved Stitch screen.
**Depends on**: Nothing (first phase)
**Requirements**: UI-01
**Success Criteria**:
1. Clean React + TypeScript + Tailwind CSS project initialized and runs on local dev server.
2. Stitch UI color system (civic blues, clean white, slate grey borders, green accents) and typography configured in Tailwind.
**Plans**: 1 plan

### Phase 2: Stitch UI Screen Integration (Visual Fidelity)
**Goal**: Build the complete pixel-accurate recreation of the approved Stitch UI design (`a34146bdd91840658c41a2b10a75db5e`).
**Depends on**: Phase 1
**Requirements**: UI-01, UI-02
**Success Criteria**:
1. Exact visual reproduction of the government portal header, hero section, search bar with quick tags, 3 action cards, 8 sector cards, and 3-step workflow.
2. Responsive layout looks clean across mobile, tablet, and desktop viewports.
**Plans**: 1 plan

### Phase 3: Frontend Navigation & Interactive Routing
**Goal**: Implement interactive routing and stateful UI transitions connecting all header buttons, popular search tags, and sector cards.
**Depends on**: Phase 2
**Requirements**: UI-03, DISC-01, DISC-02
**Success Criteria**:
1. Clicking search pills (e.g. "PM KISAN 19th Tranche", "Ladki Bahin Yojana") immediately populates the search and filters results.
2. Sector cards dynamically trigger sector-specific scheme lists.
3. Action cards ("Find Schemes", "Check Eligibility", "Ask GramSathi AI") open dedicated views or modal dialogs.
**Plans**: 1 plan

### Phase 4: Centralized Application State & Structured Mock Schemes
**Goal**: Establish centralized state management and a realistic, rich local dataset of Maharashtra and Central schemes.
**Depends on**: Phase 3
**Requirements**: DISC-01, DISC-02, DISC-03, PROF-01
**Success Criteria**:
1. 20+ realistic schemes covering Agriculture, Women Empowerment, MSME, Education, Housing, and Social Welfare.
2. Scheme details modal displays complete eligibility criteria, benefits, documents, and application steps.
3. User can bookmark schemes and see saved items persist across page navigation.
**Plans**: 1 plan

### Phase 5: Node.js & Express REST API Backend
**Goal**: Develop the Express.js server providing REST APIs for scheme querying, filtering, and health monitoring.
**Depends on**: Phase 4
**Requirements**: API-01
**Success Criteria**:
1. Express backend runs with clean architecture (`/api/schemes`, `/api/health`, `/api/categories`).
2. Robust error handling, request logging, and CORS configuration.
**Plans**: 1 plan

### Phase 6: MongoDB Persistence & Citizen Authentication
**Goal**: Integrate MongoDB with Mongoose schemas for schemes, users, and saved items; implement JWT authentication.
**Depends on**: Phase 5
**Requirements**: API-02, AUTH-01, PROF-02
**Success Criteria**:
1. MongoDB connects reliably with models for Scheme, User, and SavedScheme.
2. Citizen and facilitator signup/login endpoints issue and verify JWT tokens.
3. Authenticated users can persist profile preferences and bookmarks in database.
**Plans**: 1 plan

### Phase 7: Verified Government Scheme Information Engine
**Goal**: Seed and structure verified government scheme data with official source citations and audit metadata.
**Depends on**: Phase 6
**Requirements**: DISC-03, API-01, API-02
**Success Criteria**:
1. Official schemes seeded with verified department URLs, helpline contacts, and exact criteria rules.
2. Full-text search and faceted category filtering powered by database queries.
**Plans**: 1 plan

### Phase 8: Structured Multi-Step Eligibility Evaluation
**Goal**: Implement the deterministic 4-step eligibility evaluation wizard with transparent criteria breakdown.
**Depends on**: Phase 7
**Requirements**: ELIG-01, ELIG-02, ELIG-03
**Success Criteria**:
1. User completes 4-step questionnaire (age, landholding, annual family income, category/gender, district).
2. Engine evaluates criteria deterministically and displays matching schemes with matched vs unmet conditions.
3. Tailored document checklist is generated based on user responses.
**Plans**: 1 plan

### Phase 9: Secure Gemini AI Scheme Assistant
**Goal**: Connect the server-side Google Gemini API to power natural conversational scheme guidance with strict anti-hallucination rules.
**Depends on**: Phase 8
**Requirements**: AIA-01, AIA-02, AIA-03
**Success Criteria**:
1. "Ask GramSathi AI" chat interface communicates with backend Gemini endpoint.
2. Assistant replies in clear, simple language with citations to official government portals.
3. Prompt guardrails strictly prevent fabricating unverified eligibility criteria or false approval promises.
**Plans**: 1 plan

### Phase 10: Multilingual Civic Localization & Voice Assistance
**Goal**: Deliver full Marathi, Hindi, and English support alongside speech-to-text query input and voice form filling.
**Depends on**: Phase 9
**Requirements**: LANG-01, LANG-02, VOIC-01, VOIC-02
**Success Criteria**:
1. One-click instant language toggle between Marathi (मराठी), Hindi (हिंदी), and English with authentic civic phrasing.
2. Web Speech API STT enables citizens to dictate search queries and chat prompts.
3. Voice-assisted form filler reads fields and confirms inputs before saving.
**Plans**: 1 plan

### Phase 11: Specialized Civic Tools (Reverse Discovery, Journey Map, Combinations, Fraud Detection)
**Goal**: Build the 4 signature high-impact civic modules that elevate GramSathi AI beyond basic portals.
**Depends on**: Phase 10
**Requirements**: REV-01, REV-02, JOUR-01, JOUR-02, COMB-01, COMB-02, SCAM-01, SCAM-02
**Success Criteria**:
1. Reverse Discovery matches plain language problems ("need water storage for farm") to schemes.
2. Scheme Journey Map displays 5-stage progression with exportable Application Reference Slip.
3. Scheme Combination Engine detects compatible scheme bundles while warning about exclusivity rules.
4. Fraud & Scam Detector alerts users to fake messages, unauthorized fees, and scam patterns.
**Plans**: 1 plan

### Phase 12: Security Hardening, Responsive Polish & Production Readiness
**Goal**: Comprehensive end-to-end testing, responsive design audit, rate limiting, and production build verification.
**Depends on**: Phase 11
**Requirements**: UI-02, AUTH-01
**Success Criteria**:
1. Rate limiting, input sanitization, and security headers active on backend.
2. Mobile viewport testing confirms seamless usability on small screens.
3. Both frontend and backend build and execute cleanly for production deployment.
**Plans**: 1 plan

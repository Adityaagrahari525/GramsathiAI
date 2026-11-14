# GramSathi AI — Public Civic Service Platform

## What This Is

GramSathi AI is an AI-powered multilingual government scheme discovery and digital assistance platform designed primarily for rural citizens, farmers, women entrepreneurs, artisans, and youth in Maharashtra, India. It provides a simple, trustworthy, and guided digital public-service experience where citizens can explain their needs in everyday language, discover relevant state and central benefits, verify their eligibility, and navigate complex application procedures without middlemen.

## Core Value

Demystifying complex government scheme notifications and eligibility criteria into transparent, accessible, and actionable guidance in native languages (Marathi, Hindi, English) so every eligible rural citizen receives their rightful benefits directly.

## Business Context

- **Customer/Beneficiary**: Rural citizens, farmers, women self-help groups (SHGs), rural entrepreneurs/MSMEs, artisans, and students in Maharashtra.
- **Service model**: Digital civic public-service platform acting as a trusted pre-application navigator and eligibility verifier.
- **Success metric**: High eligibility match accuracy, user understanding score, zero hallucinated criteria, and successful journey completion to official portals (MahaDBT, Aaple Sarkar).
- **Strategy notes**: Built directly to reflect official Maharashtra Aaple Sarkar / DigiGov standards with strict adherence to the approved Google Stitch visual design.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **Stitch UI Fidelity**: Accurately reproduce the approved Stitch UI design (`a34146bdd91840658c41a2b10a75db5e`) as the visual source of truth across desktop, tablet, and mobile.
- [ ] **Scheme Discovery**: Search and explore Maharashtra and Central government schemes by category, keyword, department, life stage, and beneficiary category.
- [ ] **AI Scheme Assistant**: Conversational assistant powered by Google Gemini (securely on the backend) explaining schemes in plain Marathi, Hindi, and English with source citations.
- [ ] **Structured Eligibility Checker**: Multi-step interactive assessment evaluating age, landholding, income, category, and residence with transparent criteria breakdown.
- [ ] **Reverse Scheme Discovery**: Problem/need-based matching where users describe their life situation or challenge to find matching welfare programs.
- [ ] **Scheme Journey Map**: Clear 5-stage roadmap (Eligibility, Document Checklist, Application Prep, Verification, Benefit Disbursement) for each scheme.
- [ ] **Multilingual Support**: Seamless Marathi (मराठी), Hindi (हिंदी), and English interface with localized civic terminology.
- [ ] **Voice Assistance & Form Filler**: Voice-guided query and form assistance with human-in-the-loop review before saving/submission.
- [ ] **Scheme Combination Engine**: Identifies synergistic combinations of schemes (e.g. crop subsidy + solar pump + micro-credit) while checking exclusivity restrictions.
- [ ] **Fraud & Scam Detection**: Verification utility alerting citizens against fake SMS, unauthorized agent fees, and suspicious portals.
- [ ] **Saved Schemes & Citizen Profile**: Bookmarking, document readiness checklist, and language preferences.
- [ ] **Full-Stack REST Architecture**: Node.js & Express REST APIs with MongoDB & Mongoose persistence and JWT authentication.

### Out of Scope

- **Direct Fake Submission**: Falsely claiming applications are officially submitted or approved without direct government integration.
- **Dark/Neon UI Styling**: Dark mode, neon accents, glassmorphism, or non-civic commercial SaaS aesthetics — strictly forbidden.
- **AI Rule Hallucination**: Allowing LLMs to invent or guess eligibility conditions; all logic must be grounded in verified scheme rule matrices.
- **Client-side LLM Keys**: Directly calling Gemini from browser JavaScript — all AI calls must be authenticated and rate-limited on the backend.

## Context

- Visual source of truth is the approved Google Stitch screen (`a34146bdd91840658c41a2b10a75db5e`) from project `3078719812234505147`.
- Target audience includes users with limited digital literacy or low-bandwidth mobile devices; requires high contrast, clear font sizes, and intuitive iconography.
- Alignment with flagship Maharashtra and Central schemes: PM-KISAN, Majhi Ladki Bahin Yojana, Mahadbt Farmer Schemes, PMAY-Gramin, etc.

## Constraints

- **Design System**: Strictly adhere to the civic color palette (primary blues, clean white, light slate/grey cards, emerald accents) and structured hierarchy from the Stitch design.
- **Tech Stack**: React / Next.js with TypeScript & Tailwind CSS for frontend; Node.js & Express with MongoDB for backend.
- **AI Grounding**: Google Gemini API via official `@google/genai` or server endpoints with strict system instructions against fabrication.
- **Security & Data**: JWT-based auth, secure environment variables, sanitized user inputs.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Stitch UI as single visual source of truth | Ensures approved public-service civic aesthetics without generic dashboard divergence | — Pending |
| React + TypeScript + Tailwind CSS | Fast component-based architecture aligning with modern frontend standards | — Pending |
| Node.js / Express backend with MongoDB | Proven robust REST API layer for schema evaluation, auth, and secure LLM mediation | — Pending |
| 12-Phase structured rollout | Guarantees quality gates and verification at each milestone | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. Requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-14 after initialization*

# GramSathi AI — Phase 3 Application Logic

## 1. Overview

Phase 3 refines the core logic modules to operate deterministically, efficiently, and predictably without relying on external cloud APIs or ungrounded machine-learning models for core civic rules.

---

## 2. Reverse Scheme Discovery Engine (`reverseDiscoveryService.ts`)

### 2.1 Design & Intent
Rural citizens often think in terms of life challenges ("I want to set up an irrigation pump", "I am starting a tailoring shop") rather than administrative department schemes. The Reverse Discovery Service maps these natural language expressions to verified government schemes.

### 2.2 Matching Pipeline
1. **Input Normalization**: Cleans and lower-cases user query strings.
2. **Pre-Configured Need Chips**:
   - Farming & Agriculture: "I want financial support for farming"
   - Small Business: "I want to start a small business"
   - Education: "I need educational assistance"
   - Self-Help Group (SHG): "I am a member of a self-help group"
   - Rural Entrepreneurship: "I need support for rural entrepreneurship"
3. **Keyword & Category Rules (`RULE_PATTERNS`)**:
   - Scores schemes between 70% and 95% based on token matching across domain dictionaries (Marathi and English terms: *shetkari*, *borewell*, *satbara*, *mudra*, *shikshan*, *bachat gat*, etc.).
   - Attaches an intelligible `matchedReason` explaining *why* the scheme was recommended.
   - Attaches `relevantEligibility` informing the user of the critical qualifying condition.
4. **Graceful Fallback**:
   - If exact keywords do not match, performs multi-field fallback search across names, summaries, and tags.
   - If no match occurs, returns top flagship programs with an explanation.
5. **Dynamic UI Integration**:
   - `NeedDiscoveryPage.tsx` dynamically renders `filteredAndSortedResults`, allowing live category filtering, sub-filtering (Solar, Drip, Pond, Machinery), and sorting by match percentage, subsidy amount, or shortest application steps.

---

## 3. Deterministic Eligibility Engine (`eligibilityService.ts`)

### 3.1 Three-State Output
Unlike simplistic pass/fail systems, the engine produces one of three distinct verdicts:
1. `potentially_eligible`: Profile meets 100% of tested statutory criteria.
2. `more_info_required`: High potential match where certain specific parameters (e.g. water source documentation, landholding record) are unconfirmed. **Missing information does not automatically trigger disqualification.**
3. `does_not_match`: Explicit violation of a strict statutory threshold (e.g. male applicant for Ladki Bahin, non-farmer applying for agricultural machinery).

### 3.2 Evaluation Rules
- **Jurisdiction**: Maharashtra domicile verification.
- **Demographics**: Gender constraints (e.g. women-only programs) and age limits (18–45 for CMEGP, 21–65 for Ladki Bahin, 17–35 for scholarships).
- **Landholding & Agriculture**: Minimum / maximum acreage, 7/12 extract status, water source validation (open well, borewell, farm pond), and grid pump status.
- **Socio-Economic & Income**: Income ceiling checks (< ₹2.5L, < ₹8.0L) and special social category reservations (SC/ST/OBC/EBC).

---

## 4. Scheme Journey & Application Tracker (`JourneyTrackerContext.tsx` & `TrackerPage.tsx`)

### 4.1 5-Stage Stepper
1. **Stage 1 — Eligibility Confirmed**: Displays verified statutory criteria.
2. **Stage 2 — Required Documents (Active)**: 6-item document dossier checklist.
3. **Stage 3 — Official Application**: Unlocked when document dossier is complete.
4. **Stage 4 — Field Inspection**: Pre-inspection advisory, Talathi/Krishi Sahayak physical survey, geo-tagging.
5. **Stage 5 — Commissioning & Benefit Release**: Subsidy sanction, installation, commissioning report.

### 4.2 Interactive Controls & State Persistence
- **Active Stage Selection**: Clicking any stepper card sets the active stage view.
- **Stage Completion Toggle**: Users can mark or unmark stages complete with instant visual feedback and local persistence in `localStorage`.
- **Dossier & Document Upload**: Supports simulated DigiLocker sync and digital file upload for the pending 8-A land record, unlocking Stage 3 upon completion.

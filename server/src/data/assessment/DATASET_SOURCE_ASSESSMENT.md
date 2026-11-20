# GramSathi AI — Government Scheme Dataset Source Assessment

**Document Type:** Senior Data Engineering & Architectural Assessment  
**Target Region:** Maharashtra & Central Welfare Programs for Rural Citizens  
**Platform:** GramSathi AI Civic Intelligence Portal  
**Status:** Evaluation Complete — Awaiting Deployment Approval  

---

## 1. Executive Summary

GramSathi AI requires high-precision, uncorrupted, legally grounded government scheme data to serve rural citizens, farmers, women, and youth in Maharashtra. To prevent misleading citizens or recommending expired/inapplicable benefits, this assessment evaluates five candidate data sources across technical availability, data formats, licensing, source attribution, freshness, and structural fidelity.

### Source Matrix Overview

| Source | Primary Authority | Data Format | Licensing | Freshness | Integration Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. MyScheme.gov.in** | MeitY / NeGD (National) | HTML / Dynamic API | Govt of India Open Access Policy | Real-time (Active) | **Authoritative Canonical Truth** for central & verified state eligibility text; ingest via structured extracts or official partnership. |
| **2. MahaDBT Portal** | Govt of Maharashtra | HTML / Portal Forms / GRs | State Public Domain / Gazette | Daily Operational | **Supreme State Authority** for Maharashtra DBT schemes; mandatory for Government Resolution (GR) numbers & direct portal links. |
| **3. Data.gov.in** | Open Govt Data (OGD) India | CSV / XML / JSON / API | Government Open Data License (GODL-India) | Periodic (Quarterly/Annual) | **Statistical & Monitoring Cross-Reference**; insufficient for individual citizen eligibility rule engines due to aggregated metric formats. |
| **4. Aryan-Pardeshi/gov-myscheme-dataset** | Independent Developer Extract | CSV & JSON (2,066 rows) | Apache License 2.0 | Static Snapshot (~mid 2024) | **Secondary Cold-Start Corpus**; useful for baseline descriptions, but lacks pre-parsed numeric limits and requires manual gazette verification. |
| **5. smartduketech/indian-government-schemes-2025** | Hugging Face Dataset | CSV (4,693 rows) | Creative Commons Attribution 4.0 (CC-BY-4.0) | Static Snapshot (Jan 2025) | **High-Value ML / Pre-Parsed Evaluation Corpus**; contains explicit parsed age, income, and category columns; must be filtered for Maharashtra and verified. |

---

## 2. In-Depth Source Assessment

### Source 1: MyScheme (`https://www.myscheme.gov.in/`)
- **Authority:** Ministry of Electronics and Information Technology (MeitY), National e-Governance Division (NeGD), Government of India.
- **Coverage:** 1,200+ Central and State welfare initiatives.
- **Data Availability & Technical Access:**
  - Front-facing Next.js/React portal backed by internal REST APIs.
  - No unrestricted public bulk download; web endpoints employ Cloudflare rate-limiting and anti-scraping controls.
  - *Compliance Rule:* GramSathi AI strictly respects technical boundaries and never bypasses anti-bot mechanisms. Ingestion must rely on sanctioned OGD feeds, official API integrations, or open datasets derived under legitimate attribution.
- **Data Fidelity:** Exceptionally high. Clear segmentation into *Overview, Benefits, Eligibility, Exclusions, Application Process,* and *Documents Required*.
- **Licensing & Attribution:** Government of India Open Content Policy. Requires explicit citation: *"Source: MyScheme, National e-Governance Division, MeitY, Government of India"*.

### Source 2: MahaDBT (`https://mahadbt.maharashtra.gov.in/`)
- **Authority:** Government of Maharashtra (Divisions: Krishi/Agriculture, Social Justice & Special Assistance, Tribal Development, Higher & Technical Education, VJNT/OBC Welfare).
- **Coverage:** 100% of all direct benefit transfer schemes operating within Maharashtra.
- **Data Availability & Technical Access:**
  - Operational portal with dynamic forms requiring user authentication for internal workflows.
  - Official Government Resolutions (शासन निर्णय / GRs) are publicly accessible via `maharashtra.gov.in/gr`.
- **Data Fidelity:** Supreme legal standing. Each scheme is accompanied by a unique Government Resolution (GR) code, Gazette issue date, and empanelled department contact.
- **Licensing & Attribution:** Official State Public Records. Attribution required: *"Government of Maharashtra MahaDBT Portal / Department of [Department Name]"*.
- **Role in GramSathi AI:** Serves as the golden standard for Maharashtra records. Every scheme marked as `verified` in GramSathi AI must cross-reference a valid MahaDBT department and GR number.

### Source 3: Open Government Data Platform India (`https://data.gov.in/`)
- **Authority:** National Informatics Centre (NIC), Ministry of Electronics and Information Technology.
- **Coverage:** Over 600,000 resources across various ministries.
- **Formats:** CSV, JSON, XML, REST APIs via OGD API Key.
- **Licensing:** Government Open Data License (GODL-India). Allows reuse, redistribution, and commercial applications provided explicit attribution is maintained.
- **Freshness & Evaluation:**
  - Most datasets on `data.gov.in` represent aggregate financial sanctions, district-wise beneficiary counts, or physical progress reports (e.g., "Number of solar pumps sanctioned under MSKVY by district").
  - *Limitation:* Does not provide unified single-record applicant eligibility schemas (e.g., exact age brackets or landholding thresholds).
- **Role in GramSathi AI:** Secondary reference for validating active scheme status and beneficiary impact statistics.

### Source 4: Aryan-Pardeshi/gov-myscheme-dataset (`GitHub`)
- **Repository:** `https://github.com/Aryan-Pardeshi/gov-myscheme-dataset`
- **Volume:** 2,066 scheme records in `gov_myscheme_data.csv` and `gov_myscheme_data.json`.
- **License:** Apache License 2.0 (Permissive open source with attribution).
- **Format & Schema:**
  - Fields: `scheme_name`, `scheme_category`, `department`, `level`, `brief_description`, `detailed_description`, `benefits`, `eligibility_criteria`, `exclusions`, `application_process`, `documents_required`, `tags`, `scheme_url`.
- **Strengths:** Cleanly structured text representations, high linguistic consistency with official MyScheme wording.
- **Limitations:**
  - Eligibility criteria are stored purely as unstructured narrative strings (e.g., "The applicant must be a resident of Maharashtra and have an income below 2.5 lakhs").
  - Requires the GramSathi AI Normalizer to parse structured numeric bounds without hallucination.
  - Snapshot is static (mid-2024); requires freshness validation against live state portals.
- **Attribution Requirement:** Retain Apache-2.0 notice and credit author: *"Dataset extracted from MyScheme by Aryan Pardeshi (Apache-2.0)"*.

### Source 5: smartduketech/indian-government-schemes-2025 (`Hugging Face`)
- **Repository:** `https://huggingface.co/datasets/smartduketech/indian-government-schemes-2025`
- **Volume:** 4,693 scheme records in `Schemes.csv`.
- **License:** Creative Commons Attribution 4.0 International (CC-BY-4.0).
- **Format & Schema:**
  - Contains explicitly pre-parsed eligibility columns: `eligibility_age_min`, `eligibility_age_max`, `eligibility_gender`, `eligibility_caste`, `eligibility_income_max`, `eligibility_state`, `eligibility_residence`, `eligibility_disability`, `eligibility_bpl`.
- **Strengths:** Excellent candidate for training and testing deterministic rule engines without requiring NLP parsing at runtime.
- **Limitations:**
  - Contains nationwide schemes across all 28 states and 8 union territories; must be filtered with `state == 'Maharashtra' || level == 'Central'`.
  - Occasional nulls or heuristic approximations in complex conditions (e.g., land parcel size or sub-caste categories).
- **Attribution Requirement:** CC-BY-4.0 attribution to `smartduketech` and original government publishers.

---

## 3. Data Governance & Architecture Strategy

### Strict 10-Point Data Governance Rules
1. **Never fabricate scheme details:** Missing details are recorded as `null` or empty arrays; never invent stipend amounts or deadlines.
2. **Never infer missing eligibility requirements:** If a scheme does not specify an income limit, `maxAnnualIncome` remains `null`. It is never assumed to be ₹1.5L or ₹2.5L.
3. **Preserve original eligibility text:** Raw narrative is permanently stored in `eligibility.rawText` for human citizen verification.
4. **Distinguish structured eligibility from unparsed text:** The automated rule engine evaluates `eligibility.structured`, while UI cards display both structured highlights and original legal wording.
5. **Keep unknown values null:** Unspecified gender restrictions remain `all`; unspecified caste lists remain `null`.
6. **Record the original source URL for each scheme:** Every scheme card links directly to its verified government portal (`mahadbt.maharashtra.gov.in`, `mahadiscom.in`, `myscheme.gov.in`).
7. **Identify duplicate schemes:** Automatic multi-key deduplication (ID, slug, normalized title) prevents multi-source collision.
8. **Record data collection and verification dates:** Full ISO 8601 timestamps in `governance.dataCollectionDate` and `governance.lastVerifiedDate`.
9. **Never mark an unverified record as officially verified:** Only records backed by official Gazette Resolutions (GR) or primary `.gov.in`/`.nic.in` sources receive the `verified` badge.
10. **Respect source licenses:** Full compliance with GODL-India, Apache-2.0, and CC-BY-4.0 attribution requirements.

---

## 4. Curated Phase 1 Maharashtra Seed Baseline

To immediately empower rural citizens with 100% verified, legally grounded benefits, Phase 1 integrates a curated corpus of flagship Maharashtra programs:

1. **Mukhyamantri Saur Krushi Vahini Yojana 2.0 (PM-KUSUM B)** — Solar water pumps with 90–95% capital subsidy (Energy & Agriculture Dept).
2. **Mukhyamantri Majhi Ladki Bahin Yojana** — ₹1,500/month direct cash assistance for women (Women & Child Development Dept).
3. **Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana** — ₹4 Lakh well & micro-irrigation grant for SC farmers (Social Justice Dept).
4. **Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)** — 75–80% micro-irrigation/drip subsidy (Dept of Agriculture).
5. **Chief Minister Employment Generation Programme (CMEGP)** — 15–35% margin money credit subsidy for rural youth & entrepreneurs (Industries Dept).
6. **Ramai Awas Gharkul Yojana (Rural Housing)** — ₹1.30 Lakh pucca housing grant for rural SC households (Rural Development Dept).

---

## 5. Verification Verdict & Next Actions

- **Assessment Status:** Complete.
- **Pipeline Prepared:** Normalizer, Validator, Deduplicator, and Deterministic Eligibility Engine built and tested.
- **Database Status:** Safe dry-run mode active. No unauthorized writes attempted.
- **Ready for Review:** Awaiting user review and MongoDB URI configuration for live batch execution.

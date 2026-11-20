# GramSathi AI — Scheme Dataset Validation & Audit Report

**Generated:** 2026-11-18T16:36:39.605Z  
**Source Dataset:** `maharashtra_verified_schemes.json`  
**Execution Mode:** ⚡ LIVE DATABASE UPSERT

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Processed** | 25 | 100.0% |
| **Successfully Normalized** | 25 | 100.0% |
| **Passed Validation (Valid)** | 25 | 100.0% |
| **Rejected / Invalid** | 0 | 0.0% |
| **Duplicates Detected** | 0 | - |
| **Officially Verified Records** | 25 | 100.0% |
| **Unverified / Scraped Records** | 0 | 0.0% |
| **Live Database Upserts** | 25 | - |

---

## 2. 10 Data Rules Compliance

1. **No Fabrication**: All scheme IDs, benefits, and rules originate from verified official gazettes or stated source metadata.
2. **No Inferring Missing Criteria**: Unstated age, income, and caste requirements remain `null` and never default to arbitrary limits.
3. **Preserve Original Text**: Full raw eligibility narrative preserved in `eligibility.rawText`.
4. **Structured vs Unparsed Separation**: Machine-readable rule engines query `eligibility.structured` while legal caveats live in raw text.
5. **Null Preservation**: Missing document checklists or income caps stay `null`.
6. **Source Attribution**: Every record retains its `officialSourceUrl` and `dataCollectionSource`.
7. **Deduplication**: Multi-key resolution (ID, slug, normalized title) prevents duplicate schemes.
8. **Date Tracking**: Timestamps recorded in `governance.dataCollectionDate` and `governance.lastVerifiedDate`.
9. **No Unverified Elevation**: Records without .gov.in/.nic.in provenance or Government Resolution (GR) cannot be marked as `verified`.
10. **Licensing**: Source licenses documented and respected.

---

## 3. Rejected Records Log
_No records were rejected during this run._

---

## 4. Duplicates & Merge Resolution Log
_No duplicate conflicts detected._

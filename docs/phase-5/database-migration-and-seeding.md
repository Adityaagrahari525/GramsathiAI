# GramSathi AI — Database Migration & Scheme Seeding Pipeline

## 1. Overview
The seeding pipeline ensures that official Maharashtra government schemes are reliably imported into MongoDB Atlas with full idempotency, zero duplication, and strict data validation.

- **Script**: `server/src/scripts/seedSchemes.ts`
- **Execution Command**:
  ```bash
  npm --prefix server run seed
  ```

---

## 2. Idempotent Upsert Strategy
The seed engine employs MongoDB `findOneAndUpdate` with `{ upsert: true, new: true }`:
- **Query Filter**: `{ $or: [{ schemeId: s.id }, { id: s.id }] }`
- **Behavior**:
  - If a scheme document exists, it updates all fields with the latest verified government criteria.
  - If a scheme does not exist, it inserts a new document.
  - Multiple runs will never create duplicate scheme entries.

---

## 3. Seeded Verified Maharashtra Schemes
The pipeline seeds 8 verified schemes:
1. **Mukhyamantri Saur Krushi Vahini Yojana 2.0 (MSKVY 2.0)** (`saur-krushi-vahini`) — 90%-95% solar pump subsidy.
2. **Mukhyamantri Majhi Ladki Bahin Yojana** (`ladki-bahin`) — ₹1,500/month DBT for rural women.
3. **Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (EBC)** (`ebc-scholarship`) — 50% tuition waiver for EBC students.
4. **Chief Minister Employment Generation Programme (CMEGP)** (`cmegp-msme`) — 15%-35% capital subsidy for rural micro-enterprises.
5. **PM KISAN Samman Nidhi + Namo Shetkari Mahasanman** (`pm-kisan`) — ₹12,000/year direct cash transfer.
6. **MahaDBT Agricultural Mechanization (Tractor Subsidy)** (`tractor-subsidy`) — Up to ₹1,25,000 subsidy on farm equipment.
7. **Pradhan Mantri Fasal Bima Yojana (Pik Vima — ₹1 Farmer Share)** (`pik-vima`) — Comprehensive crop insurance.
8. **Sanjay Gandhi Niradhar Anudan Yojana** (`sanjay-gandhi-niradhar`) — ₹1,500/month financial assistance for destitute persons.

---

## 4. Dry-Run & Offline Execution
When `MONGODB_URI` is not set or the cluster is offline, the seed script automatically runs in **dry-run mode**:
- Validates all scheme schemas in memory without failing.
- Displays full validation report.
- Informs the administrator on how to configure `MONGODB_URI` in `.env` to commit changes.

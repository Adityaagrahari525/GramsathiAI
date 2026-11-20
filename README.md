# GramSathi AI — Public Civic Service Platform (Website)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Maharashtra Civic Alignment](https://img.shields.io/badge/Govt%20of-Maharashtra%20MahaDBT-brightgreen.svg)](https://mahadbt.maharashtra.gov.in)
[![AI Engine](https://img.shields.io/badge/Google-Gemini%20API-orange.svg)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/React%20%7C%20Node.js%20%7C%20MongoDB-Atlas-informational.svg)]()

> **GramSathi AI (ग्रामसाथी AI)** is an AI-powered multilingual government scheme discovery, eligibility verification, and digital assistance platform designed for farmers, rural citizens, women entrepreneurs, artisans, and youth in Maharashtra, India.
>
> It demystifies complex government scheme notifications and eligibility criteria into transparent, accessible, and actionable guidance in native languages (**Marathi**, **Hindi**, **English**) so every eligible citizen receives their rightful benefits directly without middlemen.

---

## 🏛️ Platform Overview

The GramSathi AI web portal provides a guided public-service experience adhering strictly to approved civic design standards (civic blue, emerald accents, clean white cards, high accessibility standards).

### Key Features
1. **Interactive Scheme Catalog (`/schemes`)**:
   - Filter verified central and state schemes by sector: Agriculture, Women & Child Development, MSME & Livelihood, Education & Scholarships, Irrigation & Water, Social Justice, and Health.
   - Live search by Marathi and English keywords.
2. **Deterministic Eligibility Calculator (`/eligibility`)**:
   - Step-by-step citizen assessment factoring in landholding (acres), annual income, caste category, irrigation status, disability, and Kisan Credit Card (KCC).
   - Generates ranked eligible recommendations with transparent justification.
3. **AI GramMitra Assistant (`/assistant`)**:
   - 24/7 multilingual conversational intelligence grounded in official government resolutions and guidelines.
4. **Reverse Need Discovery (`/find-by-need`)**:
   - Natural language matching enabling citizens to describe real-world problems (e.g. *"I need a subsidy for a farm pond and well"*) and get relevant schemes.
5. **Benefit Synergy Engine (`/synergy`)**:
   - Identifies smart combinations of complementary government schemes (e.g., Solar Pump + Farm Pond + Micro-Irrigation) to maximize financial assistance.
6. **Fake Scheme & Fraud Checker (`/fraud-check`)**:
   - Scam and fake WhatsApp message detector to safeguard rural citizens from fraudulent agents and malicious links.
7. **Scheme Application Tracker (`/tracker`)**:
   - Milestone tracker guiding citizens through Discovery, Eligibility Verification, Document Preparation, Application, and Approval.
8. **Citizen Profile & Portfolio (`/profile`, `/saved`)**:
   - Profile management with persistent bookmarks and application history synced with MongoDB Atlas.

---

## 💻 Tech Stack (Web & Backend)

### Frontend (Website)
- **Framework**: React 19 + Vite 8
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Civic Blue & Emerald Government Theme)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7)

### Backend API (`server/`)
- **Runtime**: Node.js + Express
- **Language**: TypeScript (`tsx watch`)
- **Database**: MongoDB Atlas (`gramsathi` database) via Mongoose
- **Authentication**: JWT (JSON Web Tokens) with secure password hashing (bcryptjs)
- **AI Integration**: Google Gemini API via official `@google/genai`
- **Validation**: Zod schema validation

---

## 📁 Repository Structure

```
gramsathi/
├── client/                     # Existing GramSathi AI Web Application
│   ├── src/
│   │   ├── components/         # Civic UI components (Hero, Navbar, TopBar, SectorGrid, etc.)
│   │   ├── context/            # Language, CitizenProfile, SavedSchemes, JourneyTracker
│   │   ├── data/               # Official Maharashtra schemes database & translations
│   │   ├── pages/              # 13 approved civic web pages
│   │   ├── services/           # Backend API clients & eligibility engine
│   │   ├── App.tsx             # Main client router
│   │   └── main.tsx            # Entrypoint
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Shared REST API Backend
│   ├── src/
│   │   ├── config/             # Database & environment variables
│   │   ├── controllers/        # Auth, Scheme, User, Eligibility, Assistant controllers
│   │   ├── engine/             # Deterministic eligibility evaluation engine
│   │   ├── middleware/         # JWT auth, rate limiter, request validator
│   │   ├── models/             # Mongoose schemas (User, Scheme, SavedScheme, Journey)
│   │   ├── routes/             # REST endpoints
│   │   └── server.ts           # Server bootstrap
│   └── package.json
├── docs/                       # Architecture and project documentation
└── package.json                # Root scripts orchestrator
```

> **Note:** The separate mobile application code (React Native & Expo) is hosted on the dedicated **`mobile`** branch of this repository.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ or v22+ recommended)
- npm or yarn
- MongoDB Atlas connection string (configured in `server/.env`)
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Adityaagrahari525/GramsathiAI.git
   cd GramsathiAI
   ```

2. **Install dependencies**:
   ```bash
   # Install root and client dependencies
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

3. **Configure Environment Variables**:
   In `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_ORIGIN=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Website & Backend

- **Start the Website (Frontend)**:
  ```bash
  npm run dev
  # Opens at http://localhost:5173
  ```

- **Start the Backend Server**:
  ```bash
  npm run server:dev
  # API running at http://localhost:5000/api
  # Health check at http://localhost:5000/api/health
  ```

- **Production Build (Website)**:
  ```bash
  npm run build
  ```

---

## 📱 Mobile Application

Looking for the GramSathi AI Mobile App?
Switch to the `mobile` branch:
```bash
git checkout mobile
```
See `mobile/README.md` on that branch for complete instructions to run with Expo and React Native.

---

## 📄 License
This project is licensed under the MIT License.

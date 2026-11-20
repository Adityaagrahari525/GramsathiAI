# GramSathi AI — Citizen Mobile Application (React Native / Expo)

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-blue.svg)]()
[![Framework](https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg)]()
[![Expo](https://img.shields.io/badge/Expo-SDK%2058-black.svg)]()
[![Backend](https://img.shields.io/badge/Shared%20Backend-Node.js%20%2B%20MongoDB-green.svg)]()

> **GramSathi AI Mobile App** is a dedicated, mobile-first civic application built specifically for farmers, rural citizens, women self-help groups, and micro-entrepreneurs in Maharashtra, India.
>
> Designed with responsive touch-friendly controls (>44px touch targets), high contrast readability, offline resilience, and zero desktop sidebars, it provides complete feature parity with the GramSathi AI website while sharing the exact same backend and database.

---

## 📲 Mobile-First Design & Architecture

- **True Native Experience**: Built using React Native 0.88, Expo SDK 58, and React Navigation.
- **Unified Backend & Data**: Connects directly to the existing GramSathi AI Express & MongoDB Atlas backend (`/api`), sharing:
  - Citizen user accounts & JWT authentication
  - Saved schemes portfolio
  - Scheme journey milestones
  - Deterministic eligibility calculations
  - Multilingual AI GramMitra assistant (powered by Gemini API)
- **Offline & Low-Bandwidth Caching**: Utilizes `@react-native-async-storage/async-storage` for local state persistence, ensuring smooth functionality in rural areas with intermittent connectivity.
- **Language Support**: Seamless native switching between **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**.

---

## 🗺️ Complete Website-to-Mobile Screen Mapping

Every page and feature from the GramSathi AI website is mapped directly into the mobile interface:

| Mobile Navigation | Screen Component | Corresponding Website Route | Functionality |
|---|---|---|---|
| **Bottom Tab: Home** | `HomeScreen` | `/` | Hero card, search, popular need pills, 8 sector grid, 3-step guide |
| **Bottom Tab: Schemes** | `SchemesScreen` | `/schemes` | Filter by sector pills, keyword search, save bookmark toggle |
| **Stack: Scheme Detail** | `SchemeDetailScreen` | `/scheme/:id` | Tabs for Overview, Eligibility Criteria, Documents, Application Steps, and Official MahaDBT portal link |
| **Bottom Tab: Eligibility** | `EligibilityCheckerScreen` | `/eligibility` | Citizen input form (land acres, income, caste, irrigation, KCC) |
| **Stack: Results** | `EligibilityResultsScreen` | `/eligibility/results` | Evaluated matching schemes with justification and financial benefit |
| **Bottom Tab: AI GramMitra**| `AssistantScreen` | `/assistant` | Multilingual AI assistant with conversational guidance |
| **Stack: Need Discovery** | `NeedDiscoveryScreen` | `/find-by-need` | Reverse scheme discovery using natural citizen problem descriptions |
| **Stack: Benefit Synergy** | `BenefitSynergyScreen` | `/synergy` | Smart multi-scheme combination packages (Solar + Well + Drip) |
| **Stack: Fraud Checker** | `FraudCheckerScreen` | `/fraud-check` | Scam and fake scheme WhatsApp message authenticity detector |
| **Stack: Journey Tracker** | `TrackerScreen` | `/tracker` | Stage-by-stage application tracker with interactive checkboxes |
| **Stack: Saved Schemes** | `SavedSchemesScreen` | `/saved` | Bookmarked schemes portfolio synced with MongoDB Atlas |
| **Stack: Citizen Profile** | `ProfileScreen` | `/profile` | Profile details (land, village, phone) and account management |
| **Stack: Authentication** | `SignInScreen` / `RegisterScreen` | `/signin` / `/register` | Secure mobile JWT login & registration |
| **Bottom Tab: More** | `MoreMenuScreen` | Navigation Drawer | Quick access to all secondary tools, language switcher, and settings |

---

## 🛠️ Project Structure

```
mobile/
├── assets/                  # App icons, splash screens, civic badges
├── src/
│   ├── components/          # Reusable mobile UI components
│   ├── context/             # React context providers
│   │   ├── LanguageContext.tsx       # Multilingual state (mr, hi, en)
│   │   ├── CitizenProfileContext.tsx # User profile & auth state
│   │   ├── SavedSchemesContext.tsx   # Bookmarked schemes state & cloud sync
│   │   └── JourneyTrackerContext.tsx # Application milestone tracker
│   ├── data/                # Scheme types and translation dictionaries
│   │   ├── schemesData.ts   # Shared scheme models
│   │   └── translations.ts  # Shared translations
│   ├── navigation/          # React Navigation setup
│   │   ├── AppNavigator.tsx # Root Native Stack & Bottom Tab navigators
│   │   └── types.ts         # Navigation param lists
│   ├── screens/             # Mobile screens (Home, Schemes, Detail, Tracker, etc.)
│   └── services/
│       └── apiClient.ts     # Mobile REST client (Android emulator & web network aware)
├── App.tsx                  # Root Expo application entry
├── app.json                 # Expo configuration
├── package.json             # Mobile dependencies
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Running the Mobile Application

### Prerequisites
1. Node.js (v20+)
2. Expo CLI (`npx expo`)
3. Optional for physical device: **Expo Go** app installed from Google Play Store or Apple App Store.
4. Optional for emulator: Android Studio (Android Emulator) or Xcode (iOS Simulator on macOS).

### 1. Install Dependencies
From the `mobile/` directory:
```bash
cd mobile
npm install
```

### 2. Launching Options

#### Option A: Run on Web Browser (Instant Preview)
```bash
npm run web
# Or from root directory:
npm run mobile:web
# Opens on http://localhost:8081 or http://localhost:8082
```

#### Option B: Run on Physical Device (Android / iOS via Expo Go)
```bash
npm start
# Or from root directory:
npm run mobile:start
```
- Open the **Expo Go** app on your phone.
- Scan the QR code displayed in your terminal or Metro browser window.

#### Option C: Run on Android Emulator
```bash
npm run android
# Or from root directory:
npm run mobile:android
```

#### Option D: Run on iOS Simulator (macOS only)
```bash
npm run ios
# Or from root directory:
npm run mobile:ios
```

---

## 🔒 Security & Data Synchronization
- Passwords are never stored in plaintext.
- JWT tokens and offline data are securely managed via `@react-native-async-storage/async-storage`.
- Changes made from either the mobile app or website synchronize automatically to the shared MongoDB database when online.

---

## 📄 License
This project is licensed under the MIT License.

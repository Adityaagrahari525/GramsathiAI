import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { HomeNavbar } from './components/HomeNavbar';
import { LiveBanner } from './components/LiveBanner';
import { HeroSection } from './components/HeroSection';
import { ActionCards } from './components/ActionCards';
import { SectorGrid } from './components/SectorGrid';
import { StepsSection } from './components/StepsSection';
import { Footer } from './components/Footer';
import { AskAssistantModal } from './components/AskAssistantModal';
import { EligibilityModal } from './components/EligibilityModal';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { SignInPage } from './pages/SignInPage';
import { RegisterPage } from './pages/RegisterPage';
import { AssistantPage } from './pages/AssistantPage';
import { TrackerPage } from './pages/TrackerPage';
import { SavedSchemesPage } from './pages/SavedSchemesPage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { EligibilityResultsPage } from './pages/EligibilityResultsPage';
import { CitizenProfilePage } from './pages/CitizenProfilePage';
import { NeedDiscoveryPage } from './pages/NeedDiscoveryPage';
import { BenefitSynergyPage } from './pages/BenefitSynergyPage';
import { FraudCheckerPage } from './pages/FraudCheckerPage';

import { ToastProvider } from './context/ToastContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { CitizenProfileProvider } from './context/CitizenProfileContext';
import { SavedSchemesProvider } from './context/SavedSchemesContext';
import { JourneyTrackerProvider } from './context/JourneyTrackerContext';

// ─── Landing Page (Home) ───────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  // Modals state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  const handleFontSizeChange = (delta: number) => {
    if (delta === 0) setFontSizeOffset(0);
    else setFontSizeOffset((prev) => Math.max(-2, Math.min(3, prev + delta)));
  };

  const handleSearch = (query: string, _scope: string) => {
    navigate(`/schemes?q=${encodeURIComponent(query)}`);
  };

  const handlePopularSelect = (tag: string) => {
    navigate(`/schemes?q=${encodeURIComponent(tag)}`);
  };

  const handleSelectSector = (sectorId: string) => {
    navigate(`/schemes?sector=${encodeURIComponent(sectorId)}`);
  };

  const handleVoiceTrigger = () => {
    setIsAssistantOpen(true);
  };

  const handleStartStep = (stepNumber: number) => {
    if (stepNumber === 1) {
      setIsAssistantOpen(true);
    } else if (stepNumber === 2) {
      navigate('/eligibility');
    } else if (stepNumber === 3) {
      navigate('/schemes');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900"
      style={{ fontSize: `${100 + fontSizeOffset * 6}%` }}
    >
      {/* 1. Citizen Accessibility Bar */}
      <TopBar
        currentLang={language}
        onLangChange={setLanguage}
        fontSize={fontSizeOffset}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* 2. Main Civic Navigation Header with Horizontal Sliding Bar & Sidebar */}
      <HomeNavbar currentLang={language} />

      {/* 3. Official Status & Gazette Sync Bar */}
      <LiveBanner currentLang={language} />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* 4. Hero Section with Search & Popular Pills */}
        <HeroSection
          currentLang={language}
          onSearch={handleSearch}
          onPopularSelect={handlePopularSelect}
          onVoiceTrigger={handleVoiceTrigger}
        />

        {/* 5. 3 Action Cards (Find Schemes, Check Eligibility, Ask AI) */}
        <ActionCards
          onBrowseDirectory={() => navigate('/schemes')}
          onCheckEligibility={() => navigate('/eligibility')}
          onAskAI={() => setIsAssistantOpen(true)}
        />

        {/* 6. Explore Schemes by Sector & Need (8 Sector Grid) */}
        <SectorGrid
          onSelectSector={handleSelectSector}
          onViewAll={() => navigate('/schemes')}
        />

        {/* 7. How GramSathi AI Works in 3 Simple Steps */}
        <StepsSection
          onStartStep={handleStartStep}
        />
      </main>

      {/* 8. Official Civic Footer */}
      <Footer currentLang={language} />

      {/* Modals & Overlays */}
      <AskAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentLang={language}
      />

      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        currentLang={language}
      />
    </div>
  );
}

// ─── App Router ───────────────────────────────────────────────────────────────
export function App() {
  return (
    <ToastProvider>
      <AccessibilityProvider>
        <LanguageProvider>
          <CitizenProfileProvider>
            <SavedSchemesProvider>
              <JourneyTrackerProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/schemes" element={<SchemesPage />} />
                  <Route path="/scheme/:id" element={<SchemeDetailPage />} />
                  <Route path="/schemes/:id" element={<SchemeDetailPage />} />
                  <Route path="/eligibility" element={<EligibilityCheckerPage />} />
                  <Route path="/eligibility/checker" element={<EligibilityCheckerPage />} />
                  <Route path="/eligibility/results" element={<EligibilityResultsPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/login" element={<SignInPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/assistant" element={<AssistantPage />} />
                  <Route path="/tracker" element={<TrackerPage />} />
                  <Route path="/journey" element={<TrackerPage />} />
                  <Route path="/saved" element={<SavedSchemesPage />} />
                  <Route path="/saved-schemes" element={<SavedSchemesPage />} />
                  <Route path="/profile" element={<CitizenProfilePage />} />
                  <Route path="/citizen/profile" element={<CitizenProfilePage />} />
                  <Route path="/needs" element={<NeedDiscoveryPage />} />
                  <Route path="/find-by-need" element={<NeedDiscoveryPage />} />
                  <Route path="/synergy" element={<BenefitSynergyPage />} />
                  <Route path="/combinations" element={<BenefitSynergyPage />} />
                  <Route path="/fraud-check" element={<FraudCheckerPage />} />
                  <Route path="/verify-message" element={<FraudCheckerPage />} />
                </Routes>
              </JourneyTrackerProvider>
            </SavedSchemesProvider>
          </CitizenProfileProvider>
        </LanguageProvider>
      </AccessibilityProvider>
    </ToastProvider>
  );
}

export default App;

import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
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

// ─── Landing Page (Home) ───────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<'en' | 'mr' | 'hi'>('en');
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
      setIsEligibilityOpen(true);
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
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        fontSize={fontSizeOffset}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* 2. Main Civic Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onOpenDirectory={() => navigate('/schemes')}
        onOpenEligibility={() => setIsEligibilityOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* 3. Official Status & Gazette Sync Bar */}
      <LiveBanner currentLang={currentLang} />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* 4. Hero Section with Search & Popular Pills */}
        <HeroSection
          currentLang={currentLang}
          onSearch={handleSearch}
          onPopularSelect={handlePopularSelect}
          onVoiceTrigger={handleVoiceTrigger}
        />

        {/* 5. 3 Action Cards (Find Schemes, Check Eligibility, Ask AI) */}
        <ActionCards
          onBrowseDirectory={() => navigate('/schemes')}
          onCheckEligibility={() => setIsEligibilityOpen(true)}
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
      <Footer currentLang={currentLang} />

      {/* Modals & Overlays */}
      <AskAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentLang={currentLang}
      />

      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}

// ─── App Router ───────────────────────────────────────────────────────────────
export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/schemes" element={<SchemesPage />} />
      <Route path="/scheme/:id" element={<SchemeDetailPage />} />
      <Route path="/schemes/:id" element={<SchemeDetailPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;

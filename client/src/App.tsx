import { useState } from 'react';
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
import { SchemeDirectoryModal } from './components/SchemeDirectoryModal';

export function App() {
  const [currentLang, setCurrentLang] = useState<'en' | 'mr' | 'hi'>('en');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  // Modals state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [directorySector, setDirectorySector] = useState('all');

  const handleFontSizeChange = (delta: number) => {
    if (delta === 0) setFontSizeOffset(0);
    else setFontSizeOffset((prev) => Math.max(-2, Math.min(3, prev + delta)));
  };

  const handleSearch = (query: string, _scope: string) => {
    setDirectorySearchQuery(query);
    setDirectorySector('all');
    setIsDirectoryOpen(true);
  };

  const handlePopularSelect = (tag: string) => {
    setDirectorySearchQuery(tag);
    setDirectorySector('all');
    setIsDirectoryOpen(true);
  };

  const handleSelectSector = (sectorId: string) => {
    setDirectorySector(sectorId);
    setDirectorySearchQuery('');
    setIsDirectoryOpen(true);
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
      setIsDirectoryOpen(true);
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
        onOpenDirectory={() => {
          setDirectorySearchQuery('');
          setDirectorySector('all');
          setIsDirectoryOpen(true);
        }}
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
          onBrowseDirectory={() => {
            setDirectorySearchQuery('');
            setDirectorySector('all');
            setIsDirectoryOpen(true);
          }}
          onCheckEligibility={() => setIsEligibilityOpen(true)}
          onAskAI={() => setIsAssistantOpen(true)}
        />

        {/* 6. Explore Schemes by Sector & Need (8 Sector Grid) */}
        <SectorGrid
          onSelectSector={handleSelectSector}
          onViewAll={() => {
            setDirectorySearchQuery('');
            setDirectorySector('all');
            setIsDirectoryOpen(true);
          }}
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

      <SchemeDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        initialSearchQuery={directorySearchQuery}
        initialSector={directorySector}
      />
    </div>
  );
}

export default App;

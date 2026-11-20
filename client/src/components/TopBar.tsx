import React from 'react';
import { Volume2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage, type SupportedLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { BrowserVoiceService } from '../services/voiceService';

interface TopBarProps {
  currentLang?: 'en' | 'mr' | 'hi';
  onLangChange?: (lang: 'en' | 'mr' | 'hi') => void;
  fontSize?: number;
  onFontSizeChange?: (delta: number) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLang: propLang,
  onLangChange: propOnLangChange,
  onFontSizeChange: propOnFontSizeChange,
}) => {
  const { showToast } = useToast();
  const { language: contextLang, setLanguage } = useLanguage();
  const { fontSizeOffset, setFontSizeOffset } = useAccessibility();

  // Active language prioritizes context
  const activeLang: SupportedLanguage = contextLang || propLang || 'mr';

  const handleLangSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    if (propOnLangChange) {
      propOnLangChange(lang);
    }
  };

  const handleFontDelta = (delta: number) => {
    if (delta === 0) {
      setFontSizeOffset(0);
    } else {
      setFontSizeOffset((prev) => prev + delta);
    }
    if (propOnFontSizeChange) {
      propOnFontSizeChange(delta);
    }
  };

  return (
    <div className="bg-[#f1f5f9] border-b border-slate-200 text-slate-700 text-xs py-1.5 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* State Govt Emblem / Identity */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-[#1850b5] flex items-center justify-center text-[10px] text-white font-bold">
            🏛
          </div>
          <span className="font-medium text-slate-800">
            Government of Maharashtra Initiative
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-600 hidden sm:inline">
            Aaple Sarkar / DigiGov Digital Civic Assistant
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center space-x-4">
          {/* Font Resizing */}
          <div className="flex items-center space-x-1 border-r border-slate-300 pr-3">
            <button
              type="button"
              onClick={() => handleFontDelta(-1)}
              title="Decrease Font Size (A-)"
              className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                fontSizeOffset < 0 ? 'bg-blue-100 text-[#1850b5] font-bold' : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => handleFontDelta(0)}
              title="Reset Font Size (A)"
              className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                fontSizeOffset === 0 ? 'bg-blue-100 text-[#1850b5] font-bold' : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleFontDelta(1)}
              title="Increase Font Size (A+)"
              className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                fontSizeOffset > 0 ? 'bg-blue-100 text-[#1850b5] font-bold' : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              A+
            </button>
          </div>

          {/* Screen Reader Aid */}
          <button
            type="button"
            onClick={() => {
              const text =
                activeLang === 'mr'
                  ? 'ग्रामसाथी एआय - महाराष्ट्र शासन योजना डिजिटल सहाय्यक. आपले स्वागत आहे.'
                  : activeLang === 'hi'
                  ? 'ग्रामसाथी एआई - महाराष्ट्र शासन योजना डिजिटल सहायक. आपका स्वागत है।'
                  : 'GramSathi AI - Public Civic Service Platform for Maharashtra. Welcome.';
              const spoken = BrowserVoiceService.speak(text, activeLang);
              if (!spoken) {
                showToast(
                  'Screen reader text-to-speech audio is not supported on this browser.',
                  'warning'
                );
              }
            }}
            className="flex items-center space-x-1 text-slate-700 hover:text-blue-700 border-r border-slate-300 pr-3 cursor-pointer"
            title="Screen Reader Announcement"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline font-medium">Screen Reader</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleLangSelect('mr')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLang === 'mr'
                  ? 'bg-[#1850b5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => handleLangSelect('hi')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLang === 'hi'
                  ? 'bg-[#1850b5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => handleLangSelect('en')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLang === 'en'
                  ? 'bg-[#1850b5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

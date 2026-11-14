import React from 'react';
import { Volume2 } from 'lucide-react';

interface TopBarProps {
  currentLang: 'en' | 'mr' | 'hi';
  onLangChange: (lang: 'en' | 'mr' | 'hi') => void;
  fontSize: number;
  onFontSizeChange: (delta: number) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLang,
  onLangChange,
  fontSize: _fontSize,
  onFontSizeChange,
}) => {
  return (
    <div className="bg-[#f1f5f9] border-b border-slate-200 text-slate-700 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
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
              onClick={() => onFontSizeChange(-1)}
              title="Decrease Font Size"
              className="px-1.5 py-0.5 rounded hover:bg-slate-200 font-semibold cursor-pointer"
            >
              A-
            </button>
            <button
              onClick={() => onFontSizeChange(0)}
              title="Reset Font Size"
              className="px-1.5 py-0.5 rounded hover:bg-slate-200 font-semibold cursor-pointer"
            >
              A
            </button>
            <button
              onClick={() => onFontSizeChange(1)}
              title="Increase Font Size"
              className="px-1.5 py-0.5 rounded hover:bg-slate-200 font-semibold cursor-pointer"
            >
              A+
            </button>
          </div>

          {/* Screen Reader Aid */}
          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(
                  currentLang === 'mr'
                    ? 'ग्रामसाथी एआय - महाराष्ट्र शासन योजना डिजिटल सहाय्यक'
                    : 'GramSathi AI - Public Civic Service Platform'
                );
                window.speechSynthesis.speak(utterance);
              } else {
                alert('Screen Reader synthesis active.');
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
              onClick={() => onLangChange('mr')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                currentLang === 'mr'
                  ? 'bg-[#1850b5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLangChange('hi')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                currentLang === 'hi'
                  ? 'bg-[#1850b5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLangChange('en')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                currentLang === 'en'
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

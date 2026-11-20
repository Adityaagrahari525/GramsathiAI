import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, type SupportedLanguage } from '../data/translations';

export type { SupportedLanguage };

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'gramsathi_language_pref';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'mr' || stored === 'en' || stored === 'hi') {
        return stored;
      }
    } catch {
      // ignore storage error
    }
    return 'mr'; // Default Marathi
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage error
    }
  };

  // Sync to document lang attribute
  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const t = (key: string): string => {
    if (!key) return '';
    const trimmed = key.trim();
    // 1. Exact match in active language
    if (TRANSLATIONS[language]?.[trimmed]) {
      return TRANSLATIONS[language][trimmed];
    }
    if (TRANSLATIONS[language]?.[key]) {
      return TRANSLATIONS[language][key];
    }
    // 2. Fallback to English dict or bare key
    return TRANSLATIONS.en?.[trimmed] || TRANSLATIONS.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

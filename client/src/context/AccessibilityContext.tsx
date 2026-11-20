import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextValue {
  fontSizeOffset: number;
  setFontSizeOffset: (delta: number | ((prev: number) => number)) => void;
  resetFontSize: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

const STORAGE_KEY = 'gramsathi_font_size_offset';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSizeOffset, setOffsetState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const val = parseInt(stored, 10);
        if (!isNaN(val)) return Math.max(-2, Math.min(3, val));
      }
    } catch {
      // Fallback default
    }
    return 0;
  });

  const setFontSizeOffset = (delta: number | ((prev: number) => number)) => {
    setOffsetState((prev) => {
      const next = typeof delta === 'function' ? delta(prev) : delta;
      const clamped = Math.max(-2, Math.min(3, next));
      try {
        localStorage.setItem(STORAGE_KEY, clamped.toString());
      } catch {
        // Ignore storage errors
      }
      return clamped;
    });
  };

  const increaseFontSize = () => {
    setFontSizeOffset((prev) => Math.min(3, prev + 1));
  };

  const decreaseFontSize = () => {
    setFontSizeOffset((prev) => Math.max(-2, prev - 1));
  };

  const resetFontSize = () => {
    setFontSizeOffset(0);
  };

  // Dynamically apply root font size on document html so the entire app scales seamlessly
  useEffect(() => {
    try {
      const percentage = 100 + fontSizeOffset * 6;
      document.documentElement.style.fontSize = `${percentage}%`;
    } catch {
      // Ignore in non-browser environments
    }
  }, [fontSizeOffset]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSizeOffset,
        setFontSizeOffset,
        resetFontSize,
        increaseFontSize,
        decreaseFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return ctx;
}

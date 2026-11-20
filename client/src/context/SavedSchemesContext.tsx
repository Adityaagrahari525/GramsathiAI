import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchemeService } from '../services/schemeService';
import type { Scheme } from '../data/schemesData';
import { useToast } from './ToastContext';
import { apiClient } from '../services/apiClient';

interface SavedSchemesContextValue {
  savedIds: string[];
  savedSchemes: Scheme[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => void;
  removeSaved: (id: string) => void;
  clearAll: () => void;
  count: number;
}

const STORAGE_KEY = 'gramsathi_saved_schemes';

// Initial default saved schemes to match Stitch designs
const DEFAULT_SAVED_IDS = ['saur-krushi-vahini', 'dr-ambedkar-krishi', 'ramai-awas'];

const SavedSchemesContext = createContext<SavedSchemesContextValue | undefined>(undefined);

export const SavedSchemesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read saved schemes from localStorage', e);
    }
    return DEFAULT_SAVED_IDS;
  });

  // Fetch saved schemes from backend if user is authenticated
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      apiClient.getSavedSchemes().then((res) => {
        if (res.success && Array.isArray(res.data?.savedSchemes)) {
          // Merge with current state without losing default demo entries
          setSavedIds((prev) => {
            const combined = Array.from(new Set([...prev, ...(res.data!.savedSchemes)]));
            return combined;
          });
        }
      }).catch((err) => {
        console.warn('[SavedSchemesContext] Could not fetch saved schemes from server:', err);
      });
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Failed to save schemes to localStorage', e);
    }
  }, [savedIds]);

  const isSaved = (id: string): boolean => {
    return savedIds.includes(id);
  };

  const toggleSave = (id: string) => {
    const scheme = SchemeService.getById(id);
    const title = scheme?.name || id;

    setSavedIds((prev) => {
      if (prev.includes(id)) {
        showToast(`Removed "${title.substring(0, 35)}..." from Saved Schemes`, 'info');
        if (apiClient.getToken()) {
          apiClient.removeSavedScheme(id).catch(console.warn);
        }
        return prev.filter((item) => item !== id);
      } else {
        showToast(`Saved "${title.substring(0, 35)}..." to your profile`, 'success');
        if (apiClient.getToken()) {
          apiClient.saveScheme(id).catch(console.warn);
        }
        return [...prev, id];
      }
    });
  };

  const removeSaved = (id: string) => {
    const scheme = SchemeService.getById(id);
    const title = scheme?.name || id;
    setSavedIds((prev) => prev.filter((item) => item !== id));
    if (apiClient.getToken()) {
      apiClient.removeSavedScheme(id).catch(console.warn);
    }
    showToast(`Removed "${title.substring(0, 35)}..." from Saved Schemes`, 'info');
  };

  const clearAll = () => {
    setSavedIds([]);
    showToast('All saved schemes have been removed', 'info');
  };

  // Convert IDs into Scheme objects
  const savedSchemes = savedIds
    .map((id) => SchemeService.getById(id))
    .filter((s): s is Scheme => s !== undefined);

  return (
    <SavedSchemesContext.Provider
      value={{
        savedIds,
        savedSchemes,
        isSaved,
        toggleSave,
        removeSaved,
        clearAll,
        count: savedIds.length,
      }}
    >
      {children}
    </SavedSchemesContext.Provider>
  );
};

export function useSavedSchemes() {
  const context = useContext(SavedSchemesContext);
  if (!context) {
    throw new Error('useSavedSchemes must be used within a SavedSchemesProvider');
  }
  return context;
}

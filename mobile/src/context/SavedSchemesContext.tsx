import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Scheme } from '../data/schemesData';
import { apiClient } from '../services/apiClient';

interface SavedSchemesContextType {
  savedSchemes: Scheme[];
  savedIds: string[];
  saveScheme: (scheme: Scheme) => void;
  removeScheme: (schemeId: string) => void;
  isSaved: (schemeId: string) => boolean;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);
const SAVED_KEY = 'gramsathi_mobile_saved_schemes';

export const SavedSchemesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    // 1. First load from local storage
    AsyncStorage.getItem(SAVED_KEY).then((data) => {
      if (data) {
        try {
          setSavedSchemes(JSON.parse(data));
        } catch {}
      }
    });

    // 2. If authenticated, sync from backend MongoDB
    apiClient.getSavedSchemes().then((res) => {
      if (res.success && res.data?.schemes) {
        const remoteSchemes = res.data.schemes.map((item: any) => item.scheme || item);
        if (remoteSchemes.length > 0) {
          setSavedSchemes(remoteSchemes);
          AsyncStorage.setItem(SAVED_KEY, JSON.stringify(remoteSchemes)).catch(() => {});
        }
      }
    }).catch(() => {});
  }, []);

  const saveScheme = (scheme: Scheme) => {
    setSavedSchemes((prev) => {
      if (prev.some((s) => s.id === scheme.id)) return prev;
      const updated = [...prev, scheme];
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    // Background sync to MongoDB if logged in
    apiClient.saveScheme(scheme.id).catch(() => {});
  };

  const removeScheme = (schemeId: string) => {
    setSavedSchemes((prev) => {
      const updated = prev.filter((s) => s.id !== schemeId);
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    // Background delete from MongoDB if logged in
    apiClient.removeSavedScheme(schemeId).catch(() => {});
  };

  const isSaved = (schemeId: string) => {
    return savedSchemes.some((s) => s.id === schemeId);
  };

  const savedIds = savedSchemes.map((s) => s.id);

  return (
    <SavedSchemesContext.Provider value={{ savedSchemes, savedIds, saveScheme, removeScheme, isSaved }}>
      {children}
    </SavedSchemesContext.Provider>
  );
};

export const useSavedSchemes = () => {
  const context = useContext(SavedSchemesContext);
  if (!context) {
    throw new Error('useSavedSchemes must be used within SavedSchemesProvider');
  }
  return context;
};

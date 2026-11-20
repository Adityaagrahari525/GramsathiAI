import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type JourneyStage = 'discovered' | 'eligibility_checked' | 'documents_gathered' | 'applied' | 'approved' | 'benefit_received';

export interface JourneyItem {
  schemeId: string;
  schemeName: string;
  schemeNameMr?: string;
  stage: JourneyStage;
  updatedAt: string;
  notes?: string;
}

interface JourneyTrackerContextType {
  journeys: JourneyItem[];
  getJourney: (schemeId: string) => JourneyItem | undefined;
  updateStage: (schemeId: string, schemeName: string, stage: JourneyStage, schemeNameMr?: string) => void;
  removeJourney: (schemeId: string) => void;
}

const JourneyTrackerContext = createContext<JourneyTrackerContextType | undefined>(undefined);
const JOURNEY_KEY = 'gramsathi_mobile_journeys';

export const JourneyTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [journeys, setJourneys] = useState<JourneyItem[]>([
    {
      schemeId: 'pm-kusum-yojana',
      schemeName: 'PM-KUSUM Solar Pump Scheme',
      schemeNameMr: 'पीएम-कुसुम सौर कृषी पंप योजना',
      stage: 'documents_gathered',
      updatedAt: new Date().toISOString(),
      notes: '7/12 extract and electricity NOC prepared.',
    },
    {
      schemeId: 'namo-shetkari-sanman-yojana',
      schemeName: 'Namo Shetkari Maha Sanman Nidhi',
      schemeNameMr: 'नमो शेतकरी महासन्मान निधी योजना',
      stage: 'approved',
      updatedAt: new Date().toISOString(),
      notes: 'DBT e-KYC completed successfully.',
    }
  ]);

  useEffect(() => {
    AsyncStorage.getItem(JOURNEY_KEY).then((data) => {
      if (data) {
        try {
          setJourneys(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  const updateStage = (schemeId: string, schemeName: string, stage: JourneyStage, schemeNameMr?: string) => {
    setJourneys((prev) => {
      const existingIndex = prev.findIndex((j) => j.schemeId === schemeId);
      let updated: JourneyItem[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          stage,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updated = [
          ...prev,
          {
            schemeId,
            schemeName,
            schemeNameMr,
            stage,
            updatedAt: new Date().toISOString(),
          },
        ];
      }
      AsyncStorage.setItem(JOURNEY_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const removeJourney = (schemeId: string) => {
    setJourneys((prev) => {
      const updated = prev.filter((j) => j.schemeId !== schemeId);
      AsyncStorage.setItem(JOURNEY_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const getJourney = (schemeId: string) => {
    return journeys.find((j) => j.schemeId === schemeId);
  };

  return (
    <JourneyTrackerContext.Provider value={{ journeys, getJourney, updateStage, removeJourney }}>
      {children}
    </JourneyTrackerContext.Provider>
  );
};

export const useJourneyTracker = () => {
  const context = useContext(JourneyTrackerContext);
  if (!context) {
    throw new Error('useJourneyTracker must be used within JourneyTrackerProvider');
  }
  return context;
};

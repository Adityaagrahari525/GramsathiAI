import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { apiClient } from '../services/apiClient';

export interface DocumentItem {
  id: string;
  name: string;
  nameMr?: string;
  status: 'verified' | 'action_required' | 'pending';
  badge: string;
  subtext: string;
  fileName?: string;
  isMandatory: boolean;
}

export interface SchemeJourney {
  schemeId: string;
  schemeTitle: string;
  currentStage: number; // 1 to 5: Eligibility(1) -> Documents(2) -> Application(3) -> Verification(4) -> Benefit(5)
  totalStages: number;
  stageName: string;
  isStage3Unlocked: boolean;
  completedStages: number[];
  documents: DocumentItem[];
  lastUpdated: string;
  persistenceMode: 'cloud_mongodb' | 'local_demo';
  syncStatus: 'synced' | 'local_only' | 'syncing';
}

interface JourneyTrackerContextValue {
  journey: SchemeJourney;
  hasUploaded8A: boolean;
  isSyncingDigiLocker: boolean;
  persistenceMode: 'cloud_mongodb' | 'local_demo';
  syncDigiLocker: () => Promise<void>;
  upload8A: (file?: File) => void;
  resetJourney: () => void;
  downloadDossier: () => void;
  setStage: (stage: number) => void;
  toggleStageCompletion: (stage: number) => void;
}

const STORAGE_KEY = 'gramsathi_journey_tracker';

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: '712',
    name: '7/12 Land Record Extract (सात-बारा)',
    status: 'verified',
    badge: '✓ Ready (Verified)',
    subtext: 'Gat No. 112/2, Area: 1.01 Hectare • Digitally Signed • Mahabhumi Portal Verified',
    fileName: 'Satbara_Extract_Gat112_2.pdf',
    isMandatory: true,
  },
  {
    id: 'aadhaar',
    name: 'Aadhaar Card (आधार कार्ड)',
    status: 'verified',
    badge: '✓ Ready (Verified)',
    subtext: 'XXXX-XXXX-8921 • NPCI DBT Bank Seeded • Mobile OTP Verified',
    fileName: 'Aadhaar_Masked_8921.pdf',
    isMandatory: true,
  },
  {
    id: 'caste',
    name: 'Caste Certificate & Non-Creamy Layer (OBC)',
    status: 'verified',
    badge: '✓ Ready (Verified)',
    subtext: 'Competent Authority Cert No. MH-PUN-OBC-99211 • Valid until March 31, 2026',
    fileName: 'Caste_Cert_OBC_NonCreamy.pdf',
    isMandatory: false,
  },
  {
    id: 'bank',
    name: 'Bank Passbook / Cancelled Cheque',
    status: 'verified',
    badge: '✓ Ready (Verified)',
    subtext: 'Bank of Maharashtra, Baramati Branch • A/C No. XXXXXXXX4110 • IFSC MAHB0000123',
    fileName: 'Bank_Passbook_DBT_Seeded.pdf',
    isMandatory: true,
  },
  {
    id: 'well',
    name: 'Farm Well Self-Declaration',
    status: 'verified',
    badge: '✓ Ready (Verified)',
    subtext: 'Confirmed existing open dug well/borewell without prior agricultural power connection',
    fileName: 'Water_Source_Self_Affidavit.pdf',
    isMandatory: true,
  },
  {
    id: '8a',
    name: '8-A Land Khata Record Extract',
    status: 'action_required',
    badge: 'Action Required',
    subtext: 'Needs fresh post-April 2024 digitally signed 8-A record with verifiable QR code.',
    isMandatory: true,
  },
];

const DEFAULT_JOURNEY: SchemeJourney = {
  schemeId: 'saur-krushi-vahini',
  schemeTitle: 'Mukhyamantri Saur Krushi Vahini Yojana 2.0 (Solar Agri Pump Scheme)',
  currentStage: 2,
  totalStages: 5,
  stageName: 'Required Document Dossier',
  isStage3Unlocked: false,
  completedStages: [1],
  documents: DEFAULT_DOCUMENTS,
  lastUpdated: '12 Nov 2026',
  persistenceMode: 'local_demo',
  syncStatus: 'local_only',
};

const JourneyTrackerContext = createContext<JourneyTrackerContextValue | undefined>(undefined);

export const JourneyTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [journey, setJourney] = useState<SchemeJourney>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('gramsathi_auth_token');
        return {
          ...DEFAULT_JOURNEY,
          ...parsed,
          persistenceMode: hasToken ? 'cloud_mongodb' : 'local_demo',
          syncStatus: hasToken ? 'synced' : 'local_only',
        };
      }
    } catch (e) {
      console.warn('Failed to load journey from localStorage', e);
    }
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('gramsathi_auth_token');
    return {
      ...DEFAULT_JOURNEY,
      persistenceMode: hasToken ? 'cloud_mongodb' : 'local_demo',
      syncStatus: hasToken ? 'synced' : 'local_only',
    };
  });

  const [isSyncingDigiLocker, setIsSyncingDigiLocker] = useState(false);

  // Sync with backend when token is present
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      apiClient.getJourney(journey.schemeId).then((res) => {
        if (res.success && res.data?.journey) {
          const j = res.data.journey;
          const stageNum = typeof j.currentStage === 'string' ? parseInt(j.currentStage, 10) || 2 : (j.currentStage || 2);
          const completed = (j.completedStages || []).map((s: string | number) => typeof s === 'string' ? parseInt(s, 10) : s);

          setJourney((prev) => ({
            ...prev,
            currentStage: stageNum,
            completedStages: completed.length > 0 ? completed : prev.completedStages,
            persistenceMode: 'cloud_mongodb',
            syncStatus: 'synced',
          }));
        }
      }).catch((err) => {
        console.warn('[JourneyTrackerContext] Backend journey fetch failed:', err);
      });
    }
  }, [journey.schemeId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
    } catch (e) {
      console.warn('Failed to save journey to localStorage', e);
    }
  }, [journey]);

  const hasUploaded8A = journey.documents.find((d) => d.id === '8a')?.status === 'verified';

  const syncWithBackend = (stageNum: number, completed: number[]) => {
    if (apiClient.getToken()) {
      setJourney((prev) => ({ ...prev, syncStatus: 'syncing' }));
      apiClient.updateJourney(journey.schemeId, {
        currentStage: String(stageNum),
        completedStages: completed.map(String),
        status: completed.includes(5) ? 'completed' : 'in_progress',
      }).then(() => {
        setJourney((prev) => ({ ...prev, persistenceMode: 'cloud_mongodb', syncStatus: 'synced' }));
      }).catch((err) => {
        console.warn('[JourneyTrackerContext] Failed to sync journey to backend:', err);
        setJourney((prev) => ({ ...prev, persistenceMode: 'local_demo', syncStatus: 'local_only' }));
      });
    }
  };

  const syncDigiLocker = async () => {
    setIsSyncingDigiLocker(true);
    showToast('Simulating Aaple Sarkar DigiLocker connection (Demonstration Mode)...', 'info');

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsSyncingDigiLocker(false);
        setJourney((prev) => {
          const updatedDocs = prev.documents.map((doc) => {
            if (doc.id === '8a') {
              return {
                ...doc,
                status: 'verified' as const,
                badge: '✓ Ready (Simulated DigiLocker)',
                subtext: 'Demonstration Record (Simulated DigiLocker Sync) • Mock Ref: mock-mahabhumi-8A-413102-112',
                fileName: '8A_Land_Extract_DigiLocker.pdf',
              };
            }
            return doc;
          });

          return {
            ...prev,
            isStage3Unlocked: true,
            documents: updatedDocs,
            lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          };
        });

        showToast('Simulated DigiLocker 8-A sync complete. Stage 3 (Official Application) unlocked in demo.', 'success', 'Dossier Ready (Demo)');
        resolve();
      }, 1500);
    });
  };

  const upload8A = (file?: File) => {
    const fileName = file?.name || '8A_Extract_Digitally_Signed.pdf';
    setJourney((prev) => {
      const updatedDocs = prev.documents.map((doc) => {
        if (doc.id === '8a') {
          return {
            ...doc,
            status: 'verified' as const,
            badge: '✓ Ready (Uploaded)',
            subtext: `Uploaded File: ${fileName} • Verification QR Confirmed (Demo)`,
            fileName,
          };
        }
        return doc;
      });

      return {
        ...prev,
        isStage3Unlocked: true,
        documents: updatedDocs,
        lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
    });

    showToast(`Uploaded ${fileName}. Stage 3 unlocked in demonstration workflow!`, 'success');
  };

  const downloadDossier = () => {
    showToast('Compiling demonstration dossier documents for prototype download...', 'info');
    setTimeout(() => {
      showToast('Demonstration dossier ready: "Gramsathi_MSKVY_Application_Dossier_Ramesh_Gaikwad.pdf" (Sample)', 'success');
    }, 1200);
  };

  const setStage = (stageNum: number) => {
    if (stageNum < 1 || stageNum > 5) return;
    setJourney((prev) => {
      const updated = {
        ...prev,
        currentStage: stageNum,
        stageName:
          stageNum === 1
            ? 'Eligibility Assessment'
            : stageNum === 2
            ? 'Required Document Dossier'
            : stageNum === 3
            ? 'Official Application Submission'
            : stageNum === 4
            ? 'Field Inspection & Verification'
            : 'Commissioning & Benefit Release',
      };
      syncWithBackend(stageNum, updated.completedStages);
      return updated;
    });
  };

  const toggleStageCompletion = (stageNum: number) => {
    setJourney((prev) => {
      const completed = prev.completedStages || [1];
      const exists = completed.includes(stageNum);
      const updatedStages = exists ? completed.filter((s) => s !== stageNum) : [...completed, stageNum].sort();
      syncWithBackend(prev.currentStage, updatedStages);
      return {
        ...prev,
        completedStages: updatedStages,
      };
    });
    showToast(`Updated progress for Stage ${stageNum}`, 'info');
  };

  const resetJourney = () => {
    setJourney(DEFAULT_JOURNEY);
    syncWithBackend(DEFAULT_JOURNEY.currentStage, DEFAULT_JOURNEY.completedStages);
    showToast('Reset scheme application journey to default stage', 'info');
  };

  return (
    <JourneyTrackerContext.Provider
      value={{
        journey,
        hasUploaded8A: !!hasUploaded8A,
        isSyncingDigiLocker,
        persistenceMode: journey.persistenceMode,
        syncDigiLocker,
        upload8A,
        resetJourney,
        downloadDossier,
        setStage,
        toggleStageCompletion,
      }}
    >
      {children}
    </JourneyTrackerContext.Provider>
  );
};

export function useJourneyTracker() {
  const context = useContext(JourneyTrackerContext);
  if (!context) {
    throw new Error('useJourneyTracker must be used within a JourneyTrackerProvider');
  }
  return context;
}

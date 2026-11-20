import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { apiClient } from '../services/apiClient';

export interface CitizenProfile {
  name: string;
  nameMr?: string;
  mobile: string;
  gender: string;
  age: number;
  dob?: string;
  socialCategory: string;
  occupation: string;
  landholding: string;
  landholdingAcres: number;
  waterSource: string;
  incomeSlab: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  pincode: string;
  farmerId: string;
  aadhaarMasked: string;
  hasElectricPump: boolean;
  hasJointHolding: boolean;
  focusAreas: Record<string, boolean>;
  isLoggedIn: boolean;
}

interface CitizenProfileContextValue {
  profile: CitizenProfile;
  updateProfile: (updates: Partial<CitizenProfile>) => void;
  toggleFocusArea: (areaKey: string) => void;
  selectAllFocusAreas: () => void;
  login: (mobile: string, name?: string, password?: string) => Promise<boolean>;
  registerCitizen: (data: {
    name: string;
    mobile: string;
    password?: string;
    district?: string;
    taluka?: string;
    village?: string;
    occupation?: string;
    socialCategory?: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = 'gramsathi_citizen_profile';

const DEFAULT_PROFILE: CitizenProfile = {
  name: 'Ramesh Dattatray Gaikwad',
  nameMr: 'रमेश दत्तात्रय गायकवाड',
  mobile: '+91 98220 44912',
  gender: 'Male',
  age: 48,
  dob: '14/06/1976',
  socialCategory: 'OBC (Other Backward Classes) - Non-Creamy',
  occupation: 'Farmer / Cultivator (Small Farmer, 2.5 Acres)',
  landholding: '2.50 Acres (1.01 Hectare)',
  landholdingAcres: 2.5,
  waterSource: 'Perennial Dug Well',
  incomeSlab: 'upto_120k',
  state: 'Maharashtra',
  district: 'Pune',
  taluka: 'Baramati',
  village: 'Malegaon Budruk (माळेगाव बुद्रुक)',
  pincode: '413102',
  farmerId: 'MH-PUN-2023-5621',
  aadhaarMasked: '**** **** 8921',
  hasElectricPump: false,
  hasJointHolding: true,
  focusAreas: {
    agri: true,
    solar: true,
    housing: true,
    cropInsurance: true,
    dairy: false,
    education: false,
  },
  isLoggedIn: true,
};

const CitizenProfileContext = createContext<CitizenProfileContextValue | undefined>(undefined);

export const CitizenProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<CitizenProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load profile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  });

  // Verify active JWT session with backend on mount
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      apiClient.getMe().then((res) => {
        if (res.success && res.data?.user) {
          const u = res.data.user;
          setProfile((prev) => ({
            ...prev,
            name: u.name || prev.name,
            mobile: u.phone || prev.mobile,
            district: u.district || prev.district,
            taluka: u.taluka || prev.taluka,
            village: u.village || prev.village,
            occupation: u.occupation || prev.occupation,
            socialCategory: u.socialCategory || prev.socialCategory,
            landholdingAcres: u.landholdingAcres ?? prev.landholdingAcres,
            isLoggedIn: true,
          }));
        }
      }).catch((e) => {
        console.warn('Backend session verify failed:', e);
      });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  }, [profile]);

  const updateProfile = (updates: Partial<CitizenProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };

      // Asynchronously sync to backend if authenticated
      if (updated.isLoggedIn && apiClient.getToken()) {
        apiClient.updateProfile({
          name: updated.name,
          phone: updated.mobile,
          district: updated.district,
          taluka: updated.taluka,
          village: updated.village,
          occupation: updated.occupation,
          socialCategory: updated.socialCategory,
          landholdingAcres: updated.landholdingAcres,
        }).catch((err) => {
          console.warn('[CitizenProfileContext] Background profile sync failed:', err);
        });
      }

      return updated;
    });

    showToast('Citizen profile updated successfully', 'success');
  };

  const toggleFocusArea = (areaKey: string) => {
    setProfile((prev) => ({
      ...prev,
      focusAreas: {
        ...prev.focusAreas,
        [areaKey]: !prev.focusAreas[areaKey],
      },
    }));
  };

  const selectAllFocusAreas = () => {
    setProfile((prev) => ({
      ...prev,
      focusAreas: {
        agri: true,
        solar: true,
        housing: true,
        cropInsurance: true,
        dairy: true,
        education: true,
      },
    }));
    showToast('All focus areas enabled for alert dispatch', 'info');
  };

  const login = async (mobile: string, name?: string, password?: string): Promise<boolean> => {
    try {
      const res = await apiClient.login({
        identifier: mobile.replace(/\s+/g, ''),
        password: password || 'GramSathi@2026',
        otp: '482109',
      });

      if (res.success && res.data?.user) {
        const u = res.data.user;
        setProfile((prev) => ({
          ...prev,
          name: u.name || name || prev.name,
          mobile: u.phone.startsWith('+91') ? u.phone : `+91 ${u.phone}`,
          district: u.district || prev.district,
          isLoggedIn: true,
        }));
        showToast(`Welcome back, ${u.name}! Signed in via secure JWT token.`, 'success');
        return true;
      }
    } catch (err) {
      console.warn('[CitizenProfileContext] Backend login request failed, falling back:', err);
    }

    // Fallback mode if backend is unreachable or demo credentials used
    setProfile((prev) => ({
      ...prev,
      mobile: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
      name: name || prev.name,
      isLoggedIn: true,
    }));
    showToast(`Welcome, ${name || profile.name}! Signed in (Local Demonstration Mode).`, 'success');
    return true;
  };

  const registerCitizen = async (data: {
    name: string;
    mobile: string;
    password?: string;
    district?: string;
    taluka?: string;
    village?: string;
    occupation?: string;
    socialCategory?: string;
  }): Promise<boolean> => {
    try {
      const res = await apiClient.register({
        name: data.name,
        phone: data.mobile.replace(/\s+/g, ''),
        password: data.password || 'GramSathi@2026',
        district: data.district,
      });

      if (res.success && res.data?.user) {
        const u = res.data.user;
        setProfile((prev) => ({
          ...prev,
          name: u.name,
          mobile: u.phone.startsWith('+91') ? u.phone : `+91 ${u.phone}`,
          district: u.district || prev.district,
          taluka: data.taluka || prev.taluka,
          village: data.village || prev.village,
          occupation: data.occupation || prev.occupation,
          socialCategory: data.socialCategory || prev.socialCategory,
          isLoggedIn: true,
        }));
        return true;
      }
    } catch (err) {
      console.warn('[CitizenProfileContext] Backend register failed, using local registration:', err);
    }

    setProfile((prev) => ({
      ...prev,
      name: data.name,
      mobile: data.mobile.startsWith('+91') ? data.mobile : `+91 ${data.mobile}`,
      district: data.district || prev.district,
      taluka: data.taluka || prev.taluka,
      village: data.village || prev.village,
      occupation: data.occupation || prev.occupation,
      socialCategory: data.socialCategory || prev.socialCategory,
      isLoggedIn: true,
    }));
    return true;
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // Ignore network errors on logout
    }
    setProfile((prev) => ({ ...prev, isLoggedIn: false }));
    showToast('Signed out of GramSathi AI citizen session', 'info');
  };

  return (
    <CitizenProfileContext.Provider
      value={{
        profile,
        updateProfile,
        toggleFocusArea,
        selectAllFocusAreas,
        login,
        registerCitizen,
        logout,
      }}
    >
      {children}
    </CitizenProfileContext.Provider>
  );
};

export function useCitizenProfile() {
  const context = useContext(CitizenProfileContext);
  if (!context) {
    throw new Error('useCitizenProfile must be used within a CitizenProfileProvider');
  }
  return context;
}

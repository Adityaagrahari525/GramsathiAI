import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, apiClient } from '../services/apiClient';

interface CitizenProfile {
  name: string;
  phone: string;
  district: string;
  taluka: string;
  village: string;
  gender: string;
  age: string;
  casteCategory: string;
  occupation: string;
  landHoldingAcres: string;
  annualIncome: string;
  hasIrrigation: boolean;
  hasDisability: boolean;
  hasKisanCreditCard: boolean;
  hasRationCard: boolean;
  rationCardType: string;
}

const defaultProfile: CitizenProfile = {
  name: '',
  phone: '',
  district: 'Pune',
  taluka: '',
  village: '',
  gender: 'male',
  age: '35',
  casteCategory: 'General / Open',
  occupation: 'Farmer',
  landHoldingAcres: '2.5',
  annualIncome: '120000',
  hasIrrigation: true,
  hasDisability: false,
  hasKisanCreditCard: true,
  hasRationCard: true,
  rationCardType: 'Orange',
};

interface CitizenProfileContextType {
  profile: CitizenProfile;
  user: AuthUser | null;
  updateProfile: (data: Partial<CitizenProfile>) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const CitizenProfileContext = createContext<CitizenProfileContextType | undefined>(undefined);

const PROFILE_KEY = 'gramsathi_mobile_profile';

export const CitizenProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CitizenProfile>(defaultProfile);
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((data) => {
      if (data) {
        try {
          setProfile({ ...defaultProfile, ...JSON.parse(data) });
        } catch {}
      }
    });

    apiClient.getMe().then((res) => {
      if (res.success && res.data?.user) {
        setUserState(res.data.user);
      }
    }).catch(() => {});
  }, []);

  const updateProfile = (data: Partial<CitizenProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
  };

  const logout = () => {
    apiClient.setToken(null);
    setUserState(null);
  };

  return (
    <CitizenProfileContext.Provider value={{ profile, user, updateProfile, setUser, logout }}>
      {children}
    </CitizenProfileContext.Provider>
  );
};

export const useCitizenProfile = () => {
  const context = useContext(CitizenProfileContext);
  if (!context) {
    throw new Error('useCitizenProfile must be used within CitizenProfileProvider');
  }
  return context;
};

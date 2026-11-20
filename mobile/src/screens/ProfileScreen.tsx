import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCitizenProfile } from '../context/CitizenProfileContext';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language } = useLanguage();
  const { profile, updateProfile, user, logout } = useCitizenProfile();

  const [name, setName] = useState(profile.name || user?.name || '');
  const [phone, setPhone] = useState(profile.phone || user?.phone || '');
  const [district, setDistrict] = useState(profile.district || '');
  const [taluka, setTaluka] = useState(profile.taluka || '');
  const [village, setVillage] = useState(profile.village || '');
  const [landHolding, setLandHolding] = useState(profile.landHoldingAcres || '');
  const [income, setIncome] = useState(profile.annualIncome || '');
  const [occupation, setOccupation] = useState(profile.occupation || '');

  const handleSave = () => {
    updateProfile({
      name,
      phone,
      district,
      taluka,
      village,
      landHoldingAcres: landHolding,
      annualIncome: income,
      occupation,
    });
    Alert.alert(
      language === 'mr' ? 'यशस्वी' : 'Saved',
      language === 'mr' ? 'आपली माहिती यशस्वीरीत्या जतन करण्यात आली आहे.' : 'Profile updated successfully.'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Citizen Card Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={32} color="#ffffff" />
        </View>
        <Text style={styles.citizenName}>{name || (language === 'mr' ? 'ग्रामीण नागरिक' : 'Rural Citizen')}</Text>
        <Text style={styles.citizenPhone}>{phone || '+91 98XXXXXXXX'}</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>
            {user ? 'Verified Citizen Account' : 'Guest / Offline Local Profile'}
          </Text>
        </View>
      </View>

      {/* Account Action */}
      {!user ? (
        <View style={styles.authPromptCard}>
          <Text style={styles.authPromptTitle}>
            {language === 'mr' ? 'खाते लिंक करा' : 'Sign In for Cloud Sync'}
          </Text>
          <Text style={styles.authPromptDesc}>
            {language === 'mr'
              ? 'लॉगिन केल्यास आपले जतन केलेले अर्ज आणि प्रोफाईल सुरक्षित राहतील.'
              : 'Sign in to sync your saved schemes and journey tracking across devices.'}
          </Text>
          <View style={styles.authBtnRow}>
            <TouchableOpacity style={styles.authBtn} onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.authBtnText}>{language === 'mr' ? 'लॉगिन करा' : 'Sign In'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.authBtn, styles.registerBtn]} onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.authBtnText, { color: '#2563eb' }]}>{language === 'mr' ? 'नवीन नोंदणी' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.logoutBtnText}>{language === 'mr' ? 'लॉगआऊट करा' : 'Log Out'}</Text>
        </TouchableOpacity>
      )}

      {/* Profile Form */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          {language === 'mr' ? 'नागरिक माहिती (Citizen Details)' : 'Profile Details'}
        </Text>

        <Text style={styles.label}>{language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="उदा. रमेश पाटील" />

        <Text style={styles.label}>{language === 'mr' ? 'मोबाईल नंबर' : 'Phone Number'}</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="10 Digit Mobile" />

        <Text style={styles.label}>{language === 'mr' ? 'जिल्हा' : 'District'}</Text>
        <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="e.g. Pune" />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Text style={styles.label}>{language === 'mr' ? 'तालुका' : 'Taluka'}</Text>
            <TextInput style={styles.input} value={taluka} onChangeText={setTaluka} placeholder="e.g. Haveli" />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.label}>{language === 'mr' ? 'गाव' : 'Village'}</Text>
            <TextInput style={styles.input} value={village} onChangeText={setVillage} placeholder="e.g. Wagholi" />
          </View>
        </View>

        <Text style={styles.label}>{language === 'mr' ? 'व्यवसाय' : 'Occupation'}</Text>
        <TextInput style={styles.input} value={occupation} onChangeText={setOccupation} placeholder="e.g. Farmer / Small Business" />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Text style={styles.label}>{language === 'mr' ? 'जमीन (एकर)' : 'Land (Acres)'}</Text>
            <TextInput style={styles.input} value={landHolding} onChangeText={setLandHolding} keyboardType="numeric" placeholder="2.5" />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.label}>{language === 'mr' ? 'उत्पन्न (₹)' : 'Income (₹)'}</Text>
            <TextInput style={styles.input} value={income} onChangeText={setIncome} keyboardType="numeric" placeholder="120000" />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="checkmark" size={18} color="#ffffff" />
          <Text style={styles.saveBtnText}>{language === 'mr' ? 'माहिती जतन करा' : 'Save Details'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  citizenName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  citizenPhone: {
    fontSize: 13,
    color: '#93c5fd',
    marginBottom: 10,
  },
  statusPill: {
    backgroundColor: '#172554',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '600',
  },
  authPromptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  authPromptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  authPromptDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 12,
  },
  authBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  authBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  authBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 16,
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  saveBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

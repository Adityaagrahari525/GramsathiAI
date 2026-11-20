import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCitizenProfile } from '../context/CitizenProfileContext';
import { apiClient } from '../services/apiClient';

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language } = useLanguage();
  const { setUser } = useCitizenProfile();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert(language === 'mr' ? 'त्रुटी' : 'Error', language === 'mr' ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.login({ phone, password });
      if (res.success && res.data) {
        await apiClient.setToken(res.data.token);
        setUser(res.data.user);
        Alert.alert(language === 'mr' ? 'स्वागत आहे' : 'Success', `${res.data.user.name}, आपले स्वागत आहे!`);
        navigation.goBack();
      } else {
        Alert.alert(language === 'mr' ? 'लॉगिन अयशस्वी' : 'Sign In Failed', res.error?.message || 'Invalid credentials');
      }
    } catch {
      Alert.alert('Error', 'Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed" size={28} color="#2563eb" />
        </View>
        <Text style={styles.title}>{language === 'mr' ? 'नागरिक लॉगिन' : 'Citizen Sign In'}</Text>
        <Text style={styles.subtitle}>
          {language === 'mr'
            ? 'आपल्या नोंदणीकृत मोबाईल नंबरने लॉगिन करा.'
            : 'Access your saved applications and profile data.'}
        </Text>

        <Text style={styles.label}>{language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit mobile number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>{language === 'mr' ? 'पासवर्ड (Password)' : 'Password'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSignIn} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>{language === 'mr' ? 'लॉगिन करा' : 'Sign In'}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {language === 'mr' ? 'नवीन खाते उघडायचे आहे का?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>{language === 'mr' ? 'नोंदणी करा' : 'Register'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language } = useLanguage();
  const { setUser } = useCitizenProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || phone.length < 10) {
      Alert.alert('Error', 'Please fill all required details.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.register({
        name,
        phone,
        password: password || '123456',
        district,
        preferredLanguage: language,
      });

      if (res.success && res.data) {
        await apiClient.setToken(res.data.token);
        setUser(res.data.user);
        Alert.alert(language === 'mr' ? 'यशस्वी' : 'Success', 'Registration completed successfully!');
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Registration Failed', res.error?.message || 'Error creating account');
      }
    } catch {
      Alert.alert('Error', 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-add" size={28} color="#16a34a" />
        </View>
        <Text style={styles.title}>{language === 'mr' ? 'नवीन नागरिक नोंदणी' : 'Citizen Registration'}</Text>
        <Text style={styles.subtitle}>
          {language === 'mr'
            ? 'ग्रामसाथी AI मध्ये खाते तयार करून सर्व योजनांचा लाभ मिळवा.'
            : 'Create your digital public service profile.'}
        </Text>

        <Text style={styles.label}>{language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</Text>
        <TextInput style={styles.input} placeholder="e.g. Ramesh Patil" value={name} onChangeText={setName} />

        <Text style={styles.label}>{language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}</Text>
        <TextInput style={styles.input} placeholder="10-digit mobile" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>{language === 'mr' ? 'जिल्हा' : 'District'}</Text>
        <TextInput style={styles.input} placeholder="e.g. Pune / Kolhapur" value={district} onChangeText={setDistrict} />

        <Text style={styles.label}>{language === 'mr' ? 'पासवर्ड (Password)' : 'Password'}</Text>
        <TextInput style={styles.input} placeholder="Create password" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#16a34a' }]} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>{language === 'mr' ? 'खाते तयार करा' : 'Create Account'}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {language === 'mr' ? 'आधीच खाते आहे?' : 'Already have an account?'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.linkText}>{language === 'mr' ? 'येथे लॉगिन करा' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 14,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  switchText: {
    fontSize: 13,
    color: '#64748b',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
});

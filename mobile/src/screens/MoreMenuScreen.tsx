import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export const MoreMenuScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language, setLanguage } = useLanguage();

  const menuItems = [
    {
      id: 'profile',
      title: language === 'mr' ? 'नागरिक प्रोफाईल व खाते' : 'Citizen Profile & Account',
      subtitle: language === 'mr' ? 'वैयक्तिक माहिती, जमीन व पत्ता व्यवस्थापन' : 'Manage your land, address & profile',
      icon: 'person-circle-outline',
      color: '#2563eb',
      route: 'Profile',
    },
    {
      id: 'saved',
      title: language === 'mr' ? 'जतन केलेल्या योजना (Saved)' : 'Saved Schemes',
      subtitle: language === 'mr' ? 'आपण बुकमार्क केलेल्या सर्व योजनांची यादी' : 'View all your bookmarked schemes',
      icon: 'bookmark-outline',
      color: '#059669',
      route: 'SavedSchemes',
    },
    {
      id: 'tracker',
      title: language === 'mr' ? 'योजना अर्ज ट्रॅकर (Journey Tracker)' : 'Scheme Journey Tracker',
      subtitle: language === 'mr' ? 'अर्जांचे टप्पे व सद्यस्थिती पहा' : 'Track your application stage by stage',
      icon: 'navigate-outline',
      color: '#d97706',
      route: 'Tracker',
    },
    {
      id: 'needs',
      title: language === 'mr' ? 'गरजेनुसार योजना शोध (Reverse Discovery)' : 'Reverse Need Discovery',
      subtitle: language === 'mr' ? 'आपली अडचण सांगा व थेट संबंधित योजना मिळवा' : 'Describe your problem to get matching schemes',
      icon: 'bulb-outline',
      color: '#7c3aed',
      route: 'NeedDiscovery',
    },
    {
      id: 'synergy',
      title: language === 'mr' ? 'योजना जोडणी (Benefit Synergy)' : 'Benefit Synergy Packages',
      subtitle: language === 'mr' ? 'एकाच वेळी अनेक योजनांचा लाभ कसा एकत्र घ्यावा' : 'Combine multiple complementary schemes',
      icon: 'git-merge-outline',
      color: '#ea580c',
      route: 'BenefitSynergy',
    },
    {
      id: 'fraud',
      title: language === 'mr' ? 'सरकारी योजना फसवणूक तपासणी (Fraud Check)' : 'Fake Scheme & Fraud Checker',
      subtitle: language === 'mr' ? 'संशयास्पद मेसेज किंवा लिंक खरी की खोटे तपासा' : 'Verify WhatsApp/SMS scheme authenticity',
      icon: 'shield-half-outline',
      color: '#dc2626',
      route: 'FraudChecker',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Language Quick Switch Card */}
      <View style={styles.langCard}>
        <Text style={styles.langCardTitle}>
          {language === 'mr' ? 'भाषा निवडा / Select Language' : 'Select Language'}
        </Text>
        <View style={styles.langRow}>
          {[
            { id: 'mr', label: 'मराठी' },
            { id: 'hi', label: 'हिंदी' },
            { id: 'en', label: 'English' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.langChip, language === item.id && styles.langChipActive]}
              onPress={() => setLanguage(item.id as any)}
            >
              <Text style={[styles.langChipText, language === item.id && styles.langChipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Menu Navigation List */}
      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSub} numberOfLines={1}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.appName}>ग्रामसाथी AI — Citizen Mobile Application</Text>
        <Text style={styles.appSub}>शासकीय योजना व पारदर्शक लोकसेवा सहाय्यक (महाराष्ट्र शासन संरेखन)</Text>
        <Text style={styles.versionText}>Version 1.0.0 (Fast Mode)</Text>
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
  langCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  langCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  langChipActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  langChipTextActive: {
    color: '#ffffff',
  },
  menuList: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 11,
    color: '#64748b',
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  appSub: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 2,
  },
  versionText: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 6,
  },
});

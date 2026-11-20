import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { SECTORS_LIST } from '../data/schemesData';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const popularSearches = ['पीएम किसान', 'सौर कृषी पंप', 'लाडकी बहीण', 'ट्रॅक्टर अनुदान', 'शेततळे'];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('MainTabs', {
        screen: 'SchemesTab',
        params: { search: searchQuery.trim() },
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Top Civic Authority Banner */}
      <View style={styles.topBanner}>
        <View style={styles.bannerRow}>
          <View style={styles.flagBadge}>
            <Text style={styles.flagText}>🇮🇳 शासनाचा अधिकृत उपक्रम | Govt of Maharashtra</Text>
          </View>
          {/* Language Switcher */}
          <View style={styles.langSelector}>
            {(['mr', 'hi', 'en'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[styles.langBtn, language === lang && styles.langBtnActive]}
              >
                <Text style={[styles.langBtnText, language === lang && styles.langBtnTextActive]}>
                  {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'EN'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Ionicons name="shield-checkmark" size={14} color="#15803d" />
          <Text style={styles.heroBadgeText}>AI-Powered Citizen Assistance</Text>
        </View>
        <Text style={styles.heroTitle}>ग्रामसाथी AI</Text>
        <Text style={styles.heroSubtitle}>
          {language === 'mr'
            ? 'महाराष्ट्रातील शेतकरी व ग्रामीण नागरिकांसाठी सर्व सरकारी योजना एकाच ठिकाणी.'
            : language === 'hi'
            ? 'महाराष्ट्र के किसानों और ग्रामीण नागरिकों के लिए सभी सरकारी योजनाएं एक ही जगह।'
            : 'All government schemes for farmers & rural citizens of Maharashtra in one place.'}
        </Text>

        {/* Search Input Box */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              language === 'mr'
                ? 'उदा. ट्रॅक्टर, सोलर पंप, महिला योजना...'
                : 'Search schemes (e.g. Solar Pump, Tractor)...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#94a3b8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleSearch} style={styles.searchActionBtn}>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Popular Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
          {popularSearches.map((tag, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.tagPill}
              onPress={() => {
                navigation.navigate('MainTabs', {
                  screen: 'SchemesTab',
                  params: { search: tag },
                });
              }}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Primary Action Grid (3 Cards) */}
      <Text style={styles.sectionHeading}>
        {language === 'mr' ? 'महत्वाच्या सेवा' : 'Key Services'}
      </Text>
      <View style={styles.actionGrid}>
        {/* Card 1: Scheme Discovery */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#2563eb' }]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'SchemesTab' })}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#eff6ff' }]}>
            <Ionicons name="library" size={24} color="#2563eb" />
          </View>
          <Text style={styles.actionCardTitle}>
            {language === 'mr' ? 'योजना शोधा' : 'Browse Schemes'}
          </Text>
          <Text style={styles.actionCardDesc}>
            {language === 'mr' ? 'सर्व अधिकृत योजनांची संपूर्ण यादी व नियम' : 'Official list of active schemes & benefits'}
          </Text>
        </TouchableOpacity>

        {/* Card 2: Eligibility Check */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#16a34a' }]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'EligibilityTab' })}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#f0fdf4' }]}>
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
          </View>
          <Text style={styles.actionCardTitle}>
            {language === 'mr' ? 'पात्रता तपासा' : 'Check Eligibility'}
          </Text>
          <Text style={styles.actionCardDesc}>
            {language === 'mr' ? 'आपली जमीन व उत्पन्न टाकून १००% अचूक तपासणी' : 'Instant check based on land & income'}
          </Text>
        </TouchableOpacity>

        {/* Card 3: AI Assistant */}
        <TouchableOpacity
          style={[styles.actionCard, { borderLeftColor: '#7c3aed' }]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'AssistantTab' })}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#f5f3ff' }]}>
            <Ionicons name="chatbubbles" size={24} color="#7c3aed" />
          </View>
          <Text style={styles.actionCardTitle}>
            {language === 'mr' ? 'AI ग्राममित्र' : 'AI GramMitra'}
          </Text>
          <Text style={styles.actionCardDesc}>
            {language === 'mr' ? 'आपल्या भाषेत थेट प्रश्न विचारा व मार्गदर्शन मिळवा' : 'Ask questions in Marathi, Hindi or English'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sectors Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>
          {language === 'mr' ? 'विभागानुसार योजना' : 'Schemes by Sector'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'SchemesTab' })}>
          <Text style={styles.viewAllText}>{language === 'mr' ? 'सर्व पहा' : 'View All'} →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectorsGrid}>
        {SECTORS_LIST.filter(sec => sec.id !== 'all').map((sec) => (
          <TouchableOpacity
            key={sec.id}
            style={styles.sectorTile}
            onPress={() => {
              navigation.navigate('MainTabs', {
                screen: 'SchemesTab',
                params: { sector: sec.id },
              });
            }}
          >
            <View style={styles.sectorIconBg}>
              <Ionicons name="folder-open" size={22} color="#1e40af" />
            </View>
            <Text style={styles.sectorTitle} numberOfLines={2}>
              {language === 'mr' ? sec.titleMr : sec.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3 Step Guide Banner */}
      <View style={styles.stepsCard}>
        <Text style={styles.stepsHeader}>
          {language === 'mr' ? '३ सोप्या पायऱ्यांमध्ये लाभ मिळवा' : 'Get Benefits in 3 Simple Steps'}
        </Text>
        <View style={styles.stepItem}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>१</Text></View>
          <Text style={styles.stepText}>
            {language === 'mr' ? 'आपली माहिती भरा व पात्र योजना शोधा' : 'Fill details & discover matching schemes'}
          </Text>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>२</Text></View>
          <Text style={styles.stepText}>
            {language === 'mr' ? 'कागदपत्रे तपासा व अर्ज प्रक्रिया समजून घ्या' : 'Verify required documents & procedures'}
          </Text>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>३</Text></View>
          <Text style={styles.stepText}>
            {language === 'mr' ? 'थेट अधिकृत DBT पोर्टलवर अर्ज सादर करा' : 'Apply directly on the official DBT portal'}
          </Text>
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
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  topBanner: {
    marginBottom: 12,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagBadge: {
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  flagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },
  langSelector: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  langBtnActive: {
    backgroundColor: '#1e40af',
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  langBtnTextActive: {
    color: '#ffffff',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },
  heroBadgeText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    padding: 0,
  },
  searchActionBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 6,
  },
  tagScroll: {
    flexDirection: 'row',
  },
  tagPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  actionGrid: {
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 5,
    elevation: 1,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  actionCardDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  sectorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  sectorTile: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  sectorIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sectorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  stepsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
  },
  stepsHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
  },
});

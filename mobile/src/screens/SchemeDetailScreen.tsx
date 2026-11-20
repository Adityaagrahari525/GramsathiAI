import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useJourneyTracker } from '../context/JourneyTrackerContext';
import { SCHEMES_DATABASE, Scheme } from '../data/schemesData';

export const SchemeDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params || {};
  const { language } = useLanguage();
  const { isSaved, saveScheme, removeScheme } = useSavedSchemes();
  const { journeys, updateStage } = useJourneyTracker();

  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'docs' | 'apply'>('overview');

  const scheme: Scheme | undefined = SCHEMES_DATABASE.find((s: Scheme) => s.id === id);

  if (!scheme) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>योजना सापडली नाही (Scheme not found)</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>मागे जा (Go Back)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const saved = isSaved(scheme.id);
  const journey = journeys.find((j) => j.schemeId === scheme.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${scheme.nameMr || scheme.name}\n\nअधिक माहिती व अर्ज: ${scheme.officialUrl || 'https://gramsathi.gov.in'}`,
      });
    } catch {}
  };

  const handleTrackJourney = () => {
    updateStage(
      scheme.id,
      scheme.name,
      journey ? journey.stage : 'discovered',
      scheme.nameMr
    );
    navigation.navigate('Tracker');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{scheme.level} Scheme</Text>
          </View>
          <View style={styles.departmentBadge}>
            <Text style={styles.departmentBadgeText}>{scheme.departmentShort || scheme.department}</Text>
          </View>
        </View>

        {/* Scheme Title */}
        <Text style={styles.title}>
          {language === 'mr' && scheme.nameMr ? scheme.nameMr : scheme.name}
        </Text>

        {/* Benefit Highlight Card */}
        <View style={styles.benefitCard}>
          <View style={styles.benefitIconWrap}>
            <Ionicons name="gift" size={22} color="#15803d" />
          </View>
          <View style={styles.benefitTextWrap}>
            <Text style={styles.benefitCardHeading}>
              {language === 'mr' ? 'मुख्य आर्थिक लाभ / अनुदान' : 'Key Financial Benefit'}
            </Text>
            <Text style={styles.benefitCardDesc}>
              {scheme.benefitAmount || scheme.highlightText || 'Direct Benefit Transfer'}
            </Text>
          </View>
        </View>

        {/* Action Button Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.outlineBtn, saved && styles.outlineBtnActive]}
            onPress={() => (saved ? removeScheme(scheme.id) : saveScheme(scheme))}
          >
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? '#2563eb' : '#475569'} />
            <Text style={[styles.outlineBtnText, saved && styles.outlineBtnTextActive]}>
              {saved ? (language === 'mr' ? 'जतन केले' : 'Saved') : (language === 'mr' ? 'जतन करा' : 'Save')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={18} color="#475569" />
            <Text style={styles.outlineBtnText}>{language === 'mr' ? 'शेअर करा' : 'Share'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.outlineBtn, styles.trackBtn]} onPress={handleTrackJourney}>
            <Ionicons name="navigate-outline" size={18} color="#059669" />
            <Text style={[styles.outlineBtnText, { color: '#059669' }]}>
              {journey ? (language === 'mr' ? 'ट्रॅकर पहा' : 'In Tracker') : (language === 'mr' ? 'ट्रॅक करा' : 'Track')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabBar}>
          {[
            { id: 'overview', label: 'माहिती', labelEn: 'Overview' },
            { id: 'eligibility', label: 'पात्रता', labelEn: 'Eligibility' },
            { id: 'docs', label: 'कागदपत्रे', labelEn: 'Documents' },
            { id: 'apply', label: 'अर्ज कसा करावा', labelEn: 'How to Apply' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {language === 'mr' ? tab.label : tab.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'योजनेचा उद्देश व स्वरूप' : 'Scheme Overview'}
            </Text>
            <Text style={styles.paragraph}>
              {scheme.summary || scheme.description || scheme.highlightText}
            </Text>

            {scheme.tags && scheme.tags.length > 0 && (
              <View style={styles.tagSection}>
                <Text style={styles.tagHeading}>{language === 'mr' ? 'संबंधित विषय' : 'Tags'}:</Text>
                <View style={styles.tagWrap}>
                  {scheme.tags.map((tg: string, idx: number) => (
                    <View key={idx} style={styles.miniTag}>
                      <Text style={styles.miniTagText}>{tg}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === 'eligibility' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'पात्रता निकष' : 'Eligibility Criteria'}
            </Text>
            {scheme.eligibility && scheme.eligibility.length > 0 ? (
              scheme.eligibility.map((crit: string, idx: number) => (
                <View key={idx} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#16a34a" style={styles.bulletIcon} />
                  <Text style={styles.bulletText}>{crit}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.paragraph}>
                {language === 'mr' ? 'अधिकृत पोर्टलवरील निकष पहावेत.' : 'Refer to the official portal for detailed eligibility.'}
              </Text>
            )}
          </View>
        )}

        {activeTab === 'docs' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'आवश्यक कागदपत्रे' : 'Required Documents'}
            </Text>
            {scheme.documents && scheme.documents.length > 0 ? (
              scheme.documents.map((doc: string, idx: number) => (
                <View key={idx} style={styles.bulletRow}>
                  <Ionicons name="document-text-outline" size={18} color="#2563eb" style={styles.bulletIcon} />
                  <Text style={styles.bulletText}>{doc}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.paragraph}>
                {language === 'mr' ? 'आधार कार्ड, बँक पासबुक, ७/१२ उतारा इत्यादी.' : 'Aadhaar, Bank Passbook, Land records etc.'}
              </Text>
            )}
          </View>
        )}

        {activeTab === 'apply' && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionTitle}>
              {language === 'mr' ? 'अर्ज करण्याची पद्धत' : 'Application Steps'}
            </Text>
            {scheme.applicationSteps && scheme.applicationSteps.length > 0 ? (
              scheme.applicationSteps.map((step: string, idx: number) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepCircleText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.stepRowText}>{step}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.paragraph}>
                {language === 'mr' ? 'महाडीबीटी किंवा संबंधित अधिकृत पोर्टलवर ऑनलाईन अर्ज करावा.' : 'Apply online on the official MahaDBT portal.'}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Apply Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => {
            if (scheme.officialUrl) {
              Linking.openURL(scheme.officialUrl);
            }
          }}
        >
          <Ionicons name="open-outline" size={18} color="#ffffff" />
          <Text style={styles.applyBtnText}>
            {language === 'mr' ? 'अधिकृत पोर्टलवर अर्ज करा' : 'Apply on Official Portal'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelBadgeText: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '700',
  },
  departmentBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  departmentBadgeText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  benefitIconWrap: {
    marginRight: 10,
    marginTop: 2,
  },
  benefitTextWrap: {
    flex: 1,
  },
  benefitCardHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  benefitCardDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 8,
    gap: 6,
  },
  outlineBtnActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  outlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  outlineBtnTextActive: {
    color: '#2563eb',
  },
  trackBtn: {
    borderColor: '#a7f3d0',
    backgroundColor: '#ecfdf5',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabItemActive: {
    backgroundColor: '#1e40af',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabLabelActive: {
    color: '#ffffff',
  },
  tabContentCard: {
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
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  tagSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  tagHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  miniTagText: {
    fontSize: 11,
    color: '#475569',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  bulletIcon: {
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepCircleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepRowText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 12,
  },
  applyBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 10,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

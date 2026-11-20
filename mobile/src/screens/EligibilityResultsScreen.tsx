import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';

export const EligibilityResultsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { language } = useLanguage();
  const { isSaved, saveScheme, removeScheme } = useSavedSchemes();

  const results = route.params?.results || {
    eligibleCount: 0,
    actionRequiredCount: 0,
    topMatches: [],
  };

  const { eligibleCount, topMatches } = results;

  return (
    <View style={styles.container}>
      {/* Summary Score Card */}
      <View style={styles.summaryCard}>
        <View style={styles.scoreRow}>
          <View style={styles.countCircle}>
            <Text style={styles.countNumber}>{eligibleCount}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {language === 'mr' ? 'अभिनंदन! आपण पात्र आहात' : 'Great! Schemes Found For You'}
            </Text>
            <Text style={styles.summarySubtitle}>
              {language === 'mr'
                ? `आपल्या प्रोफाईलनुसार ${eligibleCount} सरकारी योजनांमध्ये थेट लाभ मिळू शकतो.`
                : `Based on your profile, you are eligible for ${eligibleCount} government schemes.`}
            </Text>
          </View>
        </View>
      </View>

      {/* Eligible Schemes List */}
      <FlatList
        data={topMatches}
        keyExtractor={(item, idx) => item.scheme?.id || String(idx)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const scheme = item.scheme;
          if (!scheme) return null;
          const saved = isSaved(scheme.id);

          return (
            <View style={styles.matchCard}>
              <View style={styles.matchHeader}>
                <View style={styles.verdictBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
                  <Text style={styles.verdictText}>
                    {language === 'mr' ? '१००% पात्र' : 'Eligible'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => (saved ? removeScheme(scheme.id) : saveScheme(scheme))}>
                  <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? '#2563eb' : '#64748b'} />
                </TouchableOpacity>
              </View>

              <Text style={styles.schemeTitle}>
                {language === 'mr' && scheme.titleMr ? scheme.titleMr : scheme.title}
              </Text>

              {item.recommendationReason && (
                <View style={styles.reasonBox}>
                  <Text style={styles.reasonText}>💡 {item.recommendationReason}</Text>
                </View>
              )}

              <View style={styles.benefitRow}>
                <Ionicons name="gift-outline" size={16} color="#166534" />
                <Text style={styles.benefitText} numberOfLines={2}>
                  {language === 'mr' && scheme.benefitsSummaryMr ? scheme.benefitsSummaryMr : scheme.benefitsSummary}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => navigation.navigate('SchemeDetail', { id: scheme.id, schemeTitle: scheme.title })}
              >
                <Text style={styles.detailBtnText}>
                  {language === 'mr' ? 'तपशील व अर्ज प्रक्रिया पहा' : 'View Details & Apply'} →
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  summaryCard: {
    backgroundColor: '#1e3a8a',
    padding: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  countCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#93c5fd',
    lineHeight: 16,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 30,
  },
  matchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verdictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  verdictText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  schemeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 20,
  },
  reasonBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  reasonText: {
    fontSize: 12,
    color: '#475569',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 6,
    gap: 6,
    marginBottom: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  detailBtn: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
});

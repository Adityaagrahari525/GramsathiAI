import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { SCHEMES_DATABASE, Scheme } from '../data/schemesData';

export const NeedDiscoveryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language } = useLanguage();

  const [needText, setNeedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Scheme[]>([]);
  const [searched, setSearched] = useState(false);

  const sampleNeeds = [
    'शेतात पाण्याची अडचण आहे आणि विजेचे बिल जास्त येते',
    'महिलांना घरगुती उद्योग सुरू करण्यासाठी भांडवल हवे आहे',
    'ट्रॅक्टर व शेती अवजारे खरेदीसाठी अनुदान हवे आहे',
    'मुलांच्या शिक्षणासाठी व हॉस्टेलसाठी शिष्यवृत्ती पाहिजे',
  ];

  const handleSearchNeed = async (queryText?: string) => {
    const q = queryText || needText;
    if (!q.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await apiClient.findByNeed(q.trim(), language);
      if (res.success && res.data?.schemes && res.data.schemes.length > 0) {
        setResults(res.data.schemes);
        setLoading(false);
        return;
      }
    } catch {}

    // Fallback client semantic keyword resolution
    const lower = q.toLowerCase();
    const matched = SCHEMES_DATABASE.filter((s: Scheme) => {
      if (lower.includes('पाणी') || lower.includes('विज') || lower.includes('solar') || lower.includes('pump')) {
        return s.sector === 'agriculture' || s.id.includes('saur');
      }
      if (lower.includes('महिला') || lower.includes('उद्योग') || lower.includes('women')) {
        return s.sector === 'women' || s.id.includes('ladki');
      }
      if (lower.includes('ट्रॅक्टर') || lower.includes('अवजारे') || lower.includes('tractor')) {
        return s.sector === 'agriculture';
      }
      if (lower.includes('शिक्षण') || lower.includes('शिष्यवृत्ती') || lower.includes('student')) {
        return s.sector === 'education';
      }
      return (
        s.name.toLowerCase().includes(lower) ||
        (s.nameMr && s.nameMr.toLowerCase().includes(lower)) ||
        (s.summary && s.summary.toLowerCase().includes(lower))
      );
    });

    setResults(matched.length > 0 ? matched : SCHEMES_DATABASE.slice(0, 5));
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <Ionicons name="bulb-outline" size={24} color="#2563eb" />
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>
            {language === 'mr' ? 'गरजेनुसार योजना शोध (Reverse Discovery)' : 'Find Scheme by Your Exact Need'}
          </Text>
          <Text style={styles.subheading}>
            {language === 'mr'
              ? 'योजनेचे नाव माहित नसले तरी चालेल! आपली अडचण किंवा गरज साध्या मराठीत सांगा.'
              : 'Don’t know the scheme name? Just describe your real problem or requirement.'}
          </Text>
        </View>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.needInput}
          placeholder={
            language === 'mr'
              ? 'उदा. मला शेतात बोरवेल किंवा विहीर खोदायची आहे...'
              : 'e.g. I need subsidy to dig an agricultural well...'
          }
          value={needText}
          onChangeText={setNeedText}
          multiline
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearchNeed()} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="search" size={18} color="#ffffff" />
              <Text style={styles.searchBtnText}>
                {language === 'mr' ? 'संबंधित योजना शोधा' : 'Discover Matching Schemes'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Sample Need Pills */}
      {!searched && (
        <View style={styles.samplesBox}>
          <Text style={styles.samplesHeading}>
            {language === 'mr' ? 'किंवा खालीलपैकी एक गरज निवडा:' : 'Or tap a common citizen need:'}
          </Text>
          {sampleNeeds.map((sample, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.sampleItem}
              onPress={() => {
                setNeedText(sample);
                handleSearchNeed(sample);
              }}
            >
              <Ionicons name="arrow-forward-circle-outline" size={16} color="#2563eb" />
              <Text style={styles.sampleText}>{sample}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      {searched && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate('SchemeDetail', { id: item.id, schemeTitle: item.name })}
            >
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>{item.level}</Text>
              </View>
              <Text style={styles.resultTitle}>
                {language === 'mr' && item.nameMr ? item.nameMr : item.name}
              </Text>
              <Text style={styles.resultBenefit}>
                {item.benefitAmount || item.highlightText || 'Direct Benefit Transfer'}
              </Text>
              <Text style={styles.viewMore}>
                {language === 'mr' ? 'तपशील पहा' : 'View Scheme'} →
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  topCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 12,
    marginBottom: 16,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  subheading: {
    fontSize: 12,
    color: '#3b82f6',
    lineHeight: 16,
  },
  searchSection: {
    marginBottom: 16,
  },
  needInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#0f172a',
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  samplesBox: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  samplesHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 10,
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 8,
  },
  sampleText: {
    flex: 1,
    fontSize: 13,
    color: '#1e293b',
  },
  resultsList: {
    gap: 10,
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  resultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  resultBenefit: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '600',
    marginBottom: 8,
  },
  viewMore: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
});

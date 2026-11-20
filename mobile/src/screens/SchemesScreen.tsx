import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { SCHEMES_DATABASE, SECTORS_LIST, Scheme } from '../data/schemesData';

export const SchemesScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { language } = useLanguage();
  const { isSaved, saveScheme, removeScheme } = useSavedSchemes();

  const [selectedSector, setSelectedSector] = useState<string>(route.params?.sector || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(route.params?.search || '');

  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATABASE.filter((s: Scheme) => {
      const matchSector = selectedSector === 'all' || s.sector === selectedSector;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.nameMr && s.nameMr.toLowerCase().includes(q)) ||
        (s.summary && s.summary.toLowerCase().includes(q)) ||
        (s.benefitAmount && s.benefitAmount.toLowerCase().includes(q));
      return matchSector && matchQuery;
    });
  }, [selectedSector, searchQuery]);

  const renderSchemeCard = ({ item }: { item: Scheme }) => {
    const saved = isSaved(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SchemeDetail', { id: item.id, schemeTitle: item.name })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badgeRow}>
            <View style={styles.sectorBadge}>
              <Text style={styles.sectorBadgeText}>
                {SECTORS_LIST.find((sec) => sec.id === item.sector)?.titleMr || item.sector}
              </Text>
            </View>
            <View style={[styles.fundingBadge, item.level === 'Central' ? styles.centralBg : styles.stateBg]}>
              <Text style={styles.fundingBadgeText}>{item.level}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => (saved ? removeScheme(item.id) : saveScheme(item))}
          >
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? '#2563eb' : '#64748b'} />
          </TouchableOpacity>
        </View>

        <Text style={styles.schemeTitle}>
          {language === 'mr' && item.nameMr ? item.nameMr : item.name}
        </Text>
        <Text style={styles.schemeDesc} numberOfLines={2}>
          {item.summary}
        </Text>

        <View style={styles.benefitContainer}>
          <Ionicons name="gift-outline" size={16} color="#15803d" />
          <Text style={styles.benefitText} numberOfLines={1}>
            {item.benefitAmount || item.highlightText || 'Direct Benefit Transfer'}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailText}>
            {language === 'mr' ? 'तपशील व अर्ज प्रक्रिया' : 'View Details & Apply'} →
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'mr' ? 'योजना शोधा...' : 'Search schemes...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sector Horizontal Pills */}
      <View style={styles.pillContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={SECTORS_LIST}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const isSelected = selectedSector === item.id;
            return (
              <TouchableOpacity
                style={[styles.sectorPill, isSelected && styles.sectorPillActive]}
                onPress={() => setSelectedSector(item.id)}
              >
                <Text style={[styles.sectorPillText, isSelected && styles.sectorPillTextActive]}>
                  {language === 'mr' ? item.titleMr : item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results Header */}
      <View style={styles.resultCountBar}>
        <Text style={styles.resultCountText}>
          {language === 'mr'
            ? `${filteredSchemes.length} योजना उपलब्ध`
            : `${filteredSchemes.length} schemes found`}
        </Text>
      </View>

      {/* Schemes List */}
      <FlatList
        data={filteredSchemes}
        keyExtractor={(item) => item.id}
        renderItem={renderSchemeCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>
              {language === 'mr' ? 'कोणतीही योजना सापडली नाही' : 'No schemes match your filter'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {language === 'mr' ? 'कृपया शोध शब्द किंवा विभाग बदलून पहा.' : 'Try adjusting your search or sector filter.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  pillContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectorPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  sectorPillActive: {
    backgroundColor: '#1e40af',
  },
  sectorPillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  sectorPillTextActive: {
    color: '#ffffff',
  },
  resultCountBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultCountText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 30,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sectorBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectorBadgeText: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '700',
  },
  fundingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  centralBg: {
    backgroundColor: '#fef3c7',
  },
  stateBg: {
    backgroundColor: '#f1f5f9',
  },
  fundingBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  saveBtn: {
    padding: 4,
  },
  schemeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 22,
  },
  schemeDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 10,
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 10,
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  viewDetailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
});

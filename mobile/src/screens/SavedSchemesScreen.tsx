import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { Scheme } from '../data/schemesData';

export const SavedSchemesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language } = useLanguage();
  const { savedSchemes, removeScheme } = useSavedSchemes();

  return (
    <View style={styles.container}>
      {savedSchemes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={54} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>
            {language === 'mr' ? 'कोणतीही योजना जतन केलेली नाही' : 'No Saved Schemes'}
          </Text>
          <Text style={styles.emptySub}>
            {language === 'mr'
              ? 'योजना यादीमधून बुकमार्क आयकॉन दाबून महत्वाच्या योजना येथे जतन करा.'
              : 'Save schemes by tapping the bookmark icon to easily review them later.'}
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'SchemesTab' })}
          >
            <Text style={styles.browseBtnText}>
              {language === 'mr' ? 'योजना यादी पहा' : 'Browse Schemes'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedSchemes}
          keyExtractor={(item: Scheme) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: Scheme }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{item.level}</Text>
                </View>
                <TouchableOpacity onPress={() => removeScheme(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>
                {language === 'mr' && item.nameMr ? item.nameMr : item.name}
              </Text>

              <Text style={styles.desc} numberOfLines={2}>
                {item.summary}
              </Text>

              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => navigation.navigate('SchemeDetail', { id: item.id, schemeTitle: item.name })}
              >
                <Text style={styles.detailBtnText}>
                  {language === 'mr' ? 'तपशील व अर्ज पहा' : 'View Scheme'} →
                </Text>
              </TouchableOpacity>
            </View>
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
  },
  listContent: {
    padding: 16,
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
  levelBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  desc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  browseBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  browseBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

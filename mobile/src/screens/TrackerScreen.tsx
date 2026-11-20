import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useJourneyTracker, JourneyStage } from '../context/JourneyTrackerContext';

export const TrackerScreen: React.FC = () => {
  const { language } = useLanguage();
  const { journeys, updateStage, removeJourney } = useJourneyTracker();

  const stages: { key: JourneyStage; label: string; labelEn: string; icon: any }[] = [
    { key: 'discovered', label: 'माहिती मिळाली', labelEn: 'Discovered', icon: 'search' },
    { key: 'eligibility_checked', label: 'पात्रता तपासली', labelEn: 'Checked', icon: 'checkmark-circle' },
    { key: 'documents_gathered', label: 'कागदपत्रे तयार', labelEn: 'Docs Ready', icon: 'documents' },
    { key: 'applied', label: 'अर्ज सादर केला', labelEn: 'Applied', icon: 'send' },
    { key: 'approved', label: 'मंजूर', labelEn: 'Approved', icon: 'ribbon' },
    { key: 'benefit_received', label: 'लाभ मिळाला', labelEn: 'Benefit Received', icon: 'cash' },
  ];

  const getStageIndex = (stageKey: JourneyStage) => {
    return stages.findIndex((s) => s.key === stageKey);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.headerBox}>
        <Ionicons name="navigate" size={24} color="#2563eb" />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {language === 'mr' ? 'योजना अर्ज ट्रॅकर (Journey Tracker)' : 'Scheme Application Tracker'}
          </Text>
          <Text style={styles.headerSub}>
            {language === 'mr'
              ? 'आपल्या सर्व अर्जांची प्रगती व टप्पे एकाच जागी नोंदवून ठेवा.'
              : 'Track your application status and document milestones step-by-step.'}
          </Text>
        </View>
      </View>

      {/* Journeys List */}
      {journeys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>
            {language === 'mr' ? 'कोणतीही योजना ट्रॅकिंगमध्ये नाही' : 'No schemes in tracker yet'}
          </Text>
          <Text style={styles.emptySub}>
            {language === 'mr'
              ? 'योजना तपशील पानावरून "ट्रॅक करा" बटण दाबून येथे जोडा.'
              : 'Add any scheme from its detail page using the Track button.'}
          </Text>
        </View>
      ) : (
        <View style={styles.journeyList}>
          {journeys.map((item) => {
            const currentIdx = getStageIndex(item.stage);

            return (
              <View key={item.schemeId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.schemeName}>
                      {language === 'mr' && item.schemeNameMr ? item.schemeNameMr : item.schemeName}
                    </Text>
                    {item.notes && <Text style={styles.notesText}>📝 {item.notes}</Text>}
                  </View>
                  <TouchableOpacity onPress={() => removeJourney(item.schemeId)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                {/* Horizontal Step Indicators */}
                <View style={styles.stepsRow}>
                  {stages.map((st, i) => {
                    const isDone = i <= currentIdx;
                    const isCurrent = i === currentIdx;

                    return (
                      <TouchableOpacity
                        key={st.key}
                        style={styles.stepTouch}
                        onPress={() => updateStage(item.schemeId, item.schemeName, st.key, item.schemeNameMr)}
                      >
                        <View
                          style={[
                            styles.stepDot,
                            isDone && styles.stepDotDone,
                            isCurrent && styles.stepDotCurrent,
                          ]}
                        >
                          <Ionicons
                            name={st.icon}
                            size={12}
                            color={isDone ? '#ffffff' : '#94a3b8'}
                          />
                        </View>
                        <Text style={[styles.stepLabel, isCurrent && styles.stepLabelCurrent]} numberOfLines={1}>
                          {language === 'mr' ? st.label : st.labelEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.statusFooter}>
                  <Text style={styles.currentStatusText}>
                    {language === 'mr' ? 'सध्याची स्थिती:' : 'Current Status:'}{' '}
                    <Text style={{ fontWeight: '700', color: '#16a34a' }}>
                      {language === 'mr' ? stages[currentIdx]?.label : stages[currentIdx]?.labelEn}
                    </Text>
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
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
  headerBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 12,
    color: '#3b82f6',
    lineHeight: 16,
  },
  journeyList: {
    gap: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  schemeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#64748b',
  },
  deleteBtn: {
    padding: 4,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 10,
  },
  stepTouch: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotDone: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  stepDotCurrent: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  stepLabel: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
  },
  stepLabelCurrent: {
    color: '#16a34a',
    fontWeight: '700',
  },
  statusFooter: {
    alignItems: 'flex-end',
  },
  currentStatusText: {
    fontSize: 12,
    color: '#475569',
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
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
});

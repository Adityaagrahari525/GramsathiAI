import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';

export const FraudCheckerScreen: React.FC = () => {
  const { language } = useLanguage();

  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const sampleMessages = [
    'महाकृषी योजनेतून तात्काळ ५ लाख मिळवा, फक्त ५०० रु नोंदणी फी खालील लिंकवर भरा: bit.ly/yojana-fake',
    'पीएम किसान १७ वा हप्ता आला आहे. बँक खात्याचे केवायसी अपडेट करण्यासाठी ओटीपी पाठवा.',
  ];

  const handleVerify = async (textToVerify?: string) => {
    const text = textToVerify || messageText;
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await apiClient.checkFraud(text.trim(), language);
      if (res.success && res.data) {
        setVerificationResult(res.data);
        setLoading(false);
        return;
      }
    } catch {}

    // Deterministic civic fraud heuristic
    const isSuspicious =
      text.includes('bit.ly') ||
      text.includes('नोंदणी फी') ||
      text.includes('ओटीपी') ||
      text.includes('तात्काळ') ||
      text.includes('500') ||
      text.includes('fee');

    setVerificationResult({
      verdict: isSuspicious ? 'FRAUD_SUSPECTED' : 'LIKELY_LEGITIMATE_OR_UNKNOWN',
      confidence: isSuspicious ? 95 : 70,
      riskLevel: isSuspicious ? 'HIGH' : 'LOW',
      reasons: isSuspicious
        ? [
            'शासकीय योजनांसाठी कधीही खाजगी लिंकवरून नोंदणी शुल्क किंवा फी मागितली जात नाही.',
            'अनोळखी शॉर्ट लिंक (bit.ly) सायबर फसवणुकीचे प्रमुख लक्षण आहे.',
            'शासकीय अधिकारी कधीही फोनवर OTP किंवा पासवर्ड मागत नाहीत.',
          ]
        : ['संदेशात संशयास्पद आर्थिक मागण्या आढळल्या नाहीत. मात्र नेहमी अधिकृत .gov.in पोर्टलवरच खात्री करा.'],
      recommendations: [
        'कोणत्याही अनोळखी खात्यावर पैसे पाठवू नका.',
        'संशय असल्यास सायबर हेल्पलाईन १९३० (1930) वर संपर्क करा.',
        'योजनांची अधिकृत खात्री mahadbt.maharashtra.gov.in वरच करा.',
      ],
    });
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.headerBox}>
        <Ionicons name="shield-half" size={28} color="#dc2626" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {language === 'mr' ? 'सरकारी योजना फसवणूक तपासणी' : 'Fake Scheme & Scam Detector'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'mr'
              ? 'WhatsApp किंवा SMS वर आलेला मेसेज येथे पेस्ट करा आणि तो खरा की खोटा ते तपासा.'
              : 'Paste any WhatsApp/SMS message regarding government loans or schemes to verify authenticity.'}
          </Text>
        </View>
      </View>

      {/* Input */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>
          {language === 'mr' ? 'मेसेज मजकूर पेस्ट करा:' : 'Paste message text:'}
        </Text>
        <TextInput
          style={styles.messageInput}
          placeholder={
            language === 'mr'
              ? 'उदा. "तुम्हाला मोफत ट्रॅक्टर किंवा २ लाख अनुदान मंजूर झाले आहे..."'
              : 'Paste suspicious scheme message here...'
          }
          value={messageText}
          onChangeText={setMessageText}
          multiline
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.verifyBtn} onPress={() => handleVerify()} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="shield-checkmark" size={18} color="#ffffff" />
              <Text style={styles.verifyBtnText}>
                {language === 'mr' ? 'मेसेज तपासा (Verify Now)' : 'Verify Message Authenticity'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Sample Examples */}
      <View style={styles.sampleSection}>
        <Text style={styles.sampleTitle}>
          {language === 'mr' ? 'संशयास्पद मेसेजचे नमुने:' : 'Try sample fraudulent messages:'}
        </Text>
        {sampleMessages.map((msg, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.sampleItem}
            onPress={() => {
              setMessageText(msg);
              handleVerify(msg);
            }}
          >
            <Ionicons name="alert-circle-outline" size={16} color="#dc2626" />
            <Text style={styles.sampleText} numberOfLines={2}>{msg}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results View */}
      {verificationResult && (
        <View
          style={[
            styles.resultCard,
            verificationResult.riskLevel === 'HIGH' ? styles.dangerCard : styles.safeCard,
          ]}
        >
          <View style={styles.verdictHeader}>
            <Ionicons
              name={verificationResult.riskLevel === 'HIGH' ? 'warning' : 'checkmark-circle'}
              size={24}
              color={verificationResult.riskLevel === 'HIGH' ? '#dc2626' : '#16a34a'}
            />
            <Text
              style={[
                styles.verdictTitle,
                { color: verificationResult.riskLevel === 'HIGH' ? '#dc2626' : '#16a34a' },
              ]}
            >
              {verificationResult.riskLevel === 'HIGH'
                ? language === 'mr'
                  ? '⚠️ सावधान: हा मेसेज खोटा व फसवणूक असू शकतो!'
                  : '⚠️ Warning: Likely Fraudulent Scheme Message'
                : language === 'mr'
                ? '✅ संशयास्पद आढळले नाही (सावध रहा)'
                : '✅ No Direct Scam Indicators Found'}
            </Text>
          </View>

          <View style={styles.reasonsBox}>
            <Text style={styles.reasonsHeading}>
              {language === 'mr' ? 'महत्वाचे निष्कर्ष:' : 'Analysis Findings:'}
            </Text>
            {verificationResult.reasons.map((r: string, i: number) => (
              <Text key={i} style={styles.reasonBullet}>• {r}</Text>
            ))}
          </View>

          <View style={styles.adviceBox}>
            <Text style={styles.adviceHeading}>
              {language === 'mr' ? 'सुरक्षिततेसाठी सल्ला:' : 'Citizen Advisory:'}
            </Text>
            {verificationResult.recommendations.map((rec: string, i: number) => (
              <Text key={i} style={styles.adviceBullet}>🛡️ {rec}</Text>
            ))}
          </View>
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
    backgroundColor: '#fef2f2',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#b91c1c',
    lineHeight: 16,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
  },
  verifyBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  verifyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  sampleSection: {
    marginBottom: 16,
  },
  sampleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 6,
    gap: 8,
  },
  sampleText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  dangerCard: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  safeCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  verdictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  verdictTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  reasonsBox: {
    marginBottom: 12,
  },
  reasonsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  reasonBullet: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 4,
  },
  adviceBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
  },
  adviceHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  adviceBullet: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 2,
  },
});

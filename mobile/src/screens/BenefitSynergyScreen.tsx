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

export const BenefitSynergyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language } = useLanguage();

  const synergyPackages = [
    {
      id: 'solar-well-combo',
      title: 'सौर ऊर्जेवर समृद्ध शेती पॅकेज',
      titleEn: 'Solar & Irrigation Synergy Package',
      description: 'पीएम-कुसुम सौर कृषी पंप + मागेल त्याला शेततळे + ठिबक सिंचन अनुदान.',
      totalSubsidy: '₹ २,७५,००० पर्यंत एकूण बचत',
      schemes: ['pm-kusum-yojana', 'magel-tyala-shet-tale', 'micro-irrigation-subsidy'],
      whyCombine: 'विजेचे बिल कायमचे शून्य होते आणि वर्षभर पाण्याचा तुटवडा भासत नाही.',
      icon: 'sunny',
      color: '#d97706',
    },
    {
      id: 'women-entrepreneur-combo',
      title: 'महिला स्वावलंबन व उद्योग जोडणी',
      titleEn: 'Women Livelihood & Entrepreneurship Synergy',
      description: 'लाडकी बहीण योजना + उमेद बचत गट फिरता निधी + अन्नपूर्णा गॅस अनुदान.',
      totalSubsidy: '₹ १,५०,००० भांडवली लाभ',
      schemes: ['majhi-ladki-bahin-yojana', ' उमेद महिला बचत गट योजना', 'मुख्यमंत्री अन्नपूर्णा योजना'],
      whyCombine: 'मासिक थेट खात्यात मदत मिळण्यासोबत व्यवसाय सुरू करण्यासाठी बिनव्याजी खेळते भांडवल मिळते.',
      icon: 'female',
      color: '#db2777',
    },
    {
      id: 'tractor-mechanization-combo',
      title: 'आधुनिक शेती यांत्रिकीकरण पॅकेज',
      titleEn: 'Farm Mechanization & Crop Protection',
      description: 'महाडीबीटी ट्रॅक्टर अनुदान + पीक विमा योजना + नमो शेतकरी महासन्मान निधी.',
      totalSubsidy: '₹ १,२५,००० + १ रुपयात पीक संरक्षण',
      schemes: ['mahadbt-tractor-subsidy', 'namo-shetkari-sanman-yojana', 'one-rupee-crop-insurance'],
      whyCombine: 'मजुरी खर्चात ६०% बचत होते आणि अवकाळी किंवा दुष्काळात १००% आर्थिक संरक्षण राहते.',
      icon: 'construct',
      color: '#2563eb',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Ionicons name="git-merge" size={26} color="#1d4ed8" />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {language === 'mr' ? 'योजना जोडणी (Benefit Synergy)' : 'Scheme Synergy Engine'}
          </Text>
          <Text style={styles.headerSub}>
            {language === 'mr'
              ? 'एकाच वेळी अनेक योजनांचा लाभ एकत्र घेऊन दुप्पट फायदा कसा मिळवायचा ते पहा.'
              : 'Discover smart combinations of complementary schemes to multiply your financial benefits.'}
          </Text>
        </View>
      </View>

      {/* Packages List */}
      <View style={styles.packageList}>
        {synergyPackages.map((pkg) => (
          <View key={pkg.id} style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <View style={[styles.iconWrap, { backgroundColor: `${pkg.color}15` }]}>
                <Ionicons name={pkg.icon as any} size={22} color={pkg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pkgTitle}>
                  {language === 'mr' ? pkg.title : pkg.titleEn}
                </Text>
                <Text style={styles.pkgSubsidy}>{pkg.totalSubsidy}</Text>
              </View>
            </View>

            <Text style={styles.pkgDesc}>{pkg.description}</Text>

            <View style={styles.whyBox}>
              <Text style={styles.whyHeading}>
                {language === 'mr' ? '💡 एकत्र का घ्यावे?' : '💡 Why Combine?'}
              </Text>
              <Text style={styles.whyText}>{pkg.whyCombine}</Text>
            </View>

            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('MainTabs', { screen: 'SchemesTab' })}
            >
              <Text style={styles.exploreBtnText}>
                {language === 'mr' ? 'ह्या योजनांची यादी पहा' : 'View Scheme Details'} →
              </Text>
            </TouchableOpacity>
          </View>
        ))}
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
  headerCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
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
  packageList: {
    gap: 14,
  },
  packageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pkgTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
  },
  pkgSubsidy: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
    marginTop: 2,
  },
  pkgDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  whyBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  whyHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  whyText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  exploreBtn: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  exploreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
});

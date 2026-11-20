import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from './types';
import { useLanguage } from '../context/LanguageContext';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { SchemesScreen } from '../screens/SchemesScreen';
import { SchemeDetailScreen } from '../screens/SchemeDetailScreen';
import { EligibilityCheckerScreen } from '../screens/EligibilityCheckerScreen';
import { EligibilityResultsScreen } from '../screens/EligibilityResultsScreen';
import { AssistantScreen } from '../screens/AssistantScreen';
import { MoreMenuScreen } from '../screens/MoreMenuScreen';
import { TrackerScreen } from '../screens/TrackerScreen';
import { SavedSchemesScreen } from '../screens/SavedSchemesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NeedDiscoveryScreen } from '../screens/NeedDiscoveryScreen';
import { BenefitSynergyScreen } from '../screens/BenefitSynergyScreen';
import { FraudCheckerScreen } from '../screens/FraudCheckerScreen';
import { SignInScreen, RegisterScreen } from '../screens/AuthScreens';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  const { language } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 17,
          color: '#1e3a8a',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any = 'home';
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SchemesTab') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'EligibilityTab') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'AssistantTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'MoreTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: language === 'mr' ? 'मुख्यपृष्ठ' : 'Home',
          headerTitle: 'ग्रामसाथी AI — लोकसेवा',
        }}
      />
      <Tab.Screen
        name="SchemesTab"
        component={SchemesScreen}
        options={{
          title: language === 'mr' ? 'योजना' : 'Schemes',
          headerTitle: language === 'mr' ? 'सरकारी योजना यादी' : 'Government Schemes',
        }}
      />
      <Tab.Screen
        name="EligibilityTab"
        component={EligibilityCheckerScreen}
        options={{
          title: language === 'mr' ? 'पात्रता' : 'Eligibility',
          headerTitle: language === 'mr' ? 'योजना पात्रता चाचणी' : 'Check Eligibility',
        }}
      />
      <Tab.Screen
        name="AssistantTab"
        component={AssistantScreen}
        options={{
          title: language === 'mr' ? 'AI सहाय्यक' : 'GramMitra',
          headerTitle: language === 'mr' ? 'AI ग्राममित्र सल्लागार' : 'GramMitra AI Assistant',
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreMenuScreen}
        options={{
          title: language === 'mr' ? 'अधिक' : 'More',
          headerTitle: language === 'mr' ? 'अधिक सेवा व साधने' : 'Civic Tools & Services',
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { language } = useLanguage();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
          color: '#0f172a',
        },
        headerTintColor: '#1e40af',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SchemeDetail"
        component={SchemeDetailScreen}
        options={({ route }: any) => ({
          title: route.params?.schemeTitle || (language === 'mr' ? 'योजना तपशील' : 'Scheme Details'),
        })}
      />
      <Stack.Screen
        name="EligibilityResults"
        component={EligibilityResultsScreen}
        options={{
          title: language === 'mr' ? 'पात्र योजना निकाल' : 'Eligibility Results',
        }}
      />
      <Stack.Screen
        name="Tracker"
        component={TrackerScreen}
        options={{
          title: language === 'mr' ? 'योजना अर्ज ट्रॅकर' : 'Application Tracker',
        }}
      />
      <Stack.Screen
        name="SavedSchemes"
        component={SavedSchemesScreen}
        options={{
          title: language === 'mr' ? 'जतन केलेल्या योजना' : 'Saved Schemes',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: language === 'mr' ? 'माझे प्रोफाईल' : 'Citizen Profile',
        }}
      />
      <Stack.Screen
        name="NeedDiscovery"
        component={NeedDiscoveryScreen}
        options={{
          title: language === 'mr' ? 'गरजेनुसार योजना शोध' : 'Reverse Scheme Discovery',
        }}
      />
      <Stack.Screen
        name="BenefitSynergy"
        component={BenefitSynergyScreen}
        options={{
          title: language === 'mr' ? 'योजना जोडणी पॅकेज' : 'Benefit Synergy Packages',
        }}
      />
      <Stack.Screen
        name="FraudChecker"
        component={FraudCheckerScreen}
        options={{
          title: language === 'mr' ? 'फसवणूक व खोट्या योजना तपासणी' : 'Fake Scheme Checker',
        }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: language === 'mr' ? 'नागरिक लॉगिन' : 'Citizen Sign In',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: language === 'mr' ? 'नवीन नोंदणी' : 'Citizen Registration',
        }}
      />
    </Stack.Navigator>
  );
}

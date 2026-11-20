import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { LanguageProvider } from './src/context/LanguageContext';
import { CitizenProfileProvider } from './src/context/CitizenProfileContext';
import { SavedSchemesProvider } from './src/context/SavedSchemesContext';
import { JourneyTrackerProvider } from './src/context/JourneyTrackerContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <CitizenProfileProvider>
          <SavedSchemesProvider>
            <JourneyTrackerProvider>
              <NavigationContainer>
                <AppNavigator />
                <StatusBar style="dark" />
              </NavigationContainer>
            </JourneyTrackerProvider>
          </SavedSchemesProvider>
        </CitizenProfileProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

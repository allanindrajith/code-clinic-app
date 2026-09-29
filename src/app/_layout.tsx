import React, { useEffect } from 'react';
import { DefaultTheme, ThemeProvider, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Text, StyleSheet, Platform } from 'react-native';

import { ClinicProvider } from '@/context/ClinicContext';

// Ensure splash screen hides promptly so user never sees a stuck screen
SplashScreen.hideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <ClinicProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#000000',
            tabBarInactiveTintColor: '#a3a3a3',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#e5e5e5',
              borderTopWidth: 1,
              height: Platform.OS === 'ios' ? 84 : 76,
              paddingBottom: Platform.OS === 'ios' ? 24 : 18,
              paddingTop: 8,
              elevation: 0,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 2,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Dr. Debug',
              tabBarIcon: ({ color, focused }) => (
                <Text style={{ fontSize: 20 }}>🩺</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'ICU Lab',
              tabBarIcon: ({ color, focused }) => (
                <Text style={{ fontSize: 20 }}>🧪</Text>
              ),
            }}
          />
        </Tabs>
      </ClinicProvider>
    </ThemeProvider>
  );
}

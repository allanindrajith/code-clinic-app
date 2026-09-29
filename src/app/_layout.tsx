import React, { useEffect } from 'react';
import { DefaultTheme, ThemeProvider, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';

import { ClinicProvider } from '@/context/ClinicContext';

// Ensure splash screen hides promptly so user never sees a stuck screen
SplashScreen.hideAsync().catch(() => {});

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <ClinicProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#000000',
            tabBarInactiveTintColor: '#737373',
            tabBarStyle: isDesktop ? {
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: [{ translateX: -190 }],
              width: 380,
              backgroundColor: '#ffffff',
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: '#e5e5e5',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.10)',
              height: 54,
              paddingBottom: 0,
              paddingTop: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            } : {
              backgroundColor: '#ffffff',
              borderTopColor: '#e5e5e5',
              borderTopWidth: 1,
              height: Platform.OS === 'ios' ? 84 : 76,
              paddingBottom: Platform.OS === 'ios' ? 24 : 18,
              paddingTop: 8,
              elevation: 0,
            },
            tabBarItemStyle: isDesktop ? {
              height: 54,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 4,
            } : undefined,
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: isDesktop ? 0 : 2,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Overview',
              tabBarIcon: ({ color, focused }) => (
                <Text style={{ fontSize: 20 }}>🩺</Text>
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: 'Dr. Debug',
              tabBarIcon: ({ color, focused }) => (
                <Text style={{ fontSize: 20 }}>💬</Text>
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

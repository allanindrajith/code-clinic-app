import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ClinicHeader } from '@/components/clinic/ClinicHeader';
import { CodeIcuCard } from '@/components/clinic/CodeIcuCard';
import { LearningVaultCard } from '@/components/clinic/LearningVaultCard';
import { TriageCaseCarousel } from '@/components/clinic/TriageCaseCarousel';
import { PatientChartCard } from '@/components/clinic/PatientChartCard';
import { DesignTokens, Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ClinicHeader showChartButton={false} />

        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>
              Code ICU & Clinical Laboratory
            </Text>
            <Text style={styles.pageSubtitle}>
              Verify surgical patches in safe sandboxes, inspect real-time outputs, and explore neural clinical memory.
            </Text>
          </View>

          {/* Quick Triage Carousel */}
          <TriageCaseCarousel onSelectCase={() => router.push('/')} />

          {/* Main Grid: Left ICU Lab, Right Learning Vault & Chart */}
          <View style={[styles.gridContainer, isDesktop ? styles.desktopGrid : styles.mobileGrid]}>
            {/* ICU Sandbox Column */}
            <View style={styles.icuColumn}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionHeading}>
                  Interactive Code ICU Sandbox
                </Text>
              </View>
              <CodeIcuCard />

              <View style={styles.vaultWrapper}>
                <LearningVaultCard onApplyCure={() => router.push('/')} />
              </View>
            </View>

            {/* Side Column: Medical Chart */}
            <View style={styles.sideColumn}>
              <PatientChartCard />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: DesignTokens.colors.canvas,
  },
  safeArea: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + Spacing.six + 20,
  },
  pageHeader: {
    width: '100%',
    maxWidth: MaxContentWidth + 240,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    gap: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: DesignTokens.colors.ink,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: DesignTokens.colors.body,
  },
  gridContainer: {
    width: '100%',
    maxWidth: MaxContentWidth + 240,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.three,
  },
  desktopGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.four,
  },
  mobileGrid: {
    flexDirection: 'column',
    gap: Spacing.four,
  },
  icuColumn: {
    flex: 1,
    gap: Spacing.three,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: DesignTokens.colors.ink,
  },
  vaultWrapper: {
    marginTop: Spacing.two,
  },
  sideColumn: {
    width: 320,
  },
});

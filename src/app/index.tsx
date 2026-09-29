import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ClinicHeader } from '@/components/clinic/ClinicHeader';
import { MascotIcon } from '@/components/clinic/MascotIcon';
import { TriageCaseCarousel } from '@/components/clinic/TriageCaseCarousel';
import { ConsultationView } from '@/components/clinic/ConsultationView';
import { PatientChartCard } from '@/components/clinic/PatientChartCard';
import { DesignTokens, Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [showChartModal, setShowChartModal] = useState(false);
  const isDesktop = width >= 860;

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Clinic Header Bar */}
        <ClinicHeader onToggleChart={() => setShowChartModal(!showChartModal)} />

        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Documentation-First Center Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.mascotContainer}>
              <MascotIcon size={84} />
            </View>

            <Text style={styles.heroTitle}>
              The easiest way to diagnose and cure broken code
            </Text>

            <Text style={styles.heroSubtitle}>
              Like a senior physician doing pair debugging: listens to symptoms, asks one focused question at a time, checks fresh documentation, and prescribes the smallest surgical fix.
            </Text>

            {/* Signature Install Snippet Pill */}
            <View style={styles.installSnippetPill}>
              <Text style={styles.commandPrompt}>$</Text>
              <Text style={styles.commandText}>
                curl -fsSL https://codeclinic.dev/cure.sh | sh
              </Text>
              <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [
                  styles.labJumpBtn,
                  { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
                ]}
              >
                <Text style={styles.labJumpText}>
                  Open ICU Lab →
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Emergency Room Triage Presets */}
          <TriageCaseCarousel />

          {/* Consultation & Chart Grid */}
          <View style={[styles.gridContainer, isDesktop ? styles.desktopGrid : styles.mobileGrid]}>
            {/* Consultation Column */}
            <View style={styles.consultationCol}>
              <ConsultationView onOpenSandbox={() => router.push('/explore')} />
            </View>

            {/* Patient Chart Column (Visible on desktop or toggled modal on mobile) */}
            {(isDesktop || showChartModal) && (
              <View style={[styles.chartCol, !isDesktop && styles.mobileChartOverlay]}>
                <PatientChartCard />
              </View>
            )}
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
  heroSection: {
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    gap: Spacing.two + 4,
    textAlign: 'center',
  },
  mascotContainer: {
    width: 96,
    height: 96,
    borderRadius: DesignTokens.rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 40,
    color: DesignTokens.colors.ink,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: DesignTokens.colors.body,
    maxWidth: 620,
    fontWeight: '400',
  },
  installSnippetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderColor: DesignTokens.colors.hairline,
    borderWidth: 1,
    borderRadius: DesignTokens.rounded.full,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one + 2,
    paddingVertical: 6,
    gap: Spacing.two,
    marginTop: Spacing.two,
    maxWidth: '100%',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  commandPrompt: {
    color: DesignTokens.colors.mute,
    fontWeight: '600',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  commandText: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '400',
    color: DesignTokens.colors.ink,
  },
  labJumpBtn: {
    backgroundColor: DesignTokens.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: DesignTokens.rounded.full,
    marginLeft: 4,
  },
  labJumpText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
  gridContainer: {
    width: '100%',
    maxWidth: MaxContentWidth + 240,
    paddingHorizontal: Spacing.two,
    marginTop: Spacing.two,
  },
  desktopGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.four,
  },
  mobileGrid: {
    flexDirection: 'column',
  },
  consultationCol: {
    flex: 1,
  },
  chartCol: {
    width: 320,
    paddingRight: Spacing.four,
  },
  mobileChartOverlay: {
    width: '100%',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
});

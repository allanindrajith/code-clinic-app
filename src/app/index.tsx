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
  const isMobile = width < 600;

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
              <MascotIcon size={80} />
            </View>

            <Text style={[styles.heroTitle, isMobile && styles.mobileHeroTitle]}>
              The easiest way to diagnose and cure broken code
            </Text>

            <Text style={styles.heroSubtitle}>
              Like a senior physician doing pair debugging: listens to symptoms, asks one focused question at a time, checks fresh documentation, and prescribes the smallest surgical fix.
            </Text>

            {/* Signature Install Snippet Pill */}
            <View style={styles.installSnippetPill}>
              <View style={styles.commandRow}>
                <Text style={styles.commandPrompt}>$</Text>
                <Text style={styles.commandText}>
                  curl -fsSL https://codeclinic.dev/cure.sh | sh
                </Text>
              </View>
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
    paddingBottom: BottomTabInset + Spacing.six + 40,
  },
  heroSection: {
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two + 2,
    textAlign: 'center',
    width: '100%',
  },
  mascotContainer: {
    width: 88,
    height: 88,
    borderRadius: DesignTokens.rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: '#00000005',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 40,
    color: DesignTokens.colors.ink,
  },
  mobileHeroTitle: {
    fontSize: 25,
    lineHeight: 31,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: DesignTokens.colors.body,
    maxWidth: 580,
    fontWeight: '400',
  },
  installSnippetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderColor: DesignTokens.colors.hairline,
    borderWidth: 1,
    borderRadius: DesignTokens.rounded.full,
    paddingLeft: Spacing.three,
    paddingRight: 6,
    paddingVertical: 6,
    gap: Spacing.two,
    marginTop: Spacing.two,
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
  commandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commandPrompt: {
    color: DesignTokens.colors.mute,
    fontWeight: '600',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  commandText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '400',
    color: DesignTokens.colors.ink,
  },
  labJumpBtn: {
    backgroundColor: DesignTokens.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignTokens.rounded.full,
  },
  labJumpText: {
    fontSize: 12,
    fontWeight: '600',
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

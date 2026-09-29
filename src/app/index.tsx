import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ClinicHeader } from '@/components/clinic/ClinicHeader';
import { MascotIcon } from '@/components/clinic/MascotIcon';
import { TriageCaseCarousel } from '@/components/clinic/TriageCaseCarousel';
import { ChatHistoryDrawer } from '@/components/clinic/ChatHistoryDrawer';
import { AISettingsModal } from '@/components/clinic/AISettingsModal';
import { useClinic } from '@/context/ClinicContext';
import { DesignTokens, Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { newSession } = useClinic();
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);

  const isDesktop = width >= 860;
  const isMobile = width < 600;

  const handleStartChat = () => {
    newSession();
    router.push('/chat');
  };

  const handleSelectTriageCase = () => {
    router.push('/chat');
  };

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Top Navbar */}
        <ClinicHeader
          showChartButton={false}
          onNewPatient={handleStartChat}
          onToggleHistory={() => setShowHistoryDrawer(true)}
        />

        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>🩺 AI Senior Physician for Broken Code</Text>
            </View>

            <View style={styles.mascotContainer}>
              <MascotIcon size={84} />
            </View>

            <Text style={[styles.heroTitle, isMobile && styles.mobileHeroTitle]}>
              The easiest way to diagnose and cure broken code
            </Text>

            <Text style={styles.heroSubtitle}>
              Like a senior physician doing pair debugging: listens to terminal crash logs, analyzes root causes, checks fresh documentation, and prescribes the smallest surgical fix.
            </Text>

            {/* Primary Action Buttons */}
            <View style={styles.heroActionRow}>
              <Pressable
                onPress={handleStartChat}
                style={({ pressed }) => [
                  styles.primaryCtaBtn,
                  { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
                ]}
                accessibilityRole="button"
                accessibilityLabel="Start chat consultation"
              >
                <Text style={styles.primaryCtaText}>💬 Start Consultation (+ New Chat) →</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [
                  styles.secondaryCtaBtn,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                accessibilityRole="button"
                accessibilityLabel="Open ICU Lab Sandbox"
              >
                <Text style={styles.secondaryCtaText}>🧪 Open ICU Sandbox</Text>
              </Pressable>
            </View>

            {/* Curl Command Snippet */}
            <View style={styles.installSnippetPill}>
              <Text style={styles.commandPrompt}>$</Text>
              <Text style={styles.commandText}>curl -fsSL https://codeclinic.dev/cure.sh | sh</Text>
            </View>
          </View>

          {/* Section: Who Uses Code Clinic & When to Use It */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionOverline}>AUDIENCE & USE CASES</Text>
              <Text style={styles.sectionTitle}>Who Uses Code Clinic?</Text>
              <Text style={styles.sectionDescription}>
                Engineers use Code Clinic when stack traces are opaque, documentation is outdated, and automated copilot guesses fail to fix runtime crashes.
              </Text>
            </View>

            <View style={styles.useCaseGrid}>
              {/* Persona 1: Full-Stack Engineers */}
              <View style={[styles.useCaseCard, isDesktop && styles.useCaseCardDesktop]}>
                <View style={styles.useCaseIconBox}>
                  <Text style={styles.useCaseIcon}>⚡</Text>
                </View>
                <Text style={styles.useCaseHeading}>Full-Stack & Next.js 15 Engineers</Text>
                <Text style={styles.useCaseBody}>
                  Tackle Next.js 15 breaking changes (such as asynchronous <Text style={styles.inlineCode}>cookies()</Text> Promises), server/client component boundary crashes, and hydration mismatch bugs without breaking production.
                </Text>
              </View>

              {/* Persona 2: Frontend Developers */}
              <View style={[styles.useCaseCard, isDesktop && styles.useCaseCardDesktop]}>
                <View style={styles.useCaseIconBox}>
                  <Text style={styles.useCaseIcon}>⚛️</Text>
                </View>
                <Text style={styles.useCaseHeading}>Frontend & React Developers</Text>
                <Text style={styles.useCaseBody}>
                  Cure uninitialized state bugs like <Text style={styles.inlineCode}>TypeError: Cannot read properties of undefined (reading 'map')</Text>, infinite re-render loops, and stale closure issues in React hooks.
                </Text>
              </View>

              {/* Persona 3: Backend & DevOps Engineers */}
              <View style={[styles.useCaseCard, isDesktop && styles.useCaseCardDesktop]}>
                <View style={styles.useCaseIconBox}>
                  <Text style={styles.useCaseIcon}>🔌</Text>
                </View>
                <Text style={styles.useCaseHeading}>Backend & API Developers</Text>
                <Text style={styles.useCaseBody}>
                  Diagnose CORS blockers (<Text style={styles.inlineCode}>No 'Access-Control-Allow-Origin' header</Text>), port collisions (<Text style={styles.inlineCode}>EADDRINUSE :3000</Text>), and Node/Python unhandled rejections.
                </Text>
              </View>

              {/* Persona 4: Students & Pair Debuggers */}
              <View style={[styles.useCaseCard, isDesktop && styles.useCaseCardDesktop]}>
                <View style={styles.useCaseIconBox}>
                  <Text style={styles.useCaseIcon}>🎓</Text>
                </View>
                <Text style={styles.useCaseHeading}>Learners & Pair Programmers</Text>
                <Text style={styles.useCaseBody}>
                  Understand the exact "why" behind every crash. Dr. Debug explains the root cause hypothesis, quotes official developer docs, and teaches long-term error prevention principles.
                </Text>
              </View>
            </View>
          </View>

          {/* Section: 4-Step Clinical Protocol */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionOverline}>THE CLINICAL METHOD</Text>
              <Text style={styles.sectionTitle}>How Dr. Debug Cures Broken Code</Text>
              <Text style={styles.sectionDescription}>
                Rather than hallucinating whole rewrites, Code Clinic follows a disciplined 4-step diagnostic protocol.
              </Text>
            </View>

            <View style={styles.protocolStepsRow}>
              {/* Step 1 */}
              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>STEP 1</Text>
                </View>
                <Text style={styles.stepTitle}>Patient Intake</Text>
                <Text style={styles.stepBody}>
                  Paste any terminal crash log, stack trace, or broken component. Dr. Debug extracts runtime facts and environment signatures.
                </Text>
              </View>

              {/* Step 2 */}
              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>STEP 2</Text>
                </View>
                <Text style={styles.stepTitle}>Differential Diagnosis</Text>
                <Text style={styles.stepBody}>
                  Powered by Google Gemini 2.0 Flash (Free Tier) or Local Engine to identify the root cause boundary violation.
                </Text>
              </View>

              {/* Step 3 */}
              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>STEP 3</Text>
                </View>
                <Text style={styles.stepTitle}>Surgical Diff Patch</Text>
                <Text style={styles.stepBody}>
                  Prescribes a color-coded before/after diff touching only the necessary broken lines, preserving your codebase architecture.
                </Text>
              </View>

              {/* Step 4 */}
              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>STEP 4</Text>
                </View>
                <Text style={styles.stepTitle}>ICU Sandbox Test</Text>
                <Text style={styles.stepBody}>
                  Execute and verify the surgical treatment in an isolated runtime sandbox before deploying changes to git or production.
                </Text>
              </View>
            </View>
          </View>

          {/* Section: Emergency Room Triage Presets Carousel */}
          <View style={styles.triageSectionWrapper}>
            <TriageCaseCarousel onSelectCase={handleSelectTriageCase} />
          </View>

          {/* Section: Core Capabilities Grid */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionOverline}>ENGINE SPECIFICATIONS</Text>
              <Text style={styles.sectionTitle}>Clinical Architecture & Features</Text>
            </View>

            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✨</Text>
                <Text style={styles.featureTitle}>Free Google Gemini Live</Text>
                <Text style={styles.featureBody}>
                  Connect free Google AI Studio tokens (<Text style={styles.inlineCode}>gemini-2.0-flash</Text>) for fast, live AI diagnosis with zero token billing costs.
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🩺</Text>
                <Text style={styles.featureTitle}>100% Offline Local Engine</Text>
                <Text style={styles.featureBody}>
                  Runs completely offline with zero API calls needed, powered by pre-compiled surgical templates and heuristics.
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💬</Text>
                <Text style={styles.featureTitle}>Persistent Chat History</Text>
                <Text style={styles.featureBody}>
                  ChatGPT-style slide-out history drawer. All previous consultations are stored locally and ready to resume anytime.
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🩹</Text>
                <Text style={styles.featureTitle}>Surgical Diffing</Text>
                <Text style={styles.featureBody}>
                  Clear, visual code diff with additions in green, removals in red, and one-tap copy for effortless git patch integration.
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🧪</Text>
                <Text style={styles.featureTitle}>ICU Code Sandbox</Text>
                <Text style={styles.featureBody}>
                  Interactive in-app terminal simulator running JavaScript and Python code with live stdout and exit status monitoring.
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🤖</Text>
                <Text style={styles.featureTitle}>Custom Agent Tokens</Text>
                <Text style={styles.featureBody}>
                  Plug in OpenAI, OpenRouter, or Groq API tokens for flexibility across multiple LLM provider backends.
                </Text>
              </View>
            </View>
          </View>

          {/* Big Bottom Call-to-Action Card */}
          <View style={styles.bottomCtaCard}>
            <View style={styles.bottomCtaContent}>
              <Text style={styles.bottomCtaTitle}>Have broken code or a crash trace right now?</Text>
              <Text style={styles.bottomCtaSubtitle}>
                Open the dedicated Dr. Debug chatting section to paste your error and receive instant, step-by-step instructions.
              </Text>

              <Pressable
                onPress={handleStartChat}
                style={({ pressed }) => [
                  styles.bottomCtaButton,
                  { backgroundColor: pressed ? '#1e293b' : '#000000' }
                ]}
                accessibilityRole="button"
                accessibilityLabel="Open Chat with Dr. Debug"
              >
                <Text style={styles.bottomCtaButtonText}>+ Open Chat with Dr. Debug 💬</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* ChatGPT Mobile App Chat History Drawer */}
        <ChatHistoryDrawer
          visible={showHistoryDrawer}
          onClose={() => setShowHistoryDrawer(false)}
          onOpenAISettings={() => setShowAISettingsModal(true)}
        />

        {/* AI Engine & Tokens Settings Modal */}
        <AISettingsModal
          visible={showAISettingsModal}
          onClose={() => setShowAISettingsModal(false)}
        />
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
    paddingBottom: BottomTabInset + Spacing.six + 30,
  },
  heroSection: {
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four + 4,
    paddingBottom: Spacing.four,
    gap: Spacing.two + 4,
    width: '100%',
  },
  badgePill: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: DesignTokens.rounded.full,
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  mascotContainer: {
    width: 96,
    height: 96,
    borderRadius: DesignTokens.rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000005',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 40,
    color: DesignTokens.colors.ink,
    maxWidth: 700,
  },
  mobileHeroTitle: {
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    color: DesignTokens.colors.body,
    maxWidth: 620,
    fontWeight: '400',
  },
  heroActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  primaryCtaBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: DesignTokens.rounded.full,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryCtaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryCtaBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: DesignTokens.rounded.full,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    backgroundColor: DesignTokens.colors.surfaceSoft,
  },
  secondaryCtaText: {
    color: DesignTokens.colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  installSnippetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderColor: DesignTokens.colors.hairline,
    borderWidth: 1,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    gap: 8,
    marginTop: Spacing.two,
  },
  commandPrompt: {
    color: DesignTokens.colors.mute,
    fontWeight: '700',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  commandText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '400',
    color: DesignTokens.colors.ink,
  },
  contentSection: {
    width: '100%',
    maxWidth: 1200,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four + 4,
    gap: Spacing.four,
  },
  sectionHeaderBox: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 6,
    maxWidth: 680,
    alignSelf: 'center',
  },
  sectionOverline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 13.5,
    lineHeight: 20,
    color: DesignTokens.colors.body,
    textAlign: 'center',
  },
  useCaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  useCaseCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: DesignTokens.colors.surfaceCard,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.lg,
    padding: Spacing.four,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  useCaseCardDesktop: {
    minWidth: '47%',
  },
  useCaseIconBox: {
    width: 36,
    height: 36,
    borderRadius: DesignTokens.rounded.md,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  useCaseIcon: {
    fontSize: 20,
  },
  useCaseHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.2,
  },
  useCaseBody: {
    fontSize: 13,
    lineHeight: 19,
    color: DesignTokens.colors.charcoal,
  },
  inlineCode: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    backgroundColor: DesignTokens.colors.surfaceSoft,
    fontSize: 12,
    color: DesignTokens.colors.ink,
    fontWeight: '600',
  },
  protocolStepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  stepCard: {
    flex: 1,
    minWidth: 230,
    backgroundColor: DesignTokens.colors.surfaceCard,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.lg,
    padding: Spacing.three + 2,
    gap: 6,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  stepTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
  },
  stepBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: DesignTokens.colors.body,
  },
  triageSectionWrapper: {
    width: '100%',
    marginVertical: Spacing.two,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  featureItem: {
    flex: 1,
    minWidth: 280,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.md,
    padding: Spacing.three + 2,
    gap: 6,
  },
  featureIcon: {
    fontSize: 22,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
  },
  featureBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: DesignTokens.colors.charcoal,
  },
  bottomCtaCard: {
    width: '92%',
    maxWidth: 900,
    backgroundColor: DesignTokens.colors.surfaceCard,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    borderRadius: DesignTokens.rounded.xl,
    padding: Spacing.four + 8,
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: Spacing.four,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  bottomCtaContent: {
    alignItems: 'center',
    gap: 10,
    maxWidth: 580,
  },
  bottomCtaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DesignTokens.colors.ink,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  bottomCtaSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: DesignTokens.colors.body,
    textAlign: 'center',
  },
  bottomCtaButton: {
    marginTop: 6,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: DesignTokens.rounded.full,
  },
  bottomCtaButtonText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
  },
});

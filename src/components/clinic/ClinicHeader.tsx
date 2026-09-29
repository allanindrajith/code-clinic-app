import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, useWindowDimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { useClinic } from '@/context/ClinicContext';
import { MascotIcon } from './MascotIcon';
import { AISettingsModal } from './AISettingsModal';
import { DesignTokens, Spacing } from '@/constants/theme';

interface ClinicHeaderProps {
  onToggleChart?: () => void;
  showChartButton?: boolean;
  onNewPatient?: () => void;
  onToggleHistory?: () => void;
}

export function ClinicHeader({
  onToggleChart,
  showChartButton = true,
  onNewPatient,
  onToggleHistory
}: ClinicHeaderProps) {
  const { sessionId, patientStatus, resetPatient, aiSettings, sessions } = useClinic();
  const { width } = useWindowDimensions();
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);

  const isDesktop = width >= 800;
  const isCompact = width < 620;
  const isVeryCompact = width < 420;

  const getStatusColor = () => {
    switch (patientStatus) {
      case 'cured':
        return DesignTokens.colors.terminalGreen;
      case 'prescribed':
        return DesignTokens.colors.ink;
      case 'diagnosing':
        return DesignTokens.colors.terminalYellow;
      default:
        return DesignTokens.colors.terminalGreen;
    }
  };

  const getStatusLabel = () => {
    switch (patientStatus) {
      case 'cured':
        return 'Patient Cured';
      case 'prescribed':
        return 'Patch Prescribed';
      case 'diagnosing':
        return 'Triage In Progress';
      default:
        return 'Dr. Debug on Duty';
    }
  };

  return (
    <View style={[styles.headerContainer, { paddingHorizontal: isCompact ? 10 : Spacing.four }]}>
      <View style={styles.topRow}>
        {/* Left Side: ChatGPT Hamburger Button & Brand */}
        <View style={styles.brandGroup}>
          {onToggleHistory && (
            <Pressable
              onPress={onToggleHistory}
              style={({ pressed }) => [
                styles.hamburgerBtn,
                { opacity: pressed ? 0.6 : 1 }
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open previous chats history drawer"
            >
              <Text style={styles.hamburgerIcon}>☰</Text>
              {sessions.length > 1 && (
                <View style={styles.historyBadgeDot} />
              )}
            </Pressable>
          )}

          <MascotIcon size={isCompact ? 26 : 30} />

          <View style={styles.brandTitleRow}>
            <Text style={[styles.brandTitle, isCompact && styles.brandTitleCompact]}>
              Code Clinic
            </Text>

            {!isCompact && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>v1.0</Text>
              </View>
            )}

            {isDesktop ? (
              <>
                <View style={styles.divider} />
                <View style={styles.statusRow}>
                  <View style={[styles.pulseDot, { backgroundColor: getStatusColor() }]} />
                  <Text style={styles.statusText}>{getStatusLabel()}</Text>
                </View>
              </>
            ) : (
              <View
                style={[styles.compactStatusPill, { borderColor: `${getStatusColor()}40` }]}
                accessibilityLabel={getStatusLabel()}
              >
                <View style={[styles.pulseDot, { backgroundColor: getStatusColor() }]} />
                {!isCompact && <Text style={styles.compactStatusText}>{getStatusLabel()}</Text>}
              </View>
            )}
          </View>
        </View>

        {/* Right Side: AI Engine Pill (ChatGPT model picker style), Session ID, Chart Toggle & + New Chat Button */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setShowAISettingsModal(true)}
            style={({ pressed }) => [
              styles.aiBadgePill,
              isCompact && styles.aiBadgePillCompact,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            accessibilityRole="button"
            accessibilityLabel="Configure AI Engine and tokens"
          >
            <Text style={styles.aiBadgeText}>
              {aiSettings.provider === 'gemini'
                ? (isCompact ? '✨ Gemini ▾' : '✨ Gemini (Free) ▾')
                : (aiSettings.provider === 'openai' ? '🤖 Agent ▾' : '🩺 Local ▾')}
            </Text>
          </Pressable>

          <View style={[styles.sessionBadge, isCompact && styles.sessionBadgeCompact]}>
            <Text style={styles.sessionText}>{sessionId}</Text>
          </View>

          {showChartButton && onToggleChart && (
            <Pressable
              onPress={onToggleChart}
              style={({ pressed }) => [
                styles.chartButton,
                isCompact && styles.chartButtonCompact,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open Patient Chart"
            >
              <Text style={styles.chartButtonText}>
                {isVeryCompact ? '📋' : '📋 Chart'}
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              resetPatient();
              if (onNewPatient) {
                onNewPatient();
              } else {
                router.push('/chat');
              }
            }}
            style={({ pressed }) => [
              styles.newPatientButton,
              isCompact && styles.newPatientButtonCompact,
              { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
            ]}
            accessibilityRole="button"
            accessibilityLabel="New Chat Session"
          >
            <Text style={styles.newPatientText}>
              {isCompact ? '+ New' : '+ New Chat'}
            </Text>
          </Pressable>
        </View>
      </View>

      <AISettingsModal
        visible={showAISettingsModal}
        onClose={() => setShowAISettingsModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: DesignTokens.colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  topRow: {
    maxWidth: 1200,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    gap: 8,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  hamburgerBtn: {
    padding: 6,
    borderRadius: DesignTokens.rounded.sm,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 32,
    width: 32,
  },
  hamburgerIcon: {
    fontSize: 15,
    color: DesignTokens.colors.ink,
    lineHeight: 16,
    fontWeight: '600',
  },
  historyBadgeDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DesignTokens.colors.primary,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.3,
  },
  brandTitleCompact: {
    fontSize: 15,
  },
  badge: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: DesignTokens.rounded.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: DesignTokens.colors.body,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: DesignTokens.colors.hairlineStrong,
    marginHorizontal: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: DesignTokens.rounded.full,
    borderWidth: 1,
  },
  compactStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: DesignTokens.colors.body,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: DesignTokens.rounded.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.body,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  aiBadgePill: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 9,
    borderRadius: DesignTokens.rounded.full,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadgePillCompact: {
    paddingHorizontal: 6,
    height: 30,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  sessionBadge: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    paddingHorizontal: 10,
    borderRadius: DesignTokens.rounded.full,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionBadgeCompact: {
    paddingHorizontal: 7,
    height: 30,
  },
  sessionText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: DesignTokens.colors.charcoal,
    letterSpacing: -0.2,
  },
  chartButton: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    paddingHorizontal: 12,
    borderRadius: DesignTokens.rounded.full,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartButtonCompact: {
    paddingHorizontal: 9,
    height: 30,
  },
  chartButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  newPatientButton: {
    paddingHorizontal: 13,
    borderRadius: DesignTokens.rounded.full,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPatientButtonCompact: {
    paddingHorizontal: 10,
    height: 30,
  },
  newPatientText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
});

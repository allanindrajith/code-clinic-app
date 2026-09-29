import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { DesignTokens, Spacing } from '@/constants/theme';

interface SurgicalDiffViewProps {
  patchCode: string;
  prevention: string;
  searchResults?: Array<{ title: string; url: string; snippet: string }>;
  onOpenSandbox?: () => void;
}

export function SurgicalDiffView({
  patchCode,
  prevention,
  searchResults = [],
  onOpenSandbox
}: SurgicalDiffViewProps) {
  const { recordOutcome, patientStatus, setSandboxCode, runSandbox } = useClinic();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(patchCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  const handleSendToICU = () => {
    setSandboxCode(patchCode);
    runSandbox(patchCode);
    if (onOpenSandbox) {
      onOpenSandbox();
    }
  };

  // Parse lines for before/after color tinting
  const lines = (patchCode || '').split('\n');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Surgical Code Patch</Text>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable
            onPress={handleSendToICU}
            style={({ pressed }) => [
              styles.actionPillPrimary,
              { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
            ]}
          >
            <Text style={styles.actionPillPrimaryText}>Test in ICU</Text>
          </Pressable>

          <Pressable
            onPress={handleCopy}
            style={({ pressed }) => [
              styles.actionPillSecondary,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Text style={styles.actionPillSecondaryText}>
              {copied ? '✓ Copied' : 'Copy'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Monospace Code Diff Box */}
      <View style={styles.codeBox}>
        {lines.map((line, idx) => {
          let lineBg = 'transparent';
          let lineTextColor = '#e5e5e5';
          const trimmed = line.trim();

          if (trimmed.startsWith('// Before:') || trimmed.startsWith('# Before:')) {
            lineBg = 'rgba(255, 95, 86, 0.2)';
            lineTextColor = '#ff8580';
          } else if (trimmed.startsWith('// After') || trimmed.startsWith('# After')) {
            lineBg = 'rgba(39, 201, 63, 0.2)';
            lineTextColor = '#5ae073';
          } else if (line.startsWith('- ') || trimmed.startsWith('// Old:')) {
            lineBg = 'rgba(255, 95, 86, 0.15)';
            lineTextColor = '#ffa8a3';
          } else if (line.startsWith('+ ') || trimmed.startsWith('// Fix:')) {
            lineBg = 'rgba(39, 201, 63, 0.15)';
            lineTextColor = '#82f096';
          }

          return (
            <View key={idx} style={[styles.codeLine, { backgroundColor: lineBg }]}>
              <Text style={styles.lineNumber}>{String(idx + 1).padStart(2, ' ')}</Text>
              <Text style={[styles.lineCode, { color: lineTextColor }]}>{line}</Text>
            </View>
          );
        })}
      </View>

      {/* Prevention Prescription Card */}
      {prevention ? (
        <View style={styles.preventionCard}>
          <Text style={styles.preventionTitle}>
            Prescription for Prevention
          </Text>
          <Text style={styles.preventionText}>
            {prevention}
          </Text>
        </View>
      ) : null}

      {/* Web Verification References */}
      {searchResults.length > 0 && (
        <View style={styles.webSearchBlock}>
          <Text style={styles.searchBlockTitle}>
            Documentation & Official References
          </Text>
          {searchResults.map((item, i) => (
            <View key={i} style={styles.searchItem}>
              <Text style={styles.searchItemTitle}>
                {item.title}
              </Text>
              <Text style={styles.searchItemSnippet} numberOfLines={2}>
                {item.snippet}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Verification Feedback Loop */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackPrompt}>
          Did this prescription resolve the condition?
        </Text>
        <View style={styles.feedbackButtonsRow}>
          <Pressable
            onPress={() => recordOutcome(true)}
            style={({ pressed }) => [
              styles.feedbackBtnPrimary,
              { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
            ]}
          >
            <Text style={styles.feedbackBtnPrimaryText}>
              {patientStatus === 'cured' ? '✓ Cured (Saved in Memory)' : 'Yes, Cured'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => recordOutcome(false)}
            style={({ pressed }) => [
              styles.feedbackBtnSecondary,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Text style={styles.feedbackBtnSecondaryText}>
              Still Failing (Refine)
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceCard,
    padding: Spacing.four,
    gap: Spacing.three,
    marginTop: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.2,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionPillPrimary: {
    backgroundColor: DesignTokens.colors.primary,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 14,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionPillPrimaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
  actionPillSecondary: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 14,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionPillSecondaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.ink,
  },
  codeBox: {
    backgroundColor: DesignTokens.colors.surfaceDark,
    borderRadius: DesignTokens.rounded.md,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    gap: 2,
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: DesignTokens.rounded.sm,
  },
  lineNumber: {
    width: 28,
    color: DesignTokens.colors.mute,
    fontSize: 11,
    fontFamily: 'monospace',
    userSelect: 'none',
  },
  lineCode: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  preventionCard: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.md,
    padding: Spacing.three,
    gap: 4,
  },
  preventionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  preventionText: {
    fontSize: 13,
    lineHeight: 19,
    color: DesignTokens.colors.body,
  },
  webSearchBlock: {
    gap: 6,
    paddingTop: 2,
  },
  searchBlockTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.mute,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchItem: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.sm,
    padding: Spacing.three,
    gap: 3,
  },
  searchItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  searchItemSnippet: {
    fontSize: 12,
    color: DesignTokens.colors.body,
    lineHeight: 17,
  },
  feedbackSection: {
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.hairline,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  feedbackPrompt: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.ink,
  },
  feedbackButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  feedbackBtnPrimary: {
    backgroundColor: DesignTokens.colors.primary,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackBtnPrimaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
  feedbackBtnSecondary: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackBtnSecondaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
});

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { DesignTokens, Spacing } from '@/constants/theme';

export function PatientChartCard() {
  const { sessionId, patientStatus, patientFacts, learningStore } = useClinic();

  const getStatusBadgeStyle = () => {
    switch (patientStatus) {
      case 'cured':
        return { bg: DesignTokens.colors.surfaceDark, text: DesignTokens.colors.onDark, label: 'CURED' };
      case 'prescribed':
        return { bg: DesignTokens.colors.primary, text: DesignTokens.colors.onPrimary, label: 'PRESCRIBED' };
      case 'diagnosing':
        return { bg: DesignTokens.colors.surfaceSoft, text: DesignTokens.colors.ink, label: 'DIAGNOSING' };
      default:
        return { bg: DesignTokens.colors.surfaceSoft, text: DesignTokens.colors.body, label: 'INTAKE' };
    }
  };

  const badge = getStatusBadgeStyle();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Patient Medical Chart</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Patient ID & Phase */}
        <View style={styles.gridRow}>
          <View style={styles.statCol}>
            <Text style={styles.metaLabel}>RECORD ID</Text>
            <Text style={styles.metaValue}>{sessionId}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.metaLabel}>CURED CASES</Text>
            <Text style={[styles.metaValue, { color: DesignTokens.colors.ink }]}>
              {patientFacts.resolvedCount} solved
            </Text>
          </View>
        </View>

        {/* Detected Tech Stack */}
        <View style={styles.section}>
          <Text style={styles.metaLabel}>DETECTED TECH STACK</Text>
          <View style={styles.chipsContainer}>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Lang: </Text>
              <Text style={styles.chipVal}>{patientFacts.language || 'Awaiting Input'}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Framework: </Text>
              <Text style={styles.chipVal}>{patientFacts.framework || 'General'}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>OS: </Text>
              <Text style={styles.chipVal}>{patientFacts.os || 'Cross-platform'}</Text>
            </View>
          </View>
        </View>

        {/* Active Error Signature */}
        <View style={styles.section}>
          <Text style={styles.metaLabel}>ACTIVE ERROR SIGNATURE</Text>
          <View style={styles.errorBox}>
            <Text style={styles.errorText} numberOfLines={3}>
              {patientFacts.errorSignature || 'No active pathology recorded. Intake clear.'}
            </Text>
          </View>
        </View>

        {/* Clinical Knowledge Memory */}
        <View style={styles.section}>
          <Text style={styles.metaLabel}>CLINICAL MEMORY</Text>
          <View style={styles.memoryBox}>
            <Text style={styles.memoryText}>
              🧠 {learningStore.length} verified surgical cures in neural clinical memory.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceCard,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: DesignTokens.rounded.full,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  body: {
    gap: Spacing.three,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DesignTokens.colors.mute,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: DesignTokens.colors.ink,
  },
  section: {
    gap: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: DesignTokens.colors.body,
  },
  chipVal: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.ink,
  },
  errorBox: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.md,
    padding: Spacing.three,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: DesignTokens.colors.charcoal,
    lineHeight: 18,
  },
  memoryBox: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.md,
    padding: Spacing.three,
  },
  memoryText: {
    fontSize: 12,
    color: DesignTokens.colors.body,
    lineHeight: 18,
  },
});

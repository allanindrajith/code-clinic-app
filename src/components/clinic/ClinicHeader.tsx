import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { MascotIcon } from './MascotIcon';
import { DesignTokens, Spacing } from '@/constants/theme';

interface ClinicHeaderProps {
  onToggleChart?: () => void;
  showChartButton?: boolean;
}

export function ClinicHeader({ onToggleChart, showChartButton = true }: ClinicHeaderProps) {
  const { sessionId, patientStatus, resetPatient } = useClinic();

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
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <MascotIcon size={32} />
          <View style={styles.titleColumn}>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>Code Clinic</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>v1.0</Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <View style={[styles.pulseDot, { backgroundColor: getStatusColor() }]} />
              <Text style={styles.statusText}>{getStatusLabel()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionText}>{sessionId}</Text>
          </View>

          {showChartButton && onToggleChart && (
            <Pressable
              onPress={onToggleChart}
              style={({ pressed }) => [
                styles.chartButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Text style={styles.chartButtonText}>📋 Chart</Text>
            </Pressable>
          )}

          <Pressable
            onPress={resetPatient}
            style={({ pressed }) => [
              styles.newPatientButton,
              { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
            ]}
          >
            <Text style={styles.newPatientText}>+ New Patient</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: DesignTokens.colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 4,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.2,
  },
  badge: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: DesignTokens.rounded.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.body,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: DesignTokens.rounded.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '400',
    color: DesignTokens.colors.body,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sessionBadge: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignTokens.rounded.full,
  },
  sessionText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'monospace',
    color: DesignTokens.colors.charcoal,
  },
  chartButton: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: DesignTokens.rounded.full,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.ink,
  },
  newPatientButton: {
    backgroundColor: DesignTokens.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: DesignTokens.rounded.full,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPatientText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
});

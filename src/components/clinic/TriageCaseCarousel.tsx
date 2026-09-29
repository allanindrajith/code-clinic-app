import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { TriageTemplate } from '@/services/clinicEngine';
import { DesignTokens, Spacing } from '@/constants/theme';

interface TriageCaseCarouselProps {
  onSelectCase?: () => void;
}

export function TriageCaseCarousel({ onSelectCase }: TriageCaseCarouselProps) {
  const { triageTemplates, activeTriageId, loadTriageCase } = useClinic();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1150;

  const handlePickCase = (template: TriageTemplate) => {
    loadTriageCase(template.id);
    if (onSelectCase) {
      onSelectCase();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Emergency Room Triage</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Test real-world cases instantly. Tap any case to admit the patient to Dr. Debug:
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollList, isDesktop && styles.desktopScrollList]}
      >
        {triageTemplates.map((item) => {
          const isActive = activeTriageId === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => handlePickCase(item)}
              style={({ pressed }) => [
                styles.caseCard,
                {
                  borderColor: isActive
                    ? DesignTokens.colors.ink
                    : DesignTokens.colors.hairline,
                  borderWidth: isActive ? 2 : 1,
                  opacity: pressed ? 0.85 : 1,
                }
              ]}
            >
              <View style={styles.badgeRow}>
                <View style={styles.techBadge}>
                  <Text style={styles.techBadgeText}>
                    {item.badge}
                  </Text>
                </View>
                {isActive && (
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>ADMITTED</Text>
                  </View>
                )}
              </View>

              <Text style={styles.caseTitle} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.caseExpected} numberOfLines={2}>
                {item.expected}
              </Text>

              <View style={[
                styles.admitButton,
                {
                  backgroundColor: isActive ? DesignTokens.colors.surfaceDark : DesignTokens.colors.primary,
                }
              ]}>
                <Text style={styles.admitButtonText}>
                  {isActive ? '✓ Examining Now' : 'Admit Patient →'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: DesignTokens.colors.body,
  },
  scrollList: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  desktopScrollList: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  caseCard: {
    width: 260,
    borderRadius: DesignTokens.rounded.lg,
    backgroundColor: DesignTokens.colors.surfaceCard,
    padding: Spacing.four,
    gap: Spacing.two + 2,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techBadge: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DesignTokens.rounded.full,
  },
  techBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  activePill: {
    backgroundColor: DesignTokens.colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DesignTokens.rounded.full,
  },
  activePillText: {
    color: DesignTokens.colors.onPrimary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  caseTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    color: DesignTokens.colors.ink,
    minHeight: 42,
  },
  caseExpected: {
    fontSize: 13,
    lineHeight: 18,
    color: DesignTokens.colors.body,
  },
  admitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: DesignTokens.rounded.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    height: 36,
  },
  admitButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
});

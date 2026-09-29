import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable
} from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { LearningRecord } from '@/services/clinicEngine';
import { DesignTokens, Spacing } from '@/constants/theme';

interface LearningVaultCardProps {
  onApplyCure?: (cure: LearningRecord) => void;
}

export function LearningVaultCard({ onApplyCure }: LearningVaultCardProps) {
  const { learningStore, updateDraft, submitConsultation } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = learningStore.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.signature.toLowerCase().includes(q) ||
      item.symptom.toLowerCase().includes(q) ||
      item.root_cause.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleApply = (item: LearningRecord) => {
    const draftData = {
      symptom: item.symptom,
      error: item.signature,
      code: item.code_patch,
      expected: 'Clean execution without runtime pathology',
      actual: item.symptom,
    };
    updateDraft(draftData);
    submitConsultation(draftData);

    if (onApplyCure) {
      onApplyCure(item);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Clinical Knowledge Store</Text>
        </View>
        <Text style={styles.subtitle}>
          Verified cures stored with confidence scores. Search by error string or keyword:
        </Text>
      </View>

      {/* Search Pill */}
      <View style={styles.searchRow}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search cures (e.g. cookies, undefined, loop, eacces)..."
          placeholderTextColor={DesignTokens.colors.mute}
          style={styles.searchInput}
        />
      </View>

      {/* Records List */}
      <View style={styles.recordsList}>
        {filtered.map((item) => {
          const confidencePct = Math.round(item.confidence * 100);

          return (
            <View key={item.id} style={styles.recordItem}>
              <View style={styles.recordHeader}>
                <View style={styles.stackBadge}>
                  <Text style={styles.stackBadgeText}>
                    {item.stack.framework}
                  </Text>
                </View>

                <View style={styles.confidencePill}>
                  <Text style={styles.confidenceText}>
                    {confidencePct}% Confidence ({item.success_count} cured)
                  </Text>
                </View>
              </View>

              <Text style={styles.signature}>
                {item.signature}
              </Text>

              <Text style={styles.rootCause} numberOfLines={2}>
                {item.root_cause}
              </Text>

              <View style={styles.footerRow}>
                <View style={styles.keywordsRow}>
                  {item.keywords.slice(0, 3).map((kw) => (
                    <Text key={kw} style={styles.kwTag}>
                      #{kw}
                    </Text>
                  ))}
                </View>

                <Pressable
                  onPress={() => handleApply(item)}
                  style={({ pressed }) => [
                    styles.applyButton,
                    { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
                  ]}
                >
                  <Text style={styles.applyButtonText}>
                    Load Case →
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
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
  header: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: DesignTokens.colors.body,
  },
  searchRow: {
    marginTop: 2,
  },
  searchInput: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: DesignTokens.colors.ink,
    height: 38,
  },
  recordsList: {
    gap: Spacing.three,
  },
  recordItem: {
    borderRadius: DesignTokens.rounded.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stackBadge: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: DesignTokens.rounded.full,
  },
  stackBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  confidencePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.body,
  },
  signature: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    lineHeight: 19,
  },
  rootCause: {
    fontSize: 12,
    color: DesignTokens.colors.body,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  keywordsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  kwTag: {
    fontSize: 11,
    color: DesignTokens.colors.mute,
    fontWeight: '400',
  },
  applyButton: {
    backgroundColor: DesignTokens.colors.primary,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 14,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { DesignTokens, Spacing } from '@/constants/theme';

export function CodeIcuCard() {
  const {
    sandboxCode,
    setSandboxCode,
    sandboxLanguage,
    setSandboxLanguage,
    sandboxOutput,
    sandboxStatus,
    runSandbox
  } = useClinic();

  const getStatusColor = () => {
    switch (sandboxStatus) {
      case 'Success':
        return DesignTokens.colors.terminalGreen;
      case 'Error':
        return DesignTokens.colors.terminalRed;
      case 'Running':
        return DesignTokens.colors.terminalYellow;
      default:
        return DesignTokens.colors.body;
    }
  };

  return (
    <View style={styles.terminalCard}>
      {/* Terminal Title Bar */}
      <View style={styles.terminalHeader}>
        <View style={styles.trafficLights}>
          <View style={[styles.dot, { backgroundColor: DesignTokens.colors.terminalRed }]} />
          <View style={[styles.dot, { backgroundColor: DesignTokens.colors.terminalYellow }]} />
          <View style={[styles.dot, { backgroundColor: DesignTokens.colors.terminalGreen }]} />
        </View>

        <Text style={styles.terminalTitle}>
          code-clinic-icu-sandbox
        </Text>

        <View style={styles.langPills}>
          <Pressable
            onPress={() => setSandboxLanguage('javascript')}
            style={[
              styles.langPill,
              sandboxLanguage === 'javascript' && styles.langPillActive,
            ]}
          >
            <Text style={[
              styles.langPillText,
              sandboxLanguage === 'javascript' && styles.langPillTextActive,
            ]}>
              JS / TS
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSandboxLanguage('python')}
            style={[
              styles.langPill,
              sandboxLanguage === 'python' && styles.langPillActive,
            ]}
          >
            <Text style={[
              styles.langPillText,
              sandboxLanguage === 'python' && styles.langPillTextActive,
            ]}>
              Python 3
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Editor & Output Split */}
      <View style={styles.editorBody}>
        <View style={styles.paneBar}>
          <Text style={styles.paneTitle}>
            Source Snippet ({sandboxLanguage})
          </Text>

          <Pressable
            onPress={() => runSandbox()}
            disabled={sandboxStatus === 'Running'}
            style={({ pressed }) => [
              styles.runButton,
              { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
            ]}
          >
            {sandboxStatus === 'Running' ? (
              <ActivityIndicator size="small" color={DesignTokens.colors.onPrimary} />
            ) : (
              <Text style={styles.runButtonText}>
                Execute Code
              </Text>
            )}
          </Pressable>
        </View>

        <TextInput
          multiline
          value={sandboxCode}
          onChangeText={setSandboxCode}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          style={styles.codeEditorInput}
        />

        {/* Output pane */}
        <View style={styles.outputPaneBar}>
          <Text style={styles.paneTitle}>
            Execution Output
          </Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusLabel, { color: getStatusColor() }]}>{sandboxStatus}</Text>
          </View>
        </View>

        <View style={styles.outputContainer}>
          <Text style={styles.outputText} selectable>
            {sandboxOutput}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  terminalCard: {
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceCard,
    overflow: 'hidden',
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 4,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
  },
  trafficLights: {
    flexDirection: 'row',
    gap: 6,
    width: 60,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: DesignTokens.rounded.full,
  },
  terminalTitle: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: DesignTokens.colors.body,
    fontWeight: '400',
  },
  langPills: {
    flexDirection: 'row',
    gap: 4,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: DesignTokens.rounded.full,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.canvas,
  },
  langPillActive: {
    backgroundColor: DesignTokens.colors.primary,
    borderColor: DesignTokens.colors.primary,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.body,
  },
  langPillTextActive: {
    color: DesignTokens.colors.onPrimary,
  },
  editorBody: {
    backgroundColor: DesignTokens.colors.surfaceCard,
  },
  paneBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceCard,
  },
  outputPaneBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.hairline,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceCard,
  },
  paneTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  runButton: {
    backgroundColor: DesignTokens.colors.primary,
    paddingHorizontal: 16,
    height: 32,
    borderRadius: DesignTokens.rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
  codeEditorInput: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    color: DesignTokens.colors.ink,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
    padding: Spacing.four,
    minHeight: 180,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: DesignTokens.rounded.full,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  outputContainer: {
    backgroundColor: DesignTokens.colors.surfaceDark,
    padding: Spacing.four,
    minHeight: 120,
  },
  outputText: {
    color: DesignTokens.colors.onDark,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});

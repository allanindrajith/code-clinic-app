import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  Linking
} from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { DesignTokens, Spacing } from '@/constants/theme';
import { AIProviderType } from '@/services/aiProviderService';

interface AISettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AISettingsModal({ visible, onClose }: AISettingsModalProps) {
  const { aiSettings, updateAISettings, testAIConnection } = useClinic();

  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>(aiSettings.provider);
  const [geminiKey, setGeminiKey] = useState(aiSettings.geminiKey);
  const [openaiKey, setOpenaiKey] = useState(aiSettings.openaiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    updateAISettings({
      provider: selectedProvider,
      geminiKey: geminiKey.trim(),
      openaiKey: openaiKey.trim(),
    });
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const activeKey = selectedProvider === 'gemini' ? geminiKey.trim() : openaiKey.trim();
      const res = await testAIConnection(selectedProvider, activeKey);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Connection test failed.' });
    } finally {
      setTesting(false);
    }
  };

  const openGeminiKeyPage = () => {
    Linking.openURL('https://aistudio.google.com/app/apikey');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>AI Engine & Token Settings</Text>
              <Text style={styles.subtitle}>
                Connect free Google Gemini or agent tokens for live AI diagnosis
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Provider Tabs */}
          <View style={styles.providerTabs}>
            <Pressable
              onPress={() => {
                setSelectedProvider('gemini');
                setTestResult(null);
              }}
              style={[
                styles.tabBtn,
                selectedProvider === 'gemini' && styles.tabBtnActive
              ]}
            >
              <Text style={[styles.tabBtnText, selectedProvider === 'gemini' && styles.tabBtnTextActive]}>
                ✨ Google Gemini (Free)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setSelectedProvider('local');
                setTestResult(null);
              }}
              style={[
                styles.tabBtn,
                selectedProvider === 'local' && styles.tabBtnActive
              ]}
            >
              <Text style={[styles.tabBtnText, selectedProvider === 'local' && styles.tabBtnTextActive]}>
                🩺 Local Engine
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setSelectedProvider('openai');
                setTestResult(null);
              }}
              style={[
                styles.tabBtn,
                selectedProvider === 'openai' && styles.tabBtnActive
              ]}
            >
              <Text style={[styles.tabBtnText, selectedProvider === 'openai' && styles.tabBtnTextActive]}>
                🤖 Agent Token
              </Text>
            </Pressable>
          </View>

          {/* Content by Provider */}
          {selectedProvider === 'gemini' && (
            <View style={styles.providerBody}>
              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerText}>
                  ✨ Google Gemini 2.0 / 1.5 Flash offers a 100% free tier for developers with high rate limits.
                </Text>
                <Pressable onPress={openGeminiKeyPage} style={styles.linkRow}>
                  <Text style={styles.linkText}>Get Free Gemini API Key from Google AI Studio →</Text>
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Gemini API Key / Token:</Text>
                <TextInput
                  value={geminiKey}
                  onChangeText={setGeminiKey}
                  placeholder="AIzaSy..."
                  placeholderTextColor={DesignTokens.colors.mute}
                  style={styles.keyInput}
                  secureTextEntry={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
          )}

          {selectedProvider === 'local' && (
            <View style={styles.providerBody}>
              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerText}>
                  🩺 The Local Clinical Engine runs 100% offline inside the client with instant response times, zero token usage, and pre-trained surgical patch templates.
                </Text>
              </View>
            </View>
          )}

          {selectedProvider === 'openai' && (
            <View style={styles.providerBody}>
              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerText}>
                  🤖 Connect an OpenAI-compatible agent token (OpenAI, OpenRouter, Groq).
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>API Bearer Token:</Text>
                <TextInput
                  value={openaiKey}
                  onChangeText={setOpenaiKey}
                  placeholder="sk-..."
                  placeholderTextColor={DesignTokens.colors.mute}
                  style={styles.keyInput}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
          )}

          {/* Test Status Banner */}
          {testResult && (
            <View
              style={[
                styles.testResultBox,
                testResult.success ? styles.testSuccessBox : styles.testErrorBox
              ]}
            >
              <Text
                style={[
                  styles.testResultText,
                  testResult.success ? styles.testSuccessText : styles.testErrorText
                ]}
              >
                {testResult.message}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.footer}>
            {selectedProvider !== 'local' && (
              <Pressable
                onPress={handleTest}
                disabled={testing}
                style={({ pressed }) => [styles.testBtn, { opacity: pressed ? 0.7 : 1 }]}
              >
                {testing ? (
                  <ActivityIndicator size="small" color={DesignTokens.colors.ink} />
                ) : (
                  <Text style={styles.testBtnText}>⚡ Test Connection</Text>
                )}
              </Pressable>
            )}

            <View style={styles.rightActions}>
              <Pressable onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  styles.saveBtn,
                  { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
                ]}
              >
                <Text style={styles.saveBtnText}>Save & Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    backgroundColor: DesignTokens.colors.canvas,
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    maxWidth: 540,
    width: '100%',
    padding: Spacing.four + 4,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    color: DesignTokens.colors.body,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 16,
    color: DesignTokens.colors.mute,
    fontWeight: '600',
  },
  providerTabs: {
    flexDirection: 'row',
    backgroundColor: DesignTokens.colors.surfaceSoft,
    padding: 3,
    borderRadius: DesignTokens.rounded.md,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: DesignTokens.rounded.sm,
  },
  tabBtnActive: {
    backgroundColor: DesignTokens.colors.canvas,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.body,
  },
  tabBtnTextActive: {
    color: DesignTokens.colors.ink,
    fontWeight: '600',
  },
  providerBody: {
    gap: Spacing.three,
  },
  infoBanner: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.md,
    padding: Spacing.three,
    gap: 6,
  },
  infoBannerText: {
    fontSize: 12.5,
    color: DesignTokens.colors.charcoal,
    lineHeight: 18,
  },
  linkRow: {
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  keyInput: {
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderRadius: DesignTokens.rounded.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: 'monospace',
    color: DesignTokens.colors.ink,
  },
  testResultBox: {
    padding: 10,
    borderRadius: DesignTokens.rounded.md,
    borderWidth: 1,
  },
  testSuccessBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  testErrorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  testResultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  testSuccessText: {
    color: '#166534',
  },
  testErrorText: {
    color: '#991b1b',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.hairline,
  },
  testBtn: {
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  testBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginLeft: 'auto',
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  cancelBtnText: {
    fontSize: 12.5,
    color: DesignTokens.colors.body,
    fontWeight: '500',
  },
  saveBtn: {
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  saveBtnText: {
    fontSize: 12.5,
    color: '#ffffff',
    fontWeight: '600',
  },
});

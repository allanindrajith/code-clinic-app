import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  KeyboardAvoidingView
} from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { MascotIcon } from './MascotIcon';
import { SurgicalDiffView } from './SurgicalDiffView';
import { AISettingsModal } from './AISettingsModal';
import { DesignTokens, Spacing } from '@/constants/theme';

interface ConsultationViewProps {
  onOpenSandbox?: () => void;
  onOpenHistory?: () => void;
}

const CHAT_PROMPTS = [
  {
    title: 'TypeError: undefined reading .map',
    subtitle: 'Fix uninitialized array state in React / JS',
    error: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (UserList.jsx:18:14)
    at renderWithHooks (react-dom.development.js:15486)`,
    code: `function UserList() {
  const [users, setUsers] = useState();
  return <div>{users.map(u => <p key={u.id}>{u.name}</p>)}</div>;
}`
  },
  {
    title: 'Next.js 15: cookies() await fix',
    subtitle: 'Resolve async cookies() Promise in Route handler',
    error: `Error: Route handler cookies() should be awaited in Next.js 15. The \`cookies()\` function now returns a Promise.`,
    code: `import { cookies } from 'next/headers';
export async function GET() {
  const store = cookies();
  return Response.json({ token: store.get('token')?.value });
}`
  },
  {
    title: 'CORS: No Access-Control-Allow-Origin',
    subtitle: 'Fix cross-origin resource sharing blocker',
    error: `Access to fetch at 'https://api.clinic.dev/data' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`,
    code: `const res = await fetch('https://api.clinic.dev/data');
const data = await res.json();`
  },
  {
    title: 'Port in Use: listen EADDRINUSE :3000',
    subtitle: 'Kill zombie process or configure dynamic port',
    error: `Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1898:16)`,
    code: `// start dev server: npm run dev`
  }
];

export function ConsultationView({ onOpenSandbox, onOpenHistory }: ConsultationViewProps) {
  const {
    sessionId,
    messages,
    draft,
    updateDraft,
    clearDraft,
    submitConsultation,
    patientStatus,
    latestDiagnosis,
    answerClarifyingQuestion,
    aiSettings,
    newSession
  } = useClinic();

  const { width } = useWindowDimensions();
  const isCompact = width < 600;

  const [inputText, setInputText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [showCodeAttachment, setShowCodeAttachment] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [showAISettings, setShowAISettings] = useState(false);
  const [clarificationInput, setClarificationInput] = useState('');

  const messageScrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    const timer = setTimeout(() => {
      messageScrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages.length, patientStatus]);

  const isDiagnosing = patientStatus === 'diagnosing';
  const hasInput = !!(inputText.trim() || codeText.trim() || draft.error?.trim() || draft.symptom?.trim());

  // Check if conversation only has the initial welcome greeting
  const isInitialWelcomeOnly = messages.length <= 1;

  const handleSend = () => {
    const query = inputText.trim() || draft.error || draft.symptom;
    if (!query && !codeText.trim()) return;

    submitConsultation({
      error: query,
      symptom: query.split('\n')[0] || 'Diagnose reported error',
      code: codeText.trim() || draft.code,
      expected: 'Expected execution without runtime error.',
      actual: query
    });

    setInputText('');
    setCodeText('');
    setShowCodeAttachment(false);
    clearDraft();
  };

  const handleApplyPrompt = (prompt: typeof CHAT_PROMPTS[0]) => {
    submitConsultation({
      error: prompt.error,
      symptom: prompt.title,
      code: prompt.code,
      expected: 'Expected smooth execution without errors.',
      actual: prompt.error
    });
  };

  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputText(prev => (prev ? `${prev}\n${text.trim()}` : text.trim()));
          setPasteNotice('✓ Error trace pasted');
          setTimeout(() => setPasteNotice(null), 2000);
          inputRef.current?.focus();
          return;
        }
      }
    } catch {
      // Fallback
    }
    setPasteNotice('Press Cmd+V / Ctrl+V in the box');
    setTimeout(() => setPasteNotice(null), 2500);
    inputRef.current?.focus();
  };

  const handleClarificationSubmit = () => {
    if (!clarificationInput.trim()) return;
    answerClarifyingQuestion(clarificationInput.trim());
    setClarificationInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.chatContainer}
    >
      {/* ChatGPT-style Main Card Container */}
      <View style={styles.chatCard}>
        {/* Top Session Breadcrumb Bar */}
        <View style={styles.topSessionBar}>
          <View style={styles.sessionInfoLeft}>
            {onOpenHistory && (
              <Pressable
                onPress={onOpenHistory}
                style={styles.historyPillBtn}
                accessibilityLabel="View previous chats"
              >
                <Text style={styles.historyPillIcon}>💬</Text>
                <Text style={styles.historyPillText}>Previous Chats</Text>
              </Pressable>
            )}
            <View style={styles.sessionBadgePill}>
              <View style={styles.sessionDot} />
              <Text style={styles.sessionIdText}>{sessionId}</Text>
            </View>
          </View>

          <View style={styles.sessionInfoRight}>
            <Pressable
              onPress={() => setShowAISettings(true)}
              style={({ pressed }) => [
                styles.modelSelectorPill,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select AI Engine"
            >
              <Text style={styles.modelSelectorText}>
                {aiSettings.provider === 'gemini'
                  ? `✨ ${aiSettings.model || 'Gemini 3.8 Flash'} ▾`
                  : (aiSettings.provider === 'openai' ? '🤖 Agent LLM ▾' : '🩺 Local Engine ▾')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => newSession()}
              style={({ pressed }) => [
                styles.iconBtn,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              accessibilityLabel="Start a new chat"
            >
              <Text style={styles.iconBtnText}>＋</Text>
            </Pressable>
          </View>
        </View>

        {/* Message Stream */}
        <ScrollView
          ref={messageScrollRef}
          style={styles.messageScroll}
          contentContainerStyle={[
            styles.messageList,
            isInitialWelcomeOnly && styles.messageListCentered
          ]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {/* ChatGPT-style Welcome / Empty State */}
          {isInitialWelcomeOnly && (
            <View style={styles.welcomeHero}>
              <View style={styles.mascotAura}>
                <MascotIcon size={56} />
              </View>
              <Text style={styles.welcomeTitle}>
                What error are we fixing today?
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Paste any terminal trace, compiler error, or broken component. Dr. Debug diagnoses the root cause and prescribes step-by-step instructions.
              </Text>

              {/* Prompt Suggestion Cards (ChatGPT mobile style) */}
              <View style={styles.promptCardsGrid}>
                {CHAT_PROMPTS.map((p) => (
                  <Pressable
                    key={p.title}
                    onPress={() => handleApplyPrompt(p)}
                    style={({ pressed }) => [
                      styles.promptCard,
                      { opacity: pressed ? 0.75 : 1 }
                    ]}
                  >
                    <Text style={styles.promptCardTitle}>{p.title}</Text>
                    <Text style={styles.promptCardSubtitle}>{p.subtitle}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Render Actual Conversation Messages */}
          {!isInitialWelcomeOnly && messages.map((msg) => {
            const isDoctor = msg.role === 'assistant';

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isDoctor ? styles.doctorRow : styles.userRow
                ]}
              >
                {isDoctor && (
                  <View style={styles.doctorAvatarBox}>
                    <MascotIcon size={28} />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    isDoctor ? styles.doctorBubble : styles.userBubble
                  ]}
                >
                  <View style={styles.bubbleHeader}>
                    <Text style={[styles.speakerName, { color: isDoctor ? DesignTokens.colors.ink : '#ffffff' }]}>
                      {isDoctor ? 'Dr. Debug' : 'You'}
                    </Text>
                    <Text style={[styles.timestamp, { color: isDoctor ? DesignTokens.colors.mute : 'rgba(255,255,255,0.7)' }]}>
                      {msg.timestamp}
                    </Text>
                  </View>

                  {/* Message Content */}
                  <View style={styles.contentContainer}>
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <Text
                            key={pIdx}
                            style={[styles.sectionHeader, { color: isDoctor ? DesignTokens.colors.ink : '#ffffff' }]}
                          >
                            {paragraph.replace('### ', '')}
                          </Text>
                        );
                      }
                      if (paragraph.startsWith('---')) {
                        return <View key={pIdx} style={styles.contentDivider} />;
                      }
                      return (
                        <Text
                          key={pIdx}
                          style={[styles.bubbleParagraph, { color: isDoctor ? DesignTokens.colors.ink : '#ffffff' }]}
                        >
                          {paragraph}
                        </Text>
                      );
                    })}
                  </View>

                  {/* Attached Code Snippet if sent by user */}
                  {msg.code ? (
                    <View style={styles.snippetBlock}>
                      <Text style={styles.snippetLabel}>Attached Code:</Text>
                      <Text style={styles.snippetText} numberOfLines={8}>{msg.code}</Text>
                    </View>
                  ) : null}

                  {/* Attached Error Trace if sent by user */}
                  {msg.error && msg.error !== msg.content ? (
                    <View style={styles.errorBlock}>
                      <Text style={styles.errorLabel}>Error Log / Trace:</Text>
                      <Text style={styles.errorText} numberOfLines={6}>{msg.error}</Text>
                    </View>
                  ) : null}

                  {/* Surgical diff & prescription */}
                  {msg.payload?.patchCode ? (
                    <SurgicalDiffView
                      patchCode={msg.payload.patchCode}
                      prevention={msg.payload.prevention}
                      searchResults={msg.payload.searchResults}
                      onOpenSandbox={onOpenSandbox}
                    />
                  ) : null}
                </View>
              </View>
            );
          })}

          {/* Typing/Diagnosing Indicator */}
          {isDiagnosing && (
            <View style={styles.diagnosingRow}>
              <View style={styles.doctorAvatarBox}>
                <MascotIcon size={24} />
              </View>
              <View style={styles.diagnosingBubble}>
                <ActivityIndicator color={DesignTokens.colors.primary} size="small" />
                <Text style={styles.diagnosingText}>
                  Dr. Debug is diagnosing and preparing step-by-step instructions...
                </Text>
              </View>
            </View>
          )}

          {/* Clarifying Question Modal Box */}
          {latestDiagnosis?.phase === 'intake' && latestDiagnosis.clarifyingQuestion && (
            <View style={styles.clarifyBox}>
              <Text style={styles.clarifyTitle}>🩺 Clarifying Question from Dr. Debug:</Text>
              <Text style={styles.clarifyText}>{latestDiagnosis.clarifyingQuestion}</Text>
              <View style={styles.clarifyInputRow}>
                <TextInput
                  value={clarificationInput}
                  onChangeText={setClarificationInput}
                  placeholder="Answer Dr. Debug's question..."
                  placeholderTextColor={DesignTokens.colors.mute}
                  style={styles.clarifyInput}
                />
                <Pressable
                  onPress={handleClarificationSubmit}
                  style={({ pressed }) => [
                    styles.clarifySubmitBtn,
                    { backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary }
                  ]}
                >
                  <Text style={styles.clarifySubmitText}>Send</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ChatGPT Mobile Floating Bottom Composer */}
        <View style={styles.floatingComposerArea}>
          {/* Paste notice badge */}
          {pasteNotice && (
            <View style={styles.pasteNoticeBadge}>
              <Text style={styles.pasteNoticeText}>{pasteNotice}</Text>
            </View>
          )}

          {/* Quick accessory chips above input */}
          <View style={styles.composerAccessoryRow}>
            <Pressable
              onPress={handlePasteClipboard}
              style={({ pressed }) => [
                styles.accessoryChip,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.accessoryChipText}>📋 Paste Clipboard</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowCodeAttachment(!showCodeAttachment)}
              style={({ pressed }) => [
                styles.accessoryChip,
                showCodeAttachment && styles.accessoryChipActive,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              accessibilityRole="button"
            >
              <Text style={[styles.accessoryChipText, showCodeAttachment && styles.accessoryChipTextActive]}>
                {showCodeAttachment ? '✕ Hide Code' : '+ Attach Code'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowAISettings(true)}
              style={({ pressed }) => [
                styles.accessoryChip,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.accessoryChipText}>
                {aiSettings.provider === 'gemini' ? '✨ Gemini (Free)' : '🩺 Local'}
              </Text>
            </Pressable>
          </View>

          {/* Collapsible Code Attachment Box */}
          {showCodeAttachment && (
            <View style={styles.codeAttachmentBox}>
              <View style={styles.codeAttachmentHeader}>
                <Text style={styles.codeAttachmentLabel}>Attached Code Snippet:</Text>
                <Pressable onPress={() => setShowCodeAttachment(false)}>
                  <Text style={styles.codeCloseText}>✕</Text>
                </Pressable>
              </View>
              <TextInput
                multiline
                numberOfLines={3}
                value={codeText}
                onChangeText={setCodeText}
                placeholder="// Paste broken code snippet here..."
                placeholderTextColor={DesignTokens.colors.mute}
                style={styles.codeAttachmentInput}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Main ChatGPT Pill Input Bar */}
          <View style={styles.inputPillContainer}>
            <Pressable
              onPress={() => setShowCodeAttachment(!showCodeAttachment)}
              style={styles.attachmentButton}
              accessibilityLabel="Attach code snippet"
            >
              <Text style={styles.attachmentButtonIcon}>📎</Text>
            </Pressable>

            <TextInput
              ref={inputRef}
              multiline
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message Dr. Debug or paste error trace..."
              placeholderTextColor={DesignTokens.colors.mute}
              style={styles.mainTextInput}
              onSubmitEditing={(e) => {
                if (Platform.OS === 'web' && !(e.nativeEvent as any).shiftKey) {
                  handleSend();
                }
              }}
            />

            <Pressable
              onPress={handleSend}
              disabled={!hasInput || isDiagnosing}
              style={({ pressed }) => [
                styles.sendCircleBtn,
                hasInput && !isDiagnosing ? styles.sendCircleBtnActive : styles.sendCircleBtnDisabled,
                { opacity: pressed ? 0.75 : 1 }
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send error"
            >
              {isDiagnosing ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={[styles.sendArrowText, hasInput && styles.sendArrowTextActive]}>
                  ↑
                </Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.disclaimerText}>
            Dr. Debug provides clinical diagnostic fixes. Double-check production patches.
          </Text>
        </View>
      </View>

      <AISettingsModal
        visible={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    width: '100%',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
  },
  chatCard: {
    backgroundColor: DesignTokens.colors.canvas,
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: 560,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  topSessionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
  },
  sessionInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
  },
  historyPillIcon: {
    fontSize: 12,
  },
  historyPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  sessionBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DesignTokens.colors.terminalGreen,
  },
  sessionIdText: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  sessionInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modelSelectorPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  modelSelectorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    lineHeight: 16,
  },
  messageScroll: {
    flex: 1,
    minHeight: 380,
    maxHeight: 650,
  },
  messageList: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  messageListCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeHero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
    maxWidth: 580,
    alignSelf: 'center',
    width: '100%',
    gap: 12,
  },
  mascotAura: {
    width: 72,
    height: 72,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  welcomeSubtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: DesignTokens.colors.body,
    textAlign: 'center',
    maxWidth: 480,
  },
  promptCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.two,
    width: '100%',
  },
  promptCard: {
    flex: 1,
    minWidth: '47%',
    padding: 12,
    borderRadius: DesignTokens.rounded.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    gap: 4,
  },
  promptCardTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  promptCardSubtitle: {
    fontSize: 11,
    color: DesignTokens.colors.mute,
    lineHeight: 15,
  },
  messageRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
  },
  doctorRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  doctorAvatarBox: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  messageBubble: {
    maxWidth: '88%',
    borderRadius: DesignTokens.rounded.lg,
    padding: Spacing.three + 2,
    gap: Spacing.two,
    borderWidth: 1,
  },
  doctorBubble: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderColor: DesignTokens.colors.hairline,
  },
  userBubble: {
    backgroundColor: DesignTokens.colors.primary,
    borderColor: DesignTokens.colors.primary,
    alignSelf: 'flex-end',
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  speakerName: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10.5,
  },
  contentContainer: {
    gap: 6,
  },
  sectionHeader: {
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: 4,
  },
  contentDivider: {
    height: 1,
    backgroundColor: DesignTokens.colors.hairline,
    marginVertical: 4,
  },
  bubbleParagraph: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  snippetBlock: {
    padding: Spacing.two + 2,
    borderRadius: DesignTokens.rounded.sm,
    backgroundColor: DesignTokens.colors.surfaceDark,
    marginTop: 4,
  },
  snippetLabel: {
    color: DesignTokens.colors.mute,
    fontSize: 10.5,
    fontWeight: '500',
    marginBottom: 4,
  },
  snippetText: {
    color: DesignTokens.colors.onDark,
    fontSize: 11.5,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    lineHeight: 17,
  },
  errorBlock: {
    padding: Spacing.two + 2,
    borderRadius: DesignTokens.rounded.sm,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: '#fff5f5',
    marginTop: 4,
  },
  errorLabel: {
    color: DesignTokens.colors.terminalRed,
    fontSize: 10.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 11.5,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    lineHeight: 17,
  },
  diagnosingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: 8,
  },
  diagnosingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DesignTokens.rounded.full,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
  },
  diagnosingText: {
    fontSize: 12,
    color: DesignTokens.colors.charcoal,
    fontWeight: '500',
  },
  clarifyBox: {
    marginVertical: Spacing.two,
    padding: Spacing.three,
    borderRadius: DesignTokens.rounded.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    gap: Spacing.two,
  },
  clarifyTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  clarifyText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: DesignTokens.colors.charcoal,
  },
  clarifyInputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  clarifyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    backgroundColor: DesignTokens.colors.canvas,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 12.5,
    color: DesignTokens.colors.ink,
  },
  clarifySubmitBtn: {
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 14,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clarifySubmitText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  floatingComposerArea: {
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.canvas,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    gap: 8,
  },
  pasteNoticeBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DesignTokens.rounded.md,
    alignSelf: 'flex-start',
  },
  pasteNoticeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#166534',
  },
  composerAccessoryRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  accessoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
  },
  accessoryChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  accessoryChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  accessoryChipTextActive: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  codeAttachmentBox: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderRadius: DesignTokens.rounded.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    padding: 8,
    gap: 4,
  },
  codeAttachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeAttachmentLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DesignTokens.colors.charcoal,
  },
  codeCloseText: {
    fontSize: 12,
    color: DesignTokens.colors.mute,
    padding: 2,
  },
  codeAttachmentInput: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: DesignTokens.colors.ink,
    minHeight: 56,
  },
  inputPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderRadius: DesignTokens.rounded.full,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  attachmentButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentButtonIcon: {
    fontSize: 16,
    color: DesignTokens.colors.mute,
  },
  mainTextInput: {
    flex: 1,
    fontSize: 13.5,
    color: DesignTokens.colors.ink,
    paddingVertical: 6,
    maxHeight: 100,
  },
  sendCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCircleBtnActive: {
    backgroundColor: DesignTokens.colors.primary,
  },
  sendCircleBtnDisabled: {
    backgroundColor: DesignTokens.colors.hairlineStrong,
  },
  sendArrowText: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignTokens.colors.mute,
    lineHeight: 18,
  },
  sendArrowTextActive: {
    color: '#ffffff',
  },
  disclaimerText: {
    fontSize: 10.5,
    color: DesignTokens.colors.mute,
    textAlign: 'center',
  },
});

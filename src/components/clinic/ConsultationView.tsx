import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useClinic } from '@/context/ClinicContext';
import { MascotIcon } from './MascotIcon';
import { SurgicalDiffView } from './SurgicalDiffView';
import { DesignTokens, Spacing } from '@/constants/theme';

interface ConsultationViewProps {
  onOpenSandbox?: () => void;
}

export function ConsultationView({ onOpenSandbox }: ConsultationViewProps) {
  const {
    sessionId,
    messages,
    draft,
    updateDraft,
    clearDraft,
    submitConsultation,
    patientStatus,
    latestDiagnosis,
    answerClarifyingQuestion
  } = useClinic();

  const [clarificationInput, setClarificationInput] = useState('');
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

  const handleClarificationSubmit = () => {
    if (!clarificationInput.trim()) return;
    answerClarifyingQuestion(clarificationInput.trim());
    setClarificationInput('');
  };

  const addQuickChip = (tag: string) => {
    const current = draft.symptom;
    const prefix = current ? `${current} [Stack: ${tag}]` : `Stack: ${tag}. Symptom: `;
    updateDraft({ symptom: prefix });
  };

  const isDiagnosing = patientStatus === 'diagnosing';

  return (
    <View style={styles.container}>
      {/* Dialogue Stream */}
      <View style={styles.dialogueCard}>
        <View style={styles.cardTopBar}>
          <View style={styles.roomStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.roomTitle}>Examining Room #1</Text>
          </View>
          <Text style={styles.sessionIdText}>Patient: {sessionId}</Text>
        </View>

        <ScrollView
          style={styles.messageScroll}
          contentContainerStyle={styles.messageList}
          nestedScrollEnabled
        >
          {messages.map((msg) => {
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
                  <View style={styles.avatarCell}>
                    <MascotIcon size={30} />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    isDoctor ? styles.doctorBubble : styles.userBubble
                  ]}
                >
                  <View style={styles.bubbleHeader}>
                    <Text style={[styles.speakerName, { color: DesignTokens.colors.ink }]}>
                      {isDoctor ? 'Dr. Debug' : 'You (Patient)'}
                    </Text>
                    <Text style={styles.timestamp}>
                      {msg.timestamp}
                    </Text>
                  </View>

                  <Text style={styles.bubbleContent}>
                    {msg.content}
                  </Text>

                  {/* Reported code block */}
                  {msg.code ? (
                    <View style={styles.snippetBlock}>
                      <Text style={styles.snippetLabel}>Reported Code:</Text>
                      <Text style={styles.snippetText} numberOfLines={8}>{msg.code}</Text>
                    </View>
                  ) : null}

                  {/* Reported error trace */}
                  {msg.error ? (
                    <View style={styles.errorBlock}>
                      <Text style={styles.errorLabel}>Reported Trace:</Text>
                      <Text style={styles.errorText} numberOfLines={4}>{msg.error}</Text>
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

          {isDiagnosing && (
            <View style={styles.diagnosingRow}>
              <ActivityIndicator color={DesignTokens.colors.ink} size="small" />
              <Text style={styles.diagnosingText}>
                Dr. Debug is checking documentation and synthesizing prescription...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Clarifying question box */}
        {latestDiagnosis?.phase === 'intake' && latestDiagnosis.clarifyingQuestion && (
          <View style={styles.clarifyBox}>
            <Text style={styles.clarifyTitle}>
              🩺 Dr. Debug Follow-up Question:
            </Text>
            <Text style={styles.clarifyText}>
              {latestDiagnosis.clarifyingQuestion}
            </Text>
            <View style={styles.clarifyInputRow}>
              <TextInput
                value={clarificationInput}
                onChangeText={setClarificationInput}
                placeholder="Type your response or paste error..."
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
                <Text style={styles.clarifySubmitText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Intake Prescription & Input Form */}
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Clinical Intake</Text>
          <Pressable
            onPress={() => setShowAdvancedInputs(!showAdvancedInputs)}
            style={({ pressed }) => [styles.toggleAdvancedBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={styles.toggleAdvancedText}>
              {showAdvancedInputs ? '− Less details' : '+ Add code & error trace'}
            </Text>
          </Pressable>
        </View>

        {/* Primary Symptom */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            Symptom Description / What Happened:
          </Text>
          <TextInput
            multiline
            numberOfLines={2}
            value={draft.symptom}
            onChangeText={(txt) => updateDraft({ symptom: txt })}
            placeholder="e.g. Component fails to render after clicking fetch, or route handler throws async error..."
            placeholderTextColor={DesignTokens.colors.mute}
            style={styles.textarea}
          />
        </View>

        {/* Advanced Stack trace & Code Snippet inputs */}
        {showAdvancedInputs && (
          <View style={styles.advancedGrid}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Exact Error / Stack Trace (Optional):
              </Text>
              <TextInput
                multiline
                numberOfLines={3}
                value={draft.error}
                onChangeText={(txt) => updateDraft({ error: txt })}
                placeholder="TypeError: Cannot read properties of undefined..."
                placeholderTextColor={DesignTokens.colors.mute}
                style={styles.monospaceInput}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Relevant Code Block (Optional):
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                value={draft.code}
                onChangeText={(txt) => updateDraft({ code: txt })}
                placeholder="// Paste function or block&#10;export async function GET() { ... }"
                placeholderTextColor={DesignTokens.colors.mute}
                style={styles.monospaceInput}
              />
            </View>
          </View>
        )}

        {/* Command tags & Submit bar */}
        <View style={styles.bottomBar}>
          <View style={styles.chipsRow}>
            <Text style={styles.chipsPrefix}>Stack:</Text>
            {['React', 'Next.js 15', 'Python', 'Docker'].map((tag) => (
              <Pressable
                key={tag}
                onPress={() => addQuickChip(tag)}
                style={({ pressed }) => [
                  styles.chipPill,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Text style={styles.chipPillText}>{tag}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.formActions}>
            <Pressable
              onPress={clearDraft}
              style={({ pressed }) => [
                styles.clearButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>

            <Pressable
              onPress={() => submitConsultation()}
              disabled={isDiagnosing || (!draft.symptom && !draft.error && !draft.code)}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: pressed ? DesignTokens.colors.inkDeep : DesignTokens.colors.primary,
                  opacity: (!draft.symptom && !draft.error && !draft.code) ? 0.4 : 1
                }
              ]}
            >
              <Text style={styles.submitButtonText}>
                {isDiagnosing ? 'Diagnosing...' : 'Consult Dr. Debug'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  dialogueCard: {
    backgroundColor: DesignTokens.colors.surfaceCard,
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    overflow: 'hidden',
  },
  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 4,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceCard,
  },
  roomStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: DesignTokens.colors.terminalGreen,
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  sessionIdText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '400',
    color: DesignTokens.colors.body,
  },
  messageScroll: {
    maxHeight: 520,
  },
  messageList: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  messageRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  doctorRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  avatarCell: {
    width: 32,
    alignItems: 'center',
    paddingTop: 2,
  },
  messageBubble: {
    maxWidth: '92%',
    borderRadius: DesignTokens.rounded.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
  },
  doctorBubble: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderColor: DesignTokens.colors.hairline,
  },
  userBubble: {
    backgroundColor: DesignTokens.colors.canvas,
    borderColor: DesignTokens.colors.hairlineStrong,
    alignSelf: 'flex-end',
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  speakerName: {
    fontSize: 13,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: DesignTokens.colors.mute,
  },
  bubbleContent: {
    fontSize: 14,
    lineHeight: 22,
    color: DesignTokens.colors.ink,
  },
  snippetBlock: {
    padding: Spacing.two + 2,
    borderRadius: DesignTokens.rounded.sm,
    backgroundColor: DesignTokens.colors.surfaceDark,
    marginTop: 4,
  },
  snippetLabel: {
    color: DesignTokens.colors.mute,
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  snippetText: {
    color: DesignTokens.colors.onDark,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  errorBlock: {
    padding: Spacing.two + 2,
    borderRadius: DesignTokens.rounded.sm,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    marginTop: 4,
  },
  errorLabel: {
    color: DesignTokens.colors.terminalRed,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  errorText: {
    color: DesignTokens.colors.ink,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  diagnosingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    justifyContent: 'center',
  },
  diagnosingText: {
    fontSize: 13,
    fontWeight: '400',
    color: DesignTokens.colors.body,
  },
  clarifyBox: {
    margin: Spacing.three,
    padding: Spacing.three,
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    gap: Spacing.two,
  },
  clarifyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  clarifyText: {
    fontSize: 13,
    lineHeight: 19,
    color: DesignTokens.colors.charcoal,
  },
  clarifyInputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  clarifyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.canvas,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
    fontSize: 13,
    color: DesignTokens.colors.ink,
  },
  clarifySubmitBtn: {
    backgroundColor: DesignTokens.colors.primary,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clarifySubmitText: {
    color: DesignTokens.colors.onPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  formCard: {
    borderRadius: DesignTokens.rounded.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceCard,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.2,
  },
  toggleAdvancedBtn: {
    paddingVertical: 4,
  },
  toggleAdvancedText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.body,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  textarea: {
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderRadius: DesignTokens.rounded.md,
    padding: Spacing.three,
    fontSize: 14,
    color: DesignTokens.colors.ink,
    lineHeight: 20,
    minHeight: 64,
  },
  advancedGrid: {
    gap: Spacing.three,
  },
  monospaceInput: {
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderRadius: DesignTokens.rounded.md,
    padding: Spacing.three,
    fontSize: 12,
    fontFamily: 'monospace',
    color: DesignTokens.colors.ink,
    lineHeight: 18,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingTop: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  chipsPrefix: {
    fontSize: 13,
    color: DesignTokens.colors.mute,
    fontWeight: '500',
    marginRight: 2,
  },
  chipPill: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: DesignTokens.colors.ink,
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
    marginLeft: 'auto',
  },
  clearButton: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  submitButton: {
    backgroundColor: DesignTokens.colors.primary,
    borderRadius: DesignTokens.rounded.full,
    paddingHorizontal: 20,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: DesignTokens.colors.onPrimary,
  },
});

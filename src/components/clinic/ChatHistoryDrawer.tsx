import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useClinic, ChatSession } from '@/context/ClinicContext';
import { MascotIcon } from './MascotIcon';
import { DesignTokens, Spacing } from '@/constants/theme';
import { router } from 'expo-router';

interface ChatHistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  onOpenAISettings: () => void;
}

export function ChatHistoryDrawer({ visible, onClose, onOpenAISettings }: ChatHistoryDrawerProps) {
  const {
    sessions,
    currentSessionId,
    switchSession,
    newSession,
    deleteSession,
    aiSettings
  } = useClinic();

  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');

  // Group sessions by date like ChatGPT (Today, Yesterday, Previous 7 Days, Older)
  const groupedSessions = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    const filtered = searchQuery.trim()
      ? sessions.filter(s =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : sessions;

    const today: ChatSession[] = [];
    const yesterday: ChatSession[] = [];
    const last7Days: ChatSession[] = [];
    const older: ChatSession[] = [];

    // Sort descending by updatedAt
    const sorted = [...filtered].sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

    for (const session of sorted) {
      const time = session.updatedAt || session.createdAt || now;
      const diff = now - time;

      if (diff < oneDay) {
        today.push(session);
      } else if (diff < 2 * oneDay) {
        yesterday.push(session);
      } else if (diff < sevenDays) {
        last7Days.push(session);
      } else {
        older.push(session);
      }
    }

    return { today, yesterday, last7Days, older };
  }, [sessions, searchQuery]);

  const handleSelectSession = (id: string) => {
    switchSession(id);
    onClose();
    router.push('/chat');
  };

  const handleNewChat = () => {
    newSession();
    onClose();
    router.push('/chat');
  };

  const drawerWidth = Math.min(320, width * 0.85);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop dismiss touch */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Drawer Content */}
        <View style={[styles.drawerPanel, { width: drawerWidth }]}>
          {/* Top Brand & Close Bar */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <MascotIcon size={26} />
              <Text style={styles.brandTitle}>Code Clinic</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close menu">
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* ChatGPT-style + New Chat Button */}
          <Pressable
            onPress={handleNewChat}
            style={({ pressed }) => [
              styles.newChatBtn,
              { backgroundColor: pressed ? DesignTokens.colors.surfaceCard : DesignTokens.colors.canvas }
            ]}
            accessibilityRole="button"
            accessibilityLabel="Start a new chat"
          >
            <View style={styles.newChatIconBox}>
              <Text style={styles.newChatIconText}>+</Text>
            </View>
            <Text style={styles.newChatText}>New Chat</Text>
            <View style={styles.newChatShortcut}>
              <Text style={styles.newChatShortcutText}>Ctrl+N</Text>
            </View>
          </Pressable>

          {/* Search Input */}
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search previous chats..."
              placeholderTextColor={DesignTokens.colors.mute}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Text style={styles.clearSearchText}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Chat Sessions History List */}
          <ScrollView
            style={styles.sessionsScrollView}
            contentContainerStyle={styles.sessionsList}
            showsVerticalScrollIndicator={false}
          >
            {/* Group: Today */}
            {groupedSessions.today.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupLabel}>Today</Text>
                {groupedSessions.today.map((s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    isActive={s.id === currentSessionId}
                    onSelect={() => handleSelectSession(s.id)}
                    onDelete={() => deleteSession(s.id)}
                  />
                ))}
              </View>
            )}

            {/* Group: Yesterday */}
            {groupedSessions.yesterday.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupLabel}>Yesterday</Text>
                {groupedSessions.yesterday.map((s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    isActive={s.id === currentSessionId}
                    onSelect={() => handleSelectSession(s.id)}
                    onDelete={() => deleteSession(s.id)}
                  />
                ))}
              </View>
            )}

            {/* Group: Previous 7 Days */}
            {groupedSessions.last7Days.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupLabel}>Previous 7 Days</Text>
                {groupedSessions.last7Days.map((s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    isActive={s.id === currentSessionId}
                    onSelect={() => handleSelectSession(s.id)}
                    onDelete={() => deleteSession(s.id)}
                  />
                ))}
              </View>
            )}

            {/* Group: Older */}
            {groupedSessions.older.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupLabel}>Older</Text>
                {groupedSessions.older.map((s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    isActive={s.id === currentSessionId}
                    onSelect={() => handleSelectSession(s.id)}
                    onDelete={() => deleteSession(s.id)}
                  />
                ))}
              </View>
            )}

            {sessions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No previous chats found.</Text>
              </View>
            )}
          </ScrollView>

          {/* Drawer Footer: Model Selector & Settings */}
          <View style={styles.drawerFooter}>
            <Pressable
              onPress={() => {
                onClose();
                onOpenAISettings();
              }}
              style={({ pressed }) => [
                styles.footerModelCard,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={styles.footerModelInfo}>
                <Text style={styles.footerModelLabel}>Active AI Engine</Text>
                <Text style={styles.footerModelName}>
                  {aiSettings.provider === 'gemini'
                    ? (aiSettings.geminiKey ? '✨ Gemini (Live)' : '✨ Gemini (Free)')
                    : (aiSettings.provider === 'openai' ? '🤖 Agent Token' : '🩺 Local Engine')}
                </Text>
              </View>
              <Text style={styles.footerGearIcon}>⚙️</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                onClose();
                router.push('/explore');
              }}
              style={({ pressed }) => [
                styles.labNavBtn,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Text style={styles.labNavText}>🧪 Open ICU Sandbox Lab →</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SessionItem({ session, isActive, onSelect, onDelete }: SessionItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onSelect}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.sessionItem,
        isActive && styles.sessionItemActive,
        (pressed || hovered) && styles.sessionItemHovered
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open chat: ${session.title}`}
    >
      <Text style={styles.sessionItemIcon}>💬</Text>
      <View style={styles.sessionItemDetails}>
        <Text
          numberOfLines={1}
          style={[styles.sessionItemTitle, isActive && styles.sessionItemTitleActive]}
        >
          {session.title || 'Consultation Case'}
        </Text>
        <Text style={styles.sessionItemId}>
          {session.id} · {session.messages.length} msg{session.messages.length === 1 ? '' : 's'}
        </Text>
      </View>

      {/* Delete button */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          onDelete();
        }}
        hitSlop={8}
        style={styles.deleteBtn}
        accessibilityLabel="Delete chat"
      >
        <Text style={styles.deleteBtnText}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    flex: 1,
  },
  drawerPanel: {
    height: '100%',
    backgroundColor: DesignTokens.colors.canvas,
    borderRightWidth: 1,
    borderRightColor: DesignTokens.colors.hairline,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 4, height: 0 },
    elevation: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three + 2,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 16,
    color: DesignTokens.colors.mute,
    fontWeight: '600',
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: DesignTokens.rounded.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairlineStrong,
    gap: 10,
  },
  newChatIconBox: {
    width: 20,
    height: 20,
    borderRadius: DesignTokens.rounded.full,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
    lineHeight: 16,
  },
  newChatText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
    flex: 1,
  },
  newChatShortcut: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    backgroundColor: DesignTokens.colors.surfaceSoft,
  },
  newChatShortcutText: {
    fontSize: 10,
    color: DesignTokens.colors.mute,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: DesignTokens.colors.surfaceSoft,
    borderRadius: DesignTokens.rounded.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
  },
  searchIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: DesignTokens.colors.ink,
    padding: 0,
  },
  clearSearchBtn: {
    padding: 2,
  },
  clearSearchText: {
    fontSize: 11,
    color: DesignTokens.colors.mute,
  },
  sessionsScrollView: {
    flex: 1,
  },
  sessionsList: {
    paddingHorizontal: Spacing.two + 2,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  groupSection: {
    gap: 2,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DesignTokens.colors.mute,
    paddingHorizontal: 8,
    paddingVertical: 4,
    letterSpacing: 0.2,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: DesignTokens.rounded.md,
    gap: 8,
  },
  sessionItemActive: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
  },
  sessionItemHovered: {
    backgroundColor: DesignTokens.colors.surfaceSoft,
  },
  sessionItemIcon: {
    fontSize: 14,
  },
  sessionItemDetails: {
    flex: 1,
    gap: 1,
  },
  sessionItemTitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: DesignTokens.colors.charcoal,
  },
  sessionItemTitleActive: {
    color: DesignTokens.colors.ink,
    fontWeight: '600',
  },
  sessionItemId: {
    fontSize: 10,
    color: DesignTokens.colors.mute,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  deleteBtn: {
    padding: 4,
    opacity: 0.5,
  },
  deleteBtnText: {
    fontSize: 11,
    color: DesignTokens.colors.mute,
  },
  emptyState: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 12,
    color: DesignTokens.colors.mute,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.hairline,
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: DesignTokens.colors.surfaceSoft,
  },
  footerModelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.hairline,
    borderRadius: DesignTokens.rounded.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  footerModelInfo: {
    gap: 1,
  },
  footerModelLabel: {
    fontSize: 10,
    color: DesignTokens.colors.mute,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  footerModelName: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignTokens.colors.ink,
  },
  footerGearIcon: {
    fontSize: 14,
  },
  labNavBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  labNavText: {
    fontSize: 11.5,
    color: DesignTokens.colors.body,
    fontWeight: '500',
  },
});

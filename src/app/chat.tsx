import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ClinicHeader } from '@/components/clinic/ClinicHeader';
import { ConsultationView } from '@/components/clinic/ConsultationView';
import { PatientChartCard } from '@/components/clinic/PatientChartCard';
import { ChatHistoryDrawer } from '@/components/clinic/ChatHistoryDrawer';
import { AISettingsModal } from '@/components/clinic/AISettingsModal';
import { useClinic } from '@/context/ClinicContext';
import { DesignTokens, Spacing } from '@/constants/theme';

export default function ChatScreen() {
  const { width } = useWindowDimensions();
  const { newSession } = useClinic();
  const [showChartModal, setShowChartModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);

  const isDesktop = width >= 960;

  const handleNewChat = () => {
    newSession();
  };

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Top Navbar with ChatGPT Hamburger & Model Selector */}
        <ClinicHeader
          onToggleChart={() => setShowChartModal(!showChartModal)}
          onNewPatient={handleNewChat}
          onToggleHistory={() => setShowHistoryDrawer(true)}
        />

        {/* Dedicated Full-Screen Chat View */}
        <View style={styles.chatWrapper}>
          <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>
            <View style={styles.chatColumn}>
              <ConsultationView
                onOpenSandbox={() => router.push('/explore')}
                onOpenHistory={() => setShowHistoryDrawer(true)}
              />
            </View>

            {/* Desktop Side Chart or Mobile Overlay */}
            {(isDesktop || showChartModal) && (
              <View style={[styles.chartColumn, !isDesktop && styles.mobileChartOverlay]}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Patient Clinical Chart</Text>
                  {!isDesktop && (
                    <Pressable onPress={() => setShowChartModal(false)} style={styles.closeChartBtn}>
                      <Text style={styles.closeChartText}>✕ Close</Text>
                    </Pressable>
                  )}
                </View>
                <PatientChartCard />
              </View>
            )}
          </View>
        </View>

        {/* ChatGPT Mobile App Chat History Drawer */}
        <ChatHistoryDrawer
          visible={showHistoryDrawer}
          onClose={() => setShowHistoryDrawer(false)}
          onOpenAISettings={() => setShowAISettingsModal(true)}
        />

        {/* AI Engine & Tokens Settings Modal */}
        <AISettingsModal
          visible={showAISettingsModal}
          onClose={() => setShowAISettingsModal(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: DesignTokens.colors.canvas,
  },
  safeArea: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  mainLayout: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'column',
  },
  desktopLayout: {
    flexDirection: 'row',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  chatColumn: {
    flex: 1,
    height: '100%',
  },
  chartColumn: {
    width: 320,
    paddingRight: Spacing.two,
  },
  mobileChartOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    zIndex: 90,
    padding: Spacing.four,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DesignTokens.colors.ink,
  },
  closeChartBtn: {
    padding: 6,
  },
  closeChartText: {
    fontSize: 12,
    color: DesignTokens.colors.body,
    fontWeight: '600',
  },
});

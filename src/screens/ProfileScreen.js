import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import ImpactHubModal from '../components/ImpactHubModal';
import { useGame } from '../context/GameContext';

export default function ProfileScreen() {
  const [isImpactHubOpen, setIsImpactHubOpen] = useState(false);

  const {
    lifetimePoints,
    completedQuestCount,
    levelInfo,
    unlockedBadgeCount,
    resetDemo,
    isResetting,
    isHydrated,
  } = useGame();

  const profile = {
    name: 'Eco-Guardians',
    level: levelInfo ? levelInfo.levelTag : 'Level 1: Eco Seedling',
    accountType: 'Campus Sustainability Squad',
    points: lifetimePoints,
    questsCompleted: `${completedQuestCount} / 32`,
    badgesUnlocked: `${unlockedBadgeCount} / 16`,
    memberSince: 'October 2026',
    clientVersion: 'Expo SDK 57 (Android)',
  };

  const handleResetPress = () => {
    if (isResetting || !isHydrated) return;

    Alert.alert(
      'Reset EcoQuest Demo',
      'Are you sure you want to reset all game progress? This will permanently erase completed quests, campus upgrades, points, and badges, returning the demo to its initial baseline state.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            const result = await resetDemo();
            if (result?.success) {
              Alert.alert(
                'Demo Reset Complete',
                'All campus restorations, points, and badges have been reset to the baseline demo state.'
              );
            } else {
              Alert.alert(
                'Reset Failed',
                result?.error || 'Could not erase saved demo state. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Student Profile 👤</Text>
        <Text style={styles.screenSubtitle}>
          Demonstrator identity, project details, and presentation controls.
        </Text>
      </View>

      {/* User Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🛡️</Text>
        </View>
        <Text style={styles.userName}>{profile.name}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{profile.level}</Text>
        </View>
        <Text style={styles.accountType}>{profile.accountType}</Text>
      </View>

      {/* Lifetime Stats */}
      <Text style={styles.sectionHeader}>Lifetime Performance</Text>
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Eco Points</Text>
          <Text style={styles.statValue}>{profile.points} pts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Quests Completed</Text>
          <Text style={styles.statValue}>{profile.questsCompleted}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Badges Earned</Text>
          <Text style={styles.statValue}>{profile.badgesUnlocked}</Text>
        </View>
      </View>

      {/* Official Campus Eco-Passport CTA */}
      <TouchableOpacity
        style={styles.passportCtaCard}
        onPress={() => setIsImpactHubOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.passportCtaIcon}>📜</Text>
        <View style={styles.passportCtaInfo}>
          <Text style={styles.passportCtaTitle}>Official Campus Eco-Passport</Text>
          <Text style={styles.passportCtaSubtitle}>
            View verified environmental metrics, CO₂ abated, and digital certificate seal.
          </Text>
        </View>
        <Text style={styles.passportCtaArrow}>↗</Text>
      </TouchableOpacity>

      {/* College Project Info */}
      <Text style={styles.sectionHeader}>Project Information</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>EcoQuest</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Purpose</Text>
          <Text style={styles.infoValue}>Gamified Sustainability for Campus</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Environment</Text>
          <Text style={styles.infoValue}>{profile.clientVersion}</Text>
        </View>
      </View>

      {/* Demonstration Controls */}
      <Text style={styles.sectionHeader}>Demonstration Controls</Text>
      <View style={styles.controlsCard}>
        <Text style={styles.controlsNotice}>
          Reset all local demonstration progress back to the baseline campus state (Stage 0, 0 pts, Level 1, locked badges). Erases saved records from local storage.
        </Text>
        <TouchableOpacity
          style={[styles.resetButton, (isResetting || !isHydrated) && styles.resetButtonDisabled]}
          activeOpacity={0.7}
          onPress={handleResetPress}
          disabled={isResetting || !isHydrated}
        >
          {isResetting ? (
            <ActivityIndicator size="small" color="#991B1B" />
          ) : (
            <Text style={styles.resetButtonText}>🔄 Reset Demonstration Data</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Impact Hub & Eco-Passport Modal */}
      <ImpactHubModal
        visible={isImpactHubOpen}
        onClose={() => setIsImpactHubOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  levelBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  accountType: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  statDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  controlsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  controlsNotice: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  resetButtonDisabled: {
    opacity: 0.5,
  },
  passportCtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passportCtaIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  passportCtaInfo: {
    flex: 1,
  },
  passportCtaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  passportCtaSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  passportCtaArrow: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D97706',
    marginLeft: 8,
  },
});

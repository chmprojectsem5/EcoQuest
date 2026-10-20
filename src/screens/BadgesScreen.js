import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';

const TIERS = ['All', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Apex', 'Celestial'];

export default function BadgesScreen() {
  const {
    badges: coreBadges,
    unlockedBadgeCount: coreUnlockedCount,
    enhancedBadges,
    enhancedUnlockedBadgeCount,
    dailyStreak = 1,
  } = useGame();

  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Favor enhanced 24-tier badges with fallback to core badges
  const activeBadgeList = (enhancedBadges && enhancedBadges.length > 0) ? enhancedBadges : (coreBadges || []);
  const totalBadges = activeBadgeList.length || 16;
  const unlockedCount = typeof enhancedUnlockedBadgeCount === 'number'
    ? enhancedUnlockedBadgeCount
    : (coreUnlockedCount || 0);

  const progressPercent = Math.min(
    100,
    Math.round((unlockedCount / Math.max(1, totalBadges)) * 100)
  );

  // Filter badges by tier
  const filteredBadges = selectedTier === 'All'
    ? activeBadgeList
    : activeBadgeList.filter((b) => b.tier && b.tier.toLowerCase() === selectedTier.toLowerCase());

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Achievement Badges 🎖️</Text>
        <Text style={styles.screenSubtitle}>
          Unlock 24 tiered sustainability trophies across streaks, district phases, and planetary milestones.
        </Text>
      </View>

      {/* Progress Header Card */}
      <View style={[styles.summaryCard, unlockedCount === totalBadges && styles.summaryCardComplete]}>
        <View style={styles.summaryTopRow}>
          <Text style={styles.summaryLabel}>Total Badges Unlocked</Text>
          <Text style={[styles.summaryCounter, unlockedCount === totalBadges && styles.summaryCounterComplete]}>
            {unlockedCount} / {totalBadges} ({progressPercent}%)
          </Text>
        </View>
        <View style={styles.summaryBar}>
          <View
            style={[
              styles.summaryFill,
              unlockedCount === totalBadges && styles.summaryFillComplete,
              { width: `${Math.max(4, progressPercent)}%` },
            ]}
          />
        </View>
        <Text style={styles.summaryNote}>
          {unlockedCount === 0
            ? `🔒 All ${totalBadges} trophies are currently locked. Complete daily quests & sector projects to unlock them!`
            : unlockedCount === totalBadges
            ? `🌟 Celestial Grandmaster! All ${totalBadges} campus sustainability trophies successfully unlocked!`
            : `🎉 ${unlockedCount} of ${totalBadges} trophies unlocked! Keep building and maintaining daily streaks.`}
        </Text>
      </View>

      {/* Tier Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tierScroll}
        contentContainerStyle={styles.tierScrollContent}
      >
        {TIERS.map((tier) => {
          const isActive = selectedTier === tier;
          const countInTier = tier === 'All'
            ? activeBadgeList.length
            : activeBadgeList.filter((b) => b.tier && b.tier.toLowerCase() === tier.toLowerCase()).length;

          return (
            <TouchableOpacity
              key={tier}
              style={[styles.tierPill, isActive && styles.tierPillActive]}
              onPress={() => setSelectedTier(tier)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tierPillText, isActive && styles.tierPillTextActive]}>
                {tier} ({countInTier})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Badges Grid (2-column layout) */}
      <Text style={styles.sectionHeader}>
        {selectedTier === 'All' ? 'All Sustainability Badges' : `${selectedTier} Tier Trophies`} ({filteredBadges.length})
      </Text>

      <View style={styles.grid}>
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.isUnlocked;

          return (
            <TouchableOpacity
              key={badge.id}
              style={[
                styles.badgeCard,
                isUnlocked && styles.badgeCardUnlocked,
                isUnlocked && badge.tierColor && { borderColor: badge.tierColor },
              ]}
              onPress={() => setSelectedBadge(badge)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.lockBadge,
                  isUnlocked && styles.lockBadgeUnlocked,
                ]}
              >
                <Text style={styles.lockIcon}>{isUnlocked ? '✅' : '🔒'}</Text>
              </View>

              {badge.tier && (
                <View
                  style={[
                    styles.tierTag,
                    {
                      backgroundColor: (badge.tierColor || '#64748B') + '18',
                      borderColor: badge.tierColor || '#CBD5E1',
                    },
                  ]}
                >
                  <Text style={[styles.tierTagText, { color: badge.tierColor || '#64748B' }]}>
                    {badge.tier.toUpperCase()}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.iconCircle,
                  isUnlocked && styles.iconCircleUnlocked,
                ]}
              >
                <Text
                  style={[
                    styles.badgeIcon,
                    isUnlocked && styles.badgeIconUnlocked,
                  ]}
                >
                  {badge.icon}
                </Text>
              </View>

              <Text
                style={[
                  styles.badgeTitle,
                  isUnlocked && styles.badgeTitleUnlocked,
                ]}
                numberOfLines={2}
              >
                {badge.title}
              </Text>

              {isUnlocked ? (
                <View style={styles.statusBadgeUnlocked}>
                  <Text style={styles.statusBadgeTextUnlocked}>UNLOCKED ✓</Text>
                </View>
              ) : (
                <Text style={styles.badgeCondition} numberOfLines={2}>{badge.condition}</Text>
              )}

              <Text style={styles.badgeDesc} numberOfLines={3}>{badge.desc}</Text>

              <View
                style={[
                  styles.progressPill,
                  isUnlocked && styles.progressPillUnlocked,
                ]}
              >
                <Text
                  style={[
                    styles.progressPillText,
                    isUnlocked && styles.progressPillTextUnlocked,
                  ]}
                  numberOfLines={1}
                >
                  {isUnlocked ? `Earned (${badge.progressText})` : `Progress: ${badge.progressText}`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal for detailed inspection of any badge */}
      {selectedBadge && (
        <Modal
          visible={!!selectedBadge}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedBadge(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={[styles.modalIconCircle, { borderColor: selectedBadge.tierColor || '#10B981' }]}>
                <Text style={styles.modalIconText}>{selectedBadge.icon}</Text>
              </View>

              <View style={[styles.modalTierTag, { backgroundColor: (selectedBadge.tierColor || '#10B981') + '20', borderColor: selectedBadge.tierColor || '#10B981' }]}>
                <Text style={[styles.modalTierText, { color: selectedBadge.tierColor || '#10B981' }]}>
                  {selectedBadge.tier?.toUpperCase()} TIER TROPHY
                </Text>
              </View>

              <Text style={styles.modalTitle}>{selectedBadge.title}</Text>
              <Text style={styles.modalCondition}>Condition: {selectedBadge.condition}</Text>
              <Text style={styles.modalDesc}>{selectedBadge.desc}</Text>

              <View style={styles.modalStatusBox}>
                <Text style={styles.modalStatusLabel}>Status:</Text>
                <Text style={[styles.modalStatusValue, { color: selectedBadge.isUnlocked ? '#16A34A' : '#DC2626' }]}>
                  {selectedBadge.isUnlocked ? '✅ Unlocked & Awarded' : '🔒 Currently Locked'}
                </Text>
                <Text style={styles.modalProgressValue}>Progress: {selectedBadge.progressText}</Text>
              </View>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedBadge(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardComplete: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  summaryCounter: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryCounterComplete: {
    color: colors.primaryDark,
  },
  summaryBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  summaryFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  summaryFillComplete: {
    backgroundColor: colors.gold,
  },
  summaryNote: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
  tierScroll: {
    marginBottom: 14,
  },
  tierScrollContent: {
    paddingRight: 8,
  },
  tierPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tierPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tierPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  tierPillTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  badgeCardUnlocked: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    elevation: 3,
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeUnlocked: {
    backgroundColor: '#DCFCE7',
  },
  lockIcon: {
    fontSize: 10,
  },
  tierTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  tierTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  iconCircleUnlocked: {
    backgroundColor: '#ECFDF5',
  },
  badgeIcon: {
    fontSize: 26,
    opacity: 0.45,
  },
  badgeIconUnlocked: {
    opacity: 1,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 34,
  },
  badgeTitleUnlocked: {
    color: colors.text,
    fontWeight: '800',
  },
  statusBadgeUnlocked: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  statusBadgeTextUnlocked: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
  },
  badgeCondition: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  badgeDesc: {
    fontSize: 10.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 8,
  },
  progressPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressPillUnlocked: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  progressPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  progressPillTextUnlocked: {
    color: '#16A34A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 10,
  },
  modalIconText: {
    fontSize: 38,
  },
  modalTierTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  modalTierText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalCondition: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 12.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  modalStatusBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalStatusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  modalStatusValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  modalProgressValue: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
  },
  modalCloseBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

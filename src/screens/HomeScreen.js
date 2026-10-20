import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import CampusScene from '../components/CampusScene';
import SolarElectricitySystem from '../components/SolarElectricitySystem';
import DailyDropCard from '../components/DailyDropCard';
import ImpactHubModal from '../components/ImpactHubModal';
import CelebrationModal from '../components/CelebrationModal';
import { useGame } from '../context/GameContext';

export default function HomeScreen({ onNavigate }) {
  const [upgradeFeedback, setUpgradeFeedback] = useState(null);
  const [isImpactHubOpen, setIsImpactHubOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);

  const {
    lifetimePoints,
    spendablePoints,
    completedQuestCount,
    completedQuestIds,
    restorationStage,
    nextUpgrade,
    canAffordNextUpgrade,
    nextUpgradeShortfall,
    levelInfo,
    unlockedBadgeCount,
    userRank,
    // Multi-District World additions:
    districts,
    activeDistrictId,
    setActiveDistrictId,
    districtStages,
    activeDistrict,
    activeDistrictStage,
    activeDistrictUpgrade,
    canAffordActiveUpgrade,
    activeUpgradeShortfall,
    purchaseDistrictUpgrade,
    ecoImpact,
  } = useGame();

  const user = {
    name: 'Eco-Guardians',
    level: levelInfo ? levelInfo.levelTag : 'Level 1: Eco Seedling',
    points: lifetimePoints,
    targetPoints: levelInfo ? (levelInfo.isMaxLevel ? 980 : levelInfo.nextThreshold) : 150,
    completedCount: completedQuestCount,
    badgesEarned: `${unlockedBadgeCount} / 16`,
  };

  const isCh1Completed = completedQuestIds.includes('ch-1');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Banner & Branding */}
      <View style={styles.header}>
        <View style={styles.brandingRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🌱</Text>
          </View>
          <View style={styles.brandTextContainer}>
            <Text style={styles.appName}>EcoQuest</Text>
            <Text style={styles.appTagline}>Gamified Sustainability for Campus</Text>
          </View>
        </View>

        <View style={styles.greetingContainer}>
          <Text style={styles.greetingSub}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{user.level}</Text>
          </View>
        </View>
      </View>

      {/* 1B. Daily Mystery Eco-Drop & Streak Habit Booster */}
      <DailyDropCard />

      {/* 2. Unified Campus Restoration World Scene */}
      <CampusScene restorationStage={restorationStage} />

      {/* 2B. Interactive Solar Electricity System Command Center */}
      <SolarElectricitySystem restorationStage={restorationStage} />

      {/* 3. Multi-Phase Campus Restoration Upgrade Project Card */}
      {(() => {
        const dist = activeDistrict || { id: 'academic', phase: 1, name: 'Academic & Science Quad', shortName: 'Academic Quad', icon: '🏫', color: '#0284C7' };
        const stage = typeof activeDistrictStage === 'number' ? activeDistrictStage : restorationStage;
        const upgrade = activeDistrictUpgrade || nextUpgrade;
        const canAfford = typeof canAffordActiveUpgrade === 'boolean' ? canAffordActiveUpgrade : canAffordNextUpgrade;
        const shortfall = typeof activeUpgradeShortfall === 'number' ? activeUpgradeShortfall : nextUpgradeShortfall;
        const isPhaseComplete = stage >= 4;

        // Next district in sequence if current phase is finished
        const currentIdx = (districts || []).findIndex((d) => d.id === dist.id);
        const nextDist = currentIdx >= 0 && currentIdx < (districts || []).length - 1 ? districts[currentIdx + 1] : null;

        return (
          <View
            style={[
              styles.card,
              styles.upgradeCard,
              isPhaseComplete && styles.upgradeCardComplete,
            ]}
          >
            <View style={styles.upgradeHeaderRow}>
              <View style={styles.upgradeHeaderLeft}>
                <Text style={[styles.upgradeHeaderTag, { color: dist.color || colors.primaryDark }]}>
                  {isPhaseComplete
                    ? `🏆 PHASE ${dist.phase}: ${dist.shortName.toUpperCase()} COMPLETE!`
                    : `🛠️ PHASE ${dist.phase}: ${dist.shortName.toUpperCase()} • PROJECT ${stage + 1} OF 4`}
                </Text>
                <Text style={styles.upgradeTitle}>
                  {isPhaseComplete
                    ? `${dist.name} Fully Restored!`
                    : upgrade?.title}
                </Text>
              </View>
              <View style={styles.balancePill}>
                <Text style={styles.balancePillLabel}>Spendable</Text>
                <Text style={styles.balancePillValue}>{spendablePoints} pts</Text>
              </View>
            </View>

            {!isPhaseComplete && upgrade ? (
              <>
                <Text style={styles.upgradeDescription}>
                  {upgrade.desc || upgrade.description}
                </Text>
                <View style={styles.upgradeBenefitRow}>
                  <Text style={styles.upgradeBenefitIcon}>{upgrade.icon || '✨'}</Text>
                  <Text style={styles.upgradeBenefitText}>
                    Impact:{' '}
                    <Text style={styles.upgradeBenefitHighlight}>
                      {upgrade.benefit}
                    </Text>
                  </Text>
                </View>

                <View style={styles.upgradeCostBar}>
                  <View style={styles.costInfoCol}>
                    <Text style={styles.costLabel}>Required Points</Text>
                    <Text style={styles.costValue}>{upgrade.cost} pts</Text>
                  </View>
                  <View style={styles.walletInfoCol}>
                    <Text style={styles.walletLabel}>Your Balance</Text>
                    <Text
                      style={[
                        styles.walletValue,
                        canAfford
                          ? styles.walletGreen
                          : styles.walletOrange,
                      ]}
                    >
                      {spendablePoints} pts
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.upgradeButton,
                    canAfford
                      ? [styles.upgradeButtonActive, { backgroundColor: dist.color || colors.primary }]
                      : styles.upgradeButtonDisabled,
                  ]}
                  onPress={() => {
                    if (canAfford) {
                      const res = purchaseDistrictUpgrade
                        ? purchaseDistrictUpgrade(dist.id)
                        : purchaseNextUpgrade();
                      if (res?.success && res.upgrade) {
                        setCelebrationData({
                          visible: true,
                          upgrade: res.upgrade,
                          district: dist,
                          stage: res.nextStage || (stage + 1),
                        });
                        setUpgradeFeedback({
                          type: 'success',
                          message: `🎉 Built ${res.upgrade.title}! -${res.upgrade.cost} pts deducted.`,
                        });
                        setTimeout(() => setUpgradeFeedback(null), 4000);
                      } else if (res?.reason === 'insufficient_points') {
                        setUpgradeFeedback({
                          type: 'error',
                          message: `🔒 Need ${res.shortfall || shortfall} more Eco Points to build this project.`,
                        });
                        setTimeout(() => setUpgradeFeedback(null), 4000);
                      }
                    }
                  }}
                  disabled={!canAfford}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.upgradeButtonText,
                      !canAfford && styles.upgradeButtonTextDisabled,
                    ]}
                  >
                    {canAfford
                      ? `Build ${upgrade.title} (-${upgrade.cost} pts)`
                      : `🔒 Need ${shortfall} More Points`}
                  </Text>
                </TouchableOpacity>

                {upgradeFeedback && (
                  <View
                    style={[
                      styles.upgradeFeedbackBanner,
                      upgradeFeedback.type === 'success'
                        ? styles.feedbackSuccess
                        : styles.feedbackError,
                    ]}
                  >
                    <Text style={styles.feedbackIcon}>
                      {upgradeFeedback.type === 'success' ? '✅' : '⚠️'}
                    </Text>
                    <Text
                      style={[
                        styles.feedbackText,
                        upgradeFeedback.type === 'success'
                          ? styles.feedbackTextSuccess
                          : styles.feedbackTextError,
                      ]}
                    >
                      {upgradeFeedback.message}
                    </Text>
                  </View>
                )}

                {!canAfford && (
                  <Text style={styles.shortfallCaption}>
                    Earn {shortfall} more Eco Points from quests to fund this district project.
                  </Text>
                )}
              </>
            ) : (
              <View style={styles.allCompleteContent}>
                <Text style={styles.allCompleteEmoji}>🌟</Text>
                <Text style={styles.allCompleteText}>
                  All 4 ecological projects in {dist.name} have been built! The sector is flourishing with green infrastructure and circular efficiency.
                </Text>
                <Text style={styles.allCompleteSurplus}>
                  Remaining spendable balance: {spendablePoints} Eco Points
                </Text>

                {nextDist && (
                  <TouchableOpacity
                    style={[
                      styles.nextSectorCtaButton,
                      { backgroundColor: nextDist.color },
                    ]}
                    onPress={() => {
                      if (setActiveDistrictId) {
                        setActiveDistrictId(nextDist.id);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.nextSectorCtaText}>
                      🚀 Begin Phase {nextDist.phase}: {nextDist.name} →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      })()}

      {/* 4. Level Progress Card */}
      <View style={styles.card}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            {levelInfo?.isCompletedProgression
              ? 'Progression Complete 🌟'
              : levelInfo?.isMaxLevel
              ? `Level ${levelInfo?.level}: ${levelInfo?.name} 🏆`
              : `Level ${levelInfo?.level || 1} Progress`}
          </Text>
          <Text style={styles.progressRatio}>
            {levelInfo?.isMaxLevel
              ? `${lifetimePoints} / 980 pts`
              : `${lifetimePoints} / ${levelInfo?.nextThreshold || 150} pts`}
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              levelInfo?.isCompletedProgression && styles.progressBarFillComplete,
              { width: `${Math.max(4, levelInfo?.progressPercent || 0)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressCaption}>
          {levelInfo?.isCompletedProgression
            ? 'Campus Sustainability Champion! All 980 Eco Points earned across all 32 quests.'
            : levelInfo?.isMaxLevel
            ? `Maximum level reached! Earn ${levelInfo?.pointsToNext} more points to complete full campus mastery!`
            : `Earn ${levelInfo?.pointsToNext || 150} more Eco Points by completing campus quests to reach Level ${(levelInfo?.level || 1) + 1} (${levelInfo?.nextLevelName || 'Green Scout'})!`}
        </Text>
      </View>

      {/* 5. Impact Metrics Grid (3 Key Glanceable Cards) */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, styles.metricCardPrimary]}>
          <Text style={styles.metricIcon}>⚡</Text>
          <Text style={styles.metricValue}>{user.points}</Text>
          <Text style={styles.metricLabel}>Eco Points</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>💰</Text>
          <Text style={styles.metricValue}>{spendablePoints}</Text>
          <Text style={styles.metricLabel}>Spendable</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>✅</Text>
          <Text style={styles.metricValue}>{user.completedCount} / 32</Text>
          <Text style={styles.metricLabel}>Quests Done</Text>
        </View>
      </View>

      {/* 5B. Real-World Environmental Impact Hub Card */}
      <TouchableOpacity
        style={styles.impactHubCard}
        onPress={() => setIsImpactHubOpen(true)}
        activeOpacity={0.88}
      >
        <View style={styles.impactHubTop}>
          <View style={styles.impactHubLeft}>
            <View style={styles.impactHubTagRow}>
              <Text style={styles.impactHubTagEmoji}>🌍</Text>
              <Text style={styles.impactHubTag}>REAL-WORLD CAMPUS IMPACT</Text>
            </View>
            <Text style={styles.impactHubTitle}>
              {ecoImpact?.vitalityGrade || 'Active Campus Restoration'}
            </Text>
          </View>
          <View style={[styles.impactHubPill, { backgroundColor: `${ecoImpact?.vitalityColor || '#10B981'}20` }]}>
            <Text style={[styles.impactHubPillText, { color: ecoImpact?.vitalityColor || '#059669' }]}>
              {ecoImpact?.campusVitalityPercent || 0}% Vitality
            </Text>
          </View>
        </View>

        <View style={styles.impactMiniGrid}>
          <View style={styles.impactMiniItem}>
            <Text style={styles.impactMiniIcon}>🍃</Text>
            <Text style={styles.impactMiniVal}>{ecoImpact?.co2Label || '0 kg'}</Text>
            <Text style={styles.impactMiniLbl}>CO₂ Abated</Text>
          </View>
          <View style={styles.impactMiniItem}>
            <Text style={styles.impactMiniIcon}>⚡</Text>
            <Text style={styles.impactMiniVal}>{ecoImpact?.cleanEnergyLabel || '0 kWh'}</Text>
            <Text style={styles.impactMiniLbl}>Solar Power</Text>
          </View>
          <View style={styles.impactMiniItem}>
            <Text style={styles.impactMiniIcon}>💧</Text>
            <Text style={styles.impactMiniVal}>{ecoImpact?.waterLabel || '0 L'}</Text>
            <Text style={styles.impactMiniLbl}>Water Saved</Text>
          </View>
          <View style={styles.impactMiniItem}>
            <Text style={styles.impactMiniIcon}>🌳</Text>
            <Text style={styles.impactMiniVal}>{ecoImpact?.treesLabel || '0'}</Text>
            <Text style={styles.impactMiniLbl}>Canopy Trees</Text>
          </View>
        </View>

        <View style={styles.impactHubCtaRow}>
          <Text style={styles.impactHubCtaText}>Inspect Full Impact Hub & Eco-Passport →</Text>
        </View>
      </TouchableOpacity>

      {/* 6. Featured Daily Challenge Card */}
      <View style={[styles.card, styles.featuredCard]}>
        <View style={styles.featuredBadgeRow}>
          <View style={styles.featuredTag}>
            <Text style={styles.featuredTagText}>⭐ FEATURED DAILY QUEST</Text>
          </View>
          <View
            style={[
              styles.pointsPill,
              isCh1Completed && styles.completedPill,
            ]}
          >
            <Text
              style={[
                styles.pointsPillText,
                isCh1Completed && styles.completedPillText,
              ]}
            >
              {isCh1Completed ? 'COMPLETED ✅' : '+30 PTS'}
            </Text>
          </View>
        </View>

        <Text style={styles.questTitle}>Bring a Reusable Water Bottle</Text>
        <Text style={styles.questCategory}>
          ♻️ Waste Reduction • Medium Impact
        </Text>
        <Text style={styles.questDescription}>
          Carry a refillable water bottle to classes today instead of purchasing
          single-use plastic bottled water on campus.
        </Text>

        <TouchableOpacity
          style={[
            styles.actionButton,
            isCh1Completed && styles.actionButtonCompleted,
          ]}
          onPress={() => onNavigate && onNavigate('quests')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.actionButtonText,
              isCh1Completed && styles.actionButtonTextCompleted,
            ]}
          >
            {isCh1Completed ? 'Explore All Quests →' : 'Complete in Quests Tab →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 7. Eco Tip of the Day Card */}
      <View style={[styles.card, styles.tipCard]}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipTitle}>Eco Tip of the Day</Text>
        </View>
        <Text style={styles.tipContent}>
          Unplugging idle laptop chargers and mobile adapters cuts phantom power
          drain by up to 10% on your dorm or household electric consumption!
        </Text>
        <View style={styles.tipTag}>
          <Text style={styles.tipTagText}>⚡ Energy Conservation</Text>
        </View>
      </View>

      {/* 8. Quick Navigation Links */}
      <View style={styles.quickNavSection}>
        <Text style={styles.sectionHeader}>Explore EcoQuest</Text>
        <View style={styles.quickNavRow}>
          <TouchableOpacity
            style={styles.quickNavCard}
            onPress={() => onNavigate && onNavigate('rank')}
            activeOpacity={0.8}
          >
            <Text style={styles.quickNavIcon}>🏆</Text>
            <Text style={styles.quickNavTitle}>Campus Rank</Text>
            <Text style={styles.quickNavSubtitle}>Rank #{userRank} on campus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickNavCard}
            onPress={() => onNavigate && onNavigate('badges')}
            activeOpacity={0.8}
          >
            <Text style={styles.quickNavIcon}>🎖️</Text>
            <Text style={styles.quickNavTitle}>Badges</Text>
            <Text style={styles.quickNavSubtitle}>{unlockedBadgeCount} of 8 unlocked</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 9. Interactive Modals: Real-World Impact Hub & Upgrade Celebration */}
      <ImpactHubModal
        visible={isImpactHubOpen}
        onClose={() => setIsImpactHubOpen(false)}
      />

      <CelebrationModal
        visible={!!celebrationData?.visible}
        onClose={() => setCelebrationData(null)}
        upgrade={celebrationData?.upgrade}
        district={celebrationData?.district}
        stage={celebrationData?.stage}
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
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  logoIcon: {
    fontSize: 24,
  },
  brandTextContainer: {
    marginLeft: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  greetingContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  greetingSub: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
    marginBottom: 8,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  progressRatio: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: colors.borderLight,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  progressBarFillComplete: {
    backgroundColor: colors.gold,
  },
  progressCaption: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCardPrimary: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary,
  },
  metricIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  featuredCard: {
    borderColor: colors.primaryLight,
    backgroundColor: '#FFFFFF',
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  featuredTag: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  pointsPill: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  pointsPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  questCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  questDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tipCard: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FEF08A',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#854D0E',
  },
  tipContent: {
    fontSize: 12,
    color: '#713F12',
    lineHeight: 18,
    marginBottom: 8,
  },
  tipTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tipTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#854D0E',
  },
  quickNavSection: {
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  quickNavRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickNavCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  quickNavIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickNavTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  quickNavSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  /* Upgrade Project Card Styles (Phase 3.2C) */
  upgradeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primaryLight,
    borderWidth: 1.5,
  },
  upgradeCardComplete: {
    backgroundColor: '#F0FDF4',
    borderColor: '#34D399',
  },
  upgradeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  upgradeHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  upgradeHeaderTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  balancePill: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  balancePillLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  balancePillValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  upgradeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  upgradeBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  upgradeBenefitIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  upgradeBenefitText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  upgradeBenefitHighlight: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  upgradeCostBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  costInfoCol: {},
  costLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  costValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  walletInfoCol: {
    alignItems: 'flex-end',
  },
  walletLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  walletValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  walletGreen: {
    color: colors.primaryDark,
  },
  walletOrange: {
    color: '#D97706',
  },
  upgradeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  upgradeButtonDisabled: {
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  upgradeButtonTextDisabled: {
    color: '#64748B',
  },
  shortfallCaption: {
    fontSize: 11,
    color: '#B45309',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
    lineHeight: 15,
  },
  allCompleteContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  allCompleteEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  allCompleteText: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  allCompleteSurplus: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  nextSectorCtaButton: {
    marginTop: 12,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  nextSectorCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  completedPill: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  completedPillText: {
    color: '#166534',
  },
  actionButtonCompleted: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonTextCompleted: {
    color: colors.textSecondary,
  },
  upgradeFeedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  feedbackError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  feedbackIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  feedbackTextSuccess: {
    color: '#166534',
  },
  feedbackTextError: {
    color: '#991B1B',
  },
  impactHubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  impactHubTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  impactHubLeft: {
    flex: 1,
    marginRight: 8,
  },
  impactHubTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  impactHubTagEmoji: {
    fontSize: 13,
    marginRight: 5,
  },
  impactHubTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  impactHubTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  impactHubPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  impactHubPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  impactMiniGrid: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  impactMiniItem: {
    alignItems: 'center',
  },
  impactMiniIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  impactMiniVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064E3B',
  },
  impactMiniLbl: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
  },
  impactHubCtaRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  impactHubCtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
});

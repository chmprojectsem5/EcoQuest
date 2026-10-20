import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { QUEST_CATEGORIES } from '../data/gameData';

export default function QuestsScreen() {
  const {
    quests,
    completedQuestIds,
    completedQuestCount,
    lifetimePoints,
    spendablePoints,
    completeQuest,
    dailyQuests = [],
    dailyQuestsDayOffset = 0,
    dailyStreak = 1,
    advanceDailyQuests,
    sectorQuests = [],
  } = useGame();

  // Primary view tabs: 'daily' (hero feed), 'sector' (phase restoration), 'all' (complete library)
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sectorDistrictFilter, setSectorDistrictFilter] = useState('all');

  // Daily quest progress calculation
  const completedTodayCount = dailyQuests.filter((q) => completedQuestIds.includes(q.id)).length;
  const isDailyComplete = dailyQuests.length > 0 && completedTodayCount === dailyQuests.length;

  // Filter core quests based on active category pill
  const filteredCoreQuests = selectedCategory === 'All'
    ? quests
    : quests.filter((q) => q.category === selectedCategory);

  // Filter sector quests based on district
  const filteredSectorQuests = sectorDistrictFilter === 'all'
    ? sectorQuests
    : sectorQuests.filter((q) => q.targetDistrict === sectorDistrictFilter);

  const handleAdvanceDay = () => {
    if (advanceDailyQuests) {
      advanceDailyQuests();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Screen Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Sustainability Quests 🎯</Text>
        <Text style={styles.screenSubtitle}>
          Complete daily eco-actions and sector challenges to fund campus multi-phase restoration.
        </Text>
      </View>

      {/* 2. Glanceable Live Points Summary Pill */}
      <View style={styles.pointsSummaryCard}>
        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>Lifetime Points</Text>
          <Text style={styles.summaryStatValue}>⚡ {lifetimePoints} pts</Text>
        </View>
        <View style={styles.statSeparator} />
        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>Spendable Fund</Text>
          <Text style={styles.summaryStatValue}>💎 {spendablePoints} pts</Text>
        </View>
        <View style={styles.statSeparator} />
        <View style={styles.summaryStatItem}>
          <Text style={styles.summaryStatLabel}>Daily Streak</Text>
          <Text style={styles.summaryStatValue}>🔥 {dailyStreak} Days</Text>
        </View>
      </View>

      {/* 3. High-Level Mode Tabs (Daily Feed, Sector Restoration, Core Library) */}
      <View style={styles.mainTabRow}>
        <TouchableOpacity
          style={[styles.mainTabBtn, activeTab === 'daily' && styles.mainTabBtnActive]}
          onPress={() => setActiveTab('daily')}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainTabBtnText, activeTab === 'daily' && styles.mainTabBtnTextActive]}>
            📅 Today's Daily ({dailyQuests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainTabBtn, activeTab === 'sector' && styles.mainTabBtnActive]}
          onPress={() => setActiveTab('sector')}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainTabBtnText, activeTab === 'sector' && styles.mainTabBtnTextActive]}>
            ⚡ Sector Quests ({sectorQuests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainTabBtn, activeTab === 'all' && styles.mainTabBtnActive]}
          onPress={() => setActiveTab('all')}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainTabBtnText, activeTab === 'all' && styles.mainTabBtnTextActive]}>
            📚 All ({quests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* =====================================================================
          TAB 1: DAILY ROTATING QUESTS (No flooding, unlimited points & days)
          ===================================================================== */}
      {activeTab === 'daily' && (
        <View style={styles.tabContentSection}>
          {/* Daily Streak & Drop Status Hero Banner */}
          <View style={styles.dailyHeroBanner}>
            <View style={styles.dailyHeroTopRow}>
              <View style={styles.streakBadgeWrap}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <View>
                  <Text style={styles.streakCountText}>{dailyStreak}-Day Eco Streak</Text>
                  <Text style={styles.streakSubText}>Unbroken daily campus action</Text>
                </View>
              </View>
              <View style={styles.dayCounterBadge}>
                <Text style={styles.dayCounterText}>Day {dailyQuestsDayOffset + 1}</Text>
              </View>
            </View>

            {/* Daily Completion Meter */}
            <View style={styles.dailyProgressContainer}>
              <View style={styles.dailyProgressLabelRow}>
                <Text style={styles.dailyProgressLabel}>Today's Action Goal:</Text>
                <Text style={styles.dailyProgressScore}>
                  {completedTodayCount} of {dailyQuests.length} Done
                </Text>
              </View>
              <View style={styles.dailyProgressTrack}>
                <View
                  style={[
                    styles.dailyProgressFill,
                    {
                      width: `${Math.max(6, (completedTodayCount / Math.max(1, dailyQuests.length)) * 100)}%`,
                      backgroundColor: isDailyComplete ? '#10B981' : '#0284C7',
                    },
                  ]}
                />
              </View>
            </View>

            {/* Celebrate if all daily quests finished */}
            {isDailyComplete ? (
              <View style={styles.dailyBonusCelebration}>
                <Text style={styles.dailyBonusIcon}>🎉</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dailyBonusTitle}>Daily Eco-Mastery Unlocked!</Text>
                  <Text style={styles.dailyBonusDesc}>
                    Outstanding work! You completed all 5 daily challenges. Advance to tomorrow anytime below for new quests!
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Unlimited Next Day Advance Button */}
            <TouchableOpacity
              style={styles.advanceDayBtn}
              onPress={handleAdvanceDay}
              activeOpacity={0.82}
            >
              <Text style={styles.advanceDayBtnIcon}>🎲</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.advanceDayBtnTitle}>
                  Advance Day • Roll Tomorrow's 5 Quests
                </Text>
                <Text style={styles.advanceDayBtnSubtitle}>
                  Earn unlimited points by rolling new daily rotating eco-tasks
                </Text>
              </View>
              <Text style={styles.advanceDayBtnArrow}>➔</Text>
            </TouchableOpacity>
          </View>

          {/* 5 Focused Daily Cards */}
          <Text style={styles.sectionHeader}>
            Today's Fresh Eco-Challenges (Balanced 5 Actions)
          </Text>

          {dailyQuests.map((quest, idx) => {
            const isCompleted = completedQuestIds.includes(quest.id);

            return (
              <View
                key={quest.id}
                style={[styles.card, isCompleted && styles.completedCard]}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.categoryBadgeRow}>
                    <Text style={styles.categoryIcon}>{quest.categoryIcon}</Text>
                    <Text style={styles.categoryBadge}>
                      {quest.category} • {quest.impact}
                    </Text>
                  </View>
                  <View style={[styles.pointsPill, isCompleted && styles.pointsPillCompleted]}>
                    <Text style={[styles.pointsPillText, isCompleted && styles.pointsPillTextCompleted]}>
                      +{quest.points} PTS
                    </Text>
                  </View>
                </View>

                <Text style={[styles.questTitle, isCompleted && styles.questTitleCompleted]}>
                  {quest.title}
                </Text>
                <Text style={styles.questDesc}>{quest.desc}</Text>

                {quest.co2 && (
                  <View style={styles.co2Row}>
                    <Text style={styles.co2Text}>
                      🌿 Estimated Offset: <Text style={styles.co2Bold}>{quest.co2}</Text>
                    </Text>
                  </View>
                )}

                {isCompleted ? (
                  <View style={styles.completedBadgeButton}>
                    <Text style={styles.completedBadgeButtonText}>
                      ✓ Completed (+{quest.points} pts awarded)
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => completeQuest(quest.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionButtonText}>
                      Mark as Done (+{quest.points} pts) ✓
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* =====================================================================
          TAB 2: SECTOR RESTORATION QUESTS (Phase 2 to 5 specialized funding)
          ===================================================================== */}
      {activeTab === 'sector' && (
        <View style={styles.tabContentSection}>
          <View style={styles.sectorInfoBanner}>
            <Text style={styles.sectorInfoIcon}>🏗️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectorInfoTitle}>District Phase Restoration Projects</Text>
              <Text style={styles.sectorInfoDesc}>
                These specialized engineering & environmental tasks directly support Society, Garden, Mall, and Lake phases.
              </Text>
            </View>
          </View>

          {/* Sector Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
            {[
              { id: 'all', label: 'All Districts' },
              { id: 'society', label: '🏡 Society (Phase 2)' },
              { id: 'garden', label: '🌳 Garden (Phase 3)' },
              { id: 'mall', label: '🛍️ Mall (Phase 4)' },
              { id: 'lake', label: '🌊 Lake (Phase 5)' },
            ].map((chip) => {
              const isActive = sectorDistrictFilter === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  style={[styles.pill, isActive && styles.activePill]}
                  onPress={() => setSectorDistrictFilter(chip.id)}
                >
                  <Text style={[styles.pillText, isActive && styles.activePillText]}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionHeader}>
            Sector Quests ({filteredSectorQuests.length} Actions)
          </Text>

          {filteredSectorQuests.map((quest) => {
            const isCompleted = completedQuestIds.includes(quest.id);

            return (
              <View
                key={quest.id}
                style={[styles.card, isCompleted && styles.completedCard]}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.categoryBadgeRow}>
                    <Text style={styles.categoryIcon}>{quest.categoryIcon}</Text>
                    <Text style={styles.categoryBadge}>
                      Phase {quest.targetPhase} • {quest.category}
                    </Text>
                  </View>
                  <View style={[styles.pointsPill, isCompleted && styles.pointsPillCompleted]}>
                    <Text style={[styles.pointsPillText, isCompleted && styles.pointsPillTextCompleted]}>
                      +{quest.points} PTS
                    </Text>
                  </View>
                </View>

                <Text style={[styles.questTitle, isCompleted && styles.questTitleCompleted]}>
                  {quest.title}
                </Text>
                <Text style={styles.questDesc}>{quest.desc}</Text>

                <View style={styles.co2Row}>
                  <Text style={styles.targetDistrictTag}>
                    🎯 Target District: Phase {quest.targetPhase} {quest.targetDistrict?.toUpperCase()}
                  </Text>
                </View>

                {isCompleted ? (
                  <View style={styles.completedBadgeButton}>
                    <Text style={styles.completedBadgeButtonText}>
                      ✓ Completed (+{quest.points} pts awarded)
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => completeQuest(quest.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionButtonText}>
                      Mark as Done (+{quest.points} pts) ✓
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* =====================================================================
          TAB 3: COMPLETE 32-QUEST CATALOG LIBRARY
          ===================================================================== */}
      {activeTab === 'all' && (
        <View style={styles.tabContentSection}>
          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillsScroll}
            contentContainerStyle={styles.pillsScrollContent}
          >
            {QUEST_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, isActive && styles.activePill]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, isActive && styles.activePillText]}>
                    {cat === 'All' ? '🌟 All' : `${getCategoryIcon(cat)} ${cat}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* List Header Row */}
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionHeader}>
              {selectedCategory === 'All' ? 'Campus Quests Library' : `${selectedCategory} Quests`} ({filteredCoreQuests.length})
            </Text>
            <Text style={styles.completedCounterText}>
              {completedQuestCount} of {quests.length} completed
            </Text>
          </View>

          {filteredCoreQuests.map((quest) => {
            const isCompleted = completedQuestIds.includes(quest.id);

            return (
              <View key={quest.id} style={[styles.card, isCompleted && styles.completedCard]}>
                <View style={styles.cardTopRow}>
                  <View style={styles.categoryBadgeRow}>
                    <Text style={styles.categoryIcon}>{quest.categoryIcon}</Text>
                    <Text style={styles.categoryBadge}>
                      {quest.category} • {quest.impact}
                    </Text>
                  </View>
                  <View style={[styles.pointsPill, isCompleted && styles.pointsPillCompleted]}>
                    <Text style={[styles.pointsPillText, isCompleted && styles.pointsPillTextCompleted]}>
                      +{quest.points} PTS
                    </Text>
                  </View>
                </View>

                <Text style={[styles.questTitle, isCompleted && styles.questTitleCompleted]}>
                  {quest.title}
                </Text>
                <Text style={styles.questDesc}>{quest.desc}</Text>

                {quest.co2 && (
                  <View style={styles.co2Row}>
                    <Text style={styles.co2Text}>
                      🌿 Estimated Offset: <Text style={styles.co2Bold}>{quest.co2}</Text>
                    </Text>
                  </View>
                )}

                {isCompleted ? (
                  <View style={styles.completedBadgeButton}>
                    <Text style={styles.completedBadgeButtonText}>
                      ✓ Completed (+{quest.points} pts awarded)
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => completeQuest(quest.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionButtonText}>
                      Mark as Done (+{quest.points} pts) ✓
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

function getCategoryIcon(category) {
  switch (category) {
    case 'Energy': return '⚡';
    case 'Waste': return '♻️';
    case 'Water': return '💧';
    case 'Transit': return '🚲';
    case 'Biodiversity': return '🐝';
    case 'Food': return '🥗';
    case 'Digital': return '💻';
    default: return '🌱';
  }
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
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  pointsSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryStatValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  statSeparator: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  mainTabRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  mainTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mainTabBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  mainTabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  tabContentSection: {
    marginTop: 2,
  },
  dailyHeroBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  dailyHeroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  streakCountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  streakSubText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  dayCounterBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  dayCounterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  dailyProgressContainer: {
    marginBottom: 12,
  },
  dailyProgressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dailyProgressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#14532D',
  },
  dailyProgressScore: {
    fontSize: 12,
    fontWeight: '800',
    color: '#14532D',
  },
  dailyProgressTrack: {
    height: 8,
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  dailyProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  dailyBonusCelebration: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  dailyBonusIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  dailyBonusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  dailyBonusDesc: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
    lineHeight: 15,
  },
  advanceDayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  advanceDayBtnIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  advanceDayBtnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  advanceDayBtnSubtitle: {
    fontSize: 10,
    color: '#CCFBF1',
    marginTop: 1,
  },
  advanceDayBtnArrow: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  sectorInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectorInfoIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  sectorInfoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectorInfoDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
  pillsScroll: {
    marginBottom: 12,
  },
  pillsScrollContent: {
    paddingRight: 8,
  },
  pill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activePill: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  activePillText: {
    color: '#FFFFFF',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  completedCounterText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointsPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  pointsPillCompleted: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  pointsPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  pointsPillTextCompleted: {
    color: '#15803D',
  },
  questTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 20,
  },
  questTitleCompleted: {
    color: '#166534',
  },
  questDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  co2Row: {
    marginBottom: 12,
  },
  co2Text: {
    fontSize: 11,
    color: '#64748B',
  },
  co2Bold: {
    fontWeight: '700',
    color: '#16A34A',
  },
  targetDistrictTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  actionButton: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  completedBadgeButton: {
    backgroundColor: '#DCFCE7',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  completedBadgeButtonText: {
    color: '#16A34A',
    fontSize: 12.5,
    fontWeight: '800',
  },
});

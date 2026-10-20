import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStoragePackage from '@react-native-async-storage/async-storage';
import {
  QUESTS,
  CAMPUS_UPGRADES,
  LEVELS,
  BADGES,
  INITIAL_LEADERBOARD,
  DISTRICTS,
  getDistrict,
  getDistrictUpgrades,
  getNextDistrictUpgrade,
  DEFAULT_DISTRICT_ID,
  ALL_QUESTS,
  DAILY_QUEST_POOL,
  SECTOR_QUESTS,
  getDailyQuests,
  ENHANCED_BADGES,
} from '../data/gameData.js';

// Resolve AsyncStorage interop across Metro and Node environments
const AsyncStorage =
  AsyncStoragePackage?.getItem ? AsyncStoragePackage
  : AsyncStoragePackage?.default?.getItem ? AsyncStoragePackage.default
  : AsyncStoragePackage?.default?.default || AsyncStoragePackage;

export const STORAGE_KEY = 'ecoquest.gameState.v1';
export const SCHEMA_VERSION = 1;

/**
 * Validates and sanitizes raw stored game state.
 * Filters unknown IDs, removes duplicates, and enforces sequential integrity on upgrades.
 * Safe against null, undefined, invalid JSON, and non-object shapes.
 */
export function validateSavedGameState(raw) {
  if (!raw) {
    return {
      valid: false,
      completedQuestIds: [],
      purchasedUpgradeIds: [],
      reason: 'empty_or_null',
    };
  }

  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return {
        valid: false,
        completedQuestIds: [],
        purchasedUpgradeIds: [],
        reason: 'malformed_json',
      };
    }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      valid: false,
      completedQuestIds: [],
      purchasedUpgradeIds: [],
      reason: 'invalid_shape',
    };
  }

  // 1. Sanitize completedQuestIds: keep only recognized, deduplicated quest IDs
  const rawQuestIds = Array.isArray(parsed.completedQuestIds) ? parsed.completedQuestIds : [];
  const knownQuestIds = new Set(ALL_QUESTS.map((q) => q.id));
  const validQuestIds = [];
  const seenQuests = new Set();

  for (const id of rawQuestIds) {
    if (typeof id === 'string') {
      const isKnown =
        knownQuestIds.has(id) ||
        (id.startsWith('day-') && knownQuestIds.has(id.replace(/^day-\d+-/, ''))) ||
        id.startsWith('daily-drop-day-') ||
        id.startsWith('spark-');
      if (isKnown && !seenQuests.has(id)) {
        seenQuests.add(id);
        validQuestIds.push(id);
      }
    }
  }

  // 2. Sanitize purchasedUpgradeIds: must be recognized and strictly sequential
  const rawUpgradeIds = Array.isArray(parsed.purchasedUpgradeIds) ? parsed.purchasedUpgradeIds : [];
  const validUpgradeIds = [];

  for (let i = 0; i < CAMPUS_UPGRADES.length; i++) {
    const expectedUpgradeId = CAMPUS_UPGRADES[i].id;
    if (rawUpgradeIds.includes(expectedUpgradeId)) {
      validUpgradeIds.push(expectedUpgradeId);
    } else {
      // Upgrades must be sequential; stop at the first missing upgrade
      break;
    }
  }

  const districtStages =
    typeof parsed.districtStages === 'object' && parsed.districtStages !== null
      ? parsed.districtStages
      : {};
  const activeDistrictId =
    typeof parsed.activeDistrictId === 'string'
      ? parsed.activeDistrictId
      : 'academic';
  const dailyQuestsDayOffset =
    typeof parsed.dailyQuestsDayOffset === 'number' ? parsed.dailyQuestsDayOffset : 0;
  const dailyStreak =
    typeof parsed.dailyStreak === 'number' ? parsed.dailyStreak : 1;
  const lastDailyDropDayOffset =
    typeof parsed.lastDailyDropDayOffset === 'number' ? parsed.lastDailyDropDayOffset : -1;
  const collectedSparkIds =
    Array.isArray(parsed.collectedSparkIds) ? parsed.collectedSparkIds.filter((s) => typeof s === 'string') : [];

  return {
    valid: true,
    version: typeof parsed.version === 'number' ? parsed.version : SCHEMA_VERSION,
    completedQuestIds: validQuestIds,
    purchasedUpgradeIds: validUpgradeIds,
    districtStages,
    activeDistrictId,
    dailyQuestsDayOffset,
    dailyStreak,
    lastDailyDropDayOffset,
    collectedSparkIds,
  };
}

/**
 * Serializes only primary state records required to reconstruct progress.
 * Redundant derived values (points, stage, level, badges, rank) are omitted.
 */
export function serializeGameState(
  completedQuestIds,
  purchasedUpgradeIds,
  districtStages = {},
  activeDistrictId = 'academic',
  dailyQuestsDayOffset = 0,
  dailyStreak = 1,
  lastDailyDropDayOffset = -1,
  collectedSparkIds = []
) {
  return JSON.stringify({
    version: SCHEMA_VERSION,
    completedQuestIds: Array.isArray(completedQuestIds) ? completedQuestIds : [],
    purchasedUpgradeIds: Array.isArray(purchasedUpgradeIds) ? purchasedUpgradeIds : [],
    districtStages: typeof districtStages === 'object' && districtStages !== null ? districtStages : {},
    activeDistrictId: typeof activeDistrictId === 'string' ? activeDistrictId : 'academic',
    dailyQuestsDayOffset: typeof dailyQuestsDayOffset === 'number' ? dailyQuestsDayOffset : 0,
    dailyStreak: typeof dailyStreak === 'number' ? dailyStreak : 1,
    lastDailyDropDayOffset: typeof lastDailyDropDayOffset === 'number' ? lastDailyDropDayOffset : -1,
    collectedSparkIds: Array.isArray(collectedSparkIds) ? collectedSparkIds : [],
    savedAt: new Date().toISOString(),
  });
}

const GameContext = createContext(null);

/**
 * Pure calculation and validation functions for EcoQuest game rules
 */

export function calculateLifetimePoints(completedQuestIds) {
  if (!Array.isArray(completedQuestIds)) return 0;
  return completedQuestIds.reduce((sum, id) => {
    let quest = ALL_QUESTS.find((q) => q.id === id);
    if (!quest && typeof id === 'string' && id.startsWith('day-')) {
      const baseId = id.replace(/^day-\d+-/, '');
      quest = ALL_QUESTS.find((q) => q.id === baseId);
    }
    if (!quest && typeof id === 'string' && id.startsWith('daily-drop-day-')) {
      return sum + 25; // daily drop gives 25 points
    }
    if (!quest && typeof id === 'string' && id.startsWith('spark-')) {
      return sum + 10; // map collectible spark gives 10 points
    }
    return sum + (quest ? quest.points : 0);
  }, 0);
}

/**
 * Real-World Environmental Impact Engine
 * Translates completed quests & multi-phase district restorations into tangible metrics.
 */
export function calculateEcoImpact(completedQuestIds = [], districtStages = {}, purchasedUpgradeIds = []) {
  if (!Array.isArray(completedQuestIds)) completedQuestIds = [];
  if (!districtStages || typeof districtStages !== 'object') districtStages = {};

  let questCo2 = 0;
  let questWater = 0;
  let questPlastics = 0;
  let questKwh = 0;
  let questTrees = 0;

  for (const id of completedQuestIds) {
    let quest = ALL_QUESTS.find((q) => q.id === id);
    if (!quest && typeof id === 'string' && id.startsWith('day-')) {
      const baseId = id.replace(/^day-\d+-/, '');
      quest = ALL_QUESTS.find((q) => q.id === baseId);
    }
    if (quest) {
      if (quest.co2) {
        const num = parseFloat(quest.co2);
        if (!isNaN(num)) questCo2 += num;
      } else {
        questCo2 += (quest.points || 20) * 0.025;
      }

      const cat = quest.category || '';
      if (cat === 'Water') {
        questWater += 28;
      } else if (cat === 'Waste') {
        questPlastics += 4;
      } else if (cat === 'Energy') {
        questKwh += 1.8;
      } else if (cat === 'Biodiversity') {
        questTrees += 0.25;
      } else if (cat === 'Transit') {
        questCo2 += 1.2;
      }
    }
  }

  let districtCo2 = 0;
  let districtWater = 0;
  let districtPlastics = 0;
  let districtKwh = 0;
  let districtTrees = 0;
  let totalStagesCount = 0;

  const distList = ['academic', 'society', 'garden', 'mall', 'lake'];
  for (const distId of distList) {
    let stage = Number(districtStages[distId]) || 0;
    if (distId === 'academic' && Array.isArray(purchasedUpgradeIds) && purchasedUpgradeIds.length > stage) {
      stage = purchasedUpgradeIds.length;
    }
    stage = Math.max(0, Math.min(4, Math.floor(stage)));
    totalStagesCount += stage;

    if (distId === 'academic') {
      districtCo2 += stage * 18.5;
      districtKwh += stage * 22;
      districtTrees += stage * 0.5;
    } else if (distId === 'society') {
      districtWater += stage * 65;
      districtCo2 += stage * 12;
      districtKwh += stage * 16;
    } else if (distId === 'garden') {
      districtTrees += stage * 3.5;
      districtCo2 += stage * 16.5;
      districtWater += stage * 30;
    } else if (distId === 'mall') {
      districtPlastics += stage * 45;
      districtCo2 += stage * 14;
      districtKwh += stage * 18;
    } else if (distId === 'lake') {
      districtWater += stage * 120;
      districtTrees += stage * 1.5;
      districtCo2 += stage * 20;
    }
  }

  const netCo2 = Number((questCo2 + districtCo2).toFixed(1));
  const netWater = Math.round(questWater + districtWater);
  const netPlastics = Math.round(questPlastics + districtPlastics);
  const netKwh = Number((questKwh + districtKwh).toFixed(1));
  const netTrees = Number((questTrees + districtTrees + netCo2 / 22).toFixed(1));

  const stageFraction = totalStagesCount / 20;
  const questFraction = Math.min(1, completedQuestIds.length / 25);
  const campusVitalityPercent = Math.min(100, Math.round(stageFraction * 70 + questFraction * 30));

  let vitalityGrade = 'Dormant Soil';
  let vitalityColor = '#EF4444';
  if (campusVitalityPercent >= 90) {
    vitalityGrade = 'Apex Net-Zero Bio-Sanctuary';
    vitalityColor = '#059669';
  } else if (campusVitalityPercent >= 70) {
    vitalityGrade = 'Flourishing Eco-Campus';
    vitalityColor = '#10B981';
  } else if (campusVitalityPercent >= 45) {
    vitalityGrade = 'Rapidly Greening Grounds';
    vitalityColor = '#0284C7';
  } else if (campusVitalityPercent >= 20) {
    vitalityGrade = 'Early Eco-Restoration';
    vitalityColor = '#F59E0B';
  }

  return {
    co2Kg: netCo2,
    co2Label: `${netCo2} kg CO₂e`,
    waterLiters: netWater,
    waterLabel: `${netWater} L`,
    plasticsAvoided: netPlastics,
    plasticsLabel: `${netPlastics} items`,
    cleanEnergyKwh: netKwh,
    cleanEnergyLabel: `${netKwh} kWh`,
    treesSeeded: netTrees,
    treesLabel: `${netTrees} Trees`,
    campusVitalityPercent,
    vitalityGrade,
    vitalityColor,
    totalStagesCount,
    maxStagesCount: 20,
    carKmSpared: Number((netCo2 * 4.2).toFixed(1)),
  };
}

export function calculateDistrictUpgradesCost(districtStages = {}) {
  if (typeof districtStages !== 'object' || districtStages === null) return 0;
  let total = 0;
  for (const [distId, stage] of Object.entries(districtStages)) {
    if (distId === 'academic') continue; // academic quad is tracked via purchasedUpgradeIds
    const numStage = typeof stage === 'number' ? Math.max(0, Math.min(4, Math.floor(stage))) : 0;
    const district = DISTRICTS.find((d) => d.id === distId);
    if (district && Array.isArray(district.upgrades)) {
      for (let i = 0; i < numStage; i++) {
        if (district.upgrades[i]) {
          total += Number(district.upgrades[i].cost) || 0;
        }
      }
    }
  }
  return total;
}

export function calculateTotalUpgradeCost(purchasedUpgradeIds = [], districtStages = {}) {
  let baseCost = 0;
  if (Array.isArray(purchasedUpgradeIds)) {
    baseCost = purchasedUpgradeIds.reduce((sum, id) => {
      const upgrade = CAMPUS_UPGRADES.find((u) => u.id === id);
      return sum + (upgrade ? upgrade.cost : 0);
    }, 0);
  }
  const districtCost = calculateDistrictUpgradesCost(districtStages);
  return baseCost + districtCost;
}

export function calculateSpendablePoints(completedQuestIds = [], purchasedUpgradeIds = [], districtStages = {}) {
  const lifetime = calculateLifetimePoints(completedQuestIds);
  const cost = calculateTotalUpgradeCost(purchasedUpgradeIds, districtStages);
  return Math.max(0, lifetime - cost);
}

export function calculateRestorationStage(purchasedUpgradeIds) {
  if (!Array.isArray(purchasedUpgradeIds)) return 0;
  return Math.min(4, Math.max(0, purchasedUpgradeIds.length));
}

export function getNextUpgrade(restorationStage) {
  const stage = typeof restorationStage === 'number' ? restorationStage : 0;
  return stage < CAMPUS_UPGRADES.length ? CAMPUS_UPGRADES[stage] : null;
}

export function canAffordNextUpgrade(spendablePoints, nextUpgrade) {
  if (!nextUpgrade) return false;
  return (spendablePoints || 0) >= nextUpgrade.cost;
}

export function getNextUpgradeShortfall(spendablePoints, nextUpgrade) {
  if (!nextUpgrade) return 0;
  return Math.max(0, nextUpgrade.cost - (spendablePoints || 0));
}

/**
 * Phase 3.2D: Player Level Progression Calculation
 * 
 * Level 1: Eco Seedling   (0–49 pts)
 * Level 2: Green Scout    (50–99 pts)
 * Level 3: Earth Guardian (100–169 pts)
 * Level 4: Planet Champion (170–210 pts)
 */
export function calculateLevelInfo(lifetimePoints) {
  const pts = typeof lifetimePoints === 'number' && Number.isFinite(lifetimePoints)
    ? Math.max(0, lifetimePoints)
    : 0;

  for (let i = 0; i < LEVELS.length; i++) {
    const lvl = LEVELS[i];
    const isLast = i === LEVELS.length - 1;
    if (pts <= lvl.maxPoints || isLast) {
      const range = lvl.nextThreshold - lvl.minPoints;
      const progressPercent = Math.min(100, Math.max(0, Math.round(((pts - lvl.minPoints) / Math.max(1, range)) * 100)));
      const nextLvl = isLast ? null : LEVELS[i + 1];
      const isCompletedProgression = pts >= LEVELS[LEVELS.length - 1].nextThreshold;
      return {
        level: lvl.level,
        name: lvl.name,
        levelTag: `Level ${lvl.level}: ${lvl.name}`,
        minPoints: lvl.minPoints,
        maxPoints: lvl.maxPoints,
        nextThreshold: lvl.nextThreshold,
        pointsToNext: Math.max(0, lvl.nextThreshold - pts),
        progressPercent,
        nextLevelName: nextLvl ? nextLvl.name : null,
        isMaxLevel: isLast,
        isCompletedProgression,
        badgeColor: lvl.badgeColor || '#10B981',
      };
    }
  }

  return {
    level: 1,
    name: 'Eco Seedling',
    levelTag: 'Level 1: Eco Seedling',
    minPoints: 0,
    maxPoints: 149,
    nextThreshold: 150,
    pointsToNext: 150,
    progressPercent: 0,
    nextLevelName: 'Green Scout',
    isMaxLevel: false,
    isCompletedProgression: false,
    badgeColor: '#10B981',
  };
}

/**
 * Phase 3.2D: Achievement Badges Evaluation
 * Derives lock/unlock status and progress for all 16 tiered badges
 */
export function calculateBadges(
  completedQuestIds,
  lifetimePoints,
  purchasedUpgradeIds = [],
  badgeDefs = BADGES,
  extraContext = {}
) {
  const questIds = Array.isArray(completedQuestIds) ? completedQuestIds : [];
  const upgradeIds = Array.isArray(purchasedUpgradeIds) ? purchasedUpgradeIds : [];
  const pts = typeof lifetimePoints === 'number' && Number.isFinite(lifetimePoints)
    ? Math.max(0, lifetimePoints)
    : 0;

  const currentStreak = typeof extraContext.dailyStreak === 'number' ? extraContext.dailyStreak : 0;
  const distStages = typeof extraContext.districtStages === 'object' && extraContext.districtStages !== null
    ? extraContext.districtStages
    : {};

  const badges = badgeDefs.map((badgeDef) => {
    let isUnlocked = false;
    let progressText = '';
    let current = 0;
    const target = badgeDef.target || 1;

    if (badgeDef.type === 'quest_count') {
      current = questIds.length;
      isUnlocked = current >= target;
      progressText = `${Math.min(target, current)} / ${target} quests completed`;
    } else if (badgeDef.type === 'lifetime_points') {
      current = pts;
      isUnlocked = pts >= target;
      progressText = `${Math.min(target, pts)} / ${target} pts earned`;
    } else if (badgeDef.type === 'specific_quests') {
      const matching = questIds.filter((id) => (badgeDef.requiredQuestIds || []).includes(id)).length;
      current = matching;
      isUnlocked = matching >= target;
      progressText = `${Math.min(target, matching)} / ${target} category quests`;
    } else if (badgeDef.type === 'upgrade_count') {
      current = upgradeIds.length;
      isUnlocked = current >= target;
      progressText = `${Math.min(target, current)} / ${target} projects built`;
    } else if (badgeDef.type === 'daily_streak') {
      current = currentStreak;
      isUnlocked = current >= target;
      progressText = `${Math.min(target, current)} / ${target} day streak`;
    } else if (badgeDef.type === 'phase_complete') {
      const stage = distStages[badgeDef.targetDistrict] || 0;
      current = stage;
      isUnlocked = stage >= target;
      progressText = isUnlocked ? 'District fully restored' : `Stage ${stage} / ${target} restored`;
    } else if (badgeDef.type === 'all_phases_complete') {
      const allPhases = ['academic', 'society', 'garden', 'mall', 'lake'];
      const completedCount = allPhases.filter((d) => (distStages[d] || 0) >= 4).length;
      current = completedCount;
      isUnlocked = completedCount >= target;
      progressText = `${completedCount} / ${target} districts completed`;
    } else {
      isUnlocked = false;
      progressText = 'Locked';
    }

    return {
      ...badgeDef,
      isUnlocked,
      current,
      progressText,
    };
  });

  const unlockedBadgeIds = badges.filter((b) => b.isUnlocked).map((b) => b.id);
  const unlockedBadgeCount = unlockedBadgeIds.length;

  return {
    badges,
    unlockedBadgeIds,
    unlockedBadgeCount,
  };
}

/**
 * Phase 3.2D: Dynamic Leaderboard Ranking
 * Deterministic sorting: points descending, stable initial index as tie-breaker
 */
export function calculateLeaderboard(lifetimePoints) {
  const pts = typeof lifetimePoints === 'number' && Number.isFinite(lifetimePoints)
    ? Math.max(0, lifetimePoints)
    : 0;

  // Clone participants and update Aditya's points
  const participants = INITIAL_LEADERBOARD.map((p) => {
    if (p.isUser) {
      return { ...p, pts };
    }
    return { ...p };
  });

  // Sort deterministically:
  // Primary: points descending (b.pts - a.pts)
  // Tie-breaker: stable initial order (a.initialIndex - b.initialIndex)
  const sorted = participants.sort((a, b) => {
    if (b.pts !== a.pts) {
      return b.pts - a.pts;
    }
    return a.initialIndex - b.initialIndex;
  });

  // Assign dynamic ranks and podium medals
  const leaderboard = sorted.map((item, index) => {
    const rank = index + 1;
    let medal = null;
    if (rank === 1) medal = '🥇';
    else if (rank === 2) medal = '🥈';
    else if (rank === 3) medal = '🥉';
    return {
      ...item,
      rank,
      medal,
    };
  });

  const userEntry = leaderboard.find((p) => p.isUser);
  const userRank = userEntry ? userEntry.rank : 8;
  const top3Podium = [leaderboard[0], leaderboard[1], leaderboard[2]];

  return {
    leaderboard,
    userRank,
    userEntry,
    top3Podium,
  };
}

export function processQuestCompletion(questId, completedQuestIds) {
  if (!questId || typeof questId !== 'string') {
    return { success: false, reason: 'invalid_id' };
  }

  let quest = ALL_QUESTS.find((q) => q.id === questId);
  if (!quest && questId.startsWith('day-')) {
    const baseId = questId.replace(/^day-\d+-/, '');
    quest = ALL_QUESTS.find((q) => q.id === baseId);
  }

  if (!quest) {
    return { success: false, reason: 'quest_not_found' };
  }

  if (completedQuestIds.includes(questId)) {
    return { success: false, reason: 'already_completed' };
  }

  return {
    success: true,
    pointsAwarded: quest.points,
    nextCompletedQuestIds: [...completedQuestIds, questId],
  };
}

export function processUpgradePurchase(purchasedUpgradeIds, spendablePoints) {
  const currentStage = calculateRestorationStage(purchasedUpgradeIds);
  const nextUpgrade = getNextUpgrade(currentStage);

  if (!nextUpgrade) {
    return { success: false, reason: 'all_upgrades_completed' };
  }

  if ((spendablePoints || 0) < nextUpgrade.cost) {
    return {
      success: false,
      reason: 'insufficient_points',
      shortfall: nextUpgrade.cost - (spendablePoints || 0),
    };
  }

  if (purchasedUpgradeIds.includes(nextUpgrade.id)) {
    return { success: false, reason: 'already_purchased' };
  }

  return {
    success: true,
    upgrade: nextUpgrade,
    nextPurchasedUpgradeIds: [...purchasedUpgradeIds, nextUpgrade.id],
  };
}

export function GameProvider({ children, storage: customStorage }) {
  // Use customStorage if provided (for tests / dependency injection), otherwise default AsyncStorage
  const storage = customStorage || AsyncStorage;

  // Primary state records: arrays of completed quest IDs and purchased upgrade IDs
  const [completedQuestIds, setCompletedQuestIds] = useState([]);
  const [purchasedUpgradeIds, setPurchasedUpgradeIds] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Multi-district expansion state
  const [activeDistrictId, setActiveDistrictIdState] = useState('academic');
  const [districtStages, setDistrictStagesState] = useState({
    academic: 0,
    society: 0,
    garden: 0,
    mall: 0,
    lake: 0,
  });

  // Daily quest system & infinite rotation state
  const [dailyQuestsDayOffset, setDailyQuestsDayOffsetState] = useState(0);
  const [dailyStreak, setDailyStreakState] = useState(1);
  const [lastDailyDropDayOffset, setLastDailyDropDayOffsetState] = useState(-1);
  const [collectedSparkIds, setCollectedSparkIdsState] = useState([]);

  // Synchronous refs to guarantee atomic state access across rapid consecutive actions
  const completedQuestIdsRef = useRef([]);
  const purchasedUpgradeIdsRef = useRef([]);
  const activeDistrictIdRef = useRef('academic');
  const districtStagesRef = useRef({
    academic: 0,
    society: 0,
    garden: 0,
    mall: 0,
    lake: 0,
  });
  const dailyQuestsDayOffsetRef = useRef(0);
  const dailyStreakRef = useRef(1);
  const lastDailyDropDayOffsetRef = useRef(-1);
  const collectedSparkIdsRef = useRef([]);
  const isHydratedRef = useRef(false);
  // Write queue / mutex to guarantee sequential, race-free persistence
  const saveChainRef = useRef(Promise.resolve());

  // Dynamic rotating daily quests batch for current simulated day
  const rawDailyQuests = getDailyQuests(dailyQuestsDayOffset);
  const dailyQuests = rawDailyQuests.map((q) => ({
    ...q,
    id: `day-${dailyQuestsDayOffset}-${q.id}`,
    baseId: q.id,
  }));

  const advanceDailyQuests = () => {
    const nextOffset = dailyQuestsDayOffsetRef.current + 1;
    dailyQuestsDayOffsetRef.current = nextOffset;
    setDailyQuestsDayOffsetState(nextOffset);

    const nextStreak = dailyStreakRef.current + 1;
    dailyStreakRef.current = nextStreak;
    setDailyStreakState(nextStreak);

    queuePersist(
      completedQuestIdsRef.current,
      purchasedUpgradeIdsRef.current,
      districtStagesRef.current,
      activeDistrictIdRef.current,
      nextOffset,
      nextStreak,
      lastDailyDropDayOffsetRef.current,
      collectedSparkIdsRef.current
    );
    return nextOffset;
  };

  // Derive lifetime points strictly from completed quest rewards (never decreases)
  const lifetimePoints = calculateLifetimePoints(completedQuestIds);

  // Derive total points spent strictly from purchased upgrades AND all district phase stages
  const totalUpgradeCost = calculateTotalUpgradeCost(purchasedUpgradeIds, districtStages);

  // Spendable points = lifetimePoints - totalUpgradeCost (never below 0)
  const spendablePoints = calculateSpendablePoints(completedQuestIds, purchasedUpgradeIds, districtStages);

  // Completed quest count
  const completedQuestCount = completedQuestIds.length;

  // Derive restoration stage strictly from purchased upgrades count (0 to 4)
  const restorationStage = calculateRestorationStage(purchasedUpgradeIds);

  // Keep academic district stage synced with restorationStage
  useEffect(() => {
    setDistrictStagesState((prev) => {
      if (prev.academic === restorationStage) return prev;
      const updated = { ...prev, academic: restorationStage };
      districtStagesRef.current = updated;
      return updated;
    });
  }, [restorationStage]);

  // Determine next eligible sequential upgrade
  const nextUpgrade = getNextUpgrade(restorationStage);

  // Affordability calculations for next upgrade
  const canAfford = canAffordNextUpgrade(spendablePoints, nextUpgrade);
  const nextUpgradeShortfall = getNextUpgradeShortfall(spendablePoints, nextUpgrade);

  // Multi-district active district derivation
  const activeDistrict = getDistrict(activeDistrictId);
  const activeDistrictStage =
    activeDistrictId === 'academic'
      ? restorationStage
      : (districtStages[activeDistrictId] ?? 0);
  const activeDistrictUpgrade =
    activeDistrictId === 'academic'
      ? nextUpgrade
      : getNextDistrictUpgrade(activeDistrictId, activeDistrictStage);
  const canAffordActiveUpgrade =
    activeDistrictId === 'academic'
      ? canAfford
      : (activeDistrictUpgrade ? spendablePoints >= activeDistrictUpgrade.cost : false);
  const activeUpgradeShortfall =
    activeDistrictId === 'academic'
      ? nextUpgradeShortfall
      : (activeDistrictUpgrade ? Math.max(0, activeDistrictUpgrade.cost - spendablePoints) : 0);

  // Phase 3.2D: Real-time Player Level Progression (derived solely from lifetimePoints)
  const levelInfo = calculateLevelInfo(lifetimePoints);

  // Phase 3.2D: Real-time Achievement Badges (16 core badges for tests & baseline)
  const { badges, unlockedBadgeIds, unlockedBadgeCount } = calculateBadges(
    completedQuestIds,
    lifetimePoints,
    purchasedUpgradeIds
  );

  // Phase 3.2E / Enhanced 24-Tier Achievement Badges (Streaks, District Masteries, World Sovereign)
  const {
    badges: enhancedBadges,
    unlockedBadgeIds: enhancedUnlockedBadgeIds,
    unlockedBadgeCount: enhancedUnlockedBadgeCount,
  } = calculateBadges(
    completedQuestIds,
    lifetimePoints,
    purchasedUpgradeIds,
    ENHANCED_BADGES,
    {
      dailyStreak,
      districtStages,
    }
  );

  // Phase 3.2D: Dynamic Campus Leaderboard (derived solely from lifetimePoints)
  const { leaderboard, userRank, userEntry, top3Podium } = calculateLeaderboard(lifetimePoints);

  // Hydrate stored game state on initial mount
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      try {
        if (!storage || typeof storage.getItem !== 'function') {
          if (isMounted) {
            setIsHydrated(true);
            isHydratedRef.current = true;
          }
          return;
        }

        const raw = await storage.getItem(STORAGE_KEY);
        if (raw) {
          const validated = validateSavedGameState(raw);
          if (validated.valid) {
            completedQuestIdsRef.current = validated.completedQuestIds;
            purchasedUpgradeIdsRef.current = validated.purchasedUpgradeIds;
            const academicStage = calculateRestorationStage(validated.purchasedUpgradeIds);
            const loadedStages = {
              academic: academicStage,
              society: Number(validated.districtStages?.society) || 0,
              garden: Number(validated.districtStages?.garden) || 0,
              mall: Number(validated.districtStages?.mall) || 0,
              lake: Number(validated.districtStages?.lake) || 0,
            };
            districtStagesRef.current = loadedStages;
            activeDistrictIdRef.current = validated.activeDistrictId || 'academic';

            const loadedDayOffset = Number(validated.dailyQuestsDayOffset) || 0;
            const loadedStreak = Math.max(1, Number(validated.dailyStreak) || 1);
            const loadedLastDailyDrop = typeof validated.lastDailyDropDayOffset === 'number' ? validated.lastDailyDropDayOffset : -1;
            const loadedSparks = Array.isArray(validated.collectedSparkIds) ? validated.collectedSparkIds : [];
            dailyQuestsDayOffsetRef.current = loadedDayOffset;
            dailyStreakRef.current = loadedStreak;
            lastDailyDropDayOffsetRef.current = loadedLastDailyDrop;
            collectedSparkIdsRef.current = loadedSparks;

            if (isMounted) {
              setCompletedQuestIds(validated.completedQuestIds);
              setPurchasedUpgradeIds(validated.purchasedUpgradeIds);
              setDistrictStagesState(loadedStages);
              setActiveDistrictIdState(validated.activeDistrictId || 'academic');
              setDailyQuestsDayOffsetState(loadedDayOffset);
              setDailyStreakState(loadedStreak);
              setLastDailyDropDayOffsetState(loadedLastDailyDrop);
              setCollectedSparkIdsState(loadedSparks);
            }
          } else {
            console.warn(
              '[EcoQuest] Stored game state was invalid or malformed; initializing fresh demo session.',
              validated.reason
            );
          }
        }
      } catch (err) {
        console.warn(
          '[EcoQuest] Error reading saved game state from storage; initializing fresh demo session.',
          err
        );
      } finally {
        if (isMounted) {
          setIsHydrated(true);
          isHydratedRef.current = true;
        }
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [storage]);

  /**
   * Chains storage writes sequentially so an older write cannot overwrite newer state.
   */
  const queuePersist = (
    questIds,
    upgradeIds,
    distStages = districtStagesRef.current,
    activeDist = activeDistrictIdRef.current,
    dayOffset = dailyQuestsDayOffsetRef.current,
    streak = dailyStreakRef.current,
    lastDropOffset = lastDailyDropDayOffsetRef.current,
    sparkIds = collectedSparkIdsRef.current
  ) => {
    if (!isHydratedRef.current) {
      console.warn('[EcoQuest] Attempted to persist before hydration completed; write skipped.');
      return Promise.resolve(false);
    }

    const serialized = serializeGameState(
      questIds,
      upgradeIds,
      distStages,
      activeDist,
      dayOffset,
      streak,
      lastDropOffset,
      sparkIds
    );

    saveChainRef.current = saveChainRef.current
      .catch(() => {})
      .then(async () => {
        try {
          if (storage && typeof storage.setItem === 'function') {
            await storage.setItem(STORAGE_KEY, serialized);
            return true;
          }
          return false;
        } catch (err) {
          console.error('[EcoQuest] Failed to persist game state:', err);
          return false;
        }
      });

    return saveChainRef.current;
  };

  /**
   * Complete a quest and award its points once
   * @param {string} questId
   * @returns {{ success: boolean, pointsAwarded?: number, reason?: string }}
   */
  const completeQuest = (questId) => {
    if (!isHydratedRef.current || isResetting) {
      return { success: false, reason: 'not_ready' };
    }

    const currentQuestIds = completedQuestIdsRef.current;
    const result = processQuestCompletion(questId, currentQuestIds);
    if (result.success) {
      const nextQuestIds = result.nextCompletedQuestIds;
      completedQuestIdsRef.current = nextQuestIds;
      setCompletedQuestIds(nextQuestIds);
      queuePersist(nextQuestIds, purchasedUpgradeIdsRef.current);
    }
    return result;
  };

  /**
   * Purchase the next eligible sequential campus upgrade
   * @returns {{ success: boolean, upgrade?: object, reason?: string, shortfall?: number }}
   */
  const purchaseNextUpgrade = () => {
    if (!isHydratedRef.current || isResetting) {
      return { success: false, reason: 'not_ready' };
    }

    const currentUpgradeIds = purchasedUpgradeIdsRef.current;
    const currentQuestIds = completedQuestIdsRef.current;
    const currentSpendable = calculateSpendablePoints(
      currentQuestIds,
      currentUpgradeIds,
      districtStagesRef.current
    );

    const result = processUpgradePurchase(currentUpgradeIds, currentSpendable);
    if (result.success) {
      const nextUpgradeIds = result.nextPurchasedUpgradeIds;
      purchasedUpgradeIdsRef.current = nextUpgradeIds;
      setPurchasedUpgradeIds(nextUpgradeIds);
      const newAcademicStage = calculateRestorationStage(nextUpgradeIds);
      const updatedStages = {
        ...districtStagesRef.current,
        academic: newAcademicStage,
      };
      districtStagesRef.current = updatedStages;
      setDistrictStagesState(updatedStages);
      queuePersist(currentQuestIds, nextUpgradeIds, updatedStages, activeDistrictIdRef.current);
    }
    return result;
  };

  /**
   * Set active district (Phase 1-5)
   */
  const setActiveDistrictId = (id) => {
    if (!id || typeof id !== 'string') return;
    activeDistrictIdRef.current = id;
    setActiveDistrictIdState(id);
    queuePersist(
      completedQuestIdsRef.current,
      purchasedUpgradeIdsRef.current,
      districtStagesRef.current,
      id
    );
  };

  /**
   * Update stage for any district directly (interactive sandbox & stage inspection)
   */
  const setDistrictStage = (distId, stage) => {
    const numericStage = Math.max(0, Math.min(4, Math.floor(Number(stage) || 0)));
    const updatedStages = {
      ...districtStagesRef.current,
      [distId]: numericStage,
    };
    districtStagesRef.current = updatedStages;
    setDistrictStagesState(updatedStages);
    queuePersist(
      completedQuestIdsRef.current,
      purchasedUpgradeIdsRef.current,
      updatedStages,
      activeDistrictIdRef.current
    );
  };

  /**
   * Purchase next project in the specified or active district
   */
  const purchaseDistrictUpgrade = (distId = activeDistrictIdRef.current) => {
    if (distId === 'academic') {
      return purchaseNextUpgrade();
    }
    const currentDistStage = districtStagesRef.current[distId] || 0;
    const nextDistUpgrade = getNextDistrictUpgrade(distId, currentDistStage);
    if (!nextDistUpgrade) {
      return { success: false, reason: 'all_upgrades_completed' };
    }
    const currentSpendable = calculateSpendablePoints(
      completedQuestIdsRef.current,
      purchasedUpgradeIdsRef.current,
      districtStagesRef.current
    );
    if (currentSpendable < nextDistUpgrade.cost) {
      return {
        success: false,
        reason: 'insufficient_points',
        shortfall: nextDistUpgrade.cost - currentSpendable,
      };
    }
    const nextDistStage = Math.min(4, currentDistStage + 1);
    const updatedStages = {
      ...districtStagesRef.current,
      [distId]: nextDistStage,
    };
    districtStagesRef.current = updatedStages;
    setDistrictStagesState(updatedStages);
    queuePersist(
      completedQuestIdsRef.current,
      purchasedUpgradeIdsRef.current,
      updatedStages,
      activeDistrictIdRef.current
    );
    return {
      success: true,
      upgrade: nextDistUpgrade,
      nextStage: nextDistStage,
    };
  };

  const canClaimDailyDrop = lastDailyDropDayOffset !== dailyQuestsDayOffset;

  const claimDailyDrop = () => {
    if (!canClaimDailyDrop) {
      return { success: false, reason: 'already_claimed_today' };
    }
    const bonusPoints = 25;
    const currentOffset = dailyQuestsDayOffsetRef.current;
    lastDailyDropDayOffsetRef.current = currentOffset;
    setLastDailyDropDayOffsetState(currentOffset);

    const bonusDropId = `daily-drop-day-${currentOffset}`;
    let nextQuestIds = completedQuestIdsRef.current;
    if (!nextQuestIds.includes(bonusDropId)) {
      nextQuestIds = [...nextQuestIds, bonusDropId];
      completedQuestIdsRef.current = nextQuestIds;
      setCompletedQuestIds(nextQuestIds);
    }

    queuePersist(
      nextQuestIds,
      purchasedUpgradeIdsRef.current,
      districtStagesRef.current,
      activeDistrictIdRef.current,
      currentOffset,
      dailyStreakRef.current,
      currentOffset,
      collectedSparkIdsRef.current
    );

    return {
      success: true,
      pointsAwarded: bonusPoints,
      message: `🎉 Daily Eco-Drop Claimed! +${bonusPoints} Eco Points added to your fund.`,
      tip: 'Carrying a refillable water bottle avoids 150+ single-use plastic bottles every academic semester!',
    };
  };

  const collectMapSpark = (sparkId, points = 10) => {
    if (!sparkId || typeof sparkId !== 'string') return { success: false };
    const currentSparks = collectedSparkIdsRef.current || [];
    if (currentSparks.includes(sparkId)) {
      return { success: false, reason: 'already_collected' };
    }

    const nextSparks = [...currentSparks, sparkId];
    collectedSparkIdsRef.current = nextSparks;
    setCollectedSparkIdsState(nextSparks);

    const mapQuestId = `spark-${sparkId}`;
    let nextQuestIds = completedQuestIdsRef.current;
    if (!nextQuestIds.includes(mapQuestId)) {
      nextQuestIds = [...nextQuestIds, mapQuestId];
      completedQuestIdsRef.current = nextQuestIds;
      setCompletedQuestIds(nextQuestIds);
    }

    queuePersist(
      nextQuestIds,
      purchasedUpgradeIdsRef.current,
      districtStagesRef.current,
      activeDistrictIdRef.current,
      dailyQuestsDayOffsetRef.current,
      dailyStreakRef.current,
      lastDailyDropDayOffsetRef.current,
      nextSparks
    );

    return {
      success: true,
      pointsAwarded: points,
      message: `✨ Spark Collected! +${points} Eco Points!`,
    };
  };

  const ecoImpact = calculateEcoImpact(completedQuestIds, districtStages, purchasedUpgradeIds);

  /**
   * Resets local demonstration data back to baseline initial state
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const resetDemo = async () => {
    if (!isHydratedRef.current || isResetting) {
      return { success: false, reason: 'in_progress_or_not_ready' };
    }

    setIsResetting(true);
    try {
      // Settle any pending saves before clearing storage
      await saveChainRef.current.catch(() => {});

      if (storage && typeof storage.removeItem === 'function') {
        await storage.removeItem(STORAGE_KEY);
      }

      completedQuestIdsRef.current = [];
      purchasedUpgradeIdsRef.current = [];
      const resetStages = { academic: 0, society: 0, garden: 0, mall: 0, lake: 0 };
      districtStagesRef.current = resetStages;
      activeDistrictIdRef.current = 'academic';
      dailyQuestsDayOffsetRef.current = 0;
      dailyStreakRef.current = 1;
      lastDailyDropDayOffsetRef.current = -1;
      collectedSparkIdsRef.current = [];

      setCompletedQuestIds([]);
      setPurchasedUpgradeIds([]);
      setDistrictStagesState(resetStages);
      setActiveDistrictIdState('academic');
      setDailyQuestsDayOffsetState(0);
      setDailyStreakState(1);
      setLastDailyDropDayOffsetState(-1);
      setCollectedSparkIdsState([]);
      setIsResetting(false);
      return { success: true };
    } catch (err) {
      console.error('[EcoQuest] Failed to reset demo state:', err);
      setIsResetting(false);
      return { success: false, error: err?.message || 'Storage error during reset' };
    }
  };

  const contextValue = {
    quests: QUESTS,
    upgrades: CAMPUS_UPGRADES,
    levels: LEVELS,
    completedQuestIds,
    completedQuestCount,
    lifetimePoints,
    spendablePoints,
    totalUpgradeCost,
    purchasedUpgradeIds,
    restorationStage,
    nextUpgrade,
    canAffordNextUpgrade: canAfford,
    nextUpgradeShortfall,
    completeQuest,
    purchaseNextUpgrade,
    // Phase 3.2D additions:
    levelInfo,
    badges,
    unlockedBadgeIds,
    unlockedBadgeCount,
    leaderboard,
    userRank,
    userEntry,
    top3Podium,
    // Phase 3.2E additions:
    isHydrated,
    isResetting,
    resetDemo,
    // Multi-District World Phase additions:
    districts: DISTRICTS,
    activeDistrictId,
    setActiveDistrictId,
    districtStages,
    setDistrictStage,
    activeDistrict,
    activeDistrictStage,
    activeDistrictUpgrade,
    canAffordActiveUpgrade,
    activeUpgradeShortfall,
    purchaseDistrictUpgrade,
    // Daily Rotating Quests & Infinite Progression System:
    dailyQuests,
    dailyQuestsDayOffset,
    dailyStreak,
    advanceDailyQuests,
    sectorQuests: SECTOR_QUESTS,
    allQuests: ALL_QUESTS,
    enhancedBadges,
    enhancedUnlockedBadgeIds,
    enhancedUnlockedBadgeCount,
    // Environmental Impact & Living World additions:
    ecoImpact,
    calculateEcoImpact,
    canClaimDailyDrop,
    claimDailyDrop,
    lastDailyDropDayOffset,
    collectedSparkIds,
    collectMapSpark,
  };

  return React.createElement(
    GameContext.Provider,
    { value: contextValue },
    children
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

import { strict as assert } from 'assert';
import {
  DISTRICTS,
  getDistrict,
  getDistrictUpgrades,
  getNextDistrictUpgrade,
  ALL_QUESTS,
  DAILY_QUEST_POOL,
  SECTOR_QUESTS,
  getDailyQuests,
  ENHANCED_BADGES,
  QUESTS,
  CAMPUS_UPGRADES,
} from '../src/data/gameData.js';
import {
  calculateLifetimePoints,
  calculateSpendablePoints,
  calculateBadges,
  processQuestCompletion,
  validateSavedGameState,
  serializeGameState,
} from '../src/context/GameContext.js';

console.log('================================================================');
console.log('   EcoQuest — Phase Progressive Artworks & Daily Quest Tests   ');
console.log('================================================================\n');

// 1. Verify All 5 Districts Have 5 Progressive Stages Defined
console.log('--- 1. Multi-Phase Stage Architecture ---');
assert.equal(DISTRICTS.length, 5, 'Exactly 5 ecological phases exist in the world');
for (const d of DISTRICTS) {
  assert.equal(Object.keys(d.stages).length, 5, `${d.name} has 5 defined stages (0 to 4)`);
  assert.equal(d.stages[0].percent, 0, `${d.name} stage 0 starts at 0% restoration baseline`);
  assert.equal(d.stages[4].percent, 100, `${d.name} stage 4 reaches 100% restoration`);
  assert.ok(d.stages[4].badge.startsWith('Stage 4'), `${d.name} stage 4 badge is Stage 4`);
}
console.log('✅ PASS: All 5 districts define progressive stages 0 through 4');

// 2. Verify Daily Quests Rotation & Balance
console.log('\n--- 2. Daily Rotating Quests Pool ---');
assert.ok(DAILY_QUEST_POOL.length >= 20, `Daily quest pool has extensive challenges (actual: ${DAILY_QUEST_POOL.length})`);
assert.ok(SECTOR_QUESTS.length >= 8, `Sector quest pool has specialized restoration tasks (actual: ${SECTOR_QUESTS.length})`);

const day0 = getDailyQuests(0);
const day1 = getDailyQuests(1);
const day2 = getDailyQuests(2);

assert.equal(day0.length, 5, 'Each day serves exactly 5 curated quests');
assert.equal(day1.length, 5, 'Day 1 serves exactly 5 curated quests');
assert.notDeepEqual(day0.map(q => q.id), day1.map(q => q.id), 'Day 0 and Day 1 serve distinct rotating quest sets');
console.log('✅ PASS: Daily quests rotate and deliver balanced non-flooding 5-task batches');

// 3. Verify Dynamic Day-Prefixed Quest Completion & Unlimited Points
console.log('\n--- 3. Unlimited Points & Day Advancements ---');
let completedIds = [];
let lifetimePts = calculateLifetimePoints(completedIds);
assert.equal(lifetimePts, 0, 'Initial points = 0');

// Complete Day 0 quests with day prefix
const day0Formatted = day0.map(q => `day-0-${q.id}`);
for (const qId of day0Formatted) {
  const res = processQuestCompletion(qId, completedIds);
  assert.equal(res.success, true, `Completed ${qId}`);
  completedIds = res.nextCompletedQuestIds;
}

const day0Pts = calculateLifetimePoints(completedIds);
assert.ok(day0Pts >= 120, `Day 0 points awarded (actual: ${day0Pts})`);

// Advance to Day 1 and complete Day 1 quests
const day1Formatted = day1.map(q => `day-1-${q.id}`);
for (const qId of day1Formatted) {
  const res = processQuestCompletion(qId, completedIds);
  assert.equal(res.success, true, `Completed ${qId}`);
  completedIds = res.nextCompletedQuestIds;
}

const day1Pts = calculateLifetimePoints(completedIds);
assert.ok(day1Pts > day0Pts, `Points accumulate across days without limit (Day 0: ${day0Pts}, Day 1: ${day1Pts})`);

// Complete Sector Quests
for (const sq of SECTOR_QUESTS) {
  const res = processQuestCompletion(sq.id, completedIds);
  assert.equal(res.success, true, `Completed sector quest ${sq.id}`);
  completedIds = res.nextCompletedQuestIds;
}

const totalAccumulated = calculateLifetimePoints(completedIds);
assert.ok(totalAccumulated >= 600, `Massive points earned from daily + sector quests: ${totalAccumulated}`);
console.log(`✅ PASS: Unlimited points flow operational: ${totalAccumulated} pts accumulated across days`);

// 4. Verify Enhanced Badges Evaluation
console.log('\n--- 4. Enhanced 24-Tier Badges System ---');
assert.equal(ENHANCED_BADGES.length, 24, 'Exactly 24 enhanced badges defined');

// Test 3-day streak unlock
const streakBadges = calculateBadges(
  completedIds,
  totalAccumulated,
  ['upg-trees', 'upg-solar'],
  ENHANCED_BADGES,
  {
    dailyStreak: 3,
    districtStages: { academic: 2, society: 4, garden: 0, mall: 0, lake: 0 },
  }
);

const streak3Badge = streakBadges.badges.find(b => b.id === 'bdg-streak-3');
assert.equal(streak3Badge.isUnlocked, true, '3-Day streak badge unlocked');

const societyBadge = streakBadges.badges.find(b => b.id === 'bdg-phase-2');
assert.equal(societyBadge.isUnlocked, true, 'Society restoration trophy unlocked when society stage = 4');

const worldLegend = streakBadges.badges.find(b => b.id === 'bdg-world-legend');
assert.equal(worldLegend.isUnlocked, false, 'World legend locked until all 5 phases are completed');

// Test World Legend unlock
const allCompleteBadges = calculateBadges(
  completedIds,
  2000,
  ['upg-trees', 'upg-solar', 'upg-bio', 'upg-water'],
  ENHANCED_BADGES,
  {
    dailyStreak: 7,
    districtStages: { academic: 4, society: 4, garden: 4, mall: 4, lake: 4 },
  }
);

const finalWorldLegend = allCompleteBadges.badges.find(b => b.id === 'bdg-world-legend');
assert.equal(finalWorldLegend.isUnlocked, true, 'Planetary World Legend unlocks when all 5 phases reach Stage 4');

console.log('✅ PASS: Enhanced badges system evaluates streaks, phase completion trophies, and world legend');

// 5. Verify State Validation & Persistence with Daily Tracking
console.log('\n--- 5. Persistence & Schema Serialization ---');
const serialized = serializeGameState(completedIds, ['upg-trees'], { academic: 1, society: 2 }, 'society', 3, 4);
const validated = validateSavedGameState(serialized);

assert.equal(validated.valid, true, 'Serialized daily state validates successfully');
assert.equal(validated.dailyQuestsDayOffset, 3, 'dailyQuestsDayOffset preserved');
assert.equal(validated.dailyStreak, 4, 'dailyStreak preserved');
assert.equal(validated.activeDistrictId, 'society', 'activeDistrictId preserved');
assert.equal(validated.districtStages.society, 2, 'districtStages preserved');
console.log('✅ PASS: Daily tracking and district stages safely persist across reloads');

console.log('\n================================================================');
console.log('🎉 ALL ACCEPTANCE CHECKS PASSED PERFECTLY!');
console.log('================================================================');

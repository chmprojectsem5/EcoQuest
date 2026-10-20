import {
  QUESTS,
  CAMPUS_UPGRADES,
  QUEST_CATEGORIES,
  LEVELS,
  BADGES,
  INITIAL_LEADERBOARD,
} from '../src/data/gameData.js';
import {
  STORAGE_KEY,
  SCHEMA_VERSION,
  validateSavedGameState,
  serializeGameState,
  calculateLifetimePoints,
  calculateTotalUpgradeCost,
  calculateSpendablePoints,
  calculateRestorationStage,
  getNextUpgrade,
  canAffordNextUpgrade,
  getNextUpgradeShortfall,
  calculateLevelInfo,
  calculateBadges,
  calculateLeaderboard,
  processQuestCompletion,
  processUpgradePurchase,
} from '../src/context/GameContext.js';

console.log('================================================================');
console.log('  EcoQuest Next-Gen — Master Integration & Verification Tests   ');
console.log('================================================================\n');

let totalTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// In-memory AsyncStorage test double
function createMockStorage(initialEntries = {}) {
  const store = new Map(Object.entries(initialEntries));
  let readShouldFail = false;
  let writeShouldFail = false;
  let removeShouldFail = false;
  const log = [];

  return {
    getItem: async (key) => {
      log.push({ op: 'getItem', key });
      if (readShouldFail) throw new Error('Storage read failed');
      return store.get(key) ?? null;
    },
    setItem: async (key, val) => {
      log.push({ op: 'setItem', key, val });
      if (writeShouldFail) throw new Error('Storage write failed');
      store.set(key, String(val));
    },
    removeItem: async (key) => {
      log.push({ op: 'removeItem', key });
      if (removeShouldFail) throw new Error('Storage remove failed');
      store.delete(key);
    },
    setReadFail: (fail) => { readShouldFail = fail; },
    setWriteFail: (fail) => { writeShouldFail = fail; },
    setRemoveFail: (fail) => { removeShouldFail = fail; },
    dump: () => Object.fromEntries(store.entries()),
    getLog: () => [...log],
  };
}

// -----------------------------------------------------------------------------
// PART 1: Game Data & Economy Invariants
// -----------------------------------------------------------------------------
console.log('--- PART 1: Game Data & Economy Invariants ---');
assert(QUESTS.length >= 30, `At least 30 quests defined (actual: ${QUESTS.length})`);
assert(CAMPUS_UPGRADES.length === 4, 'Exactly 4 campus restoration upgrades defined');
assert(QUEST_CATEGORIES.length === 8, 'Exactly 8 quest categories defined');
assert(QUEST_CATEGORIES.includes('Energy'), 'Energy category included in filters');
assert(QUEST_CATEGORIES.includes('Biodiversity'), 'Biodiversity category included in filters');
assert(QUEST_CATEGORIES.includes('Digital'), 'Digital category included in filters');

const totalRewards = QUESTS.reduce((sum, q) => sum + q.points, 0);
assert(totalRewards === 980, `Total lifetime quest rewards sum to 980 (actual: ${totalRewards})`);

const totalCosts = CAMPUS_UPGRADES.reduce((sum, u) => sum + u.cost, 0);
assert(totalCosts === 870, `Total upgrade costs sum to 870 (actual: ${totalCosts})`);

const surplus = totalRewards - totalCosts;
assert(surplus === 110, `End-state spendable surplus is exactly 110 pts (actual: ${surplus})`);

// -----------------------------------------------------------------------------
// PART 2: Progression Invariants (Levels, Badges, Leaderboard)
// -----------------------------------------------------------------------------
console.log('\n--- PART 2: Progression Invariants ---');

// Level 1: 0-149, Level 2: 150-349, Level 3: 350-599, Level 4: 600-849, Level 5: 850-980
assert(calculateLevelInfo(0).level === 1, '0 pts -> Level 1: Eco Seedling');
assert(calculateLevelInfo(149).level === 1, '149 pts -> Level 1: Eco Seedling');
assert(calculateLevelInfo(150).level === 2, '150 pts -> Level 2: Green Scout');
assert(calculateLevelInfo(349).level === 2, '349 pts -> Level 2: Green Scout');
assert(calculateLevelInfo(350).level === 3, '350 pts -> Level 3: Earth Guardian');
assert(calculateLevelInfo(599).level === 3, '599 pts -> Level 3: Earth Guardian');
assert(calculateLevelInfo(600).level === 4, '600 pts -> Level 4: Ecosystem Architect');
assert(calculateLevelInfo(849).level === 4, '849 pts -> Level 4: Ecosystem Architect');
assert(calculateLevelInfo(850).level === 5, '850 pts -> Level 5: Apex Planet Champion');
assert(calculateLevelInfo(980).level === 5, '980 pts -> Level 5: Apex Planet Champion');
assert(calculateLevelInfo(980).isCompletedProgression === true, '980 pts -> isCompletedProgression=true');

// Badges at 0 pts
const initialBadges = calculateBadges([], 0);
assert(initialBadges.unlockedBadgeCount === 0, '0 pts -> 0 badges unlocked');

// Badges at max progression with all quests and upgrades
const allQuestIds = QUESTS.map((q) => q.id);
const allUpgradeIds = CAMPUS_UPGRADES.map((u) => u.id);
const finalBadges = calculateBadges(allQuestIds, 980, allUpgradeIds);
assert(finalBadges.unlockedBadgeCount === 16, `All 16 challenging badges unlocked at completion (actual: ${finalBadges.unlockedBadgeCount})`);

// Leaderboard at 0 pts vs 980 pts
const lb0 = calculateLeaderboard(0);
assert(lb0.userRank === 8, 'Initial state: User is Rank #8');
assert(lb0.leaderboard.length === 8, 'Leaderboard has exactly 8 participants');
assert(lb0.top3Podium.length === 3, 'Podium has exactly top 3');
assert(lb0.userEntry.name.includes('Eco-Guardians'), 'User persona is Eco-Guardians');

const lb980 = calculateLeaderboard(980);
assert(lb980.userRank === 1, '980 pts: User climbs to Rank #1 Gold Champion on campus');
assert(lb980.top3Podium[0].name.includes('Eco-Guardians'), 'Eco-Guardians takes #1 spot on podium');

// -----------------------------------------------------------------------------
// PART 3: Storage Schema, Serialization & Validation Hardening
// -----------------------------------------------------------------------------
console.log('\n--- PART 3: Storage Schema & Validation Hardening ---');

assert(STORAGE_KEY === 'ecoquest.gameState.v1', 'STORAGE_KEY is ecoquest.gameState.v1');
assert(SCHEMA_VERSION === 1, 'SCHEMA_VERSION is 1');

// Safe validation of corrupted or malicious payloads
assert(validateSavedGameState(null).valid === false, 'Null payload rejected');
assert(validateSavedGameState('{ bad json ').valid === false, 'Bad JSON rejected');
assert(validateSavedGameState('123').valid === false, 'Primitive payload rejected');
assert(validateSavedGameState('[]').valid === false, 'Array payload rejected');

// Unknown IDs, duplicates, and out-of-order upgrades
const sanitized = validateSavedGameState(
  JSON.stringify({
    version: 1,
    completedQuestIds: ['ch-energy-1', 'ch-energy-1', 'fake-quest', 'ch-waste-1'],
    purchasedUpgradeIds: ['upg-trees', 'upg-trees', 'upg-fake', 'upg-solar'],
  })
);
assert(sanitized.valid === true, 'Sanitized payload is valid');
assert(sanitized.completedQuestIds.length === 2, 'Deduplicated & unknown quest IDs stripped');
assert(sanitized.purchasedUpgradeIds.length === 2, 'Upgrades cleaned: Stage 1 and Stage 2 recognized');

// Non-sequential upgrade attempt (Stage 2 without Stage 1)
const skippedUpgrade = validateSavedGameState(
  JSON.stringify({
    version: 1,
    completedQuestIds: [],
    purchasedUpgradeIds: ['upg-solar'], // missing upg-trees
  })
);
assert(skippedUpgrade.purchasedUpgradeIds.length === 0, 'Non-sequential upgrade truncated to valid prefix');

// -----------------------------------------------------------------------------
// PART 4: State Machine Persistence & Race-Free Operation
// -----------------------------------------------------------------------------
console.log('\n--- PART 4: State Machine Lifecycle, Persistence & Demo Reset ---');

class IntegratedGameEngine {
  constructor(storage) {
    this.storage = storage;
    this.completedQuestIds = [];
    this.purchasedUpgradeIds = [];
    this.isHydrated = false;
    this.isResetting = false;
    this.saveChain = Promise.resolve();
  }

  async hydrate() {
    try {
      const raw = await this.storage.getItem(STORAGE_KEY);
      if (raw) {
        const validated = validateSavedGameState(raw);
        if (validated.valid) {
          this.completedQuestIds = validated.completedQuestIds;
          this.purchasedUpgradeIds = validated.purchasedUpgradeIds;
        }
      }
    } catch (e) {
      this.completedQuestIds = [];
      this.purchasedUpgradeIds = [];
    } finally {
      this.isHydrated = true;
    }
  }

  get lifetimePoints() { return calculateLifetimePoints(this.completedQuestIds); }
  get spendablePoints() { return calculateSpendablePoints(this.completedQuestIds, this.purchasedUpgradeIds); }
  get restorationStage() { return calculateRestorationStage(this.purchasedUpgradeIds); }
  get nextUpgrade() { return getNextUpgrade(this.restorationStage); }
  get levelInfo() { return calculateLevelInfo(this.lifetimePoints); }
  get badges() { return calculateBadges(this.completedQuestIds, this.lifetimePoints, this.purchasedUpgradeIds); }
  get leaderboard() { return calculateLeaderboard(this.lifetimePoints); }

  queuePersist(questIds, upgradeIds) {
    if (!this.isHydrated) return Promise.resolve(false);
    const serialized = serializeGameState(questIds, upgradeIds);
    this.saveChain = this.saveChain
      .catch(() => {})
      .then(async () => {
        try {
          await this.storage.setItem(STORAGE_KEY, serialized);
          return true;
        } catch (e) {
          return false;
        }
      });
    return this.saveChain;
  }

  completeQuest(questId) {
    if (!this.isHydrated || this.isResetting) return { success: false, reason: 'not_ready' };
    const res = processQuestCompletion(questId, this.completedQuestIds);
    if (res.success) {
      this.completedQuestIds = res.nextCompletedQuestIds;
      this.queuePersist(this.completedQuestIds, this.purchasedUpgradeIds);
    }
    return res;
  }

  purchaseNextUpgrade() {
    if (!this.isHydrated || this.isResetting) return { success: false, reason: 'not_ready' };
    const res = processUpgradePurchase(this.purchasedUpgradeIds, this.spendablePoints);
    if (res.success) {
      this.purchasedUpgradeIds = res.nextPurchasedUpgradeIds;
      this.queuePersist(this.completedQuestIds, this.purchasedUpgradeIds);
    }
    return res;
  }

  async resetDemo() {
    if (!this.isHydrated || this.isResetting) return { success: false, reason: 'in_progress_or_not_ready' };
    this.isResetting = true;
    try {
      await this.saveChain.catch(() => {});
      await this.storage.removeItem(STORAGE_KEY);
      this.completedQuestIds = [];
      this.purchasedUpgradeIds = [];
      this.isResetting = false;
      return { success: true };
    } catch (e) {
      this.isResetting = false;
      return { success: false, error: e.message };
    }
  }
}

async function runMasterLifecycle() {
  const store = createMockStorage({ 'app.theme': 'emerald' });
  const engine1 = new IntegratedGameEngine(store);

  // Mutation before hydration blocked
  assert(engine1.completeQuest('ch-energy-1').success === false, 'Action before hydration blocked');

  // Hydrate empty store
  await engine1.hydrate();
  assert(engine1.isHydrated === true, 'Hydration resolved');
  assert(engine1.lifetimePoints === 0, 'Hydrated baseline: 0 lifetime pts');
  assert(engine1.spendablePoints === 0, 'Hydrated baseline: 0 spendable pts');
  assert(engine1.restorationStage === 0, 'Hydrated baseline: Stage 0');

  // Step 1: Complete 3 quests to afford Stage 1 (ch-waste-4 +50, ch-bio-2 +50, ch-transit-1 +45 = 145 pts)
  const q1 = engine1.completeQuest('ch-waste-4');
  const q2 = engine1.completeQuest('ch-bio-2');
  const q3 = engine1.completeQuest('ch-transit-1');
  assert(q1.success && q2.success && q3.success, 'Completed initial high-impact quests');
  assert(engine1.lifetimePoints === 145, 'Lifetime points = 145');
  assert(engine1.spendablePoints === 145, 'Spendable points = 145');
  await engine1.saveChain;

  // Step 2: Buy Quad Clean-up & Native Arboretum (cost 120 pts)
  const u1 = engine1.purchaseNextUpgrade();
  assert(u1.success === true && u1.upgrade.id === 'upg-trees', 'Purchased upg-trees');
  await engine1.saveChain;

  assert(engine1.restorationStage === 1, 'Stage is 1');
  assert(engine1.lifetimePoints === 145, 'Lifetime points remain 145');
  assert(engine1.spendablePoints === 25, 'Spendable points deducted to 25 (145 - 120)');

  // Step 3: Reload from storage (Session 2)
  const engine2 = new IntegratedGameEngine(store);
  await engine2.hydrate();
  assert(engine2.completedQuestIds.includes('ch-waste-4'), 'Reload: ch-waste-4 restored');
  assert(engine2.purchasedUpgradeIds.includes('upg-trees'), 'Reload: upg-trees restored');
  assert(engine2.restorationStage === 1, 'Reload: Stage 1 restored');
  assert(engine2.lifetimePoints === 145, 'Reload: Lifetime points = 145');
  assert(engine2.spendablePoints === 25, 'Reload: Spendable points = 25');

  // Step 4: Duplicate completion blocked
  assert(engine2.completeQuest('ch-waste-4').success === false, 'Duplicate completion blocked after reload');

  // Step 5: Insufficient funds upgrade blocked (Stage 2 costs 200 pts, user has 25 pts)
  assert(engine2.purchaseNextUpgrade().success === false, 'Insufficient funds upgrade blocked');

  // Step 6: Complete all remaining quests (32 - 3 = 29 quests)
  for (const q of QUESTS) {
    if (!engine2.completedQuestIds.includes(q.id)) {
      assert(engine2.completeQuest(q.id).success === true, `Completed ${q.id}`);
    }
  }
  await engine2.saveChain;
  assert(engine2.lifetimePoints === 980, 'All 32 quests -> exactly 980 lifetime pts');

  // Step 7: Purchase all remaining 3 upgrades
  assert(engine2.purchaseNextUpgrade().upgrade.id === 'upg-solar', 'Stage 2 (Solar Microgrid) purchased');
  assert(engine2.purchaseNextUpgrade().upgrade.id === 'upg-biodiversity', 'Stage 3 (Botanical Haven) purchased');
  assert(engine2.purchaseNextUpgrade().upgrade.id === 'upg-sanctuary', 'Stage 4 (Aqua-Sanctuary) purchased');
  await engine2.saveChain;

  assert(engine2.restorationStage === 4, 'Campus is Stage 4: Sanctuary');
  assert(engine2.spendablePoints === 110, 'Final spendable surplus = 110 pts (980 - 870)');
  assert(engine2.purchaseNextUpgrade().success === false, 'Stage 4: No further upgrades available');
  assert(engine2.levelInfo.level === 5, 'Final Level = 5: Apex Planet Champion');
  assert(engine2.badges.unlockedBadgeCount === 16, 'Final Badges = 16/16 unlocked');
  assert(engine2.leaderboard.userRank === 1, 'Final Leaderboard Rank = #1 Champion');

  // Step 8: Cold Restart (Session 3)
  const engine3 = new IntegratedGameEngine(store);
  await engine3.hydrate();
  assert(engine3.lifetimePoints === 980, 'Cold restart: 980 lifetime pts reconstructed');
  assert(engine3.spendablePoints === 110, 'Cold restart: 110 spendable pts reconstructed');
  assert(engine3.restorationStage === 4, 'Cold restart: Stage 4 reconstructed');
  assert(engine3.badges.unlockedBadgeCount === 16, 'Cold restart: All 16 badges unlocked');
  assert(engine3.leaderboard.userRank === 1, 'Cold restart: Rank #1 reconstructed');

  // Step 9: Confirmed Demo Reset
  const resetRes = await engine3.resetDemo();
  assert(resetRes.success === true, 'resetDemo returned success: true');
  assert(engine3.lifetimePoints === 0, 'Post-reset: 0 lifetime pts');
  assert(engine3.spendablePoints === 0, 'Post-reset: 0 spendable pts');
  assert(engine3.restorationStage === 0, 'Post-reset: Stage 0');
  assert(engine3.levelInfo.level === 1, 'Post-reset: Level 1 Eco Seedling');
  assert(engine3.badges.unlockedBadgeCount === 0, 'Post-reset: 0 badges unlocked');
  assert(engine3.leaderboard.userRank === 8, 'Post-reset: Rank #8 on leaderboard');

  // Check storage: EcoQuest key removed, unrelated key preserved
  assert((await store.getItem(STORAGE_KEY)) === null, 'STORAGE_KEY removed from store');
  assert((await store.getItem('app.theme')) === 'emerald', 'Unrelated keys preserved');
}

await runMasterLifecycle();

console.log('\n================================================================');
console.log(`  AUDIT SUMMARY: ${totalTests - failedTests}/${totalTests} TESTS PASSED`);
if (failedTests === 0) {
  console.log('🎉 ALL INTEGRATION & HARDENING CHECKS PASSED (0 FAILURES)!');
} else {
  console.error(`💥 ${failedTests} CHECKS FAILED!`);
}
console.log('================================================================\n');

process.exit(failedTests > 0 ? 1 : 0);

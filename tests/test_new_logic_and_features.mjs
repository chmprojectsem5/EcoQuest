import assert from 'node:assert/strict';
import {
  calculateEcoImpact,
  calculateSpendablePoints,
  calculateLifetimePoints,
  validateSavedGameState,
  serializeGameState,
} from '../src/context/GameContext.js';
import { ALL_QUESTS, DISTRICTS } from '../src/data/gameData.js';

console.log('================================================================');
console.log('   EcoQuest — Living World, Impact Hub & New Logic Tests        ');
console.log('================================================================\n');

// 1. Eco Impact Calculation
console.log('--- 1. Real-World Environmental Impact Engine ---');
const baselineImpact = calculateEcoImpact([], {}, []);
assert.ok(baselineImpact, 'Baseline impact should return an object');
assert.equal(baselineImpact.co2Kg, 0, 'Baseline CO2 should be 0');
assert.equal(baselineImpact.campusVitalityPercent, 0, 'Baseline vitality should be 0%');

// Test with completed quests
const sampleQuests = ['ch-energy-1', 'ch-energy-5', 'ch-waste-1', 'ch-water-1'];
const sampleStages = { academic: 2, society: 1, garden: 0, mall: 0, lake: 0 };
const impact = calculateEcoImpact(sampleQuests, sampleStages, ['upg-cleanup', 'upg-solar']);

assert.ok(impact.co2Kg > 0, 'CO2 should be strictly greater than 0');
assert.ok(impact.waterLiters > 0, 'Water liters saved should be positive');
assert.ok(impact.cleanEnergyKwh > 0, 'Clean energy should be positive');
assert.ok(impact.campusVitalityPercent > 0, 'Vitality percent should be positive');
assert.ok(impact.treesSeeded >= 0, 'Trees equivalent should be valid');
console.log(`✅ PASS: Impact calculated: ${impact.co2Kg} kg CO2e, ${impact.waterLiters}L water, ${impact.cleanEnergyKwh} kWh clean energy, ${impact.campusVitalityPercent}% vitality`);

// 2. Storage Schema Backward Compatibility
console.log('\n--- 2. Storage Schema Backward & Forward Compatibility ---');
const oldSerialized = JSON.stringify({
  version: 1,
  completedQuestIds: ['ch-energy-1'],
  purchasedUpgradeIds: ['upg-cleanup'],
  districtStages: { academic: 1 },
  activeDistrictId: 'academic',
  dailyQuestsDayOffset: 0,
  dailyStreak: 3,
});

const validated = validateSavedGameState(oldSerialized);
assert.equal(validated.valid, true, 'Old state without new fields must validate cleanly');
assert.equal(validated.dailyStreak, 3);
assert.equal(typeof validated.lastDailyDropDayOffset, 'number', 'Defaults lastDailyDropDayOffset to number');
assert.ok(Array.isArray(validated.collectedSparkIds), 'Defaults collectedSparkIds to array');
console.log('✅ PASS: Backward compatibility preserved with seamless defaults');

// 3. Serializer includes new fields
const newSerialized = serializeGameState(
  ['ch-energy-1'],
  ['upg-cleanup'],
  { academic: 1 },
  'academic',
  2,
  4,
  1, // lastDailyDropDayOffset
  ['spark-academic-1'] // collectedSparkIds
);

const revalidated = validateSavedGameState(newSerialized);
assert.equal(revalidated.valid, true);
assert.equal(revalidated.lastDailyDropDayOffset, 1);
assert.deepEqual(revalidated.collectedSparkIds, ['spark-academic-1']);
console.log('✅ PASS: Serializer and validator roundtrip with new daily drop & map spark fields');

console.log('\n================================================================');
console.log('🎉 ALL NEW LOGIC SPECIFICATION TESTS PASSED!');
console.log('================================================================\n');

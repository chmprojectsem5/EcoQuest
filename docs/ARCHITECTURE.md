# EcoQuest — System Architecture & Technical Specifications 🏗️

> **Technical Documentation for Community Engagement Project (CEP) Evaluation**  
> Technology: **React Native (Expo SDK 57)** with **React 19.2.3** & **AsyncStorage 2.2.0**

---

## 🏛️ Architectural Overview

EcoQuest is an offline-first, client-rendered mobile application built with React Native and Expo. It implements a **unidirectional data flow architecture** centered around a single source of truth: [`GameProvider`](file:///A:/cep_app/ecoquest-demo/src/context/GameContext.js).

Rather than storing denormalized or redundant computed values (such as current score, stage number, level rank, or badge status), the application persists **only the primary ground-truth records** (`completedQuestIds` and `purchasedUpgradeIds`). All user statistics, campus restoration stages, badge unlock statuses, and leaderboard standings are dynamically calculated on the fly through pure selector functions.

```mermaid
graph TD
    subgraph Storage ["Local Storage Layer (AsyncStorage)"]
        SK["Key: 'ecoquest.gameState.v1'"]
        JSON["JSON: { version: 1, completedQuestIds, purchasedUpgradeIds }"]
        SK --- JSON
    end

    subgraph StateCore ["Central State (GameContext)"]
        H["Hydration Controller (useEffect)"]
        WQ["Ordered Persistence Queue (saveChainRef)"]
        QRef["Atomic Refs (completedQuestIdsRef, purchasedUpgradeIdsRef)"]
        
        StateQuests["State: completedQuestIds"]
        StateUpgrades["State: purchasedUpgradeIds"]
    end

    subgraph Selectors ["Pure Derivation Engine"]
        calcLifetime["calculateLifetimePoints()"]
        calcSpendable["calculateSpendablePoints()"]
        calcStage["calculateRestorationStage()"]
        calcLevel["calculateLevelInfo()"]
        calcBadges["calculateBadges()"]
        calcLeaderboard["calculateLeaderboard()"]
    end

    subgraph Screens ["UI Presentation Layer"]
        Home["HomeScreen (CampusScene + Upgrades)"]
        Quests["QuestsScreen (8 Quests + Categories)"]
        Rank["RankScreen (Leaderboard + Podium)"]
        Badges["BadgesScreen (8 Trophy Cards)"]
        Profile["ProfileScreen (Stats + Reset Demo)"]
    end

    JSON -.->|Hydrate on Startup| H
    H -->|Set Initial IDs| StateQuests
    H -->|Set Initial IDs| StateUpgrades
    
    StateQuests --> Selectors
    StateUpgrades --> Selectors
    
    Selectors -->|useGame() Hook| Screens
    
    Screens -->|completeQuest()| StateQuests
    Screens -->|purchaseNextUpgrade()| StateUpgrades
    Screens -->|resetDemo()| H
    
    StateQuests -->|queuePersist()| WQ
    StateUpgrades -->|queuePersist()| WQ
    WQ -.->|Atomic JSON Write| JSON
```

---

## 🧩 Component & Navigation Hierarchy

The application component tree is organized into a clean provider-consumer model:

```
App (App.js)
├── SafeAreaProvider (react-native-safe-area-context)
│   └── GameProvider (src/context/GameContext.js)
│       └── AppContent (App.js)
│           ├── [if !isHydrated] Loading Splash Card (ActivityIndicator + "Restoring...")
│           └── [if isHydrated] SafeAreaView
│               ├── StatusBar (expo-status-bar)
│               ├── Active Screen Content (view rendered based on activeTab state)
│               │   ├── HomeScreen (src/screens/HomeScreen.js)
│               │   │   └── CampusScene (src/components/CampusScene.js)
│               │   ├── QuestsScreen (src/screens/QuestsScreen.js)
│               │   ├── RankScreen (src/screens/RankScreen.js)
│               │   ├── BadgesScreen (src/screens/BadgesScreen.js)
│               │   └── ProfileScreen (src/screens/ProfileScreen.js)
│               └── BottomNavBar (src/components/BottomNavBar.js)
```

### Navigation Architecture
Navigation is handled client-side using state-driven tab switching (`activeTab: 'home' | 'quests' | 'rank' | 'badges' | 'profile'`). This lightweight, dependency-free pattern avoids heavy native navigation overhead while preserving instantaneous screen transitions and complete shared state access across tabs.

### Safe Area & System Insets
* **Top & Sides:** Handled by `<SafeAreaView edges={['top', 'left', 'right']}>` in `App.js`.
* **Bottom Inset:** Handled dynamically inside `BottomNavBar.js` using `useSafeAreaInsets()`. A calculated `safeBottomPadding` ensures the 5-tab buttons clear Android 3-button navigation bars (48dp), gesture pills, and system controls across all phone aspect ratios without duplicate padding.

---

## 📊 Ground Truth vs. Derived State Selectors

To prevent state drift, calculation duplication, or synchronization bugs, data responsibilities are strictly split:

### 1. Primary Ground-Truth Records (Stored in Memory & Disk)
* `completedQuestIds` (`string[]`): Set of quest identifiers that have been completed once (e.g., `['ch-1', 'ch-2']`).
* `purchasedUpgradeIds` (`string[]`): Set of campus restoration identifiers that have been purchased sequentially (e.g., `['upg-trees', 'upg-solar']`).
* `STORAGE_KEY` (`'ecoquest.gameState.v1'`): Versioned persistence key.

### 2. Derived Selectors (Calculated Purely in `GameContext`)

| Derived Property | Calculation Function | Rule & Behavior |
|---|---|---|
| `lifetimePoints` | `calculateLifetimePoints()` | Sum of point values from `QUESTS` for all IDs in `completedQuestIds`. **Never decreases** upon purchasing upgrades. Maximum: 210 pts. |
| `totalUpgradeCost` | `calculateTotalUpgradeCost()` | Sum of upgrade costs from `CAMPUS_UPGRADES` for all IDs in `purchasedUpgradeIds`. Maximum: 180 pts. |
| `spendablePoints` | `calculateSpendablePoints()` | `Math.max(0, lifetimePoints - totalUpgradeCost)`. Deducted when purchasing campus upgrades. Remaining surplus at Stage 4: 30 pts. |
| `restorationStage` | `calculateRestorationStage()` | Count of purchased upgrades clamped between 0 and 4. |
| `nextUpgrade` | `getNextUpgrade()` | Returns `CAMPUS_UPGRADES[restorationStage]` or `null` if Stage 4. |
| `canAffordNextUpgrade` | `canAffordNextUpgrade()` | `spendablePoints >= nextUpgrade.cost`. |
| `nextUpgradeShortfall` | `getNextUpgradeShortfall()` | `Math.max(0, nextUpgrade.cost - spendablePoints)`. |
| `levelInfo` | `calculateLevelInfo()` | Evaluates player level (1 to 4), percentage progress bar fill, and points to next threshold based solely on `lifetimePoints`. |
| `badges` | `calculateBadges()` | Evaluates lock/unlock state and progress string for all 8 badges using `completedQuestIds` and `lifetimePoints`. |
| `leaderboard` | `calculateLeaderboard()` | Clones `INITIAL_LEADERBOARD`, updates user's score to `lifetimePoints`, sorts descending by points with deterministic seniority tie-breaking, and returns updated ranks and Top-3 podium. |

---

## 💾 Persistence, Hydration & Race-Condition Hardening

Local persistence is managed by `@react-native-async-storage/async-storage` through a hardened lifecycle:

### 1. Hydration Phase (`useEffect` on Mount)
```javascript
// Step 1: Read raw record from storage
const raw = await storage.getItem('ecoquest.gameState.v1');

// Step 2: Validate & sanitize data
const validated = validateSavedGameState(raw);

// Step 3: Hydrate valid state & mark ready
if (validated.valid) {
  completedQuestIdsRef.current = validated.completedQuestIds;
  purchasedUpgradeIdsRef.current = validated.purchasedUpgradeIds;
  setCompletedQuestIds(validated.completedQuestIds);
  setPurchasedUpgradeIds(validated.purchasedUpgradeIds);
}
setIsHydrated(true);
```
* **Malformed Data Protection:** Corrupt JSON, non-object payloads, or unreadable keys are safely caught without throwing. The app logs a warning and falls back to a clean initial demo session.
* **ID Filtering:** Unknown quest IDs (e.g. from deprecated builds or injected data) are dropped. Duplicate entries are deduplicated.
* **Sequential Integrity:** Stored upgrade IDs are validated against `CAMPUS_UPGRADES` in strict order (0, 1, 2, 3); any out-of-order upgrade is truncated to prevent skipping stages.
* **Never Stuck Loading:** The `finally` block always executes `setIsHydrated(true)`, ensuring that storage read errors never trap the user on a perpetual loading screen.

### 2. Write Ordering & Atomic State Synchronization
In React, asynchronous state batching (`setState`) can introduce closure lag during rapid consecutive user actions. To eliminate race conditions:
1. **Synchronous Ground-Truth Refs:** `completedQuestIdsRef` and `purchasedUpgradeIdsRef` are updated **synchronously** the instant an action succeeds, providing immediate ground truth for calculations in the same event tick.
2. **Sequential Write Queue (`saveChainRef`):** `queuePersist` chains all disk operations onto an internal promise mutex (`saveChainRef.current = saveChainRef.current.then(...)`). This guarantees that disk write $N$ always settles before write $N+1$, preventing an earlier, slower write from overwriting newer state.
3. **Pre-Hydration Mutation Guards:** Actions (`completeQuest`, `purchaseNextUpgrade`, `resetDemo`) strictly reject execution if `!isHydrated || isResetting`.

### 3. Demo Reset Pipeline (`resetDemo`)
```javascript
const resetDemo = async () => {
  setIsResetting(true);
  try {
    // 1. Wait for any pending saves to finish
    await saveChainRef.current.catch(() => {});
    
    // 2. Remove ONLY the EcoQuest key
    await storage.removeItem('ecoquest.gameState.v1');
    
    // 3. Clear in-memory ground-truth records
    completedQuestIdsRef.current = [];
    purchasedUpgradeIdsRef.current = [];
    setCompletedQuestIds([]);
    setPurchasedUpgradeIds([]);
    
    return { success: true };
  } finally {
    setIsResetting(false);
  }
};
```
* Unrelated storage keys (e.g., third-party tokens or other app settings) are preserved.
* The Reset Demo action on the Profile screen uses `Alert.alert` to require explicit two-step user confirmation.

---

## 🎨 Illustrated Campus Scene Rendering (`CampusScene.js`)

The centerpiece of EcoQuest is the **Campus Restoration Scene**. Instead of relying on heavy raster image downloads or complex third-party SVG parsers, it is built entirely using **native React Native components (`View`, `Text`) and CSS positioning**.

### Visual Transformation Matrix
| Stage | Visual Elements Rendered | Ground Color | Sky Color |
|:---:|:---|:---:|:---:|
| **0** | Dry quad lawn, beige pathways, academic hall building without solar, dorm block without compost. | `#E7DFD5` (Dry Tan) | `#F1F5F9` (Muted Grey) |
| **1** | Native shade trees appear, wildflower clusters bloom, grass becomes lush green. | `#D1FAE5` (Lush Mint) | `#E0F2FE` (Sky Blue) |
| **2** | Stage 1 trees remain + academic hall roof transforms with photovoltaic blue solar canopy. | `#A7F3D0` (Emerald) | `#E0F7FA` (Cyan Sky) |
| **3** | Stages 1 & 2 remain + smart compost pods and segregated recycling stations appear along pathways. | `#6EE7B7` (Rich Green) | `#E6FFFA` (Teal Sky) |
| **4** | Stages 1, 2, 3 remain + central chilled water refill station & fountain basin activates in the quad. | `#34D399` (Deep Oasis) | `#D1FAE5` (Sunlit Green) |

* **Clamping Safety:** `CampusScene` explicitly validates and clamps any passed `restorationStage` prop to an integer between 0 and 4:
  ```javascript
  const numericStage = Number(restorationStage);
  const stage = Number.isFinite(numericStage)
    ? Math.max(0, Math.min(4, Math.floor(numericStage)))
    : 0;
  ```

---

## 🧪 Verification & Testing Strategy

EcoQuest includes automated test suites executable with standard Node.js without requiring external test runners:

* **Economy & Invariants:** [`tests/test_integration.mjs`](file:///A:/cep_app/ecoquest-demo/tests/test_integration.mjs) validates that:
  * 8 quests sum to exactly 210 points.
  * 4 upgrades sum to exactly 180 points.
  * 30 points surplus remains.
  * Upgrades cannot be purchased out of order or with insufficient funds.
  * Duplicate quest completions are rejected.
  * Level 1–4 thresholds and all 8 badge rules trigger correctly.
  * Storage serialization excludes redundant calculated properties.
  * State reconstructs identically across simulated cold app restarts.
  * Confirmed reset completely clears stored keys and resets all 5 screens to baseline.

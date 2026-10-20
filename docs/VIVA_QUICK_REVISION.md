# EcoQuest — Quick Revision Sheet (Viva Cheat Sheet) ⚡

> **B.Sc. Computer Science Community Engagement Project (CEP)**  
> **Student:** Aditya Deonarayan Jha | **College:** Smt. CHM College, Ulhasnagar-3  
> **Academic Year:** 2026–2027 | **Guide:** `[Guide Name]` | **Roll No:** `[Roll Number]`  
> *Keep this sheet for 5-minute rapid review immediately before entering the viva room.*

---

## 1. Project Introduction (30-Second Elevator Pitch)
* **Title:** EcoQuest — Campus Restoration Game (Theme: Gamified App for Sustainability).
* **Core Problem:** Campus sustainability guidelines (saving energy, segregating waste, saving water) suffer from passive awareness and low engagement because individual effort feels invisible ("drop in the ocean").
* **Solution:** A mobile app that gamifies eco-habits. Students complete daily micro-quests to earn **Lifetime Points** (for levels and rank) and build **Spendable Funds** to restore a virtual campus quad through four sequential physical upgrades.
* **Key Innovation:** Two-tier economy where spending points to upgrade the campus never lowers player level or leaderboard standing.

---

## 2. Technology Stack At a Glance
* **Framework:** Expo SDK `~57.0.30` (Managed workflow).
* **Mobile Runtime:** React Native `0.86.3` (targeting Android phones via Expo Go).
* **Core Library:** React `19.2.3` (Functional components & hooks: `useState`, `useEffect`, `useRef`, `useContext`).
* **State Management:** React Context (`GameContext.js`) with custom `useGame()` hook.
* **Local Persistence:** `@react-native-async-storage/async-storage` (`2.2.0`) under key `'ecoquest.gameState.v1'`.
* **Safe Area Handling:** `react-native-safe-area-context` (`~5.7.0`) for Android 3-button and gesture navigation clearance.
* **Testing:** Custom automated integration suite (`tests/test_integration.mjs`) with **83/83 tests passing (100%)**.

---

## 3. The Five UI Navigation Tabs
1. 🏠 **Home:** Features illustrated `CampusScene` (Stages 0–4), level progress card, points stats, and sequential upgrade action card.
2. 🎯 **Quests:** 8 sustainability challenges across 5 categories with category filters (All, Energy, Waste, Water, Transport, Food) and instant completion buttons.
3. 🏆 **Rank:** Dynamic 8-participant campus leaderboard (7 fictional peers + user) with live rank calculation and Top-3 podium (🥇 Maya, 🥈 Aarav, 🥉 Priya).
4. 🎖️ **Badges:** 8 achievement trophies with live unlock counters (4 milestone badges + 4 category-specific badges).
5. 👤 **Profile:** Demonstrator identity card, cumulative performance summary, and a two-step confirmation **Reset Demo Data** button.

---

## 4. Eight Quests & Four Campus Upgrades

### 8 Quests Catalog (Total Available = 210 Lifetime Points)
| ID | Quest Title | Category | Pts | Key Description |
|:---:|:---|:---:|:---:|:---|
| `ch-1` | Reusable Water Bottle | Waste ♻️ | **30** | Carry a refillable bottle to class. |
| `ch-2` | Lights & Fans Off | Energy ⚡ | **20** | Switch off lights/fans in empty rooms. |
| `ch-3` | Green Commute | Transport 🚲 | **40** | Walk, cycle, or take campus shuttle. |
| `ch-4` | Plant-Based Meal | Food 🥗 | **25** | Eat vegetarian lunch at cafeteria. |
| `ch-5` | Segregate Campus Waste | Waste ♻️ | **35** | Separate wet and dry waste into bins. |
| `ch-6` | 5-Minute Shower | Water 💧 | **25** | Limit dorm shower time to < 5 min. |
| `ch-7` | Unplug Idle Chargers | Energy ⚡ | **15** | Eliminate phantom power drain. |
| `ch-8` | Bring a Tote Bag | Waste ♻️ | **20** | Use cloth bag for campus bookstore. |

### 4 Sequential Campus Upgrades (Total Cost = 180 Points)
* **Stage 1 — Native Shade Trees (30 pts):** Restores lawn grass and biodiversity in central quad.
* **Stage 2 — Rooftop Solar Array (40 pts):** Photovoltaic solar panels on Academic Hall roof.
* **Stage 3 — Smart Compost Hubs (50 pts):** Color-coded compost pods along campus walkways.
* **Stage 4 — Pure Water Cistern (60 pts):** Chilled water refill fountain in campus plaza.

---

## 5. Key Point Totals & Mathematical Invariants
$$\text{Total Available Quest Points} = 30 + 20 + 40 + 25 + 35 + 25 + 15 + 20 = \mathbf{210\text{ pts}}$$
$$\text{Total Upgrade Costs} = 30 + 40 + 50 + 60 = \mathbf{180\text{ pts}}$$
$$\text{Final Spendable Surplus} = 210 - 180 = \mathbf{30\text{ pts remaining}}$$

* **Invariant 1:** $\text{Lifetime Points} \ge \text{Spendable Points}$ at all times.
* **Invariant 2:** Lifetime Points **never decreases**; it strictly sums completed quest rewards.
* **Invariant 3:** Spendable Points = $\max(0,\, \text{Lifetime} - \text{Total Spent})$. It never falls below 0.
* **Invariant 4:** Upgrades strictly require sequential purchase (Stage 1 $\rightarrow$ 2 $\rightarrow$ 3 $\rightarrow$ 4).

---

## 6. Level & Badge Thresholds

### Player Levels (Derived strictly from Lifetime Points)
* **Level 1: Eco Seedling** (0–49 pts)
* **Level 2: Green Scout** (50–99 pts) — *Promoted at 50 pts*
* **Level 3: Earth Guardian** (100–169 pts) — *Promoted at 100 pts*
* **Level 4: Planet Champion** (170–210 pts) — *Promoted at 170 pts; Max completion at 210 pts*

### Achievement Badges (8 Trophies)
* `bdg-first` (**Eco Starter** 🌱): Complete 1 quest.
* `bdg-100` (**Green Sprout** 🌿): Reach 100 Lifetime Points.
* `bdg-160` (**Earth Guardian** 🛡️): Reach 160 Lifetime Points *(distinct from Level 4 at 170 pts)*.
* `bdg-200` (**Planet Hero** 🌎): Reach 200 Lifetime Points.
* `bdg-waste` (**Zero-Waste Pioneer** ♻️): Complete any 2 Waste quests (`ch-1`, `ch-5`, `ch-8`).
* `bdg-energy` (**Watts Saver** ⚡): Complete both Energy quests (`ch-2` AND `ch-7`).
* `bdg-commute` (**Clean Cruiser** 🚲): Complete Transit quest (`ch-3`).
* `bdg-water` (**Hydro Guardian** 💧): Complete Water quest (`ch-6`).

---

## 7. State Management & Storage Architecture
* **Single Source of Truth:** We persist **only primary ground-truth records**: `completedQuestIds` and `purchasedUpgradeIds`.
* **Pure Selectors:** Lifetime points, spendable balance, stage, level info, badges, and leaderboard are computed dynamically on the fly via pure selector functions.
* **AsyncStorage Hydration:** On startup, `hydrate()` parses and validates JSON under `'ecoquest.gameState.v1'`. A loading card with `ActivityIndicator` displays until hydration finishes.
* **Race-Condition Protection:** Writes are queued sequentially through `saveChainRef` (Promise chain write mutex) alongside synchronous React `useRef` trackers.
* **Two-Step Demo Reset:** `resetDemo()` clears AsyncStorage key, empties arrays, and instantly resets app to Stage 0, Level 1, 0 points, and Rank #8.

---

## 8. Five Explicit Project Limitations (Memorize These!)
1. **Self-Reported Actions:** Quests are completed via simulated button clicks; no IoT sensors, cameras, or GPS geofencing verify real-world behavior.
2. **Simulated Leaderboard:** Competitor peers (Maya, Aarav, Priya, etc.) are fixed benchmark profiles to test dynamic sorting offline without needing cloud servers.
3. **Local-Only Storage:** Progress is stored on the physical device via AsyncStorage; no multi-device account sync or cloud database.
4. **Pedagogical Impact Figures:** Carbon, water, and waste reduction figures are educational demonstration benchmarks, not certified lab measurements.
5. **Demonstration Scope:** Developed as an academic prototype for college CEP evaluation rather than a commercial app store release.

---

## 9. Top 10 Questions Most Likely to be Asked in Viva

### 1. What is the difference between Lifetime Points and Spendable Points?
**Answer:** Lifetime Points is the cumulative total of all points earned; it never decreases and determines level, badges, and rank. Spendable Points is available currency deducted when funding campus upgrades.

### 2. If a student spends points on a campus upgrade, do they lose their level or drop on the leaderboard?
**Answer:** No. Player level and leaderboard rank are derived strictly from Lifetime Points, completely isolated from Spendable Points.

### 3. How does the dynamic leaderboard handle equal scores (tie-breaking)?
**Answer:** Deterministic tie-breaking uses original roster seniority (`initialIndex`). At 210 points, the user ties with Priya Nair (210 pts). Because Priya was registered earlier at index 2 vs. the user's index 7, Priya keeps Rank #3 (Bronze podium) and the user takes Rank #4.

### 4. What happens if the phone loses internet connection during the demo?
**Answer:** EcoQuest runs 100% offline. It has zero cloud dependencies and saves everything locally via AsyncStorage, so it works perfectly without internet.

### 5. Why did you not use a backend database like Firebase or MySQL?
**Answer:** For an offline college demonstration, a backend introduces network failure points, hosting costs, and latency. AsyncStorage provides instant, robust client-side persistence without external failure risks.

### 6. What prevents someone from clicking a quest multiple times?
**Answer:** Three layers of protection: UI buttons disable with a checkmark, `processQuestCompletion()` checks `completedQuestIds.includes(questId)` and rejects duplicates, and synchronous `useRef` checks block rapid double-tapping.

### 7. What happens if corrupt data is found in AsyncStorage?
**Answer:** `validateSavedGameState()` wraps parsing in a `try...catch` block. If corrupt, it discards the bad data and safely initializes a fresh, clean demo session without crashing.

### 8. Why is the Earth Guardian badge at 160 points while Level 4 is at 170 points?
**Answer:** Level 3 spans 100 to 169 points (titled "Earth Guardian"). The Earth Guardian badge is an advanced milestone trophy awarded at 160 points to reward deep dedication right before breaking into Level 4 (Planet Champion at 170 points).

### 9. What would be your first step to turn this into a live college-wide system?
**Answer:** Introduce college email authentication (SSO) and connect `GameContext.js` to a secure backend REST API with PostgreSQL to synchronize student progress to the cloud.

### 10. How did you verify that all these calculations and game rules work correctly?
**Answer:** We wrote an automated integration test suite in `tests/test_integration.mjs` containing 83 assertions covering economy balance, levels, badges, leaderboard, persistence, and reset. All 83 tests pass with 100% success rate.

---

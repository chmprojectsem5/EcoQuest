# EcoQuest — Campus Restoration Game
## Community Engagement Project (CEP) Report

---

### Project Information & Submission Details

* **Project Title:** EcoQuest — Campus Restoration Game
* **Project Type:** Community Engagement Project (CEP)
* **Project Theme:** Gamified App for Sustainability
* **Application Platform:** Android Mobile Application (React Native / Expo SDK 57)
* **Student Name:** Aditya Deonarayan Jha
* **Roll / Registration Number:** `[Insert Roll / Registration Number]`
* **Academic Program / Branch:** B.Sc. Computer Science (Third Year, Semester V)
* **Course Title & Code:** `[Insert Official Course Title & Code — e.g., Community Engagement Project]`
* **Department:** Department of Computer Science
* **Institution / College:** SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE (CHM), Ulhasnagar-3
* **Academic Year:** 2026–2027
* **Faculty Guide / Mentor:** `[Insert Faculty Mentor Name & Designation]`
* **Date of Submission:** `[Insert Submission Date]`

---

## Abstract

On university and college campuses, sustainability initiatives such as energy conservation, waste segregation, water stewardship, and low-carbon commuting are frequently communicated through passive notices, static signage, or administrative guidelines. While students recognize the importance of environmental conservation, the absence of immediate positive feedback, measurable individual progress, and visible collective results leads to low ongoing engagement.

**EcoQuest — Campus Restoration Game** is a mobile application developed as a Community Engagement Project (CEP) to address this gap. Built using **React Native and Expo SDK 57**, EcoQuest translates everyday campus eco-actions into an interactive **Campus Restoration Game**. Students complete micro-challenges—such as carrying a reusable water bottle, switching off classroom fans, taking sustainable transport, and segregating cafeteria waste—to earn verified **Lifetime Eco Points** and build a **Spendable Fund**. These points are reinvested into physical, sequential campus restoration projects (planting shade trees, installing rooftop solar panels, deploying smart compost hubs, and establishing pure water refill stations). As upgrades are funded, the central illustrated **Campus Restoration Scene** visibly evolves on-screen from a dormant quad into a thriving green sanctuary.

The application incorporates a two-tier points economy (210 total lifetime points available across 8 quests; 180 points required across 4 campus upgrades; 30 points final spendable surplus), 4 player levels, 8 achievement badges, a dynamic simulated leaderboard, offline local persistence via `AsyncStorage`, and a two-step demonstration reset feature. This report presents the background, objectives, system architecture, feature implementation, mathematical balance, automated test results, limitations, and future scope of the EcoQuest project.

---

## 1. Introduction

Environmental sustainability is among the most urgent global challenges, and higher educational institutions represent vital micro-communities for fostering sustainable habits. Everyday behaviors on campus—such as leaving fans running in unoccupied lecture halls, buying single-use bottled water, discarding unsegregated waste, and driving personal motorized vehicles for short inter-campus trips—collectively generate substantial carbon emissions, landfill waste, and resource depletion.

However, traditional campus sustainability campaigns rely heavily on top-down appeals, posters, or sporadic awareness drives. Behavioral science indicates that sustainable habits are adopted far more effectively when actions are:
1. **Actionable & Achievable:** Broken down into small, daily micro-actions.
2. **Immediately Rewarding:** Acknowledged with instant gamified feedback.
3. **Visually Tangible:** Connected to a visible transformation in the student's immediate environment.

EcoQuest models this behavioral feedback loop. By framing campus sustainability as an interactive restoration project, students do not merely "read guidelines"—they actively rebuild a digital reflection of their campus quad through daily personal actions.

*Note on Project Nature:* EcoQuest is an educational demonstration prototype developed for academic evaluation and community presentation. Its mechanics are designed to model incentive structures rather than measure physical environmental outcomes.

---

## 2. Problem Statement

Current university sustainability awareness efforts face three foundational obstacles:

1. **Passive Information Delivery:** Guidelines posted on bulletin boards or university websites lack interactivity and fail to capture the attention of digital-native students.
2. **The "Drop in the Ocean" Perception:** Individual students often feel that minor actions—such as turning off a switch or bringing a cloth bag—are inconsequential in the absence of visual feedback or aggregated recognition.
3. **Absence of Tangible Progress:** Unlike academic coursework or sports, sustainability lacks milestone markers, progression levels, or public achievement indicators.

There is a distinct need for a lightweight, mobile-first demonstration tool that makes sustainability visible, structured, and rewarding within a student's daily routine without requiring expensive enterprise hardware or complex server infrastructure.

---

## 3. Project Objectives

The primary objectives of the EcoQuest project are:

1. **Promote Sustainability Awareness:** Introduce college students to actionable conservation habits across five core domains: Energy, Waste, Water, Transport, and Food.
2. **Structure Actions as Quests:** Present sustainability habits as clear, self-contained micro-tasks with explicit point values and impact descriptions.
3. **Implement a Two-Tier Gamified Economy:** Model an economy where *Lifetime Points* (which drive player level, badges, and leaderboard rank) are strictly distinguished from *Spendable Points* (which are spent to fund campus upgrades), ensuring that spending points never penalizes player standing.
4. **Visualize Environmental Restoration:** Create a dynamic, illustrated Campus Restoration Scene that visibly transitions through five cumulative stages (Stage 0 to Stage 4) as restoration projects are completed.
5. **Implement Multi-Tier Progression:** Incorporate four player levels, eight achievement badges with distinct criteria, and an eight-participant dynamic leaderboard.
6. **Ensure Reliable Local Persistence:** Enable game progress to automatically survive app reloads and restarts using local device storage (`AsyncStorage`).
7. **Provide Presentation Readiness:** Include a confirmed demonstration reset workflow that allows presenters to cleanly reset the app to baseline state during live demonstrations.

---

## 4. Scope of the Project

### In-Scope
* A standalone mobile application running on physical Android devices through Expo Go.
* Five functional navigation tabs: Home, Quests, Rank, Badges, and Profile.
* Eight predefined sustainability challenges across Energy, Waste, Water, Transport, and Food.
* Four sequential campus restoration upgrades costing 30, 40, 50, and 60 points respectively.
* A native illustration component rendered purely with React Native primitives and CSS layering.
* Local key-value storage using `@react-native-async-storage/async-storage`.
* Offline execution with zero external server, cloud backend, or login requirements.

### Out-of-Scope (Explicit Boundaries)
* **No Automated Verification:** Quest completion is a simulated, self-reported user action; the app does not incorporate IoT sensors, camera AI, or GPS geofencing to physically verify real-world behavior.
* **No Live Multi-User Network:** The campus leaderboard features fictional benchmark peers to demonstrate real-time ranking algorithms without requiring live server connections.
* **No Cloud Account Synchronization:** User progress is stored locally on the demonstrator's device.
* **No Measured Scientific Impact:** Environmental impact labels are pedagogical estimates designed for demonstration rather than laboratory-certified carbon offsets.

---

## 5. System Requirements

### 5.1 Functional Requirements

| ID | Requirement Description | Verification Method |
|:---:|:---|:---:|
| **FR-01** | The application must provide five distinct tabs: Home, Quests, Rank, Badges, and Profile. | Inspected & Tested |
| **FR-02** | The Quests screen must display 8 challenges with point rewards, category icons, and category filter pills. | Inspected & Tested |
| **FR-03** | Tapping "Mark as Done" must award points immediately, update completed state, and prevent duplicate completion. | Automated Test |
| **FR-04** | The Home screen must display Lifetime Points, Spendable Points, Quests Done, and current Player Level. | Inspected & Tested |
| **FR-05** | The Campus Restoration card must display the next available upgrade, cost, and affordability/shortfall feedback. | Automated Test |
| **FR-06** | Funding an upgrade must advance the Campus Scene stage (0 to 4) and deduct spendable points without reducing lifetime points. | Automated Test |
| **FR-07** | At Stage 4, the purchase action must be replaced with a completion summary displaying the 30-point surplus. | Automated Test |
| **FR-08** | The Rank screen must display an 8-participant leaderboard with deterministic tie-breaking and a Top-3 podium. | Automated Test |
| **FR-09** | The Badges screen must evaluate lock/unlock status for all 8 badges, maintaining distinct thresholds for Earth Guardian (160 pts) and Level 4 (170 pts). | Automated Test |
| **FR-10** | Progress must persist locally across app reloads under storage key `ecoquest.gameState.v1`. | Automated Test |
| **FR-11** | The Profile screen must provide a Reset Demo action with a two-step confirmation dialog (`Alert.alert`) that clears the EcoQuest record and restores Stage 0. | Automated Test |

### 5.2 Non-Functional Requirements
* **Zero Backend Dependency:** Fully operational offline without internet connectivity.
* **Responsive Mobile Layout:** Optimized for portrait Android phones with explicit safe-area clearance for Android 3-button navigation (48dp) and gesture navigation bars.
* **Zero External Graphic Dependencies:** Campus illustrations are rendered entirely via React Native primitives (`View`, `Text`) and CSS styling, ensuring zero image asset loading lag or broken asset links.
* **Atomic State Safety:** Sequential write queuing and synchronous ref tracking to eliminate race conditions during rapid consecutive taps.

### 5.3 Software & Environment Specifications
* **Operating System (Development):** Windows 11
* **Runtime Target:** Android 10+ (via Expo Go)
* **Node.js Environment:** v18.x / v20.x / v24.x
* **Package Manager:** npm (with pinned `package-lock.json`)
* **Core Framework:** React Native `0.86.3` with Expo SDK `~57.0.30`

---

## 6. Technology Stack

```
┌────────────────────────────────────────────────────────┐
│             PRESENTATION / RUNTIME LAYER               │
│          Android Physical Phone via Expo Go            │
├────────────────────────────────────────────────────────┤
│                 APPLICATION FRAMEWORK                  │
│       React Native 0.86.3  •  Expo SDK ~57.0.30        │
│                    React 19.2.3                        │
├────────────────────────────┬───────────────────────────┤
│       STATE MANAGEMENT     │       LOCAL STORAGE       │
│    React Context + Hooks   │  AsyncStorage 2.2.0 (JSI) │
│   (Single Source of Truth) │  Key: ecoquest.gameState  │
├────────────────────────────┴───────────────────────────┤
│                    DESIGN SYSTEM                       │
│    Custom Emerald & Slate Palette (Vanilla CSS/Styles) │
│       Safe Area Context ~5.7.0 (Android Insets)        │
└────────────────────────────────────────────────────────┘
```

* **Expo SDK 57 (`~57.0.30`):** Provides the managed build and runtime tooling, enabling rapid mobile bundling and execution on physical Android devices through Expo Go without local Android Studio / Gradle configuration overhead.
* **React Native (`0.86.3`):** The cross-platform mobile framework providing native Android primitives (`View`, `Text`, `ScrollView`, `TouchableOpacity`, `Alert`, `ActivityIndicator`).
* **React (`19.2.3`):** The component architecture library utilizing modern functional components, `useState`, `useEffect`, `useContext`, and `useRef`.
* **`@react-native-async-storage/async-storage` (`2.2.0`):** An asynchronous, unencrypted, persistent, key-value storage system used to save and restore game records offline.
* **`react-native-safe-area-context` (`~5.7.0`):** Provides device-specific screen inset metrics to ensure UI elements clear status bars, display cutouts, and bottom Android navigation bars.
* **Vanilla React Native `StyleSheet`:** High-performance, memory-efficient styling system providing consistent themes without external utility overhead.

---

## 7. System Architecture

EcoQuest implements an **offline-first unidirectional data flow** managed by [`GameProvider`](file:///A:/cep_app/ecoquest-demo/src/context/GameContext.js).

### Data Flow Lifecycle

```
[ App Launch ]
      │
      ▼
[ GameContext: Hydration useEffect ]
      │
      ├─► Read 'ecoquest.gameState.v1' from AsyncStorage
      │
      ├─► Pass raw data through validateSavedGameState()
      │     ├── Discard unknown / corrupted IDs
      │     ├── Remove duplicates
      │     └── Enforce sequential upgrade order (0, 1, 2, 3)
      │
      ├─► Initialize completedQuestIds & purchasedUpgradeIds
      │
      └─► Mark isHydrated = true  ──► [ Dismiss Loading Card ]
                                             │
      ┌──────────────────────────────────────┴──────────────────┐
      ▼                                                         ▼
[ User Completes Quest ]                               [ User Purchases Upgrade ]
      │                                                         │
      ▼                                                         ▼
validate via processQuestCompletion()           validate via processUpgradePurchase()
      │                                                         │
update completedQuestIds state & refs           update purchasedUpgradeIds state & refs
      │                                                         │
      └──────────────────┬──────────────────────────────────────┘
                         │
                         ▼
        [ queuePersist() Write Mutex ]
                         │
                         ▼
             AsyncStorage.setItem()
```

### The Selector Pattern
Rather than storing calculated values in disk storage (which could lead to stale data or desynchronization), only two ground-truth arrays are persisted:
1. `completedQuestIds`
2. `purchasedUpgradeIds`

All presentation values—including lifetime points, spendable points, campus stage, level progress, unlocked badges, and leaderboard rankings—are computed on-the-fly through pure selector functions whenever the primary arrays update.

---

## 8. Feature Implementation

### 8.1 Home Dashboard & Campus Scene
* **Header & Branding:** Shows project branding, student name (*Aditya — Eco Explorer*), and current player level badge.
* **Campus Restoration Scene (`CampusScene.js`):** A custom illustrated environment that visibly transforms across Stages 0, 1, 2, 3, and 4 using styled `View` elements, borders, and position coordinates.
* **Restoration Card:** Displays the current active project, cost, spendable wallet balance, shortfall calculation, and build action. At Stage 4, displays a completion banner and spendable surplus.
* **Level Progress Card:** Features an animated progress bar displaying the exact points required to reach the next level tier.
* **Impact Metrics Grid:** Three glanceable cards highlighting Lifetime Eco Points, Spendable Fund, and Completed Quests Count.
* **Quick Navigation:** Shortcut cards to the Campus Rank and Badges screens.

### 8.2 Sustainability Quests (`QuestsScreen.js`)
* **Category Filters:** Horizontal scrollable pills: *All*, *Energy (⚡)*, *Waste (♻️)*, *Water (💧)*, *Transport (🚲)*, and *Food (🥗)*.
* **Interactive Quest Cards:** Each card displays title, description, category icon, impact badge, point reward, and an interactive "Mark as Done" action.
* **Duplicate Protection:** Once completed, the button converts to a non-interactive badge `✓ Completed (+pts awarded)`, preventing duplicate reward claims.
* **Demonstration Banner:** Explains that quest actions are self-reported demonstration activities.

### 8.3 Campus Leaderboard (`RankScreen.js`)
* **User Rank Callout:** Prominently highlights Aditya's current rank, verified lifetime points, and dynamic standing feedback.
* **Top-3 Podium:** Gold (🥇), Silver (🥈), and Bronze (🥉) podium blocks displaying student names, points, and ranks, synchronized dynamically with the leaderboard dataset.
* **Deterministic Tie-Breaking:** If the user ties with a benchmark peer (e.g., at 210 pts with Priya Nair), deterministic tie-breaking maintains original roster seniority.
* **Full Standings Table:** Complete list of all 8 participants with departments, ranks, and points.

### 8.4 Achievement Badges (`BadgesScreen.js`)
* **Summary Header:** Progress bar and counter displaying unlocked trophies out of 8.
* **Trophy Cards:** Two-column card grid displaying badge icon, title, description, condition, and dynamic progress bar (e.g., *1 / 2 Waste quests completed*). Unlocked cards display emerald borders, green checkmarks, and illuminated icon circles.

### 8.5 Student Profile & Demo Reset (`ProfileScreen.js`)
* **Identity Card:** Displays user avatar, demonstrator title, level tag, account type (*College Demo Account*), and client version (*Expo SDK 57*).
* **Lifetime Stats Card:** Aggregates total lifetime points earned, quests completed, and badges earned.
* **Demonstration Controls:** Dedicated section explaining reset behavior with a `🔄 Reset Demonstration Data` button.
* **Two-Step Confirmation Flow:** Uses `Alert.alert` to present Cancel and destructive "Reset Everything" options, ensuring presentation safety.

---

## 9. Game Rules and Mathematical Calculations

### 9.1 Quest Rewards Table (210 Lifetime Points Total)

| ID | Title | Category | Points | Impact Level | Description |
|:---:|:---|:---:|:---:|:---:|:---|
| `ch-1` | Reusable Water Bottle | Waste ♻️ | **30** | Medium | Carry a refillable bottle to classes instead of disposable plastic. |
| `ch-2` | Lights & Fans Off | Energy ⚡ | **20** | Low | Switch off classroom lights and fans when vacating study halls. |
| `ch-3` | Green Commute | Transport 🚲 | **40** | High | Walk, cycle, or take a campus shuttle instead of driving. |
| `ch-4` | Plant-Based Meal | Food 🥗 | **25** | Medium | Choose a vegetarian or plant-forward lunch at the cafeteria. |
| `ch-5` | Segregate Campus Waste | Waste ♻️ | **35** | Medium | Separate wet organic waste and dry recyclables into campus bins. |
| `ch-6` | 5-Minute Shower | Water 💧 | **25** | Medium | Limit hostel shower time to under five minutes to conserve water. |
| `ch-7` | Unplug Idle Chargers | Energy ⚡ | **15** | Low | Unplug laptop adapters and mobile chargers to stop phantom drain. |
| `ch-8` | Bring a Tote Bag | Waste ♻️ | **20** | Low | Use a reusable cloth bag for bookstore groceries and stationery. |
| **Total** | | | **210** | | **Maximum Achievable Lifetime Eco Points** |

### 9.2 Campus Upgrades Table (180 Points Total)

| Stage | Upgrade ID | Project Title | Cost | Zone | Physical / Visual Impact |
|:---:|:---:|:---|:---:|:---:|:---|
| **1** | `upg-trees` | Native Shade Trees | **30 pts** | Central Quad | Restores lush lawn grass, shade canopy, and wildflower blooms. |
| **2** | `upg-solar` | Rooftop Solar Array | **40 pts** | Academic Hall | Adds photovoltaic solar panels to generate renewable electricity. |
| **3** | `upg-compost` | Smart Compost Hubs | **50 pts** | Campus Paths | Deploys color-coded organic compost pods and recycling stations. |
| **4** | `upg-water` | Pure Water Cistern | **60 pts** | Campus Plaza | Installs chilled water refill station & active quad fountain basin. |
| **Total** | | | **180 pts** | | **Total Investment for Full Campus Restoration** |

### 9.3 Economic Balance & Surplus Equation
The economy is governed by two fundamental equations:
$$\text{Lifetime Points} = \sum_{q \in \text{Completed Quests}} \text{Reward}(q)$$
$$\text{Spendable Points} = \max\left(0, \text{Lifetime Points} - \sum_{u \in \text{Purchased Upgrades}} \text{Cost}(u)\right)$$

At full completion:
$$\text{Final Spendable Surplus} = 210\text{ (Total Rewards)} - 180\text{ (Total Upgrades)} = \mathbf{30\text{ Points}}$$

*Why Lifetime Points Never Decrease:* In gamified psychology, deducting a student's score or demoting their rank as a penalty for upgrading their environment creates a negative incentive. By maintaining Lifetime Points as an immutable high-water mark, students are encouraged to reinvest their spendable balance without fear of losing rank.

### 9.4 Player Level Thresholds
* **Level 1: Eco Seedling:** $0 - 49\text{ pts}$ (Baseline tier)
* **Level 2: Green Scout:** $50 - 99\text{ pts}$ (Reached after completing 2–3 quests)
* **Level 3: Earth Guardian:** $100 - 169\text{ pts}$ (Reached after completing 4–6 quests)
* **Level 4: Planet Champion:** $170 - 210\text{ pts}$ (Reached after full quest mastery)

### 9.5 Achievement Badges Evaluation Rules

| Badge ID | Badge Title | Criteria / Trigger Condition | Evaluation Rule |
|:---:|:---|:---|:---|
| `bdg-first` | Eco Starter | Complete 1 quest | `completedQuestIds.length >= 1` |
| `bdg-100` | Green Sprout | Earn 100 Lifetime Eco Points | `lifetimePoints >= 100` |
| `bdg-160` | Earth Guardian | Earn 160 Lifetime Eco Points | `lifetimePoints >= 160` *(Distinct from Level 4 threshold)* |
| `bdg-200` | Planet Hero | Earn 200 Lifetime Eco Points | `lifetimePoints >= 200` |
| `bdg-waste` | Zero-Waste Pioneer | Complete at least 2 Waste quests | At least 2 of `ch-1`, `ch-5`, `ch-8` completed |
| `bdg-energy` | Watts Saver | Complete both Energy quests | Both `ch-2` and `ch-7` completed |
| `bdg-commute` | Clean Cruiser | Complete 1 Transit quest | `ch-3` completed |
| `bdg-water` | Hydro Guardian | Complete 1 Water quest | `ch-6` completed |

---

## 10. User Interface and Workflow

The primary user workflow follows a circular positive reinforcement loop:

```
[ Quests Screen ] ──► Complete Quest ──► [+Points Earned]
       ▲                                       │
       │                                       ▼
  Need Points                           [ Home Screen ]
       │                                       │
       └──────── Insufficient Funds ◄── Check Upgrade Card
                                               │
                                         Sufficient Funds
                                               │
                                               ▼
                                      Tap "Build Upgrade"
                                               │
                                               ▼
                                     [ Campus Transforms ]
                                     Stage Advances (0 to 4)
                                     Spendable Fund Deducted
```

### Genuine Application Screenshot Placeholders
*(To be inserted from the live running Android phone)*

#### Screenshot 1: Initial Baseline Home Screen (Stage 0)
```
┌────────────────────────────────────────────────────────┐
│ [INSERT SCREENSHOT: Stage 0 Home Screen]               │
│ - Shows dry, dormant campus quad illustration          │
│ - Level 1: Eco Seedling badge                          │
│ - 0 Eco Points, 0 Spendable, 0 Quests Done             │
│ - Native Shade Trees upgrade locked (Need 30 pts)      │
└────────────────────────────────────────────────────────┘
Figure 1: Initial Baseline Dashboard & Dormant Campus Quad (Stage 0)
```

#### Screenshot 2: Sustainability Quests Screen
```
┌────────────────────────────────────────────────────────┐
│ [INSERT SCREENSHOT: Quests Screen]                     │
│ - Category filter pills (All, Energy, Waste, etc.)     │
│ - Quest cards with impact tags and +pts badges         │
│ - "Mark as Done" action buttons                        │
│ - Demonstration disclaimer banner                      │
└────────────────────────────────────────────────────────┘
Figure 2: Sustainability Quests Catalog with Category Filters
```

#### Screenshot 3: Restored Campus Quad (Stage 1 / Stage 4)
```
┌────────────────────────────────────────────────────────┐
│ [INSERT SCREENSHOT: Upgraded Campus Scene]             │
│ - Shows vibrant green lawn with native shade trees     │
│ - Stage badge updated to Stage 1 or Stage 4            │
│ - Spendable points deducted while lifetime points stay │
└────────────────────────────────────────────────────────┘
Figure 3: Campus Restoration Quad Visibly Transformed
```

#### Screenshot 4: Dynamic Campus Leaderboard Screen
```
┌────────────────────────────────────────────────────────┐
│ [INSERT SCREENSHOT: Leaderboard & Podium]              │
│ - Gold, Silver, Bronze top-3 podium blocks             │
│ - User Aditya highlighted in ranking list              │
│ - Real-time points display and rank indicator          │
└────────────────────────────────────────────────────────┘
Figure 4: Dynamic Campus Standings & Synchronized Podium
```

#### Screenshot 5: Achievement Badges Screen
```
┌────────────────────────────────────────────────────────┐
│ [INSERT SCREENSHOT: Badges Screen]                     │
│ - Unlocked badges with green glow and checkmarks       │
│ - Locked badges with criteria requirements             │
│ - Progress summary bar                                 │
└────────────────────────────────────────────────────────┘
Figure 5: Achievement Badges Trophy Screen
```

#### Screenshot 6: Student Profile & Reset Confirmation Dialog
```
┌────────────────────────────────────────────────────────┐
│ [INSERT SCREENSHOT: Profile & Reset Dialog]            │
│ - Demonstrator profile card and performance stats      │
│ - Native Alert.alert popup showing confirmation dialog │
│ - "Cancel" and "Reset Everything" buttons              │
└────────────────────────────────────────────────────────┘
Figure 6: Student Profile & Two-Step Demo Reset Dialog
```

---

## 11. Testing and Verification Results

EcoQuest was subjected to automated verification suites and physical device checks:

### 11.1 Automated Acceptance Testing
All automated tests are executable directly using Node.js without requiring external testing framework installations:

```bash
node tests/test_integration.mjs
```

**Recorded Results:**
* **Total Assertions Executed:** 83
* **Assertions Passed:** 83
* **Assertions Failed:** 0
* **Success Rate:** **100%**

#### Test Coverage Summary
1. **Economy & Upgrade Accounting:** Verified 210 maximum points, 180 total upgrade costs, 30 surplus points, duplicate rejection, and shortfall calculation.
2. **Progression & Ranks:** Verified 4 level thresholds, distinct 160 pt Earth Guardian badge threshold, all 8 badge criteria, deterministic leaderboard tie-breaking, and ranking updates.
3. **Storage Sanitization:** Verified safe recovery from null, undefined, malformed JSON, unknown quest IDs, duplicate IDs, and non-sequential upgrade arrays.
4. **Lifecycle & Persistence:** Verified pre-hydration mutation blocking, quest and upgrade reload survival, rapid consecutive write ordering, cold restart reconstruction, and demo reset clearing.

### 11.2 Metro Android Bundler Compilation
* **Metro Endpoint:** `http://localhost:8081/index.bundle?platform=android&dev=true`
* **HTTP Status:** `200 OK`
* **Modules Bundled:** 763 modules compiled cleanly with 0 syntax or transform errors.

### 11.3 Physical Device Checks (Expo Go on Android)
The following checklist was verified on a physical Android device:
* [x] Themed hydration screen appears on startup without flashing raw zero statistics.
* [x] Quests complete with immediate button status changes.
* [x] Campus Scene updates immediately upon purchasing upgrades.
* [x] Reloading via Expo Go developer menu preserves completed quests and campus stage.
* [x] Reset Demo confirmation dialog correctly cancels or confirms reset.
* [x] Bottom navigation bar clears Android system navigation bars and gesture pills.

---

## 12. Limitations

In accordance with academic integrity and the approved Community Engagement Project scope:

1. **Self-Reported Actions:** Quest completions are self-reported by the user tapping in-app buttons; there is no physical verification via camera AI, barcode scanning, or IoT sensor integration.
2. **Simulated Benchmark Leaderboard:** The seven competitor profiles on the leaderboard are fictional benchmark models designed to demonstrate real-time ranking algorithms without requiring multi-user database infrastructure.
3. **Offline Client Architecture:** Storage is strictly local to the device using `AsyncStorage`. There is no cloud backend, relational database, user authentication system, or cross-device account sync.
4. **Illustrative Environmental Impact:** Stated environmental impacts are educational estimates designed to contextualize sustainable habits, not certified scientific carbon calculations.

---

## 13. Future Scope

If extended beyond the academic demonstration phase, potential future enhancements include:

1. **Centralized Cloud Backend:** Introducing a Node.js / PostgreSQL backend with user authentication to enable cross-device synchronization and genuine campus-wide student participation.
2. **Multiplayer Live Leaderboards:** Real-time inter-hostel or inter-department sustainability competitions.
3. **IoT & QR Verification:** Integrating QR codes at campus waste bins, water refill stations, and bicycle racks to physically verify student sustainability actions.
4. **Campus Administration Dashboard:** A web dashboard for university sustainability committees to aggregate anonymous data on campus resource conservation trends.

---

## 14. Conclusion

The **EcoQuest — Campus Restoration Game** successfully demonstrates how gamification principles can transform passive campus sustainability guidelines into an engaging, interactive mobile experience.

By combining an intuitive two-tier points economy, five cumulative campus restoration stages, multi-tier progression, dynamic leaderboard competition, and robust local persistence, the application provides an educational and reliable presentation tool. Developed with React Native and Expo SDK 57, EcoQuest achieves high visual appeal, zero broken asset dependencies, and complete presentation readiness for the College Community Engagement Project evaluation.

---

## References

1. **React Native Documentation:** Meta Open Source. *React Native Core Components and APIs (v0.86).* Available at: https://reactnative.dev/docs/components-and-apis
2. **Expo Documentation:** 650 Industries. *Expo SDK 57 Reference and Guides.* Available at: https://docs.expo.dev/
3. **AsyncStorage Documentation:** React Native Community. *React Native Async Storage Guide & API (v2.x).* Available at: https://react-native-async-storage.github.io/async-storage/
4. **React Documentation:** React Core Team. *React Hooks: useState, useEffect, useContext, useRef (v19).* Available at: https://react.dev/reference/react
5. **United Nations Sustainable Development Goals:** Goal 12 (Responsible Consumption and Production) & Goal 13 (Climate Action). Available at: https://sdgs.un.org/goals

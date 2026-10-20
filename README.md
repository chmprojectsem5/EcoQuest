# EcoQuest — Campus Restoration Game 🌱

> **Gamified Sustainability Awareness for Campus Communities**  
> Developed for the College Community Engagement Project (CEP)  
> Built with **React Native (Expo SDK 57)** for Android demonstration.

---

## 📖 Project Overview

**EcoQuest** is an interactive, illustrated mobile application designed to transform campus sustainability from passive guidelines into a rewarding, visual game experience. 

### The Problem
College campuses often struggle with sustainability engagement: energy conservation, waste segregation, water efficiency, and low-carbon commuting are frequently viewed as abstract rules or institutional mandates rather than actionable personal habits. Without immediate feedback or tangible progress, individual student contributions feel insignificant.

### The Solution
EcoQuest introduces the **Campus Restoration Game**:
1. Students complete tangible, everyday campus sustainability quests (e.g., carrying a reusable bottle, turning off classroom fans, taking transit, segregating waste).
2. Each completed quest awards verified **Lifetime Eco Points** and unlocks **Spendable Funds**.
3. Students reinvest spendable points into physical **Campus Upgrades** (planting shade trees, installing rooftop solar panels, deploying smart compost hubs, and building pure water refill stations).
4. As projects are funded, the central **Campus Restoration Scene** dynamically evolves on-screen from a neglected, dormant quad into a thriving green oasis.

### Target Audience & Demonstration Context
* **Audience:** College students, campus sustainability committees, faculty evaluators, and community demonstrators.
* **Context:** Live presentation demonstration running on a physical Android mobile device via Expo Go.

---

## ✨ Key Features

| Tab | Feature | Description |
|:---:|:---|:---|
| 🏠 | **Home & Campus Scene** | Unified illustrated campus environment transitioning across 5 visual stages (Stage 0 to Stage 4), level progress indicator, glanceable points metrics, and sequential restoration project cards. |
| 🎯 | **Quests** | 8 interactive campus challenges across 5 environmental categories (Energy, Waste, Water, Transport, Food). Instant completion status, one-time rewards, and category filtering. |
| 🏆 | **Campus Rank** | Dynamic leaderboard featuring 8 campus participants (7 fictional peers + demonstrator). Real-time rank calculation with deterministic tie-breaking and synchronized Top-3 podium. |
| 🎖️ | **Achievement Badges** | 8 trophy badges with real-time unlock conditions: 4 score milestones (1 completed quest, 100 pts, 160 pts, 200 pts) and 4 category badges (Zero-Waste, Watts Saver, Clean Cruiser, Hydro Guardian). |
| 👤 | **Student Profile** | Demonstrator identity card, performance stats, college project metadata, and a two-step confirmation **Reset Demo Data** action. |

### Technical Highlights
* **Two-Tier Economy:** Lifetime Points (determines level, badges, and leaderboard; never decreases) are strictly separated from Spendable Points (deducted upon funding campus upgrades).
* **Local Persistence:** Progress is saved automatically to device storage via `@react-native-async-storage/async-storage` under `ecoquest.gameState.v1`. Progress survives app reloads and restarts.
* **Safe Hydration Splash:** Themed loading card during storage reads prevents false zero-point statistics flashes on startup.
* **Functional Demo Reset:** Two-step confirmation dialog erases saved demo state and returns the campus to Stage 0, zero points, Level 1, and locked badges for repeatable live presentations.
* **Native Illustrations:** The Campus Restoration Scene is constructed purely with native React Native layout primitives and custom CSS styling, eliminating external image asset load delays or network dependencies.

---

## 🛠️ Technology Stack

| Component | Technology | Version | Notes |
|:---|:---|:---:|:---|
| **Framework** | Expo SDK | `~57.0.30` | Managed workflow |
| **Mobile Runtime** | React Native | `0.86.3` | Optimized for Android phone display |
| **Core UI Library** | React | `19.2.3` | Functional components & hooks |
| **Safe Area Insets** | `react-native-safe-area-context` | `~5.7.0` | 3-button & gesture nav clearance |
| **Local Storage** | `@react-native-async-storage/async-storage` | `2.2.0` | Offline key-value persistence |
| **Status Bar** | `expo-status-bar` | `~57.0.1` | Adaptive system bar styling |
| **Runtime Target** | Expo Go | Android | Physical device demonstration |

---

## 🚀 Setup & Execution Instructions

### Prerequisites
* **Node.js** (v18.x or v20.x recommended)
* **npm** (bundled with Node.js)
* **Android Phone** with the **Expo Go** app installed from the Google Play Store (or an Android emulator).
* Development machine and phone connected to the **same local Wi-Fi network**.

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd ecoquest-demo
npm install
```

### 2. Start the Expo Development Server
```bash
npx expo start
```
*To clear bundler cache if needed:*
```bash
npx expo start --go -c
```

### 3. Open on Android Phone
1. Open the **Expo Go** app on your Android device.
2. Tap **Scan QR code** and scan the QR code displayed in your terminal.
3. EcoQuest will bundle and display the themed loading screen before presenting the Stage 0 campus.

### 4. Run Automated Verification Tests
All core game mechanics, economy invariants, progression thresholds, persistence serialization, and reset flows are fully validated:
```bash
node tests/test_integration.mjs
```
*Expected Output: `83/83 TESTS PASSED (0 FAILURES)`*

---

## 📂 Project Structure

```
ecoquest-demo/
├── App.js                   # Root component with SafeAreaProvider & hydration guard
├── app.json                 # Expo application configuration & metadata
├── package.json             # Pinned dependencies & startup scripts
├── tests/
│   └── test_integration.mjs # Master automated integration & regression test suite
├── docs/
│   ├── PROJECT_REPORT.md    # Comprehensive academic CEP submission report
│   ├── PRESENTATION_OUTLINE.md # 10-slide seminar presentation deck outline
│   ├── VIVA_PREPARATION.md  # Complete viva voce preparation & defense guide
│   ├── VIVA_QUICK_REVISION.md # 2-page rapid revision sheet & viva cheat sheet
│   ├── DEMO_GUIDE.md        # Presenter's script & live walkthrough sequence
│   ├── ARCHITECTURE.md      # System data flow, state management, & storage design
│   ├── SUBMISSION_CHECKLIST.md # Pre-submission verification checklist
│   └── TROUBLESHOOTING.md   # Practical solutions for network, Metro, & Expo issues
└── src/
    ├── components/
    │   ├── BottomNavBar.js  # 5-tab navigation bar with Android navigation clearance
    │   └── CampusScene.js   # Illustrated campus environment (Stages 0 through 4)
    ├── context/
    │   └── GameContext.js   # Central state, economy logic, persistence, & reset
    ├── data/
    │   └── gameData.js      # Single source of truth for quests, upgrades, levels, & badges
    ├── screens/
    │   ├── HomeScreen.js    # Campus world centerpiece, upgrade card, & level progress
    │   ├── QuestsScreen.js  # 8 campus quests with category filtering & completion
    │   ├── RankScreen.js    # 8-participant campus leaderboard & Top-3 podium
    │   ├── BadgesScreen.js  # 8 achievement badge trophies with unlock progress
    │   └── ProfileScreen.js # Demonstrator card, performance stats, & Demo Reset
    └── theme/
        └── colors.js        # Emerald and slate design system palette
```

---

## 📐 Exact Game Rules & Economy Specifications

```
                           [ 8 Sustainability Quests ]
                                        │
                                        ▼ (Complete Quests)
                     ┌──────────────────────────────────────┐
                     │   210 Total Lifetime Points Available │
                     └──────────────────┬───────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
       [ Lifetime Points ]                             [ Spendable Points ]
  • Never decreases from purchases                • Earned alongside lifetime points
  • Drives Player Level (1 to 4)                  • Deducted upon purchasing upgrades
  • Evaluates 4 Score Badges                      • 180 pts total upgrade costs
  • Determines Leaderboard Rank (#8 to #4)        • 30 pts final spendable surplus
```

### 1. Quest Catalog (210 Lifetime Points Total)
| Quest ID | Title | Category | Reward | Description |
|:---:|:---|:---:|:---:|:---|
| `ch-1` | Reusable Water Bottle | Waste ♻️ | **+30 pts** | Carry a refillable water bottle to classes today. |
| `ch-2` | Lights & Fans Off | Energy ⚡ | **+20 pts** | Switch off lights and fans when leaving empty classrooms. |
| `ch-3` | Green Commute | Transport 🚲 | **+40 pts** | Walk, cycle, or use campus shuttles instead of motorbikes/cars. |
| `ch-4` | Plant-Based Meal | Food 🥗 | **+25 pts** | Choose a vegetarian or plant-forward lunch at the cafeteria. |
| `ch-5` | Segregate Campus Waste | Waste ♻️ | **+35 pts** | Separate wet organic waste and dry recyclables into campus bins. |
| `ch-6` | 5-Minute Shower | Water 💧 | **+25 pts** | Conserve hostel water by keeping shower time under 5 minutes. |
| `ch-7` | Unplug Idle Chargers | Energy ⚡ | **+15 pts** | Disconnect laptop and phone adapters to stop phantom drain. |
| `ch-8` | Bring a Tote Bag | Waste ♻️ | **+20 pts** | Use a cloth tote bag for campus store books and stationery. |

### 2. Sequential Campus Upgrades (180 Points Total)
Upgrades must be purchased in strict sequential order:
1. **Stage 1 — Native Shade Trees (30 pts):** Restores biodiversity and lush grass to the dormant quad.
2. **Stage 2 — Rooftop Solar Array (40 pts):** Adds photovoltaic solar panels to the academic hall.
3. **Stage 3 — Smart Compost Hubs (50 pts):** Deploys color-coded organic compost pods along paths.
4. **Stage 4 — Pure Water Cistern (60 pts):** Activates a central chilled water refill fountain.
* **Spendable Surplus:** $210 - 180 = \mathbf{30\text{ pts}}$ remaining spendable balance upon full campus restoration.

### 3. Player Level Progression
* **Level 1: Eco Seedling** (0–49 lifetime pts)
* **Level 2: Green Scout** (50–99 lifetime pts)
* **Level 3: Earth Guardian** (100–169 lifetime pts)
* **Level 4: Planet Champion** (170–210 lifetime pts)

### 4. Achievement Badges (8 Badges)
* 4 Score Milestones: **Eco Starter** (1st quest), **Green Sprout** (100 pts), **Earth Guardian** (160 pts), **Planet Hero** (200 pts).
  *(Note: The Earth Guardian badge threshold of 160 pts is intentionally distinct from Level 4 at 170 pts).*
* 4 Category Challenges: **Zero-Waste Pioneer** (any 2 waste quests), **Watts Saver** (both `ch-2` and `ch-7`), **Clean Cruiser** (`ch-3`), **Hydro Guardian** (`ch-6`).

### 5. Dynamic Leaderboard
* 8 Participants: Maya Sharma (340), Aarav Patel (290), Priya Nair (210), Rohan Das (160), Zara Khan (120), Vikram Rao (75), Neha Gupta (40), and the demonstrator Aditya (0 baseline).
* User climbs in real time from Rank #8 up to Rank #4 (210 pts, tied with Priya Nair).
* Deterministic tie-breaker maintains original roster seniority for equal scores.

---

## ⚠️ Scope & Educational Demonstration Disclaimers

1. **Self-Reported Demonstration Actions:** Quests are completed via simulated in-app button presses for demonstration purposes; there is no automated hardware or external sensory verification of physical student behavior.
2. **Simulated Campus Leaderboard:** Peer competitors on the leaderboard are fixed, fictional benchmark profiles designed to demonstrate real-time ranking and podium mechanics without requiring live multi-user network connections.
3. **Local Offline Persistence:** Storage is strictly local to the device using AsyncStorage. There is no cloud backend, server database, or cross-device account synchronization.
4. **Pedagogical Impact Figures:** Environmental impact statements (e.g., carbon reduction, water saved) are illustrative educational estimates intended to inspire behavior, not certified scientific measurements.

---

## 📚 Project Documentation

* **[Comprehensive Project Report (docs/PROJECT_REPORT.md)](./docs/PROJECT_REPORT.md):** Full academic CEP report containing problem statement, objectives, architecture, feature implementation, mathematical balance, verification evidence, and limitations.
* **[Presentation Deck Outline (docs/PRESENTATION_OUTLINE.md)](./docs/PRESENTATION_OUTLINE.md):** 10-slide college seminar presentation outline with slide titles, bullet points, visual placeholders, and detailed speaker notes.
* **[Viva Voce Preparation & Project Defense Guide (docs/VIVA_PREPARATION.md)](./docs/VIVA_PREPARATION.md):** Complete viva preparation guide with spoken introductions, basic & architectural Q&A, math calculations, defense against critical questions, code walkthrough, and a 5–7 minute demonstration script.
* **[Viva Quick Revision Cheat Sheet (docs/VIVA_QUICK_REVISION.md)](./docs/VIVA_QUICK_REVISION.md):** Two-page high-yield revision sheet covering stack, numbers, thresholds, architecture, limitations, and top 10 most anticipated viva questions.
* **[Submission Checklist (docs/SUBMISSION_CHECKLIST.md)](./docs/SUBMISSION_CHECKLIST.md):** Pre-submission verification checklist covering student information, screenshot insertion, phone rehearsal, and faculty submission criteria.
* **[Live College Demonstration Guide (docs/DEMO_GUIDE.md)](./docs/DEMO_GUIDE.md):** Complete live presentation script, step-by-step walkthrough, and talking points.
* **[Technical Architecture Document (docs/ARCHITECTURE.md)](./docs/ARCHITECTURE.md):** Detailed system design, state management flow, persistence lifecycle, and Mermaid diagrams.
* **[Troubleshooting Guide (docs/TROUBLESHOOTING.md)](./docs/TROUBLESHOOTING.md):** Rapid solutions for common Expo Go, Metro, and local storage issues.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

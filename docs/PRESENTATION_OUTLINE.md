# EcoQuest — Presentation Outline & Slide Deck Guide

## Community Engagement Project (CEP) Presentation
**Project Title:** EcoQuest — Campus Restoration Game  
**Platform:** Mobile Application (React Native & Expo SDK 57)  
**Target Duration:** 10–12 minutes (Presentation) + 3–5 minutes (Live Phone Demonstration)  

---

### Slide 1: Title and Project Introduction

* **Slide Title:** EcoQuest — Campus Restoration Game
* **Subtitle:** An Interactive Mobile Application for Fostering Student Sustainability Habits
* **Project Type:** College Community Engagement Project (CEP)
* **Presenter Information:**
  * **Student Presenter:** Aditya Deonarayan Jha (`[Insert Roll / Registration Number]`)
  * **Degree & Department:** B.Sc. Computer Science (Third Year, Semester V), Department of Computer Science
  * **College / University:** SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE (CHM), Ulhasnagar-3
  * **Academic Year:** 2026–2027
  * **Faculty Guide / Mentor:** `[Insert Faculty Mentor Name & Designation]`
* **Main Content Bullets:**
  * Mobile-first gamification prototype built with React Native and Expo SDK 57.
  * Bridges the gap between passive campus sustainability rules and active student participation.
  * Translates everyday micro-actions into visible digital campus restoration.
* **Suggested Visual / Media:**
  * `[Visual: Title graphic featuring the EcoQuest emblem, college logo placeholder, and a dual mockup of the Dormant Quad (Stage 0) vs. Thriving Quad (Stage 4)]`
* **Speaker Notes:**
  > "Good morning, respected faculty members and evaluators. Today, I am presenting EcoQuest, our Community Engagement Project. EcoQuest is an interactive mobile game designed for college students that turns daily environmental stewardship—such as waste segregation, energy saving, and low-carbon commuting—into an engaging campus restoration journey. Over the next ten minutes, I will outline the problem we set out to address, how our game mechanics and architecture solve it, and present the live mobile application."

---

### Slide 2: Problem Statement and Motivation

* **Slide Title:** The Campus Sustainability Dilemma
* **Main Content Bullets:**
  * **Passive Communication:** Traditional awareness campaigns rely on static flyers, circulars, and posters with negligible student engagement.
  * **The "Drop in the Ocean" Bias:** Students often believe individual micro-actions (e.g., turning off one fan or carrying a bottle) have no measurable impact.
  * **Absence of Immediate Feedback:** Unlike academic or athletic pursuits, sustainable habits offer no progress indicators, levels, or social recognition.
  * **The Goal:** Create a low-friction, rewarding digital tool that provides instant positive reinforcement and connects personal actions to tangible campus improvements.
* **Suggested Visual / Media:**
  * `[Visual: Comparison diagram — Left: Static campus notice board (Ignored); Right: EcoQuest interactive feedback loop (Action -> Points -> Restoration -> Reward)]`
* **Speaker Notes:**
  > "Every university struggles with the same dilemma: students agree that environmental sustainability matters, yet lights stay on in empty classrooms and single-use plastics fill cafeteria bins. The root issue is not a lack of concern, but an absence of immediate positive feedback. When an action feels isolated and invisible, motivation drops. We built EcoQuest to make sustainability personal, immediate, and visible by connecting individual micro-actions directly to the physical restoration of our digital campus."

---

### Slide 3: Project Objectives and Scope

* **Slide Title:** Project Objectives & Demonstration Scope
* **Main Content Bullets:**
  * **Core Objectives:**
    * Encourage adoption of daily sustainability practices through structured micro-quests.
    * Establish an intuitive two-tier points economy (Lifetime achievement vs. Spendable budget).
    * Provide visual cause-and-effect through a multi-stage illustrated campus quad.
    * Drive student engagement with 4 progression levels, 8 milestone badges, and a leaderboard.
    * Ensure reliable offline operation and instant state persistence across app sessions.
  * **Scope & Boundaries (Educational Demonstration):**
    * Self-contained educational demonstration developed for academic presentation.
    * In-app simulated completion (no IoT sensors, camera AI, or cloud backends).
    * Client-side local persistence via `AsyncStorage` (no external accounts or server costs).
* **Suggested Visual / Media:**
  * `[Visual: Pillar graphic highlighting the 4 core pillars: (1) Daily Quests, (2) Dual Economy, (3) Visual Restoration, (4) Level Progression]`
* **Speaker Notes:**
  > "Our primary objective was to deliver an engaging, self-contained educational prototype. We designed 8 specific sustainability quests, a balanced two-tier points economy, 4 restoration upgrades, and comprehensive player progression. To maintain a rigorous engineering scope, EcoQuest is engineered as a zero-infrastructure client-side application running offline with local persistence. Actions are self-reported for demonstration purposes, modeling the behavioral incentive loop without relying on expensive server infrastructure."

---

### Slide 4: Technology Stack and System Architecture

* **Slide Title:** Modern Mobile Architecture
* **Main Content Bullets:**
  * **Verified Stack:**
    * **Framework:** React Native `0.86.3` with Expo SDK `57.0.30` (Metro bundler, zero native build errors).
    * **Language & Runtime:** Modern JavaScript (ES6+) with React `19.2.3`.
    * **State Management:** React Context API (`GameContext`) with `useReducer` action dispatching.
    * **Persistence:** `@react-native-async-storage/async-storage` (`v2.2.0`) keyed to `'ecoquest.gameState.v1'`.
    * **Navigation & Layout:** Custom 5-tab persistent navigator with `react-native-safe-area-context`.
  * **Architectural Flow:**
    * Single source of truth: UI dispatches typed actions (`COMPLETE_QUEST`, `PURCHASE_UPGRADE`, `RESET_GAME`).
    * Pure calculation engine: Derived metrics (levels, badges, ranks) computed on-the-fly without state duplication.
    * Storage queue lifecycle: Serialized state writes with sanitization against corrupted payloads.
* **Suggested Visual / Media:**
  * `[Visual: System Architecture Flowchart — UI Screens -> Action Dispatch -> GameContext/Reducer -> Storage Queue / AsyncStorage -> Derived Calculators -> UI Re-render]`
* **Speaker Notes:**
  > "From an engineering standpoint, EcoQuest is built on React Native 0.86 and Expo SDK 57. Rather than introducing heavy external state libraries, we implemented a centralized React Context with a pure reducer pattern. The entire application shares a single source of truth. Player level, unlocked badges, spendable balance, and leaderboard standings are dynamically derived through pure functions, preventing data discrepancies. Every state mutation is sanitized and queued asynchronously to device storage, guaranteeing zero data loss between app launches."

---

### Slide 5: Home Dashboard & Campus Restoration Concept

* **Slide Title:** Campus Restoration: Cause and Effect
* **Main Content Bullets:**
  * **Home Dashboard:**
    * Instant snapshot: Current Level, Lifetime Points, Spendable Eco Points, and Next Upgrade target.
    * Safe hydration: Displays a themed loading screen until local storage is loaded, eliminating UI flicker.
  * **Cumulative 5-Stage Campus Scene:**
    * **Stage 0 (Dormant Quad):** Muted grounds, bare walkways, no green infrastructure.
    * **Stage 1 (Native Shade Trees — 30 pts):** Green canopy and lush grass appear.
    * **Stage 2 (Rooftop Solar Array — 40 pts):** Rooftop photovoltaic panels installed on campus hall.
    * **Stage 3 (Smart Compost Hub — 50 pts):** Organic waste bins and aeration units added.
    * **Stage 4 (Pure Water Station — 60 pts):** Central filtration cistern and refill hub complete the quad.
  * **Visual Continuity:** Upgrades are strictly cumulative; previously built infrastructure remains permanently visible.
* **Suggested Visual / Media:**
  * `[INSERT SCREENSHOT: Home Screen showing Campus Restoration Scene at Stage 2 or Stage 4, with Upgrade CTA card below]`
* **Speaker Notes:**
  > "The centerpiece of EcoQuest is the Campus Restoration Scene on the Home tab. When a student opens the app, the campus quad is bare and dormant at Stage 0. As they complete challenges and earn points, they purchase four sequential campus upgrades. Each upgrade adds permanent physical assets: shade trees, solar panels, compost units, and a water refill cistern. Because the artwork is built directly from modular styled primitives, the visual transitions are seamless, performant, and completely immune to missing asset errors."

---

### Slide 6: Quests, Eco Points & The Points Economy

* **Slide Title:** Quests & The Two-Tier Points Economy
* **Main Content Bullets:**
  * **Eight Diverse Campus Quests across 5 Sustainability Domains:**
    * *Waste:* Carry reusable bag (30 pts), Segregate cafeteria waste (35 pts), Avoid plastic cutlery (20 pts).
    * *Energy:* Turn off classroom switches (20 pts), Unplug idle lab chargers (15 pts).
    * *Transport:* Walk or cycle to campus (40 pts).
    * *Food:* Zero food-waste lunch (25 pts).
    * *Water:* Carry refillable bottle (25 pts).
  * **The Two-Tier Economic Model:**
    * **Lifetime Eco Points (Score):** Cumulative total (Max: 210 pts). Never decreases; determines Level and Badge progress.
    * **Spendable Eco Points (Currency):** Budget dedicated to funding campus upgrades. Decreases when upgrades are purchased.
  * **Mathematical Balance:**
    * $210 \text{ Lifetime Points Earned} - 180 \text{ Upgrade Points Spent} = 30 \text{ Spendable Surplus}$.
* **Suggested Visual / Media:**
  * `[INSERT SCREENSHOT: Quests Screen showing categorized quest cards with point badges, completion checkmarks, and disabled states]`
* **Speaker Notes:**
  > "A key design challenge in gamified systems is the economy. If spending points to upgrade the campus lowered a player's rank or level, students would hoard points and avoid upgrading. We solved this with a two-tier points economy: Lifetime Points represent total civic contribution and never decrease, while Spendable Points act as currency for campus upgrades. Completing all eight quests yields 210 lifetime points. Funding all four campus upgrades costs exactly 180 points, leaving the player with a satisfying 30-point surplus upon complete campus restoration."

---

### Slide 7: Progression: Levels, Badges & Leaderboard

* **Slide Title:** Player Progression & Social Benchmarks
* **Main Content Bullets:**
  * **Four Player Levels (Based on Lifetime Points):**
    * Level 1: *Eco Novice* (0–49 pts)
    * Level 2: *Campus Steward* (50–99 pts)
    * Level 3: *Green Pioneer* (100–169 pts)
    * Level 4: *Restoration Champion* (170–210 pts)
  * **Eight Achievement Badges (Milestone & Domain Honors):**
    * *Milestone:* First Step (1 quest), Century Club (100 pts), Earth Guardian (160 pts), Campus Hero (200 pts).
    * *Domain Mastery:* Zero Waste Hero, Energy Guardian, Green Commuter, Water Steward.
  * **Dynamic Social Leaderboard:**
    * Ranks the user dynamically among 7 campus peers (Maya: 340, Aarav: 290, Priya: 210, etc.).
    * User begins at #8 (0 pts) and climbs to #4 (210 pts), demonstrating real-time ranking adjustments.
* **Suggested Visual / Media:**
  * `[INSERT SCREENSHOT: Badges Screen showing unlocked vs. locked badges, OR Rank Screen showing player climbing to Rank #4]`
* **Speaker Notes:**
  > "To maintain long-term engagement, EcoQuest incorporates a three-dimensional progression system. First, four tier-based levels guide students from Eco Novice to Restoration Champion. Second, eight achievement badges reward specific habits, such as domain mastery in energy or water stewardship. Note that our Earth Guardian badge unlocks at 160 points, intentionally distinct from the Level 4 threshold of 170 points. Third, the Rank tab benchmarks the student against seven fictional peers, allowing the player to climb from Rank #8 up to Rank #4 as they complete challenges."

---

### Slide 8: Local Persistence & Demo Reset Lifecycle

* **Slide Title:** Offline Resilience & Demo Reset
* **Main Content Bullets:**
  * **Asynchronous Offline Persistence:**
    * Utilizes `@react-native-async-storage/async-storage` under key `'ecoquest.gameState.v1'`.
    * State survives app reloads, app backgrounding, and Expo Go restarts.
    * Storage queue guarantees that rapid quest completion writes are processed in strict sequence.
  * **Robust Schema Sanitization:**
    * Automatically validates and repairs corrupted, missing, or malformed data upon launch.
    * Deduplicates quest lists and ensures campus upgrade indices maintain logical integrity.
  * **Two-Step Demo Reset:**
    * Located in the Profile tab for evaluators and presentation rehearsals.
    * Triggers a native system alert dialog (`Cancel` vs. `Reset Everything`).
    * Completely purges stored state and resets the UI back to Stage 0 instantly without app restarts.
* **Suggested Visual / Media:**
  * `[INSERT SCREENSHOT: Profile Screen showing player stats and the native Reset Demo confirmation dialog]`
* **Speaker Notes:**
  > "For an academic project, presentation reliability is paramount. EcoQuest implements complete offline persistence. You can close Expo Go, restart your phone, or reload the bundle—your points, campus stage, and badges are restored instantly. Furthermore, because examiners need to see the progression from scratch, we built a two-step Demo Reset feature into the Profile screen. Protected by a confirmation dialog to prevent accidental clicks, this cleans local storage and resets the game back to Stage 0 within milliseconds."

---

### Slide 9: Verification, Limitations & Future Scope

* **Slide Title:** Verification, Limitations & Future Roadmap
* **Main Content Bullets:**
  * **Automated Acceptance & Integration Testing:**
    * 83 comprehensive assertions executed via Node.js (`tests/test_integration.mjs`).
    * **100% pass rate** across economy balance, progression rules, storage sanitization, and reset logic.
    * Metro Android bundle compiled cleanly with 763 modules and 0 syntax warnings.
  * **Honest Project Limitations:**
    * Actions are self-reported (no external sensor or camera AI validation).
    * Leaderboard competitors are simulated benchmarks rather than live networked users.
    * Pure client-side offline storage without multi-device cloud synchronization.
  * **Future Enhancements (Post-CEP Scope):**
    * Cloud backend (Node.js/PostgreSQL) with university SSO authentication.
    * QR-code scanning at campus recycling hubs and bike shelters to verify physical actions.
    * Department vs. department sustainability challenges and admin analytics.
* **Suggested Visual / Media:**
  * `[Visual: Terminal test execution screenshot showing "ALL 83 ASSERTIONS PASSED (100% SUCCESS RATE)"]`
* **Speaker Notes:**
  > "We validated EcoQuest through a comprehensive test suite of 83 automated assertions covering financial invariants, badge triggers, and corrupt storage recovery, all passing at 100 percent. In upholding academic integrity, we openly acknowledge the project's boundaries: this is an educational prototype with self-reported actions and benchmark peers. If expanded in the future, EcoQuest could incorporate university single sign-on, IoT-connected waste bins, and QR-code check-ins across campus facilities."

---

### Slide 10: Conclusion & Live Demonstration

* **Slide Title:** Conclusion & Live Demonstration
* **Main Content Bullets:**
  * **Summary of Achievements:**
    * Successfully designed and implemented a full-featured campus sustainability game prototype.
    * Delivered 5 tabs, 8 quests, 4 campus upgrades, 4 levels, 8 badges, and offline persistence.
    * Zero dependency crashes, zero styling defects, and high presentation stability on Expo SDK 57.
  * **Community Engagement Takeaway:**
    * Demonstrates that gamification can transform passive administrative sustainability rules into an active, rewarding campus culture.
  * **Transition to Demonstration:**
    * Switching to the live Android smartphone running EcoQuest in Expo Go.
    * Walkthrough sequence: Dormant Quad -> Quest Completion -> Purchasing Trees & Solar -> Profile Reset.
* **Suggested Visual / Media:**
  * `[Visual: EcoQuest logo, "Thank You" banner, Faculty/Student Acknowledgments, and "Ready for Live Demo" prompt]`
* **Speaker Notes:**
  > "In conclusion, EcoQuest demonstrates how modern mobile technology and behavioral gamification can revitalize environmental consciousness within a student body. The app is fully built, thoroughly tested, and ready for deployment. I would like to thank our faculty guide and department for their continuous support. I will now switch to my Android device running the live application to walk through the complete restoration experience. Thank you, and I look forward to your questions."

---

## Presentation Delivery Tips for the Student Presenter

1. **Keep Slides Visual:** Do not read slides verbatim. Use the concise bullet points as anchor prompts and speak naturally using the provided speaker notes.
2. **Device Preparation:** Open EcoQuest on your phone in Expo Go before walking to the presentation podium. Ensure battery saver is off and screen timeout is set to at least 5 minutes.
3. **Demo Readiness:** Use the Demo Reset button on the Profile tab right before your presentation starts so your live demonstration begins on Stage 0 (Dormant Quad).
4. **Transition Timing:** Practice transitioning smoothly from Slide 10 to holding up or screencasting your Android device within 15 seconds.

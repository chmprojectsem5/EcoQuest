# EcoQuest — Live College Demonstration Guide 🎤

> **A Step-by-Step Presenter Script & Walkthrough Playbook**  
> Designed for College Community Engagement Project (CEP) presentations.  
> Target Duration: **5 to 7 Minutes**  
> Platform: **Expo Go on Android**

---

## 📋 Presenter's Quick Checklist Before You Step On Stage

1. **Phone Battery & Wi-Fi:** Ensure your phone has sufficient battery and is connected to the same Wi-Fi network as your laptop (or your laptop is connected to your phone's mobile hotspot).
2. **Start Dev Server:** On your laptop, run:
   ```bash
   npx expo start
   ```
3. **Launch on Phone:** Open **Expo Go** on Android, scan the terminal QR code, and wait for the app to hydrate into the clean baseline state.
4. **Clean Baseline Check:**
   * Go to **Profile** tab -> tap **Reset Demo Data** -> tap **Reset Everything** to ensure you begin from Stage 0 with 0 points.
   * Return to the **Home** tab. You are now ready to present!

---

## 🎬 Live Demonstration Flow (Parts A through G)

```
[Part A: Introduction] ──► [Part B: Baseline State] ──► [Part C: Complete Quest]
                                                                  │
                                                                  ▼
[Part G: Demo Reset]   ◄── [Part F: Persistence]   ◄── [Part E: Progression] ◄── [Part D: Campus Upgrade]
```

---

### Part A — Introduction (The Concept & Motivation)

* **Presenter Action:** Hold up the phone displaying the **Home** screen or project your screen via an external monitor / projector.
* **What Appears on Screen:**
  * Top branding: "🌱 EcoQuest — Gamified Sustainability for Campus".
  * Greeting card: "Welcome back, Aditya — Eco Explorer", "Level 1: Eco Seedling".
  * The **Campus Restoration Scene** showing the dry, dormant Stage 0 quad with unpainted paths and empty grass.
* **Presenter Script (What to Say):**
  > "Good morning, respected professors and fellow students. Today, we are presenting **EcoQuest**, a mobile application designed for our Community Engagement Project.
  > 
  > On our campus, sustainability guidelines like saving energy, reducing plastic, and segregating waste are often perceived as passive rules. Students know they *should* do them, but there is no immediate positive reinforcement or visible impact.
  > 
  > EcoQuest solves this with the **Campus Restoration Game**: every sustainable action a student takes on campus earns points that directly fund the physical restoration of an illustrated campus world. Let me show you how it works in practice."

---

### Part B — Initial State (The Dormant Campus)

* **Presenter Action:** 
  1. Point to the central illustration on the **Home** screen.
  2. Point to the three glanceable metric cards below the upgrade card.
  3. Briefly tap through the **Quests**, **Rank**, and **Badges** tabs, then return to **Home**.
* **What Appears on Screen:**
  * **Home:** 
    * Illustration badge: `Stage 0 • Dormant Campus`.
    * Metrics: `0` Eco Points, `0` Spendable, `0 / 8` Quests Done.
    * Restoration card: `🛠️ RESTORATION PROJECT 1 OF 4 — Native Shade Trees`, required 30 pts, button disabled reading `🔒 Need 30 More Points`.
  * **Quests:** All 8 quests open with green `Mark as Done (+pts) ✓` buttons.
  * **Rank:** User Aditya is at baseline **Rank #8** with `0 PTS`.
  * **Badges:** All 8 badges display lock icons `🔒` and `0 / 8` unlocked.
* **Presenter Script (What to Say):**
  > "As you can see, our student begins at **Level 1: Eco Seedling** with zero Eco Points. Our campus quad starts in **Stage 0: Dormant**—the lawns are dry, the buildings are conventional, and no restoration projects have begun.
  > 
  > In the Campus Restoration card, the first available project is **Native Shade Trees**, which costs 30 points. Since we currently have zero spendable points, the project is locked, with feedback clearly showing we need 30 points to proceed. Let's go complete our first quest."

---

### Part C — Complete a Quest (Immediate Reward & First Badge)

* **Presenter Action:**
  1. Tap the **Quests** tab (second icon on the bottom navigation bar).
  2. Locate the first quest: **Bring a Reusable Water Bottle (+30 PTS)**.
  3. Tap **Mark as Done (+30 pts) ✓**.
  4. Tap the **Badges** tab.
* **What Appears on Screen:**
  * **Quests Screen:**
    * The button instantly changes to a solid badge: `✓ Completed (+30 pts awarded)`.
    * The top summary pill updates: Lifetime Points: `⚡ 30 pts`, Spendable Fund: `💎 30 pts`, Quests Done: `✅ 1 / 8`.
  * **Badges Screen:**
    * The header counter updates to `1 / 8`.
    * The first trophy badge, **Eco Starter**, unlocks with a glowing green border and checkmark: `✅ UNLOCKED ✓ (1 / 1 quest completed)`.
* **Presenter Script (What to Say):**
  > "In the Quests tab, we report our first everyday sustainable action: carrying a reusable water bottle to class today instead of purchasing single-use plastic.
  > 
  > When I tap 'Mark as Done', the reward is recorded instantly. The button locks to prevent duplicate point claims, our lifetime points increase to 30, and our spendable fund is now 30.
  > 
  > Over on the Badges tab, our first milestone achievement, **Eco Starter**, has automatically unlocked!"

---

### Part D — Restore the Campus (Transforming into Stage 1)

* **Presenter Action:**
  1. Tap the **Home** tab.
  2. Point to the Restoration Project card.
  3. Tap the active green button: **Build Native Shade Trees (-30 pts)**.
* **What Appears on Screen:**
  * **Campus Scene:**
    * Instantly transforms! The illustration updates from dry beige ground to vibrant light green lawns (`#D1FAE5`).
    * Two lush, illustrated native shade trees and campus wildflowers appear in the quad.
    * The stage tag updates to: `Stage 1 • Native Trees Planted` (25% restored).
  * **Points Summary & Metrics:**
    * **Lifetime Points:** Remains at **30 pts** (progress is never lost!).
    * **Spendable Balance:** Decreases from 30 to **0 pts** (spent on funding the trees).
  * **Next Project:**
    * The card automatically advances to `🛠️ RESTORATION PROJECT 2 OF 4 — Rooftop Solar Array (40 pts)`.
    * Displays: `🔒 Need 40 More Points`.
* **Presenter Script (What to Say):**
  > "Now watch the campus quad. With 30 spendable points in our fund, the **Native Shade Trees** project is now unlocked.
  > 
  > When I tap 'Build Native Shade Trees', the campus quad immediately transforms before our eyes into **Stage 1**! Lush grass flourishes, native oak trees appear, and biodiversity is restored.
  > 
  > Notice the crucial economic distinction here: our **Spendable Fund** was deducted to zero to pay for the trees, but our **Lifetime Points** remain at 30. In EcoQuest, spending points to upgrade your campus *never* penalizes your player level or rank."

---

### Part E — Demonstrate Progression (Level Up & Leaderboard Climb)

* **Presenter Action:**
  1. Tap the **Quests** tab.
  2. Tap the **Energy** category filter pill at the top, then complete **Lights & Fans Off (+20 pts)**.
  3. Tap the **Transport** category filter pill, then complete **Green Commute (+40 pts)**.
  4. Tap the **Rank** tab.
  5. Tap the **Home** tab.
* **What Appears on Screen:**
  * **Quests:**
    * Category pills smoothly filter quests by Energy and Transport.
    * Total lifetime points become: $30 + 20 + 40 = \mathbf{90\text{ pts}}$.
    * Spendable fund becomes: $0 + 20 + 40 = \mathbf{60\text{ pts}}$.
  * **Rank Screen:**
    * Aditya has dynamically climbed from **Rank #8 up to Rank #6** with 90 pts, overtaking benchmark peers Neha Gupta (40 pts) and Vikram Rao (75 pts).
    * User card highlights in emerald green.
  * **Home Screen:**
    * The level badge now proudly displays **Level 2: Green Scout** (50–99 pts).
    * The Level progress bar is calibrated toward Level 3 (100 pts), indicating `Earn 10 more Eco Points to reach Level 3: Earth Guardian`.
    * The Restoration card for **Rooftop Solar Array (40 pts)** is now affordable (`canAfford: true`) with 60 spendable points available.
* **Presenter Script (What to Say):**
  > "Let's complete two more challenges: switching off idle classroom fans (+20 pts) and cycling to campus instead of driving (+40 pts).
  > 
  > Our lifetime points are now 90. When we check the **Rank** tab, our position has dynamically updated: we climbed past two campus peers from Rank #8 to **Rank #6** in real time!
  > 
  > Back on the Home screen, our player status has graduated to **Level 2: Green Scout**, and our spendable balance of 60 points now qualifies us to purchase our next upgrade: the Rooftop Solar Array."

---

### Part F — Demonstrate Persistence (Surviving App Restart)

* **Presenter Action:**
  1. Keep the app open on the **Home** screen showing Stage 1 and 90 points.
  2. Reload the app in Expo Go by **shaking your physical phone** and tapping **Reload** (or pressing `r` in the laptop terminal).
  3. Point to the phone screen during the reload.
* **What Appears on Screen:**
  * The themed EcoQuest loading screen briefly appears (`🌱 EcoQuest • Restoring campus world...`).
  * As soon as hydration resolves, the app immediately re-renders:
    * Stage 1 Campus Scene with trees intact.
    * Level 2: Green Scout.
    * 90 Lifetime Points and 60 Spendable Points.
    * Quests completed (`ch-1`, `ch-2`, `ch-3`) remain completed.
* **Presenter Script (What to Say):**
  > "One critical requirement for a real-world app is reliability. If a student closes the app, their hard work must not be lost.
  > 
  > I am now reloading the app through Expo Go.
  > 
  > Notice that the application immediately displays our themed hydration screen while reading local device storage, preventing any awkward flash of zero statistics. Once loaded, our Stage 1 trees, our 90 lifetime points, our level, and our leaderboard rank are completely preserved using local AsyncStorage."

---

### Part G — Demonstrate Reset (Repeatable Live Presentations)

* **Presenter Action:**
  1. Tap the **Profile** tab (fifth icon on the bottom navigation bar).
  2. Scroll down to the **Demonstration Controls** section.
  3. Tap **🔄 Reset Demonstration Data**.
  4. On the native popup alert, tap **Cancel**.
  5. Tap **🔄 Reset Demonstration Data** a second time, and this time tap **Reset Everything**.
  6. Tap **OK** on the completion confirmation alert.
  7. Tap the **Home** tab.
* **What Appears on Screen:**
  * On Cancel: Nothing changes; points and stage remain intact.
  * On Confirm:
    * An `ActivityIndicator` appears briefly in the button while disk writes settle and storage keys are erased.
    * Native Alert: `Demo Reset Complete: All campus restorations, points, and badges have been reset to the baseline demo state.`
  * **Home Screen:**
    * Quad returns smoothly to **Stage 0: Dormant Campus**.
    * Metric cards return to `0 Eco Points`, `0 Spendable`, `0 / 8 Quests Done`.
    * Level badge returns to **Level 1: Eco Seedling**.
    * All 8 badges on the Badges tab are locked.
    * Aditya on the Rank tab returns to **Rank #8** with 0 points.
* **Presenter Script (What to Say):**
  > "Finally, we designed this project specifically for community demonstration and evaluation.
  > 
  > In the Profile screen, we built a dedicated **Demonstration Controls** section. When I tap 'Reset Demonstration Data', a two-step confirmation dialog protects against accidental taps. Tapping 'Cancel' keeps our data safe.
  > 
  > When I confirm 'Reset Everything', the app securely purges the EcoQuest records from local device storage and restores the baseline state. 
  > 
  > The quad returns to Stage 0, points return to zero, and the app is instantly ready for the next live presentation.
  > 
  > Thank you! We are now open to any questions from the panel."

---

## ❓ Frequently Asked Evaluator Questions & Answers

### Q1: "Is this connected to a real live database or GPS?"
> **Answer:** "No, EcoQuest is intentionally built as an offline-first demonstration prototype. In accordance with the approved project scope, it uses local device storage via AsyncStorage. Quests are self-reported demonstration actions, and leaderboard peers are simulated benchmark models. This ensures the demo is 100% reliable during presentations without depending on fragile Wi-Fi or external cloud servers."

### Q2: "Can a student cheat by completing the same quest multiple times?"
> **Answer:** "No. Every quest in EcoQuest has a unique identifier and can only be completed once. Once completed, the button converts to a non-interactive badge, and `GameContext` enforces duplicate protection both in-memory and across app reloads."

### Q3: "What happens when all 4 upgrades are built?"
> **Answer:** "All 8 quests provide exactly 210 lifetime points. All 4 upgrades cost 180 points. When the fourth project—the Pure Water Cistern—is built, the campus reaches **Stage 4: Green Oasis Sanctuary** with a flourishing fountain, clean energy, and compost pods. The student achieves **Level 4: Planet Champion**, unlocks all 8 badges, and retains a 30-point spendable surplus with the upgrade button replaced by a 'Campus Fully Restored' completion card."

---

## 📱 Standalone Android APK vs. Expo Go Demonstration

EcoQuest supports two distinct demonstration methods for college evaluations:

| Feature / Aspect | Option A: Expo Go Client (Development) | Option B: Standalone Android APK (Production Preview) |
|:---|:---|:---|
| **Execution Environment** | Runs inside the universal Expo Go app | Installs as an independent native Android app with "EcoQuest" icon |
| **PC / Laptop Dependency** | Requires laptop running `npx expo start` | **Zero dependency on laptop**; runs independently anywhere |
| **Network Requirements** | Phone and laptop must be on same local Wi-Fi | **100% offline**; zero internet or Wi-Fi needed after install |
| **Application Identifier** | `host.exp.exponent` (Expo Go container) | `com.ecoquest.demo` (Dedicated Android package) |
| **Data Storage Sandbox** | Shared within Expo Go demo session | Dedicated private `AsyncStorage` partition on device |
| **Ideal Presentation Use** | Development evaluation, debugging, live code reload | **Final stage presentation, viva defense, off-campus exhibition** |

### Standalone Android APK Specifications (Verified & Delivered)
The standalone APK has been compiled via EAS and is archived in the submission package:
* **Binary Location:** [`submission/EcoQuest.apk`](../submission/EcoQuest.apk)
* **Application ID:** `com.ecoquest.demo`
* **File Size:** `66.53 MB`
* **EAS Cloud Build ID:** `eb9372e4-998c-4a73-9995-dd0617bd6f56`
* **Build Profile:** `preview` (`android.buildType: "apk"`)
* **Cloud Artifact:** [Download EcoQuest.apk from EAS CDN](https://expo.dev/artifacts/eas/Lgvd8EqAIqjQwAcu34cMeZtprhRaoOwENRnD-TArXUg.apk)

### How to Install & Run the Standalone APK on Android
1. Transfer `EcoQuest.apk` to your Android smartphone (via USB cable, Google Drive, WhatsApp, or direct browser download).
2. Open your phone's **Files** or **Downloads** app and tap `EcoQuest.apk`.
3. If prompted: *"For security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
4. Tap **Install**, then tap **Open**.
5. EcoQuest will launch immediately with its custom splash screen, hydrate local storage, and present the Stage 0 campus without needing Metro or Wi-Fi!

### Pre-Viva Reset in Standalone APK
Before handing your phone to the examiner:
1. Tap the **Profile** tab (👤).
2. Scroll to the bottom and tap **Reset Demo Data**.
3. Tap **Reset Everything**. The app resets to Stage 0, Level 1, 0 points, and Rank #8 in milliseconds.


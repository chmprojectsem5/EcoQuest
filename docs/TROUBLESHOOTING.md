# EcoQuest — Troubleshooting & Maintenance Guide 🔧

> **Practical Solutions for Common Setup, Network, Metro, and Storage Issues**  
> Applicable to **EcoQuest (Expo SDK 57 / React Native 0.86.3 / Android)**

---

## 🧭 Diagnostic Quick-Reference

When encountering an issue, determine whether the problem is at the **Network/Server Layer**, the **Bundler/Compilation Layer**, or the **Application/Storage Runtime**:

```
[Phone: "Cannot connect to Expo CLI"] ──► Section 1: Network & Connection Issues
[Metro Terminal: Syntax or Transform Error] ─► Section 2: Metro Bundler & Import Errors
[Phone: Code changes not showing up] ───────► Section 3: Stale Cache & Hot-Reload
[Phone: Progress reset or missing] ─────────► Section 4: Persistence & Storage Inquiries
[Phone: Reset button unresponsive] ────────► Section 5: Demo Reset Troubleshooting
[Terminal: Dependency mismatch] ────────────► Section 6: Package & Dependency Guidelines
```

---

## 1. Network & Connection Issues: "Cannot Connect to Expo CLI"

### Symptom
Your Android phone running Expo Go displays a red or yellow banner:
> *"Cannot connect to Expo CLI"* or *"Network response timed out"*

### Causes & Verified Fixes

#### A. Phone and Computer are on Different Networks
* **Fix:** Verify that both your physical Android phone and your computer are connected to the exact same Wi-Fi router / SSID.
* **Hotspot Alternative (Recommended for College Auditoriums):** College Wi-Fi networks often have client isolation enabled (preventing devices from communicating with each other). To resolve this:
  1. Turn on the **Mobile Hotspot** on your Android phone.
  2. Connect your laptop to your phone's hotspot.
  3. Restart the Expo server:
     ```bash
     npx expo start
     ```
  4. Scan the newly generated QR code.

#### B. Windows Firewall Blocking Port 8081
* **Fix:** Windows Defender Firewall sometimes blocks incoming connections on port `8081` or Node.js.
  1. Open Windows Firewall Settings -> "Allow an app through firewall".
  2. Ensure **Node.js: Server-side JavaScript** has "Private" network access enabled.
  3. Alternatively, test the connection from your computer's browser:
     ```
     http://localhost:8081/index.bundle?platform=android&dev=true
     ```
     *(If this returns JavaScript code with HTTP 200 OK, Metro is healthy).*

#### C. IP Address Changed
* **Fix:** If your laptop reconnects to a router, its local IP may change. Stop the server (`Ctrl + C`) and start it again with:
  ```bash
  npx expo start
  ```

---

## 2. Bundler & Compilation Errors

### Symptom
Metro terminal reports a transform or syntax error, or the phone screen shows a red LogBox screen.

### Causes & Verified Fixes

#### A. Metro Bundler Cache Stale
Metro may retain stale transformed modules across file edits.
* **Fix:** Restart Metro with the cache-clear flag:
  ```bash
  npx expo start --go -c
  ```
  *(The `-c` or `--clear` flag forces Metro to rebuild the bundle cleanly from scratch).*

#### B. Unhandled Syntax in Imported Files
* **Fix:** Verify that all imported source files use standard ES module imports (`import ... from '...'`). EcoQuest files use standard React Native JavaScript without requiring TypeScript compilation steps.

---

## 3. Stale App State: "Code Changes Not Appearing on Phone"

### Symptom
You edited a file in `src/`, saved it, but your Android phone still shows the previous version of the screen.

### Causes & Verified Fixes

#### A. Fast Refresh Disconnected
* **Fix (In-App Reload):**
  1. Shake your physical Android device to open the **Expo Developer Menu**.
  2. Tap **Reload**.
* **Fix (Terminal Reload):**
  * Press `r` in the terminal where `npx expo start` is running to send a reload signal to all connected clients.

#### B. Expo Go Hibernated
If the phone screen was turned off, Expo Go may pause WebSocket keep-alives.
* **Fix:** Close Expo Go from your Android recent apps switcher, open Expo Go fresh, and tap the project under "Recently in Development".

---

## 4. Persistence & Local Storage Issues

### Symptom
Saved progress (completed quests or purchased campus upgrades) disappears after reopening the app, or points display zero unexpectedly.

### How EcoQuest Persistence Works
Progress is stored under the storage key:
```
ecoquest.gameState.v1
```
Only ground-truth records are stored: `completedQuestIds`, `purchasedUpgradeIds`, and `version: 1`. Redundant stats (lifetime points, level, badges, rank) are derived fresh on startup.

### Troubleshooting Steps

#### A. Hydration Loading Screen
* During the first few milliseconds of startup, EcoQuest shows a themed loading screen (`🌱 EcoQuest • Restoring campus world...`).
* If your phone displays this screen, wait 1–2 seconds for AsyncStorage to resolve. Once hydrated, the real state will render automatically.

#### B. Expo Go App Data Cleared Manually
* If someone clears the application cache or app storage for **Expo Go** in Android system settings (`Settings -> Apps -> Expo Go -> Clear Storage`), all AsyncStorage records will be erased.
* **Avoid** clearing Expo Go system data right before your live demonstration.

#### C. Malformed Storage Recovery
* EcoQuest features built-in sanitization. If stored JSON is ever corrupted, `validateSavedGameState()` safely discards invalid records, falls back to a clean Stage 0 baseline, and prevents the app from crashing.

---

## 5. Demonstration Reset Troubleshooting

### Symptom
Tapping the "Reset Demonstration Data" button on the Profile screen does not seem to reset the game, or gives an error.

### Troubleshooting Steps

#### A. Confirmation Dialog Required
* Tapping the reset button **does not** immediately reset the game. It triggers a native confirmation dialog:
  * Title: `Reset EcoQuest Demo`
  * Message: `Are you sure you want to reset all game progress?...`
* You must tap the destructive red action: **"Reset Everything"**. Tapping "Cancel" safely keeps all your existing progress.

#### B. Write Mutex In Progress
* If you just completed a quest or purchased an upgrade a split-second earlier, EcoQuest's write mutex (`saveChainRef`) will wait for the pending save to settle before executing `removeItem()`. Allow 1 second for the process to complete.

#### C. Verifying Baseline Restoration
After a successful reset, verify:
* **Home:** Quad is at Stage 0 with 0 points.
* **Quests:** Quests display green "Mark as Done" buttons.
* **Rank:** Aditya is at Rank #8 with 0 points.
* **Badges:** All 8 badges show lock icons.

---

## 6. Package & Dependency Guidelines

### Strict Rule for This Project
**Do not arbitrarily upgrade Expo SDK, React Native, or React.**

EcoQuest is verified and locked to:
* **Expo SDK:** `~57.0.30`
* **React Native:** `0.86.3`
* **React:** `19.2.3`
* **AsyncStorage:** `2.2.0`
* **Safe Area Context:** `~5.7.0`

### Installing Packages Correctly
If you ever genuinely need to install an additional Expo package, **never use plain `npm install <package>`**, as npm will install the latest version which may conflict with SDK 57.
Instead, always use Expo's version-resolution installer:
```bash
npx expo install <package-name>
```
*Expo will automatically pick the exact version compatible with SDK 57.*

### Reinstalling Dependencies Cleanly
If `node_modules` becomes corrupted or a package is missing:
```bash
# Clean install using the existing pinned lockfile:
npm ci
```
*(Do NOT delete `package-lock.json` unless explicitly directed).*

---

## 7. Verifying Project Health via CLI

Before presenting, you can run the self-contained verification suite to confirm that all game logic, economy equations, level thresholds, and persistence mechanisms are working with 100% accuracy:

```bash
node tests/test_integration.mjs
```

**Expected Result:**
```
================================================================
  AUDIT SUMMARY: 83/83 TESTS PASSED
🎉 ALL INTEGRATION & HARDENING CHECKS PASSED (0 FAILURES)!
================================================================
```

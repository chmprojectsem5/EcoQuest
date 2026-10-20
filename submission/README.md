# EcoQuest — College Submission Package & User Guide 🎓

**Project Title:** EcoQuest — Campus Restoration Game  
**Course & Domain:** College Community Engagement Project (CEP)  
**Target Platform:** Mobile Application (React Native 0.86.3 / Expo SDK 57 / Android)  
**Submission Directory:** `A:\cep_app\ecoquest-demo\submission\`  

---

## 1. Submission Package Overview

This directory contains the final academic deliverables generated for the College Community Engagement Project evaluation. All technical claims, game rules, mathematical calculations, and test statistics are grounded directly in the codebase and test suite.

| File Name | Format | Size | Purpose & Contents | Status |
|:---|:---:|:---:|:---|:---:|
| **`EcoQuest_Project_Report.docx`** | Word (`.docx`) | 55.1 KB | **Primary Editable Project Report:** A4 format with executive cover page, table of contents, abstract, 14 academic sections, styled tables, mathematical balance proofs ($210 - 180 = 30$), and 6 framed screenshot placeholders. | **Verified & Ready** |
| **`EcoQuest_Project_Report.pdf`** | PDF (`.pdf`) | 842 KB | **Print-Ready Academic Report:** Complete 13-page pre-compiled PDF copy with matching typography, page headers, footers, callouts, and clean layout. | **Verified & Ready** |
| **`EcoQuest_College_Presentation.pptx`** | PowerPoint (`.pptx`) | 65.9 KB | **Editable 10-Slide Presentation:** 16:9 widescreen layout, dark/light contrast cards, concise bullet points, screenshot placeholders, and comprehensive speaker notes attached to every slide. | **Verified & Ready** |
| **`EcoQuest_College_Presentation.pdf`** | PDF (`.pdf`) | 1.3 MB | **Widescreen Slide Deck PDF:** Complete 10-page widescreen slide deck ready for projector display or offline evaluation. | **Verified & Ready** |
| **`EcoQuest_Viva_Preparation.docx`** | Word (`.docx`) | 67.2 KB | **Editable Master Viva Defense Guide:** Comprehensive preparation guide covering Sections A through I with spoken pitches, 50 basic & architectural Q&As, 9 math proofs, 16 critical defenses, 10 code walkthroughs, and a 5–7 min demo script. | **Verified & Ready** |
| **`EcoQuest_Viva_Preparation.pdf`** | PDF (`.pdf`) | 1.08 MB | **Print-Ready Master Viva Guide:** Complete 24-page PDF compendium with emerald headings, Q&A callouts, formula blocks, and structured walkthroughs. | **Verified & Ready** |
| **`EcoQuest_Viva_Quick_Revision.docx`** | Word (`.docx`) | 45.1 KB | **Editable Viva Quick Revision Sheet:** High-yield ~3-page revision cheat sheet summarizing stack, 5 tabs, quests, upgrades, invariants, 5 limitations, and top 10 most anticipated viva questions. | **Verified & Ready** |
| **`EcoQuest_Viva_Quick_Revision.pdf`** | PDF (`.pdf`) | 853 KB | **Print-Ready Quick Revision Sheet:** 3-page compact PDF cheat sheet for rapid review immediately before entering the viva examination room. | **Verified & Ready** |
| **`EcoQuest.apk`** | Android App (`.apk`) | 66.5 MB | **Standalone Android Application:** Fully compiled, self-contained native Android APK package (`com.ecoquest.demo`) for 100% offline demonstration on physical Android smartphones without laptop or dev server. | **Built & Verified** |
| **`screenshots/`** | Directory | &mdash; | Dedicated destination folder for saving the 6 genuine phone screenshots. | **Prepared** |
| **`README.md`** | Markdown (`.md`) | Current file | **Submission Guide & Instructions:** Explains file contents, customization placeholders, screenshot insertion, and submission steps. | **Verified & Ready** |

> **Authoritative Source Documents:** Master Markdown sources are preserved in `docs/`:
> - `docs/PROJECT_REPORT.md`
> - `docs/PRESENTATION_OUTLINE.md`
> - `docs/VIVA_PREPARATION.md`
> - `docs/VIVA_QUICK_REVISION.md`
> - `docs/SUBMISSION_CHECKLIST.md`
> - `docs/DEMO_GUIDE.md`
> - `docs/ARCHITECTURE.md`
> - `docs/TROUBLESHOOTING.md`

---

## 2. Populated Details & Remaining Placeholders

The submission files have been personalized with verified student and college details:

### 2.1 Populated Details (Verified)
* **Student Name:** Aditya Deonarayan Jha
* **Degree Program & Branch:** B.Sc. Computer Science (Third Year, Semester V)
* **Department:** Department of Computer Science
* **College / Institution:** SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE (CHM), Ulhasnagar-3
* **Academic Year:** 2026–2027
* **Project Type:** Community Engagement Project (CEP)
* **Project Theme:** Gamified App for Sustainability
* **Technology Stack:** React Native 0.86.3 • Expo SDK ~57.0.30 • React 19.2.3 • AsyncStorage 2.2.0 • Android

### 2.2 Remaining Action Items / Placeholders to Complete
Before final departmental submission, open `EcoQuest_Project_Report.docx` and `EcoQuest_College_Presentation.pptx` to fill in:
* `[Insert Roll / Registration Number]` — Your university roll, PRN, or exam seat number.
* `[Insert Official Course Title & Code]` — e.g., *Community Engagement Project (USCS506 / CEP)*.
* `[Insert Faculty Mentor Name & Designation]` — Your faculty guide / project supervisor name.
* `[Insert Submission Date]` — The final date you submit the project report.

---

## 3. Genuine Screenshot Capture Instructions

### 3.1 Why Screenshots Must Be Captured from Phone
Android Debug Bridge (`adb`) is not installed on this development machine, and the application runs live on your physical Android phone via **Expo Go over local Wi-Fi**. In keeping with strict academic integrity, **no fake screenshots or stock mockups were fabricated**.

The destination directory has been created:
`A:\cep_app\ecoquest-demo\submission\screenshots\`

### 3.2 Required Screenshot Captures & Target Screen States

Capture the following 6 screenshots from your Android smartphone running EcoQuest in Expo Go, and save them into `submission/screenshots/`:

| File Name in `submission/screenshots/` | Target Screen | Exact Screen State Required |
|:---|:---|:---|
| **`01-home-stage-0.png`** | **Home Tab** | Baseline State (immediately after tapping Reset Demo). Shows Level 1: Eco Seedling, 0 Lifetime Points, 0 Spendable Points, 0 Quests Done, and the dry Dormant Quad illustration with the Native Trees upgrade locked. |
| **`02-quests.png`** | **Quests Tab** | Quests catalog showing category filter pills (*All*, *Energy*, *Waste*, etc.), quest cards with +points badges, and interactive "Mark as Done" action buttons. |
| **`03-campus-restoration.png`** | **Home Tab** | Upgraded Campus State. Shows the campus after completing 2–3 quests and purchasing Upgrades 1 & 2. The quad visibly displays lush green grass, shade trees, and rooftop solar panels. |
| **`04-rank.png`** | **Rank Tab** | Campus Leaderboard showing user Aditya climbing toward Rank #4, alongside the Top-3 podium blocks (Maya Sharma #1, Aarav Patel #2, Priya Nair #3). |
| **`05-badges.png`** | **Badges Tab** | Badges cabinet showing unlocked trophies with glowing borders, live progress bars (e.g., *1 / 2 Waste quests*), and locked milestones. |
| **`06-profile-reset.png`** | **Profile Tab** | Demonstrator account card with the native `Alert.alert` confirmation dialog open (*"Reset Demonstration Data? This will reset all points, completed quests, and campus upgrades..."* with **Cancel** and **Reset Everything** buttons). |

### 3.3 How to Insert into Word & PowerPoint
1. **In `EcoQuest_Project_Report.docx`:**
   - Locate Figures 1 to 6 in Section 10.
   - Right-click each green screenshot placeholder box, delete the inner text, and select **Insert > Pictures > This Device...** to insert the corresponding `.png` from `submission/screenshots/`.
2. **In `EcoQuest_College_Presentation.pptx`:**
   - Insert the corresponding screenshot into the placeholder cards on **Slide 5** (Home), **Slide 6** (Quests), **Slide 7** (Rank / Badges), and **Slide 8** (Profile Reset).

---

## 4. Institutional Formatting & Template Compliance

Every college department may have specific submission formatting guidelines. Please review:
1. **Departmental Certificate / Front Matter:** If SMT. CHM College requires an official college certificate, declaration, or acknowledgment template with college seals, insert those pages immediately before the Table of Contents in Word.
2. **Font & Spacing Guidelines:** The Word report defaults to clean Calibri (11 pt body, 1.15 line spacing, 1-inch margins). If *Times New Roman (12 pt, 1.5 line spacing)* is strictly mandated, select all text in Word (`Ctrl + A`) and adjust the font and line spacing.
3. **Print & Binding:** If a physical spiral-bound copy is required, convert your finalized `.docx` to PDF after inserting screenshots and student details to ensure pagination remains fixed during printing.

---

## 5. Live Demonstration Checklist for the Presentation

Follow these steps during your oral evaluation:
- **Slide 10 Cue:** Slide 10 provides a structured talking cue to transition to your live Android demonstration.
- **Pre-Demo Reset:** Open the Profile tab on your phone before stepping to the podium and tap **Reset Demonstration Data > Reset Everything** so your demo begins cleanly on Stage 0 (Dormant Quad).
- **Demo Script:** Follow the 7-step walkthrough in [`docs/DEMO_GUIDE.md`](../docs/DEMO_GUIDE.md) to showcase quests, points deduction, campus transformations, level ups, and badge unlocks within 3–5 minutes.
- **Phone Setup:** Keep your phone's screen timeout set to 5–10 minutes and turn off battery saver mode.

---

## 6. Viva Voce Defense & Revision Materials

The submission folder includes dedicated, printable viva preparation resources grounded in the project codebase:

### 6.1 `EcoQuest_Viva_Preparation.docx` & `.pdf` (Master Viva Guide)
* **Intended Use:** In-depth study and oral defense preparation. Read this over several days leading up to the examination.
* **Contents:**
  - **Section A:** One-minute natural spoken introduction script.
  - **Section B:** Three-minute structured technical architecture explanation.
  - **Section C:** 28 foundational viva questions and clear answers.
  - **Section D:** 22 deep technical architecture and state management questions.
  - **Section E:** Complete step-by-step mathematical proofs ($210 - 180 = 30$, level thresholds, badge unlocks, tie-breaking).
  - **Section F:** 16 critical examiner challenge questions with honest, defensible answers.
  - **Section G:** Plain-English walkthrough of all 10 project source files.
  - **Section H:** Rehearsable 5–7 minute live demonstration script and contingency fallback protocol.
  - **Section I:** 30-second concluding defense statement.

### 6.2 `EcoQuest_Viva_Quick_Revision.docx` & `.pdf` (Quick Revision Cheat Sheet)
* **Intended Use:** Last-minute review immediately prior to entering the viva examination room.
* **Contents:**
  - Concise 30-second elevator pitch.
  - At-a-glance tables for tech stack, 5 navigation tabs, 8 quests, and 4 upgrades.
  - Core point totals ($210\text{ lifetime rewards}$, $180\text{ upgrade cost}$, $30\text{ surplus}$) and invariants.
  - Level thresholds and badge conditions.
  - Architecture and persistence summary.
  - Five explicit project limitations to keep in mind.
  - Top 10 questions most likely to be asked by examiners with concise answers.

---

## 7. Standalone Android APK Delivered & Verified 📱

EcoQuest has been successfully compiled into a standalone Android APK (`EcoQuest.apk`), allowing the application to be evaluated and demonstrated directly on physical Android phones without requiring a laptop, Metro development server, or Wi-Fi connection.

### 7.1 Verified Build Specifications
* **Package Identifier:** `com.ecoquest.demo`
* **Application Name:** `EcoQuest`
* **Build Artifact:** `submission/EcoQuest.apk`
* **File Size:** `66.53 MB (69,764,165 bytes)`
* **EAS Build ID:** `eb9372e4-998c-4a73-9995-dd0617bd6f56`
* **Build Profile:** `preview` (`android.buildType = "apk"`, `internal`)
* **Expo SDK Version:** `57.0.0` (React Native `0.86.3` • React `19.2.3`)
* **Binary Integrity:** Verified Android PK ZIP container with native `arm64-v8a` libraries and compiled Dalvik executables (`classes.dex`, `classes2.dex`).
* **Direct EAS Artifact URL:** [Download EcoQuest.apk](https://expo.dev/artifacts/eas/Lgvd8EqAIqjQwAcu34cMeZtprhRaoOwENRnD-TArXUg.apk)

### 7.2 Standalone APK vs. Expo Go
* **Expo Go:** Runs the JavaScript bundle inside the generic Expo Go client sandbox over local Wi-Fi. Useful during code iteration.
* **Standalone APK:** Completely self-contained native Android app (`com.ecoquest.demo`). It runs 100% offline with zero dependencies on your laptop, development server, or campus network. Perfect for the final viva presentation and live examiner demonstrations.

### 7.3 Installation & Demonstration Reset
1. Transfer `submission/EcoQuest.apk` to your Android device (via USB cable, Google Drive, WhatsApp, or direct browser download).
2. Open your phone's **Files** or **Downloads** app and tap **`EcoQuest.apk`**.
3. If prompted: *"For security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
4. Tap **Install**, then tap **Open**.
5. EcoQuest will launch immediately with its custom splash screen, hydrate local storage, and present the Stage 0 campus without needing Metro or Wi-Fi!
6. **Pre-Viva Demo Reset:** Open the **Profile** tab $\rightarrow$ tap **Reset Demo Data** $\rightarrow$ tap **Reset Everything** to ensure you begin from the Stage 0 baseline quad with 0 points.




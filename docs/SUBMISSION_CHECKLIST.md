# EcoQuest — College Project Submission Checklist

## Community Engagement Project (CEP) Final Submission Audit
**Project Title:** EcoQuest — Campus Restoration Game  
**Target Repository:** `A:\cep_app\ecoquest-demo`  
**Submission Package:** Project Report, Presentation Deck, Source Code, and Live Demo  

---

### Instructions for the Student
Use this checklist to track final readiness for your college CEP evaluation. 
* Tasks marked `[x]` represent codebase-verified engineering milestones, populated academic details, and generated submission documents.
* Tasks marked `[ ]` represent student-specific administrative actions, screenshot captures, or institutional requirements that you must complete prior to final submission.

---

### Section 1: Academic Project Report (`submission/EcoQuest_Project_Report.docx` & `.pdf`)

#### 1.1 Verified & Populated Milestones
- [x] **Comprehensive Report Drafted:** All 14 required academic sections, executive abstract, and verified references are written and grounded in the actual codebase.
- [x] **Verified Student & College Details Populated:**
  - [x] Student Name: **Aditya Deonarayan Jha**
  - [x] Academic Program & Branch: **B.Sc. Computer Science (Third Year, Semester V)**
  - [x] Department: **Department of Computer Science**
  - [x] Institution / College: **SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE (CHM), Ulhasnagar-3**
  - [x] Academic Year: **2026–2027**
  - [x] Project Type: **Community Engagement Project (CEP)**
  - [x] Project Theme: **Gamified App for Sustainability**
- [x] **Editable Word Document Generated:** `submission/EcoQuest_Project_Report.docx` (A4 margins, styled tables, math balance proofs, 6 framed screenshot placeholders).
- [x] **Pre-Compiled PDF Export Generated:** `submission/EcoQuest_Project_Report.pdf` (13 pages, matching layout, zero clipped text).
- [x] **Project Scope & Limitations Explicitly Stated:** Report clearly states that quest completion is self-reported, leaderboard peers are fictional benchmarks, storage is offline via `AsyncStorage`, and environmental impact figures are educational estimates.

#### 1.2 Still Required from the Student
- [ ] **Fill in Remaining Institutional Placeholders in DOCX:**
  - [ ] Roll / Registration Number (`[Insert Roll / Registration Number]`)
  - [ ] Official Course Title & Code (`[Insert Official Course Title & Code — e.g., USCS506 / CEP]`)
  - [ ] Faculty Guide / Mentor Name & Designation (`[Insert Faculty Mentor Name & Designation]`)
  - [ ] Final Date of Submission (`[Insert Submission Date]`)
- [ ] **Capture & Insert 6 Genuine Phone Screenshots:**
  - [ ] `submission/screenshots/01-home-stage-0.png` — Figure 1: Baseline Stage 0 Quad & 0 pts.
  - [ ] `submission/screenshots/02-quests.png` — Figure 2: Categorized Quests Catalog & 'Mark as Done' buttons.
  - [ ] `submission/screenshots/03-campus-restoration.png` — Figure 3: Restored Quad with Trees and Solar Panels.
  - [ ] `submission/screenshots/04-rank.png` — Figure 4: Rank Screen showing player rank & Top-3 podium.
  - [ ] `submission/screenshots/05-badges.png` — Figure 5: Badges Cabinet with glowing unlocked trophies.
  - [ ] `submission/screenshots/06-profile-reset.png` — Figure 6: Profile Screen with native reset confirmation dialog.
- [ ] **College Departmental Formatting Review:**
  - [ ] Check if the college department requires a mandatory front-matter certificate, declaration, or guide signature page.
  - [ ] Verify font requirements (if *Times New Roman 12 pt, 1.5 line spacing* is strictly mandated, select all text in Word and reformat).
  - [ ] Generate a final printout / PDF if submitting a physical spiral-bound copy.

---

### Section 2: Presentation Deck & Live Demo (`submission/EcoQuest_College_Presentation.pptx` & `.pdf`)

#### 2.1 Verified & Populated Milestones
- [x] **10-Slide Widescreen Presentation Created:** Exactly 10 slides in 16:9 widescreen layout matching `docs/PRESENTATION_OUTLINE.md`.
- [x] **Slide 1 Personalized:** Aditya Deonarayan Jha, B.Sc. Computer Science (TY Sem V), SMT. CHM College Ulhasnagar-3, 2026–2027.
- [x] **Comprehensive Speaker Notes Attached:** Detailed notes included on every slide ($480–575$ characters per slide).
- [x] **Editable PPTX Generated:** `submission/EcoQuest_College_Presentation.pptx` (65.9 KB).
- [x] **Widescreen PDF Export Generated:** `submission/EcoQuest_College_Presentation.pdf` (1.3 MB, 10 landscape pages).

#### 2.2 Still Required from the Student
- [ ] **Fill in Roll Number & Faculty Guide on Slide 1:**
  - [ ] Update `[Insert Roll / Registration Number]`
  - [ ] Update `[Insert Faculty Mentor Name & Designation]`
- [ ] **Insert Captured Screenshots into Slides 5, 6, 7, and 8:**
  - [ ] Slide 5: Home Screen / Campus Scene
  - [ ] Slide 6: Quests Catalog
  - [ ] Slide 7: Rank or Badges Screen
  - [ ] Slide 8: Profile Screen with Reset Dialog
- [ ] **Demonstration Phone Setup (Expo Go on Android):**
  - [ ] Verify that the phone is on the same Wi-Fi network as the laptop.
  - [ ] Launch `npx expo start --go -c` and scan the QR code.
  - [ ] Set phone screen timeout to 5–10 minutes to prevent sleep during evaluation.
  - [ ] Turn off battery saver and notification banners.
- [ ] **Rehearse Demonstration Walkthrough:**
  - [ ] Follow `docs/DEMO_GUIDE.md` Parts A through G:
    - [ ] Part A: Start at Stage 0 (Dormant Quad, 0 pts).
    - [ ] Part B: Complete Waste & Energy Quests.
    - [ ] Part C: Fund Upgrade 1 (Trees) -> Stage 1.
    - [ ] Part D: Fund Upgrade 2 (Solar) -> Stage 2.
    - [ ] Part E: Inspect Rank and Badges screens.
    - [ ] Part F: Complete remaining quests & fund Upgrades 3 & 4 -> Stage 4 (30 pts surplus).
    - [ ] Part G: Demonstrate two-step Reset Demo on Profile tab.
  - [ ] Rehearse smooth transition from Slide 10 to phone demo within 15 seconds.

---

### Section 3: Engineering Verification & Test Evidence

- [x] **Integration Test Suite Passing:**
  - Command: `node tests/test_integration.mjs`
  - Result: **83 / 83 assertions passed (100% success rate)** with zero failures.
- [x] **Metro Bundler Clean Compilation:**
  - Endpoint: `http://localhost:8081/index.bundle?platform=android&dev=true`
  - Result: **HTTP 200 OK** across 763 modules with 0 syntax warnings.
- [x] **Mathematical Integrity Verified:**
  - 8 Quests award 210 maximum lifetime points.
  - 4 Upgrades cost 180 points in total.
  - Stage 4 retains 30 spendable surplus points ($210 - 180 = 30$).
  - Lifetime points never decrease upon purchasing upgrades.
  - Earth Guardian badge threshold (160 pts) verified distinct from Level 4 Champion (170 pts).
- [x] **Android Usability Hardened:**
  - Safe-area insets prevent clipping against camera cutouts and 48dp navigation pills.
  - Local persistence (`AsyncStorage`) restores state across reloads.
  - Two-step Reset Demo dialog confirmed functional.

---

### Section 4: Source Code Packaging & Submission Artifacts

- [x] **Screenshot Destination Directory Prepared:** `submission/screenshots/` ready for 6 device PNGs.
- [ ] **Clean Project Archive:**
  - [ ] Do **NOT** include `node_modules` or `.expo` folders in your submission archive (regenerated via `npm install`).
  - [ ] Include all required project files:
    - `App.js`, `app.json`, `package.json`, `package-lock.json`, `index.js`
    - `src/` (context, data, components, screens)
    - `tests/test_integration.mjs`
    - `docs/` (`PROJECT_REPORT.md`, `PRESENTATION_OUTLINE.md`, `DEMO_GUIDE.md`, `ARCHITECTURE.md`, `TROUBLESHOOTING.md`, `SUBMISSION_CHECKLIST.md`)
    - `submission/` (`EcoQuest_Project_Report.docx`, `EcoQuest_Project_Report.pdf`, `EcoQuest_College_Presentation.pptx`, `EcoQuest_College_Presentation.pdf`, `EcoQuest_Viva_Preparation.docx`, `EcoQuest_Viva_Preparation.pdf`, `EcoQuest_Viva_Quick_Revision.docx`, `EcoQuest_Viva_Quick_Revision.pdf`, `screenshots/`, `README.md`)
    - `README.md`
- [ ] **Departmental Submission:**
  - [ ] Obtain faculty guide signature on official departmental certificate.
  - [ ] Submit digital package / repository link according to college portal guidelines.

---

### Section 5: Viva Voce Defense & Examination Readiness

#### 5.1 Verified Materials Generated
- [x] **Master Viva Guide Generated:** `submission/EcoQuest_Viva_Preparation.docx` & `.pdf` (24 pages, Sections A through I, 50 Q&As, calculations, and walkthroughs).
- [x] **Quick Revision Cheat Sheet Generated:** `submission/EcoQuest_Viva_Quick_Revision.docx` & `.pdf` (3-page high-yield cheat sheet with invariants and top 10 questions).
- [x] **Integration Test Proof Available:** 83/83 passing test results documented and ready to show examiners.

#### 5.2 Student Preparation & Rehearsal Tasks
- [ ] **Read the Quick Revision Guide:** Read `EcoQuest_Viva_Quick_Revision.pdf` thoroughly to commit key point totals, thresholds, and top 10 answers to memory.
- [ ] **Practise the One-Minute Introduction:** Speak Section A aloud multiple times until you can introduce the project naturally in 60 seconds without sounding robotic.
- [ ] **Review Technical Architecture Questions:** Study Section D (unidirectional data flow, pure derivation selectors, single source of truth, Promise write queue, AsyncStorage error handling).
- [ ] **Rehearse the Live Demonstration:** Practice the 5–7 minute walkthrough in Section H on your physical Android phone using Expo Go, including reset demo and fallback handling.
- [ ] **Confirm Remaining Academic Metadata:** Ensure your Roll Number, Course Code, Faculty Guide Name, and Submission Date are populated in the final documents.
- [ ] **Confirm Final Genuine Screenshots Inserted:** Verify that all 6 device screenshots are saved in `submission/screenshots/` and inserted into Figure placeholders in `EcoQuest_Project_Report.docx` and slides in `EcoQuest_College_Presentation.pptx`.


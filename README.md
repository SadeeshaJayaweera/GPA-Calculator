# GPA Mate LK — Sri Lankan University GPA Calculator & Academic Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v6-007FFF.svg)](https://mui.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange.svg)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75C4.svg)](https://aistudio.google.com/)
[![Tests](https://img.shields.io/badge/Vitest-14%20Passed-emerald.svg)](https://vitest.dev/)

A modern, production-grade **GPA + CGPA + Degree Class Prediction + Academic Planning platform** built specifically for **Sri Lankan university undergraduates** across state and private universities (SLIIT, NSBM, IIT, University of Colombo, University of Moratuwa, USJ, University of Kelaniya, University of Peradeniya, and all UGC degree programs).

> **Architect & Lead Developer**: **Sadeesha Jayaweera**  
> **Target Audience**: Sri Lankan undergraduate students pursuing BSc / BSc (Hons) in Software Engineering, Computer Science, Information Technology, Engineering, Business, and Physical Sciences.

---

## 📸 Application Screenshots

### 1. Dashboard & Cumulative GPA Calculator (Clean Light Mode)
*Ergonomic, distraction-free interface featuring a Material UI v6 App Bar, real-time degree classification progress bar, credit summary metrics, multi-semester management, and live credit-weighted grade-point calculations.*

![GPA Mate LK Dashboard Light Mode](docs/screenshots/dashboard-light.png?raw=true&v=2)

### 2. Academic Target & "What-If" Scenario Sandbox
*Determine the exact required future GPA to reach target degree classes (First Class, 2:1, 2:2) alongside interactive future module simulations with customizable credit weighting.*

![Target and Scenario Planner](docs/screenshots/planner.png?raw=true&v=2)

### 3. Google Gemini AI Academic Advisor (Grounded with Ground Truth)
*Intelligent conversational assistant powered by Google Gemini, personally greeting students by their Google account profile, automatically calculating remaining credit feasibility, and enforcing zero mathematical hallucinations.*

![Google Gemini AI Academic Advisor](docs/screenshots/ai-advisor.png?raw=true&v=2)

### 4. University Grading Scale Presets & Custom Classification Cutoffs
*Pre-configured grading systems for Sri Lankan UGC standard and top state/private universities (SLIIT, NSBM, IIT, Colombo, Moratuwa, USJ, Kelaniya, Peradeniya).*

![University Grading Scales](docs/screenshots/grading-scales.png?raw=true&v=2)

### 5. High-Contrast Dark Mode
*Engineered for night study sessions, featuring deep contrast palettes, fluid card elevation, and seamless theme synchronization.*

![GPA Mate LK Dashboard Dark Mode](docs/screenshots/dashboard-dark.png?raw=true&v=2)

---

## 🌟 Key Features

### 1. Credit-Weighted Deterministic GPA & CGPA Engine
- **Accurate Mathematical Formulations**: Calculates exact credit-weighted GPA:  
  $$\text{GPA} = \frac{\sum (\text{Credits} \times \text{Grade Point})}{\sum \text{Credits}}$$
- **Anti-Averaging Guardrail**: Never averages semester GPAs (a common pitfall in amateur calculators). Calculates true cumulative weighted grade points across all degree modules.
- **Sri Lankan UGC Grading Scale**: Full support for standard letter grades: A+ (4.0), A (4.0), A- (3.7), B+ (3.3), B (3.0), B- (2.7), C+ (2.3), C (2.0), C- (1.7), D+ (1.3), D (1.0), E (0.0).

### 2. Degree Classification Prediction & Progress Journey
- **Visual Continuum**: Tracks academic standing across Sri Lankan honours tiers:  
  `Pass (≥ 2.00)` $\rightarrow$ `Second Lower / 2:2 (≥ 3.00)` $\rightarrow$ `Second Upper / 2:1 (≥ 3.30)` $\rightarrow$ `First Class / 1st (≥ 3.70)`.
- **Target Points Delta**: Real-time feedback calculating the exact CGPA points needed to jump into the next classification bracket.
- **Confetti Celebration**: Dynamic achievement animation upon securing First Class standing.

### 3. Academic Target & "What Do I Need?" Planner
- **Required Future GPA Calculator**: Calculates the exact average GPA required across remaining credits to graduate with a desired CGPA:  
  $$\text{Required Future GPA} = \frac{\text{Target CGPA} \times (\text{Current Credits} + \text{Remaining Credits}) - \text{Current Weighted Points}}{\text{Remaining Credits}}$$
- **Maximum Possible CGPA**: Deterministically computes the mathematical ceiling (assuming 4.0 in all future modules).
- **Impossible Target Detection**: Flags mathematically unattainable targets and provides constructive academic advice (e.g. retake policies).

### 4. Google Authentication & Persistent Student Sessions
- **Real Google Sign-In**: Powered by Firebase Auth (`signInWithPopup`), allowing students to log in with their actual Google accounts.
- **Session Persistence**: Sessions are saved securely across browser closures and system restarts via `localStorage` and Firebase auth state.
- **User-Scoped Academic Data Sync**: Offline-first caching (`gpa_user_data_${userId}`) combined with Firestore synchronization ensures that your semesters, modules, and target CGPAs are safely saved to your personal account.
- **Seamless Gemini AI Linking**: Logging in with Google immediately switches on the Gemini AI Advisor with personalized student context.

### 5. Google Gemini AI Academic Advisor (Secure Server Architecture)
- **Zero Mathematical Hallucination**: AI is provided with verified mathematical ground truth calculated by the backend before prompting.
- **Student Personalization**: Greets students warmly by their Google account name and provides guidance customized to their enrolled university and degree.
- **Multi-Tier Resilience**: Robust client caller (`src/lib/geminiClient.ts`) that falls back gracefully across Vite proxy, direct backend socket, browser direct API, and deterministic offline heuristics.
- **Sri Lankan Academic Context**: Pre-trained system prompt provides strategic advice on continuous assessment (CA), high-credit module leverage, and peer revision circles.

### 6. Production-Grade Material UI Navigation & Ergonomics
- **Material UI v6 App Bar**: Responsive desktop and mobile navigation with tabs, avatar profile menu, and light/dark mode switch.
- **Pleasant Light & Dark Themes**: High-contrast, legible typography engineered to reduce eye strain during prolonged study sessions.
- **Local Persistence & Export**: Autosaves locally in `localStorage`. Includes printable academic transcript summary and CSV export.

---

## 🏛️ University Grading Scale Presets

Configured with pre-loaded presets and editable classification cutoffs for:
- **Sri Lankan UGC Standard (General)**
- **SLIIT (Sri Lanka Institute of Information Technology)**
- **NSBM Green University**
- **University of Colombo (UCSC & Faculty of Science)**
- **University of Moratuwa (Faculty of Engineering & IT)**
- **IIT / University of Westminster**
- **University of Sri Jayewardenepura (USJ)**
- **University of Kelaniya (UOK)**
- **University of Peradeniya (UOP)**
- **University of Ruhuna (UOR)**

---

## 🏗️ Architecture & Technology Stack

```
GPA-Calculator/
├── src/                          # React 19 + TypeScript Frontend
│   ├── components/
│   │   ├── layout/               # Material UI Navbar & Footer (with author attribution)
│   │   ├── auth/                 # GoogleSignInModal (Official Google Sign-In action)
│   │   ├── dashboard/            # GPASummaryCards, DegreeProgressBar, HowItCalculatedModal
│   │   ├── calculator/           # SemesterManager, SubjectTable, GradingScaleSidebar
│   │   ├── planner/              # TargetGPACalculator, ScenarioSandbox
│   │   ├── ai/                   # AIAdvisorChat (Gemini conversational interface)
│   │   ├── charts/               # AcademicCharts (Recharts line & bar visualizations)
│   │   ├── settings/             # AISettingsModal (Cloud API configuration)
│   │   ├── export/               # ExportReportModal (Print / CSV summary)
│   │   └── about/                # AboutSection (Degree bylaws & rules)
│   ├── contexts/
│   │   └── AuthContext.tsx       # Persistent Google session & Firebase auth management
│   ├── theme/
│   │   └── muiTheme.ts           # Material UI v6 unified theme system
│   ├── lib/
│   │   ├── firebase.ts           # Firebase App, Auth, and Firestore initialization
│   │   ├── db.ts                 # Offline-first user-scoped caching & cloud sync
│   │   ├── geminiClient.ts       # Multi-tier resilient Gemini caller
│   │   ├── gpaCalculator.ts      # Pure deterministic calculation functions
│   │   ├── defaultConfig.ts      # UGC standard & university grading presets
│   │   └── __tests__/            # Comprehensive Vitest unit test suite (14 tests)
│   ├── types/                    # Academic data models & TypeScript interfaces
│   ├── App.tsx                   # Main application controller with ThemeProvider
│   └── index.css                 # Tailwind CSS v4 styling & variables
├── server/                       # Node.js + Express TypeScript Backend
│   └── src/
│       ├── index.ts              # Express API server & static client handler
│       ├── routes/aiRoutes.ts    # Zod-validated /api/ai/advisor endpoint
│       └── services/geminiService.ts # Gemini API handler with math ground truth
├── docs/
│   └── screenshots/              # High-resolution application screenshots
├── scripts/
│   └── captureScreenshots.js     # Puppeteer automated screenshot generation script
├── vite.config.ts                # Vite config with backend proxy and Tailwind v4
└── package.json                  # Scripts for dev, test, screenshot capture, and build
```

---

## 🧪 Automated Testing

All core calculation functions are validated with automated unit tests covering all edge cases:

```bash
npm test
```

### Verified Test Cases:
1. Single 3-credit A $\rightarrow 4.00$
2. 3-credit A + 3-credit B $\rightarrow 3.50$
3. 3-credit A + 6-credit B $\rightarrow 3.33$
4. A+ and A both yield 4.00
5. Zero-credit case produces 0.00 (no NaN or crash)
6. Target GPA calculation accuracy
7. Mathematically impossible target detection
8. Maximum possible CGPA calculation
9. Sri Lankan degree classification boundaries (First Class, 2:1, 2:2, Pass, Fail)
10. Multi-semester credit weighting (strictly avoiding averaging semester GPAs)
11. Fractional & varying credit weights (1, 2, 3, 4, 6 credits)
12. Reactive updates on removing a subject
13. Reactive updates on changing grades
14. Reactive updates on changing credits

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; developed on Node v20)
- npm (v9+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SadeeshaJayaweera/GPA-Calculator.git
   cd GPA-Calculator
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key and Firebase credentials to `.env`:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here

   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Running Locally
Run both the Express backend and the Vite frontend concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Capturing Screenshots Automatically
To re-generate fresh screenshots with Puppeteer:
```bash
npm run capture:screenshots
```

### Building for Production
```bash
npm run build
npm start
```

---

## 👨‍💻 Author & Attribution

**Developed by Sadeesha Jayaweera**  
Dedicated to providing Sri Lankan university undergraduates with transparent, accurate, and accessible academic planning tools.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

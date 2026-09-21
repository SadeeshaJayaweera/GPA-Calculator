# GPA Mate LK — Sri Lankan University GPA Calculator & Academic Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-14%20Passed-emerald.svg)](https://vitest.dev/)

A modern, production-grade **GPA + CGPA + Degree Class Prediction + Academic Planning platform** built specifically for **Sri Lankan university undergraduates** across state and private universities (SLIIT, NSBM, IIT, University of Colombo, University of Moratuwa, USJ, University of Kelaniya, University of Peradeniya, and all UGC degree programs).

> **Architect & Lead Developer**: **Sadeesha Jayaweera**  
> **Target Audience**: Sri Lankan undergraduate students pursuing BSc / BSc (Hons) in Software Engineering, Computer Science, Information Technology, Engineering, Business, and Physical Sciences.

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

### 4. Interactive "What-If" Grade Simulator & Intelligent Combination Recipes
- **Upcoming Module Sandbox**: Add future modules (such as 6-credit Final Year Projects) and adjust expected grades to immediately observe projected CGPA changes.
- **Feasible Grade Combinations**: Generates feasible grade distributions (Balanced, High Performance, All-Round Excellence) ranked by academic effort.

### 5. Google Gemini AI Academic Advisor (Secure Server Architecture)
- **Zero Mathematical Hallucination**: AI is provided with verified mathematical ground truth calculated by the backend before prompting.
- **Secure Backend API**: `GEMINI_API_KEY` is kept strictly on the Node.js server in `.env` — never exposed in frontend bundles or client storage.
- **Sri Lankan Academic Context**: Pre-trained system prompt provides strategic advice on continuous assessment (CA), high-credit module leverage, and peer revision circles.
- **Offline / Zero-Config Mode**: Fallback advisory engine that operates deterministically even without an active API key.

### 6. Ergonomic Human-Computer Interaction (HCI) Design
- **Pleasant Light & Dark Themes**: High-contrast, legible typography (Inter & Outfit) engineered to reduce eye strain during prolonged study sessions.
- **Semester Management & Organization**: Grid navigation for fast switching between individual semesters and the full degree cumulative view.
- **Formula Transparency Modal**: Step-by-step arithmetic breakdown showing the student exactly why their GPA is what it is.
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
├── src/                          # React + TypeScript Frontend
│   ├── components/
│   │   ├── layout/               # Navbar & Footer (with Sadeesha Jayaweera attribution)
│   │   ├── dashboard/            # GPASummaryCards, DegreeProgressBar, HowItCalculatedModal
│   │   ├── calculator/           # SemesterManager, SubjectTable, GradingScaleSidebar
│   │   ├── planner/              # TargetGPACalculator, ScenarioSandbox
│   │   ├── ai/                   # AIAdvisorChat (Gemini conversational interface)
│   │   ├── charts/               # AcademicCharts (Recharts line & bar visualizations)
│   │   ├── settings/             # GradingSettingsModal
│   │   ├── export/               # ExportReportModal (Print / CSV summary)
│   │   └── about/                # AboutSection (HCI guidelines & degree rules)
│   ├── lib/
│   │   ├── gpaCalculator.ts      # Pure deterministic calculation functions
│   │   ├── defaultConfig.ts      # UGC standard & university grading presets
│   │   └── __tests__/            # Comprehensive Vitest unit test suite (14 tests)
│   ├── types/                    # Academic data models & TypeScript interfaces
│   ├── App.tsx                   # Main application controller
│   └── index.css                 # Tailwind CSS v4 styling & theme variables
├── server/                       # Node.js + Express TypeScript Backend
│   └── src/
│       ├── index.ts              # Express API server & static client handler
│       ├── routes/aiRoutes.ts    # Zod-validated /api/ai/advisor endpoint
│       └── services/geminiService.ts # Secure Gemini API handler with math ground truth
├── vite.config.ts                # Vite config with backend proxy and Tailwind v4
└── package.json                  # Scripts for dev, test, and build
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
3. Set up environment variables (optional for AI Advisor):
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to `.env` (obtain free at [Google AI Studio](https://aistudio.google.com/)):
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running Locally
Run both the Express backend and the Vite frontend concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

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
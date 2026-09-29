# Code Clinic — AI Debugging Doctor 🩺

A cross-platform mobile and web AI debugging doctor application built on Expo SDK 57, React Native, and Expo Router, based on the **Code Clinic** diagnostic system.

Operates like an attending physician in a code clinic: listens to symptoms, asks focused diagnostic clarifying questions, formulates root-cause hypotheses, checks fresh web documentation, prescribes minimal surgical code patches, and preserves cured cases in a neural RAG memory store.

---

## 🚀 Key Features

1. **Dr. Debug Consultation Flow**:
   - Intake evaluation with focused clarifying questions.
   - Diagnostic root cause analysis explaining *why* the bug occurs.
   - Surgical code patches with Before / After diff highlighting and one-click copy.
   - Prevention prescriptions to prevent bug recurrence.
   - "Did this solve it?" verification feedback loop.

2. **Emergency Room Triage (Instant Pre-loaded Cases)**:
   - **Next.js 15**: `cookies()` async Promise breaking change.
   - **Python 3.12**: asyncio `RuntimeError: Event loop is closed` with aiohttp.
   - **React 19 / 18**: `TypeError: Cannot read properties of undefined (reading 'map')` on initial render.
   - **Docker / DevOps**: `EACCES: permission denied` for non-root node user.

3. **Code ICU Interactive Sandbox**:
   - In-app execution laboratory for JavaScript/TypeScript and simulated Python.
   - Live stdout/stderr terminal output with execution exit codes.
   - macOS traffic lights aesthetic and language switcher.

4. **Patient Medical Chart**:
   - Live session tracking: Detected Language, Framework, OS / Runtime, and active Error Signature.
   - Diagnostic phase status (`INTAKE`, `DIAGNOSING`, `PRESCRIBED`, `CURED`).
   - Cured case count and clinical memory health.

5. **Clinical RAG Knowledge Store**:
   - Instant search across verified cures.
   - Confidence scoring and cure verification history.
   - 1-click case admission into the examining room.

---

## 🛠️ Running Locally

### Development Server
```bash
# Start Expo development server (Web, iOS, Android)
npx expo start

# Open Web directly
npx expo start --web

# Open iOS Simulator
npx expo start --ios

# Open Android Emulator
npx expo start --android
```

The app is currently running on `http://localhost:8081`.

---

## 🚢 Deployment

### 1. Web Deployment (Vercel, Netlify, Cloudflare Pages, GitHub Pages)
Export the static production bundle:
```bash
npx expo export --platform web --output-dir dist
```
The resulting `dist/` directory is static HTML/JS/CSS ready to deploy to any static host:
- **Vercel**: Deploy with `vercel deploy dist` or link repo with build command `npx expo export --platform web --output-dir dist`.
- **Netlify**: Set publish directory to `dist`.
- **GitHub Pages**: Upload `dist` to `gh-pages` branch.

### 2. Mobile App Deployment (iOS & Android via EAS)
Use Expo Application Services (EAS):
```bash
# Build cloud binaries
npx eas-cli build --platform all

# Submit to App Store & Google Play
npx eas-cli submit --platform all
```

---

## 📂 Project Architecture

```
allan-indrajith/
├── assets/images/
│   └── mascot.svg              # Minimalist Doctor Owl Mascot
├── src/
│   ├── app/
│   │   ├── _layout.tsx         # Theme & ClinicProvider root layout
│   │   ├── index.tsx           # Dr. Debug Consultation & Triage Screen
│   │   └── explore.tsx         # Code ICU Sandbox & Learning Vault Screen
│   ├── components/
│   │   ├── app-tabs.tsx        # Mobile tab navigator
│   │   ├── app-tabs.web.tsx    # Web header pill navigator
│   │   └── clinic/
│   │       ├── ClinicHeader.tsx       # Brand title, status pulse, session ID
│   │       ├── ConsultationView.tsx   # Dialogue stream, intake form & chat
│   │       ├── SurgicalDiffView.tsx   # Before/After diff, copy, & ICU testing
│   │       ├── PatientChartCard.tsx   # Medical vitals & stack detection
│   │       ├── CodeIcuCard.tsx        # Interactive sandbox terminal runner
│   │       ├── LearningVaultCard.tsx  # Searchable RAG knowledge store
│   │       ├── TriageCaseCarousel.tsx # Emergency room triage presets
│   │       └── MascotIcon.tsx         # Doctor Owl mascot component
│   ├── context/
│   │   └── ClinicContext.tsx   # Clinical session state & actions
│   ├── services/
│   │   └── clinicEngine.ts     # Diagnostics, heuristics, RAG search & sandbox
│   └── constants/
│       └── theme.ts            # Design tokens & typography
└── app.json                    # Expo configuration & app metadata
```

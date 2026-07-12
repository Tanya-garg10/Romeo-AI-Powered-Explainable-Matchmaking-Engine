# 💘 Romeo — AI Matchmaking App

> Production-ready AI matchmaking web app built for the AI Matchmaking Hackathon.

![Romeo](https://img.shields.io/badge/Romeo-AI_Matchmaker-e91e8c?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Add your Gemini API key
cp .env.example .env
# Edit .env and add: VITE_GEMINI_API_KEY=your_key_here

# Run development server
npm run dev

# Build for production
npm run build
```

---

## ✨ Features

### PS1 — Intelligent Matchmaker Engine
- 20 synthetic profiles with 17+ attributes
- Smart filtering (age, gender, deal breakers, goals, location)
- Weighted compatibility scoring across 7 dimensions
- Top 10 ranked matches with tags and summaries
- Detailed compatibility reports (pros, cons, trade-offs, risk factors)
- AI final recommendation comparing Top 3 matches (Gemini)

### PS2 — Parallel Hearts
- Three alternate timeline simulations per match
- Same City · Long Distance · Career Relocation
- Story generation via Gemini AI
- Metrics: communication, trust, conflict, growth, success probability
- Timeline comparison table

### Extra Features
- 💕 Love Meter with animated gauge
- 📡 Compatibility Radar Chart (recharts)
- 💬 AI Conversation Starters (Gemini)
- 🚩 Red Flag Detector with severity levels
- 📄 Download PDF Report (html2canvas + jsPDF)
- 🌗 Dark/Light mode toggle

---

## 🧠 Compatibility Scoring

| Dimension | Weight |
|-----------|--------|
| Shared Interests (hobbies) | 20% |
| Values Alignment | 20% |
| Personality Compatibility (MBTI) | 18% |
| Lifestyle Match | 14% |
| Relationship Goals | 14% |
| Location Proximity | 8% |
| Communication (languages) | 6% |

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + Vite 8 | Frontend framework |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion | Animations |
| Gemini 2.0 Flash | AI reasoning |
| Recharts | Radar chart |
| html2canvas + jsPDF | PDF export |
| React Router 6 | Navigation |
| Lucide React | Icons |

---

## 🔑 Gemini API

Get a free key at [aistudio.google.com](https://aistudio.google.com).

Without a key, Romeo uses intelligent fallback data for all AI features — the app is fully functional.

---

## 📁 Project Structure

```
romeo/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── MatchCard.jsx
│   │   ├── ScoreRing.jsx
│   │   ├── RadarChart.jsx
│   │   ├── LoveMeter.jsx
│   │   ├── RedFlagDetector.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ParticleBackground.jsx
│   ├── pages/            # Route pages
│   │   ├── Home.jsx
│   │   ├── Dataset.jsx
│   │   ├── Matches.jsx
│   │   ├── CompatibilityReport.jsx
│   │   ├── ParallelHearts.jsx
│   │   └── About.jsx
│   ├── context/          # Global state
│   │   └── AppContext.jsx
│   ├── utils/            # Core logic
│   │   ├── matchEngine.js    # Scoring algorithms
│   │   └── geminiService.js  # Gemini API calls
│   ├── data/
│   │   └── profiles.json     # 20 synthetic profiles
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── public/
    └── heart.svg
```

---

## 🎨 UI Features

- Glassmorphism cards
- Animated gradient backgrounds
- Floating particle system
- Framer Motion page transitions
- Responsive design (mobile → desktop)
- Dark/Light mode
- Animated score rings
- Gradient text effects

---

Built with ❤️ for the AI Matchmaking Hackathon

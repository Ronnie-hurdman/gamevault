# GameVault

## Overview

GameVault is a personal game library manager and discovery app. It lets users track games they own, build a wishlist, log play status, write reviews, and receive AI-powered game recommendations — all from a single, responsive web interface.

The app is built with React + TypeScript, styled with Tailwind CSS, backed by Firebase (Firestore) for data persistence, and uses the **Google Gemini API** to generate personalised game recommendations.

---

## Features

| Area | Details |
|---|---|
| **Dashboard** | At-a-glance stats: owned games, wishlist count, currently playing |
| **My Library** | Browse, filter, and manage owned games across Sony, Nintendo, and Steam |
| **Wishlist** | Track games you want to buy, with price and availability info |
| **Discovery** | Search and explore new titles |
| **AI Recommendations** | Gemini-powered suggestions based on your play history and preferences |
| **Walkthrough** | Step-by-step onboarding for new users |

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion / Motion
- **Icons:** Lucide React
- **Backend / DB:** Firebase Firestore
- **AI:** Google Gemini (`@google/genai`)

---

## Setup

**Prerequisites:** Node.js 18+

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd gamevault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   > A Gemini API key is required for the AI Recommendations feature. Get one at [Google AI Studio](https://aistudio.google.com/). If Google revokes a key because it was leaked, replace it locally and restart the dev server.

4. **Firebase**

   The app ships with a pre-configured Firebase project (`firebase-applet-config.json`). No additional Firebase setup is needed for local development unless you want to use your own project, in which case replace the values in that file with your own Firebase web app credentials.

---

## Running the App

```bash
npm run dev
```

The dev server starts at `http://localhost:3000`.

| Script | Description |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type-check (no emit) |

---

## Project Structure

```
src/
├── App.tsx                  # Root layout, navigation, view routing
├── types.ts                 # Shared TypeScript types (Game, Review, Recommendation)
├── components/
│   ├── Dashboard.tsx        # Overview stats and quick-access panels
│   ├── LibraryView.tsx      # Owned games list and filters
│   ├── WishlistView.tsx     # Wishlist management
│   ├── SearchDiscovery.tsx  # Game search and browse
│   ├── RecommendationsView.tsx  # AI-powered game suggestions
│   ├── GameCard.tsx         # Reusable game card component
│   └── Walkthrough.tsx      # Onboarding flow
├── hooks/
│   └── useGames.ts          # Firebase data-fetching hook
├── services/
│   └── geminiService.ts     # Gemini API integration
└── lib/
    └── utils.ts             # Utility helpers (cn, etc.)
```

---

## Current Status / Scope

- **Status:** Active development — MVP feature set complete.
- **Platforms supported:** Sony (PlayStation), Nintendo, Steam.
- **Authentication:** Firebase Auth is wired up; user-scoped data stored in Firestore.
- **AI Recommendations:** Functional with a valid Gemini API key; uses `gemini-3-flash-preview`.
- **Known limitations:**
  - No offline support.
  - Image URLs for games are user-supplied (no automatic cover art fetching yet).
  - Recommendation model availability depends on the Gemini preview programme.

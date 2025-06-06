# PaintMix Tech Stack

This project follows the decisions laid out in `requirements.md`. A short summary of the major technology choices is below.

| Layer | Choice | Notes |
| ----- | ------ | ----- |
| **Framework** | React 18 + TypeScript | Modern React with hooks and strong typing. |
| **Build** | Vite | Provides fast dev server and optimized builds. |
| **State Management** | React Context + zustand | Context provides app level providers while zustand offers a minimal global store. |
| **Data Persistence** | IndexedDB via `idb` | All user data lives in the browser with optional export/import. |
| **Colour Math** | `culori` with custom Kubelka–Munk utilities | Handles spectral → Lab conversions needed by the mixer. |
| **UI** | Tailwind CSS with optional shadcn/ui components | Utility styling and themable UI primitives. |
| **Charts** | `recharts` | Used for spectral plots and other charts. |
| **PWA** | `vite-plugin-pwa` | Generates the service worker and manifest for offline use. |
| **Testing** | Vitest + React Testing Library | For unit and component tests. |

The project is intended to deploy as a static Progressive Web App using GitHub Pages or Netlify.

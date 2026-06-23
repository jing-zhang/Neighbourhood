# Neighborhoods

**Hyper-local community discovery platform** — A static web prototype for connecting people in their immediate neighborhood.

![Version](https://img.shields.io/badge/phase-1--prototype-blue) ![Tests](https://img.shields.io/badge/tests-59_passing-brightgreen)

---

## Overview

Neighborhoods is a browser-based platform that helps neighbors discover events, safety alerts, free items, and local discussions happening around them. The current implementation is a **static web prototype** (Phase 1) built with vanilla JavaScript and Leaflet maps, ready for a future backend migration.

### Screens

| Desktop split-panel | Mobile feed view | Mobile map view |
|---|---|---|
| Feed (45%) + Map (55%) | Full-width feed | Full-width map |

---

## Features

- **Community Feed** — Post cards with category badges, distance, and timestamps
- **Category Filters** — All / Events / Safety / Free & Sale / General
- **Text Search** — Filter posts by title or summary keywords
- **Interactive Map** — Leaflet + OpenStreetMap with color-coded pins and popup previews
- **Feed ↔ Map Sync** — Hover a post card to highlight its map marker with pulse animation
- **Geolocation** — One-click "Locate Me" button or manual neighborhood input
- **Post Creation Modal** — Write a title, summary, and pick a category
- **Dark / Light Theme** — Glassmorphic dual-theme design with smooth transitions
- **Responsive Layout** — Split-panel on desktop, toggleable single-panel on mobile (768px + 480px breakpoints)
- **Keyboard Accessible** — `:focus-visible` indicators and `prefers-reduced-motion` support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core** | Vanilla JavaScript (ES modules) |
| **Styles** | CSS custom properties, glassmorphic design |
| **Map** | [Leaflet](https://leafletjs.com/) + OpenStreetMap (free, no API key) |
| **Bundling** | None — native ES module imports |
| **Server** | `python3 -m http.server 3000` |
| **Testing** | [Vitest](https://vitest.dev/) + jsdom (unit/integration) |
| **Smoke Tests** | [Playwright](https://playwright.dev/) (browser automation) |

---

## Project Structure

```
src/
├── styles/
│   ├── tokens.css        # CSS custom properties (light/dark themes)
│   └── app.css            # Component styles
├── data/
│   └── posts.js           # Seed data + category labels
├── lib/
│   ├── dom.js             # DOM helpers (qs, qsa, createElement)
│   ├── location.js        # Geolocation API wrapper
│   └── state.js           # Pub/sub state management
├── ui/
│   ├── feed.js            # Feed renderer + filters
│   ├── header.js          # Header controls (search, theme, location, post)
│   ├── map.js             # Leaflet map + markers + hover sync
│   └── modal.js           # Post creation modal
└── main.js                # Entry point, render loop

tests/
├── unit/                  # Unit tests (Vitest + jsdom)
│   ├── dom.test.js
│   ├── header.test.js
│   ├── location.test.js
│   ├── modal.test.js
│   └── state.test.js
├── integration/           # Cross-module user flow tests
│   └── app-flow.test.js   # 11 integration tests
└── smoke/                 # Browser automation tests
    └── neighborhoods.spec.js  # 11 Playwright tests

docs/superpowers/
├── specs/                 # UI design specification
├── plans/                 # Implementation plans
│   ├── tasks.md           # Task checklist (Given-When-Then)
│   ├── project-scope-analysis.md
│   ├── 2026-05-26-neighborhoods-static-implementation.md
│   └── 2026-05-28-neighborhoods-supabase-integration.md
```

---

## Getting Started

### Prerequisites

- Python 3 (for the dev server)
- Node.js 18+ (for testing tools)

### Install

```bash
git clone https://github.com/jing-zhang/Neighbourhood.git
cd Neighbourhood
npm install
```

### Run

```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### Run Tests

```bash
npm test                    # Unit + integration (Vitest)
npm run test:smoke          # Browser smoke tests (Playwright)
npm run test:all            # Everything
```

---

## Testing

The project has **59 tests** across three layers:

| Layer | Framework | Tests | Scope |
|-------|-----------|-------|-------|
| **Unit** | Vitest + jsdom | 37 | Individual modules: DOM helpers, state, location, header, modal |
| **Integration** | Vitest + jsdom | 11 | Cross-module user flows: filter, search, geolocation, modal, mobile toggle |
| **Smoke** | Playwright + Chromium | 11 | Real browser: page load, theme toggle, modal, responsive layout |

---

## Roadmap

### ✅ Phase 1 — Static Web Prototype (complete)

All nine implementation tasks are finished. See [`docs/superpowers/plans/tasks.md`](docs/superpowers/plans/tasks.md) for the full checklist.

### ⏳ Phase 2 — Supabase Backend

Planned in [`docs/superpowers/plans/2026-05-28-neighborhoods-supabase-integration.md`](docs/superpowers/plans/2026-05-28-neighborhoods-supabase-integration.md):

- User authentication (Supabase Auth)
- Real-time post CRUD with RLS policies
- Spatial queries for location-based feeds
- Reactions and comments
- User profiles

---

## License

MIT

# Neighborhoods Static Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current static `index.html` prototype into a feature-complete web-first Neighborhoods experience matching `project_blueprint.md` and `docs/superpowers/specs/2026-05-26-neighborhoods-ui-design.md`.

**Architecture:** Keep the current static HTML/CSS/JavaScript architecture for this implementation pass because the project currently has no package manifest or Expo scaffold. Split runtime behavior into small project-local JavaScript modules, document every function with JSDoc, cover pure functions and DOM renderers with Vitest/jsdom unit tests, cover cross-module user flows with integration tests, and keep final browser smoke checks for responsive and visual behavior.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript modules, browser Geolocation API, Leaflet + OpenStreetMap (free, no API key), Vitest, jsdom, Playwright/browser smoke verification.

> **Quick Reference:** See `tasks.md` for a concise task checklist.

---

## Source Inputs

- Blueprint: `project_blueprint.md`
- UI spec: `docs/superpowers/specs/2026-05-26-neighborhoods-ui-design.md`
- Current prototype: `index.html`

## File Structure

- Modify: `index.html`
  - Keep semantic shell markup only.
  - Load external CSS and JavaScript modules.
  - Preserve the current visual identity while removing inline behavior.
- Create: `src/styles/tokens.css`
  - Own light/dark theme variables, category colors, map tokens, typography tokens, shadows, and motion values.
- Create: `src/styles/app.css`
  - Own layout, responsive feed/map shell, glass panels, cards, modal, map pins, mobile segmented controls, and accessibility states.
- Create: `src/data/posts.js`
  - Own seed neighborhood posts with stable IDs, categories, coordinates, metadata, and UI labels.
- Create: `src/lib/dom.js`
  - Own small DOM helpers used by render modules.
- Create: `src/lib/location.js`
  - Own geolocation request, fallback neighborhood, and reverse-geocode interface.
- Create: `src/lib/state.js`
  - Own app state, pub/sub updates, and action functions.
- Create: `src/ui/feed.js`
  - Render filter chips and post cards, dispatch hover/select actions.
- Create: `src/ui/map.js`
  - Render Leaflet map with OpenStreetMap tiles, category pins, active pin scaling, pulse rings, and marker preview.
- Create: `src/ui/modal.js`
  - Render and validate the post creation modal.
- Create: `src/ui/header.js`
  - Wire search, theme toggle, geolocation, and new-post controls.
- Create: `src/main.js`
  - Bootstrap state, render modules, and event subscriptions.
- Create: `tests/smoke/neighborhoods.spec.js`
  - Browser smoke tests for theme, responsive view, hover sync, location fallback, and modal flow.
- Create: `tests/unit/dom.test.js`
  - Unit tests for DOM helper functions.
- Create: `tests/unit/location.test.js`
  - Unit tests for coordinate labeling and geolocation success/failure wrappers.
- Create: `tests/unit/state.test.js`
  - Unit tests for state subscriptions, filtering, resetting, and adding posts.
- Create: `tests/unit/feed.test.js`
  - Unit tests for feed rendering, filtering controls, and hover/click state transitions.
- Create: `tests/unit/header.test.js`
  - Unit tests for search, theme, new-post, location, and mobile-view header controls.
- Create: `tests/unit/map.test.js`
  - Unit tests for pin positioning, active marker selection, and map preview rendering.
- Create: `tests/unit/modal.test.js`
  - Unit tests for modal open/close rendering and form submission.
- Create: `tests/integration/app-flow.test.js`
  - jsdom integration tests across state, header controls, feed, map, location fallback, and modal flow.
- Create: `package.json`
  - Add local scripts for unit, integration, smoke, and all-tests verification.

## Test And Documentation Requirements

- Every JavaScript function, exported or internal, must have a JSDoc description explaining purpose, inputs, outputs, and thrown errors when relevant.
- Every exported function must have direct unit coverage unless it only wires already-tested functions together; wiring functions and internal event callbacks must be covered by integration tests.
- Every feature from the spec must have at least one test:
  - Theme switching: unit and integration.
  - Feed search/category filtering: unit and integration.
  - Feed hover to map active marker sync: unit, integration, and smoke.
  - Map pin rendering, active pulse class, and preview content: unit and smoke.
  - Geolocation success and denied/unavailable fallback: unit and integration.
  - Manual neighborhood picker: integration.
  - Post creation modal: unit, integration, and smoke.
  - Mobile feed/map toggle: integration and smoke.
- Viewport responsiveness (desktop 1024px+, tablet 768px, mobile 375px): smoke
- Use TDD for implementation tasks: write the failing test first, run it, implement the function, then run the focused test and full relevant suite.

## Task Dependencies

- Task 1 (Extract Markup/Tokens): No dependencies — start here
- Task 2 (Seed Data/State): Depends on Task 1
- Task 3 (Feed/Header): Depends on Task 2
- Task 4 (Map Canvas): Depends on Task 2
- Task 5 (Geolocation): Depends on Task 2 and Task 3
- Task 6 (Post Modal): Depends on Task 2 and Task 3

## Code Quality Requirements

- **ESLint**: Add ESLint with recommended configs for ES2022+ and browser globals
- **Prettier**: Add Prettier for consistent code formatting
- Run lint and format checks before commits

## Accessibility Requirements

- All interactive elements must be keyboard accessible (Tab, Enter, Space)
- Add skip link to bypass navigation
- All buttons and cards must have proper `aria-label` or semantic text
- Add `role`, `aria-expanded`, `aria-controls` attributes on interactive elements
- Focus states must be visible on all interactive elements
- Support `prefers-reduced-motion` for animations
- Color contrast must meet WCAG AA (4.5:1 for text)
- Screen reader testing with VoiceOver or NVDA
- Keyboard navigation: Arrow keys for map pins, Tab for cards

## Performance Requirements

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Total JavaScript bundle: < 200KB gzipped
- CSS bundle: < 50KB gzipped

## CSS Quality Requirements

- Replace broad `transition: all` with specific property transitions
- Use CSS custom properties for all colors (no hardcoded hex values)
- Add `prefers-reduced-motion` media query support for all animations
- Use `rem` units for spacing/sizing based on root font-size
- Ensure focus-visible for keyboard-only focus indicators

## UI Component Requirements

Based on the current mock UI in `index.html`, implement these missing features:

### Feed Panel
- Add category filter chips (Events, Safety, Free/Sale, General, All) in feed header
- Connect search input to filter posts by title/summary
- Connect filter button to toggle category filters

### Header
- Add location display picker (manual neighborhood input + "Locate Me" button)
- Connect New Post button to open modal

### Mobile Responsiveness
- Add viewport breakpoint handling (768px, 480px)
- Implement feed/map toggle for mobile (segmented control)
- Stack layout vertically on mobile

### Map Interactions
- Improve tooltip positioning logic (handle edge cases)
- Add click-to-select behavior on pins
- Connect pins to update active post state

## Task 1: Extract Markup, Tokens, And Static Assets

**Files:**
- Modify: `index.html`
- Create: `src/styles/tokens.css`
- Create: `src/styles/app.css`

- [x] **Step 1: Create CSS token file**

Create `src/styles/tokens.css`:

```css
:root {
  --font-family: "Outfit", "Inter", system-ui, sans-serif;
  --radius-panel: 24px;
  --radius-card: 8px;
  --radius-control: 10px;
  --duration-fast: 160ms;
  --duration-normal: 280ms;
}

:root[data-theme="light"] {
  --bg-main: radial-gradient(circle at 0% 0%, #f3f8fa 0%, #eef5f8 100%);
  --sidebar-bg: rgba(255, 255, 255, 0.45);
  --glass-bg: rgba(255, 255, 255, 0.45);
  --glass-border: rgba(255, 255, 255, 0.6);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
  --backdrop-blur: blur(16px);
  --text-main: #1e293b;
  --text-muted: #64748b;
  --surface-strong: rgba(255, 255, 255, 0.72);
  --input-bg: rgba(255, 255, 255, 0.6);
  --input-border: rgba(255, 255, 255, 0.8);
  --primary-teal: hsl(172, 100%, 35%);
  --primary-teal-glow: rgba(0, 178, 154, 0.18);
  --color-safety: hsl(12, 95%, 55%);
  --color-event: hsl(265, 85%, 60%);
  --color-sale: hsl(40, 95%, 45%);
  --color-general: hsl(185, 75%, 45%);
  --map-water: #e0f2fe;
  --map-land: #f1f5f9;
  --map-road: #ffffff;
  --map-park: #dcfce7;
  --map-border: #cbd5e1;
}

:root[data-theme="dark"] {
  --bg-main: radial-gradient(circle at 0% 0%, #0f172a 0%, #020617 100%);
  --sidebar-bg: rgba(15, 23, 42, 0.4);
  --glass-bg: rgba(15, 23, 42, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --backdrop-blur: blur(16px);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --surface-strong: rgba(15, 23, 42, 0.82);
  --input-bg: rgba(15, 23, 42, 0.7);
  --input-border: rgba(255, 255, 255, 0.05);
  --primary-teal: hsl(172, 100%, 45%);
  --primary-teal-glow: rgba(0, 229, 198, 0.25);
  --color-safety: hsl(355, 100%, 60%);
  --color-event: hsl(272, 100%, 65%);
  --color-sale: hsl(43, 100%, 50%);
  --color-general: hsl(190, 100%, 48%);
  --map-water: #0c1c30;
  --map-land: #0b0f17;
  --map-road: #1e293b;
  --map-park: #062f1d;
  --map-border: #1e293b;
}
```

- [x] **Step 2: Move current inline CSS into `src/styles/app.css`**

Copy the current inline `<style>` rules from `index.html` into `src/styles/app.css`, then remove the `<style>` block from `index.html`.

- [x] **Step 3: Link extracted stylesheets**

Add these lines in `index.html` after the Google Fonts `<link>` tags:

```html
<link rel="stylesheet" href="./src/styles/tokens.css">
<link rel="stylesheet" href="./src/styles/app.css">
```

- [x] **Step 4: Add module entrypoint**

Add this script before `</body>`:

```html
<script type="module" src="./src/main.js"></script>
```

- [x] **Step 5: Verify static rendering**

Run: `Start-Process "file:///D:/SourceCode/playground/neighbour/index.html"`

Expected: the existing app renders with the same layout, fonts, light theme, sidebar, feed, and map area visible.

- [x] **Step 6: Commit**

```bash
git add index.html src/styles/tokens.css src/styles/app.css
git commit -m "refactor: extract static app styles"
```

If this project remains outside git, record the completed task in this plan by checking the task box.

## Task 2: Define Seed Data And App State

**Files:**
- Create: `src/data/posts.js`
- Create: `src/lib/state.js`
- Create: `src/lib/dom.js`
- Create: `src/main.js`

- [ ] **Step 1: Create post data**

Create `src/data/posts.js`:

```js
export const categoryLabels = {
  event: "Events",
  safety: "Safety",
  sale: "Free/Sale",
  general: "General"
};

export const seedPosts = [
  {
    id: "post-farmers-market",
    category: "event",
    title: "Saturday farmers market pop-up",
    summary: "Local growers are setting up on Queen Street from 9 AM to 2 PM.",
    author: "Maya Chen",
    distance: "0.2 km",
    time: "18 min ago",
    lat: 43.6539,
    lng: -79.3842,
    reactions: 24,
    comments: 8
  },
  {
    id: "post-bike-light",
    category: "safety",
    title: "Bike light check near the park",
    summary: "Several riders reported low visibility at the Adelaide crossing after dusk.",
    author: "Jordan Lee",
    distance: "0.5 km",
    time: "41 min ago",
    lat: 43.6512,
    lng: -79.3895,
    reactions: 17,
    comments: 5
  },
  {
    id: "post-desk-giveaway",
    category: "sale",
    title: "Small desk available for pickup",
    summary: "Compact walnut desk in good shape. Porch pickup before Thursday evening.",
    author: "Priya Shah",
    distance: "0.7 km",
    time: "1 hr ago",
    lat: 43.6571,
    lng: -79.381,
    reactions: 9,
    comments: 3
  },
  {
    id: "post-book-club",
    category: "general",
    title: "Neighborhood book club vote",
    summary: "Vote between three June picks and suggest a quiet patio for the meetup.",
    author: "Sam Rivera",
    distance: "0.9 km",
    time: "2 hr ago",
    lat: 43.6497,
    lng: -79.3826,
    reactions: 31,
    comments: 14
  }
];
```

- [ ] **Step 2: Create DOM helpers**

Create `src/lib/dom.js`:

```js
/**
 * Returns the first element matching a required selector.
 * @param {string} selector CSS selector to query.
 * @param {ParentNode} root Parent node to search within.
 * @returns {Element} The matching element.
 * @throws {Error} When no element matches the selector.
 */
export function qs(selector, root = document) {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}

/**
 * Returns all elements matching a selector as an array.
 * @param {string} selector CSS selector to query.
 * @param {ParentNode} root Parent node to search within.
 * @returns {Element[]} Matching elements.
 */
export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Creates a DOM element with optional class and text content.
 * @param {string} tag HTML tag name to create.
 * @param {string} className Class name to apply.
 * @param {string} text Text content to assign.
 * @returns {HTMLElement} The created element.
 */
export function createElement(tag, className, text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}
```

- [ ] **Step 3: Create state store**

Create `src/lib/state.js`:

```js
import { seedPosts } from "../data/posts.js";

const listeners = new Set();

export const state = {
  theme: document.documentElement.dataset.theme || "light",
  query: "",
  activeCategory: "all",
  activePostId: seedPosts[0].id,
  hoveredPostId: null,
  mobileView: "feed",
  location: {
    label: "Downtown Toronto",
    status: "idle",
    center: { lat: 43.6532, lng: -79.3832 }
  },
  posts: [...seedPosts],
  modalOpen: false
};

/**
 * Subscribes to state changes and returns an unsubscribe callback.
 * @param {(state: typeof import("./state.js").state) => void} listener Function called after each state patch.
 * @returns {() => void} Function that removes the listener.
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Applies a partial state patch and notifies subscribers.
 * @param {Partial<typeof state>} patch State keys to merge into the current state.
 * @returns {void}
 */
export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((listener) => listener(state));
}

/**
 * Returns posts matching the active category and text query.
 * @returns {Array<typeof seedPosts[number]>} Filtered posts.
 */
export function filteredPosts() {
  const query = state.query.trim().toLowerCase();
  return state.posts.filter((post) => {
    const matchesCategory = state.activeCategory === "all" || post.category === state.activeCategory;
    const matchesQuery = !query || `${post.title} ${post.summary} ${post.author}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}
```

- [ ] **Step 4: Create bootstrap file**

Create `src/main.js`:

```js
import { state, subscribe } from "./lib/state.js";

/**
 * Applies current state values to the document shell.
 * @returns {void}
 */
function render() {
  document.documentElement.dataset.theme = state.theme;
}

subscribe(render);
render();
```

- [ ] **Step 5: Verify module loading**

Open browser DevTools on `index.html`.

Expected: console has no module import errors and `document.documentElement.dataset.theme` equals `"light"`.

- [ ] **Step 6: Commit**

```bash
git add src/data/posts.js src/lib/dom.js src/lib/state.js src/main.js
git commit -m "feat: add app data and state"
```

## Task 3: Render Feed, Filters, Search, And Hover State

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Create: `src/ui/feed.js`
- Create: `src/ui/header.js`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Add render anchors**

In `index.html`, replace hard-coded feed cards and category filters with:

```html
<div class="filter-row" data-filter-row></div>
<section class="feed-list" data-feed-list aria-label="Neighborhood posts"></section>
```

Add `data-search-input` to the global search input and `data-theme-toggle` to the theme button.

- [ ] **Step 2: Create feed renderer**

Create `src/ui/feed.js`:

```js
import { categoryLabels } from "../data/posts.js";
import { filteredPosts, setState, state } from "../lib/state.js";
import { qs } from "../lib/dom.js";

const categories = [["all", "All"], ...Object.entries(categoryLabels)];

/**
 * Renders category filters and filtered neighborhood post cards.
 * @returns {void}
 */
export function renderFeed() {
  const filterRow = qs("[data-filter-row]");
  const feedList = qs("[data-feed-list]");

  filterRow.innerHTML = categories.map(([value, label]) => `
    <button class="filter-chip ${state.activeCategory === value ? "active" : ""}" data-category="${value}" type="button">
      ${label}
    </button>
  `).join("");

  const posts = filteredPosts();
  feedList.innerHTML = posts.map((post) => `
    <article class="post-card ${state.activePostId === post.id ? "active" : ""}" data-post-id="${post.id}" tabindex="0">
      <div class="post-card__meta">
        <span class="category-dot category-${post.category}"></span>
        <span>${categoryLabels[post.category]}</span>
        <span>${post.distance}</span>
        <span>${post.time}</span>
      </div>
      <h2>${post.title}</h2>
      <p>${post.summary}</p>
      <footer>
        <span>${post.author}</span>
        <span>${post.reactions} reactions</span>
        <span>${post.comments} comments</span>
      </footer>
    </article>
  `).join("");

  filterRow.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => setState({ activeCategory: button.dataset.category }));
  });

  feedList.querySelectorAll("[data-post-id]").forEach((card) => {
    const postId = card.dataset.postId;
    card.addEventListener("mouseenter", () => setState({ hoveredPostId: postId, activePostId: postId }));
    card.addEventListener("mouseleave", () => setState({ hoveredPostId: null }));
    card.addEventListener("focus", () => setState({ hoveredPostId: postId, activePostId: postId }));
    card.addEventListener("click", () => setState({ activePostId: postId }));
  });
}
```

- [ ] **Step 3: Create header controls**

Create `src/ui/header.js`:

```js
import { qs } from "../lib/dom.js";
import { setState, state } from "../lib/state.js";

/**
 * Attaches header-level event handlers for search and theme controls.
 * @returns {void}
 */
export function bindHeaderControls() {
  qs("[data-search-input]").addEventListener("input", (event) => {
    setState({ query: event.target.value });
  });

  qs("[data-theme-toggle]").addEventListener("click", () => {
    setState({ theme: state.theme === "light" ? "dark" : "light" });
  });
}
```

- [ ] **Step 4: Wire render functions**

Update `src/main.js`:

```js
import { state, subscribe } from "./lib/state.js";
import { renderFeed } from "./ui/feed.js";
import { bindHeaderControls } from "./ui/header.js";

/**
 * Renders all state-driven UI regions for the current app state.
 * @returns {void}
 */
function render() {
  document.documentElement.dataset.theme = state.theme;
  renderFeed();
}

bindHeaderControls();
subscribe(render);
render();
```

- [ ] **Step 5: Add feed styles**

Append to `src/styles/app.css`:

```css
.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  border: 1px solid var(--glass-border);
  background: var(--input-bg);
  color: var(--text-muted);
  border-radius: var(--radius-control);
  padding: 8px 12px;
  cursor: pointer;
}

.filter-chip.active,
.filter-chip:hover {
  color: var(--primary-teal);
  box-shadow: 0 0 0 3px var(--primary-teal-glow);
}

.feed-list {
  display: grid;
  gap: 12px;
  overflow-y: auto;
}

.post-card {
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  background: var(--glass-bg);
  box-shadow: var(--glass-shadow);
  padding: 16px;
  cursor: pointer;
}

.post-card.active,
.post-card:hover,
.post-card:focus-visible {
  outline: none;
  border-color: var(--primary-teal);
  box-shadow: 0 0 0 3px var(--primary-teal-glow), var(--glass-shadow);
}
```

- [ ] **Step 6: Verify feed behavior**

Open `index.html`.

Expected:
- Clicking category chips filters cards.
- Typing `desk` shows only the desk post.
- Toggling theme changes light and dark variables.
- Hovering a card changes its active visual state.

- [ ] **Step 7: Commit**

```bash
git add index.html src/main.js src/ui/feed.js src/ui/header.js src/styles/app.css
git commit -m "feat: render searchable neighborhood feed"
```

## Task 4: Render Map Canvas, Pins, Pulse, And Info Preview

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Create: `src/ui/map.js`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Add map anchors**

In `index.html`, replace the hard-coded map content with:

```html
<section class="map-panel" aria-label="Neighborhood map">
  <div class="map-canvas" data-map-canvas></div>
  <aside class="map-preview" data-map-preview></aside>
</section>
```

- [ ] **Step 2: Create map renderer**

Create `src/ui/map.js`:

```js
import { categoryLabels } from "../data/posts.js";
import { state, setState } from "../lib/state.js";
import { qs } from "../lib/dom.js";

/**
 * Converts post coordinates into bounded percentage coordinates for the mock map canvas.
 * @param {{lat: number, lng: number}} post Post or coordinate-like object.
 * @returns {{x: number, y: number}} Percentage coordinates bounded to the visible canvas.
 */
function toCanvasPosition(post) {
  const latOffset = (post.lat - state.location.center.lat) * 900;
  const lngOffset = (post.lng - state.location.center.lng) * 900;
  return {
    x: Math.max(8, Math.min(92, 50 + lngOffset)),
    y: Math.max(8, Math.min(92, 50 - latOffset))
  };
}

/**
 * Renders the map surface, category pins, active pulse state, and active post preview.
 * @returns {void}
 */
export function renderMap() {
  const canvas = qs("[data-map-canvas]");
  const preview = qs("[data-map-preview]");
  const activeId = state.hoveredPostId || state.activePostId;
  const activePost = state.posts.find((post) => post.id === activeId) || state.posts[0];

  canvas.innerHTML = `
    <div class="map-layer map-layer--water"></div>
    <div class="map-layer map-layer--park"></div>
    <div class="map-road map-road--one"></div>
    <div class="map-road map-road--two"></div>
    <div class="map-road map-road--three"></div>
    ${state.posts.map((post) => {
      const position = toCanvasPosition(post);
      const active = post.id === activeId;
      return `
        <button
          class="map-pin category-${post.category} ${active ? "active" : ""}"
          style="left:${position.x}%; top:${position.y}%"
          data-map-pin="${post.id}"
          type="button"
          aria-label="${categoryLabels[post.category]}: ${post.title}"
        >
          <span class="map-pin__pulse"></span>
        </button>
      `;
    }).join("")}
  `;

  preview.innerHTML = `
    <span class="category-label category-${activePost.category}">${categoryLabels[activePost.category]}</span>
    <h2>${activePost.title}</h2>
    <p>${activePost.summary}</p>
    <span>${activePost.distance} from ${state.location.label}</span>
  `;

  canvas.querySelectorAll("[data-map-pin]").forEach((pin) => {
    pin.addEventListener("click", () => setState({ activePostId: pin.dataset.mapPin }));
  });
}
```

- [ ] **Step 3: Wire map renderer**

Update `src/main.js`:

```js
import { state, subscribe } from "./lib/state.js";
import { renderFeed } from "./ui/feed.js";
import { bindHeaderControls } from "./ui/header.js";
import { renderMap } from "./ui/map.js";

/**
 * Renders all state-driven UI regions for the current app state.
 * @returns {void}
 */
function render() {
  document.documentElement.dataset.theme = state.theme;
  renderFeed();
  renderMap();
}

bindHeaderControls();
subscribe(render);
render();
```

- [ ] **Step 4: Add map styles**

Append to `src/styles/app.css`:

```css
.map-panel {
  position: relative;
  min-height: 420px;
  overflow: hidden;
  border-left: 1px solid var(--glass-border);
}

.map-canvas {
  position: absolute;
  inset: 0;
  background: var(--map-land);
  overflow: hidden;
}

.map-layer,
.map-road {
  position: absolute;
  pointer-events: none;
}

.map-layer--water {
  inset: auto -10% -20% -10%;
  height: 42%;
  background: var(--map-water);
  border-radius: 50% 50% 0 0;
}

.map-layer--park {
  left: 8%;
  top: 10%;
  width: 28%;
  height: 24%;
  border-radius: 40%;
  background: var(--map-park);
}

.map-road {
  background: var(--map-road);
  border: 1px solid var(--map-border);
  border-radius: 999px;
}

.map-road--one {
  left: 5%;
  right: 5%;
  top: 42%;
  height: 18px;
  transform: rotate(-8deg);
}

.map-road--two {
  top: 5%;
  bottom: 8%;
  left: 58%;
  width: 18px;
  transform: rotate(10deg);
}

.map-road--three {
  left: 18%;
  right: 12%;
  top: 66%;
  height: 14px;
  transform: rotate(18deg);
}

.map-pin {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 2px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
}

.map-pin.active {
  transform: translate(-50%, -50%) scale(1.5);
  z-index: 3;
}

.map-pin__pulse {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1px solid currentColor;
  opacity: 0;
}

.map-pin.active .map-pin__pulse {
  animation: markerPulse 1.4s infinite;
}

@keyframes markerPulse {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

.category-event { background-color: var(--color-event); color: var(--color-event); }
.category-safety { background-color: var(--color-safety); color: var(--color-safety); }
.category-sale { background-color: var(--color-sale); color: var(--color-sale); }
.category-general { background-color: var(--color-general); color: var(--color-general); }

.map-preview {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  padding: 16px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  background: var(--surface-strong);
  box-shadow: var(--glass-shadow);
  backdrop-filter: var(--backdrop-blur);
}
```

- [ ] **Step 5: Verify map sync**

Open `index.html`.

Expected:
- Four pins render in category colors.
- Hovering a feed card scales the matching pin to `1.5x`.
- The active pin shows a pulse ring.
- Clicking a pin updates the map preview.

- [ ] **Step 6: Commit**

```bash
git add index.html src/main.js src/ui/map.js src/styles/app.css
git commit -m "feat: add synchronized map canvas"
```

## Task 5: Add Geolocation And Manual Neighborhood Picker

**Files:**
- Modify: `index.html`
- Create: `src/lib/location.js`
- Modify: `src/ui/header.js`
- Modify: `src/main.js`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Add location controls**

Add this markup to the header near search:

```html
<div class="location-control">
  <button class="icon-button" type="button" data-location-button aria-label="Use current location">Locate</button>
  <input class="location-input" data-location-input type="text" value="Downtown Toronto" aria-label="Neighborhood">
</div>
```

- [ ] **Step 2: Create location module**

Create `src/lib/location.js`:

```js
/**
 * Requests the browser's current geolocation coordinates.
 * @returns {Promise<{lat: number, lng: number}>} Current latitude and longitude.
 * @throws {Error} When geolocation is unavailable or permission is denied.
 */
export function requestCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is unavailable in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }),
      () => reject(new Error("Location permission was denied.")),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

/**
 * Formats coordinates into a short human-readable neighborhood label.
 * @param {{lat: number, lng: number}} coords Coordinates to format.
 * @returns {string} Display label for the current area.
 */
export function labelForCoordinates(coords) {
  const lat = coords.lat.toFixed(3);
  const lng = coords.lng.toFixed(3);
  return `Current area (${lat}, ${lng})`;
}
```

- [ ] **Step 3: Wire location controls**

Replace `src/ui/header.js` with:

```js
import { qs } from "../lib/dom.js";
import { labelForCoordinates, requestCurrentPosition } from "../lib/location.js";
import { setState, state } from "../lib/state.js";

/**
 * Attaches header-level event handlers for search, theme, and location controls.
 * @returns {void}
 */
export function bindHeaderControls() {
  qs("[data-search-input]").addEventListener("input", (event) => {
    setState({ query: event.target.value });
  });

  qs("[data-theme-toggle]").addEventListener("click", () => {
    setState({ theme: state.theme === "light" ? "dark" : "light" });
  });

  qs("[data-location-input]").addEventListener("change", (event) => {
    setState({
      location: {
        ...state.location,
        label: event.target.value.trim() || "Downtown Toronto",
        status: "manual"
      }
    });
  });

  qs("[data-location-button]").addEventListener("click", async () => {
    setState({ location: { ...state.location, status: "loading" } });
    try {
      const center = await requestCurrentPosition();
      setState({ location: { label: labelForCoordinates(center), status: "located", center } });
      qs("[data-location-input]").value = labelForCoordinates(center);
    } catch (error) {
      setState({ location: { ...state.location, status: "blocked" } });
      qs("[data-location-input]").value = state.location.label;
    }
  });
}
```

- [ ] **Step 4: Add location styles**

Append to `src/styles/app.css`:

```css
.location-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-input {
  min-width: 180px;
  border: 1px solid var(--input-border);
  border-radius: var(--radius-control);
  background: var(--input-bg);
  color: var(--text-main);
  padding: 8px 10px;
}

.icon-button {
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-control);
  background: var(--input-bg);
  color: var(--text-main);
  padding: 8px 10px;
  cursor: pointer;
}
```

- [ ] **Step 5: Verify geolocation states**

Open `index.html` in a browser.

Expected:
- Editing the neighborhood input updates the map preview label.
- Clicking `Locate` prompts for browser location when supported.
- Denying permission keeps the manual neighborhood and does not throw console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html src/lib/location.js src/ui/header.js src/styles/app.css
git commit -m "feat: add location controls"
```

## Task 6: Add Post Creation Modal

**Files:**
- Modify: `index.html`
- Modify: `src/lib/state.js`
- Create: `src/ui/modal.js`
- Modify: `src/ui/header.js`
- Modify: `src/main.js`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Add modal root**

Add this before the module script in `index.html`:

```html
<div data-modal-root></div>
```

Add `data-new-post-button` to the new-post button.

- [ ] **Step 2: Add state action for posts**

Append to `src/lib/state.js`:

```js
/**
 * Creates a new neighborhood post from form input and activates it in the UI.
 * @param {{title: string, summary: string, category: string, author: string}} post User-entered post data.
 * @returns {void}
 */
export function addPost(post) {
  const nextPost = {
    ...post,
    id: `post-${Date.now()}`,
    time: "Just now",
    distance: "0.1 km",
    reactions: 0,
    comments: 0,
    lat: state.location.center.lat + 0.001,
    lng: state.location.center.lng - 0.001
  };

  setState({
    posts: [nextPost, ...state.posts],
    activePostId: nextPost.id,
    modalOpen: false
  });
}
```

- [ ] **Step 3: Create modal renderer**

Create `src/ui/modal.js`:

```js
import { categoryLabels } from "../data/posts.js";
import { addPost, setState, state } from "../lib/state.js";
import { qs } from "../lib/dom.js";

/**
 * Renders the post creation modal when open and wires close/submit actions.
 * @returns {void}
 */
export function renderModal() {
  const root = qs("[data-modal-root]");
  if (!state.modalOpen) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <form class="post-modal" data-post-form>
        <header>
          <h2>Create neighborhood post</h2>
          <button type="button" class="icon-button" data-close-modal aria-label="Close">Close</button>
        </header>
        <label>
          Title
          <input name="title" required maxlength="80">
        </label>
        <label>
          Summary
          <textarea name="summary" required maxlength="220"></textarea>
        </label>
        <label>
          Category
          <select name="category">
            ${Object.entries(categoryLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
          </select>
        </label>
        <footer>
          <button type="button" class="icon-button" data-close-modal>Cancel</button>
          <button type="submit" class="btn-post">Post</button>
        </footer>
      </form>
    </div>
  `;

  root.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => setState({ modalOpen: false }));
  });

  qs("[data-post-form]", root).addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    addPost({
      title: String(formData.get("title")).trim(),
      summary: String(formData.get("summary")).trim(),
      category: String(formData.get("category")),
      author: "You"
    });
  });
}
```

- [ ] **Step 4: Wire modal open and render**

In `src/ui/header.js`, add this inside `bindHeaderControls()`:

```js
qs("[data-new-post-button]").addEventListener("click", () => {
  setState({ modalOpen: true });
});
```

Update `src/main.js`:

```js
import { state, subscribe } from "./lib/state.js";
import { renderFeed } from "./ui/feed.js";
import { bindHeaderControls } from "./ui/header.js";
import { renderMap } from "./ui/map.js";
import { renderModal } from "./ui/modal.js";

/**
 * Renders all state-driven UI regions for the current app state.
 * @returns {void}
 */
function render() {
  document.documentElement.dataset.theme = state.theme;
  renderFeed();
  renderMap();
  renderModal();
}

bindHeaderControls();
subscribe(render);
render();
```

- [ ] **Step 5: Add modal styles**

Append to `src/styles/app.css`:

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2, 6, 23, 0.48);
  z-index: 20;
}

.post-modal {
  width: min(440px, calc(100vw - 32px));
  display: grid;
  gap: 14px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  background: var(--surface-strong);
  color: var(--text-main);
  padding: 18px;
  box-shadow: var(--glass-shadow);
}

.post-modal header,
.post-modal footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.post-modal label {
  display: grid;
  gap: 6px;
  color: var(--text-muted);
  font-size: 13px;
}

.post-modal input,
.post-modal textarea,
.post-modal select {
  border: 1px solid var(--input-border);
  border-radius: var(--radius-control);
  background: var(--input-bg);
  color: var(--text-main);
  padding: 10px;
}
```

- [ ] **Step 6: Verify modal flow**

Open `index.html`.

Expected:
- Clicking the post button opens the modal.
- Empty submit is blocked by browser validation.
- Submitting valid title, summary, and category prepends a new post.
- New post appears in the feed and active map preview.

- [ ] **Step 7: Commit**

```bash
git add index.html src/lib/state.js src/ui/modal.js src/ui/header.js src/main.js src/styles/app.css
git commit -m "feat: add post creation modal"
```

## Task 7: Add Responsive Mobile Feed/Map Toggle

**Files:**
- Modify: `index.html`
- Modify: `src/ui/header.js`
- Modify: `src/main.js`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Add mobile view controls**

Add this inside the header:

```html
<div class="view-toggle" data-view-toggle aria-label="Mobile view selector">
  <button type="button" data-view="feed" class="active">Feed</button>
  <button type="button" data-view="map">Map</button>
</div>
```

Add `data-main-content` to the element that wraps the feed and map panes.

- [ ] **Step 2: Wire mobile view state**

In `src/ui/header.js`, add this inside `bindHeaderControls()`:

```js
document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    setState({ mobileView: button.dataset.view });
  });
});
```

In `src/main.js`, add this inside `render()`:

```js
document.querySelector("[data-main-content]")?.setAttribute("data-mobile-view", state.mobileView);
document.querySelectorAll("[data-view]").forEach((button) => {
  button.classList.toggle("active", button.dataset.view === state.mobileView);
});
```

- [ ] **Step 3: Add responsive styles**

Append to `src/styles/app.css`:

```css
.view-toggle {
  display: none;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-control);
  overflow: hidden;
}

.view-toggle button {
  border: 0;
  background: transparent;
  color: var(--text-muted);
  padding: 8px 12px;
  cursor: pointer;
}

.view-toggle button.active {
  background: var(--primary-teal);
  color: #fff;
}

@media (max-width: 767px) {
  body {
    padding: 0;
    overflow: auto;
  }

  .app-window {
    min-height: 100vh;
    height: auto;
    border-radius: 0;
  }

  .sidebar {
    display: none;
  }

  .app-header {
    flex-wrap: wrap;
    height: auto;
    padding: 12px;
    gap: 10px;
  }

  .global-search,
  .location-control,
  .location-input {
    width: 100%;
    min-width: 0;
  }

  .view-toggle {
    display: flex;
  }

  [data-main-content] {
    display: block;
  }

  [data-main-content][data-mobile-view="feed"] .map-panel {
    display: none;
  }

  [data-main-content][data-mobile-view="map"] .feed-panel {
    display: none;
  }

  .map-panel {
    min-height: calc(100vh - 160px);
    border-left: 0;
  }
}
```

- [ ] **Step 4: Verify mobile behavior**

Open `index.html` and resize viewport to `390x844`.

Expected:
- Sidebar is hidden.
- Feed/Map segmented control is visible.
- Feed view shows only posts.
- Map view shows only map canvas.
- No text overlaps controls.

- [ ] **Step 5: Commit**

```bash
git add index.html src/ui/header.js src/main.js src/styles/app.css
git commit -m "feat: add mobile feed map toggle"
```

## Task 8: Add Unit, Integration, And Browser Smoke Tests

**Files:**
- Create: `package.json`
- Create: `tests/unit/dom.test.js`
- Create: `tests/unit/location.test.js`
- Create: `tests/unit/state.test.js`
- Create: `tests/unit/feed.test.js`
- Create: `tests/unit/header.test.js`
- Create: `tests/unit/map.test.js`
- Create: `tests/unit/modal.test.js`
- Create: `tests/integration/app-flow.test.js`
- Create: `tests/smoke/neighborhoods.spec.js`

- [ ] **Step 1: Add package scripts for all test layers**

Create `package.json`:

```json
{
  "name": "neighborhoods-static",
  "private": true,
  "type": "module",
  "scripts": {
    "serve": "npx http-server . -p 4173 -c-1",
    "test:unit": "vitest run tests/unit --environment jsdom",
    "test:integration": "vitest run tests/integration --environment jsdom",
    "test:smoke": "playwright test tests/smoke/neighborhoods.spec.js",
    "test": "npm run test:unit && npm run test:integration && npm run test:smoke"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "http-server": "^14.1.1",
    "jsdom": "^24.1.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Add DOM helper unit tests**

Create `tests/unit/dom.test.js`:

```js
import { beforeEach, describe, expect, test } from "vitest";
import { createElement, qs, qsa } from "../../src/lib/dom.js";

describe("dom helpers", () => {
  beforeEach(() => {
    document.body.innerHTML = `<main><button class="item">One</button><button class="item">Two</button></main>`;
  });

  test("qs returns the first matching element", () => {
    expect(qs(".item").textContent).toBe("One");
  });

  test("qs throws a useful error when required element is missing", () => {
    expect(() => qs("[data-missing]")).toThrow("Missing required element: [data-missing]");
  });

  test("qsa returns all matching elements as an array", () => {
    expect(qsa(".item").map((item) => item.textContent)).toEqual(["One", "Two"]);
  });

  test("createElement applies tag, class, and text content", () => {
    const element = createElement("span", "badge", "Events");
    expect(element.tagName).toBe("SPAN");
    expect(element.className).toBe("badge");
    expect(element.textContent).toBe("Events");
  });
});
```

- [ ] **Step 3: Add location unit tests**

Create `tests/unit/location.test.js`:

```js
import { afterEach, describe, expect, test, vi } from "vitest";
import { labelForCoordinates, requestCurrentPosition } from "../../src/lib/location.js";

describe("location helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("labelForCoordinates formats coordinates to three decimals", () => {
    expect(labelForCoordinates({ lat: 43.65321, lng: -79.38319 })).toBe("Current area (43.653, -79.383)");
  });

  test("requestCurrentPosition resolves browser coordinates", async () => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success) => success({ coords: { latitude: 43.7, longitude: -79.4 } })
      }
    });

    await expect(requestCurrentPosition()).resolves.toEqual({ lat: 43.7, lng: -79.4 });
  });

  test("requestCurrentPosition rejects when geolocation is unavailable", async () => {
    vi.stubGlobal("navigator", {});

    await expect(requestCurrentPosition()).rejects.toThrow("Geolocation is unavailable in this browser.");
  });

  test("requestCurrentPosition rejects when permission is denied", async () => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (_success, failure) => failure()
      }
    });

    await expect(requestCurrentPosition()).rejects.toThrow("Location permission was denied.");
  });
});
```

- [ ] **Step 4: Add state unit tests**

Create `tests/unit/state.test.js`:

```js
import { beforeEach, describe, expect, test, vi } from "vitest";

async function loadState() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  return import("../../src/lib/state.js");
}

describe("state store", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
  });

  test("setState patches state and notifies subscribers", async () => {
    const { setState, state, subscribe } = await loadState();
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    setState({ theme: "dark" });

    expect(state.theme).toBe("dark");
    expect(listener).toHaveBeenCalledWith(state);
    unsubscribe();
  });

  test("filteredPosts filters by category and query", async () => {
    const { filteredPosts, setState } = await loadState();

    setState({ activeCategory: "sale", query: "desk" });

    expect(filteredPosts().map((post) => post.id)).toEqual(["post-desk-giveaway"]);
  });

  test("addPost prepends new post and closes modal", async () => {
    const { addPost, state } = await loadState();

    addPost({ title: "Test post", summary: "Hello neighbors", category: "general", author: "You" });

    expect(state.posts[0].title).toBe("Test post");
    expect(state.activePostId).toBe(state.posts[0].id);
    expect(state.modalOpen).toBe(false);
  });
});
```

- [ ] **Step 5: Add feed unit tests**

Create `tests/unit/feed.test.js`:

```js
import { beforeEach, describe, expect, test, vi } from "vitest";

async function loadModules() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  const stateModule = await import("../../src/lib/state.js");
  const feedModule = await import("../../src/ui/feed.js");
  return { ...stateModule, ...feedModule };
}

describe("feed renderer", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-filter-row></div>
      <section data-feed-list></section>
    `;
  });

  test("renderFeed renders filters and posts", async () => {
    const { renderFeed } = await loadModules();

    renderFeed();

    expect(document.querySelectorAll("[data-category]").length).toBe(5);
    expect(document.querySelectorAll("[data-post-id]").length).toBe(4);
  });

  test("category click filters posts", async () => {
    const { renderFeed } = await loadModules();

    renderFeed();
    document.querySelector("[data-category='sale']").click();
    renderFeed();

    expect(document.querySelectorAll("[data-post-id]").length).toBe(1);
    expect(document.querySelector("[data-post-id='post-desk-giveaway']")).not.toBeNull();
  });

  test("hovering a card updates active and hovered post state", async () => {
    const { renderFeed, state } = await loadModules();

    renderFeed();
    document.querySelector("[data-post-id='post-bike-light']").dispatchEvent(new Event("mouseenter"));

    expect(state.hoveredPostId).toBe("post-bike-light");
    expect(state.activePostId).toBe("post-bike-light");
  });
});
```

- [ ] **Step 6: Add header unit tests**

Create `tests/unit/header.test.js`:

```js
import { beforeEach, describe, expect, test, vi } from "vitest";

async function loadModules() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  const stateModule = await import("../../src/lib/state.js");
  const headerModule = await import("../../src/ui/header.js");
  return { ...stateModule, ...headerModule };
}

describe("header controls", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input data-search-input>
      <button data-theme-toggle type="button">Theme</button>
      <button data-new-post-button type="button">Post</button>
      <button data-location-button type="button">Locate</button>
      <input data-location-input value="Downtown Toronto">
      <button data-view="feed" type="button">Feed</button>
      <button data-view="map" type="button">Map</button>
    `;
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (_success, failure) => failure()
      }
    });
  });

  test("bindHeaderControls updates query from search input", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-search-input]").value = "desk";
    document.querySelector("[data-search-input]").dispatchEvent(new Event("input", { bubbles: true }));

    expect(state.query).toBe("desk");
  });

  test("bindHeaderControls toggles theme", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-theme-toggle]").click();

    expect(state.theme).toBe("dark");
  });

  test("bindHeaderControls opens the post modal", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-new-post-button]").click();

    expect(state.modalOpen).toBe(true);
  });

  test("bindHeaderControls stores manual neighborhood label", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-location-input]").value = "Roncesvalles";
    document.querySelector("[data-location-input]").dispatchEvent(new Event("change", { bubbles: true }));

    expect(state.location.label).toBe("Roncesvalles");
    expect(state.location.status).toBe("manual");
  });

  test("bindHeaderControls sets blocked status when geolocation is denied", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-location-button]").click();
    await Promise.resolve();

    expect(state.location.status).toBe("blocked");
  });

  test("bindHeaderControls updates mobile view", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-view='map']").click();

    expect(state.mobileView).toBe("map");
  });
});
```

- [ ] **Step 7: Add map unit tests**

Create `tests/unit/map.test.js`:

```js
import { beforeEach, describe, expect, test, vi } from "vitest";

async function loadModules() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  const stateModule = await import("../../src/lib/state.js");
  const mapModule = await import("../../src/ui/map.js");
  return { ...stateModule, ...mapModule };
}

describe("map renderer", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-map-canvas></div>
      <aside data-map-preview></aside>
    `;
  });

  test("renderMap renders one pin per post", async () => {
    const { renderMap } = await loadModules();

    renderMap();

    expect(document.querySelectorAll("[data-map-pin]").length).toBe(4);
  });

  test("active post receives active pin class and preview content", async () => {
    const { renderMap, setState } = await loadModules();

    setState({ activePostId: "post-bike-light" });
    renderMap();

    expect(document.querySelector("[data-map-pin='post-bike-light']").className).toContain("active");
    expect(document.querySelector("[data-map-preview]").textContent).toContain("Bike light check");
  });

  test("clicking a pin updates active post state", async () => {
    const { renderMap, state } = await loadModules();

    renderMap();
    document.querySelector("[data-map-pin='post-book-club']").click();

    expect(state.activePostId).toBe("post-book-club");
  });
});
```

- [ ] **Step 8: Add modal unit tests**

Create `tests/unit/modal.test.js`:

```js
import { beforeEach, describe, expect, test, vi } from "vitest";

async function loadModules() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  const stateModule = await import("../../src/lib/state.js");
  const modalModule = await import("../../src/ui/modal.js");
  return { ...stateModule, ...modalModule };
}

describe("post modal", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div data-modal-root></div>`;
  });

  test("renderModal renders nothing when closed", async () => {
    const { renderModal } = await loadModules();

    renderModal();

    expect(document.querySelector("[data-post-form]")).toBeNull();
  });

  test("renderModal renders form when open", async () => {
    const { renderModal, setState } = await loadModules();

    setState({ modalOpen: true });
    renderModal();

    expect(document.querySelector("[data-post-form]")).not.toBeNull();
  });

  test("submitting form adds a post", async () => {
    const { renderModal, setState, state } = await loadModules();

    setState({ modalOpen: true });
    renderModal();
    document.querySelector("input[name='title']").value = "Porch concert";
    document.querySelector("textarea[name='summary']").value = "Acoustic set at 7 PM.";
    document.querySelector("select[name='category']").value = "event";
    document.querySelector("[data-post-form]").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(state.posts[0].title).toBe("Porch concert");
    expect(state.modalOpen).toBe(false);
  });
});
```

- [ ] **Step 9: Add integration test for full app flow**

Create `tests/integration/app-flow.test.js`:

```js
import { beforeEach, describe, expect, test, vi } from "vitest";

async function bootApp() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  document.body.innerHTML = `
    <input data-search-input>
    <button data-theme-toggle type="button">Theme</button>
    <button data-new-post-button type="button">Post</button>
    <button data-location-button type="button">Locate</button>
    <input data-location-input value="Downtown Toronto">
    <div data-view-toggle><button data-view="feed" class="active">Feed</button><button data-view="map">Map</button></div>
    <main data-main-content>
      <section class="feed-panel"><div data-filter-row></div><section data-feed-list></section></section>
      <section class="map-panel"><div data-map-canvas></div><aside data-map-preview></aside></section>
    </main>
    <div data-modal-root></div>
  `;
  return import("../../src/main.js");
}

describe("app integration flow", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (_success, failure) => failure()
      }
    });
  });

  test("theme, search, hover sync, manual location, modal, and mobile view work together", async () => {
    await bootApp();

    document.querySelector("[data-theme-toggle]").click();
    expect(document.documentElement.dataset.theme).toBe("dark");

    document.querySelector("[data-search-input]").value = "desk";
    document.querySelector("[data-search-input]").dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelector("[data-post-id='post-desk-giveaway']")).not.toBeNull();

    document.querySelector("[data-search-input]").value = "";
    document.querySelector("[data-search-input]").dispatchEvent(new Event("input", { bubbles: true }));
    document.querySelector("[data-post-id='post-bike-light']").dispatchEvent(new Event("mouseenter", { bubbles: true }));
    expect(document.querySelector("[data-map-pin='post-bike-light']").className).toContain("active");

    document.querySelector("[data-location-input]").value = "Roncesvalles";
    document.querySelector("[data-location-input]").dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.querySelector("[data-map-preview]").textContent).toContain("Roncesvalles");

    document.querySelector("[data-new-post-button]").click();
    document.querySelector("input[name='title']").value = "Laneway cleanup";
    document.querySelector("textarea[name='summary']").value = "Meet by the south gate at 10 AM.";
    document.querySelector("select[name='category']").value = "general";
    document.querySelector("[data-post-form]").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(document.querySelector("[data-feed-list]").textContent).toContain("Laneway cleanup");

    document.querySelector("[data-view='map']").click();
    expect(document.querySelector("[data-main-content]").dataset.mobileView).toBe("map");
  });
});
```

- [ ] **Step 10: Add browser smoke test**

Create `tests/smoke/neighborhoods.spec.js`:

```js
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
});

test("theme toggle switches app theme", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.locator("[data-theme-toggle]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("search filters feed posts", async ({ page }) => {
  await page.locator("[data-search-input]").fill("desk");
  await expect(page.locator("[data-post-id='post-desk-giveaway']")).toBeVisible();
  await expect(page.locator("[data-post-id='post-book-club']")).toHaveCount(0);
});

test("hovering a post activates the matching pin", async ({ page }) => {
  await page.locator("[data-post-id='post-bike-light']").hover();
  await expect(page.locator("[data-map-pin='post-bike-light']")).toHaveClass(/active/);
});

test("mobile view toggle switches between feed and map", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("[data-view='map']").click();
  await expect(page.locator(".map-panel")).toBeVisible();
  await expect(page.locator(".feed-panel")).toBeHidden();
});
```

- [ ] **Step 11: Install dependencies**

Run: `npm install`

Expected: `node_modules` and `package-lock.json` are created.

- [ ] **Step 12: Run unit tests**

Run: `npm run test:unit`

Expected: all unit tests pass.

- [ ] **Step 13: Run integration tests**

Run: `npm run test:integration`

Expected: the app-flow integration test passes.

- [ ] **Step 14: Run static server**

Run: `npm run serve`

Expected: local server listens on `http://127.0.0.1:4173/`.

- [ ] **Step 15: Run smoke tests**

Run: `npm run test:smoke`

Expected: all four Playwright tests pass.

- [ ] **Step 16: Run all tests**

Run: `npm test`

Expected: unit, integration, and smoke suites all pass.

- [ ] **Step 17: Commit**

```bash
git add package.json package-lock.json tests/unit tests/integration tests/smoke
git commit -m "test: add unit integration and smoke coverage"
```

## Task 9: Final Verification And Documentation

**Files:**
- Modify: `docs/superpowers/specs/2026-05-26-neighborhoods-ui-design.md`
- Modify: `project_blueprint.md`

- [ ] **Step 1: Add implementation notes to spec**

Append this section to `docs/superpowers/specs/2026-05-26-neighborhoods-ui-design.md`:

```markdown
---

## Implementation Notes

The first implementation pass targets the existing static web prototype. The map renderer uses DOM-based pins and theme-aware map surfaces while preserving Leaflet-ready post data contracts (`lat`, `lng`, `category`, `id`). A later React/Expo migration can replace `src/ui/map.js` with `react-leaflet` without changing post data shape.
```

- [ ] **Step 2: Add blueprint status note**

Append this section to `project_blueprint.md`:

```markdown
---

## Implementation Status

The current project implementation is a static web prototype. The implementation plan in `docs/superpowers/plans/2026-05-26-neighborhoods-static-implementation.md` completes the web-first user experience in the static app before any Expo/React Native Web migration.
```

- [ ] **Step 3: Manual visual verification**

Open `http://127.0.0.1:4173/` at desktop `1440x900`.

Expected:
- Split layout shows feed and map simultaneously.
- Feed width is approximately 45% and map width is approximately 55%.
- Glass panels render in light and dark themes.
- Category chips and badges use distinct event, safety, sale, and general colors.
- Hovering feed cards pulses matching map pins.

- [ ] **Step 4: Manual mobile verification**

Open `http://127.0.0.1:4173/` at mobile `390x844`.

Expected:
- Header controls wrap cleanly.
- Feed/Map toggle is visible.
- No button text overflows.
- Modal fits within viewport.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-05-26-neighborhoods-ui-design.md project_blueprint.md
git commit -m "docs: record static implementation status"
```

## Self-Review

- Spec coverage:
  - Dual light/dark glassmorphic tokens: Task 1.
  - Split feed/map responsive layout: Tasks 1 and 7.
  - Category cards, badges, and colors: Tasks 2, 3, and 4.
  - Hover-to-map sync with `1.5x` active pin and pulse animation: Task 4.
  - Browser geolocation and manual neighborhood picker: Task 5.
  - Post creation modal from blueprint: Task 6.
  - Verification through unit, integration, and browser smoke tests: Task 8.
- Placeholder scan:
  - This plan contains concrete file paths, code snippets, commands, and expected results for each implementation task.
- Type consistency:
  - Post shape is defined in Task 2 and reused unchanged by feed, map, modal, and tests.
  - State keys are `theme`, `query`, `activeCategory`, `activePostId`, `hoveredPostId`, `mobileView`, `location`, `posts`, and `modalOpen` throughout.

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-05-26-neighborhoods-static-implementation.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

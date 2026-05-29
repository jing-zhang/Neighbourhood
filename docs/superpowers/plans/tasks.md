# Neighborhoods - Implementation Tasks

A concise checklist with user stories in Given-When-Then format.

---

## Setup & Foundation

### Task 1: Extract Markup, Tokens, and Static Assets

**User Story:**
- **Given** a monolithic HTML file with inline CSS
- **When** I extract design tokens into separate CSS files
- **Then** the app should render identically with CSS variables for theming

**Acceptance Criteria:**
- [x] Create `src/styles/tokens.css` with CSS custom properties for light/dark themes
- [x] Create `src/styles/app.css` with component styles
- [x] Update `index.html` to load external CSS and JS modules
- [x] Verify static rendering works correctly

---

### Task 2: Define Seed Data and App State

**User Story:**
- **Given** the app loads for the first time
- **When** the state is initialized with seed data
- **Then** sample neighborhood posts should be visible immediately

**Acceptance Criteria:**
- [x] Create `src/data/posts.js` with seed posts (Events, Safety, Free/Sale, General)
- [x] Create `src/lib/dom.js` with DOM helper functions (qs, qsa, createElement)
- [x] Create `src/lib/state.js` with state management (subscribe, setState, filteredPosts)
- [x] Create `src/main.js` as the entry point that bootstraps the app

---

## Core Features

### Task 3: Render Feed, Filters, Search, and Hover State

**User Story:**
- **Given** multiple posts in the feed
- **When** I search for a keyword or select a category filter
- **Then** only matching posts should be displayed

**Acceptance Criteria:**
- [ ] Create `src/ui/feed.js` to render category filter chips and post cards
- [ ] Create `src/ui/header.js` for search input and theme toggle controls
- [ ] Connect search input to filter posts by title/summary
- [ ] Connect category chips to filter by post type
- [ ] Add hover state synchronization between feed cards and map pins

---

### Task 4: Render Leaflet Map, Pins, Pulse, and Info Preview

**User Story:**
- **Given** neighborhood posts exist in the system
- **When** the Leaflet map renders with OpenStreetMap tiles
- **Then** each post should appear as a color-coded pin on the map

**Acceptance Criteria:**
- [ ] Install Leaflet: `npm install leaflet`
- [ ] Create `src/ui/map.js` to render Leaflet map with OpenStreetMap tiles
- [ ] Add CSS for Leaflet map container and custom markers
- [ ] Implement category-colored pins with pulse animation
- [ ] Connect hover on feed cards to highlight corresponding map pin
- [ ] Show tooltip preview when hovering pins

---

### Task 5: Add Geolocation and Manual Neighborhood Picker

**User Story:**
- **Given** a user wants to see location-specific posts
- **When** they either click "Locate Me" or enter a neighborhood manually
- **Then** the app should show posts relevant to that location

**Acceptance Criteria:**
- [ ] Create `src/lib/location.js` with geolocation API wrapper
- [ ] Add "Locate Me" button in header to request browser location
- [ ] Add manual neighborhood input field
- [ ] Handle permission denied and unavailable errors gracefully
- [ ] Update map center based on selected location

---

### Task 6: Add Post Creation Modal

**User Story:**
- **Given** a user wants to share neighborhood information
- **When** they click "Post" and fill out the form
- **Then** a new post should appear in the feed

**Acceptance Criteria:**
- [ ] Create `src/ui/modal.js` for the post creation form
- [ ] Add modal CSS with glassmorphic styling
- [ ] Implement form validation (title, category, summary required)
- [ ] Wire up form submission to add post to state
- [ ] Close modal and refresh feed after successful submission

---

## Responsive & Polish

### Task 7: Add Responsive Mobile Feed/Map Toggle

**User Story:**
- **Given** a user on a mobile device
- **When** they switch between feed and map views
- **Then** the layout should adapt appropriately for the screen size

**Acceptance Criteria:**
- [ ] Add viewport breakpoint CSS (768px, 480px)
- [ ] Create mobile segmented control (Feed | Map)
- [ ] Stack layout vertically on mobile
- [ ] Ensure touch interactions work properly

---

### Task 8: Add Tests (Unit, Integration, Smoke)

**User Story:**
- **Given** a codebase with multiple modules
- **When** I run the test suite
- **Then** I should have confidence that all features work correctly

**Acceptance Criteria:**
- [ ] Set up Vitest + jsdom + Playwright
- [ ] Write unit tests for DOM helpers, state, and location modules
- [ ] Write integration tests for feed filtering, map sync, and modal flow
- [ ] Write smoke tests for theme toggle, responsive layout, and hover sync

---

### Task 9: Final Verification and Documentation

**User Story:**
- **Given** a complete implementation
- **When** the app is tested for production use
- **Then** it should meet accessibility and performance standards

**Acceptance Criteria:**
- [ ] Verify all features work end-to-end
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Verify performance targets (FCP < 1.5s, LCP < 2.5s)
- [ ] Test on real devices/browsers

---

## Quick Reference

### File Structure
```
src/
├── styles/
│   ├── tokens.css      # CSS custom properties
│   └── app.css         # Component styles
├── data/
│   └── posts.js        # Seed data
├── lib/
│   ├── dom.js          # DOM helpers
│   ├── location.js     # Geolocation
│   └── state.js        # State management
├── ui/
│   ├── feed.js         # Feed + filters
│   ├── header.js       # Header controls
│   ├── map.js          # Map canvas
│   └── modal.js        # Post modal
└── main.js             # Entry point
```

### Key Features Checklist
- [ ] Light/Dark theme toggle
- [ ] Category filter chips (All, Events, Safety, Free/Sale, General)
- [ ] Search posts by title/summary
- [ ] Feed ↔ Map hover synchronization
- [ ] Geolocation + manual neighborhood picker
- [ ] Post creation modal
- [ ] Mobile feed/map toggle
- [ ] Keyboard accessibility

---

*Ready to implement! Start with Task 1 and work through sequentially.*
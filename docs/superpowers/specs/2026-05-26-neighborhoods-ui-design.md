# Specification: Neighborhoods - Glassmorphic Dual-Theme UI & Maps Sync

This specification document outlines the UI design systems (Light and Dark modes), interaction model, and map synchronization architecture for the **Neighborhoods** community discovery application.

---

## 1. Design Systems & Aesthetics (Dual-Theme Support)

The application supports both a soft, glassmorphic Light Mode and a futuristic, high-contrast Dark Mode.

### CSS Core Variables (Light Mode)
```css
:root[data-theme="light"] {
  /* Ambient Background Gradients */
  --bg-main: radial-gradient(circle at 0% 0%, #f3f8fa 0%, #eef5f8 100%);
  
  /* Glassmorphic Tokens */
  --glass-bg: rgba(255, 255, 255, 0.45);
  --glass-border: rgba(255, 255, 255, 0.6);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
  --backdrop-blur: blur(12px);

  /* Primary Theme Accent */
  --primary-teal: hsl(172, 100%, 35%);
  --primary-teal-glow: rgba(0, 178, 154, 0.15);

  /* Category Specific Colors */
  --color-safety: hsl(12, 95%, 55%);
  --color-event: hsl(265, 85%, 60%);
  --color-sale: hsl(40, 95%, 45%);
  --color-general: hsl(185, 75%, 45%);

  /* Typography */
  --font-family: 'Outfit', 'Inter', sans-serif;
  --text-dark: #1e293b;
  --text-muted: #64748b;
}
```

### CSS Core Variables (Dark Mode)
```css
:root[data-theme="dark"] {
  /* Futuristic Dark Ambient Background */
  --bg-main: radial-gradient(circle at 0% 0%, #0f172a 0%, #020617 100%);
  
  /* Dark Glassmorphic Tokens */
  --glass-bg: rgba(15, 23, 42, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --backdrop-blur: blur(16px);

  /* Primary Accent & Electric Teal */
  --primary-teal: hsl(172, 100%, 45%);
  --primary-teal-glow: rgba(0, 229, 198, 0.25);

  /* Category Electric Neon Colors */
  --color-safety: hsl(355, 100%, 60%);       /* Electric neon red */
  --color-event: hsl(272, 100%, 65%);        /* Neon electric purple */
  --color-sale: hsl(43, 100%, 50%);          /* Electric gold */
  --color-general: hsl(190, 100%, 48%);      /* Electric cyan */

  /* Typography */
  --font-family: 'Outfit', 'Inter', sans-serif;
  --text-dark: #f8fafc;
  --text-muted: #94a3b8;
}
```

### Component Aesthetics
- **Card Containers**: Glassmorphic panels with dynamic elevated thresholds corresponding to the selected theme.
- **Interactive Badges & Pills**: Light up with distinct ambient pastel boundaries in light theme, and high-frequency vibrant neon glows in dark theme.

---

## 2. Layout Grid (Split-Screen Responsive Canvas)

The grid structure remains highly consistent across both themes.

```
Desktop Viewport (>= 768px):
┌─────────────────────────────────┬──────────────────────────────────┐
│                                 │                                  │
│           Feed Panel            │          Interactive Map         │
│             (45%)               │               (55%)              │
│                                 │                                  │
└─────────────────────────────────┴──────────────────────────────────┘
```

---

## 3. Leaflet Map & Hover Sync Architecture

### Custom Maps Styling
- **Light Theme**: Customized light map with clean white-teal desaturation and custom SVG pins.
- **Dark Theme**: Customized dark map featuring slate roads, dark ocean backdrops, and bright neon coordinate markers.
- **Tile Layer**: OpenStreetMap tiles with custom CSS filters for theme adaptation.

### Hover Ripple & Pulse Animation
On hovering a feed card:
- The corresponding map pin scales dynamically to `1.5x`.
- A continuous CSS concentric pulsing keyframe `markerPulse` radiates outward beneath the active coordinate.

---

## 4. Implementation Notes

The first implementation pass targets a static web prototype with vanilla JavaScript modules and CSS custom properties. The map renderer uses Leaflet + OpenStreetMap tiles with custom category-colored markers and hover-sync animations.

### Build Status

| Layer | Status | Details |
|-------|--------|---------|
| Design tokens (light/dark) | ✅ Complete | `src/styles/tokens.css` |
| App styles | ✅ Complete | `src/styles/app.css` |
| Feed + filters | ✅ Complete | `src/ui/feed.js` |
| Header controls | ✅ Complete | `src/ui/header.js` |
| Leaflet map | ✅ Complete | `src/ui/map.js` |
| Geolocation | ✅ Complete | `src/lib/location.js` |
| Post modal | ✅ Complete | `src/ui/modal.js` |
| Responsive mobile toggle | ✅ Complete | Breakpoints at 768px and 480px |
| Unit tests (37) | ✅ Complete | Vitest + jsdom |
| Integration tests (11) | ✅ Complete | Cross-module user flows |
| Smoke tests (11) | ✅ Complete | Playwright + Chromium |

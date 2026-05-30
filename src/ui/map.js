import { filteredPosts, state } from "../lib/state.js";
import { categoryLabels } from "../data/posts.js";

let mapInstance = null;
let markersByPostId = {};

/**
 * Category color mapping for map pins.
 * @type {Record<string, string>}
 */
const categoryColors = {
  event: "var(--color-event)",
  safety: "var(--color-safety)",
  sale: "var(--color-sale)",
  general: "var(--color-general)"
};

/**
 * Creates a custom marker icon element for a post.
 * @param {string} category Post category.
 * @param {boolean} isActive Whether the marker is actively selected.
 * @returns {HTMLElement} Marker icon element.
 */
function createMarkerIcon(category, isActive = false) {
  const div = document.createElement("div");
  div.className = `map-pin-marker ${isActive ? "active" : ""} pin-${category}`;
  div.innerHTML = `
    <div class="map-pin-pulse" aria-hidden="true"></div>
    <div class="map-pin-dot"></div>
  `;
  return div;
}

/**
 * Renders the Leaflet map with posts and handles interactions.
 * Updates markers based on filteredPosts(), activePostId, and hoveredPostId.
 * @returns {void}
 */
export function renderMap() {
  // Get or create map container
  let mapContainer = document.getElementById("map-container");
  if (!mapContainer) {
    console.warn("Map container not found, skipping map render");
    return;
  }

  // Initialize map if not already done
  if (!mapInstance) {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // Create map instance
      mapInstance = window.L.map("map-container").setView([43.6532, -79.3832], 14);

      // Add tile layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: "map-tiles"
      }).addTo(mapInstance);

      // Initial render
      updateMapMarkers();
    };
    document.head.appendChild(script);
    return;
  }

  updateMapMarkers();
}

/**
 * Updates map markers based on current state.
 * Removes old markers, creates new ones, applies active/hover styling.
 * @returns {void}
 */
function updateMapMarkers() {
  if (!mapInstance) return;

  // Remove old markers
  Object.values(markersByPostId).forEach((marker) => {
    mapInstance.removeLayer(marker);
  });
  markersByPostId = {};

  // Create markers for filtered posts
  const posts = filteredPosts();
  posts.forEach((post) => {
    const iconEl = createMarkerIcon(post.category, post.id === state.activePostId);

    const marker = window.L.marker([post.lat, post.lng], {
      icon: window.L.divIcon({
        html: iconEl.outerHTML,
        className: "map-marker-wrapper",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })
    }).addTo(mapInstance);

    // Store marker reference
    markersByPostId[post.id] = marker;

    // Bind popup with post preview
    const popupContent = `
      <div class="map-popup">
        <span class="popup-category category-${post.category}">${categoryLabels[post.category]}</span>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        <small>${post.author} • ${post.time}</small>
      </div>
    `;
    marker.bindPopup(popupContent, { className: "map-popup-container" });

    // Click marker to select post
    marker.on("click", () => {
      import("../lib/state.js").then(({ setState }) => {
        setState({ activePostId: post.id });
      });
    });

    // Hover marker to show active state
    marker.on("mouseover", () => {
      import("../lib/state.js").then(({ setState }) => {
        setState({ hoveredPostId: post.id, activePostId: post.id });
      });
    });

    marker.on("mouseout", () => {
      import("../lib/state.js").then(({ setState }) => {
        setState({ hoveredPostId: null });
      });
    });
  });

  // Apply active styling to current active post
  updateMarkerStates();
}

/**
 * Updates marker styling based on current state.
 * Applies active/hover classes to match state.activePostId and state.hoveredPostId.
 * @returns {void}
 */
function updateMarkerStates() {
  Object.entries(markersByPostId).forEach(([postId, marker]) => {
    const markerEl = marker.getElement();
    if (!markerEl) return;

    const isActive = postId === state.activePostId;
    const isHovered = postId === state.hoveredPostId;

    if (isActive || isHovered) {
      markerEl.classList.add("active");
    } else {
      markerEl.classList.remove("active");
    }
  });
}

/**
 * Exports renderMap for external initialization.
 * This function is called by main.js on state changes.
 */
export { renderMap as default };

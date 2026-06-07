import { filteredPosts, state, setState } from "../lib/state.js";
import { categoryLabels } from "../data/posts.js";

let mapInstance = null;
let markersByPostId = {};
let leafletLoaded = false;

/**
 * Creates a custom marker icon element for a post.
 * @param {string} category Post category.
 * @returns {HTMLElement} Marker icon element.
 */
function createMarkerIcon(category) {
  const div = document.createElement("div");
  div.className = `map-pin-marker pin-${category}`;
  div.innerHTML = `
    <div class="map-pin-pulse" aria-hidden="true"></div>
    <div class="map-pin-dot"></div>
  `;
  return div;
}

/**
 * Loads Leaflet library from CDN if not already loaded.
 * Returns a promise that resolves when Leaflet is available.
 * @returns {Promise<void>}
 */
function loadLeaflet() {
  return new Promise((resolve) => {
    if (leafletLoaded && window.L) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      leafletLoaded = true;
      resolve();
    };
    document.head.appendChild(script);
  });
}

/**
 * Initializes the Leaflet map instance on first render.
 * @returns {void}
 */
function initializeMap() {
  if (mapInstance) return;

  const mapContainer = document.getElementById("map-container");
  if (!mapContainer) {
    console.warn("Map container not found, skipping map initialization");
    return;
  }

  mapInstance = window.L.map("map-container").setView([43.6532, -79.3832], 14);

  // Add tile layer
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    className: "map-tiles"
  }).addTo(mapInstance);
}

/**
 * Renders the Leaflet map with posts and handles interactions.
 * Updates markers based on filteredPosts(), activePostId, and hoveredPostId.
 * @returns {void}
 */
export async function renderMap() {
  // Ensure Leaflet is loaded before proceeding
  await loadLeaflet();

  // Initialize map on first call
  if (!mapInstance) {
    initializeMap();
  }

  if (!mapInstance) return;

  // Remove old markers
  Object.values(markersByPostId).forEach((marker) => {
    mapInstance.removeLayer(marker);
  });
  markersByPostId = {};

  // Create markers for filtered posts
  const posts = filteredPosts();
  posts.forEach((post) => {
    const iconEl = createMarkerIcon(post.category);

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
      setState({ activePostId: post.id });
    });

    // Hover marker to show active state and tooltip
    marker.on("mouseover", () => {
      setState({ hoveredPostId: post.id, activePostId: post.id });
      // Open popup on hover with slight delay for better UX
      setTimeout(() => {
        if (state.hoveredPostId === post.id) {
          marker.openPopup();
        }
      }, 300);
    });

    marker.on("mouseout", () => {
      setState({ hoveredPostId: null });
      // Close popup when mouse leaves
      marker.closePopup();
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
      // Open popup when marker becomes active/hovered (e.g., from feed card hover)
      if (isHovered) {
        setTimeout(() => {
          if (state.hoveredPostId === postId) {
            marker.openPopup();
          }
        }, 300);
      }
    } else {
      markerEl.classList.remove("active");
      // Close popup when marker is no longer active/hovered
      marker.closePopup();
    }
  });
}

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

/**
 * Mock Leaflet globally for jsdom (Leaflet's CDN script won't load).
 */
function mockLeaflet() {
  window.L = {
    map: vi.fn(() => ({
      setView: vi.fn().mockReturnThis(),
      removeLayer: vi.fn(),
      on: vi.fn(),
      invalidateSize: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
    })),
    marker: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      getElement: vi.fn(() => {
        const el = document.createElement("div");
        el.classList.add("leaflet-marker-icon");
        return el;
      }),
      openPopup: vi.fn(),
      closePopup: vi.fn(),
    })),
    divIcon: vi.fn(() => ({})),
    popup: vi.fn(() => ({
      setContent: vi.fn(),
    })),
  };
}

async function bootstrapApp() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  document.body.innerHTML = `
    <div class="app-window">
      <aside class="sidebar">
        <button class="btn-theme" data-theme-toggle type="button">Theme</button>
      </aside>
      <div class="main-wrapper">
        <header class="app-header">
          <div class="global-search">
            <input type="text" data-search-input>
          </div>
          <div class="location-control">
            <button data-location-button type="button">Locate</button>
            <input data-location-input value="Downtown Toronto">
          </div>
          <div class="header-actions">
            <button class="btn-post" data-new-post-button>Post</button>
          </div>
          <div class="view-toggle" data-view-toggle>
            <button type="button" data-view="feed" class="active">Feed</button>
            <button type="button" data-view="map">Map</button>
          </div>
        </header>
        <div class="split-canvas" data-main-content>
          <main class="feed-panel">
            <div class="feed-header">
              <div class="filter-row" data-filter-row></div>
            </div>
            <section class="feed-list" data-feed-list></section>
          </main>
          <section class="map-panel">
            <div id="map-container"></div>
          </section>
        </div>
      </div>
    </div>
    <div data-modal-root></div>
  `;

  mockLeaflet();

  const stateModule = await import("../../src/lib/state.js");
  const feedModule = await import("../../src/ui/feed.js");
  const mapModule = await import("../../src/ui/map.js");
  const headerModule = await import("../../src/ui/header.js");
  const modalModule = await import("../../src/ui/modal.js");

  return { ...stateModule, ...feedModule, ...mapModule, ...headerModule, ...modalModule };
}

describe("app integration", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 43.7, longitude: -79.4 } }),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("theme toggle switches from light to dark", async () => {
    const { bindHeaderControls, state, renderFeed, subscribe } = await bootstrapApp();
    bindHeaderControls();
    renderFeed();

    subscribe((s) => { document.documentElement.dataset.theme = s.theme; });

    expect(state.theme).toBe("light");
    document.querySelector("[data-theme-toggle]").click();
    expect(state.theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  test("search input filters feed posts", async () => {
    const { bindHeaderControls, renderFeed, setState, filteredPosts } = await bootstrapApp();
    bindHeaderControls();

    const input = document.querySelector("[data-search-input]");
    input.value = "desk";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    const results = filteredPosts();
    expect(results).toHaveLength(1);
    expect(results[0].title).toContain("desk");
  });

  test("category filter shows only matching posts", async () => {
    const { renderFeed, setState, filteredPosts } = await bootstrapApp();
    renderFeed();

    document.querySelector("[data-category='safety']").click();
    const results = filteredPosts();
    expect(results).toHaveLength(1);
    expect(results[0].category).toBe("safety");
  });

  test("feed card hover sets hoveredPostId", async () => {
    const { renderFeed, state, setState } = await bootstrapApp();
    renderFeed();

    const postCard = document.querySelector("[data-post-id='post-bike-light']");
    postCard.dispatchEvent(new Event("mouseenter"));
    expect(state.hoveredPostId).toBe("post-bike-light");
    expect(state.activePostId).toBe("post-bike-light");

    postCard.dispatchEvent(new Event("mouseleave"));
    expect(state.hoveredPostId).toBeNull();
  });

  test("feed card click sets activePostId", async () => {
    const { renderFeed, state, setState } = await bootstrapApp();
    renderFeed();

    document.querySelector("[data-post-id='post-desk-giveaway']").click();
    expect(state.activePostId).toBe("post-desk-giveaway");
  });

  test("geolocation button updates location state", async () => {
    const { bindHeaderControls, state } = await bootstrapApp();
    bindHeaderControls();

    document.querySelector("[data-location-button]").click();
    await vi.waitFor(() => {
      expect(state.location.status).toBe("located");
    });
    expect(state.location.center).toEqual({ lat: 43.7, lng: -79.4 });
  });

  test("manual location input updates label", async () => {
    const { bindHeaderControls, state } = await bootstrapApp();
    bindHeaderControls();

    const input = document.querySelector("[data-location-input]");
    input.value = "Parkdale";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(state.location.label).toBe("Parkdale");
    expect(state.location.status).toBe("manual");
  });

  test("new post button opens modal", async () => {
    const { bindHeaderControls, renderModal, state } = await bootstrapApp();
    bindHeaderControls();
    renderModal();

    expect(state.modalOpen).toBe(false);
    document.querySelector("[data-new-post-button]").click();
    renderModal();
    expect(state.modalOpen).toBe(true);

    const modalForm = document.querySelector("[data-post-form]");
    expect(modalForm).not.toBeNull();
  });

  test("modal submission creates a new post", async () => {
    const { bindHeaderControls, renderModal, state, setState } = await bootstrapApp();
    bindHeaderControls();
    setState({ modalOpen: true });
    renderModal();

    const form = document.querySelector("[data-post-form]");
    form.querySelector("input[name='title']").value = "Integration Test Post";
    form.querySelector("textarea[name='summary']").value = "Created from integration test";
    form.querySelector("select[name='category']").value = "event";
    form.dispatchEvent(new Event("submit", { cancelable: true }));

    expect(state.modalOpen).toBe(false);
    expect(state.posts[0].title).toBe("Integration Test Post");
    expect(state.posts[0].author).toBe("You");
  });

  test("mobile view toggle switches to map view", async () => {
    const { bindHeaderControls, state } = await bootstrapApp();
    bindHeaderControls();

    document.querySelector("[data-view='map']").click();
    expect(state.mobileView).toBe("map");
  });

  test("mobile view toggle switches back to feed view", async () => {
    const { bindHeaderControls, state } = await bootstrapApp();
    bindHeaderControls();

    document.querySelector("[data-view='map']").click();
    expect(state.mobileView).toBe("map");
    document.querySelector("[data-view='feed']").click();
    expect(state.mobileView).toBe("feed");
  });
});

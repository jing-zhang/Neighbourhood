import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

async function loadModules() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  document.body.innerHTML = `
    <input data-search-input>
    <button data-theme-toggle type="button">Theme</button>
    <button data-new-post-button type="button">Post</button>
    <button data-location-button type="button">Locate</button>
    <input data-location-input value="Downtown Toronto">
  `;
  const stateModule = await import("../../src/lib/state.js");
  const headerModule = await import("../../src/ui/header.js");
  return { ...stateModule, ...headerModule };
}

describe("header controls", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (_success, failure) => failure(),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("bindHeaderControls updates query from search input", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    const input = document.querySelector("[data-search-input]");
    input.value = "desk";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(state.query).toBe("desk");
  });

  test("bindHeaderControls toggles theme", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-theme-toggle]").click();

    expect(state.theme).toBe("dark");
  });

  test("bindHeaderControls toggles theme back on second click", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-theme-toggle]").click();
    expect(state.theme).toBe("dark");
    document.querySelector("[data-theme-toggle]").click();
    expect(state.theme).toBe("light");
  });

  test("bindHeaderControls opens modal on new-post click", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-new-post-button]").click();

    expect(state.modalOpen).toBe(true);
  });

  test("bindHeaderControls stores manual neighborhood label", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    const input = document.querySelector("[data-location-input]");
    input.value = "Roncesvalles";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(state.location.label).toBe("Roncesvalles");
    expect(state.location.status).toBe("manual");
  });

  test("bindHeaderControls falls back to default when manual input is empty", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    const input = document.querySelector("[data-location-input]");
    input.value = "";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(state.location.label).toBe("Downtown Toronto");
  });

  test("bindHeaderControls sets loading then blocked when geolocation denied", async () => {
    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-location-button]").click();
    // Flush microtask queue so the async handler resolves
    await vi.waitFor(() => {
      expect(state.location.status).toBe("blocked");
    });
  });

  test("bindHeaderControls sets located on successful geolocation", async () => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success) =>
          success({
            coords: { latitude: 43.7, longitude: -79.4 },
          }),
      },
    });

    const { bindHeaderControls, state } = await loadModules();
    bindHeaderControls();

    document.querySelector("[data-location-button]").click();
    await vi.waitFor(() => {
      expect(state.location.status).toBe("located");
    });

    expect(state.location.center).toEqual({ lat: 43.7, lng: -79.4 });
    expect(state.location.label).toContain("43.700");
  });
});

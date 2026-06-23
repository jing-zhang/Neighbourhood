import { qs } from "../lib/dom.js";
import { labelForCoordinates, requestCurrentPosition } from "../lib/location.js";
import { setState, state } from "../lib/state.js";

/**
 * Attaches header-level event handlers for search, theme, location,
 * and new-post controls.
 * @returns {void}
 */
export function bindHeaderControls() {
  qs("[data-search-input]").addEventListener("input", (event) => {
    setState({ query: event.target.value });
  });

  qs("[data-theme-toggle]").addEventListener("click", () => {
    setState({ theme: state.theme === "light" ? "dark" : "light" });
  });

  qs("[data-new-post-button]").addEventListener("click", () => {
    setState({ modalOpen: true });
  });

  qs("[data-location-input]").addEventListener("change", (event) => {
    setState({
      location: {
        ...state.location,
        label: event.target.value.trim() || "Downtown Toronto",
        status: "manual",
      },
    });
  });

  qs("[data-location-button]").addEventListener("click", async () => {
    setState({ location: { ...state.location, status: "loading" } });
    try {
      const center = await requestCurrentPosition();
      setState({
        location: {
          label: labelForCoordinates(center),
          status: "located",
          center,
        },
      });
      qs("[data-location-input]").value = labelForCoordinates(center);
    } catch (_error) {
      setState({ location: { ...state.location, status: "blocked" } });
      qs("[data-location-input]").value = state.location.label;
    }
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ mobileView: button.dataset.view });
    });
  });
}

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

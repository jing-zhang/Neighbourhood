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

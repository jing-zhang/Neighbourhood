import { state, subscribe } from "./lib/state.js";
import { renderFeed } from "./ui/feed.js";
import { renderMap } from "./ui/map.js";
import { bindHeaderControls } from "./ui/header.js";
import { renderModal } from "./ui/modal.js";

/**
 * Renders all state-driven UI regions for the current app state.
 * @returns {void}
 */
async function render() {
  document.documentElement.dataset.theme = state.theme;
  renderFeed();
  await renderMap();
  renderModal();
}

bindHeaderControls();
subscribe(render);
render();

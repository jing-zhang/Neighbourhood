import { state, subscribe } from "./lib/state.js";
import { renderFeed } from "./ui/feed.js";
import { renderMap } from "./ui/map.js";
import { bindHeaderControls } from "./ui/header.js";

/**
 * Renders all state-driven UI regions for the current app state.
 * @returns {void}
 */
async function render() {
  document.documentElement.dataset.theme = state.theme;
  renderFeed();
  await renderMap();
}

bindHeaderControls();
subscribe(render);
render();

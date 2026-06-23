import { categoryLabels } from "../data/posts.js";
import { addPost, setState, state } from "../lib/state.js";
import { qs } from "../lib/dom.js";

/**
 * Renders the post creation modal when open and wires close/submit actions.
 * @returns {void}
 */
export function renderModal() {
  const root = qs("[data-modal-root]");
  if (!state.modalOpen) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <form class="post-modal" data-post-form>
        <header>
          <h2>Create neighborhood post</h2>
          <button type="button" class="icon-button" data-close-modal aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Close
          </button>
        </header>
        <label>
          Title
          <input name="title" required maxlength="80" placeholder="What's happening?">
        </label>
        <label>
          Summary
          <textarea name="summary" required maxlength="220" placeholder="Share details with your neighbors…"></textarea>
        </label>
        <label>
          Category
          <select name="category">
            ${Object.entries(categoryLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
          </select>
        </label>
        <footer>
          <button type="button" class="icon-button" data-close-modal>Cancel</button>
          <button type="submit" class="btn-post">Post</button>
        </footer>
      </form>
    </div>
  `;

  root.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => setState({ modalOpen: false }));
  });

  qs("[data-post-form]", root).addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    addPost({
      title: String(formData.get("title")).trim(),
      summary: String(formData.get("summary")).trim(),
      category: String(formData.get("category")),
      author: "You"
    });
  });
}

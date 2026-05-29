import { categoryLabels } from "../data/posts.js";
import { filteredPosts, setState, state } from "../lib/state.js";
import { qs } from "../lib/dom.js";

const categories = [["all", "All"], ...Object.entries(categoryLabels)];

/**
 * Renders category filters and filtered neighborhood post cards.
 * @returns {void}
 */
export function renderFeed() {
  const filterRow = qs("[data-filter-row]");
  const feedList = qs("[data-feed-list]");

  filterRow.innerHTML = categories.map(([value, label]) => `
    <button class="filter-chip ${state.activeCategory === value ? "active" : ""}" data-category="${value}" type="button">
      ${label}
    </button>
  `).join("");

  const posts = filteredPosts();
  feedList.innerHTML = posts.map((post) => `
    <article class="post-card ${state.activePostId === post.id ? "active" : ""}" data-post-id="${post.id}" tabindex="0">
      <div class="post-card__meta">
        <span class="category-dot category-${post.category}"></span>
        <span>${categoryLabels[post.category]}</span>
        <span>${post.distance}</span>
        <span>${post.time}</span>
      </div>
      <h2>${post.title}</h2>
      <p>${post.summary}</p>
      <footer>
        <span>${post.author}</span>
        <span>${post.reactions} reactions</span>
        <span>${post.comments} comments</span>
      </footer>
    </article>
  `).join("");

  filterRow.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => setState({ activeCategory: button.dataset.category }));
  });

  feedList.querySelectorAll("[data-post-id]").forEach((card) => {
    const postId = card.dataset.postId;
    card.addEventListener("mouseenter", () => setState({ hoveredPostId: postId, activePostId: postId }));
    card.addEventListener("mouseleave", () => setState({ hoveredPostId: null }));
    card.addEventListener("focus", () => setState({ hoveredPostId: postId, activePostId: postId }));
    card.addEventListener("click", () => setState({ activePostId: postId }));
  });
}

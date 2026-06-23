import { seedPosts } from "../data/posts.js";

const listeners = new Set();

export const state = {
  theme: document.documentElement.dataset.theme || "light",
  query: "",
  activeCategory: "all",
  activePostId: seedPosts[0].id,
  hoveredPostId: null,
  mobileView: "feed",
  location: {
    label: "Downtown Toronto",
    status: "idle",
    center: { lat: 43.6532, lng: -79.3832 }
  },
  posts: [...seedPosts],
  modalOpen: false
};

/**
 * Subscribes to state changes and returns an unsubscribe callback.
 * @param {(state: typeof import("./state.js").state) => void} listener Function called after each state patch.
 * @returns {() => void} Function that removes the listener.
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Applies a partial state patch and notifies subscribers.
 * @param {Partial<typeof state>} patch State keys to merge into the current state.
 * @returns {void}
 */
export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((listener) => listener(state));
}

/**
 * Creates a new neighborhood post from form input and activates it in the UI.
 * @param {{title: string, summary: string, category: string, author: string}} post User-entered post data.
 * @returns {void}
 */
export function addPost(post) {
  const nextPost = {
    ...post,
    id: `post-${Date.now()}`,
    time: "Just now",
    distance: "0.1 km",
    reactions: 0,
    comments: 0,
    lat: state.location.center.lat + 0.001,
    lng: state.location.center.lng - 0.001
  };

  setState({
    posts: [nextPost, ...state.posts],
    activePostId: nextPost.id,
    modalOpen: false
  });
}

/**
 * Returns posts matching the active category and text query.
 * @returns {Array<typeof seedPosts[number]>} Filtered posts.
 */
export function filteredPosts() {
  const query = state.query.trim().toLowerCase();
  return state.posts.filter((post) => {
    const matchesCategory = state.activeCategory === "all" || post.category === state.activeCategory;
    const matchesQuery = !query || `${post.title} ${post.summary} ${post.author}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

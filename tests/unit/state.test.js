import { beforeEach, describe, expect, test, vi } from "vitest";

async function loadState() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  document.body.innerHTML = `
    <div data-modal-root></div>
    <div data-feed-list></div>
    <div data-filter-row></div>
  `;
  return import("../../src/lib/state.js");
}

describe("state store", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
  });

  test("initial state is light theme", async () => {
    const { state } = await loadState();
    expect(state.theme).toBe("light");
  });

  test("initial modal is closed", async () => {
    const { state } = await loadState();
    expect(state.modalOpen).toBe(false);
  });

  test("initial location is Downtown Toronto", async () => {
    const { state } = await loadState();
    expect(state.location.label).toBe("Downtown Toronto");
    expect(state.location.status).toBe("idle");
  });

  test("setState patches state and notifies subscribers", async () => {
    const { setState, state, subscribe } = await loadState();
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    setState({ theme: "dark" });

    expect(state.theme).toBe("dark");
    expect(listener).toHaveBeenCalledWith(state);
    unsubscribe();
  });

  test("subscribe returns an unsubscribe function", async () => {
    const { setState, subscribe } = await loadState();
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();
    setState({ query: "test" });

    expect(listener).not.toHaveBeenCalled();
  });

  test("filteredPosts returns all posts when no filters active", async () => {
    const { filteredPosts } = await loadState();
    expect(filteredPosts()).toHaveLength(4);
  });

  test("filteredPosts filters by category", async () => {
    const { filteredPosts, setState } = await loadState();

    setState({ activeCategory: "sale" });

    const posts = filteredPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe("post-desk-giveaway");
  });

  test("filteredPosts filters by text query", async () => {
    const { filteredPosts, setState } = await loadState();

    setState({ query: "farmers" });

    const posts = filteredPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe("post-farmers-market");
  });

  test("filteredPosts combines category and query filters", async () => {
    const { filteredPosts, setState } = await loadState();

    setState({ activeCategory: "sale", query: "desk" });

    expect(filteredPosts().map((p) => p.id)).toEqual(["post-desk-giveaway"]);
  });

  test("filteredPosts returns empty array when no matches", async () => {
    const { filteredPosts, setState } = await loadState();

    setState({ activeCategory: "event", query: "zzzznotfound" });

    expect(filteredPosts()).toHaveLength(0);
  });

  test("addPost prepends new post and closes modal", async () => {
    const { addPost, state } = await loadState();

    const initialCount = state.posts.length;
    addPost({
      title: "Test post",
      summary: "Hello neighbors",
      category: "general",
      author: "You",
    });

    expect(state.posts).toHaveLength(initialCount + 1);
    expect(state.posts[0].title).toBe("Test post");
    expect(state.posts[0].author).toBe("You");
    expect(state.posts[0].id).toMatch(/^post-/);
    expect(state.posts[0].time).toBe("Just now");
    expect(state.activePostId).toBe(state.posts[0].id);
    expect(state.modalOpen).toBe(false);
  });

  test("addPost sets proximity coordinates near current location", async () => {
    const { addPost, state } = await loadState();

    addPost({
      title: "Nearby",
      summary: "Close to center",
      category: "event",
      author: "You",
    });

    const newPost = state.posts[0];
    expect(newPost.lat).toBeCloseTo(state.location.center.lat, 2);
    expect(newPost.lng).toBeCloseTo(state.location.center.lng, 2);
  });
});

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

async function loadModules() {
  vi.resetModules();
  document.documentElement.dataset.theme = "light";
  document.body.innerHTML = `<div data-modal-root></div>`;
  const stateModule = await import("../../src/lib/state.js");
  const modalModule = await import("../../src/ui/modal.js");
  return { ...stateModule, ...modalModule };
}

describe("post creation modal", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition: (success) => success({ coords: { latitude: 43.7, longitude: -79.4 } }),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renderModal clears root when modal is closed", async () => {
    const { renderModal, setState, state } = await loadModules();
    state.modalOpen = false;
    renderModal();

    expect(document.querySelector("[data-modal-root]").innerHTML).toBe("");
  });

  test("renderModal renders form when modal is open", async () => {
    const { renderModal, setState, state } = await loadModules();
    setState({ modalOpen: true });
    renderModal();

    const root = document.querySelector("[data-modal-root]");
    expect(root.querySelector("[data-post-form]")).not.toBeNull();
    expect(root.querySelector("input[name='title']")).not.toBeNull();
    expect(root.querySelector("textarea[name='summary']")).not.toBeNull();
    expect(root.querySelector("select[name='category']")).not.toBeNull();
  });

  test("close button clears the modal", async () => {
    const { renderModal, setState, state } = await loadModules();
    setState({ modalOpen: true });
    renderModal();

    const closeButtons = document.querySelectorAll("[data-close-modal]");
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);

    closeButtons[0].click();
    expect(state.modalOpen).toBe(false);
  });

  test("form submission adds a new post and closes modal", async () => {
    const { renderModal, setState, state } = await loadModules();
    setState({ modalOpen: true });
    renderModal();

    const form = document.querySelector("[data-post-form]");
    form.querySelector("input[name='title']").value = "My Test Post";
    form.querySelector("textarea[name='summary']").value = "Testing the modal";
    form.querySelector("select[name='category']").value = "general";

    form.dispatchEvent(new Event("submit", { cancelable: true }));

    expect(state.modalOpen).toBe(false);
    expect(state.posts[0].title).toBe("My Test Post");
    expect(state.posts[0].category).toBe("general");
    expect(state.posts[0].author).toBe("You");
  });

  test("form submission respects required fields", async () => {
    const { renderModal, setState, state } = await loadModules();
    setState({ modalOpen: true });
    renderModal();

    const form = document.querySelector("[data-post-form]");
    const titleInput = form.querySelector("input[name='title']");
    const summaryInput = form.querySelector("textarea[name='summary']");

    // Both should have the `required` attribute
    expect(titleInput.hasAttribute("required")).toBe(true);
    expect(summaryInput.hasAttribute("required")).toBe(true);

    // Maxlength constraints
    expect(titleInput.getAttribute("maxlength")).toBe("80");
    expect(summaryInput.getAttribute("maxlength")).toBe("220");
  });

  test("category select has options for all categories", async () => {
    const { renderModal, setState } = await loadModules();
    setState({ modalOpen: true });
    renderModal();

    const select = document.querySelector("select[name='category']");
    const options = Array.from(select.options).map((opt) => opt.value);

    expect(options).toEqual(["event", "safety", "sale", "general"]);
  });
});

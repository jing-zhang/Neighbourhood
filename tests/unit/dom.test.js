import { beforeEach, describe, expect, test, vi } from "vitest";
import { createElement, qs, qsa } from "../../src/lib/dom.js";

describe("dom helpers", () => {
  beforeEach(() => {
    document.body.innerHTML = `<main><button class="item">One</button><button class="item">Two</button></main>`;
  });

  test("qs returns the first matching element", () => {
    expect(qs(".item").textContent).toBe("One");
  });

  test("qs throws a useful error when required element is missing", () => {
    expect(() => qs("[data-missing]")).toThrow(
      "Missing required element: [data-missing]",
    );
  });

  test("qsa returns all matching elements as an array", () => {
    expect(qsa(".item").map((item) => item.textContent)).toEqual(["One", "Two"]);
  });

  test("createElement applies tag, class, and text content", () => {
    const element = createElement("span", "badge", "Events");
    expect(element.tagName).toBe("SPAN");
    expect(element.className).toBe("badge");
    expect(element.textContent).toBe("Events");
  });

  test("createElement with no text defaults to empty string", () => {
    const element = createElement("div", "container");
    expect(element.tagName).toBe("DIV");
    expect(element.className).toBe("container");
    expect(element.textContent).toBe("");
  });
});

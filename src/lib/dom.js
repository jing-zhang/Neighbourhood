/**
 * Returns the first element matching a required selector.
 * @param {string} selector CSS selector to query.
 * @param {ParentNode} root Parent node to search within.
 * @returns {Element} The matching element.
 * @throws {Error} When no element matches the selector.
 */
export function qs(selector, root = document) {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}

/**
 * Returns all elements matching a selector as an array.
 * @param {string} selector CSS selector to query.
 * @param {ParentNode} root Parent node to search within.
 * @returns {Element[]} Matching elements.
 */
export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Creates a DOM element with optional class and text content.
 * @param {string} tag HTML tag name to create.
 * @param {string} className Class name to apply.
 * @param {string} text Text content to assign.
 * @returns {HTMLElement} The created element.
 */
export function createElement(tag, className, text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

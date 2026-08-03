const tagName = "ds-accordion";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
let nextGroupId = 0;

/**
 * Token-backed coordination and layout for native disclosure items.
 *
 * Consumers provide direct <details><summary>…</summary>…</details> children.
 * This element groups those items so zero or one may be open at a time; native
 * details/summary retains the disclosure semantics, keyboard behaviour, and
 * open state.
 */
export class Accordion extends ElementBase {
  #groupName;
  #observer;

  #onToggle = (event) => {
    const item = event.target;

    if (!(item instanceof HTMLDetailsElement) || !this.#items().includes(item) || !item.open) {
      return;
    }

    this.#items().forEach((sibling) => {
      if (sibling !== item && sibling.open) sibling.open = false;
    });
  };

  connectedCallback() {
    this.#groupName ||= `ds-accordion-${++nextGroupId}`;
    this.addEventListener("toggle", this.#onToggle, true);

    if (typeof MutationObserver !== "undefined") {
      this.#observer = new MutationObserver(() => this.#synchronize());
      this.#observer.observe(this, { childList: true });
    }

    this.#synchronize();
  }

  disconnectedCallback() {
    this.removeEventListener("toggle", this.#onToggle, true);
    this.#observer?.disconnect();
    this.#observer = undefined;
  }

  #items() {
    return Array.from(this.children).filter((child) => child instanceof HTMLDetailsElement);
  }

  #synchronize() {
    const items = this.#items();
    const openItem = items.find((item) => item.open);

    items.forEach((item) => {
      item.name = this.#groupName;
      item.open = item === openItem;
    });
  }
}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Accordion);

const tagName = "ds-skeleton";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Decorative loading placeholder. Its parent owns loading status and
 * announcements; the consumer owns its dimensions and composition.
 */
export class Skeleton extends ElementBase {
  connectedCallback() {
    this.setAttribute("aria-hidden", "true");
  }
}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Skeleton);
}

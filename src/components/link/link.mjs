const tagName = "ds-link";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native anchor.
 *
 * The anchor retains its complete HTML contract: href, target, rel, download,
 * events, focus, keyboard activation, accessible name, and child content.
 */
export class Link extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Link);
}

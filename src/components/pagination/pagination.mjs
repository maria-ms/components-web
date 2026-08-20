const tagName = "ds-pagination";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for consumer-owned native page navigation.
 *
 * Consumers provide the labelled navigation landmark, page destinations, and
 * any product routing or local pagination behaviour. Native controls retain
 * their complete HTML contracts.
 */
export class Pagination extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Pagination);
}

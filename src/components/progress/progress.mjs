const tagName = "ds-progress";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native progress element.
 *
 * The native element retains numeric value/max semantics and its accessible
 * name. The surrounding composition owns any visible label or status text.
 */
export class Progress extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Progress);
}

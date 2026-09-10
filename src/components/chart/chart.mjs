const tagName = "ds-chart";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * A parent-fill, non-interactive chart composition boundary.
 *
 * The chart renderer remains authored product code: SVG, canvas, or a chart
 * library belong in the native figure supplied by the consumer. This element
 * provides only the token-backed layout boundary shared with the Figma master.
 */
export class Chart extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Chart);

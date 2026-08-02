const tagName = "ds-badge";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Non-interactive inline status, metadata, or categorisation label.
 * Consumer content supplies required text and may prepend a decorative SVG.
 */
export class Badge extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Badge);
}

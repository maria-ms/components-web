const tagName = "ds-number-input";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native number input.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, browser-owned stepping, and form participation.
 * Import `@maria-ms/components-web/styles.css` for its token styles.
 */
export class NumberInput extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, NumberInput);

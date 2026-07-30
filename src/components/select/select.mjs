const tagName = "ds-select";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native single-select.
 *
 * The native select retains its standard attributes, properties, events,
 * focus API, constraint validation, accessible-name path, and form behaviour.
 * Import `@maria-ms/components-web/styles.css` for its token styles.
 */
export class Select extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Select);

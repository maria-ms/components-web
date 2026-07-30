const tagName = "ds-textarea";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native multi-line textarea.
 *
 * The native textarea retains its standard attributes, properties, events,
 * focus API, resize behaviour, constraint validation, and form participation.
 * Import `@maria-ms/components-web/styles.css` for its token styles.
 */
export class Textarea extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Textarea);

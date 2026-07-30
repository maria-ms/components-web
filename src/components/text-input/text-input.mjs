const tagName = "ds-text-input";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native single-line input.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 * Import `@maria-ms/components-web/styles.css` to load the visual contract.
 */
export class TextInput extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, TextInput);
}

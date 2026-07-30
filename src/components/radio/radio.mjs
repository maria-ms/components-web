const tagName = "ds-radio";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native radio input.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 * Grouping is native: radios sharing a name are mutually exclusive.
 */
export class Radio extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Radio);
}

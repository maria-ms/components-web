const tagName = "ds-switch";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native checkbox used as an on/off switch.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 * Add the native `switch` attribute to the input: supporting browsers expose
 * switch semantics, while unsupported browsers retain checkbox semantics.
 */
export class Switch extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Switch);
}

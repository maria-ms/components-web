const tagName = "ds-breadcrumbs";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for consumer-owned, native breadcrumb navigation.
 *
 * Consumers provide the labelled <nav>, ordered list, real ancestor anchors,
 * and final current-page label. Native HTML retains navigation semantics,
 * link behaviour, focus, and routing integration.
 */
export class Breadcrumbs extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Breadcrumbs);
}

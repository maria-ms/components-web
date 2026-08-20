const tagName = "ds-card";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * A token-backed, non-interactive visual surface.
 *
 * Consumers supply native header, content, and footer regions. The consuming
 * product owns any semantic wrapper such as article, section, or form.
 */
export class Card extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Card);

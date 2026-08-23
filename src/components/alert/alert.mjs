const tagName = "ds-alert";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token-backed, non-interactive feedback surface.
 *
 * The consumer owns native content and any optional live-region semantics.
 * Use role="status" for advisory dynamic messages and role="alert" only for
 * urgent, text-only dynamic messages.
 */
export class Alert extends ElementBase {}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Alert);
}

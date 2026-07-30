const buttonTagName = "ds-button";
const iconButtonTagName = "ds-icon-button";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Token styles for one consumer-owned native button.
 *
 * The native button keeps its complete HTML contract: form participation,
 * type, disabled state, accessibility attributes, events, and child content.
 */
export class Button extends ElementBase {}

/**
 * Token styles for one consumer-owned native icon-only button.
 *
 * The consumer supplies one decorative icon and the native button's accessible
 * name, for example with aria-label.
 */
export class IconButton extends ElementBase {}

if (canUseDOM && !customElements.get(buttonTagName)) {
  customElements.define(buttonTagName, Button);
}
if (canUseDOM && !customElements.get(iconButtonTagName)) {
  customElements.define(iconButtonTagName, IconButton);
}

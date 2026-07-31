const tagName = "ds-checkbox";
const indicatorClass = "ds-checkbox__indicator";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

const createIndicator = () => {
  const indicator = document.createElement("span");

  indicator.className = indicatorClass;
  indicator.setAttribute("aria-hidden", "true");
  indicator.innerHTML = `
    <svg class="ds-checkbox__check" viewBox="0 0 10.666666984558105 7.333333492279052" focusable="false">
      <path d="M 10.666666984558105 0 L 3.333333432674408 7.333333492279052 L 0 4.000000086697665"></path>
    </svg>
    <svg class="ds-checkbox__indeterminate" viewBox="0 -0.75 9.333333015441895 1.5" focusable="false">
      <path d="M 0 0 L 9.333333015441895 0"></path>
    </svg>
  `;

  return indicator;
};

/**
 * Token styles for one consumer-owned native checkbox.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 * `indeterminate` remains the native input property; it is not an attribute.
 */
export class Checkbox extends ElementBase {
  connectedCallback() {
    const hasIndicator = Array.from(this.children).some((child) =>
      child.classList.contains(indicatorClass),
    );

    if (!hasIndicator) {
      this.prepend(createIndicator());
    }
  }
}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Checkbox);
}

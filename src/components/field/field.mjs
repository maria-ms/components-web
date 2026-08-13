const tagName = "ds-field";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
const nativeControlSelector = "input, select, textarea";
let generatedId = 0;

const nextId = (part) => {
  generatedId += 1;
  return `ds-field-${part}-${generatedId}`;
};

/**
 * Structural form-field compound for one native text-like control.
 *
 * Consumers provide the label, control, and optional message as light-DOM
 * parts. Field associates those parts and reflects explicit child state;
 * consumers retain ownership of value, validation timing, and message text.
 * Import `@maria-ms/components-web/styles.css` for token styles.
 */
export class Field extends ElementBase {
  #observer;
  #describedControl;
  #descriptionId;

  connectedCallback() {
    this.#observer = new MutationObserver(() => this.#synchronize());
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-invalid", "disabled", "hidden", "id", "slot"],
    });
    this.#synchronize();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = undefined;
    this.#clearDescription();
  }

  #part(slotName) {
    return Array.from(this.children).find(
      (child) => child instanceof Element && child.getAttribute("slot") === slotName,
    ) || null;
  }

  #nativeControl(controlPart) {
    if (!controlPart) return null;
    if (controlPart.matches(nativeControlSelector)) return controlPart;

    const controls = controlPart.querySelectorAll(nativeControlSelector);
    return controls.length === 1 ? controls[0] : null;
  }

  #synchronize() {
    const label = this.#part("label");
    const control = this.#nativeControl(this.#part("control"));
    const message = this.#part("message");

    this.#clearDescription();

    if (!control) {
      this.removeAttribute("data-state");
      return;
    }

    if (!control.id) control.id = nextId("control");

    if (label instanceof HTMLLabelElement) {
      label.htmlFor = control.id;
    }

    if (message && !message.hidden) {
      if (!message.id) message.id = nextId("message");

      const describedBy = new Set(
        (control.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean),
      );

      describedBy.add(message.id);
      control.setAttribute("aria-describedby", [...describedBy].join(" "));
      this.#describedControl = control;
      this.#descriptionId = message.id;
    }

    this.dataset.state = control.disabled
      ? "disabled"
      : control.getAttribute("aria-invalid") === "true"
        ? "invalid"
        : "default";
  }

  #clearDescription() {
    if (!this.#describedControl || !this.#descriptionId) return;

    const describedBy = (this.#describedControl.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && id !== this.#descriptionId);

    if (describedBy.length) {
      this.#describedControl.setAttribute("aria-describedby", describedBy.join(" "));
    } else {
      this.#describedControl.removeAttribute("aria-describedby");
    }

    this.#describedControl = undefined;
    this.#descriptionId = undefined;
  }
}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Field);

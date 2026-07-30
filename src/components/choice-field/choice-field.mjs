const tagName = "ds-choice-field";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
let generatedId = 0;

const choiceControlSelector = 'input[type="checkbox"], input[type="radio"]';
const supportedControlTags = new Set(["DS-CHECKBOX", "DS-RADIO", "DS-SWITCH"]);

const nextId = (part) => {
  generatedId += 1;
  return `ds-choice-field-${part}-${generatedId}`;
};

/**
 * Label, message, and association layout for one consumer-owned choice control.
 *
 * The marked Checkbox, Radio, or Switch retains its native input, form,
 * validation, event, and focus behaviour. This wrapper has no Figma-State API:
 * it reflects the nested input's disabled or aria-invalid state for presentation.
 * Import `@maria-ms/components-web/styles.css` for its token styles.
 */
export class ChoiceField extends ElementBase {
  #label;
  #control;
  #message;
  #observer;
  #descriptionControl;
  #descriptionId;

  constructor() {
    super();
  }

  connectedCallback() {
    this.#observer = new MutationObserver(() => this.#synchronize());
    this.#observer.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-invalid", "disabled", "hidden", "id", "slot", "type"],
    });
    this.#synchronize();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = undefined;
    this.#clearMessageDescription();
  }

  #part(slotName) {
    return Array.from(this.children).find(
      (child) => child instanceof Element && child.getAttribute("slot") === slotName,
    ) || null;
  }

  #nativeControl(controlPart) {
    if (!controlPart || !supportedControlTags.has(controlPart.tagName)) return null;

    const controls = controlPart.querySelectorAll(choiceControlSelector);
    return controls.length === 1 ? controls[0] : null;
  }

  #synchronize() {
    this.#clearMessageDescription();
    this.#label = this.#part("label");
    this.#message = this.#part("message");
    this.#control = this.#nativeControl(this.#part("control"));
    this.#associateParts();
    this.#synchronizeState();
  }

  #associateParts() {
    if (!this.#control) return;

    if (!this.#control.id) this.#control.id = nextId("control");

    if (this.#label instanceof HTMLLabelElement) {
      this.#label.htmlFor = this.#control.id;
    }

    if (this.#message && !this.#message.hidden) {
      if (!this.#message.id) this.#message.id = nextId("message");
      const describedBy = new Set(
        (this.#control.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean),
      );

      describedBy.add(this.#message.id);
      this.#control.setAttribute("aria-describedby", [...describedBy].join(" "));
      this.#descriptionControl = this.#control;
      this.#descriptionId = this.#message.id;
    }
  }

  #clearMessageDescription() {
    if (!this.#descriptionControl || !this.#descriptionId) return;

    const describedBy = (this.#descriptionControl.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && id !== this.#descriptionId);

    if (describedBy.length) {
      this.#descriptionControl.setAttribute("aria-describedby", describedBy.join(" "));
    } else {
      this.#descriptionControl.removeAttribute("aria-describedby");
    }

    this.#descriptionControl = undefined;
    this.#descriptionId = undefined;
  }

  #synchronizeState() {
    if (!this.#control) {
      this.removeAttribute("data-state");
      return;
    }

    if (this.#control.matches(":disabled")) {
      this.dataset.state = "disabled";
      return;
    }

    // A missing radio selection belongs to its containing Radio Group, not to
    // an individual choice row. Checkbox and Switch may carry an individual
    // validation error.
    this.dataset.state =
      this.#control.type !== "radio" && this.#control.getAttribute("aria-invalid") === "true"
        ? "error"
        : "default";
  }
}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, ChoiceField);

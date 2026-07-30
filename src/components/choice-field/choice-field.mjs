const tagName = "ds-choice-field";
const styleId = "ds-choice-field-styles";
let generatedId = 0;

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-choice-field > [slot="control"] {
      align-self: start;
      flex: 0 0 auto;
    }

    ds-choice-field > [slot="label"],
    ds-choice-field > [slot="message"] {
      display: block;
      inline-size: 100%;
      margin: 0;
      color: var(--ds-semantic-color-foreground-default);
      font-family: var(--ds-primitive-font-family-body);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    ds-choice-field > [slot="message"] {
      color: var(--ds-semantic-color-foreground-muted-2);
    }

    ds-choice-field[data-state="error"] > [slot="message"] {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    ds-choice-field[data-state="disabled"] > [slot="label"] {
      color: var(--ds-semantic-color-foreground-disabled-elevated);
    }

    ds-choice-field[data-state="disabled"] > [slot="message"] {
      color: var(--ds-semantic-color-foreground-disabled-muted);
    }
  `;
  document.head.append(style);
}

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      inline-size: fit-content;
      max-inline-size: 100%;
      column-gap: var(--ds-semantic-spacing-sm);
    }

    #content {
      display: flex;
      min-inline-size: 0;
      flex-direction: column;
      gap: var(--ds-semantic-spacing-xs);
    }

    slot {
      display: contents;
    }
  </style>
  <slot name="control"></slot>
  <div id="content">
    <slot name="label"></slot>
    <slot name="message"></slot>
  </div>
`;

const choiceControlSelector = 'input[type="checkbox"], input[type="radio"]';
const supportedControlTags = new Set(["DS-CHECKBOX", "DS-RADIO", "DS-SWITCH"]);

const nextId = (part) => {
  generatedId += 1;
  return `ds-choice-field-${part}-${generatedId}`;
};

/**
 * Label, message, and association layout for one consumer-owned choice control.
 *
 * The slotted Checkbox, Radio, or Switch retains its native input, form,
 * validation, event, and focus behaviour. This wrapper has no Figma-State API:
 * it reflects the nested input's disabled or aria-invalid state for presentation.
 */
export class ChoiceField extends HTMLElement {
  #labelSlot;
  #controlSlot;
  #messageSlot;
  #label;
  #control;
  #message;
  #observer;
  #descriptionControl;
  #descriptionId;

  #onSlotChange = () => this.#synchronize();

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
    this.#labelSlot = this.shadowRoot.querySelector('slot[name="label"]');
    this.#controlSlot = this.shadowRoot.querySelector('slot[name="control"]');
    this.#messageSlot = this.shadowRoot.querySelector('slot[name="message"]');
    this.#observer = new MutationObserver(() => this.#synchronize());
  }

  connectedCallback() {
    this.#labelSlot.addEventListener("slotchange", this.#onSlotChange);
    this.#controlSlot.addEventListener("slotchange", this.#onSlotChange);
    this.#messageSlot.addEventListener("slotchange", this.#onSlotChange);
    this.#observer.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-invalid", "disabled", "hidden", "id", "slot", "type"],
    });
    this.#synchronize();
  }

  disconnectedCallback() {
    this.#labelSlot.removeEventListener("slotchange", this.#onSlotChange);
    this.#controlSlot.removeEventListener("slotchange", this.#onSlotChange);
    this.#messageSlot.removeEventListener("slotchange", this.#onSlotChange);
    this.#observer.disconnect();
    this.#clearMessageDescription();
  }

  #slotElement(slot) {
    return slot.assignedElements({ flatten: true })[0] || null;
  }

  #nativeControl(controlPart) {
    if (!controlPart || !supportedControlTags.has(controlPart.tagName)) return null;

    const controls = controlPart.querySelectorAll(choiceControlSelector);
    return controls.length === 1 ? controls[0] : null;
  }

  #synchronize() {
    this.#clearMessageDescription();
    this.#label = this.#slotElement(this.#labelSlot);
    this.#message = this.#slotElement(this.#messageSlot);
    this.#control = this.#nativeControl(this.#slotElement(this.#controlSlot));
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

if (!customElements.get(tagName)) customElements.define(tagName, ChoiceField);

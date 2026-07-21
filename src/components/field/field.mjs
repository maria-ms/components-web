const tagName = "ds-field";
const styleId = "ds-field-styles";
let generatedId = 0;

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-field > [slot="label"],
    ds-field > [slot="message"] {
      display: block;
      inline-size: 100%;
      margin: 0;
      color: var(--ds-semantic-color-foreground-default);
      font-family: var(--ds-primitive-font-family-body);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    ds-field > [slot="control"] {
      inline-size: 100%;
      min-inline-size: 0;
    }

    ds-field > [slot="message"] {
      color: var(--ds-semantic-color-foreground-muted-2);
    }

    ds-field[data-state="invalid"] > [slot="message"] {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    ds-field[data-state="disabled"] > [slot="label"],
    ds-field[data-state="disabled"] > [slot="message"] {
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
      display: flex;
      flex-direction: column;
      align-items: stretch;
      inline-size: var(--ds-component-input-width-lg);
      max-inline-size: 100%;
      gap: var(--ds-semantic-spacing-xs);
    }

    slot {
      display: contents;
    }
  </style>
  <slot name="label"></slot>
  <slot name="control"></slot>
  <slot name="message"></slot>
`;

const controlSelector = "input, select, textarea";

const nextId = (part) => {
  generatedId += 1;
  return `ds-field-${part}-${generatedId}`;
};

/**
 * Structural form-field compound for one canonical text-like control.
 *
 * Consumers provide native Label, Control, and Message parts in named slots.
 * Field owns their associations and validation timing; the child control retains
 * its native form, value, focus, event, and constraint-validation contracts.
 */
export class Field extends HTMLElement {
  #labelSlot;
  #controlSlot;
  #messageSlot;
  #label;
  #control;
  #message;
  #form;
  #observer;
  #createdMessage;
  #descriptionControl;
  #descriptionId;
  #supportingMessage = "";
  #renderedNativeError = false;
  #managedAriaInvalid = false;
  #hasBeenValidated = false;

  #onSlotChange = () => this.#synchronize();

  #onFocusOut = (event) => {
    if (event.target !== this.#control) return;
    this.#hasBeenValidated = true;
    this.#synchronizeState();
  };

  #onInput = (event) => {
    if (event.target !== this.#control) return;
    this.#synchronizeState();
  };

  #onInvalid = (event) => {
    if (event.target !== this.#control) return;
    this.#hasBeenValidated = true;
    this.#synchronizeState();
  };

  #onFormReset = () => {
    queueMicrotask(() => {
      this.#hasBeenValidated = false;
      this.#synchronizeState();
    });
  };

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
    this.addEventListener("focusout", this.#onFocusOut);
    this.addEventListener("input", this.#onInput);
    this.addEventListener("invalid", this.#onInvalid, true);
    this.#observer.observe(this, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-invalid", "disabled", "hidden", "id"],
    });
    this.#synchronize();
  }

  disconnectedCallback() {
    this.#labelSlot.removeEventListener("slotchange", this.#onSlotChange);
    this.#controlSlot.removeEventListener("slotchange", this.#onSlotChange);
    this.#messageSlot.removeEventListener("slotchange", this.#onSlotChange);
    this.removeEventListener("focusout", this.#onFocusOut);
    this.removeEventListener("input", this.#onInput);
    this.removeEventListener("invalid", this.#onInvalid, true);
    this.#observer.disconnect();
    this.#setForm(null);
  }

  #slotElement(slot) {
    return slot.assignedElements({ flatten: true })[0] || null;
  }

  #nativeControl(controlPart) {
    if (!controlPart) return null;
    if (controlPart.matches(controlSelector)) return controlPart;

    const controls = controlPart.querySelectorAll(controlSelector);
    return controls.length === 1 ? controls[0] : null;
  }

  #synchronize() {
    const label = this.#slotElement(this.#labelSlot);
    const controlPart = this.#slotElement(this.#controlSlot);
    const message = this.#slotElement(this.#messageSlot);
    const control = this.#nativeControl(controlPart);

    this.#clearMessageDescription();

    if (message !== this.#message) {
      this.#message = message;
      this.#supportingMessage = message ? message.textContent : "";
      this.#renderedNativeError = false;
    }

    this.#label = label;
    this.#control = control;
    this.#setForm(control ? control.form : null);
    this.#associateParts();
    this.#synchronizeState();
  }

  #setForm(nextForm) {
    if (nextForm === this.#form) return;
    if (this.#form) this.#form.removeEventListener("reset", this.#onFormReset);
    this.#form = nextForm;
    if (this.#form) this.#form.addEventListener("reset", this.#onFormReset);
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

    if (this.#control.disabled) {
      this.dataset.state = "disabled";
      this.#restoreSupportingMessage();
      this.#clearManagedAriaInvalid();
      return;
    }

    const nativeInvalid = this.#control.validity && !this.#control.validity.valid;
    const applicationInvalid =
      this.#control.getAttribute("aria-invalid") === "true" && !this.#managedAriaInvalid;
    const showInvalid = (this.#hasBeenValidated && nativeInvalid) || applicationInvalid;

    if (!showInvalid) {
      this.dataset.state = "default";
      this.#restoreSupportingMessage();
      if (!nativeInvalid) this.#clearManagedAriaInvalid();
      return;
    }

    this.dataset.state = "invalid";

    if (nativeInvalid) {
      if (this.#control.getAttribute("aria-invalid") !== "true") {
        this.#control.setAttribute("aria-invalid", "true");
        this.#managedAriaInvalid = true;
      }
      this.#renderNativeError();
    }
  }

  #renderNativeError() {
    const message = this.#message || this.#createErrorMessage();
    if (!message || !this.#control.validationMessage) return;

    if (!this.#renderedNativeError) {
      this.#supportingMessage = message.textContent;
      this.#renderedNativeError = true;
    }
    message.textContent = this.#control.validationMessage;
    this.#associateParts();
  }

  #createErrorMessage() {
    const message = document.createElement("p");

    message.slot = "message";
    this.#message = message;
    this.#createdMessage = message;
    this.#supportingMessage = "";
    this.append(message);
    return message;
  }

  #restoreSupportingMessage() {
    if (!this.#renderedNativeError || !this.#message) return;

    if (this.#message === this.#createdMessage) {
      this.#createdMessage.remove();
      this.#createdMessage = undefined;
      this.#message = null;
      this.#supportingMessage = "";
      this.#renderedNativeError = false;
      return;
    }

    this.#message.textContent = this.#supportingMessage;
    this.#renderedNativeError = false;
  }

  #clearManagedAriaInvalid() {
    if (!this.#managedAriaInvalid || !this.#control) return;
    this.#control.removeAttribute("aria-invalid");
    this.#managedAriaInvalid = false;
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Field);

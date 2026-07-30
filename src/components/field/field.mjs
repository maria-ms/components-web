const tagName = "ds-field";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
let generatedId = 0;

const controlSelector = "input, select, textarea";

const nextId = (part) => {
  generatedId += 1;
  return `ds-field-${part}-${generatedId}`;
};

/**
 * Structural form-field compound for one canonical text-like control.
 *
 * Consumers provide native Label, Control, and Message parts marked by their
 * named slot attributes.
 * Field owns their associations and validation timing; the child control retains
 * its native form, value, focus, event, and constraint-validation contracts.
 * Import `@maria-ms/components-web/styles.css` for its token styles.
 */
export class Field extends ElementBase {
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
  }

  connectedCallback() {
    this.#observer = new MutationObserver(() => this.#synchronize());
    this.addEventListener("focusout", this.#onFocusOut);
    this.addEventListener("input", this.#onInput);
    this.addEventListener("invalid", this.#onInvalid, true);
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-invalid", "disabled", "hidden", "id"],
    });
    this.#synchronize();
  }

  disconnectedCallback() {
    this.removeEventListener("focusout", this.#onFocusOut);
    this.removeEventListener("input", this.#onInput);
    this.removeEventListener("invalid", this.#onInvalid, true);
    this.#observer?.disconnect();
    this.#observer = undefined;
    this.#setForm(null);
  }

  #part(slotName) {
    return Array.from(this.children).find(
      (child) => child instanceof Element && child.getAttribute("slot") === slotName,
    ) || null;
  }

  #nativeControl(controlPart) {
    if (!controlPart) return null;
    if (controlPart.matches(controlSelector)) return controlPart;

    const controls = controlPart.querySelectorAll(controlSelector);
    return controls.length === 1 ? controls[0] : null;
  }

  #synchronize() {
    const label = this.#part("label");
    const controlPart = this.#part("control");
    const message = this.#part("message");
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

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Field);

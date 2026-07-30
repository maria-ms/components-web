const tagName = "ds-radio-group";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
let generatedId = 0;

const nextId = (part) => {
  generatedId += 1;
  return `ds-radio-group-${part}-${generatedId}`;
};

/**
 * Token-backed layout and validation presentation for one native radio group.
 *
 * Consumers own the semantic fieldset, legend, same-name radio inputs, and
 * group error copy. The custom element only associates visible descriptive
 * copy and exposes native group validation without recreating radio behaviour.
 * Import `@maria-ms/components-web/styles.css` for its token styles.
 */
export class RadioGroup extends ElementBase {
  #fieldset;
  #description;
  #error;
  #form;
  #observer;
  #hasBeenValidated = false;
  #descriptionIds = [];

  #onChange = (event) => {
    if (!this.#isGroupRadio(event.target)) return;
    this.#hasBeenValidated = true;
    this.#synchronize();
  };

  #onFocusOut = (event) => {
    if (!this.#isGroupRadio(event.target)) return;
    this.#hasBeenValidated = true;
    this.#synchronize();
  };

  #onInvalid = (event) => {
    if (!this.#isGroupRadio(event.target)) return;
    this.#hasBeenValidated = true;
    this.#synchronize();
  };

  #onFormReset = () => {
    queueMicrotask(() => {
      this.#hasBeenValidated = false;
      this.#synchronize();
    });
  };

  connectedCallback() {
    this.#observer = new MutationObserver(() => this.#synchronize());
    this.addEventListener("change", this.#onChange);
    this.addEventListener("focusout", this.#onFocusOut);
    this.addEventListener("invalid", this.#onInvalid, true);
    this.#observer.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-invalid", "checked", "disabled", "hidden", "id", "name", "required"],
    });
    this.#synchronize();
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.#onChange);
    this.removeEventListener("focusout", this.#onFocusOut);
    this.removeEventListener("invalid", this.#onInvalid, true);
    this.#observer?.disconnect();
    this.#observer = undefined;
    this.#setForm(null);
    this.#clearDescriptions();
  }

  #synchronize() {
    this.#clearDescriptions();
    this.#fieldset = Array.from(this.children).find((child) => child instanceof HTMLFieldSetElement) || null;

    if (!this.#fieldset) {
      this.removeAttribute("data-state");
      this.#setForm(null);
      return;
    }

    this.#description = this.#fieldset.querySelector(":scope > [data-description]");
    this.#error = this.#fieldset.querySelector(":scope > [data-error]");
    this.#setForm(this.#radios()[0]?.form || null);

    const isDisabled = this.#fieldset.disabled;
    const showError =
      !isDisabled &&
      (this.#fieldset.getAttribute("aria-invalid") === "true" ||
        (this.#hasBeenValidated && this.#radios().some((radio) => !radio.validity.valid)));

    // `hidden` is observed so consumer changes to the error copy update the
    // group association. Do not reflect the same value on every pass: doing
    // so would generate another observed mutation and can create a loop.
    const errorHidden = !showError;
    if (this.#error && this.#error.hidden !== errorHidden) {
      this.#error.hidden = errorHidden;
    }
    this.dataset.state = isDisabled ? "disabled" : showError ? "error" : "default";
    this.#associateDescriptions();
  }

  #radios() {
    if (!this.#fieldset) return [];
    return Array.from(
      this.#fieldset.querySelectorAll('ds-choice-field ds-radio > input[type="radio"]'),
    );
  }

  #isGroupRadio(node) {
    return node instanceof HTMLInputElement && this.#radios().includes(node);
  }

  #setForm(nextForm) {
    if (nextForm === this.#form) return;
    if (this.#form) this.#form.removeEventListener("reset", this.#onFormReset);
    this.#form = nextForm;
    if (this.#form) this.#form.addEventListener("reset", this.#onFormReset);
  }

  #associateDescriptions() {
    if (!this.#fieldset) return;

    const descriptions = [this.#description, this.#error].filter(
      (node) => node && !node.hidden,
    );
    if (!descriptions.length) return;

    const ids = descriptions.map((node) => {
      if (!node.id) node.id = nextId("description");
      return node.id;
    });
    const describedBy = new Set(
      (this.#fieldset.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean),
    );

    ids.forEach((id) => describedBy.add(id));
    this.#fieldset.setAttribute("aria-describedby", [...describedBy].join(" "));
    this.#descriptionIds = ids;
  }

  #clearDescriptions() {
    if (!this.#fieldset || !this.#descriptionIds.length) return;

    const describedBy = (this.#fieldset.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && !this.#descriptionIds.includes(id));

    if (describedBy.length) {
      this.#fieldset.setAttribute("aria-describedby", describedBy.join(" "));
    } else {
      this.#fieldset.removeAttribute("aria-describedby");
    }

    this.#descriptionIds = [];
  }
}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, RadioGroup);

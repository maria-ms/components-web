const tagName = "ds-radio-group";
const canUseDOM = typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
let generatedId = 0;

const nextId = (part) => {
  generatedId += 1;
  return `ds-radio-group-${part}-${generatedId}`;
};

/**
 * Layout and error presentation for one consumer-owned native radio group.
 *
 * Consumers provide the fieldset, legend, same-name radios, description, and
 * error copy. Set aria-invalid on the fieldset when a missing selection should
 * be presented. Import `@maria-ms/components-web/styles.css` for token styles.
 */
export class RadioGroup extends ElementBase {
  #fieldset;
  #observer;
  #descriptionIds = [];

  connectedCallback() {
    this.#observer = new MutationObserver(() => this.#synchronize());
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-invalid", "disabled", "hidden", "id"],
    });
    this.#synchronize();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = undefined;
    this.#clearDescriptions();
  }

  #synchronize() {
    this.#clearDescriptions();
    this.#fieldset = Array.from(this.children).find(
      (child) => child instanceof HTMLFieldSetElement,
    ) || null;

    if (!this.#fieldset) {
      this.removeAttribute("data-state");
      return;
    }

    const description = this.#fieldset.querySelector(":scope > [data-description]");
    const error = this.#fieldset.querySelector(":scope > [data-error]");
    const isDisabled = this.#fieldset.disabled;
    const isInvalid = !isDisabled && this.#fieldset.getAttribute("aria-invalid") === "true";

    if (error && error.hidden === isInvalid) error.hidden = !isInvalid;
    this.dataset.state = isDisabled ? "disabled" : isInvalid ? "error" : "default";
    this.#associateDescriptions(description, error);
  }

  #associateDescriptions(description, error) {
    if (!this.#fieldset) return;

    const descriptions = [description, error].filter((node) => node && !node.hidden);
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

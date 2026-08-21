const tagName = "ds-dialog";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

const nativeDialog = (host) =>
  Array.from(host.children).find(
    (child) => child instanceof Element && child.localName === "dialog",
  ) || null;
let generatedId = 0;

const nextId = (part) => {
  let id;

  do {
    generatedId += 1;
    id = `ds-dialog-${part}-${generatedId}`;
  } while (typeof document !== "undefined" && document.getElementById(id));

  return id;
};

const markedPart = (dialog, marker) => {
  const parts = Array.from(dialog.querySelectorAll(`[${marker}]`)).filter(
    (part) => part.closest("dialog") === dialog,
  );

  return parts.length === 1 ? parts[0] : null;
};

const hasText = (element) => Boolean(element?.textContent?.trim());
const isPlainDescription = (element) => hasText(element) && element.children.length === 0;
const setAttribute = (element, name, value) => {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
};

/**
 * Token styles and one declarative close affordance for a native modal dialog.
 *
 * Consumers provide the real <dialog>, its marked visible title, and product
 * actions. When authors have not supplied an explicit accessible name, this
 * element derives it from one data-dialog-title marker. The browser retains
 * modal focus, Escape, top-layer, and backdrop behaviour through
 * HTMLDialogElement.showModal().
 */
export class Dialog extends ElementBase {
  #autoDescribedBy;
  #autoLabelledBy;
  #observer;

  #onClick = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const closeControl = target.closest("[data-dialog-close]");
    if (!closeControl || !this.contains(closeControl)) return;

    const dialog = nativeDialog(this);
    if (dialog?.open) dialog.close();
  };

  connectedCallback() {
    this.addEventListener("click", this.#onClick);

    if (typeof MutationObserver !== "undefined") {
      this.#observer = new MutationObserver(() => this.#synchronize());
      this.#observer.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "aria-describedby",
          "aria-label",
          "aria-labelledby",
          "data-dialog-description",
          "data-dialog-title",
          "id",
        ],
      });
    }

    this.#synchronize();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);
    this.#observer?.disconnect();
    this.#observer = undefined;

    // A disconnected modal should not remain in the browser top layer. This
    // makes unmounting safe without changing ordinary native close behaviour.
    const dialog = nativeDialog(this);
    if (dialog?.open) dialog.close();
  }

  #synchronize() {
    const dialog = nativeDialog(this);

    if (!dialog) return;

    this.#synchronizeTitle(dialog);
    this.#synchronizeDescription(dialog);
  }

  #synchronizeTitle(dialog) {
    const authorNamed = dialog.hasAttribute("aria-label");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    const hasAuthorLabelledBy = labelledBy !== null && labelledBy !== this.#autoLabelledBy;

    if (authorNamed || hasAuthorLabelledBy) {
      this.#removeAutoLabelledBy(dialog);
      return;
    }

    const title = markedPart(dialog, "data-dialog-title");

    if (!hasText(title)) {
      this.#removeAutoLabelledBy(dialog);
      return;
    }

    if (!title.id) title.id = nextId("title");
    setAttribute(dialog, "aria-labelledby", title.id);
    this.#autoLabelledBy = title.id;
  }

  #synchronizeDescription(dialog) {
    const describedBy = dialog.getAttribute("aria-describedby");
    const hasAuthorDescribedBy = describedBy !== null && describedBy !== this.#autoDescribedBy;

    if (hasAuthorDescribedBy) return;

    const description = markedPart(dialog, "data-dialog-description");

    if (!isPlainDescription(description)) {
      this.#removeAutoDescribedBy(dialog);
      return;
    }

    if (!description.id) description.id = nextId("description");
    setAttribute(dialog, "aria-describedby", description.id);
    this.#autoDescribedBy = description.id;
  }

  #removeAutoLabelledBy(dialog) {
    if (
      this.#autoLabelledBy &&
      dialog.getAttribute("aria-labelledby") === this.#autoLabelledBy
    ) {
      dialog.removeAttribute("aria-labelledby");
    }

    this.#autoLabelledBy = undefined;
  }

  #removeAutoDescribedBy(dialog) {
    if (
      this.#autoDescribedBy &&
      dialog.getAttribute("aria-describedby") === this.#autoDescribedBy
    ) {
      dialog.removeAttribute("aria-describedby");
    }

    this.#autoDescribedBy = undefined;
  }
}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Dialog);
}

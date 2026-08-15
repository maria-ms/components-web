const tagName = "ds-dialog";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

const nativeDialog = (host) =>
  Array.from(host.children).find(
    (child) => child instanceof Element && child.localName === "dialog",
  ) || null;

/**
 * Token styles and one declarative close affordance for a native modal dialog.
 *
 * Consumers provide the real <dialog>, its labelled content, and product
 * actions. The browser retains modal focus, Escape, top-layer, and backdrop
 * behaviour through HTMLDialogElement.showModal().
 */
export class Dialog extends ElementBase {
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
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);

    // A disconnected modal should not remain in the browser top layer. This
    // makes unmounting safe without changing ordinary native close behaviour.
    const dialog = nativeDialog(this);
    if (dialog?.open) dialog.close();
  }
}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Dialog);
}

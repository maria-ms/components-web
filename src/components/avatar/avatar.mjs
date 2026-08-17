const avatarTagName = "ds-avatar";
const presenceTagName = "ds-avatar-presence";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

const statusLabels = {
  online: "Online",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
};

const directSlotChild = (host, name) =>
  Array.from(host.children).find((child) => child.getAttribute("slot") === name) ??
  null;

const avatarImage = (host) => {
  const imageContent = directSlotChild(host, "image");

  if (!imageContent) return null;
  if (imageContent.localName === "img") return imageContent;
  if (imageContent.localName === "picture") {
    return imageContent.querySelector(":scope > img");
  }

  return null;
};

/**
 * Intrinsic visual identity for one person or participant.
 *
 * Consumers retain native responsive-image and accessible-name semantics by
 * supplying one <picture> (or <img>) in the image composition position. An
 * optional fallback is shown only when that image is absent or fails.
 */
export class Avatar extends ElementBase {
  #observer = null;
  #failedImage = null;
  #observedImage = null;

  constructor() {
    super();

    if (typeof this.attachShadow !== "function" || !this.ownerDocument) return;

    const shadow = this.attachShadow({ mode: "open" });
    for (const name of ["image", "fallback", "presence"]) {
      const slot = this.ownerDocument.createElement("slot");
      slot.name = name;
      shadow.append(slot);
    }
  }

  #onMediaEvent = (event) => {
    const image = event.currentTarget;
    if (image !== avatarImage(this)) return;

    this.#failedImage = event.type === "error" ? image : null;
    this.#syncImageState();
  };

  #onContentMutation = () => {
    this.#failedImage = null;
    this.#syncImageState();
  };

  #syncImageListener = () => {
    const image = avatarImage(this);
    if (image === this.#observedImage) return image;

    this.#observedImage?.removeEventListener("load", this.#onMediaEvent);
    this.#observedImage?.removeEventListener("error", this.#onMediaEvent);
    this.#observedImage = image;
    image?.addEventListener("load", this.#onMediaEvent);
    image?.addEventListener("error", this.#onMediaEvent);
    return image;
  };

  #syncImageState = () => {
    const image = this.#syncImageListener();
    const fallback = directSlotChild(this, "fallback");
    const imageState = !image || image === this.#failedImage
      ? "fallback"
      : image.complete
        ? image.naturalWidth > 0
          ? "ready"
          : "fallback"
        : "pending";

    this.dataset.imageState = imageState;
    this.toggleAttribute("data-has-fallback", Boolean(fallback));
  };

  connectedCallback() {
    if (typeof MutationObserver !== "undefined") {
      this.#observer = new MutationObserver(this.#onContentMutation);
      this.#observer.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["media", "sizes", "slot", "src", "srcset", "type"],
      });
    }

    queueMicrotask(this.#syncImageState);
  }

  disconnectedCallback() {
    this.#observedImage?.removeEventListener("load", this.#onMediaEvent);
    this.#observedImage?.removeEventListener("error", this.#onMediaEvent);
    this.#observedImage = null;
    this.#observer?.disconnect();
    this.#observer = null;
  }
}

/**
 * Non-interactive availability marker for the Avatar presence position.
 * Its accessible name follows status unless the consumer supplies aria-label
 * for a localised or product-specific description.
 */
export class AvatarPresence extends ElementBase {
  static observedAttributes = ["status", "aria-label"];

  #managedLabel = false;
  #settingLabel = false;

  connectedCallback() {
    this.#syncAccessibility();
  }

  attributeChangedCallback(name) {
    if (name === "aria-label" && !this.#settingLabel) {
      this.#managedLabel = false;
    }

    this.#syncAccessibility();
  }

  #syncAccessibility() {
    const status = this.getAttribute("status");
    const label = statusLabels[status] ?? statusLabels.online;

    if (!this.hasAttribute("role")) this.setAttribute("role", "img");
    if (!this.hasAttribute("aria-label") || this.#managedLabel) {
      this.#managedLabel = true;
      if (this.getAttribute("aria-label") !== label) {
        this.#settingLabel = true;
        this.setAttribute("aria-label", label);
        this.#settingLabel = false;
      }
    }
  }
}

if (canUseDOM && !customElements.get(avatarTagName)) {
  customElements.define(avatarTagName, Avatar);
}

if (canUseDOM && !customElements.get(presenceTagName)) {
  customElements.define(presenceTagName, AvatarPresence);
}

const tagName = "user-avatar";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --user-avatar-size: 40px;

      position: relative;
      box-sizing: border-box;
      display: inline-grid;
      width: var(--user-avatar-size);
      height: var(--user-avatar-size);
      overflow: visible;
      color: var(--ds-semantic-color-foreground-primary-elevated);
      font-family: var(--ds-primitive-font-family-body), Inter, sans-serif;
      font-size: var(--ds-primitive-font-size-small);
      font-weight: var(--ds-primitive-font-weight-medium);
      line-height: var(--ds-primitive-font-line-height-small);
      letter-spacing: 0;
      vertical-align: middle;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .frame {
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
      overflow: hidden;
      border-radius: var(--ds-primitive-radius-full);
      background: var(--ds-semantic-color-background-primary-subtle);
    }

    slot,
    .initials {
      grid-area: 1 / 1;
      min-width: 0;
    }

    slot {
      display: none;
      width: 100%;
      height: 100%;
    }

    :host([data-has-content]) slot {
      display: block;
    }

    :host([data-has-content]) .initials {
      display: none;
    }

    .initials {
      max-width: 100%;
      overflow: hidden;
      padding: 0 var(--ds-primitive-space-01);
      text-overflow: ellipsis;
      white-space: nowrap;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    slot::slotted(img),
    slot::slotted(picture),
    slot::slotted(svg),
    slot::slotted(canvas) {
      width: 100%;
      height: 100%;
    }

    slot::slotted(img) {
      object-fit: cover;
    }

    slot::slotted(picture) {
      display: block;
      overflow: hidden;
      border-radius: inherit;
    }

    .status {
      position: absolute;
      right: 0;
      bottom: 0;
      display: none;
      width: 10px;
      height: 10px;
      border: 1.5px solid var(--ds-semantic-color-border-faint);
      border-radius: var(--ds-primitive-radius-full);
      background: var(--ds-semantic-color-background-success-elevated);
      pointer-events: none;
    }

    :host([status="online"]) .status,
    :host([status="offline"]) .status {
      display: block;
    }

    :host([status="offline"]) .status {
      background: var(--ds-semantic-color-background-disabled-elevated);
    }
  </style>

  <span part="frame" class="frame">
    <slot></slot>
    <span part="initials" class="initials"></span>
  </span>
  <span part="status" class="status" aria-hidden="true"></span>
`;

const instances = new WeakMap();

const isMeaningfulNode = (node) =>
  node.nodeType === Node.ELEMENT_NODE ||
  (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");

const hasContent = (slot) =>
  slot.assignedNodes({ flatten: true }).some(isMeaningfulNode);

const fittedImage = (image) => {
  image.style.display ||= "block";
  image.style.width ||= "100%";
  image.style.height ||= "100%";
  image.style.objectFit ||= "cover";
};

const fitSlottedMedia = (slot) =>
  slot.assignedElements({ flatten: true }).forEach((element) => {
    if (element instanceof HTMLImageElement) fittedImage(element);
    if (element.localName === "picture") {
      element.querySelectorAll("img").forEach(fittedImage);
    }
  });

const syncAvatar = (host) => {
  const { initials, slot } = instances.get(host);

  initials.textContent = host.initials;
  host.toggleAttribute("data-has-content", hasContent(slot));
  fitSlottedMedia(slot);
};

const mountAvatar = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));
  instances.set(host, {
    initials: shadow.querySelector(".initials"),
    slot: shadow.querySelector("slot"),
    onSlotChange: () => syncAvatar(host),
  });
};

/**
 * Circular avatar frame with initials fallback, slotted media, and status.
 *
 * @tag user-avatar
 * @attr {string} initials - Fallback initials shown when no media is slotted.
 * @attr {"online"|"offline"} status - Optional status indicator.
 * @slot - Optional media. A slotted image or picture wins over initials.
 * @cssprop --user-avatar-size - Avatar size. Defaults to 40px.
 */
export class UserAvatar extends HTMLElement {
  static observedAttributes = ["initials"];

  constructor() {
    super();
    mountAvatar(this);
  }

  connectedCallback() {
    const { onSlotChange, slot } = instances.get(this);
    slot.addEventListener("slotchange", onSlotChange);
    syncAvatar(this);
  }

  disconnectedCallback() {
    const { onSlotChange, slot } = instances.get(this);
    slot.removeEventListener("slotchange", onSlotChange);
  }

  attributeChangedCallback() {
    if (instances.has(this)) syncAvatar(this);
  }

  get initials() {
    return this.getAttribute("initials") || "";
  }

  set initials(value) {
    value === null || value === undefined
      ? this.removeAttribute("initials")
      : this.setAttribute("initials", value);
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, UserAvatar);

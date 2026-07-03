const tagName = "user-avatar";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --user-avatar-size: 40px;
      --user-avatar-status-size: 10px;
      --user-avatar-badge-size: 14px;
      --user-avatar-icon-size: 24px;

      position: relative;
      box-sizing: border-box;
      display: inline-grid;
      width: var(--user-avatar-size);
      height: var(--user-avatar-size);
      overflow: visible;
      color: var(--ds-semantic-color-foreground-primary-elevated);
      font-family: var(--ds-primitive-font-family-body), Inter, sans-serif;
      font-size: var(--ds-primitive-font-size-base);
      font-weight: var(--ds-primitive-font-weight-medium);
      line-height: var(--ds-primitive-font-line-height-base);
      letter-spacing: 0.02em;
      vertical-align: middle;
    }

    :host([size="xs"]) {
      --user-avatar-size: 24px;
      --user-avatar-status-size: 6px;
      --user-avatar-badge-size: 10px;
      --user-avatar-icon-size: 16px;

      font-size: var(--ds-primitive-font-size-x-small);
      line-height: var(--ds-primitive-font-line-height-x-small);
    }

    :host([size="sm"]) {
      --user-avatar-size: 32px;
      --user-avatar-status-size: 8px;
      --user-avatar-badge-size: 12px;
      --user-avatar-icon-size: 20px;

      font-size: var(--ds-primitive-font-size-small);
      line-height: var(--ds-primitive-font-line-height-small);
    }

    :host([size="lg"]) {
      --user-avatar-size: 48px;
      --user-avatar-status-size: 12px;
      --user-avatar-badge-size: 16px;
      --user-avatar-icon-size: 28px;
    }

    :host([size="xl"]) {
      --user-avatar-size: 56px;
      --user-avatar-status-size: 14px;
      --user-avatar-badge-size: 18px;
      --user-avatar-icon-size: 32px;

      font-family: var(--ds-primitive-font-family-heading), Inter, sans-serif;
      font-size: var(--ds-primitive-font-size-large);
      line-height: var(--ds-primitive-font-line-height-large);
    }

    :host([size="2xl"]) {
      --user-avatar-size: 64px;
      --user-avatar-status-size: 16px;
      --user-avatar-badge-size: 20px;
      --user-avatar-icon-size: 32px;

      font-family: var(--ds-primitive-font-family-heading), Inter, sans-serif;
      font-size: var(--ds-primitive-font-size-large);
      line-height: var(--ds-primitive-font-line-height-large);
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
      transition:
        box-shadow 120ms ease,
        transform 120ms ease;
    }

    :host(:hover) .frame {
      box-shadow:
        var(--ds-semantic-shadow-md-2-offset-x)
          var(--ds-semantic-shadow-md-2-offset-y)
          var(--ds-semantic-shadow-md-2-blur)
          var(--ds-semantic-shadow-md-2-spread)
          var(--ds-semantic-shadow-md-2-color),
        var(--ds-semantic-shadow-md-1-offset-x)
          var(--ds-semantic-shadow-md-1-offset-y)
          var(--ds-semantic-shadow-md-1-blur)
          var(--ds-semantic-shadow-md-1-spread)
          var(--ds-semantic-shadow-md-1-color);
    }

    :host(:focus-visible) {
      outline: 0;
    }

    :host(:focus-visible) .frame {
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
          var(--ds-semantic-shadow-xs-offset-y)
          var(--ds-semantic-shadow-xs-blur)
          var(--ds-semantic-shadow-xs-spread)
          var(--ds-semantic-shadow-xs-color),
        var(--ds-semantic-shadow-focused-4px-offset-x)
          var(--ds-semantic-shadow-focused-4px-offset-y)
          var(--ds-semantic-shadow-focused-4px-blur)
          var(--ds-semantic-shadow-focused-4px-spread)
          var(--ds-semantic-shadow-focused-4px-color);
    }

    slot,
    .initials,
    .placeholder {
      grid-area: 1 / 1;
      min-width: 0;
    }

    slot {
      display: none;
      width: 100%;
      height: 100%;
    }

    :host([data-has-media]) slot:not([name]) {
      display: block;
    }

    .initials,
    .placeholder {
      display: none;
    }

    :host([data-has-initials]:not([data-has-media])) .initials,
    :host(:not([data-has-media]):not([data-has-initials])) .placeholder {
      display: grid;
    }

    .initials {
      width: 100%;
      overflow: hidden;
      padding: 0 var(--ds-primitive-space-01);
      place-items: center;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    .placeholder {
      width: var(--user-avatar-icon-size);
      height: var(--user-avatar-icon-size);
      place-items: center;
    }

    .placeholder svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;
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

    .badge {
      position: absolute;
      right: 0;
      bottom: 0;
      display: none;
      width: var(--user-avatar-status-size);
      height: var(--user-avatar-status-size);
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1.5px solid var(--ds-semantic-color-border-faint);
      border-radius: var(--ds-primitive-radius-full);
      background: var(--ds-semantic-color-background-success-elevated);
      color: var(--ds-semantic-color-foreground-default);
      pointer-events: none;
    }

    :host([status="online"]:not([data-has-badge])) .badge,
    :host([status="offline"]:not([data-has-badge])) .badge,
    :host([data-has-badge]) .badge {
      display: flex;
    }

    :host([status="offline"]:not([data-has-badge])) .badge {
      background: var(--ds-semantic-color-foreground-muted-3);
    }

    :host([data-has-badge]) .badge {
      width: var(--user-avatar-badge-size);
      height: var(--user-avatar-badge-size);
      background: var(--ds-semantic-color-surface-default);
    }

    :host([data-has-badge]) .status-dot {
      display: none;
    }

    slot[name="badge"] {
      display: none;
    }

    :host([data-has-badge]) slot[name="badge"] {
      display: block;
    }

    slot[name="badge"]::slotted(*) {
      display: block;
      width: 100%;
      height: 100%;
    }

    slot[name="badge"]::slotted(img) {
      object-fit: cover;
    }
  </style>

  <span part="frame" class="frame">
    <slot></slot>
    <span part="initials" class="initials"></span>
    <span part="placeholder" class="placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </span>
  <span part="badge" class="badge" aria-hidden="true">
    <span class="status-dot"></span>
    <slot name="badge"></slot>
  </span>
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

const fitImages = (element) => {
  if (element instanceof HTMLImageElement) fittedImage(element);
  if (element.localName === "picture") {
    element.querySelectorAll("img").forEach(fittedImage);
  }
};

const fitSlottedMedia = (slot) =>
  slot.assignedElements({ flatten: true }).forEach(fitImages);

const syncAvatar = (host) => {
  const { badgeSlot, initials, mediaSlot } = instances.get(host);

  initials.textContent = host.initials;
  host.toggleAttribute("data-has-media", hasContent(mediaSlot));
  host.toggleAttribute("data-has-badge", hasContent(badgeSlot));
  host.toggleAttribute("data-has-initials", host.initials.trim() !== "");
  fitSlottedMedia(mediaSlot);
  fitSlottedMedia(badgeSlot);
};

const mountAvatar = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));
  instances.set(host, {
    badgeSlot: shadow.querySelector('slot[name="badge"]'),
    initials: shadow.querySelector(".initials"),
    mediaSlot: shadow.querySelector("slot:not([name])"),
    onSlotChange: () => syncAvatar(host),
  });
};

/**
 * Circular avatar frame with photo, initials, placeholder, and badge support.
 *
 * @tag user-avatar
 * @attr {"xs"|"sm"|"md"|"lg"|"xl"|"2xl"} size - Avatar size. Defaults to md.
 * @attr {string} initials - Fallback initials shown when no media is slotted.
 * @attr {"online"|"offline"} status - Optional built-in status dot.
 * @slot - Optional media. A slotted image or picture wins over initials.
 * @slot badge - Optional custom badge. Wins over the built-in status dot.
 */
export class UserAvatar extends HTMLElement {
  static observedAttributes = ["initials"];

  constructor() {
    super();
    mountAvatar(this);
  }

  connectedCallback() {
    const { badgeSlot, mediaSlot, onSlotChange } = instances.get(this);

    mediaSlot.addEventListener("slotchange", onSlotChange);
    badgeSlot.addEventListener("slotchange", onSlotChange);
    syncAvatar(this);
  }

  disconnectedCallback() {
    const { badgeSlot, mediaSlot, onSlotChange } = instances.get(this);

    mediaSlot.removeEventListener("slotchange", onSlotChange);
    badgeSlot.removeEventListener("slotchange", onSlotChange);
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

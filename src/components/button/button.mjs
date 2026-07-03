const tagName = "ds-button";

const observedAttributes = [
  "aria-label",
  "disabled",
  "download",
  "href",
  "name",
  "rel",
  "size",
  "target",
  "tone",
  "type",
  "value",
  "variant",
];

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --button-icon-size: 20px;
      --button-min-height: 40px;
      --button-padding-block: var(--ds-primitive-space-03);
      --button-padding-inline: var(--ds-primitive-space-04);
      --button-radius: var(--ds-primitive-radius-04);
      --button-gap: var(--ds-primitive-space-03);
      --button-background: var(--ds-component-button-color-background-default);
      --button-background-hover: var(--ds-component-button-color-background-hover-elevated);
      --button-border: transparent;
      --button-border-hover: var(--button-border);
      --button-foreground: var(--ds-component-button-color-foreground-default);
      --button-font-size: var(--ds-semantic-typography-body-small-font-size);
      --button-font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      --button-line-height: var(--ds-semantic-typography-body-small-line-height);
      --button-text-underline-offset: 25%;

      box-sizing: border-box;
      display: inline-flex;
      max-width: 100%;
      color: var(--button-foreground);
      font-family: inherit;
      vertical-align: middle;
    }

    :host([size="x-small"]) {
      --button-icon-size: 16px;
      --button-min-height: 24px;
      --button-padding-block: var(--ds-primitive-space-02);
      --button-padding-inline: var(--ds-primitive-space-03);
      --button-radius: var(--ds-primitive-radius-03);
      --button-gap: var(--ds-primitive-space-02);
      --button-font-size: var(--ds-semantic-typography-body-x-small-font-size);
      --button-line-height: var(--ds-semantic-typography-body-x-small-line-height);
    }

    :host([size="small"]) {
      --button-icon-size: 16px;
      --button-min-height: 28px;
      --button-padding-block: var(--ds-primitive-space-02);
      --button-padding-inline: var(--ds-primitive-space-03);
      --button-gap: var(--ds-primitive-space-02);
    }

    :host([size="large"]) {
      --button-icon-size: 24px;
      --button-min-height: 48px;
      --button-padding-block: var(--ds-primitive-space-04);
      --button-padding-inline: var(--ds-primitive-space-05);
      --button-radius: var(--ds-primitive-radius-05);
      --button-font-size: var(--ds-semantic-typography-body-base-font-size);
      --button-line-height: var(--ds-semantic-typography-body-base-line-height);
    }

    :host([variant="secondary"]) {
      --button-background: var(--ds-component-button-color-background-secondary);
      --button-background-hover: var(--ds-component-button-color-background-hover-muted);
      --button-foreground: var(--ds-component-button-color-foreground-primary);
    }

    :host([variant="outline"]) {
      --button-background: var(--ds-component-button-color-background-tertiary);
      --button-background-hover: var(--ds-component-button-color-background-hover-muted);
      --button-border: var(--ds-component-button-color-border-primary);
      --button-foreground: var(--ds-component-button-color-foreground-primary);
    }

    :host([variant="link"]),
    :host([variant="link-muted"]) {
      --button-background: transparent;
      --button-background-hover: transparent;
      --button-border: transparent;
      --button-font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      --button-padding-block: var(--ds-primitive-space-01);
      --button-padding-inline: 0px;
    }

    :host([variant="link"]) {
      --button-foreground: var(--ds-component-button-color-foreground-primary);
    }

    :host([variant="link-muted"]) {
      --button-foreground: var(--ds-component-button-color-foreground-secondary);
    }

    :host([variant="ghost"]) {
      --button-background: transparent;
      --button-background-hover: var(--ds-component-button-color-background-hover-muted);
      --button-border: transparent;
      --button-foreground: var(--ds-component-button-color-foreground-primary);
      --button-font-weight: var(--ds-semantic-typography-body-small-font-weight-root);
    }

    :host([variant="link"][size="x-small"]),
    :host([variant="link-muted"][size="x-small"]),
    :host([variant="link"][size="small"]),
    :host([variant="link-muted"][size="small"]) {
      --button-min-height: 20px;
    }

    :host([variant="link"][size="large"]),
    :host([variant="link-muted"][size="large"]) {
      --button-min-height: 28px;
    }

    :host([tone="destructive"]) {
      --button-background: var(--ds-component-button-color-background-destructive-elevated);
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-elevated);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-secondary);
    }

    :host([tone="destructive"][variant="secondary"]) {
      --button-background: var(--ds-component-button-color-background-destructive-muted);
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-muted);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([tone="destructive"][variant="outline"]) {
      --button-background: var(--ds-component-button-color-background-tertiary);
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-muted);
      --button-border: var(--ds-component-button-color-border-destructive-elevated);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([tone="destructive"][variant="link"]),
    :host([tone="destructive"][variant="link-muted"]) {
      --button-background: transparent;
      --button-background-hover: transparent;
      --button-border: transparent;
      --button-foreground: var(--ds-component-button-color-foreground-destructive-tertiary);
    }

    :host([tone="destructive"][variant="ghost"]) {
      --button-background: transparent;
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-muted);
      --button-border: transparent;
      --button-foreground: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    :host([disabled]:not([tone="destructive"]):not([variant="secondary"]):not([variant="outline"]):not([variant="link"]):not([variant="link-muted"]):not([variant="ghost"])) {
      --button-background: var(--ds-component-button-color-background-disabled);
      --button-foreground: var(--ds-component-button-color-foreground-disabled);
    }

    :host([disabled]:not([tone="destructive"])[variant="link"]),
    :host([disabled]:not([tone="destructive"])[variant="link-muted"]) {
      --button-foreground: var(--ds-component-button-color-foreground-disabled);
    }

    :host([disabled]:not([tone="destructive"])[variant="ghost"]) {
      --button-foreground: var(--ds-component-button-color-foreground-disabled);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .control,
    .media,
    .label,
    .end {
      display: inline-flex;
      align-items: center;
    }

    .control {
      width: 100%;
      max-width: 100%;
      min-height: var(--button-min-height);
      justify-content: center;
      gap: var(--button-gap);
      border: 1px solid var(--button-border);
      border-radius: var(--button-radius);
      padding: var(--button-padding-block) var(--button-padding-inline);
      appearance: none;
      background: var(--button-background);
      color: var(--button-foreground);
      cursor: pointer;
      font: inherit;
      font-size: var(--button-font-size);
      font-weight: var(--button-font-weight);
      line-height: var(--button-line-height);
      letter-spacing: 0;
      text-align: center;
      text-decoration: none;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        box-shadow 120ms ease,
        color 120ms ease;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    :host(:not([disabled])) .control:hover {
      border-color: var(--button-border-hover);
      background: var(--button-background-hover);
    }

    :host(:not([disabled])[variant="link"]) .control:hover,
    :host(:not([disabled])[variant="link-muted"]) .control:hover {
      text-decoration: underline;
      text-underline-offset: var(--button-text-underline-offset);
    }

    :host(:not([disabled])) .control:focus-visible {
      outline: 0;
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

    :host(:not([disabled])[tone="destructive"]) .control:focus-visible {
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
          var(--ds-semantic-shadow-xs-offset-y)
          var(--ds-semantic-shadow-xs-blur)
          var(--ds-semantic-shadow-xs-spread)
          var(--ds-semantic-shadow-xs-color),
        var(--ds-semantic-shadow-focused-4px-destructive-offset-x)
          var(--ds-semantic-shadow-focused-4px-destructive-offset-y)
          var(--ds-semantic-shadow-focused-4px-destructive-blur)
          var(--ds-semantic-shadow-focused-4px-destructive-spread)
          var(--ds-semantic-shadow-focused-4px-destructive-color);
    }

    :host([disabled]) .control {
      cursor: not-allowed;
      pointer-events: none;
    }

    .media,
    .end {
      width: var(--button-icon-size);
      height: var(--button-icon-size);
      flex: 0 0 auto;
      justify-content: center;
    }

    .media[hidden],
    .end[hidden] {
      display: none;
    }

    .label {
      min-width: 0;
      justify-content: center;
      overflow: hidden;
      word-break: break-word;
    }

    slot[name="media"]::slotted(*),
    slot[name="end"]::slotted(*) {
      display: block;
      width: 100%;
      height: 100%;
      color: inherit;
    }

    slot[name="media"]::slotted(svg),
    slot[name="end"]::slotted(svg) {
      stroke: currentColor;
    }

    slot[name="label"]::slotted(*),
    slot:not([name])::slotted(*) {
      color: inherit;
      font: inherit;
      letter-spacing: 0;
      font-kerning: none;
      font-variant-ligatures: none;
    }
  </style>

  <span part="media" class="media" hidden><slot name="media"></slot></span>
  <span part="label" class="label"><slot name="label"></slot><slot></slot></span>
  <span part="end" class="end" hidden><slot name="end"></slot></span>
`;

const instances = new WeakMap();

const hasAssignedContent = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .some((node) =>
      node.nodeType === Node.TEXT_NODE ? node.textContent.trim() : true,
    );

const setOptionalAttribute = (element, name, value) =>
  value == null || value === ""
    ? element.removeAttribute(name)
    : element.setAttribute(name, value);

const isLink = (host) => host.hasAttribute("href");

const buttonTypes = ["button", "submit", "reset"];

const buttonType = (host) =>
  buttonTypes.includes(host.getAttribute("type"))
    ? host.getAttribute("type")
    : "button";

const createControl = (host) => {
  const control = document.createElement(isLink(host) ? "a" : "button");

  control.setAttribute("part", "control");
  control.className = "control";
  control.append(template.content.cloneNode(true));
  if (control instanceof HTMLButtonElement) control.type = buttonType(host);

  return control;
};

const syncSlots = (host) => {
  const { endSlot, media, mediaSlot, end } = instances.get(host);

  media.hidden = !hasAssignedContent(mediaSlot);
  end.hidden = !hasAssignedContent(endSlot);
};

const syncControl = (host) => {
  const state = instances.get(host);
  const { control } = state;
  const disabled = host.disabled;

  if (control instanceof HTMLAnchorElement) {
    setOptionalAttribute(control, "href", disabled ? undefined : host.getAttribute("href"));
    setOptionalAttribute(control, "target", host.getAttribute("target"));
    setOptionalAttribute(control, "rel", host.getAttribute("rel"));
    setOptionalAttribute(control, "download", host.getAttribute("download"));
    control.toggleAttribute("aria-disabled", disabled);
    if (disabled) control.tabIndex = -1;
    else control.removeAttribute("tabindex");
  }

  if (control instanceof HTMLButtonElement) {
    control.disabled = disabled;
    control.type = buttonType(host);
    setOptionalAttribute(control, "name", host.getAttribute("name"));
    setOptionalAttribute(control, "value", host.getAttribute("value"));
  }

  setOptionalAttribute(control, "aria-label", host.getAttribute("aria-label"));
};

const replaceControl = (host) => {
  const state = instances.get(host);
  const nextControl = createControl(host);

  state.control.replaceWith(nextControl);
  state.control.removeEventListener("click", state.onClick);
  nextControl.addEventListener("click", state.onClick);
  state.control = nextControl;
  state.media = nextControl.querySelector(".media");
  state.mediaSlot = nextControl.querySelector("slot[name='media']");
  state.end = nextControl.querySelector(".end");
  state.endSlot = nextControl.querySelector("slot[name='end']");
  state.slots.forEach((slot) => slot.removeEventListener("slotchange", state.onSlotChange));
  state.slots = [...nextControl.querySelectorAll("slot")];
  state.slots.forEach((slot) => slot.addEventListener("slotchange", state.onSlotChange));
  syncControl(host);
  syncSlots(host);
};

const sync = (host, name) => {
  const state = instances.get(host);

  if (!state) return;
  if (name === "href" && isLink(host) !== (state.control instanceof HTMLAnchorElement)) {
    replaceControl(host);
    return;
  }
  syncControl(host);
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });
  const control = createControl(host);

  shadow.append(control);
  instances.set(host, {
    control,
    end: control.querySelector(".end"),
    endSlot: control.querySelector("slot[name='end']"),
    media: control.querySelector(".media"),
    mediaSlot: control.querySelector("slot[name='media']"),
    onClick: (event) => {
      if (!host.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    onSlotChange: () => syncSlots(host),
    slots: [...control.querySelectorAll("slot")],
  });
};

/**
 * Token-driven button control.
 *
 * @tag ds-button
 * @attr {"primary"|"secondary"|"outline"|"link"|"link-muted"|"ghost"} variant - Visual button variant.
 * @attr {"x-small"|"small"|"medium"|"large"} size - Button size.
 * @attr {"default"|"destructive"} tone - Button intent tone.
 * @attr {boolean} disabled - Disables the control.
 * @attr {string} href - Renders the control as a link.
 * @attr {"button"|"submit"|"reset"} type - Native button type.
 * @attr {string} aria-label - Accessible label for icon-only buttons.
 * @slot media - Leading icon or media.
 * @slot label - Button label.
 * @slot - Button label fallback.
 * @slot end - Trailing icon or media.
 */
export class Button extends HTMLElement {
  static observedAttributes = observedAttributes;

  constructor() {
    super();
    mount(this);
  }

  connectedCallback() {
    const state = instances.get(this);

    state.slots.forEach((slot) => slot.addEventListener("slotchange", state.onSlotChange));
    syncControl(this);
    syncSlots(this);
    state.control.addEventListener("click", state.onClick);
  }

  disconnectedCallback() {
    const state = instances.get(this);

    state.slots.forEach((slot) =>
      slot.removeEventListener("slotchange", state.onSlotChange),
    );
    state.control.removeEventListener("click", state.onClick);
  }

  attributeChangedCallback(name) {
    sync(this, name);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  click() {
    instances.get(this)?.control.click();
  }

  focus(options) {
    instances.get(this)?.control.focus(options);
  }

  blur() {
    instances.get(this)?.control.blur();
  }
}

export { Button as DsButton };

if (!customElements.get(tagName)) customElements.define(tagName, Button);

const tags = {
  card: "ds-accordion",
  content: "ds-accordion-content",
  header: "ds-accordion-header",
  item: "ds-accordion-item",
  panel: "ds-accordion-panel",
};

const observedAttributes = ["aria-label", "disabled", "expanded"];

const template = document.createElement("template");
const cardTemplate = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --ds-accordion-width: 353px;
      --ds-accordion-icon-size: 20px;

      box-sizing: border-box;
      display: block;
      width: var(--ds-accordion-width);
      max-width: 100%;
      color: var(--ds-semantic-color-foreground-default);
      font-family: inherit;
      font-size: var(--ds-semantic-typography-body-small-font-size);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .root,
    .trigger,
    .content {
      display: flex;
    }

    .root {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      gap: var(--ds-primitive-space-03);
      padding: var(--ds-primitive-space-04) 0;
    }

    .trigger {
      width: 100%;
      min-width: 0;
      align-items: flex-start;
      gap: var(--ds-primitive-space-03);
      border: 0;
      padding: 0;
      appearance: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
      text-align: left;
    }

    .trigger:focus-visible {
      outline: 0;
      border-radius: var(--ds-primitive-radius-03);
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

    .title,
    .content {
      min-width: 0;
      word-break: break-word;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    .title {
      flex: 1 1 auto;
      color: var(--ds-semantic-color-foreground-default);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    .icon {
      width: var(--ds-accordion-icon-size);
      height: var(--ds-accordion-icon-size);
      flex: 0 0 auto;
      color: var(--ds-semantic-color-foreground-default);
    }

    .icon-up,
    :host([expanded]) .icon-down {
      display: none;
    }

    :host([expanded]) .icon-up {
      display: block;
    }

    .content {
      width: 100%;
      flex-direction: column;
      color: var(--ds-semantic-color-foreground-muted-2);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    .content[hidden] {
      display: none;
    }

    :host([disabled]) {
      color: var(--ds-semantic-color-foreground-disabled-elevated);
      cursor: not-allowed;
    }

    :host([disabled]) .trigger {
      color: inherit;
      cursor: not-allowed;
    }

    :host([disabled]) .title,
    :host([disabled]) .icon {
      color: var(--ds-semantic-color-foreground-disabled-elevated);
    }

    :host([disabled]) .content {
      color: var(--ds-semantic-color-foreground-disabled-muted);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      stroke: currentColor;
    }

    slot[name="header"]::slotted(*) {
      display: block;
      min-width: 0;
      color: inherit;
      font: inherit;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    slot[name="content"]::slotted(*) {
      display: block;
      color: inherit;
      font: inherit;
      font-kerning: none;
      font-variant-ligatures: none;
    }
  </style>

  <div part="root" class="root">
    <button part="trigger" class="trigger" type="button">
      <span part="title" class="title">
        <slot name="header"></slot>
      </span>
      <span part="icon" class="icon" aria-hidden="true">
        <svg class="icon-down" viewBox="0 0 24 24" fill="none" data-icon="chevron-down" data-figma-node-id="40012621:9281">
          <path d="M6 9L12 15L18 9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg class="icon-up" viewBox="0 0 24 24" fill="none" data-icon="chevron-up" data-figma-node-id="40012621:9291">
          <path d="M18 15L12 9L6 15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>
    <div part="content" class="content">
      <slot name="content"></slot>
    </div>
  </div>
`;

const instances = new WeakMap();
const nextAccordionId = (() => {
  let id = 0;
  return () => `${tags.item}-${id++}`;
})();

cardTemplate.innerHTML = `
  <style>
    :host {
      --ds-accordion-width: 440px;

      box-sizing: border-box;
      display: flex;
      width: var(--ds-accordion-width);
      max-width: 100%;
      flex-direction: column;
      align-items: stretch;
      border: 1px solid var(--ds-semantic-color-border-default);
      border-radius: var(--ds-primitive-radius-05);
      padding: var(--ds-primitive-space-06);
      background: var(--ds-component-card-color-background-default);
      box-shadow:
        var(--ds-semantic-shadow-sm-2-offset-x)
          var(--ds-semantic-shadow-sm-2-offset-y)
          var(--ds-semantic-shadow-sm-2-blur)
          var(--ds-semantic-shadow-sm-2-spread)
          var(--ds-semantic-shadow-sm-2-color),
        var(--ds-semantic-shadow-sm-1-offset-x)
          var(--ds-semantic-shadow-sm-1-offset-y)
          var(--ds-semantic-shadow-sm-1-blur)
          var(--ds-semantic-shadow-sm-1-spread)
          var(--ds-semantic-shadow-sm-1-color);
      color: var(--ds-semantic-color-foreground-default);
      font-family: inherit;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    ::slotted(ds-accordion-item),
    ::slotted(ds-accordion-panel) {
      --ds-accordion-width: 100%;

      flex: 0 0 auto;
    }

    ::slotted(ds-accordion-item:not(:first-child)),
    ::slotted(ds-accordion-panel:not(:first-child)) {
      border-top: 1px solid var(--ds-semantic-color-border-default);
      margin-top: var(--ds-primitive-space-04);
      padding-top: var(--ds-primitive-space-04);
    }
  </style>

  <slot></slot>
`;

const setOptionalAttribute = (element, name, value) =>
  value == null || value === ""
    ? element.removeAttribute(name)
    : element.setAttribute(name, value);

const disabled = (host) => host.hasAttribute("disabled");

const sync = (host) => {
  const { button, content, id } = instances.get(host);
  const contentId = `${id}-content`;
  const ariaLabel = host.getAttribute("aria-label");

  content.id = contentId;
  content.hidden = !host.expanded;
  button.disabled = disabled(host);
  button.setAttribute("aria-controls", contentId);
  button.setAttribute("aria-expanded", String(host.expanded));
  setOptionalAttribute(button, "aria-label", ariaLabel);
};

const setExpanded = (host, expanded) => {
  const nextExpanded = Boolean(expanded);

  if (nextExpanded === host.expanded) return;
  const beforeToggle = new CustomEvent("beforetoggle", {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: { expanded: nextExpanded },
  });

  if (!host.dispatchEvent(beforeToggle)) return;
  host.toggleAttribute("expanded", nextExpanded);
  host.dispatchEvent(
    new CustomEvent("toggle", {
      bubbles: true,
      composed: true,
      detail: { expanded: nextExpanded },
    }),
  );
};

const connect = (host) => {
  const state = instances.get(host);

  state.button.addEventListener("click", state.onToggle);
  sync(host);
};

const disconnect = (host) => {
  const state = instances.get(host);

  state.button.removeEventListener("click", state.onToggle);
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });
  shadow.append(template.content.cloneNode(true));

  instances.set(host, {
    button: shadow.querySelector(".trigger"),
    content: shadow.querySelector(".content"),
    id: nextAccordionId(),
    onToggle: () => {
      if (!disabled(host)) setExpanded(host, !host.expanded);
    },
  });
};

/**
 * Token-driven accordion disclosure.
 *
 * @tag ds-accordion-item
 * @attr {boolean} expanded - Shows the panel content.
 * @attr {boolean} disabled - Prevents the panel from being toggled.
 * @attr {string} aria-label - Accessible label for icon-only or custom title usage.
 * @slot header - Accordion header content. Use ds-accordion-header for default markup.
 * @slot content - Accordion panel content. Use ds-accordion-content for default markup.
 * @fires beforetoggle - Cancelable event fired before expanded changes.
 * @fires toggle - Fired after expanded changes.
 */
export class AccordionItem extends HTMLElement {
  static observedAttributes = observedAttributes;

  constructor() {
    super();
    mount(this);
  }

  connectedCallback() {
    connect(this);
  }

  disconnectedCallback() {
    disconnect(this);
  }

  attributeChangedCallback() {
    if (instances.has(this)) sync(this);
  }

  get disabled() {
    return disabled(this);
  }

  set disabled(value) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  get expanded() {
    return this.hasAttribute("expanded");
  }

  set expanded(value) {
    setExpanded(this, value);
  }

  focus(options) {
    instances.get(this)?.button.focus(options);
  }

  blur() {
    instances.get(this)?.button.blur();
  }
}

const cardItems = (host) =>
  [...host.querySelectorAll(`${tags.item}, ${tags.panel}`)].filter(
    (item) => item.parentElement === host,
  );

const syncCard = (host) => {
  if (!host.hasAttribute("role")) host.setAttribute("role", "group");
};

/**
 * Token-driven accordion card.
 *
 * @tag ds-accordion
 * @attr {boolean} multiple - Allows more than one direct child panel to be open.
 * @slot - Accordion items.
 */
export class AccordionCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(
      cardTemplate.content.cloneNode(true),
    );
    instances.set(this, {
      onToggle: (event) => {
        if (
          this.hasAttribute("multiple") ||
          event.target.parentElement !== this ||
          !event.detail?.expanded
        ) {
          return;
        }

        cardItems(this).forEach((item) => {
          if (item !== event.target) item.expanded = false;
        });
      },
    });
  }

  connectedCallback() {
    this.addEventListener("toggle", instances.get(this).onToggle);
    syncCard(this);
  }

  disconnectedCallback() {
    this.removeEventListener("toggle", instances.get(this).onToggle);
  }
}

const setDefaultSlot = (host, name) => {
  if (!host.hasAttribute("slot")) host.setAttribute("slot", name);
};

/**
 * Accordion item header.
 *
 * @tag ds-accordion-header
 * @slot - Header text.
 */
export class AccordionHeader extends HTMLElement {
  connectedCallback() {
    setDefaultSlot(this, "header");
  }
}

/**
 * Accordion item content.
 *
 * @tag ds-accordion-content
 * @slot - Panel content.
 */
export class AccordionContent extends HTMLElement {
  connectedCallback() {
    setDefaultSlot(this, "content");
  }
}

export class AccordionPanel extends AccordionItem {}

export { AccordionItem as Accordion };

if (!customElements.get(tags.item)) customElements.define(tags.item, AccordionItem);
if (!customElements.get(tags.panel))
  customElements.define(tags.panel, AccordionPanel);
if (!customElements.get(tags.card))
  customElements.define(tags.card, AccordionCard);
if (!customElements.get(tags.header))
  customElements.define(tags.header, AccordionHeader);
if (!customElements.get(tags.content))
  customElements.define(tags.content, AccordionContent);

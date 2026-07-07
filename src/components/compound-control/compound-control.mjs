const tagName = "ds-compound-control";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      max-width: 100%;
      color: var(--ds-semantic-color-foreground-default);
      font-family: inherit;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .control {
      display: flex;
      width: 100%;
      min-height: var(--ds-component-input-height-root);
      align-items: stretch;
      overflow: hidden;
      border: 1px solid var(--ds-component-input-color-border-default);
      border-radius: var(--ds-primitive-radius-04);
      background: var(--ds-component-input-color-background-default);
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        box-shadow 120ms ease;
    }

    :host(:hover:not([aria-invalid="true"])) .control {
      background: var(--ds-component-input-color-background-hover);
    }

    :host(:focus-within:not([aria-invalid="true"])) .control {
      border-color: var(--ds-semantic-color-border-focus);
      background: var(--ds-component-input-color-background-default);
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

    :host([aria-invalid="true"]) .control {
      border-color: var(--ds-semantic-color-border-destructive-elevated);
      background: var(--ds-semantic-color-background-destructive-subtle);
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

    ::slotted([data-ds-compound-item]) {
      min-width: 0;
      flex: 1 1 0;
      border-inline-start: 1px solid var(--ds-semantic-color-border-default);
      --ds-control-background: transparent;
      --ds-control-border-color: transparent;
      --ds-control-border-radius: 0;
      --ds-control-border-width: 0px;
      --ds-control-focus-background: transparent;
      --ds-control-focus-border-color: transparent;
      --ds-control-focus-shadow: none;
      --ds-control-hover-background: transparent;
      --ds-control-invalid-background: transparent;
      --ds-control-invalid-border-color: transparent;
      --ds-control-invalid-shadow: none;
    }

    ::slotted([data-ds-compound-first]) {
      border-inline-start: 0;
    }
  </style>

  <div part="control" class="control">
    <slot></slot>
  </div>
`;

const states = new WeakMap();

const assignedControls = (slot) =>
  slot.assignedElements({ flatten: true }).filter((element) =>
    element.matches("ds-input-number, ds-input-select, input, select, textarea"),
  );

const syncItems = (host) => {
  const state = states.get(host);
  const controls = assignedControls(state.slot);

  state.items.forEach((item) => {
    if (!controls.includes(item)) {
      item.removeAttribute("data-ds-compound-item");
      item.removeAttribute("data-ds-compound-first");
    }
  });

  controls.forEach((control, index) => {
    control.setAttribute("data-ds-compound-item", "");
    control.toggleAttribute("data-ds-compound-first", index === 0);
  });

  state.items = controls;
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));
  states.set(host, {
    items: [],
    slot: shadow.querySelector("slot"),
    onSlotChange: () => syncItems(host),
  });
};

/**
 * Visual wrapper that merges the chrome of related form controls.
 *
 * The child controls remain real form-associated controls. This component only
 * owns the shared border, background, focus ring, separators, and invalid ring.
 *
 * @tag ds-compound-control
 * @attr {"true"|"false"} aria-invalid - Accessibility and visual invalid state for the group.
 * @slot - Related form controls.
 */
export class CompoundControl extends HTMLElement {
  constructor() {
    super();
    mount(this);
  }

  connectedCallback() {
    const state = states.get(this);

    if (!this.hasAttribute("role")) this.setAttribute("role", "group");
    state.slot.addEventListener("slotchange", state.onSlotChange);
    syncItems(this);
  }

  disconnectedCallback() {
    const state = states.get(this);

    state.items.forEach((item) => {
      item.removeAttribute("data-ds-compound-item");
      item.removeAttribute("data-ds-compound-first");
    });
    state.slot.removeEventListener("slotchange", state.onSlotChange);
  }

  focus(options) {
    states.get(this)?.items[0]?.focus?.(options);
  }
}

if (!customElements.get(tagName))
  customElements.define(tagName, CompoundControl);

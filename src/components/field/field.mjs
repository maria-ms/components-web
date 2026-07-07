const tagName = "ds-field";

const controlSelector = [
  "ds-compound-control",
  "ds-input-number",
  "ds-input-select",
  "button",
  "input",
  "select",
  "textarea",
].join(",");

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: grid;
      width: 100%;
      max-width: 100%;
      gap: var(--ds-primitive-space-03);
      color: var(--ds-semantic-color-foreground-default);
      font-family: inherit;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .label,
    .description,
    .error {
      margin: 0;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    .label {
      color: var(--ds-semantic-color-foreground-default);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    .control {
      display: contents;
    }

    .description,
    .error {
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-semantic-typography-body-x-small-font-size);
      font-weight: var(--ds-semantic-typography-body-x-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-x-small-line-height);
    }

    .error,
    :host([invalid]) .label,
    :host([invalid]) .description {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    :host(:not([invalid])) .error {
      display: none;
    }

    slot[name="label"]::slotted(*),
    slot[name="description"]::slotted(*),
    slot[name="error"]::slotted(*) {
      display: inline;
      margin: 0;
      font: inherit;
      color: inherit;
    }

    ::slotted(ds-compound-control),
    ::slotted(ds-input-number),
    ::slotted(ds-input-select) {
      width: 100%;
    }
  </style>

  <label part="label" class="label" hidden>
    <slot name="label"></slot>
  </label>
  <div part="control" class="control">
    <slot></slot>
  </div>
  <p part="description" class="description" hidden>
    <slot name="description"></slot>
  </p>
  <p part="error" class="error" hidden>
    <slot name="error"></slot>
  </p>
`;

const states = new WeakMap();

let id = 0;

const nextId = () => `${tagName}-${id++}`;

const assignedElements = (slot) => slot.assignedElements({ flatten: true });

const hasContent = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .some(
      (node) => node.nodeType === 1 || (node.textContent ?? "").trim() !== "",
    );

const firstControl = (host) =>
  [...host.children].find((element) => element.matches(controlSelector));

const slottedId = (slot, fallback) => {
  const element = assignedElements(slot)[0];

  if (!element) return "";
  if (!element.id) element.id = fallback;

  return element.id;
};

const setManagedReference = (state, element, attribute, value, managedKey) => {
  const previous = state[managedKey];

  if (!value) {
    if (previous && element.getAttribute(attribute) === previous) {
      element.removeAttribute(attribute);
    }
    state[managedKey] = "";
    return;
  }

  const current = element.getAttribute(attribute);
  if (!current || current === previous) {
    element.setAttribute(attribute, value);
    state[managedKey] = value;
  }
};

const setInvalid = (state, control, invalid) => {
  const wasManaged = state.invalidManaged.has(control);
  const current = control.getAttribute("aria-invalid");

  if (invalid && (!current || wasManaged)) {
    control.setAttribute("aria-invalid", "true");
    state.invalidManaged.add(control);
  } else if (!invalid && wasManaged) {
    control.removeAttribute("aria-invalid");
    state.invalidManaged.delete(control);
  }
};

const syncField = (host) => {
  const state = states.get(host);
  const control = firstControl(host);
  const hasLabel = hasContent(state.labelSlot);
  const hasDescription = hasContent(state.descriptionSlot);
  const hasError = hasContent(state.errorSlot);
  const labelId = hasLabel ? slottedId(state.labelSlot, `${state.id}-label`) : "";
  const descriptionId =
    host.invalid && hasError
      ? slottedId(state.errorSlot, `${state.id}-error`)
      : hasDescription
        ? slottedId(state.descriptionSlot, `${state.id}-description`)
        : "";

  state.label.hidden = !hasLabel;
  state.description.hidden = !hasDescription;
  state.error.hidden = !hasError;

  if (!control) return;

  setManagedReference(state, control, "aria-labelledby", labelId, "labelledBy");
  setManagedReference(state, control, "aria-describedby", descriptionId, "describedBy");
  setInvalid(state, control, host.invalid);
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));
  states.set(host, {
    describedBy: "",
    description: shadow.querySelector(".description"),
    descriptionSlot: shadow.querySelector('slot[name="description"]'),
    defaultSlot: shadow.querySelector("slot:not([name])"),
    error: shadow.querySelector(".error"),
    errorSlot: shadow.querySelector('slot[name="error"]'),
    id: nextId(),
    invalidManaged: new WeakSet(),
    label: shadow.querySelector(".label"),
    labelledBy: "",
    labelSlot: shadow.querySelector('slot[name="label"]'),
    onSlotChange: () => host.sync(),
  });
};

const connect = (host) => {
  const state = states.get(host);

  [
    state.defaultSlot,
    state.descriptionSlot,
    state.errorSlot,
    state.labelSlot,
  ].forEach((slot) => slot.addEventListener("slotchange", state.onSlotChange));
  state.label.addEventListener("click", host.onLabelClick);
  host.sync();
};

const disconnect = (host) => {
  const state = states.get(host);

  [
    state.defaultSlot,
    state.descriptionSlot,
    state.errorSlot,
    state.labelSlot,
  ].forEach((slot) =>
    slot.removeEventListener("slotchange", state.onSlotChange),
  );
  state.label.removeEventListener("click", host.onLabelClick);
};

/**
 * Field wrapper for one form control or one compound form-control group.
 *
 * @tag ds-field
 * @attr {boolean} invalid - Shows the error slot and marks the slotted control invalid.
 * @slot label - Visible field label.
 * @slot - A form control or `ds-compound-control`.
 * @slot description - Supporting text.
 * @slot error - Validation text shown when invalid.
 */
export class Field extends HTMLElement {
  static observedAttributes = ["invalid"];

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
    if (states.has(this)) this.sync();
  }

  get invalid() {
    return this.hasAttribute("invalid");
  }

  set invalid(value) {
    this.toggleAttribute("invalid", Boolean(value));
  }

  sync() {
    syncField(this);
  }

  onLabelClick = () => firstControl(this)?.focus?.();
}

if (!customElements.get(tagName)) customElements.define(tagName, Field);

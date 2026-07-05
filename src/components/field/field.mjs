const tags = {
  field: "ds-field",
  group: "ds-field-group",
};

const controlSelector = [
  "ds-input-number",
  "ds-input-otp",
  "ds-input-search",
  "ds-input-select",
  "ds-input-text",
  "button",
  "input",
  "select",
  "textarea",
].join(",");

const template = document.createElement("template");
const groupTemplate = document.createElement("template");

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

    .error {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

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

    ::slotted(ds-input-number),
    ::slotted(ds-input-otp),
    ::slotted(ds-input-search),
    ::slotted(ds-input-select),
    ::slotted(ds-input-text) {
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

groupTemplate.innerHTML = `
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

    .controls {
      display: flex;
      width: 100%;
      flex-direction: var(--ds-field-group-direction, column);
      align-items: var(--ds-field-group-align-items, stretch);
      gap: var(--ds-field-group-gap, var(--ds-primitive-space-02));
    }

    .description,
    .error {
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-semantic-typography-body-x-small-font-size);
      font-weight: var(--ds-semantic-typography-body-x-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-x-small-line-height);
    }

    .error {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

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

    ::slotted(ds-input-select),
    ::slotted(ds-input-number),
    ::slotted(ds-input-search),
    ::slotted(ds-input-text) {
      min-width: 0;
      width: 100%;
    }
  </style>

  <div part="label" class="label" hidden>
    <slot name="label"></slot>
  </div>
  <div part="controls" class="controls">
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

const nextId = (tagName) => `${tagName}-${id++}`;

const assigned = (slot) => slot.assignedElements({ flatten: true });

const hasContent = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .some(
      (node) => node.nodeType === 1 || (node.textContent ?? "").trim() !== "",
    );

const firstControl = (host) =>
  [...host.children].find((element) => element.matches(controlSelector));

const slottedId = (slot, fallback) => {
  const element = assigned(slot)[0];
  if (!element) return "";
  if (!element.id) element.id = fallback;
  return element.id;
};

const setManagedReference = (state, element, attribute, idValue, managedKey) => {
  const previous = state?.[managedKey];

  if (!idValue) {
    if (previous && element.getAttribute(attribute) === previous)
      element.removeAttribute(attribute);
    state[managedKey] = "";
    return;
  }

  const current = element.getAttribute(attribute);
  if (!current || current === previous) {
    element.setAttribute(attribute, idValue);
    state[managedKey] = idValue;
  }
};

const setInvalid = (state, control, invalid) => {
  const current = control.getAttribute("aria-invalid");
  const wasManaged = state.invalidManaged.has(control);

  if (invalid && (!current || wasManaged)) {
    control.setAttribute("aria-invalid", "true");
    state.invalidManaged.add(control);
  } else if (!invalid && wasManaged) {
    control.removeAttribute("aria-invalid");
    state.invalidManaged.delete(control);
  }
};

const setOptionalAttribute = (element, name, value) =>
  value ? element.setAttribute(name, value) : element.removeAttribute(name);

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

const syncGroup = (host) => {
  const state = states.get(host);
  const controls = [...host.children].filter((element) =>
    element.matches(controlSelector),
  );
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
  if (!host.hasAttribute("role")) host.setAttribute("role", "group");
  setOptionalAttribute(host, "aria-labelledby", labelId);
  setOptionalAttribute(host, "aria-describedby", descriptionId);
  controls.forEach((control) => setInvalid(state, control, host.invalid));
};

const mount = (host, source) => {
  const shadow = host.attachShadow({ mode: "open" });
  shadow.append(source.content.cloneNode(true));
  states.set(host, {
    id: nextId(host.localName),
    describedBy: "",
    error: shadow.querySelector(".error"),
    errorSlot: shadow.querySelector('slot[name="error"]'),
    invalidManaged: new WeakSet(),
    label: shadow.querySelector(".label"),
    labelledBy: "",
    labelSlot: shadow.querySelector('slot[name="label"]'),
    description: shadow.querySelector(".description"),
    descriptionSlot: shadow.querySelector('slot[name="description"]'),
    defaultSlot: shadow.querySelector("slot:not([name])"),
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
};

/**
 * Field wrapper for one form control.
 *
 * @tag ds-field
 * @attr {boolean} invalid - Shows the error slot and marks the child control invalid.
 * @slot label - Visible field label.
 * @slot - One form control.
 * @slot description - Supporting text.
 * @slot error - Validation text shown when invalid.
 */
export class Field extends HTMLElement {
  static observedAttributes = ["invalid"];

  constructor() {
    super();
    mount(this, template);
  }

  connectedCallback() {
    connect(this);
    states.get(this).label.addEventListener("click", this.#onLabelClick);
  }

  disconnectedCallback() {
    states.get(this).label.removeEventListener("click", this.#onLabelClick);
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

  #onLabelClick = () => firstControl(this)?.focus?.();
}

/**
 * Field wrapper for related controls that produce separate form values.
 *
 * @tag ds-field-group
 * @attr {boolean} invalid - Shows the error slot and marks the group invalid.
 * @slot label - Visible group label.
 * @slot - Related form controls.
 * @slot description - Supporting text for the group.
 * @slot error - Validation text shown when invalid.
 */
export class FieldGroup extends HTMLElement {
  static observedAttributes = ["invalid"];

  constructor() {
    super();
    mount(this, groupTemplate);
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
    syncGroup(this);
  }
}

if (!customElements.get(tags.field)) customElements.define(tags.field, Field);
if (!customElements.get(tags.group))
  customElements.define(tags.group, FieldGroup);

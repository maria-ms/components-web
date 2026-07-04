const tagName = "ds-input-number";

const observedAttributes = [
  "aria-describedby",
  "aria-invalid",
  "aria-label",
  "aria-labelledby",
  "controls",
  "disabled",
  "label-position",
  "max",
  "min",
  "name",
  "placeholder",
  "readonly",
  "required",
  "size",
  "step",
  "value",
];

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --ds-input-number-inline-small-width: 193px;
      --ds-input-number-inline-width: 276px;
      --ds-input-number-small-width: 140px;
      --ds-input-number-width: 276px;

      box-sizing: border-box;
      display: inline-block;
      width: var(--ds-input-number-width);
      max-width: 100%;
      color: var(--ds-semantic-color-foreground-default);
      font-family: inherit;
      font-size: var(--ds-semantic-typography-body-small-font-size);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    :host([size="small"]) {
      width: var(--ds-input-number-small-width);
    }

    :host([label-position="start"]) {
      width: var(--ds-input-number-inline-width);
    }

    :host([label-position="start"][size="small"]) {
      width: var(--ds-input-number-inline-small-width);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .root,
    .stack,
    .field,
    .actions,
    .step-button,
    .prefix,
    .suffix {
      display: flex;
    }

    .root,
    .stack {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .root,
    .stack,
    .field,
    .actions {
      gap: var(--ds-primitive-space-03);
    }

    :host([label-position="start"]) .root {
      flex-direction: row;
      gap: var(--ds-primitive-space-05);
    }

    :host([label-position="start"]) .stack {
      flex: 1 1 auto;
      width: auto;
      min-width: 0;
    }

    .label,
    .description {
      display: block;
      width: 100%;
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

    :host([label-position="start"]) .label {
      width: auto;
      flex: 0 0 auto;
      text-align: right;
      white-space: nowrap;
    }

    .field {
      width: 100%;
      min-height: var(--ds-primitive-space-07);
      align-items: center;
      overflow: hidden;
      padding: var(--ds-primitive-space-02) var(--ds-primitive-space-02)
        var(--ds-primitive-space-02) var(--ds-primitive-space-03);
      border: 1px solid var(--ds-component-input-color-border-default);
      border-radius: var(--ds-primitive-radius-04);
      background: var(--ds-component-input-color-background-default);
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        box-shadow 120ms ease;
    }

    :host([size="small"]) .field {
      width: var(--ds-input-number-small-field-width, 140px);
      padding: var(--ds-primitive-space-02);
    }

    :host(:not([disabled]):not([aria-invalid="true"]):hover) .field {
      background: var(--ds-component-input-color-background-hover);
    }

    :host(:not([disabled]):not([aria-invalid="true"]):focus-within) .field {
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

    :host([aria-invalid="true"]) .label,
    :host([aria-invalid="true"]) .description {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    :host([aria-invalid="true"]) .field {
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

    :host([disabled]) {
      cursor: not-allowed;
    }

    :host([disabled]) .label,
    :host([disabled]) .description {
      color: var(--ds-semantic-color-foreground-disabled-elevated);
    }

    :host([disabled]) .field {
      border-color: var(--ds-component-input-color-border-disabled);
      background: var(--ds-component-input-color-background-disabled);
    }

    input {
      order: 2;
      min-width: 40px;
      flex: 1 1 auto;
      border: 0;
      outline: 0;
      padding: 0;
      appearance: textfield;
      background: transparent;
      color: var(--ds-semantic-color-foreground-muted-1);
      font: inherit;
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-small-line-height);
      font-kerning: none;
      font-variant-ligatures: none;
    }

    input::placeholder {
      color: var(--ds-semantic-color-foreground-muted-1);
      opacity: 1;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }

    :host([data-has-value]) input {
      color: var(--ds-semantic-color-foreground-default);
    }

    :host([aria-invalid="true"]) input {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    :host([disabled]) input {
      color: var(--ds-semantic-color-foreground-disabled-elevated);
      cursor: not-allowed;
    }

    :host([size="small"]) input {
      text-align: center;
    }

    .prefix,
    .suffix {
      display: none;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      color: var(--ds-semantic-color-foreground-muted-1);
      line-height: 0;
    }

    .prefix {
      order: 1;
    }

    .suffix {
      order: 3;
    }

    .prefix.has-content,
    .suffix.has-content {
      display: flex;
    }

    .prefix slot::slotted(svg),
    .suffix slot::slotted(svg) {
      display: block;
    }

    .actions {
      order: 4;
      align-items: center;
      flex: 0 0 auto;
    }

    :host([size="small"]) .actions {
      display: contents;
    }

    :host([controls="none"]) .actions {
      display: none;
    }

    .step-button {
      width: 24px;
      height: 24px;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: var(--ds-primitive-radius-03);
      padding: 0;
      background: transparent;
      color: var(--ds-component-button-color-foreground-secondary);
      cursor: pointer;
    }

    .step-button:hover:not(:disabled) {
      background: var(--ds-component-button-color-background-secondary);
    }

    :host([aria-invalid="true"]) .step-button {
      color: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([disabled]) .step-button {
      color: var(--ds-component-button-color-foreground-disabled);
      cursor: not-allowed;
    }

    .decrement {
      order: 1;
    }

    .increment {
      order: 3;
    }

    .step-button svg {
      width: var(--ds-primitive-space-05);
      height: var(--ds-primitive-space-05);
    }

    .description {
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-semantic-typography-body-x-small-font-size);
      font-weight: var(--ds-semantic-typography-body-x-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-x-small-line-height);
    }
  </style>

  <div part="root" class="root">
    <label part="label" class="label">
      <slot name="label"></slot>
    </label>
    <div part="stack" class="stack">
      <div part="field" class="field">
        <span part="prefix" class="prefix">
          <slot name="prefix"></slot>
        </span>
        <input part="input" type="number" inputmode="decimal" />
        <span part="suffix" class="suffix">
          <slot name="suffix"></slot>
        </span>
        <div part="actions" class="actions">
          <button part="decrement-button" class="step-button decrement" type="button" data-step="-1" aria-label="Decrease value">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 8H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
          <button part="increment-button" class="step-button increment" type="button" data-step="1" aria-label="Increase value">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <p part="description" class="description">
        <slot name="description"></slot>
      </p>
    </div>
  </div>
`;

const instances = new WeakMap();
const nextInputId = (() => {
  let id = 0;
  return () => `${tagName}-${id++}`;
})();

const setOptionalAttribute = (element, name, value) =>
  value == null || value === ""
    ? element.removeAttribute(name)
    : element.setAttribute(name, value);

const valueAttribute = (host) => host.getAttribute("value") ?? "";

const setValue = (host, value, { dirty = false } = {}) => {
  const state = instances.get(host);
  const nextValue = value == null ? "" : String(value);

  state.value = nextValue;
  state.valueDirty ||= dirty;
  host.toggleAttribute("data-has-value", nextValue !== "");
  if (state.input.value !== nextValue) state.input.value = nextValue;
  syncFormValue(host);
};

const hasSlotContent = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .some(
      (node) => node.nodeType === 1 || (node.textContent ?? "").trim() !== "",
    );

const createInternals = (host) => {
  try {
    return typeof host.attachInternals === "function"
      ? host.attachInternals()
      : null;
  } catch {
    return null;
  }
};

const validityFlags = (validity) =>
  [
    "badInput",
    "customError",
    "patternMismatch",
    "rangeOverflow",
    "rangeUnderflow",
    "stepMismatch",
    "tooLong",
    "tooShort",
    "typeMismatch",
    "valueMissing",
  ].reduce(
    (flags, name) => (validity[name] ? { ...flags, [name]: true } : flags),
    {},
  );

const disabled = (host) => {
  const state = instances.get(host);
  return host.disabled || Boolean(state?.formDisabled);
};

const readonly = (host) => host.hasAttribute("readonly");

const emit = (host, type) => {
  const { input } = instances.get(host);

  host.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: {
        value: host.value,
        valueAsNumber: input.valueAsNumber,
      },
    }),
  );
};

const syncNativeAttributes = (host) => {
  const { input } = instances.get(host);

  ["min", "max", "step"].forEach((name) =>
    setOptionalAttribute(input, name, host.getAttribute(name)),
  );
  input.disabled = disabled(host);
  input.readOnly = host.hasAttribute("readonly");
  input.required = host.hasAttribute("required");
  input.placeholder = host.getAttribute("placeholder") ?? "";
};

const syncAria = (host) => {
  const { description, descriptionSlot, id, input, label, labelSlot } =
    instances.get(host);
  const labelIsVisible = hasSlotContent(labelSlot);
  const descriptionIsVisible = hasSlotContent(descriptionSlot);
  const ariaLabel = host.getAttribute("aria-label");
  const ariaLabelledBy = host.getAttribute("aria-labelledby");
  const ariaDescribedBy = host.getAttribute("aria-describedby");
  const ariaInvalid = host.getAttribute("aria-invalid");

  label.id = `${id}-label`;
  label.htmlFor = id;
  label.hidden = !labelIsVisible;
  description.id = `${id}-description`;
  description.hidden = !descriptionIsVisible;

  if (ariaLabel) {
    input.setAttribute("aria-label", ariaLabel);
    input.removeAttribute("aria-labelledby");
  } else if (ariaLabelledBy) {
    input.setAttribute("aria-labelledby", ariaLabelledBy);
    input.removeAttribute("aria-label");
  } else if (labelIsVisible) {
    input.setAttribute("aria-labelledby", `${id}-label`);
    input.removeAttribute("aria-label");
  } else {
    input.removeAttribute("aria-label");
    input.removeAttribute("aria-labelledby");
  }

  if (ariaDescribedBy) {
    input.setAttribute("aria-describedby", ariaDescribedBy);
  } else if (descriptionIsVisible) {
    input.setAttribute("aria-describedby", `${id}-description`);
  } else {
    input.removeAttribute("aria-describedby");
  }

  ariaInvalid == null
    ? input.removeAttribute("aria-invalid")
    : input.setAttribute("aria-invalid", ariaInvalid);
};

const syncFormValue = (host) => {
  const { customErrorMessage, input, internals } = instances.get(host);

  if (!internals) return;

  internals.setFormValue(disabled(host) ? null : host.value);

  if (disabled(host)) {
    internals.setValidity({});
    return;
  }

  if (customErrorMessage) {
    internals.setValidity({ customError: true }, customErrorMessage, input);
    return;
  }

  input.validity.valid
    ? internals.setValidity({})
    : internals.setValidity(
        validityFlags(input.validity),
        input.validationMessage,
        input,
      );
};

const sync = (host) => {
  const {
    decrement,
    increment,
    input,
    prefix,
    prefixSlot,
    suffix,
    suffixSlot,
  } = instances.get(host);

  input.id = instances.get(host).id;
  if (input.value !== host.value) input.value = host.value;
  host.toggleAttribute("data-has-value", host.value !== "");
  syncNativeAttributes(host);
  syncAria(host);
  prefix.classList.toggle("has-content", hasSlotContent(prefixSlot));
  suffix.classList.toggle("has-content", hasSlotContent(suffixSlot));
  decrement.disabled = disabled(host) || readonly(host);
  increment.disabled = disabled(host) || readonly(host);
  syncFormValue(host);
};

const step = (host, direction) => {
  const { input } = instances.get(host);

  if (disabled(host) || readonly(host) || host.getAttribute("controls") === "none") {
    return;
  }
  direction < 0 ? input.stepDown() : input.stepUp();
  setValue(host, input.value);
  emit(host, "input");
  emit(host, "change");
};

const listeners = (state) => [
  [state.input, "input", state.onInput],
  [state.input, "change", state.onChange],
  [state.actions, "click", state.onStep],
  [state.label, "click", state.onLabelClick],
  [state.labelSlot, "slotchange", state.onContentSlotChange],
  [state.descriptionSlot, "slotchange", state.onContentSlotChange],
  [state.prefixSlot, "slotchange", state.onContentSlotChange],
  [state.suffixSlot, "slotchange", state.onContentSlotChange],
];

const setListeners = (state, method) =>
  listeners(state).forEach(([target, type, listener]) =>
    target[method](type, listener),
  );

const connect = (host) => {
  const state = instances.get(host);

  if (!state.hasConnected) {
    state.defaultValue = valueAttribute(host);
    if (!state.valueDirty) setValue(host, state.defaultValue);
    state.hasConnected = true;
  }

  setListeners(state, "addEventListener");
  sync(host);
};

const disconnect = (host) => {
  setListeners(instances.get(host), "removeEventListener");
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });
  shadow.append(template.content.cloneNode(true));

  instances.set(host, {
    actions: shadow.querySelector(".actions"),
    customErrorMessage: "",
    decrement: shadow.querySelector(".decrement"),
    defaultValue: "",
    description: shadow.querySelector(".description"),
    descriptionSlot: shadow.querySelector('slot[name="description"]'),
    formDisabled: false,
    hasConnected: false,
    id: nextInputId(),
    increment: shadow.querySelector(".increment"),
    input: shadow.querySelector("input"),
    internals: createInternals(host),
    label: shadow.querySelector(".label"),
    labelSlot: shadow.querySelector('slot[name="label"]'),
    prefix: shadow.querySelector(".prefix"),
    prefixSlot: shadow.querySelector('slot[name="prefix"]'),
    suffix: shadow.querySelector(".suffix"),
    suffixSlot: shadow.querySelector('slot[name="suffix"]'),
    value: valueAttribute(host),
    valueDirty: false,
    onChange: (event) => {
      const { input } = instances.get(host);
      event.stopPropagation();
      setValue(host, input.value, { dirty: true });
      emit(host, "change");
    },
    onContentSlotChange: () => sync(host),
    onInput: (event) => {
      const { input } = instances.get(host);
      event.stopPropagation();
      setValue(host, input.value, { dirty: true });
      emit(host, "input");
    },
    onLabelClick: () => instances.get(host).input.focus(),
    onStep: (event) => {
      const button = event.target.closest("[data-step]");
      if (button) step(host, Number(button.dataset.step));
    },
  });
};

/**
 * Form-associated number input.
 *
 * @tag ds-input-number
 * @attr {string} name - Form field name.
 * @attr {string} value - Initial value used by form reset.
 * @attr {string} min - Native minimum value.
 * @attr {string} max - Native maximum value.
 * @attr {string} step - Native step value and stepper interval.
 * @attr {string} placeholder - Placeholder text shown when the input is empty.
 * @attr {boolean} disabled - Disables the input and stepper buttons.
 * @attr {boolean} readonly - Prevents editing while keeping the value submittable.
 * @attr {boolean} required - Requires a value before form submission.
 * @attr {"small"|"medium"} size - Visual size. Defaults to medium.
 * @attr {"top"|"start"} label-position - Label placement. Defaults to top.
 * @attr {"stepper"|"none"} controls - Stepper visibility. Defaults to stepper.
 * @attr {string} aria-label - Accessible name when no visible label is provided.
 * @attr {string} aria-labelledby - Accessible name reference.
 * @attr {string} aria-describedby - Accessible description reference.
 * @attr {"true"|"false"|"grammar"|"spelling"} aria-invalid - Accessibility and visual invalid state.
 * @slot label - Visible label content.
 * @slot description - Helper or validation text.
 * @slot prefix - Optional leading icon or text.
 * @slot suffix - Optional trailing icon or text.
 * @prop {string} value - Live value. Setting it does not rewrite the value attribute.
 * @prop {string} defaultValue - Initial value reflected through the value attribute.
 * @fires input - Fired when the value changes.
 * @fires change - Fired when the value is committed.
 */
export class InputNumber extends HTMLElement {
  static formAssociated = true;

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

  attributeChangedCallback(name) {
    if (!instances.has(this)) return;
    if (name === "value") {
      instances.get(this).defaultValue = valueAttribute(this);
      setValue(this, valueAttribute(this));
      return;
    }
    sync(this);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value) {
    setOptionalAttribute(this, "name", value);
  }

  get readOnly() {
    return this.hasAttribute("readonly");
  }

  set readOnly(value) {
    this.toggleAttribute("readonly", Boolean(value));
  }

  get required() {
    return this.hasAttribute("required");
  }

  set required(value) {
    this.toggleAttribute("required", Boolean(value));
  }

  get value() {
    return instances.get(this)?.value ?? valueAttribute(this);
  }

  set value(value) {
    if (instances.has(this)) setValue(this, value, { dirty: true });
  }

  get defaultValue() {
    return valueAttribute(this);
  }

  set defaultValue(value) {
    setOptionalAttribute(this, "value", value);
  }

  get valueAsNumber() {
    return instances.get(this)?.input.valueAsNumber ?? Number.NaN;
  }

  set valueAsNumber(value) {
    this.value = Number.isNaN(value) ? "" : String(value);
  }

  get form() {
    return instances.get(this)?.internals?.form ?? null;
  }

  get validity() {
    const state = instances.get(this);
    return state?.internals?.validity ?? state?.input.validity;
  }

  get validationMessage() {
    const state = instances.get(this);
    return (
      state?.internals?.validationMessage ?? state?.input.validationMessage
    );
  }

  get willValidate() {
    const state = instances.get(this);
    return state?.internals?.willValidate ?? state?.input.willValidate ?? false;
  }

  checkValidity() {
    const state = instances.get(this);
    return state?.internals?.checkValidity() ?? state?.input.checkValidity();
  }

  reportValidity() {
    const state = instances.get(this);
    return state?.internals?.reportValidity() ?? state?.input.reportValidity();
  }

  setCustomValidity(message) {
    const state = instances.get(this);

    if (!state) return;
    state.customErrorMessage = String(message);
    state.input.setCustomValidity(message);
    syncFormValue(this);
  }

  focus(options) {
    instances.get(this)?.input.focus(options);
  }

  blur() {
    instances.get(this)?.input.blur();
  }

  formDisabledCallback(isDisabledByForm) {
    const state = instances.get(this);

    if (!state) return;
    state.formDisabled = isDisabledByForm;
    sync(this);
  }

  formResetCallback() {
    const state = instances.get(this);

    state.valueDirty = false;
    setValue(this, state.defaultValue);
  }

  formStateRestoreCallback(value) {
    setValue(this, value, { dirty: true });
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, InputNumber);

import {
  createInternals,
  disabled as fieldDisabled,
  fieldObservedAttributes,
  fieldTemplate,
  nextId,
  setOptionalAttribute,
  syncFieldChrome,
  validityFlags,
} from "../input/field-shell.mjs";

const tagName = "ds-input-number";

const observedAttributes = [
  ...fieldObservedAttributes,
  "controls",
  "max",
  "min",
  "name",
  "placeholder",
  "readonly",
  "required",
  "step",
  "value",
];

const stepper = `
  <div part="actions" class="actions">
    <button
      part="decrement-button"
      class="step-button decrement"
      type="button"
      data-step="-1"
      aria-label="Decrease value"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3.5 8H12.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
    <button
      part="increment-button"
      class="step-button increment"
      type="button"
      data-step="1"
      aria-label="Increase value"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 3.5V12.5M3.5 8H12.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
`;

const template = document.createElement("template");

template.innerHTML = fieldTemplate(
  `<input part="input" class="control" type="number" inputmode="decimal" />`,
  {
    afterSuffix: stepper,
    extraStyles: `
      .field {
        padding: var(--ds-primitive-space-02) var(--ds-primitive-space-02)
          var(--ds-primitive-space-02) var(--ds-primitive-space-03);
      }

      :host([size="small"]) .field,
      :host([size="sm"]) .field {
        padding: var(--ds-primitive-space-02);
      }

      .control {
        order: 2;
        appearance: textfield;
      }

      .control::-webkit-outer-spin-button,
      .control::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
      }

      :host([size="small"]) .control,
      :host([size="sm"]) .control {
        text-align: center;
      }

      .prefix {
        order: 1;
      }

      .suffix {
        order: 3;
      }

      .actions,
      .step-button {
        display: flex;
      }

      .actions {
        order: 4;
        align-items: center;
        flex: 0 0 auto;
        gap: var(--ds-primitive-space-03);
      }

      :host([size="small"]) .actions,
      :host([size="sm"]) .actions {
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
    `,
  },
);

const instances = new WeakMap();
const nextInputId = nextId(tagName);

const valueAttribute = (host) => host.getAttribute("value") ?? "";

const stateOf = (host) => instances.get(host);

const isDisabled = (host) => fieldDisabled(host, stateOf(host));

const isReadonly = (host) => host.hasAttribute("readonly");

const emit = (host, type) => {
  const { input } = stateOf(host);

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

const syncFormValue = (host) => {
  const { customErrorMessage, input, internals } = stateOf(host);

  if (!internals) return;

  internals.setFormValue(isDisabled(host) ? null : host.value);

  if (isDisabled(host)) {
    internals.setValidity({});
  } else if (customErrorMessage) {
    internals.setValidity({ customError: true }, customErrorMessage, input);
  } else if (input.validity.valid) {
    internals.setValidity({});
  } else {
    internals.setValidity(
      validityFlags(input.validity),
      input.validationMessage,
      input,
    );
  }
};

const setValue = (host, value, { dirty = false } = {}) => {
  const state = stateOf(host);
  const nextValue = value == null ? "" : String(value);

  state.value = nextValue;
  state.valueDirty ||= dirty;
  host.toggleAttribute("data-has-value", nextValue !== "");
  if (state.input.value !== nextValue) state.input.value = nextValue;
  syncFormValue(host);
};

const syncNativeAttributes = (host) => {
  const { input } = stateOf(host);

  ["max", "min", "placeholder", "step"].forEach((name) =>
    setOptionalAttribute(input, name, host.getAttribute(name)),
  );
  input.disabled = isDisabled(host);
  input.readOnly = isReadonly(host);
  input.required = host.hasAttribute("required");
};

const sync = (host) => {
  const state = stateOf(host);

  if (state.input.value !== host.value) state.input.value = host.value;
  host.toggleAttribute("data-has-value", host.value !== "");
  syncNativeAttributes(host);
  syncFieldChrome(host, state);
  state.decrement.disabled = isDisabled(host) || isReadonly(host);
  state.increment.disabled = isDisabled(host) || isReadonly(host);
  syncFormValue(host);
};

const step = (host, direction) => {
  const { input } = stateOf(host);

  if (isDisabled(host) || isReadonly(host) || host.getAttribute("controls") === "none") {
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
  [state.prefixSlot, "slotchange", state.onContentSlotChange],
  [state.suffixSlot, "slotchange", state.onContentSlotChange],
];

const setListeners = (state, method) =>
  listeners(state).forEach(([target, type, listener]) =>
    target[method](type, listener),
  );

const connect = (host) => {
  const state = stateOf(host);

  if (!state.hasConnected) {
    state.defaultValue = valueAttribute(host);
    if (!state.valueDirty) setValue(host, state.defaultValue);
    state.hasConnected = true;
  }

  setListeners(state, "addEventListener");
  sync(host);
};

const disconnect = (host) => {
  setListeners(stateOf(host), "removeEventListener");
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));

  const input = shadow.querySelector("input");

  instances.set(host, {
    actions: shadow.querySelector(".actions"),
    control: input,
    customErrorMessage: "",
    decrement: shadow.querySelector(".decrement"),
    defaultValue: "",
    formDisabled: false,
    hasConnected: false,
    id: nextInputId(),
    increment: shadow.querySelector(".increment"),
    input,
    internals: createInternals(host),
    prefix: shadow.querySelector(".prefix"),
    prefixHasFallback: false,
    prefixSlot: shadow.querySelector('slot[name="prefix"]'),
    suffix: shadow.querySelector(".suffix"),
    suffixHasFallback: false,
    suffixSlot: shadow.querySelector('slot[name="suffix"]'),
    value: valueAttribute(host),
    valueDirty: false,
    onChange: (event) => {
      event.stopPropagation();
      setValue(host, input.value, { dirty: true });
      emit(host, "change");
    },
    onContentSlotChange: () => sync(host),
    onInput: (event) => {
      event.stopPropagation();
      setValue(host, input.value, { dirty: true });
      emit(host, "input");
    },
    onStep: (event) => {
      const button =
        event.target instanceof Element
          ? event.target.closest("[data-step]")
          : null;

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
 * @attr {"stepper"|"none"} controls - Stepper visibility. Defaults to stepper.
 * @attr {string} aria-label - Accessible name when no visible label is provided.
 * @attr {string} aria-labelledby - Accessible name reference.
 * @attr {string} aria-describedby - Accessible description reference.
 * @attr {"true"|"false"|"grammar"|"spelling"} aria-invalid - Accessibility and visual invalid state.
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
      stateOf(this).defaultValue = valueAttribute(this);
      setValue(this, valueAttribute(this));
    } else {
      sync(this);
    }
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
    return stateOf(this)?.value ?? valueAttribute(this);
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
    return stateOf(this)?.input.valueAsNumber ?? Number.NaN;
  }

  set valueAsNumber(value) {
    this.value = Number.isNaN(value) ? "" : String(value);
  }

  get form() {
    return stateOf(this)?.internals?.form ?? null;
  }

  get validity() {
    const state = stateOf(this);
    return state?.internals?.validity ?? state?.input.validity;
  }

  get validationMessage() {
    const state = stateOf(this);
    return state?.internals?.validationMessage ?? state?.input.validationMessage;
  }

  get willValidate() {
    const state = stateOf(this);
    return state?.internals?.willValidate ?? state?.input.willValidate ?? false;
  }

  checkValidity() {
    const state = stateOf(this);
    return state?.internals?.checkValidity() ?? state?.input.checkValidity();
  }

  reportValidity() {
    const state = stateOf(this);
    return state?.internals?.reportValidity() ?? state?.input.reportValidity();
  }

  setCustomValidity(message) {
    const state = stateOf(this);

    if (!state) return;
    state.customErrorMessage = String(message);
    state.input.setCustomValidity(message);
    syncFormValue(this);
  }

  focus(options) {
    stateOf(this)?.input.focus(options);
  }

  blur() {
    stateOf(this)?.input.blur();
  }

  formDisabledCallback(isDisabledByForm) {
    const state = stateOf(this);

    if (!state) return;
    state.formDisabled = isDisabledByForm;
    sync(this);
  }

  formResetCallback() {
    const state = stateOf(this);

    state.valueDirty = false;
    setValue(this, state.defaultValue);
  }

  formStateRestoreCallback(value) {
    setValue(this, value, { dirty: true });
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, InputNumber);

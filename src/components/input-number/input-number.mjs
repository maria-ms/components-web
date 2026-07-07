import {
  createInternals,
  disabled,
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
  "autocomplete",
  "form",
  "inputmode",
  "max",
  "min",
  "name",
  "placeholder",
  "readonly",
  "required",
  "step",
  "value",
];

const template = document.createElement("template");

template.innerHTML = fieldTemplate(
  `<input part="input" class="control" type="number" inputmode="decimal" />`,
  {
    afterSuffix: `
      <div part="stepper" class="stepper">
        <button part="decrement-button" class="step-button" type="button" data-step="-1" aria-label="Decrease value">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 8H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <button part="increment-button" class="step-button" type="button" data-step="1" aria-label="Increase value">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    `,
    extraStyles: `
      .control {
        appearance: textfield;
      }

      .control::-webkit-inner-spin-button,
      .control::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
      }

      .stepper {
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        gap: var(--ds-primitive-space-02);
      }

      .step-button {
        display: inline-flex;
        width: var(--ds-component-input-number-control-size);
        height: var(--ds-component-input-number-control-size);
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

      .step-button:focus-visible {
        outline: 2px solid var(--ds-semantic-color-border-focus);
        outline-offset: 2px;
      }

      :host([aria-invalid="true"]) .step-button {
        color: var(--ds-component-button-color-foreground-destructive-primary);
      }

      :host([disabled]) .step-button,
      :host([readonly]) .step-button {
        color: var(--ds-component-button-color-foreground-disabled);
        cursor: not-allowed;
      }

      .step-button svg {
        width: var(--ds-component-input-number-control-icon-size);
        height: var(--ds-component-input-number-control-icon-size);
      }
    `,
  },
);

const states = new WeakMap();
const nextInputId = nextId(tagName);

const valueAttribute = (host) => host.getAttribute("value") ?? "";

const stateOf = (host) => states.get(host);

const isDisabled = (host) => disabled(host, stateOf(host));

const isReadonly = (host) => host.hasAttribute("readonly");

const emit = (host, type) => {
  const { input } = stateOf(host);

  host.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: { value: host.value, valueAsNumber: input.valueAsNumber },
    }),
  );
};

const syncFormValue = (host) => {
  const state = stateOf(host);

  if (!state.internals) return;

  state.internals.setFormValue(isDisabled(host) ? null : host.value);

  if (isDisabled(host)) {
    state.internals.setValidity({});
  } else if (state.customErrorMessage) {
    state.internals.setValidity(
      { customError: true },
      state.customErrorMessage,
      state.input,
    );
  } else if (state.input.validity.valid) {
    state.internals.setValidity({});
  } else {
    state.internals.setValidity(
      validityFlags(state.input.validity),
      state.input.validationMessage,
      state.input,
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

  ["autocomplete", "inputmode", "max", "min", "placeholder", "step"].forEach(
    (name) => setOptionalAttribute(input, name, host.getAttribute(name)),
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
  state.stepButtons.forEach((button) => {
    button.disabled = isDisabled(host) || isReadonly(host);
  });
  syncFormValue(host);
};

const step = (host, direction) => {
  const { input } = stateOf(host);

  if (isDisabled(host) || isReadonly(host)) return;

  direction < 0 ? input.stepDown() : input.stepUp();
  setValue(host, input.value, { dirty: true });
  emit(host, "input");
  emit(host, "change");
};

const listeners = (state) => [
  [state.input, "input", state.onInput],
  [state.input, "change", state.onChange],
  [state.stepper, "click", state.onStep],
  [state.prefixSlot, "slotchange", state.onSlotChange],
  [state.suffixSlot, "slotchange", state.onSlotChange],
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

const disconnect = (host) => setListeners(stateOf(host), "removeEventListener");

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));

  const input = shadow.querySelector("input");

  states.set(host, {
    control: input,
    customErrorMessage: "",
    defaultValue: "",
    formDisabled: false,
    hasConnected: false,
    id: nextInputId(),
    input,
    internals: createInternals(host),
    prefix: shadow.querySelector(".prefix"),
    prefixHasFallback: false,
    prefixSlot: shadow.querySelector('slot[name="prefix"]'),
    stepButtons: [...shadow.querySelectorAll(".step-button")],
    stepper: shadow.querySelector(".stepper"),
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
    onInput: (event) => {
      event.stopPropagation();
      setValue(host, input.value, { dirty: true });
      emit(host, "input");
    },
    onSlotChange: () => sync(host),
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
 * Form-associated number input that mirrors native number-input semantics.
 *
 * @tag ds-input-number
 * @attr {string} name - Form field name.
 * @attr {string} value - Initial value used by form reset.
 * @attr {string} min - Native minimum value.
 * @attr {string} max - Native maximum value.
 * @attr {string} step - Native step value.
 * @attr {string} placeholder - Placeholder text.
 * @attr {boolean} disabled - Disables the control.
 * @attr {boolean} readonly - Prevents editing while preserving form value.
 * @attr {boolean} required - Requires a value.
 * @attr {"true"|"false"|"grammar"|"spelling"} aria-invalid - Accessibility and visual invalid state.
 * @slot prefix - Optional leading content.
 * @slot suffix - Optional trailing content before the stepper.
 * @prop {string} value - Live value.
 * @prop {string} defaultValue - Reset value reflected through the value attribute.
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
    if (!states.has(this)) return;
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
    if (states.has(this)) setValue(this, value, { dirty: true });
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

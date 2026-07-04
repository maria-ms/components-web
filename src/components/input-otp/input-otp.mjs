import {
  createInternals,
  disabled,
  nextId,
  setOptionalAttribute,
} from "../input/field-shell.mjs";

const tagName = "input-otp";

const observedAttributes = [
  "aria-describedby",
  "aria-invalid",
  "aria-label",
  "aria-labelledby",
  "autocomplete",
  "disabled",
  "form",
  "inputmode",
  "label-position",
  "length",
  "name",
  "readonly",
  "required",
  "value",
];

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --input-otp-cell-size: 48px;
      --input-otp-gap: var(--ds-primitive-space-05);

      box-sizing: border-box;
      display: inline-block;
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
    .stack,
    .fields {
      display: flex;
    }

    .root,
    .stack {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--ds-primitive-space-03);
      width: 100%;
    }

    :host([label-position="start"]) .root {
      flex-direction: row;
      gap: var(--ds-primitive-space-05);
    }

    .fields {
      gap: var(--input-otp-gap);
      max-width: 100%;
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

    .description {
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-semantic-typography-body-x-small-font-size);
      font-weight: var(--ds-semantic-typography-body-x-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-x-small-line-height);
    }

    .cell {
      width: var(--input-otp-cell-size);
      height: var(--input-otp-cell-size);
      border: 1px solid var(--ds-component-input-color-border-default);
      border-radius: var(--ds-primitive-radius-04);
      padding: 0;
      appearance: textfield;
      background: var(--ds-component-input-color-background-default);
      color: var(--ds-semantic-color-foreground-default);
      font: inherit;
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-small-line-height);
      text-align: center;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        box-shadow 120ms ease;
    }

    .cell:hover:not(:disabled):not(:focus) {
      background: var(--ds-component-input-color-background-hover);
    }

    .cell:focus {
      border-color: var(--ds-semantic-color-border-focus);
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

    :host([aria-invalid="true"]) .label,
    :host([aria-invalid="true"]) .description {
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    :host([aria-invalid="true"]) .cell {
      border-color: var(--ds-semantic-color-border-destructive-elevated);
      background: var(--ds-semantic-color-background-destructive-subtle);
      color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    :host([disabled]) .label,
    :host([disabled]) .description,
    :host([disabled]) .cell {
      color: var(--ds-semantic-color-foreground-disabled-elevated);
    }

    :host([disabled]) .cell {
      border-color: var(--ds-component-input-color-border-disabled);
      background: var(--ds-component-input-color-background-disabled);
      cursor: not-allowed;
    }
  </style>

  <div part="root" class="root">
    <label part="label" class="label">
      <slot name="label"></slot>
    </label>
    <div part="stack" class="stack">
      <div part="fields" class="fields"></div>
      <p part="description" class="description">
        <slot name="description"></slot>
      </p>
    </div>
  </div>
`;

const instances = new WeakMap();
const nextOtpId = nextId(tagName);
const valueAttribute = (host) => host.getAttribute("value") ?? "";
const fieldCount = (host) => {
  const count = Number.parseInt(host.getAttribute("length") || "6", 10);

  return Number.isFinite(count) ? Math.min(12, Math.max(1, count)) : 6;
};

const hasSlotContent = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .some(
      (node) => node.nodeType === 1 || (node.textContent ?? "").trim() !== "",
    );

const slotText = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const emit = (host, type) => {
  host.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: { value: host.value },
    }),
  );
};

const inputsValue = (state) => state.inputs.map((input) => input.value).join("");

const setValue = (host, value, { dirty = false } = {}) => {
  const state = instances.get(host);
  const nextValue = String(value ?? "").slice(0, fieldCount(host));

  state.value = nextValue;
  state.valueDirty ||= dirty;
  state.inputs.forEach((input, index) => {
    input.value = nextValue[index] ?? "";
  });
  host.toggleAttribute("data-has-value", nextValue !== "");
  syncFormValue(host);
};

const syncFormValue = (host) => {
  const state = instances.get(host);
  const isIncomplete = host.required && host.value.length < fieldCount(host);

  if (!state.internals) return;

  state.internals.setFormValue(disabled(host, state) ? null : host.value);

  if (disabled(host, state)) {
    state.internals.setValidity({});
  } else if (state.customErrorMessage) {
    state.internals.setValidity(
      { customError: true },
      state.customErrorMessage,
      state.inputs[0],
    );
  } else if (isIncomplete) {
    state.internals.setValidity(
      { valueMissing: true },
      "Please fill out this field.",
      state.inputs[0],
    );
  } else {
    state.internals.setValidity({});
  }
};

const syncNativeAttributes = (host) => {
  const state = instances.get(host);

  state.inputs.forEach((input, index) => {
    input.autocomplete =
      index === 0 ? (host.getAttribute("autocomplete") ?? "one-time-code") : "off";
    input.disabled = disabled(host, state);
    input.inputMode = host.getAttribute("inputmode") ?? "numeric";
    input.readOnly = host.hasAttribute("readonly");
  });
};

const syncAria = (host) => {
  const state = instances.get(host);
  const labelIsVisible = hasSlotContent(state.labelSlot);
  const descriptionIsVisible = hasSlotContent(state.descriptionSlot);
  const ariaLabel = host.getAttribute("aria-label");
  const ariaLabelledBy = host.getAttribute("aria-labelledby");
  const ariaDescribedBy = host.getAttribute("aria-describedby");
  const ariaInvalid = host.getAttribute("aria-invalid");
  const visibleLabel = slotText(state.labelSlot);

  state.label.id = `${state.id}-label`;
  state.label.hidden = !labelIsVisible;
  state.description.id = `${state.id}-description`;
  state.description.hidden = !descriptionIsVisible;

  state.inputs.forEach((input, index) => {
    input.id = `${state.id}-${index}`;

    if (ariaLabelledBy) {
      input.setAttribute("aria-labelledby", ariaLabelledBy);
      input.removeAttribute("aria-label");
    } else if (ariaLabel) {
      input.setAttribute("aria-label", `${ariaLabel}, digit ${index + 1}`);
      input.removeAttribute("aria-labelledby");
    } else if (labelIsVisible) {
      input.setAttribute("aria-label", `${visibleLabel}, digit ${index + 1}`);
      input.removeAttribute("aria-labelledby");
    } else {
      input.setAttribute("aria-label", `Digit ${index + 1} of ${state.inputs.length}`);
      input.removeAttribute("aria-labelledby");
    }

    if (ariaDescribedBy) {
      input.setAttribute("aria-describedby", ariaDescribedBy);
    } else if (descriptionIsVisible) {
      input.setAttribute("aria-describedby", state.description.id);
    } else {
      input.removeAttribute("aria-describedby");
    }

    ariaInvalid == null
      ? input.removeAttribute("aria-invalid")
      : input.setAttribute("aria-invalid", ariaInvalid);
  });
};

const renderFields = (host) => {
  const state = instances.get(host);
  const count = fieldCount(host);

  state.fields.replaceChildren(
    ...Array.from({ length: count }, (_, index) => {
      const input = document.createElement("input");

      input.className = "cell";
      input.maxLength = 1;
      input.setAttribute("part", "field");
      input.type = "text";
      input.dataset.index = String(index);

      return input;
    }),
  );
  state.inputs = [...state.fields.querySelectorAll("input")];
};

const sync = (host) => {
  const state = instances.get(host);

  if (state.inputs.length !== fieldCount(host)) renderFields(host);
  setValue(host, state.value);
  syncNativeAttributes(host);
  syncAria(host);
  syncFormValue(host);
};

const commitInputValue = (host, input, value) => {
  const state = instances.get(host);
  const index = Number(input.dataset.index);
  const characters = value.split("");

  characters.forEach((character, offset) => {
    const target = state.inputs[index + offset];
    if (target) target.value = character;
  });

  setValue(host, inputsValue(state), { dirty: true });
  state.inputs[Math.min(index + characters.length, state.inputs.length - 1)]?.focus();
  emit(host, "input");
};

const listeners = (state) => [
  [state.fields, "input", state.onInput],
  [state.fields, "keydown", state.onKeyDown],
  [state.fields, "paste", state.onPaste],
  [state.fields, "change", state.onChange],
  [state.label, "click", state.onLabelClick],
  [state.labelSlot, "slotchange", state.onContentSlotChange],
  [state.descriptionSlot, "slotchange", state.onContentSlotChange],
];

const setListeners = (state, method) =>
  listeners(state).forEach(([target, type, listener]) =>
    target[method](type, listener),
  );

const connect = (host) => {
  const state = instances.get(host);

  if (!state.hasConnected) {
    state.defaultValue = valueAttribute(host);
    state.value = state.defaultValue;
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
    customErrorMessage: "",
    defaultValue: "",
    description: shadow.querySelector(".description"),
    descriptionSlot: shadow.querySelector('slot[name="description"]'),
    fields: shadow.querySelector(".fields"),
    formDisabled: false,
    hasConnected: false,
    id: nextOtpId(),
    inputs: [],
    internals: createInternals(host),
    label: shadow.querySelector(".label"),
    labelSlot: shadow.querySelector('slot[name="label"]'),
    value: valueAttribute(host),
    valueDirty: false,
    onChange: (event) => {
      event.stopPropagation();
      emit(host, "change");
    },
    onContentSlotChange: () => sync(host),
    onInput: (event) => {
      event.stopPropagation();
      commitInputValue(host, event.target, event.target.value);
    },
    onKeyDown: (event) => {
      const input = event.target;
      const index = Number(input.dataset.index);

      if (event.key === "Backspace" && input.value === "") {
        instances.get(host).inputs[index - 1]?.focus();
      }
    },
    onLabelClick: () => instances.get(host).inputs[0]?.focus(),
    onPaste: (event) => {
      event.preventDefault();
      commitInputValue(host, event.target, event.clipboardData.getData("text"));
    },
  });
};

/**
 * Form-associated one-time passcode input.
 *
 * @tag input-otp
 * @attr {string} name - Form field name.
 * @attr {string} value - Initial value used by form reset.
 * @attr {number} length - Number of visible code fields. Defaults to 6.
 * @attr {boolean} disabled - Disables the fields.
 * @attr {boolean} readonly - Prevents editing while keeping the value submittable.
 * @attr {boolean} required - Requires all fields before form submission.
 * @attr {string} autocomplete - Native autocomplete hint. Defaults to one-time-code.
 * @attr {string} inputmode - Native virtual keyboard hint. Defaults to numeric.
 * @slot label - Optional visible label content.
 * @slot description - Helper or validation text.
 * @fires input - Fired when the value changes.
 * @fires change - Fired when the value is committed.
 */
export class InputOtp extends HTMLElement {
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

  get form() {
    return instances.get(this)?.internals?.form ?? null;
  }

  get validity() {
    const state = instances.get(this);

    return state?.internals?.validity ?? state?.inputs[0]?.validity ?? null;
  }

  get validationMessage() {
    return instances.get(this)?.internals?.validationMessage ?? "";
  }

  get willValidate() {
    return instances.get(this)?.internals?.willValidate ?? false;
  }

  checkValidity() {
    return instances.get(this)?.internals?.checkValidity() ?? true;
  }

  reportValidity() {
    return instances.get(this)?.internals?.reportValidity() ?? true;
  }

  setCustomValidity(message) {
    const state = instances.get(this);

    if (!state) return;
    state.customErrorMessage = String(message);
    syncFormValue(this);
  }

  focus(options) {
    instances.get(this)?.inputs[0]?.focus(options);
  }

  blur() {
    instances.get(this)?.inputs.forEach((input) => input.blur());
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

if (!customElements.get(tagName)) customElements.define(tagName, InputOtp);

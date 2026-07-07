import {
  createInternals,
  disabled,
  fieldObservedAttributes,
  fieldTemplate,
  hasSlotContent,
  nextId,
  setOptionalAttribute,
  syncFieldChrome,
  validityFlags,
} from "../input/field-shell.mjs";

const tagName = "ds-input-select";

const observedAttributes = [
  ...fieldObservedAttributes,
  "form",
  "name",
  "required",
  "value",
];

const template = document.createElement("template");

template.innerHTML = fieldTemplate(
  `<select part="select" class="control">
    <button type="button">
      <selectedcontent></selectedcontent>
      <svg class="picker-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 9L12 4L17 9M7 15L12 20L17 15"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </select>`,
  {
    extraStyles: `
      @supports (appearance: base-select) {
        .control,
        .control::picker(select) {
          appearance: base-select;
        }
      }

      .field {
        position: relative;
      }

      .control {
        display: flex;
        width: 100%;
        align-items: center;
        cursor: pointer;
      }

      .control button {
        display: flex;
        width: 100%;
        min-width: 0;
        align-items: center;
        gap: var(--ds-primitive-space-03);
        border: 0;
        padding: 0;
        background: transparent;
        color: inherit;
        font: inherit;
      }

      .control selectedcontent {
        display: flex;
        min-width: 0;
        flex: 1 1 auto;
        align-items: center;
        gap: var(--ds-primitive-space-03);
      }

      .control selectedcontent [aria-hidden="true"] {
        display: none;
      }

      .control option svg {
        width: var(--ds-input-icon-size);
        height: var(--ds-input-icon-size);
        flex: 0 0 auto;
      }

      .control::picker-icon {
        display: none;
      }

      .picker-icon {
        width: var(--ds-input-icon-size);
        height: var(--ds-input-icon-size);
        flex: 0 0 auto;
        color: var(--ds-semantic-color-foreground-muted-1);
      }

      :host([data-has-prefix]) .prefix {
        position: absolute;
        z-index: 1;
        inset-inline-start: var(--ds-primitive-space-03);
        top: 50%;
        pointer-events: none;
        transform: translateY(-50%);
      }

      :host([data-has-prefix]) .control button {
        padding-inline-start: calc(
          var(--ds-input-icon-size) + var(--ds-primitive-space-03)
        );
      }

      :host([data-has-suffix]) .picker-icon {
        display: none;
      }

      .control::picker(select) {
        top: calc(anchor(bottom) + var(--ds-primitive-space-01));
        bottom: unset;
        left: anchor(left);
        right: unset;
        width: anchor-size(width);
        min-width: anchor-size(width);
        max-width: anchor-size(width);
        inline-size: anchor-size(width);
        min-inline-size: anchor-size(width);
        max-inline-size: anchor-size(width);
        margin-block-start: 0;
        padding: var(--ds-primitive-space-02);
        position-try: normal none;
        border: 1px solid var(--ds-component-input-color-border-default);
        border-radius: var(--ds-primitive-radius-04);
        background: var(--ds-component-input-color-background-default);
        box-shadow:
          var(--ds-semantic-shadow-md-1-offset-x)
            var(--ds-semantic-shadow-md-1-offset-y)
            var(--ds-semantic-shadow-md-1-blur)
            var(--ds-semantic-shadow-md-1-spread)
            var(--ds-semantic-shadow-md-1-color),
          var(--ds-semantic-shadow-md-2-offset-x)
            var(--ds-semantic-shadow-md-2-offset-y)
            var(--ds-semantic-shadow-md-2-blur)
            var(--ds-semantic-shadow-md-2-spread)
            var(--ds-semantic-shadow-md-2-color);
        color: var(--ds-semantic-color-foreground-default);
      }

      .control option,
      .control optgroup {
        font: inherit;
      }

      .control option {
        display: flex;
        min-height: var(--ds-primitive-space-07);
        align-items: center;
        gap: var(--ds-primitive-space-03);
        padding: var(--ds-primitive-space-02) var(--ds-primitive-space-03);
        border-radius: calc(var(--ds-primitive-radius-04) - 2px);
        background: var(--ds-component-input-color-background-default);
        color: var(--ds-semantic-color-foreground-default);
      }

      .control option + option,
      .control optgroup + optgroup {
        margin-block-start: var(--ds-primitive-space-01);
      }

      .control option:hover,
      .control option:focus {
        background: var(--ds-component-input-color-background-hover);
      }

      .control option:checked {
        background: var(--ds-semantic-color-background-primary-subtle);
        color: var(--ds-semantic-color-foreground-primary-root);
        font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      }

      .control option:disabled {
        background: var(--ds-component-input-color-background-disabled);
        color: var(--ds-semantic-color-foreground-disabled-elevated);
      }

      .control option::checkmark {
        width: var(--ds-input-icon-size);
        height: var(--ds-input-icon-size);
        flex: 0 0 var(--ds-input-icon-size);
        order: 1;
        margin-inline-start: auto;
        background: currentColor;
        content: "";
        -webkit-mask:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13.333 4L6 11.333L2.667 8' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
          center / var(--ds-input-icon-size) var(--ds-input-icon-size)
          no-repeat;
        mask:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13.333 4L6 11.333L2.667 8' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
          center / var(--ds-input-icon-size) var(--ds-input-icon-size)
          no-repeat;
      }

      .control optgroup {
        margin-block: var(--ds-primitive-space-01);
        padding: var(--ds-primitive-space-01);
        border-radius: var(--ds-primitive-radius-04);
        background: var(--ds-semantic-color-surface-default);
      }

      .control optgroup legend {
        padding: var(--ds-primitive-space-01) var(--ds-primitive-space-02);
        color: var(--ds-semantic-color-foreground-muted-2);
        font-size: var(--ds-semantic-typography-body-x-small-font-size);
        font-weight: var(--ds-semantic-typography-body-x-small-font-weight-medium);
        line-height: var(--ds-semantic-typography-body-x-small-line-height);
      }

      :host([aria-invalid="true"]) .control::picker(select) {
        border-color: var(--ds-semantic-color-border-destructive-elevated);
      }

      :host([disabled]) .picker-icon {
        color: var(--ds-semantic-color-foreground-disabled-elevated);
      }

      :host([disabled]) .control {
        cursor: not-allowed;
      }
    `,
  },
);

const states = new WeakMap();
const nextSelectId = nextId(tagName);

const valueAttribute = (host) => host.getAttribute("value") ?? "";

const stateOf = (host) => states.get(host);

const optionChildren = (host) =>
  [...host.children].filter((node) =>
    ["OPTGROUP", "OPTION"].includes(node.tagName),
  );

const ensureSelectButton = (select) => {
  const button =
    select.querySelector(":scope > button") ?? document.createElement("button");

  button.type = "button";
  if (!button.querySelector("selectedcontent")) {
    button.replaceChildren(document.createElement("selectedcontent"));
  }

  return button;
};

const emit = (host, type) => {
  host.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: { value: host.value },
    }),
  );
};

const syncFormValue = (host) => {
  const state = stateOf(host);

  if (!state.internals) return;

  state.internals.setFormValue(disabled(host, state) ? null : host.value);

  if (disabled(host, state)) {
    state.internals.setValidity({});
  } else if (state.customErrorMessage) {
    state.internals.setValidity(
      { customError: true },
      state.customErrorMessage,
      state.select,
    );
  } else if (state.select.validity.valid) {
    state.internals.setValidity({});
  } else {
    state.internals.setValidity(
      validityFlags(state.select.validity),
      state.select.validationMessage,
      state.select,
    );
  }
};

const setValue = (host, value, { dirty = false } = {}) => {
  const state = stateOf(host);
  const nextValue = value == null ? "" : String(value);

  state.value = nextValue;
  state.valueDirty ||= dirty;
  state.select.value = nextValue;
  host.toggleAttribute("data-has-value", nextValue !== "");
  syncFormValue(host);
};

const syncOptions = (host) => {
  const state = stateOf(host);

  state.select.replaceChildren(
    ensureSelectButton(state.select),
    ...optionChildren(host).map((option) => option.cloneNode(true)),
  );

  if (state.valueDirty || host.hasAttribute("value")) {
    state.select.value = state.value;
  } else {
    state.value = state.select.value;
  }
};

const syncNativeAttributes = (host) => {
  const state = stateOf(host);

  state.select.disabled = disabled(host, state);
  state.select.required = host.hasAttribute("required");
};

const sync = (host) => {
  const state = stateOf(host);

  syncOptions(host);
  syncNativeAttributes(host);
  syncFieldChrome(host, state);
  host.toggleAttribute("data-has-prefix", hasSlotContent(state.prefixSlot));
  host.toggleAttribute("data-has-suffix", hasSlotContent(state.suffixSlot));
  host.toggleAttribute("data-has-value", host.value !== "");
  syncFormValue(host);
};

const listeners = (state) => [
  [state.select, "change", state.onChange],
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
    state.hasConnected = true;
  }

  state.observer.observe(host, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  setListeners(state, "addEventListener");
  sync(host);

  if (!state.defaultValueReady) {
    if (!host.hasAttribute("value")) state.defaultValue = state.value;
    state.defaultValueReady = true;
  }
};

const disconnect = (host) => {
  const state = stateOf(host);

  state.observer.disconnect();
  setListeners(state, "removeEventListener");
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));

  const select = shadow.querySelector("select");

  states.set(host, {
    control: select,
    customErrorMessage: "",
    defaultValue: "",
    defaultValueReady: false,
    formDisabled: false,
    hasConnected: false,
    id: nextSelectId(),
    internals: createInternals(host),
    observer: new MutationObserver(() => sync(host)),
    prefix: shadow.querySelector(".prefix"),
    prefixHasFallback: false,
    prefixSlot: shadow.querySelector('slot[name="prefix"]'),
    select,
    suffix: shadow.querySelector(".suffix"),
    suffixHasFallback: false,
    suffixSlot: shadow.querySelector('slot[name="suffix"]'),
    value: valueAttribute(host),
    valueDirty: false,
    onChange: (event) => {
      event.stopPropagation();
      setValue(host, event.target.value, { dirty: true });
      emit(host, "input");
      emit(host, "change");
    },
    onSlotChange: () => sync(host),
  });
};

/**
 * Form-associated select control backed by native option and optgroup children.
 *
 * @tag ds-input-select
 * @attr {string} name - Form field name.
 * @attr {string} value - Initial selected value used by form reset.
 * @attr {boolean} disabled - Disables the select.
 * @attr {boolean} required - Requires a selected value.
 * @attr {"true"|"false"|"grammar"|"spelling"} aria-invalid - Accessibility and visual invalid state.
 * @slot prefix - Optional leading content.
 * @slot suffix - Optional trailing content that replaces the picker icon.
 * @slot - Native option and optgroup children.
 * @prop {string} value - Live selected value.
 * @prop {string} defaultValue - Reset value reflected through the value attribute.
 * @fires input - Fired when the value changes.
 * @fires change - Fired when the value is committed.
 */
export class InputSelect extends HTMLElement {
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

  get form() {
    return stateOf(this)?.internals?.form ?? null;
  }

  get validity() {
    const state = stateOf(this);
    return state?.internals?.validity ?? state?.select.validity;
  }

  get validationMessage() {
    const state = stateOf(this);
    return state?.internals?.validationMessage ?? state?.select.validationMessage;
  }

  get willValidate() {
    const state = stateOf(this);
    return state?.internals?.willValidate ?? state?.select.willValidate ?? false;
  }

  checkValidity() {
    const state = stateOf(this);
    return state?.internals?.checkValidity() ?? state?.select.checkValidity();
  }

  reportValidity() {
    const state = stateOf(this);
    return state?.internals?.reportValidity() ?? state?.select.reportValidity();
  }

  setCustomValidity(message) {
    const state = stateOf(this);

    if (!state) return;
    state.customErrorMessage = String(message);
    state.select.setCustomValidity(message);
    syncFormValue(this);
  }

  focus(options) {
    stateOf(this)?.select.focus(options);
  }

  blur() {
    stateOf(this)?.select.blur();
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

if (!customElements.get(tagName)) customElements.define(tagName, InputSelect);

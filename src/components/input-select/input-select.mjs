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

const tagName = "input-select";

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
    <button>
      <selectedcontent></selectedcontent>
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

      .control {
        width: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .field {
        position: relative;
      }

      :host([data-has-prefix]) .prefix {
        position: absolute;
        z-index: 1;
        inset-inline-start: var(--ds-primitive-space-03);
        top: 50%;
        pointer-events: none;
        transform: translateY(-50%);
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

      :host([data-has-prefix]) .control button {
        padding-inline-start: calc(
          var(--ds-primitive-space-06) + var(--ds-primitive-space-03)
        );
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

      .control::picker-icon {
        color: var(--ds-semantic-color-foreground-muted-1);
        transition: rotate 120ms ease;
      }

      .control:open::picker-icon {
        rotate: 180deg;
      }

      :host([data-has-suffix]) .control::picker-icon {
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
        min-height: var(--ds-primitive-space-07);
        display: flex;
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
        width: 6px;
        height: 10px;
        order: 1;
        margin-left: auto;
        border: solid currentColor;
        border-width: 0 1.5px 1.5px 0;
        content: "";
        rotate: 45deg;
        transform: translateY(-1px);
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

      :host([disabled]) .control::picker-icon {
        color: var(--ds-semantic-color-foreground-disabled-elevated);
      }

      :host([disabled]) .control {
        cursor: not-allowed;
      }
    `,
  },
);

const instances = new WeakMap();
const nextSelectId = nextId(tagName);
const valueAttribute = (host) => host.getAttribute("value") ?? "";

const optionChildren = (host) =>
  [...host.children].filter((node) =>
    ["OPTGROUP", "OPTION"].includes(node.tagName),
  );

const selectButton = (control) => {
  const button =
    control.querySelector(":scope > button") ?? document.createElement("button");

  if (!button.querySelector("selectedcontent")) {
    button.replaceChildren(document.createElement("selectedcontent"));
  }

  return button;
};

const formValue = (host, state) => {
  return state.control.value;
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

const setValue = (host, value, { dirty = false } = {}) => {
  const state = instances.get(host);
  const nextValue = value == null ? "" : String(value);

  state.value = nextValue;
  state.valueDirty ||= dirty;
  state.control.value = nextValue;
  host.toggleAttribute("data-has-value", nextValue !== "");
  syncFormValue(host);
};

const syncOptions = (host) => {
  const state = instances.get(host);

  state.control.replaceChildren(
    selectButton(state.control),
    ...optionChildren(host).map((option) => option.cloneNode(true)),
  );

  if (state.valueDirty || host.hasAttribute("value")) {
    state.control.value = state.value;
  } else {
    state.value = state.control.value;
  }
};

const syncFormValue = (host) => {
  const state = instances.get(host);

  if (!state.internals) return;

  state.internals.setFormValue(disabled(host, state) ? null : formValue(host, state));

  if (disabled(host, state)) {
    state.internals.setValidity({});
  } else if (state.customErrorMessage) {
    state.internals.setValidity(
      { customError: true },
      state.customErrorMessage,
      state.control,
    );
  } else if (state.control.validity.valid) {
    state.internals.setValidity({});
  } else {
    state.internals.setValidity(
      validityFlags(state.control.validity),
      state.control.validationMessage,
      state.control,
    );
  }
};

const syncNativeAttributes = (host) => {
  const state = instances.get(host);

  state.control.disabled = disabled(host, state);
  state.control.required = host.hasAttribute("required");
};

const sync = (host) => {
  const state = instances.get(host);

  syncOptions(host);
  syncNativeAttributes(host);
  syncFieldChrome(host, state);
  host.toggleAttribute("data-has-prefix", hasSlotContent(state.prefixSlot));
  host.toggleAttribute("data-has-suffix", hasSlotContent(state.suffixSlot));
  host.toggleAttribute("data-has-value", host.value !== "");
  syncFormValue(host);
};

const listeners = (state) => [
  [state.control, "change", state.onChange],
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
  const state = instances.get(host);

  state.observer.disconnect();
  setListeners(state, "removeEventListener");
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });
  shadow.append(template.content.cloneNode(true));

  instances.set(host, {
    control: shadow.querySelector("select"),
    customErrorMessage: "",
    defaultValue: "",
    defaultValueReady: false,
    description: shadow.querySelector(".description"),
    descriptionSlot: shadow.querySelector('slot[name="description"]'),
    formDisabled: false,
    hasConnected: false,
    id: nextSelectId(),
    internals: createInternals(host),
    label: shadow.querySelector(".label"),
    labelSlot: shadow.querySelector('slot[name="label"]'),
    observer: new MutationObserver(() => sync(host)),
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
      setValue(host, event.target.value, { dirty: true });
      emit(host, "input");
      emit(host, "change");
    },
    onContentSlotChange: () => sync(host),
    onLabelClick: () => instances.get(host).control.focus(),
  });
};

/**
 * Form-associated select input.
 *
 * @tag input-select
 * @attr {string} name - Form field name.
 * @attr {string} value - Initial selected value used by form reset.
 * @attr {boolean} disabled - Disables the select.
 * @attr {boolean} required - Requires a selected value before form submission.
 * @attr {"small"|"medium"} size - Visual size. Defaults to medium.
 * @attr {"top"|"start"} label-position - Label placement. Defaults to top.
 * @slot label - Visible label content.
 * @slot description - Helper or validation text.
 * @slot prefix - Optional leading icon or text.
 * @slot suffix - Optional trailing content that replaces the native picker icon.
 * @slot - Native option and optgroup children.
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
    return state?.internals?.validity ?? state?.control.validity;
  }

  get validationMessage() {
    const state = instances.get(this);
    return state?.internals?.validationMessage ?? state?.control.validationMessage;
  }

  get willValidate() {
    const state = instances.get(this);
    return state?.internals?.willValidate ?? state?.control.willValidate ?? false;
  }

  checkValidity() {
    const state = instances.get(this);
    return state?.internals?.checkValidity() ?? state?.control.checkValidity();
  }

  reportValidity() {
    const state = instances.get(this);
    return state?.internals?.reportValidity() ?? state?.control.reportValidity();
  }

  setCustomValidity(message) {
    const state = instances.get(this);

    if (!state) return;
    state.customErrorMessage = String(message);
    state.control.setCustomValidity(message);
    syncFormValue(this);
  }

  focus(options) {
    instances.get(this)?.control.focus(options);
  }

  blur() {
    instances.get(this)?.control.blur();
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

if (!customElements.get(tagName)) customElements.define(tagName, InputSelect);

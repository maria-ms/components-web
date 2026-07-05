import {
  createInternals,
  disabled,
  fieldObservedAttributes,
  fieldTemplate,
  nextId,
  setOptionalAttribute,
  syncFieldChrome,
  validityFlags,
} from "./field-shell.mjs";

const inputObservedAttributes = [
  ...fieldObservedAttributes,
  "autocapitalize",
  "autocomplete",
  "enterkeyhint",
  "form",
  "inputmode",
  "maxlength",
  "minlength",
  "name",
  "pattern",
  "placeholder",
  "readonly",
  "required",
  "spellcheck",
  "type",
  "value",
];

const valueAttribute = (host) => host.getAttribute("value") ?? "";

const syncSuffixFallback = (host, state) => {
  const canClear = Boolean(
    state.clearButton &&
      host.value !== "" &&
      !disabled(host, state) &&
      !host.hasAttribute("readonly"),
  );

  if (state.clearButton) state.clearButton.hidden = !canClear;
  state.suffixHasFallback = state.baseSuffixHasFallback || canClear;
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
  const state = hostState.get(host);
  const nextValue = value == null ? "" : String(value);

  state.value = nextValue;
  state.valueDirty ||= dirty;
  host.toggleAttribute("data-has-value", nextValue !== "");
  if (state.control.value !== nextValue) state.control.value = nextValue;
  syncSuffixFallback(host, state);
  syncFieldChrome(host, state);
  syncFormValue(host);
};

const hostState = new WeakMap();

const syncFormValue = (host) => {
  const state = hostState.get(host);

  if (!state.internals) return;

  state.internals.setFormValue(disabled(host, state) ? null : host.value);

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

const syncNativeAttributes = (host, defaultType) => {
  const state = hostState.get(host);

  [
    "autocapitalize",
    "autocomplete",
    "enterkeyhint",
    "inputmode",
    "maxlength",
    "minlength",
    "pattern",
    "placeholder",
    "spellcheck",
  ].forEach((name) =>
    setOptionalAttribute(state.control, name, host.getAttribute(name)),
  );

  state.control.type = host.getAttribute("type") || defaultType;
  state.control.disabled = disabled(host, state);
  state.control.readOnly = host.hasAttribute("readonly");
  state.control.required = host.hasAttribute("required");
};

const sync = (host, defaultType) => {
  const state = hostState.get(host);

  if (state.control.value !== host.value) state.control.value = host.value;
  host.toggleAttribute("data-has-value", host.value !== "");
  syncNativeAttributes(host, defaultType);
  syncSuffixFallback(host, state);
  syncFieldChrome(host, state);
  syncFormValue(host);
};

const connect = (host, defaultType) => {
  const state = hostState.get(host);

  if (!state.hasConnected) {
    state.defaultValue = valueAttribute(host);
    if (!state.valueDirty) setValue(host, state.defaultValue);
    state.hasConnected = true;
  }

  state.listeners.forEach(([target, type, listener]) =>
    target.addEventListener(type, listener),
  );
  sync(host, defaultType);
};

const disconnect = (host) => {
  hostState
    .get(host)
    .listeners.forEach(([target, type, listener]) =>
      target.removeEventListener(type, listener),
    );
};

export const defineTextField = ({
  tagName,
  clearable = false,
  defaultType = "text",
  extraStyles = "",
  prefixFallback = "",
  prefixHasFallback = false,
  suffixFallback = "",
  suffixHasFallback = false,
  typeAttribute = true,
}) => {
  const template = document.createElement("template");
  const nextInputId = nextId(tagName);
  const observedAttributes = typeAttribute
    ? inputObservedAttributes
    : inputObservedAttributes.filter((name) => name !== "type");

  template.innerHTML = fieldTemplate(
    `<input part="input" class="control" />`,
    { extraStyles, prefixFallback, suffixFallback },
  );

  class TextField extends HTMLElement {
    static formAssociated = true;

    static observedAttributes = observedAttributes;

    constructor() {
      super();

      const shadow = this.attachShadow({ mode: "open" });
      shadow.append(template.content.cloneNode(true));

      const state = {
        clearButton: shadow.querySelector("[data-clear]"),
        control: shadow.querySelector("input"),
        baseSuffixHasFallback: suffixHasFallback,
        customErrorMessage: "",
        defaultValue: "",
        formDisabled: false,
        hasConnected: false,
        id: nextInputId(),
        internals: createInternals(this),
        prefix: shadow.querySelector(".prefix"),
        prefixHasFallback,
        prefixSlot: shadow.querySelector('slot[name="prefix"]'),
        suffix: shadow.querySelector(".suffix"),
        suffixHasFallback: false,
        suffixSlot: shadow.querySelector('slot[name="suffix"]'),
        value: valueAttribute(this),
        valueDirty: false,
      };

      state.listeners = [
        [state.control, "input", this.#onInput],
        [state.control, "change", this.#onChange],
        ...(clearable && state.clearButton
          ? [[state.clearButton, "click", this.#onClear]]
          : []),
        [state.prefixSlot, "slotchange", this.#onContentSlotChange],
        [state.suffixSlot, "slotchange", this.#onContentSlotChange],
      ];

      hostState.set(this, state);
    }

    connectedCallback() {
      connect(this, defaultType);
    }

    disconnectedCallback() {
      disconnect(this);
    }

    attributeChangedCallback(name) {
      if (!hostState.has(this)) return;
      if (name === "value") {
        hostState.get(this).defaultValue = valueAttribute(this);
        setValue(this, valueAttribute(this));
      } else {
        sync(this, defaultType);
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

    get type() {
      return hostState.get(this)?.control.type ?? defaultType;
    }

    set type(value) {
      typeAttribute && setOptionalAttribute(this, "type", value);
    }

    get value() {
      return hostState.get(this)?.value ?? valueAttribute(this);
    }

    set value(value) {
      if (hostState.has(this)) setValue(this, value, { dirty: true });
    }

    get defaultValue() {
      return valueAttribute(this);
    }

    set defaultValue(value) {
      setOptionalAttribute(this, "value", value);
    }

    get form() {
      return hostState.get(this)?.internals?.form ?? null;
    }

    get validity() {
      const state = hostState.get(this);
      return state?.internals?.validity ?? state?.control.validity;
    }

    get validationMessage() {
      const state = hostState.get(this);
      return state?.internals?.validationMessage ?? state?.control.validationMessage;
    }

    get willValidate() {
      const state = hostState.get(this);
      return state?.internals?.willValidate ?? state?.control.willValidate ?? false;
    }

    checkValidity() {
      const state = hostState.get(this);
      return state?.internals?.checkValidity() ?? state?.control.checkValidity();
    }

    reportValidity() {
      const state = hostState.get(this);
      return state?.internals?.reportValidity() ?? state?.control.reportValidity();
    }

    setCustomValidity(message) {
      const state = hostState.get(this);

      if (!state) return;
      state.customErrorMessage = String(message);
      state.control.setCustomValidity(message);
      syncFormValue(this);
    }

    focus(options) {
      hostState.get(this)?.control.focus(options);
    }

    blur() {
      hostState.get(this)?.control.blur();
    }

    formDisabledCallback(isDisabledByForm) {
      const state = hostState.get(this);

      if (!state) return;
      state.formDisabled = isDisabledByForm;
      sync(this, defaultType);
    }

    formResetCallback() {
      const state = hostState.get(this);

      state.valueDirty = false;
      setValue(this, state.defaultValue);
    }

    formStateRestoreCallback(value) {
      setValue(this, value, { dirty: true });
    }

    #onChange = (event) => {
      event.stopPropagation();
      setValue(this, event.target.value, { dirty: true });
      emit(this, "change");
    };

    #onContentSlotChange = () => sync(this, defaultType);

    #onClear = () => {
      const state = hostState.get(this);

      if (
        !state ||
        disabled(this, state) ||
        this.hasAttribute("readonly") ||
        this.value === ""
      ) {
        return;
      }

      setValue(this, "", { dirty: true });
      emit(this, "input");
      emit(this, "change");
      state.control.focus();
    };

    #onInput = (event) => {
      event.stopPropagation();
      setValue(this, event.target.value, { dirty: true });
      emit(this, "input");
    };

  }

  if (!customElements.get(tagName)) customElements.define(tagName, TextField);

  return TextField;
};

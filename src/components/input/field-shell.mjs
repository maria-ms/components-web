export const fieldObservedAttributes = [
  "aria-describedby",
  "aria-invalid",
  "aria-label",
  "aria-labelledby",
  "disabled",
];

export const fieldStyles = `
  :host {
    --ds-input-icon-size: var(--ds-component-input-icon-size);
    --ds-control-background: var(--ds-component-input-color-background-default);
    --ds-control-border-color: var(--ds-component-input-color-border-default);
    --ds-control-border-radius: var(--ds-primitive-radius-04);
    --ds-control-border-width: 1px;
    --ds-control-hover-background: var(--ds-component-input-color-background-hover);
    --ds-control-focus-background: var(--ds-component-input-color-background-default);
    --ds-control-focus-border-color: var(--ds-semantic-color-border-focus);
    --ds-control-focus-shadow:
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
    --ds-control-invalid-background: var(--ds-semantic-color-background-destructive-subtle);
    --ds-control-invalid-border-color: var(--ds-semantic-color-border-destructive-elevated);
    --ds-control-invalid-shadow:
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

    box-sizing: border-box;
    display: block;
    width: 100%;
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

  .field,
  .prefix,
  .suffix {
    display: flex;
  }

  .field {
    gap: var(--ds-primitive-space-03);
  }

  .field {
    width: 100%;
    min-height: var(--ds-component-input-height-root);
    align-items: center;
    overflow: hidden;
    padding: var(--ds-primitive-space-02) var(--ds-primitive-space-03);
    border: var(--ds-control-border-width) solid var(--ds-control-border-color);
    border-radius: var(--ds-control-border-radius);
    background: var(--ds-control-background);
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      box-shadow 120ms ease;
  }

  :host(:not([disabled]):not([aria-invalid="true"]):hover) .field {
    background: var(--ds-control-hover-background);
  }

  :host(:not([disabled]):not([aria-invalid="true"]):focus-within) .field {
    border-color: var(--ds-control-focus-border-color);
    background: var(--ds-control-focus-background);
    box-shadow: var(--ds-control-focus-shadow);
  }

  :host([aria-invalid="true"]) .field {
    border-color: var(--ds-control-invalid-border-color);
    background: var(--ds-control-invalid-background);
    box-shadow: var(--ds-control-invalid-shadow);
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  :host([disabled]) .field {
    border-color: var(--ds-component-input-color-border-disabled);
    background: var(--ds-component-input-color-background-disabled);
  }

  .control {
    min-width: 40px;
    flex: 1 1 auto;
    border: 0;
    outline: 0;
    padding: 0;
    background: transparent;
    color: var(--ds-semantic-color-foreground-muted-1);
    font: inherit;
    font-size: var(--ds-semantic-typography-body-small-font-size);
    font-weight: var(--ds-semantic-typography-body-small-font-weight-root);
    line-height: var(--ds-semantic-typography-body-small-line-height);
    font-kerning: none;
    font-variant-ligatures: none;
  }

  .control::placeholder {
    color: var(--ds-semantic-color-foreground-muted-1);
    opacity: 1;
  }

  :host([data-has-value]) .control {
    color: var(--ds-semantic-color-foreground-default);
  }

  :host([aria-invalid="true"]) .control {
    color: var(--ds-semantic-color-foreground-destructive-elevated);
  }

  :host([disabled]) .control {
    color: var(--ds-semantic-color-foreground-disabled-elevated);
    cursor: not-allowed;
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

  .prefix.has-content,
  .suffix.has-content {
    display: flex;
  }

  .prefix slot::slotted(svg),
  .suffix slot::slotted(svg) {
    display: block;
    width: var(--ds-input-icon-size);
    height: var(--ds-input-icon-size);
  }

`;

export const fieldTemplate = (
  control,
  {
    afterSuffix = "",
    extraStyles = "",
    prefixFallback = "",
    suffixFallback = "",
  } = {},
) => `
  <style>
    ${fieldStyles}
    ${extraStyles}
  </style>

  <div part="field" class="field">
    <span part="prefix" class="prefix">
      <slot name="prefix">${prefixFallback}</slot>
    </span>
    ${control}
    <span part="suffix" class="suffix">
      <slot name="suffix">${suffixFallback}</slot>
    </span>
    ${afterSuffix}
  </div>
`;

export const hasSlotContent = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .some(
      (node) => node.nodeType === 1 || (node.textContent ?? "").trim() !== "",
    );

export const createInternals = (host) => {
  try {
    return typeof host.attachInternals === "function"
      ? host.attachInternals()
      : null;
  } catch {
    return null;
  }
};

export const setOptionalAttribute = (element, name, value) =>
  value == null || value === ""
    ? element.removeAttribute(name)
    : element.setAttribute(name, value);

export const disabled = (host, state) =>
  host.hasAttribute("disabled") || Boolean(state?.formDisabled);

export const validityFlags = (validity) =>
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

export const syncFieldChrome = (host, state) => {
  const ariaLabel = host.getAttribute("aria-label");
  const ariaLabelledBy = host.getAttribute("aria-labelledby");
  const ariaDescribedBy = host.getAttribute("aria-describedby");
  const ariaInvalid = host.getAttribute("aria-invalid");

  state.control.id = state.id;
  state.prefix.classList.toggle(
    "has-content",
    state.prefixHasFallback || hasSlotContent(state.prefixSlot),
  );
  state.suffix.classList.toggle(
    "has-content",
    state.suffixHasFallback || hasSlotContent(state.suffixSlot),
  );

  if (ariaLabel) {
    state.control.setAttribute("aria-label", ariaLabel);
    state.control.removeAttribute("aria-labelledby");
  } else if (ariaLabelledBy) {
    state.control.setAttribute("aria-labelledby", ariaLabelledBy);
    state.control.removeAttribute("aria-label");
  } else {
    state.control.removeAttribute("aria-label");
    state.control.removeAttribute("aria-labelledby");
  }

  if (ariaDescribedBy) {
    state.control.setAttribute("aria-describedby", ariaDescribedBy);
  } else {
    state.control.removeAttribute("aria-describedby");
  }

  ariaInvalid == null
    ? state.control.removeAttribute("aria-invalid")
    : state.control.setAttribute("aria-invalid", ariaInvalid);
};

export const nextId = (tagName) => {
  let id = 0;
  return () => `${tagName}-${id++}`;
};

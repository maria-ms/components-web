export const fieldObservedAttributes = [
  "aria-describedby",
  "aria-invalid",
  "aria-label",
  "aria-labelledby",
  "disabled",
  "label-position",
  "size",
];

export const fieldStyles = `
  :host {
    --ds-input-icon-size: var(--ds-primitive-space-04);
    --ds-input-inline-small-width: 193px;
    --ds-input-inline-width: 276px;
    --ds-input-small-width: 140px;
    --ds-input-width: 276px;

    box-sizing: border-box;
    display: inline-block;
    width: var(--ds-input-width);
    max-width: 100%;
    color: var(--ds-semantic-color-foreground-default);
    font-family: inherit;
    font-size: var(--ds-semantic-typography-body-small-font-size);
    line-height: var(--ds-semantic-typography-body-small-line-height);
  }

  :host([size="small"]),
  :host([size="sm"]) {
    width: var(--ds-input-small-width);
  }

  :host([label-position="start"]) {
    width: var(--ds-input-inline-width);
  }

  :host([label-position="start"][size="small"]),
  :host([label-position="start"][size="sm"]) {
    width: var(--ds-input-inline-small-width);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .root,
  .stack,
  .field,
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
  .field {
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
    padding: var(--ds-primitive-space-02) var(--ds-primitive-space-03);
    border: 1px solid var(--ds-component-input-color-border-default);
    border-radius: var(--ds-primitive-radius-04);
    background: var(--ds-component-input-color-background-default);
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      box-shadow 120ms ease;
  }

  :host([size="small"]) .field,
  :host([size="sm"]) .field {
    width: var(--ds-input-small-field-width, 140px);
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

  .description {
    color: var(--ds-semantic-color-foreground-muted-1);
    font-size: var(--ds-semantic-typography-body-x-small-font-size);
    font-weight: var(--ds-semantic-typography-body-x-small-font-weight-root);
    line-height: var(--ds-semantic-typography-body-x-small-line-height);
  }
`;

export const fieldTemplate = (
  control,
  { extraStyles = "", prefixFallback = "", suffixFallback = "" } = {},
) => `
  <style>
    ${fieldStyles}
    ${extraStyles}
  </style>

  <div part="root" class="root">
    <label part="label" class="label">
      <slot name="label"></slot>
    </label>
    <div part="stack" class="stack">
      <div part="field" class="field">
        <span part="prefix" class="prefix">
          <slot name="prefix">${prefixFallback}</slot>
        </span>
        ${control}
        <span part="suffix" class="suffix">
          <slot name="suffix">${suffixFallback}</slot>
        </span>
      </div>
      <p part="description" class="description">
        <slot name="description"></slot>
      </p>
    </div>
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
  const labelIsVisible = hasSlotContent(state.labelSlot);
  const descriptionIsVisible = hasSlotContent(state.descriptionSlot);
  const ariaLabel = host.getAttribute("aria-label");
  const ariaLabelledBy = host.getAttribute("aria-labelledby");
  const ariaDescribedBy = host.getAttribute("aria-describedby");
  const ariaInvalid = host.getAttribute("aria-invalid");

  state.control.id = state.id;
  state.label.id = `${state.id}-label`;
  state.label.htmlFor = state.id;
  state.label.hidden = !labelIsVisible;
  state.description.id = `${state.id}-description`;
  state.description.hidden = !descriptionIsVisible;
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
  } else if (labelIsVisible) {
    state.control.setAttribute("aria-labelledby", state.label.id);
    state.control.removeAttribute("aria-label");
  } else {
    state.control.removeAttribute("aria-label");
    state.control.removeAttribute("aria-labelledby");
  }

  if (ariaDescribedBy) {
    state.control.setAttribute("aria-describedby", ariaDescribedBy);
  } else if (descriptionIsVisible) {
    state.control.setAttribute("aria-describedby", state.description.id);
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

const buttonTagName = "ds-button";
const iconButtonTagName = "ds-icon-button";

const createTemplate = (iconOnlyStyles = "") => {
  const template = document.createElement("template");

  template.innerHTML = `
  <style>
    :host {
      --button-block-size: var(--ds-component-button-height-sm);
      --button-gap: var(--ds-semantic-spacing-2xs);
      --button-padding-block: var(--ds-semantic-spacing-2xs);
      --button-padding-inline: var(--ds-semantic-spacing-xs);
      --button-radius: var(--ds-semantic-radius-md);
      --button-font-size: var(--ds-primitive-font-size-small);
      --button-font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      --button-line-height: var(--ds-primitive-font-line-height-small);
      --button-letter-spacing: normal;
      --button-background: var(--ds-component-button-color-background-default);
      --button-background-hover: var(--ds-component-button-color-background-hover-elevated);
      --button-border: transparent;
      --button-border-width: 0;
      --button-foreground: var(--ds-component-button-color-foreground-default);
      --button-focus-color: var(--ds-semantic-border-focus-primary-color);
      --button-focus-offset-x: var(--ds-semantic-border-focus-primary-offset-x);
      --button-focus-offset-y: var(--ds-semantic-border-focus-primary-offset-y);
      --button-focus-blur: var(--ds-semantic-border-focus-primary-blur);
      --button-focus-spread: var(--ds-semantic-border-focus-primary-spread);
      --ds-button-icon-size: var(--ds-component-icon-size-sm);

      box-sizing: border-box;
      display: inline-block;
      max-inline-size: 100%;
      vertical-align: middle;
    }

    :host([size="medium"]) {
      --button-block-size: var(--ds-component-button-height-md);
      --button-gap: var(--ds-semantic-spacing-xs);
      --button-padding-block: var(--ds-semantic-spacing-sm);
      --button-padding-inline: var(--ds-semantic-spacing-sm);
      --button-radius: var(--ds-semantic-radius-lg);
      --ds-button-icon-size: var(--ds-component-icon-size-md);
    }

    :host([size="large"]) {
      --button-block-size: var(--ds-component-button-height-lg);
      --button-padding-block: var(--ds-semantic-spacing-sm);
      --button-padding-inline: var(--ds-semantic-spacing-md);
      --button-radius: var(--ds-semantic-radius-lg);
      --button-font-size: var(--ds-primitive-font-size-base);
      --button-font-weight: var(--ds-semantic-typography-body-base-font-weight-medium);
      --button-line-height: var(--ds-primitive-font-line-height-base);
      --ds-button-icon-size: var(--ds-component-icon-size-lg);
    }

    :host([variant="secondary"]) {
      --button-background: var(--ds-component-button-color-background-secondary);
      --button-background-hover: var(--ds-component-button-color-background-hover-muted);
      --button-foreground: var(--ds-component-button-color-foreground-primary);
    }

    :host([variant="outline"]) {
      --button-background: var(--ds-component-button-color-background-tertiary);
      --button-background-hover: var(--ds-component-button-color-background-secondary);
      --button-border: var(--ds-component-button-color-border-primary);
      --button-border-width: var(--ds-semantic-border-width-default);
      --button-foreground: var(--ds-component-button-color-foreground-primary);
    }

    :host([variant="ghost"]) {
      --button-background: transparent;
      --button-background-hover: var(--ds-component-button-color-background-secondary);
      --button-foreground: var(--ds-component-button-color-foreground-secondary);
    }

    :host([variant="destructive"]) {
      --button-background: var(--ds-component-button-color-background-destructive-default);
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-muted);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-primary);
      --button-focus-color: var(--ds-semantic-border-focus-destructive-color);
      --button-focus-offset-x: var(--ds-semantic-border-focus-destructive-offset-x);
      --button-focus-offset-y: var(--ds-semantic-border-focus-destructive-offset-y);
      --button-focus-blur: var(--ds-semantic-border-focus-destructive-blur);
      --button-focus-spread: var(--ds-semantic-border-focus-destructive-spread);
    }

    :host([variant="secondary"][size="medium"]),
    :host([variant="outline"][size="medium"]),
    :host([variant="ghost"][size="medium"]) {
      --button-padding-block: var(--ds-semantic-spacing-xs);
    }

    slot {
      display: contents;
    }

    ::slotted(button) {
      box-sizing: border-box;
      display: inline-flex;
      min-inline-size: 0;
      max-inline-size: 100%;
      block-size: var(--button-block-size);
      align-items: center;
      justify-content: center;
      gap: var(--button-gap);
      margin: 0;
      border: var(--button-border-width) solid var(--button-border);
      border-radius: var(--button-radius);
      padding: var(--button-padding-block) var(--button-padding-inline);
      background: var(--button-background);
      color: var(--button-foreground);
      font-family: var(--ds-primitive-font-family-body);
      font-size: var(--button-font-size);
      font-weight: var(--button-font-weight);
      line-height: var(--button-line-height);
      letter-spacing: var(--button-letter-spacing);
      text-align: center;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    ::slotted(button:not(:disabled):hover) {
      background: var(--button-background-hover);
    }

    :host([variant="ghost"]) ::slotted(button:not(:disabled):hover) {
      color: var(--ds-component-button-color-foreground-primary);
    }

    ::slotted(button:focus-visible) {
      outline: 0;
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
        var(--ds-semantic-shadow-xs-offset-y)
        var(--ds-semantic-shadow-xs-blur)
        var(--ds-semantic-shadow-xs-spread)
        var(--ds-semantic-shadow-xs-color),
        var(--button-focus-offset-x)
        var(--button-focus-offset-y)
        var(--button-focus-blur)
        var(--button-focus-spread)
        var(--button-focus-color);
    }

    ::slotted(button:disabled) {
      border-color: transparent;
      background: var(--ds-component-button-color-background-disabled);
      color: var(--ds-component-button-color-foreground-disabled);
      cursor: not-allowed;
    }

    :host([variant="outline"]) ::slotted(button:disabled) {
      border-color: var(--ds-component-button-color-border-disabled);
    }

    :host([variant="ghost"]) ::slotted(button:disabled) {
      background: transparent;
    }

    :host([variant="outline"]) ::slotted(button:disabled) {
      background: transparent;
    }

    :host([variant="secondary"]) ::slotted(button:disabled) {
      background: var(--ds-component-button-color-background-secondary);
      color: var(--ds-component-button-color-foreground-primary);
      opacity: 0.5;
    }

    :host([variant="secondary"][size="large"]) ::slotted(button:disabled) {
      padding-block: var(--ds-semantic-spacing-md);
    }

    :host([variant="ghost"]) ::slotted(button:focus-visible) {
      background: var(--ds-component-button-color-background-tertiary);
    }

    ${iconOnlyStyles}

    @media (forced-colors: active) {
      ::slotted(button) {
        border-width: var(--ds-semantic-border-width-default);
        border-color: ButtonText;
        background: ButtonFace;
        color: ButtonText;
      }

      ::slotted(button:focus-visible) {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }
    }
  </style>

  <slot></slot>
`;

  return template;
};

const template = createTemplate();

const iconButtonTemplate = createTemplate(`
  :host {
    --button-inline-size: var(--ds-component-button-icon-only-size-sm);
  }

  :host([size="medium"]) {
    --button-inline-size: var(--ds-component-button-icon-only-size-md);
  }

  :host([size="large"]) {
    --button-inline-size: var(--ds-component-button-icon-only-size-lg);
  }

  ::slotted(button) {
    inline-size: var(--button-inline-size);
    padding: 0;
  }
`);

/**
 * Token styles for one consumer-owned native button.
 *
 * The native button keeps its complete HTML contract: form participation,
 * type, disabled state, accessibility attributes, events, and child content.
 */
export class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
  }
}

/**
 * Token styles for one consumer-owned native icon-only button.
 *
 * The consumer supplies one decorative icon and the native button's accessible
 * name, for example with aria-label.
 */
export class IconButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(iconButtonTemplate.content.cloneNode(true));
  }
}

if (!customElements.get(buttonTagName)) customElements.define(buttonTagName, Button);
if (!customElements.get(iconButtonTagName)) {
  customElements.define(iconButtonTagName, IconButton);
}

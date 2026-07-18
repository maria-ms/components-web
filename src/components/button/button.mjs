const tagName = "ds-button";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --button-block-size: var(--ds-component-button-height-md);
      --button-gap: var(--ds-semantic-spacing-xs);
      --button-padding-block: var(--ds-semantic-spacing-xs);
      --button-padding-inline: var(--ds-semantic-spacing-sm);
      --button-radius: var(--ds-semantic-radius-md);
      --button-font-size: var(--ds-semantic-typography-control-default-font-size);
      --button-font-weight: var(--ds-semantic-typography-control-default-font-weight-root);
      --button-line-height: var(--ds-semantic-typography-control-default-line-height);
      --button-letter-spacing: var(--ds-semantic-typography-control-default-letter-spacing);
      --button-background: var(--ds-component-button-color-background-default);
      --button-background-hover: var(--ds-component-button-color-background-hover-elevated);
      --button-border: transparent;
      --button-foreground: var(--ds-component-button-color-foreground-default);
      --button-focus-color: var(--ds-semantic-border-focus-primary-color);
      --button-focus-offset-x: var(--ds-semantic-border-focus-primary-offset-x);
      --button-focus-offset-y: var(--ds-semantic-border-focus-primary-offset-y);
      --button-focus-blur: var(--ds-semantic-border-focus-primary-blur);
      --button-focus-spread: var(--ds-semantic-border-focus-primary-spread);
      --ds-button-icon-size: var(--ds-component-icon-size-md);

      box-sizing: border-box;
      display: inline-block;
      max-inline-size: 100%;
      vertical-align: middle;
    }

    :host([size="small"]) {
      --button-block-size: var(--ds-component-button-height-sm);
      --button-gap: var(--ds-semantic-spacing-2xs);
      --button-padding-block: var(--ds-semantic-spacing-2xs);
      --button-padding-inline: var(--ds-semantic-spacing-xs);
      --button-radius: var(--ds-semantic-radius-base);
      --ds-button-icon-size: var(--ds-component-icon-size-sm);
    }

    :host([size="large"]) {
      --button-block-size: var(--ds-component-button-height-lg);
      --button-padding-block: var(--ds-semantic-spacing-sm);
      --button-padding-inline: var(--ds-semantic-spacing-md);
      --button-radius: var(--ds-semantic-radius-lg);
      --button-font-size: var(--ds-semantic-typography-body-base-font-size);
      --button-font-weight: var(--ds-semantic-typography-body-base-font-weight-medium);
      --button-line-height: var(--ds-semantic-typography-body-base-line-height);
      --button-letter-spacing: var(--ds-semantic-typography-body-base-letter-spacing);
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

    slot {
      display: contents;
    }

    ::slotted(button) {
      box-sizing: border-box;
      display: inline-flex;
      min-inline-size: 0;
      max-inline-size: 100%;
      min-block-size: var(--button-block-size);
      align-items: center;
      justify-content: center;
      gap: var(--button-gap);
      margin: 0;
      border: var(--ds-semantic-border-width-thin) solid var(--button-border);
      border-radius: var(--button-radius);
      padding: var(--button-padding-block) var(--button-padding-inline);
      background: var(--button-background);
      color: var(--button-foreground);
      font-family: inherit;
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

    @media (forced-colors: active) {
      ::slotted(button) {
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

if (!customElements.get(tagName)) customElements.define(tagName, Button);

const tagName = "ds-button";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --button-block-size: var(--ds-component-button-height-md);
      --button-gap: var(--ds-primitive-space-03);
      --button-icon-only-size: var(--ds-component-button-icon-only-size-md);
      --ds-button-icon-size: var(--ds-component-icon-size-md);
      --button-padding-block: var(--ds-primitive-space-04);
      --button-padding-inline: var(--ds-primitive-space-04);
      --button-radius: var(--ds-primitive-radius-04);
      --button-font-size: var(--ds-semantic-typography-body-small-font-size);
      --button-line-height: var(--ds-semantic-typography-body-small-line-height);
      --button-background: var(--ds-component-button-color-background-default);
      --button-background-hover: var(--ds-component-button-color-background-hover-elevated);
      --button-border: transparent;
      --button-foreground: var(--ds-component-button-color-foreground-default);

      box-sizing: border-box;
      display: inline-block;
      max-width: 100%;
      font-family: inherit;
      vertical-align: middle;
    }

    :host([size="xs"]) {
      --button-block-size: var(--ds-component-button-height-xs);
      --button-gap: var(--ds-primitive-space-02);
      --button-icon-only-size: var(--ds-component-button-icon-only-size-xs);
      --ds-button-icon-size: var(--ds-component-icon-size-sm);
      --button-padding-block: var(--ds-primitive-space-02);
      --button-padding-inline: var(--ds-primitive-space-03);
      --button-radius: var(--ds-primitive-radius-03);
    }

    :host([size="sm"]) {
      --button-block-size: var(--ds-component-button-height-sm);
      --button-gap: var(--ds-primitive-space-02);
      --button-icon-only-size: var(--ds-component-button-icon-only-size-sm);
      --ds-button-icon-size: var(--ds-component-icon-size-sm);
      --button-padding-block: var(--ds-primitive-space-02);
      --button-padding-inline: var(--ds-primitive-space-03);
      --button-radius: var(--ds-primitive-radius-04);
    }

    :host([size="lg"]) {
      --button-block-size: var(--ds-component-button-height-lg);
      --button-gap: var(--ds-primitive-space-03);
      --button-icon-only-size: var(--ds-component-button-icon-only-size-lg);
      --ds-button-icon-size: var(--ds-component-icon-size-lg);
      --button-padding-block: var(--ds-primitive-space-04);
      --button-padding-inline: var(--ds-primitive-space-05);
      --button-radius: var(--ds-primitive-radius-05);
      --button-font-size: var(--ds-semantic-typography-body-base-font-size);
      --button-line-height: var(--ds-semantic-typography-body-base-line-height);
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

    :host([variant="link"]),
    :host([variant="link-muted"]) {
      --button-background: transparent;
      --button-background-hover: transparent;
      --button-padding-block: var(--ds-primitive-space-01);
      --button-padding-inline: 0;
      --button-foreground: var(--ds-component-button-color-foreground-primary);
    }

    :host([variant="link-muted"]) {
      --button-foreground: var(--ds-component-button-color-foreground-secondary);
    }

    :host([tone="destructive"]) {
      --button-background: var(--ds-component-button-color-background-destructive-elevated);
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-elevated);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-secondary);
    }

    :host([tone="destructive"][variant="secondary"]) {
      --button-background: var(--ds-component-button-color-background-destructive-muted);
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-muted);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([tone="destructive"][variant="outline"]) {
      --button-background: var(--ds-component-button-color-background-tertiary);
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-muted);
      --button-border: var(--ds-component-button-color-border-destructive-elevated);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([tone="destructive"][variant="ghost"]),
    :host([tone="destructive"][variant="link"]) {
      --button-background: transparent;
      --button-background-hover: var(--ds-component-button-color-background-destructive-hover-muted);
      --button-foreground: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([tone="destructive"][variant="link"]) {
      --button-background-hover: transparent;
    }

    slot {
      display: contents;
    }

    ::slotted(button),
    ::slotted(a) {
      box-sizing: border-box;
      display: inline-flex;
      min-width: 0;
      max-width: 100%;
      min-height: var(--button-block-size);
      align-items: center;
      justify-content: center;
      gap: var(--button-gap);
      border: var(--ds-semantic-border-width-thin) solid var(--button-border);
      border-radius: var(--button-radius);
      padding: var(--button-padding-block) var(--button-padding-inline);
      background: var(--button-background);
      color: var(--button-foreground);
      font-family: inherit;
      font-size: var(--button-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      line-height: var(--button-line-height);
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    }

    ::slotted(button:hover),
    ::slotted(a:hover) {
      background: var(--button-background-hover);
    }

    :host([variant="ghost"]) ::slotted(button:hover),
    :host([variant="ghost"]) ::slotted(a:hover) {
      color: var(--ds-component-button-color-foreground-primary);
    }

    :host([tone="destructive"][variant="ghost"]) ::slotted(button:hover),
    :host([tone="destructive"][variant="ghost"]) ::slotted(a:hover) {
      color: var(--ds-component-button-color-foreground-destructive-primary);
    }

    :host([variant="link"]) ::slotted(button:hover),
    :host([variant="link"]) ::slotted(a:hover),
    :host([variant="link-muted"]) ::slotted(button:hover),
    :host([variant="link-muted"]) ::slotted(a:hover) {
      text-decoration: underline;
      text-underline-offset: var(--ds-primitive-space-01);
    }

    ::slotted(button:focus-visible),
    ::slotted(a:focus-visible) {
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

    :host([tone="destructive"]) ::slotted(button:focus-visible),
    :host([tone="destructive"]) ::slotted(a:focus-visible) {
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

    ::slotted(button:disabled),
    ::slotted(button[aria-disabled="true"]),
    ::slotted(a[aria-disabled="true"]) {
      border-color: transparent;
      background: var(--ds-component-button-color-background-disabled);
      color: var(--ds-component-button-color-foreground-disabled);
      cursor: not-allowed;
    }

    :host([variant="outline"]) ::slotted(button:disabled),
    :host([variant="outline"]) ::slotted(button[aria-disabled="true"]),
    :host([variant="outline"]) ::slotted(a[aria-disabled="true"]) {
      border-color: var(--ds-component-button-color-border-disabled);
    }

    :host([variant="ghost"]) ::slotted(button:disabled),
    :host([variant="ghost"]) ::slotted(button[aria-disabled="true"]),
    :host([variant="ghost"]) ::slotted(a[aria-disabled="true"]),
    :host([variant="link"]) ::slotted(button:disabled),
    :host([variant="link"]) ::slotted(button[aria-disabled="true"]),
    :host([variant="link"]) ::slotted(a[aria-disabled="true"]),
    :host([variant="link-muted"]) ::slotted(button:disabled),
    :host([variant="link-muted"]) ::slotted(button[aria-disabled="true"]),
    :host([variant="link-muted"]) ::slotted(a[aria-disabled="true"]) {
      background: transparent;
    }

    :host([icon-only]) ::slotted(button),
    :host([icon-only]) ::slotted(a) {
      width: var(--button-icon-only-size);
      min-width: var(--button-icon-only-size);
      padding: 0;
    }

    @media (forced-colors: active) {
      ::slotted(button),
      ::slotted(a) {
        border-color: ButtonText;
      }

      ::slotted(button:focus-visible),
      ::slotted(a:focus-visible) {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }
    }
  </style>

  <slot></slot>
`;

/**
 * Styles one consumer-owned native button or link without replacing its native
 * semantics, attributes, form behavior, events, or child composition.
 */
export class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Button);

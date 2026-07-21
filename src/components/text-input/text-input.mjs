const tagName = "ds-text-input";
const styleId = "ds-text-input-styles";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-text-input {
      --ds-text-input-block-size: var(--ds-component-input-height-sm);
      --ds-text-input-inline-size: var(--ds-component-input-width-lg);
      --ds-text-input-radius: var(--ds-component-input-radius-sm);
      --ds-text-input-placeholder-color: var(--ds-semantic-color-foreground-muted-2);

      box-sizing: border-box;
      display: inline-block;
      max-inline-size: 100%;
      vertical-align: middle;
    }

    ds-text-input[size="medium"] {
      --ds-text-input-block-size: var(--ds-component-input-height-md);
      --ds-text-input-radius: var(--ds-component-input-radius-md);
    }

    ds-text-input[size="large"] {
      --ds-text-input-block-size: var(--ds-component-input-height-lg);
      --ds-text-input-radius: var(--ds-component-input-radius-lg);
    }

    ds-text-input > input {
      box-sizing: border-box;
      display: block;
      inline-size: var(--ds-text-input-inline-size);
      min-inline-size: 0;
      max-inline-size: 100%;
      block-size: var(--ds-text-input-block-size);
      margin: 0;
      border: var(--ds-semantic-border-width-default) solid var(--ds-component-input-color-border-default);
      border-radius: var(--ds-text-input-radius);
      padding: var(--ds-semantic-spacing-xs);
      background: var(--ds-component-input-color-background-default);
      color: var(--ds-semantic-color-foreground-default);
      font-family: var(--ds-primitive-font-family-body);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight);
      line-height: var(--ds-semantic-typography-body-small-line-height);
      outline: 0;
      box-shadow: none;
      cursor: text;
    }

    ds-text-input > input::placeholder {
      color: var(--ds-text-input-placeholder-color);
      opacity: 1;
    }

    @media (hover: hover) {
      ds-text-input > input:not(:disabled):hover {
        background: var(--ds-component-input-color-background-hover);
      }
    }

    ds-text-input > input:not(:disabled):focus-visible {
      border-color: var(--ds-semantic-color-border-focus);
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
        var(--ds-semantic-shadow-xs-offset-y)
        var(--ds-semantic-shadow-xs-blur)
        var(--ds-semantic-shadow-xs-spread)
        var(--ds-semantic-shadow-xs-color),
        var(--ds-semantic-border-focus-primary-offset-x)
        var(--ds-semantic-border-focus-primary-offset-y)
        var(--ds-semantic-border-focus-primary-blur)
        var(--ds-semantic-border-focus-primary-spread)
        var(--ds-semantic-border-focus-primary-color);
    }

    ds-text-input > input:not(:disabled)[aria-invalid="true"] {
      border-color: var(--ds-semantic-color-border-destructive-default);
      background: var(--ds-semantic-color-background-destructive-subtle);
      color: var(--ds-semantic-color-foreground-destructive-elevated);
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
        var(--ds-semantic-shadow-xs-offset-y)
        var(--ds-semantic-shadow-xs-blur)
        var(--ds-semantic-shadow-xs-spread)
        var(--ds-semantic-shadow-xs-color);
    }

    ds-text-input > input:not(:disabled)[aria-invalid="true"]:focus-visible {
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
        var(--ds-semantic-shadow-xs-offset-y)
        var(--ds-semantic-shadow-xs-blur)
        var(--ds-semantic-shadow-xs-spread)
        var(--ds-semantic-shadow-xs-color),
        var(--ds-semantic-border-focus-destructive-offset-x)
        var(--ds-semantic-border-focus-destructive-offset-y)
        var(--ds-semantic-border-focus-destructive-blur)
        var(--ds-semantic-border-focus-destructive-spread)
        var(--ds-semantic-border-focus-destructive-color);
    }

    ds-text-input > input:disabled {
      --ds-text-input-placeholder-color: var(--ds-semantic-color-foreground-disabled-muted);

      border-color: var(--ds-component-input-color-border-disabled);
      background: var(--ds-component-input-color-background-disabled);
      color: var(--ds-semantic-color-foreground-disabled-muted);
      box-shadow: none;
      cursor: not-allowed;
    }

    @media (forced-colors: active) {
      ds-text-input > input {
        border-color: ButtonText;
        background: Field;
        color: FieldText;
      }

      ds-text-input > input:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }

      ds-text-input > input:disabled {
        border-color: GrayText;
        color: GrayText;
      }
    }
  `;
  document.head.append(style);
}

/**
 * Token styles for one consumer-owned native single-line input.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 */
export class TextInput extends HTMLElement {}

if (!customElements.get(tagName)) customElements.define(tagName, TextInput);

const tagName = "ds-number-input";
const styleId = "ds-number-input-styles";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-number-input {
      --ds-number-input-block-size: var(--ds-component-input-height-sm);
      --ds-number-input-inline-size: var(--ds-component-input-width-lg);
      --ds-number-input-radius: var(--ds-component-input-radius-sm);
      --ds-number-input-placeholder-color: var(--ds-semantic-color-foreground-muted-2);

      box-sizing: border-box;
      display: inline-block;
      max-inline-size: 100%;
      vertical-align: middle;
    }

    ds-number-input[size="medium"] {
      --ds-number-input-block-size: var(--ds-component-input-height-md);
      --ds-number-input-radius: var(--ds-component-input-radius-md);
    }

    ds-number-input[size="large"] {
      --ds-number-input-block-size: var(--ds-component-input-height-lg);
      --ds-number-input-radius: var(--ds-component-input-radius-lg);
    }

    ds-number-input > input[type="number"] {
      box-sizing: border-box;
      display: block;
      inline-size: var(--ds-number-input-inline-size);
      min-inline-size: 0;
      max-inline-size: 100%;
      block-size: var(--ds-number-input-block-size);
      margin: 0;
      border: var(--ds-semantic-border-width-default) solid var(--ds-component-input-color-border-default);
      border-radius: var(--ds-number-input-radius);
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

    ds-number-input > input[type="number"]::placeholder {
      color: var(--ds-number-input-placeholder-color);
      opacity: 1;
    }

    @media (hover: hover) {
      ds-number-input > input[type="number"]:not(:disabled):hover {
        background: var(--ds-component-input-color-background-hover);
      }
    }

    ds-number-input > input[type="number"]:not(:disabled):focus-visible {
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

    ds-number-input > input[type="number"]:not(:disabled)[aria-invalid="true"] {
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

    ds-number-input > input[type="number"]:not(:disabled)[aria-invalid="true"]:focus-visible {
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

    ds-number-input > input[type="number"]:disabled {
      --ds-number-input-placeholder-color: var(--ds-semantic-color-foreground-disabled-muted);

      border-color: var(--ds-component-input-color-border-disabled);
      background: var(--ds-component-input-color-background-disabled);
      color: var(--ds-semantic-color-foreground-disabled-muted);
      box-shadow: none;
      cursor: not-allowed;
    }

    @media (forced-colors: active) {
      ds-number-input > input[type="number"] {
        border-color: ButtonText;
        background: Field;
        color: FieldText;
      }

      ds-number-input > input[type="number"]:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }

      ds-number-input > input[type="number"]:disabled {
        border-color: GrayText;
        color: GrayText;
      }
    }
  `;
  document.head.append(style);
}

/**
 * Token styles for one consumer-owned native number input.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, browser-owned stepping, and form participation.
 */
export class NumberInput extends HTMLElement {}

if (!customElements.get(tagName)) customElements.define(tagName, NumberInput);

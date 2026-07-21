const tagName = "ds-textarea";
const styleId = "ds-textarea-styles";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-textarea {
      --ds-textarea-inline-size: var(--ds-component-input-width-lg);
      --ds-textarea-min-block-size: var(--ds-component-textarea-min-height-md);
      --ds-textarea-radius: var(--ds-component-input-radius-md);
      --ds-textarea-placeholder-color: var(--ds-semantic-color-foreground-muted-2);

      box-sizing: border-box;
      display: inline-block;
      max-inline-size: 100%;
      vertical-align: middle;
    }

    ds-textarea > textarea {
      box-sizing: border-box;
      display: block;
      inline-size: var(--ds-textarea-inline-size);
      min-inline-size: 0;
      max-inline-size: 100%;
      min-block-size: var(--ds-textarea-min-block-size);
      margin: 0;
      border: var(--ds-semantic-border-width-default) solid var(--ds-component-input-color-border-default);
      border-radius: var(--ds-textarea-radius);
      padding: var(--ds-semantic-spacing-xs) var(--ds-semantic-spacing-sm);
      background: var(--ds-component-input-color-background-default);
      color: var(--ds-semantic-color-foreground-default);
      font-family: var(--ds-primitive-font-family-body);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-regular);
      line-height: var(--ds-semantic-typography-body-small-line-height);
      outline: 0;
      box-shadow: none;
      cursor: text;
    }

    ds-textarea > textarea::placeholder {
      color: var(--ds-textarea-placeholder-color);
      opacity: 1;
    }

    @media (hover: hover) {
      ds-textarea > textarea:not(:disabled):hover {
        background: var(--ds-component-input-color-background-hover);
      }
    }

    ds-textarea > textarea:not(:disabled):focus-visible {
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

    ds-textarea > textarea:not(:disabled)[aria-invalid="true"] {
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

    ds-textarea > textarea:not(:disabled)[aria-invalid="true"]:focus-visible {
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

    ds-textarea > textarea:disabled {
      --ds-textarea-placeholder-color: var(--ds-semantic-color-foreground-disabled-elevated);

      border-color: var(--ds-component-input-color-border-disabled);
      background: var(--ds-component-input-color-background-disabled);
      color: var(--ds-semantic-color-foreground-disabled-elevated);
      box-shadow: none;
      cursor: not-allowed;
    }

    @media (forced-colors: active) {
      ds-textarea > textarea {
        border-color: ButtonText;
        background: Field;
        color: FieldText;
      }

      ds-textarea > textarea:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }

      ds-textarea > textarea:disabled {
        border-color: GrayText;
        color: GrayText;
      }
    }
  `;
  document.head.append(style);
}

/**
 * Token styles for one consumer-owned native multi-line textarea.
 *
 * The native textarea retains its standard attributes, properties, events,
 * focus API, resize behaviour, constraint validation, and form participation.
 */
export class Textarea extends HTMLElement {}

if (!customElements.get(tagName)) customElements.define(tagName, Textarea);

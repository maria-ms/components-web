const tagName = "ds-radio";
const styleId = "ds-radio-styles";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-radio {
      --ds-radio-size: var(--ds-component-checkbox-size-sm);

      box-sizing: border-box;
      display: inline-block;
      inline-size: var(--ds-radio-size);
      block-size: var(--ds-radio-size);
      flex: 0 0 auto;
      vertical-align: middle;
    }

    ds-radio[size="medium"] {
      --ds-radio-size: var(--ds-component-checkbox-size-md);
    }

    ds-radio[size="large"] {
      --ds-radio-size: var(--ds-component-checkbox-size-lg);
    }

    ds-radio > input[type="radio"] {
      box-sizing: border-box;
      display: block;
      inline-size: 100%;
      block-size: 100%;
      margin: 0;
      border: var(--ds-semantic-border-width-default) solid var(--ds-component-checkbox-color-border-default);
      border-radius: 50%;
      appearance: none;
      -webkit-appearance: none;
      background: var(--ds-semantic-color-surface-default);
      box-shadow: none;
      cursor: pointer;
      outline: 0;
    }

    ds-radio > input[type="radio"]:checked {
      border-color: var(--ds-component-checkbox-color-border-focus);
      border-width: var(--ds-semantic-border-width-heavy);
    }

    @media (hover: hover) {
      ds-radio > input[type="radio"]:not(:disabled):not(:checked):hover {
        border-color: var(--ds-component-checkbox-color-border-focus);
      }
    }

    ds-radio > input[type="radio"]:not(:disabled):focus-visible {
      box-shadow:
        var(--ds-semantic-border-focus-primary-offset-x)
        var(--ds-semantic-border-focus-primary-offset-y)
        var(--ds-semantic-border-focus-primary-blur)
        var(--ds-semantic-border-focus-primary-spread)
        var(--ds-semantic-border-focus-primary-color);
    }

    ds-radio > input[type="radio"]:not(:disabled):not(:checked):focus-visible {
      border-color: var(--ds-component-checkbox-color-border-focus);
    }

    ds-radio > input[type="radio"]:disabled {
      border-color: var(--ds-component-checkbox-color-border-disabled);
      background: var(--ds-component-checkbox-color-background-disabled);
      box-shadow: none;
      cursor: not-allowed;
    }

    @media (forced-colors: active) {
      ds-radio > input[type="radio"] {
        appearance: auto;
        -webkit-appearance: auto;
        accent-color: auto;
        border: 0;
        background: Field;
      }

      ds-radio > input[type="radio"]:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
    }
  `;
  document.head.append(style);
}

/**
 * Token styles for one consumer-owned native radio input.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 * Grouping is native: radios sharing a name are mutually exclusive.
 */
export class Radio extends HTMLElement {}

if (!customElements.get(tagName)) customElements.define(tagName, Radio);

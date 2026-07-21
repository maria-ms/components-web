const tagName = "ds-select";
const styleId = "ds-select-styles";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-select {
      --ds-select-block-size: var(--ds-component-input-height-sm);
      --ds-select-inline-size: var(--ds-component-input-width-lg);
      --ds-select-radius: var(--ds-component-input-radius-sm);
      --ds-select-focus-border-color: var(--ds-semantic-color-border-focus);

      box-sizing: border-box;
      display: inline-block;
      max-inline-size: 100%;
      vertical-align: middle;
    }

    ds-select[size="medium"] {
      --ds-select-block-size: var(--ds-component-input-height-md);
      --ds-select-radius: var(--ds-component-input-radius-md);
    }

    ds-select[size="large"] {
      --ds-select-block-size: var(--ds-component-input-height-lg);
      --ds-select-radius: var(--ds-component-input-radius-lg);
    }

    ds-select > select {
      box-sizing: border-box;
      inline-size: var(--ds-select-inline-size);
      min-inline-size: 0;
      max-inline-size: 100%;
      block-size: var(--ds-select-block-size);
      margin: 0;
      border: var(--ds-semantic-border-width-default) solid var(--ds-component-input-color-border-default);
      border-radius: var(--ds-select-radius);
      padding: var(--ds-semantic-spacing-xs);
      background: var(--ds-component-input-color-background-default);
      color: var(--ds-semantic-color-foreground-default);
      font-family: var(--ds-primitive-font-family-body);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight);
      line-height: var(--ds-semantic-typography-body-small-line-height);
      outline: 0;
      box-shadow: none;
      cursor: pointer;
    }

    @media (hover: hover) {
      ds-select > select:not(:disabled):hover {
        background: var(--ds-component-input-color-background-hover);
      }
    }

    ds-select > select:not(:disabled):focus-visible {
      border-color: var(--ds-select-focus-border-color);
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

    ds-select > select:not(:disabled)[aria-invalid="true"] {
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

    ds-select > select:not(:disabled)[aria-invalid="true"]:focus-visible {
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

    ds-select > select:disabled {
      border-color: var(--ds-component-input-color-border-disabled);
      background: var(--ds-component-input-color-background-disabled);
      color: var(--ds-semantic-color-foreground-disabled-muted);
      box-shadow: none;
      cursor: not-allowed;
    }

    /*
     * The native customizable-select model keeps <select>, <option>, and
     * keyboard/form behaviour intact. The optional first-child button and
     * selectedcontent are browser-owned select parts, not ds-button content.
     */
    @supports (appearance: base-select) {
      ds-select > select,
      ds-select > select::picker(select) {
        appearance: base-select;
      }

      ds-select > select > button {
        align-items: center;
        appearance: none;
        border: 0;
        background: transparent;
        box-sizing: border-box;
        color: inherit;
        display: flex;
        flex: 1 1 auto;
        font: inherit;
        min-inline-size: 0;
        min-block-size: 0;
        overflow: hidden;
        padding: 0;
        text-align: start;
      }

      ds-select > select > button > selectedcontent {
        min-inline-size: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      ds-select > select::picker-icon {
        color: var(--ds-semantic-color-foreground-muted-1);
        display: flex;
        align-items: center;
        transition: rotate 160ms ease;
      }

      ds-select > select:open::picker-icon {
        rotate: 180deg;
      }

      ds-select > select::picker(select) {
        box-sizing: border-box;
        inline-size: var(--ds-select-inline-size);
        min-inline-size: 0;
        max-inline-size: 100%;
        margin-block-start: var(--ds-semantic-spacing-xs);
        border: var(--ds-semantic-border-width-default) solid var(--ds-component-input-color-border-default);
        border-radius: var(--ds-select-radius);
        padding: 0;
        background: var(--ds-component-input-color-background-default);
        box-shadow:
          var(--ds-semantic-shadow-xs-offset-x)
          var(--ds-semantic-shadow-xs-offset-y)
          var(--ds-semantic-shadow-xs-blur)
          var(--ds-semantic-shadow-xs-spread)
          var(--ds-semantic-shadow-xs-color);
      }

      ds-select > select option {
        align-items: center;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        block-size: var(--ds-select-block-size);
        min-block-size: 0;
        padding-block: 0;
        padding-inline: var(--ds-semantic-spacing-xs);
        background: var(--ds-component-input-color-background-default);
        color: var(--ds-semantic-color-foreground-default);
        font: inherit;
      }

      /*
       * Figma renders dividers over the row boundary, rather than inside an
       * option. Use an inset shadow for the same no-layout-shift result. The
       * hidden placeholder must not create a line above the first visible
       * choice.
       */
      ds-select > select option:not([value=""]) + option {
        box-shadow: inset 0 var(--ds-semantic-border-width-default) 0 var(--ds-component-input-color-border-default);
      }

      /*
       * The outer picker and the first/last option share a radius. When a
       * disabled placeholder is hidden after selection, the next real option
       * becomes the visual first row.
       */
      ds-select > select option:first-of-type,
      ds-select > select option[disabled][value=""]:not(:checked) + option {
        border-start-start-radius: var(--ds-select-radius);
        border-start-end-radius: var(--ds-select-radius);
      }

      ds-select > select option:last-of-type {
        border-end-start-radius: var(--ds-select-radius);
        border-end-end-radius: var(--ds-select-radius);
      }

      ds-select > select option::checkmark {
        content: none;
      }

      ds-select > select option[disabled][value=""]:not(:checked) {
        display: none;
      }

      ds-select > select option:checked {
        background: var(--ds-component-input-color-background-hover);
      }

      /* Keyboard focus intentionally uses the same background as hover. */
      ds-select > select option:not(:disabled):focus {
        outline: 0;
        background: var(--ds-component-input-color-background-hover);
      }

      @media (hover: hover) {
        ds-select > select option:not(:disabled):hover {
          background: var(--ds-component-input-color-background-hover);
        }
      }

      ds-select > select option:disabled {
        background: var(--ds-component-input-color-background-disabled);
        color: var(--ds-semantic-color-foreground-disabled-muted);
      }

      ds-select > select option:checked:disabled {
        background: var(--ds-component-input-color-background-default);
        color: var(--ds-semantic-color-foreground-muted-2);
      }
    }

    @media (forced-colors: active) {
      ds-select > select {
        border-color: ButtonText;
        background: Field;
        color: FieldText;
      }

      ds-select > select:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        box-shadow: none;
      }

      ds-select > select:disabled {
        border-color: GrayText;
        color: GrayText;
      }
    }
  `;
  document.head.append(style);
}

/**
 * Token styles for one consumer-owned native single-select.
 *
 * The native select retains its standard attributes, properties, events,
 * focus API, constraint validation, accessible-name path, and form behaviour.
 */
export class Select extends HTMLElement {}

if (!customElements.get(tagName)) customElements.define(tagName, Select);

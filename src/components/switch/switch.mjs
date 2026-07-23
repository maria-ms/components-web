const tagName = "ds-switch";
const styleId = "ds-switch-styles";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-switch {
      --ds-switch-track-inline-size: var(--ds-component-switch-width-sm);
      --ds-switch-track-block-size: var(--ds-component-switch-height-sm);
      --ds-switch-thumb-inset: 2px;
      --ds-switch-thumb-size: calc(var(--ds-switch-track-block-size) - 4px);
      --ds-switch-thumb-travel: calc(
        var(--ds-switch-track-inline-size) - var(--ds-switch-thumb-size) - 4px
      );
      --ds-switch-focus-width: 1.5px;
      --ds-switch-focus-offset: 3.5px;

      position: relative;
      box-sizing: border-box;
      display: inline-block;
      inline-size: var(--ds-switch-track-inline-size);
      block-size: var(--ds-switch-track-block-size);
      flex: 0 0 auto;
      isolation: isolate;
      vertical-align: middle;
    }

    ds-switch[size="medium"] {
      --ds-switch-track-inline-size: var(--ds-component-switch-width-md);
      --ds-switch-track-block-size: var(--ds-component-switch-height-md);
    }

    ds-switch[size="large"] {
      --ds-switch-track-inline-size: var(--ds-component-switch-width-lg);
      --ds-switch-track-block-size: var(--ds-component-switch-height-lg);
    }

    ds-switch::before,
    ds-switch::after {
      position: absolute;
      pointer-events: none;
      content: "";
    }

    ds-switch::before {
      z-index: 0;
      inset: 0;
      box-sizing: border-box;
      border: var(--ds-semantic-border-width-default) solid var(--ds-semantic-color-border-default);
      border-radius: var(--ds-semantic-radius-full);
      background: var(--ds-semantic-color-background-default);
      transition:
        background-color 160ms cubic-bezier(0.2, 0, 0, 1),
        border-color 160ms cubic-bezier(0.2, 0, 0, 1);
    }

    ds-switch::after {
      z-index: 2;
      inset-block-start: var(--ds-switch-thumb-inset);
      inset-inline-start: var(--ds-switch-thumb-inset);
      box-sizing: border-box;
      inline-size: var(--ds-switch-thumb-size);
      block-size: var(--ds-switch-thumb-size);
      border-radius: var(--ds-semantic-radius-full);
      background: var(--ds-semantic-color-background-primary-default);
      transform: translateX(0);
      transition:
        transform 160ms cubic-bezier(0.2, 0, 0, 1),
        background-color 160ms cubic-bezier(0.2, 0, 0, 1);
    }

    ds-switch > input[type="checkbox"] {
      position: absolute;
      z-index: 1;
      inset: 0;
      box-sizing: border-box;
      inline-size: 100%;
      block-size: 100%;
      margin: 0;
      cursor: pointer;
      opacity: 0;
    }

    ds-switch:has(> input[type="checkbox"]:checked)::before {
      border-color: var(--ds-semantic-color-background-primary-default);
      background: var(--ds-semantic-color-background-primary-default);
    }

    ds-switch:has(> input[type="checkbox"]:checked)::after {
      background: var(--ds-semantic-color-foreground-inverted);
      transform: translateX(var(--ds-switch-thumb-travel));
    }

    ds-switch:dir(rtl):has(> input[type="checkbox"]:checked)::after {
      transform: translateX(calc(0px - var(--ds-switch-thumb-travel)));
    }

    @media (hover: hover) {
      ds-switch:has(> input[type="checkbox"]:not(:disabled):not(:checked):hover)::before {
        border-color: var(--ds-semantic-color-border-primary);
        background: var(--ds-semantic-color-background-primary-subtle);
      }

      ds-switch:has(> input[type="checkbox"]:not(:disabled):checked:hover)::before {
        border-color: var(--ds-semantic-color-border-primary);
        background: var(--ds-semantic-color-background-primary-elevated);
      }
    }

    ds-switch:has(> input[type="checkbox"]:not(:disabled):focus-visible)::before {
      outline: var(--ds-switch-focus-width) solid var(--ds-semantic-color-border-focus);
      outline-offset: var(--ds-switch-focus-offset);
    }

    ds-switch:has(> input[type="checkbox"]:not(:disabled):not(:checked):focus-visible)::before {
      border-color: var(--ds-semantic-color-border-focus);
      background: var(--ds-semantic-color-background-default);
    }

    ds-switch:has(> input[type="checkbox"]:not(:disabled):checked:focus-visible)::before {
      border-color: var(--ds-semantic-color-background-primary-default);
      background: var(--ds-semantic-color-background-primary-default);
    }

    ds-switch:has(> input[type="checkbox"]:disabled) {
      cursor: not-allowed;
    }

    ds-switch:has(> input[type="checkbox"]:disabled)::before {
      border-color: var(--ds-semantic-color-border-muted);
      background: var(--ds-semantic-color-background-default);
      outline: 0;
    }

    ds-switch:has(> input[type="checkbox"]:disabled:not(:checked))::after {
      background: var(--ds-semantic-color-foreground-disabled-muted);
    }

    ds-switch > input[type="checkbox"]:disabled {
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      ds-switch::before,
      ds-switch::after {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      ds-switch::before,
      ds-switch::after {
        display: none;
      }

      ds-switch > input[type="checkbox"] {
        appearance: auto;
        -webkit-appearance: auto;
        accent-color: auto;
        border: 0;
        background: Field;
        opacity: 1;
      }

      ds-switch > input[type="checkbox"]:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
    }
  `;
  document.head.append(style);
}

/**
 * Token styles for one consumer-owned native checkbox used as an on/off switch.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 * Add the native `switch` attribute to the input: supporting browsers expose
 * switch semantics, while unsupported browsers retain checkbox semantics.
 */
export class Switch extends HTMLElement {}

if (!customElements.get(tagName)) customElements.define(tagName, Switch);

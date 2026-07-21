const tagName = "ds-checkbox";
const styleId = "ds-checkbox-styles";
const indicatorClass = "ds-checkbox__indicator";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-checkbox {
      --ds-checkbox-size: var(--ds-component-checkbox-size-sm);
      --ds-checkbox-radius: var(--ds-semantic-radius-sm);
      --ds-checkbox-icon-color: var(--ds-component-checkbox-color-foreground-default);

      position: relative;
      box-sizing: border-box;
      display: inline-block;
      inline-size: var(--ds-checkbox-size);
      block-size: var(--ds-checkbox-size);
      flex: 0 0 auto;
      vertical-align: middle;
    }

    ds-checkbox[size="medium"] {
      --ds-checkbox-size: var(--ds-component-checkbox-size-md);
      --ds-checkbox-radius: var(--ds-semantic-radius-base);
    }

    ds-checkbox[size="large"] {
      --ds-checkbox-size: var(--ds-component-checkbox-size-lg);
      --ds-checkbox-radius: var(--ds-semantic-radius-md);
    }

    ds-checkbox > input[type="checkbox"] {
      box-sizing: border-box;
      display: block;
      inline-size: 100%;
      block-size: 100%;
      margin: 0;
      border: var(--ds-semantic-border-width-default) solid var(--ds-component-checkbox-color-border-default);
      border-radius: var(--ds-checkbox-radius);
      appearance: none;
      -webkit-appearance: none;
      background: var(--ds-semantic-color-surface-default);
      box-shadow: none;
      cursor: pointer;
      outline: 0;
    }

    ds-checkbox > .${indicatorClass} {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: var(--ds-checkbox-icon-color);
      pointer-events: none;
    }

    ds-checkbox > .${indicatorClass} svg {
      display: none;
      overflow: visible;
    }

    ds-checkbox > .${indicatorClass} path {
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.5;
    }

    ds-checkbox > .${indicatorClass} .ds-checkbox__check {
      inline-size: 53.3333%;
      block-size: 36.6667%;
    }

    ds-checkbox > .${indicatorClass} .ds-checkbox__indeterminate {
      inline-size: 46.6667%;
      block-size: 7.5%;
    }

    ds-checkbox:has(> input[type="checkbox"]:checked) > input[type="checkbox"],
    ds-checkbox:has(> input[type="checkbox"]:indeterminate) > input[type="checkbox"] {
      border-color: transparent;
      background: var(--ds-component-checkbox-color-background-default);
    }

    ds-checkbox:has(> input[type="checkbox"]:checked:not(:indeterminate))
      > .${indicatorClass}
      .ds-checkbox__check {
      display: block;
    }

    ds-checkbox:has(> input[type="checkbox"]:indeterminate)
      > .${indicatorClass}
      .ds-checkbox__indeterminate {
      display: block;
    }

    @media (hover: hover) {
      ds-checkbox:has(> input[type="checkbox"]:not(:disabled):not(:checked):not(:indeterminate):hover)
        > input[type="checkbox"] {
        border-color: var(--ds-component-checkbox-color-border-focus);
      }
    }

    ds-checkbox:has(> input[type="checkbox"]:not(:disabled)[aria-invalid="true"])
      > input[type="checkbox"] {
      border-color: var(--ds-component-checkbox-color-border-destructive);
    }

    ds-checkbox:has(> input[type="checkbox"]:not(:disabled):focus-visible)
      > input[type="checkbox"] {
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
        var(--ds-semantic-shadow-xs-offset-y)
        var(--ds-semantic-shadow-xs-blur)
        var(--ds-semantic-shadow-xs-spread)
        var(--ds-semantic-shadow-xs-color),
        var(--ds-semantic-border-focus-primary-thin-offset-x)
        var(--ds-semantic-border-focus-primary-thin-offset-y)
        var(--ds-semantic-border-focus-primary-thin-blur)
        var(--ds-semantic-border-focus-primary-thin-spread)
        var(--ds-semantic-border-focus-primary-thin-color);
    }

    ds-checkbox:has(> input[type="checkbox"]:not(:disabled):not(:checked):not(:indeterminate):focus-visible)
      > input[type="checkbox"] {
      border-color: var(--ds-component-checkbox-color-border-focus);
    }

    ds-checkbox:has(> input[type="checkbox"]:not(:disabled)[aria-invalid="true"]:focus-visible)
      > input[type="checkbox"] {
      border-color: var(--ds-component-checkbox-color-border-destructive);
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
        var(--ds-semantic-shadow-xs-offset-y)
        var(--ds-semantic-shadow-xs-blur)
        var(--ds-semantic-shadow-xs-spread)
        var(--ds-semantic-shadow-xs-color),
        var(--ds-semantic-border-focus-destructive-thin-offset-x)
        var(--ds-semantic-border-focus-destructive-thin-offset-y)
        var(--ds-semantic-border-focus-destructive-thin-blur)
        var(--ds-semantic-border-focus-destructive-thin-spread)
        var(--ds-semantic-border-focus-destructive-thin-color);
    }

    ds-checkbox:has(> input[type="checkbox"]:disabled) {
      --ds-checkbox-icon-color: var(--ds-component-checkbox-color-foreground-disabled);
    }

    ds-checkbox:has(> input[type="checkbox"]:disabled) > input[type="checkbox"] {
      border-color: var(--ds-component-checkbox-color-border-disabled);
      background: var(--ds-component-checkbox-color-background-disabled);
      box-shadow: none;
      cursor: not-allowed;
    }

    @media (forced-colors: active) {
      ds-checkbox > input[type="checkbox"] {
        appearance: auto;
        -webkit-appearance: auto;
        accent-color: auto;
        border: 0;
        background: Field;
      }

      ds-checkbox > .${indicatorClass} {
        display: none;
      }

      ds-checkbox:has(> input[type="checkbox"]:focus-visible) > input[type="checkbox"] {
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
    }
  `;
  document.head.append(style);
}

const createIndicator = () => {
  const indicator = document.createElement("span");

  indicator.className = indicatorClass;
  indicator.setAttribute("aria-hidden", "true");
  indicator.innerHTML = `
    <svg class="ds-checkbox__check" viewBox="0 0 10.666666984558105 7.333333492279052" focusable="false">
      <path d="M 10.666666984558105 0 L 3.333333432674408 7.333333492279052 L 0 4.000000086697665"></path>
    </svg>
    <svg class="ds-checkbox__indeterminate" viewBox="0 -0.75 9.333333015441895 1.5" focusable="false">
      <path d="M 0 0 L 9.333333015441895 0"></path>
    </svg>
  `;

  return indicator;
};

/**
 * Token styles for one consumer-owned native checkbox.
 *
 * The native input retains its standard attributes, properties, events, focus
 * API, constraint validation, accessible-name path, and form participation.
 * `indeterminate` remains the native input property; it is not an attribute.
 */
export class Checkbox extends HTMLElement {
  constructor() {
    super();
    this.append(createIndicator());
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Checkbox);

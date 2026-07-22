const tagName = "ds-link";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --ds-link-color: var(--ds-semantic-color-foreground-primary-elevated);
      --ds-link-font-size: var(--ds-semantic-typography-body-x-small-font-size);
      --ds-link-font-weight: var(--ds-semantic-typography-body-x-small-font-weight-medium);
      --ds-link-line-height: var(--ds-semantic-typography-body-x-small-line-height);
      --ds-link-letter-spacing: normal;

      box-sizing: border-box;
      display: inline-block;
      max-inline-size: 100%;
      vertical-align: middle;
    }

    :host([size="small"]) {
      --ds-link-font-size: var(--ds-semantic-typography-body-small-font-size);
      --ds-link-font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      --ds-link-line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    :host([size="medium"]) {
      --ds-link-font-size: var(--ds-semantic-typography-body-small-font-size);
      --ds-link-font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      --ds-link-line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    :host([size="large"]) {
      --ds-link-font-size: var(--ds-semantic-typography-body-base-font-size);
      --ds-link-font-weight: var(--ds-semantic-typography-body-base-font-weight-medium);
      --ds-link-line-height: var(--ds-semantic-typography-body-base-line-height);
    }

    :host([tone="muted"]) {
      --ds-link-color: var(--ds-semantic-color-foreground-muted-1);
    }

    slot {
      display: contents;
    }

    ::slotted(a) {
      box-sizing: border-box;
      display: inline-flex;
      max-inline-size: 100%;
      align-items: center;
      border: var(--ds-semantic-border-width-default) solid transparent;
      border-radius: var(--ds-semantic-radius-sm);
      padding: var(--ds-semantic-spacing-xs) 6px;
      color: var(--ds-link-color);
      font-family: var(--ds-primitive-font-family-body);
      font-size: var(--ds-link-font-size);
      font-weight: var(--ds-link-font-weight);
      letter-spacing: var(--ds-link-letter-spacing);
      line-height: var(--ds-link-line-height);
      text-decoration: none;
      text-decoration-thickness: from-font;
      text-underline-offset: auto;
      text-decoration-skip-ink: none;
      white-space: nowrap;
      cursor: pointer;
    }

    @media (hover: hover) {
      ::slotted(a[href]:hover) {
        text-decoration-line: underline;
      }
    }

    ::slotted(a[href]:focus-visible) {
      outline: 0;
      border-color: var(--ds-semantic-color-border-primary);
      text-decoration-line: underline;
    }

    @media (forced-colors: active) {
      ::slotted(a) {
        color: LinkText;
      }

      ::slotted(a[href]:focus-visible) {
        outline: 2px solid Highlight;
        outline-offset: 2px;
        border-color: Highlight;
      }
    }
  </style>
  <slot></slot>
`;

/**
 * Token styles for one consumer-owned native anchor.
 *
 * The anchor retains its complete HTML contract: href, target, rel, download,
 * events, focus, keyboard activation, accessible name, and child content.
 */
export class Link extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Link);

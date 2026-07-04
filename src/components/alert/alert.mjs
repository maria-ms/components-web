const tagName = "ds-alert";

const observedAttributes = ["size", "tone"];

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      --alert-width: 976px;
      --alert-direction: row;
      --alert-align-items: center;
      --alert-justify-content: flex-start;
      --alert-gap: var(--ds-primitive-space-04);
      --alert-icon-size: 24px;
      --alert-text-align: left;
      --alert-title-font-size: var(--ds-semantic-typography-body-base-font-size);
      --alert-title-font-weight: var(--ds-semantic-typography-body-base-font-weight-medium);
      --alert-title-line-height: var(--ds-semantic-typography-body-base-line-height);
      --alert-icon-color: var(--ds-semantic-color-foreground-success-elevated);

      box-sizing: border-box;
      display: inline-flex;
      width: var(--alert-width);
      max-width: 100%;
      color: var(--ds-semantic-color-foreground-default);
      font-family: inherit;
      vertical-align: middle;
    }

    :host([size="medium"]) {
      --alert-width: 560px;
    }

    :host([size="small"]) {
      --alert-width: 343px;
      --alert-direction: column;
      --alert-align-items: center;
      --alert-justify-content: center;
      --alert-gap: var(--ds-primitive-space-03);
      --alert-icon-size: 24px;
      --alert-text-align: center;
      --alert-title-font-size: var(--ds-semantic-typography-body-small-font-size);
      --alert-title-font-weight: var(--ds-semantic-typography-body-small-font-weight-medium);
      --alert-title-line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    :host([size="small"][tone="success"]),
    :host([size="small"][tone="info"]) {
      --alert-icon-size: 20px;
    }

    :host([tone="info"]) {
      --alert-icon-color: var(--ds-semantic-color-foreground-primary-elevated);
    }

    :host([tone="warning"]) {
      --alert-icon-color: var(--ds-semantic-color-foreground-warning-elevated);
    }

    :host([tone="error"]) {
      --alert-icon-color: var(--ds-semantic-color-foreground-destructive-elevated);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .root {
      display: flex;
      width: 100%;
      flex-direction: var(--alert-direction);
      align-items: var(--alert-align-items);
      justify-content: var(--alert-justify-content);
      gap: var(--alert-gap);
      overflow: hidden;
      border: 1px solid var(--ds-semantic-color-border-default);
      border-radius: var(--ds-primitive-radius-05);
      padding: var(--ds-primitive-space-04) var(--ds-primitive-space-05);
      background: var(--ds-component-card-color-background-default);
      box-shadow:
        var(--ds-semantic-shadow-xs-offset-x)
          var(--ds-semantic-shadow-xs-offset-y)
          var(--ds-semantic-shadow-xs-blur)
          var(--ds-semantic-shadow-xs-spread)
          var(--ds-semantic-shadow-xs-color);
    }

    .icon {
      display: inline-flex;
      width: var(--alert-icon-size);
      height: var(--alert-icon-size);
      flex: 0 0 auto;
      color: var(--alert-icon-color);
    }

    .icon svg {
      display: block;
      width: 100%;
      height: 100%;
      stroke: currentColor;
    }

    .content {
      display: flex;
      min-width: 0;
      flex: 1 1 auto;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: var(--ds-primitive-space-02);
      text-align: var(--alert-text-align);
      word-break: break-word;
    }

    :host([size="small"]) .content {
      width: 100%;
      flex: 0 0 auto;
      align-items: center;
    }

    .title,
    .description {
      width: 100%;
      margin: 0;
      font-family: inherit;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    .title {
      color: var(--ds-semantic-color-foreground-default);
      font-size: var(--alert-title-font-size);
      font-weight: var(--alert-title-font-weight);
      line-height: var(--alert-title-line-height);
    }

    .description {
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-semantic-typography-body-small-font-size);
      font-weight: var(--ds-semantic-typography-body-small-font-weight-root);
      line-height: var(--ds-semantic-typography-body-small-line-height);
    }

    :host(:not([size="small"])) .title,
    :host(:not([size="small"])) .description {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title[hidden],
    .description[hidden],
    .action[hidden] {
      display: none;
    }

    .action {
      display: inline-flex;
      max-width: 100%;
      flex: 0 0 auto;
    }

    :host([size="small"]) .action {
      width: 100%;
    }

    slot[name="action"]::slotted(*) {
      max-width: 100%;
    }

    :host([size="small"]) slot[name="action"]::slotted(*) {
      width: 100%;
    }

    slot[name="title"]::slotted(*),
    slot[name="description"]::slotted(*) {
      color: inherit;
      font: inherit;
      font-kerning: none;
      font-variant-ligatures: none;
    }
  </style>

  <div part="root" class="root">
    <span part="icon" class="icon" aria-hidden="true"></span>
    <div part="content" class="content">
      <p part="title" class="title"><slot name="title"></slot></p>
      <p part="description" class="description"><slot name="description"></slot></p>
    </div>
    <div part="action" class="action"><slot name="action"></slot></div>
  </div>
`;

const icons = {
  error: {
    default:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  info: {
    default:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    small:
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10.0001 13.3333V10M10.0001 6.66667H10.0084M18.3334 10C18.3334 14.6024 14.6025 18.3333 10.0001 18.3333C5.39771 18.3333 1.66675 14.6024 1.66675 10C1.66675 5.39763 5.39771 1.66667 10.0001 1.66667C14.6025 1.66667 18.3334 5.39763 18.3334 10Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  success: {
    default:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    small:
      '<svg viewBox="0 0 20 20" fill="none"><path d="M7.50008 10L9.16675 11.6667L12.5001 8.33334M18.3334 10C18.3334 14.6024 14.6025 18.3333 10.0001 18.3333C5.39771 18.3333 1.66675 14.6024 1.66675 10C1.66675 5.39763 5.39771 1.66667 10.0001 1.66667C14.6025 1.66667 18.3334 5.39763 18.3334 10Z" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  warning: {
    default:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
};

const instances = new WeakMap();

const hasAssignedContent = (slot) =>
  slot
    .assignedNodes({ flatten: true })
    .some((node) =>
      node.nodeType === Node.TEXT_NODE ? node.textContent.trim() : true,
    );

const alertTone = (host) => {
  const tone = host.getAttribute("tone");

  return ["error", "info", "success", "warning"].includes(tone) ? tone : "success";
};

const iconMarkup = (host) => {
  const icon = icons[alertTone(host)];

  return host.getAttribute("size") === "small" && icon.small
    ? icon.small
    : icon.default;
};

const syncIcon = (host) => {
  const state = instances.get(host);

  state.icon.innerHTML = iconMarkup(host);
};

const syncRole = (host) => {
  const state = instances.get(host);
  const role = ["error", "warning"].includes(alertTone(host)) ? "alert" : "status";

  if (!host.hasAttribute("role") || host.getAttribute("role") === state.defaultRole) {
    host.setAttribute("role", role);
    state.defaultRole = role;
  }
};

const syncSlots = (host) => {
  const state = instances.get(host);

  state.title.hidden = !hasAssignedContent(state.titleSlot);
  state.description.hidden = !hasAssignedContent(state.descriptionSlot);
  state.action.hidden = !hasAssignedContent(state.actionSlot);
};

const sync = (host) => {
  if (!instances.has(host)) return;
  syncIcon(host);
  syncRole(host);
};

const mount = (host) => {
  const shadow = host.attachShadow({ mode: "open" });

  shadow.append(template.content.cloneNode(true));
  instances.set(host, {
    action: shadow.querySelector(".action"),
    actionSlot: shadow.querySelector("slot[name='action']"),
    defaultRole: "",
    description: shadow.querySelector(".description"),
    descriptionSlot: shadow.querySelector("slot[name='description']"),
    icon: shadow.querySelector(".icon"),
    onSlotChange: () => syncSlots(host),
    title: shadow.querySelector(".title"),
    titleSlot: shadow.querySelector("slot[name='title']"),
  });
};

/**
 * Token-driven alert message with intrinsic status icon and composable action slot.
 *
 * @tag ds-alert
 * @attr {"success"|"info"|"warning"|"error"} tone - Alert status intent.
 * @attr {"large"|"medium"|"small"} size - Alert size and layout.
 * @slot title - Alert title.
 * @slot description - Supporting alert message.
 * @slot action - Alert action, commonly a ds-button.
 * @part root - Alert surface.
 * @part icon - Status icon wrapper.
 * @part content - Text content wrapper.
 * @part title - Title text.
 * @part description - Description text.
 * @part action - Action wrapper.
 */
export class Alert extends HTMLElement {
  static observedAttributes = observedAttributes;

  constructor() {
    super();
    mount(this);
  }

  connectedCallback() {
    const state = instances.get(this);

    [
      state.actionSlot,
      state.descriptionSlot,
      state.titleSlot,
    ].forEach((slot) => slot.addEventListener("slotchange", state.onSlotChange));
    sync(this);
    syncSlots(this);
  }

  disconnectedCallback() {
    const state = instances.get(this);

    [
      state.actionSlot,
      state.descriptionSlot,
      state.titleSlot,
    ].forEach((slot) => slot.removeEventListener("slotchange", state.onSlotChange));
  }

  attributeChangedCallback() {
    sync(this);
  }
}

export { Alert as DsAlert };

if (!customElements.get(tagName)) customElements.define(tagName, Alert);

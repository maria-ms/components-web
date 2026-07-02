const chevronPaths = {
  down: "M4 6L8 10L12 6",
  up: "M4 10L8 6L12 10",
};

const tags = {
  dropdown: "drop-down",
  group: "drop-down-group",
  header: "drop-down-header",
  item: "drop-down-item",
  separator: "drop-down-separator",
};

const templates = {
  dropdown: document.createElement("template"),
  group: document.createElement("template"),
  header: document.createElement("template"),
  item: document.createElement("template"),
  itemAction: document.createElement("template"),
  separator: document.createElement("template"),
};

templates.dropdown.innerHTML = `
  <style>
    :host {
      --dropdown-menu-offset: var(--ds-primitive-space-03);
      --dropdown-menu-width: 240px;
      --dropdown-trigger-background: var(
        --ds-component-button-color-background-tertiary
      );
      --dropdown-trigger-border: 1px solid
        var(--ds-component-button-color-border-primary);
      --dropdown-trigger-border-radius: var(--ds-primitive-radius-04);
      --dropdown-trigger-color: var(
        --ds-component-button-color-foreground-primary
      );
      --dropdown-trigger-gap: var(--ds-primitive-space-02);
      --dropdown-trigger-icon-size: var(--ds-primitive-space-05);
      --dropdown-trigger-min-height: 28px;
      --dropdown-trigger-padding: var(--ds-primitive-space-02)
        var(--ds-primitive-space-03);

      position: relative;
      box-sizing: border-box;
      display: inline-block;
      color: var(--ds-semantic-color-foreground-default);
      font-family: var(--ds-primitive-font-family-body), Inter, sans-serif;
      font-size: var(--ds-primitive-font-size-small);
      line-height: var(--ds-primitive-font-line-height-small);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .root,
    .trigger,
    .trigger-content,
    .trigger-icon,
    .menu {
      display: flex;
    }

    .root {
      position: relative;
      align-items: flex-start;
      width: max-content;
    }

    .trigger {
      box-sizing: border-box;
      display: flex;
      min-height: var(--dropdown-trigger-min-height);
      align-items: center;
      justify-content: center;
      gap: var(--dropdown-trigger-gap);
      border: var(--dropdown-trigger-border);
      border-radius: var(--dropdown-trigger-border-radius);
      padding: var(--dropdown-trigger-padding);
      appearance: none;
      background: var(--dropdown-trigger-background);
      color: var(--dropdown-trigger-color);
      font: inherit;
      font-size: var(--ds-primitive-font-size-small);
      font-weight: var(--ds-primitive-font-weight-semibold);
      line-height: var(--ds-primitive-font-line-height-small);
      letter-spacing: 0;
      text-decoration: none;
      cursor: pointer;
    }

    :host([disabled]) .trigger {
      color: var(--ds-component-button-color-foreground-disabled);
      cursor: not-allowed;
    }

    :host([open]) .trigger,
    .trigger:focus-visible {
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

    .trigger-content,
    .trigger-icon {
      align-items: center;
      justify-content: center;
    }

    .trigger-icon {
      width: var(--dropdown-trigger-icon-size);
      height: var(--dropdown-trigger-icon-size);
      flex: 0 0 auto;
      color: currentColor;
    }

    slot::slotted(svg) {
      width: var(--dropdown-trigger-icon-size);
      height: var(--dropdown-trigger-icon-size);
      stroke: currentColor;
    }

    .menu {
      position: absolute;
      z-index: 1;
      top: calc(100% + var(--dropdown-menu-offset));
      right: 0;
      display: none;
      width: var(--dropdown-menu-width);
      flex-direction: column;
      align-items: stretch;
      overflow: hidden;
      border: 1px solid var(--ds-semantic-color-border-default);
      border-radius: var(--ds-primitive-radius-05);
      background: var(--ds-semantic-color-surface-default);
      box-shadow:
        var(--ds-semantic-shadow-md-2-offset-x)
          var(--ds-semantic-shadow-md-2-offset-y)
          var(--ds-semantic-shadow-md-2-blur)
          var(--ds-semantic-shadow-md-2-spread)
          var(--ds-semantic-shadow-md-2-color),
        var(--ds-semantic-shadow-md-1-offset-x)
          var(--ds-semantic-shadow-md-1-offset-y)
          var(--ds-semantic-shadow-md-1-blur)
          var(--ds-semantic-shadow-md-1-spread)
          var(--ds-semantic-shadow-md-1-color);
    }

    :host([open]) .menu {
      display: flex;
    }

    :host([align="start"]) .menu {
      right: auto;
      left: 0;
    }

    :host([align="end"]) .menu {
      right: 0;
      left: auto;
    }

  </style>

  <div part="root" class="root">
    <button part="trigger" class="trigger" type="button" aria-haspopup="menu">
      <span part="trigger-content" class="trigger-content">
        <slot class="trigger-slot" name="trigger">Account</slot>
      </span>
      <span part="trigger-icon" class="trigger-icon"></span>
    </button>
    <div part="menu" class="menu" role="menu">
      <slot></slot>
    </div>
  </div>
`;

templates.header.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      padding: var(--ds-primitive-space-04) var(--ds-primitive-space-05);
      color: var(--ds-semantic-color-foreground-default);
      font-family: var(--ds-primitive-font-family-body), Inter, sans-serif;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .content {
      display: flex;
      width: 100%;
      min-width: 0;
      align-items: center;
      gap: var(--ds-primitive-space-04);
    }

    .media {
      display: grid;
      width: var(--dropdown-header-media-size, 40px);
      height: var(--dropdown-header-media-size, 40px);
      flex: 0 0 auto;
      place-items: center;
      color: var(--ds-semantic-color-foreground-primary-elevated);
      font-size: var(--ds-primitive-font-size-small);
      font-weight: var(--ds-primitive-font-weight-medium);
      line-height: var(--ds-primitive-font-line-height-small);
      letter-spacing: 0;
    }

    slot[name="media"]::slotted(*) {
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
    }

    slot[name="media"]::slotted(img) {
      object-fit: cover;
    }

    .text {
      display: flex;
      min-width: 0;
      flex: 1 1 auto;
      flex-direction: column;
      align-items: flex-start;
      white-space: nowrap;
    }

    .title,
    .description {
      max-width: 100%;
      margin: 0;
      overflow: hidden;
      letter-spacing: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    .title {
      color: var(--ds-semantic-color-foreground-default);
      font-size: var(--ds-primitive-font-size-small);
      font-weight: var(--ds-primitive-font-weight-semibold);
      line-height: var(--ds-primitive-font-line-height-small);
    }

    .description {
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-primitive-font-size-small);
      font-weight: var(--ds-primitive-font-weight-regular);
      line-height: var(--ds-primitive-font-line-height-small);
    }
  </style>

  <div class="content">
    <span part="media" class="media">
      <slot name="media"></slot>
    </span>
    <div class="text">
      <p part="title" class="title"><slot name="title"></slot></p>
      <p part="description" class="description"><slot name="description"></slot></p>
    </div>
  </div>
`;

templates.group.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: stretch;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .label {
      display: none;
      padding: var(--ds-primitive-space-03) var(--ds-primitive-space-05)
        var(--ds-primitive-space-02);
      color: var(--ds-semantic-color-foreground-muted-1);
      font-family: var(--ds-primitive-font-family-body), Inter, sans-serif;
      font-size: var(--ds-primitive-font-size-x-small);
      font-weight: var(--ds-primitive-font-weight-medium);
      line-height: var(--ds-primitive-font-line-height-x-small);
      letter-spacing: 0;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    :host([label]) .label {
      display: block;
    }
  </style>

  <span part="label" class="label"></span>
  <slot></slot>
`;

templates.item.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      display: block;
      color: var(--ds-semantic-color-foreground-muted-1);
      font-family: var(--ds-primitive-font-family-body), Inter, sans-serif;
      font-size: var(--ds-primitive-font-size-small);
      line-height: var(--ds-primitive-font-line-height-small);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .item,
    .content,
    .control,
    .media,
    .text {
      display: flex;
    }

    .item {
      width: 100%;
      min-height: 36px;
      align-items: center;
      justify-content: space-between;
      gap: var(--ds-primitive-space-03);
      border: 0;
      padding: var(--ds-primitive-space-03) var(--ds-primitive-space-05);
      appearance: none;
      background: transparent;
      color: currentColor;
      font: inherit;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
    }

    .item:hover:not(:disabled),
    .item:focus-visible {
      outline: 0;
      background: var(--ds-semantic-color-background-muted-1);
    }

    .item:disabled {
      color: var(--ds-semantic-color-foreground-disabled-muted);
      cursor: not-allowed;
    }

    .content {
      min-width: 0;
      align-items: center;
      gap: var(--ds-primitive-space-04);
    }

    .media {
      width: var(--ds-primitive-space-06);
      height: var(--ds-primitive-space-06);
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      color: var(--ds-semantic-color-foreground-muted-1);
    }

    .item:disabled .media,
    .item:disabled .end {
      color: var(--ds-semantic-color-foreground-disabled-muted);
    }

    .media[hidden],
    .control[hidden],
    .description[hidden],
    .end[hidden] {
      display: none;
    }

    .control {
      width: var(--ds-primitive-space-05);
      height: var(--ds-primitive-space-05);
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--ds-component-checkbox-color-border-default);
      border-radius: var(--ds-primitive-radius-02);
      background: var(--ds-semantic-color-surface-default);
    }

    :host([type="radio"]) .control {
      border-radius: var(--ds-primitive-radius-full);
    }

    :host([checked]) .control::after {
      width: var(--ds-primitive-space-02);
      height: var(--ds-primitive-space-02);
      border-radius: var(--ds-primitive-radius-full);
      background: var(--ds-component-button-color-foreground-primary);
      content: "";
    }

    .item:hover:not(:disabled) .control,
    .item:focus-visible .control {
      border-color: var(--ds-component-checkbox-color-border-focus);
    }

    .item:focus-visible .control {
      box-shadow:
        var(--ds-semantic-shadow-focused-4px-offset-x)
          var(--ds-semantic-shadow-focused-4px-offset-y)
          var(--ds-semantic-shadow-focused-4px-blur)
          var(--ds-semantic-shadow-focused-4px-spread)
          var(--ds-semantic-shadow-focused-4px-color);
    }

    .item:disabled .control {
      border-color: var(--ds-component-checkbox-color-border-disabled);
      background: var(--ds-component-checkbox-color-background-disabled);
    }

    .text {
      min-width: 0;
      flex: 1 1 auto;
      flex-direction: column;
      align-items: stretch;
    }

    .label,
    .description {
      min-width: 0;
      overflow: hidden;
      letter-spacing: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    .label {
      color: currentColor;
      font-size: var(--ds-primitive-font-size-small);
      font-weight: var(--ds-primitive-font-weight-medium);
      line-height: var(--ds-primitive-font-line-height-small);
    }

    .description {
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-primitive-font-size-x-small);
      font-weight: var(--ds-primitive-font-weight-regular);
      line-height: var(--ds-primitive-font-line-height-x-small);
    }

    .end {
      flex: 0 0 auto;
      color: var(--ds-semantic-color-foreground-muted-1);
      font-size: var(--ds-primitive-font-size-x-small);
      font-weight: var(--ds-primitive-font-weight-regular);
      line-height: var(--ds-primitive-font-line-height-x-small);
      letter-spacing: 0;
      white-space: nowrap;
      font-kerning: none;
      font-variant-ligatures: none;
    }

    slot::slotted(svg) {
      width: 100%;
      height: 100%;
      stroke: currentColor;
    }

    .media slot::slotted(img) {
      width: 100%;
      height: 100%;
      border-radius: var(--ds-primitive-radius-full);
      object-fit: cover;
    }
  </style>

`;

templates.itemAction.innerHTML = `
  <span class="content">
    <span part="control" class="control"></span>
    <span part="media" class="media"><slot name="media"></slot></span>
    <span part="text" class="text">
      <span part="label" class="label"><slot name="label"></slot><slot></slot></span>
      <span part="description" class="description"><slot name="description"></slot></span>
    </span>
  </span>
  <span part="end" class="end"><slot name="end"></slot></span>
`;

templates.separator.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      height: 1px;
      flex: 0 0 auto;
      background: var(--ds-semantic-color-border-default);
    }
  </style>
`;

const instances = new WeakMap();
const nextDropdownId = (() => {
  let id = 0;
  return () => `${tags.dropdown}-${id++}`;
})();

const itemType = (host) => host.getAttribute("type") || "item";

const isChoice = (host) => ["checkbox", "radio"].includes(itemType(host));

const itemRole = (host) =>
  itemType(host) === "radio"
    ? "menuitemradio"
    : itemType(host) === "checkbox"
      ? "menuitemcheckbox"
      : "menuitem";

const isElement = (node) => node instanceof Element;

const enabledItems = (host) =>
  [...host.querySelectorAll(tags.item)].filter((item) => !item.disabled);

const eventItem = (event) =>
  event
    .composedPath()
    .find((node) => isElement(node) && node.localName === tags.item);

const focusTrigger = (host) => instances.get(host).trigger?.focus();

const focusItem = (host, index) => enabledItems(host)[index]?.focus();

const focusRelativeItem = (host, item, step) => {
  const items = enabledItems(host);
  const index = items.indexOf(item);
  if (index === -1) return;
  items.at((index + step + items.length) % items.length)?.focus();
};

const hasHref = (host) => host.hasAttribute("href");

const hasSlot = (host, name) => Boolean(host.querySelector(`[slot='${name}']`));

const chevronIcon = (open) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  shape.setAttribute("d", chevronPaths[open ? "up" : "down"]);
  shape.setAttribute("stroke", "currentColor");
  shape.setAttribute("stroke-width", "1.5");
  shape.setAttribute("stroke-linecap", "round");
  shape.setAttribute("stroke-linejoin", "round");
  svg.append(shape);

  return svg;
};

const setOpen = (host, open) =>
  host.disabled
    ? host.removeAttribute("open")
    : host.toggleAttribute("open", open);

const setTrigger = (host) => {
  const state = instances.get(host);

  if (state.trigger) return state.trigger;
  state.trigger = state.fallbackTrigger;
  state.trigger.addEventListener("click", state.onToggle);
  state.trigger.addEventListener("keydown", state.onTriggerKeyDown);
  return state.trigger;
};

const syncDropdown = (host) => {
  const { chevron, id, menu } = instances.get(host);
  const trigger = setTrigger(host);

  if (host.disabled) host.removeAttribute("open");
  menu.id = `${id}-menu`;
  if (trigger instanceof HTMLButtonElement && !trigger.hasAttribute("type")) {
    trigger.type = "button";
  }
  if ("disabled" in trigger) trigger.disabled = host.disabled;
  trigger.toggleAttribute("aria-disabled", host.disabled);
  trigger.setAttribute("aria-controls", menu.id);
  trigger.setAttribute("aria-expanded", String(host.open));
  trigger.setAttribute("aria-haspopup", "menu");
  const ariaLabel = host.getAttribute("aria-label");

  ariaLabel
    ? trigger.setAttribute("aria-label", ariaLabel)
    : trigger.removeAttribute("aria-label");
  chevron.replaceChildren(chevronIcon(host.open));
};

const selectedItemText = (item) => {
  const label = item.querySelector("[slot='label']")?.textContent.trim();

  if (label) return label;

  const defaultText = [...item.childNodes]
    .filter((node) => !isElement(node) || !node.hasAttribute("slot"))
    .map((node) => node.textContent)
    .join("")
    .trim();

  return defaultText || item.textContent.trim();
};

const selectRadio = (host, selected) => {
  const name = selected.getAttribute("name") || "";
  host.querySelectorAll(`${tags.item}[type="radio"]`).forEach((item) => {
    if ((item.getAttribute("name") || "") === name)
      item.checked = item === selected;
    });
};

const nextChecked = (item) =>
  item.type === "checkbox" ? !item.checked : item.type === "radio";

const selectionDetail = (item, checked = item.checked) => ({
  checked,
  type: item.type,
  value: item.value,
  text: selectedItemText(item),
});

const selectItem = (host, item) => {
  const checked = nextChecked(item);
  const beforeSelect = new CustomEvent("beforeselect", {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: selectionDetail(item, checked),
  });

  if (!host.dispatchEvent(beforeSelect)) return;

  if (item.type === "checkbox") item.checked = !item.checked;
  if (item.type === "radio") selectRadio(host, item);

  host.dispatchEvent(
    new CustomEvent("select", {
      bubbles: true,
      composed: true,
      detail: selectionDetail(item),
    }),
  );

  if (item.type === "item") {
    setOpen(host, false);
    if (!item.hasAttribute("href")) focusTrigger(host);
  } else {
    setOpen(host, true);
  }
};

const dropdownConnected = (host) => {
  const state = instances.get(host);
  host.addEventListener("drop-down-item-select", state.onItemSelect);
  host.addEventListener("keydown", state.onMenuKeyDown);
  document.addEventListener("pointerdown", state.onPointerDown);
  syncDropdown(host);
};

const dropdownDisconnected = (host) => {
  const state = instances.get(host);
  state.trigger?.removeEventListener("click", state.onToggle);
  state.trigger?.removeEventListener("keydown", state.onTriggerKeyDown);
  state.trigger = undefined;
  host.removeEventListener("drop-down-item-select", state.onItemSelect);
  host.removeEventListener("keydown", state.onMenuKeyDown);
  document.removeEventListener("pointerdown", state.onPointerDown);
};

const mountDropdown = (host) => {
  const shadow = host.attachShadow({ mode: "open" });
  shadow.append(templates.dropdown.content.cloneNode(true));

  instances.set(host, {
    chevron: shadow.querySelector(".trigger-icon"),
    fallbackTrigger: shadow.querySelector(".trigger"),
    id: nextDropdownId(),
    menu: shadow.querySelector(".menu"),
    trigger: undefined,
    onItemSelect: (event) => {
      event.stopPropagation();
      selectItem(host, event.detail.item);
    },
    onMenuKeyDown: (event) => {
      const item = eventItem(event);
      if (!item) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(host, false);
        focusTrigger(host);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusRelativeItem(host, item, 1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusRelativeItem(host, item, -1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        focusItem(host, 0);
      }
      if (event.key === "End") {
        event.preventDefault();
        focusItem(host, enabledItems(host).length - 1);
      }
    },
    onPointerDown: (event) => {
      if (!event.composedPath().includes(host)) setOpen(host, false);
    },
    onToggle: () => setOpen(host, !host.open),
    onTriggerKeyDown: (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(host, false);
      }
      if (!["Enter", " ", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      setOpen(host, true);
      if (event.key === "ArrowDown")
        requestAnimationFrame(() => focusItem(host, 0));
    },
  });
};

const syncItem = (host) => {
  const state = instances.get(host);
  if (state.isLink !== hasHref(host)) {
    renderItem(host);
    return;
  }

  const { button, control, description, end, media } = state;
  const choice = isChoice(host);

  if (button instanceof HTMLButtonElement) button.disabled = host.disabled;
  if (button instanceof HTMLAnchorElement) {
    button.href = host.getAttribute("href") || "";
    if (host.hasAttribute("target"))
      button.target = host.getAttribute("target");
    else button.removeAttribute("target");
    if (host.hasAttribute("rel")) button.rel = host.getAttribute("rel");
    else button.removeAttribute("rel");
    if (host.disabled) button.tabIndex = -1;
    else button.removeAttribute("tabindex");
  }
  button.setAttribute("role", itemRole(host));
  button.toggleAttribute("aria-disabled", host.disabled);
  control.hidden = !choice;
  media.hidden = !hasSlot(host, "media");
  description.hidden = !hasSlot(host, "description");
  end.hidden = !hasSlot(host, "end");

  if (choice) button.setAttribute("aria-checked", String(host.checked));
  else button.removeAttribute("aria-checked");
};

const itemAction = (host) => {
  const action = document.createElement(hasHref(host) ? "a" : "button");

  action.className = "item";
  action.part = "item";
  if (action instanceof HTMLButtonElement) action.type = "button";
  action.append(templates.itemAction.content.cloneNode(true));

  return action;
};

const addItemListeners = (state) => {
  state.button.addEventListener("click", state.onSelect);
  state.button.addEventListener("keydown", state.onKeyDown);
  state.slots.forEach((slot) =>
    slot.addEventListener("slotchange", state.onSlotChange),
  );
};

const removeItemListeners = (state) => {
  state.button?.removeEventListener("click", state.onSelect);
  state.button?.removeEventListener("keydown", state.onKeyDown);
  state.slots?.forEach((slot) =>
    slot.removeEventListener("slotchange", state.onSlotChange),
  );
};

const renderItem = (host) => {
  const state = instances.get(host);

  removeItemListeners(state);
  state.button?.remove();
  state.button = itemAction(host);
  state.control = state.button.querySelector(".control");
  state.description = state.button.querySelector(".description");
  state.end = state.button.querySelector(".end");
  state.media = state.button.querySelector(".media");
  state.isLink = hasHref(host);
  state.slots = [...state.button.querySelectorAll("slot")];
  state.shadow.append(state.button);
  addItemListeners(state);
  syncItem(host);
};

const itemConnected = (host) => {
  syncItem(host);
};

const itemDisconnected = (host) => {
  removeItemListeners(instances.get(host));
};

const mountItem = (host) => {
  const shadow = host.attachShadow({ mode: "open" });
  shadow.append(templates.item.content.cloneNode(true));

  instances.set(host, {
    button: undefined,
    control: undefined,
    description: undefined,
    end: undefined,
    media: undefined,
    isLink: undefined,
    shadow,
    slots: undefined,
    onKeyDown: (event) => {
      if (event.key !== " ") return;
      event.preventDefault();
      instances.get(host).button.click();
    },
    onSelect: (event) => {
      event.stopPropagation();
      if (host.disabled) {
        event.preventDefault();
        return;
      }
      if (isChoice(host)) event.preventDefault();
      host.dispatchEvent(
        new CustomEvent("drop-down-item-select", {
          bubbles: true,
          composed: true,
          detail: { item: host },
        }),
      );
    },
    onSlotChange: () => syncItem(host),
  });
  renderItem(host);
};

/**
 * Token-driven dropdown shell.
 *
 * @tag drop-down
 * @attr {"start"|"end"} align - Menu alignment relative to the trigger. Defaults to end.
 * @attr {boolean} open - Shows the menu surface.
 * @attr {boolean} disabled - Disables the trigger.
 * @attr {string} aria-label - Trigger accessible name.
 * @slot trigger - Trigger content.
 * @slot - Dropdown menu content: header, items, and separators.
 * @fires beforeselect - Cancelable event fired before an item is selected or toggled.
 * @fires select - Fired after an item is selected or toggled. Checkbox and radio rows update checked by default.
 */
export class Dropdown extends HTMLElement {
  static observedAttributes = ["aria-label", "disabled", "open"];

  constructor() {
    super();
    mountDropdown(this);
  }

  connectedCallback() {
    dropdownConnected(this);
  }

  disconnectedCallback() {
    dropdownDisconnected(this);
  }

  attributeChangedCallback() {
    if (instances.has(this)) syncDropdown(this);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(value) {
    setOpen(this, Boolean(value));
  }
}

/**
 * Branded dropdown header.
 *
 * @tag drop-down-header
 * @slot media - Leading media content.
 * @slot title - Primary header text.
 * @slot description - Supporting header text.
 */
export class DropdownHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(
      templates.header.content.cloneNode(true),
    );
  }
}

const syncGroup = (host) => {
  const label = instances.get(host);
  const text = host.getAttribute("label") || "";

  label.textContent = text;
  text
    ? host.setAttribute("aria-label", text)
    : host.removeAttribute("aria-label");
};

/**
 * Dropdown row group.
 *
 * @tag drop-down-group
 * @attr {string} label - Optional accessible and visible group label.
 * @slot - Grouped dropdown items.
 */
export class DropdownGroup extends HTMLElement {
  static observedAttributes = ["label"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(
      templates.group.content.cloneNode(true),
    );
    instances.set(this, this.shadowRoot.querySelector(".label"));
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "group");
    syncGroup(this);
  }

  attributeChangedCallback() {
    if (instances.has(this)) syncGroup(this);
  }
}

/**
 * Branded dropdown row.
 *
 * @tag drop-down-item
 * @attr {"item"|"checkbox"|"radio"} type - Row behavior.
 * @attr {string} value - Value emitted in select events.
 * @attr {string} name - Radio group name.
 * @attr {string} href - Optional link URL.
 * @attr {string} target - Optional link target.
 * @attr {string} rel - Optional link relationship.
 * @attr {boolean} checked - Live checked state for checkbox/radio rows.
 * @attr {boolean} disabled - Disabled state.
 * @slot media - Leading media supplied by the consumer.
 * @slot label - Row label.
 * @slot - Row label fallback.
 * @slot description - Secondary row text.
 * @slot end - Trailing shortcut or metadata.
 */
export class DropdownItem extends HTMLElement {
  static observedAttributes = [
    "checked",
    "disabled",
    "href",
    "name",
    "rel",
    "target",
    "type",
    "value",
  ];

  constructor() {
    super();
    mountItem(this);
  }

  connectedCallback() {
    itemConnected(this);
  }

  disconnectedCallback() {
    itemDisconnected(this);
  }

  attributeChangedCallback() {
    if (instances.has(this)) syncItem(this);
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(value) {
    this.toggleAttribute("checked", Boolean(value));
  }

  focus(options) {
    instances.get(this).button?.focus(options);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  get type() {
    return itemType(this);
  }

  set type(value) {
    this.setAttribute("type", value);
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  set value(value) {
    this.setAttribute("value", value);
  }
}

/**
 * Dropdown separator.
 *
 * @tag drop-down-separator
 */
export class DropdownSeparator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(
      templates.separator.content.cloneNode(true),
    );
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "separator");
  }
}

if (!customElements.get(tags.dropdown))
  customElements.define(tags.dropdown, Dropdown);
if (!customElements.get(tags.group))
  customElements.define(tags.group, DropdownGroup);
if (!customElements.get(tags.header))
  customElements.define(tags.header, DropdownHeader);
if (!customElements.get(tags.item))
  customElements.define(tags.item, DropdownItem);
if (!customElements.get(tags.separator)) {
  customElements.define(tags.separator, DropdownSeparator);
}

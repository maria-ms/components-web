const tagName = "ds-tabs";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};

/**
 * Keyboard coordination and token styling for consumer-owned ARIA tabs.
 *
 * Consumers supply one direct tablist with native tab buttons and one direct
 * tabpanel per button. The markup owns the explicit ARIA pairings; this
 * element owns selection, roving focus, and panel visibility.
 */
export class Tabs extends ElementBase {
  #onClick = (event) => {
    const tab = this.#tabFromEvent(event);

    if (tab && !tab.disabled) this.#activate(tab);
  };

  #onKeydown = (event) => {
    const tab = this.#tabFromEvent(event);
    if (!tab || tab.disabled) return;

    const tabs = this.#tabs().filter((item) => !item.disabled);
    const currentIndex = tabs.indexOf(tab);
    if (currentIndex === -1) return;

    let nextTab = null;

    switch (event.key) {
      case "ArrowRight":
        nextTab = tabs[(currentIndex + 1) % tabs.length];
        break;
      case "ArrowLeft":
        nextTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        break;
      case "Home":
        nextTab = tabs[0];
        break;
      case "End":
        nextTab = tabs.at(-1);
        break;
      case "Enter":
      case " ":
        if (this.activation === "manual") {
          event.preventDefault();
          this.#activate(tab);
        }
        return;
      default:
        return;
    }

    event.preventDefault();
    nextTab?.focus();
    if (nextTab && this.activation === "automatic") this.#activate(nextTab);
  };

  get activation() {
    return this.getAttribute("activation") === "automatic" ? "automatic" : "manual";
  }

  set activation(value) {
    if (value === "automatic") {
      this.setAttribute("activation", "automatic");
    } else {
      this.setAttribute("activation", "manual");
    }
  }

  connectedCallback() {
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeydown);
    this.#synchronize();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("keydown", this.#onKeydown);
  }

  #tablist() {
    return Array.from(this.children).find(
      (child) => child instanceof Element && child.getAttribute("role") === "tablist",
    ) || null;
  }

  #tabs() {
    const tablist = this.#tablist();
    if (!tablist) return [];

    return Array.from(tablist.children).filter(
      (child) => child instanceof HTMLButtonElement && child.getAttribute("role") === "tab",
    );
  }

  #panels() {
    return Array.from(this.children).filter(
      (child) => child instanceof Element && child.getAttribute("role") === "tabpanel",
    );
  }

  #panelFor(tab) {
    const panelId = tab.getAttribute("aria-controls");
    if (!panelId) return null;

    return this.#panels().find((panel) => panel.id === panelId) || null;
  }

  #tabFromEvent(event) {
    if (!(event.target instanceof Element)) return null;

    const tab = event.target.closest('button[role="tab"]');
    const tablist = this.#tablist();

    return tab && tab.parentElement === tablist ? tab : null;
  }

  #synchronize() {
    const tabs = this.#tabs();

    tabs.forEach((tab) => {
      tab.type = "button";
    });

    const selectedTab = tabs.find(
      (tab) => !tab.disabled && tab.getAttribute("aria-selected") === "true" && this.#panelFor(tab),
    );
    const firstEnabledTab = tabs.find((tab) => !tab.disabled && this.#panelFor(tab));

    if (selectedTab || firstEnabledTab) this.#activate(selectedTab || firstEnabledTab);
  }

  #activate(activeTab) {
    const activePanel = this.#panelFor(activeTab);
    if (!activePanel || activeTab.disabled) return;

    this.#tabs().forEach((tab) => {
      const selected = tab === activeTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    this.#panels().forEach((panel) => {
      panel.hidden = panel !== activePanel;
    });
  }
}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Tabs);

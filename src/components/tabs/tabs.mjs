const tagName = "ds-tabs";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
const tabChangeEvent = (detail) =>
  new CustomEvent("ds-tab-change", { bubbles: true, composed: true, detail });

/**
 * Keyboard coordination and token styling for consumer-owned ARIA tabs.
 *
 * Consumers supply one direct tablist with native tab buttons and one direct
 * tabpanel per button. The markup owns the explicit ARIA pairings; this
 * element owns selection, roving focus, and panel visibility. `selected`
 * names the desired tab id; user selection is reflected to that attribute and
 * announced through `ds-tab-change`.
 */
export class Tabs extends ElementBase {
  #observer;

  #onClick = (event) => {
    const tab = this.#tabFromEvent(event);

    if (tab && !tab.disabled) this.#activate(tab, { emit: true });
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
          this.#activate(tab, { emit: true });
        }
        return;
      default:
        return;
    }

    event.preventDefault();
    nextTab?.focus();
    if (nextTab && this.activation === "automatic") {
      this.#activate(nextTab, { emit: true });
    }
  };

  #onMutations = (mutations) => {
    const tablist = this.#tablist();

    if (mutations.some((mutation) => this.#isStructuralMutation(mutation, tablist))) {
      this.#synchronize();
    }
  };

  static get observedAttributes() {
    return ["selected"];
  }

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

  get selected() {
    return this.getAttribute("selected");
  }

  set selected(value) {
    if (value == null || value === "") {
      this.removeAttribute("selected");
    } else {
      this.setAttribute("selected", String(value));
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "selected" && oldValue !== newValue && this.isConnected) {
      this.#synchronize();
    }
  }

  connectedCallback() {
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeydown);

    if (typeof MutationObserver !== "undefined") {
      this.#observer = new MutationObserver(this.#onMutations);
      this.#observer.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-controls", "aria-labelledby", "disabled", "id", "role"],
      });
    }

    this.#synchronize();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("keydown", this.#onKeydown);
    this.#observer?.disconnect();
    this.#observer = undefined;
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

    return this.#panels().find(
      (panel) => panel.id === panelId && panel.getAttribute("aria-labelledby") === tab.id,
    ) || null;
  }

  #tabFromEvent(event) {
    if (!(event.target instanceof Element)) return null;

    const tab = event.target.closest('button[role="tab"]');
    const tablist = this.#tablist();

    return tab && tab.parentElement === tablist ? tab : null;
  }

  #isStructuralMutation(mutation, tablist) {
    if (mutation.type === "childList") {
      return mutation.target === this || mutation.target === tablist;
    }

    if (!(mutation.target instanceof Element)) return false;

    return (
      mutation.target === tablist ||
      mutation.target.parentElement === this ||
      mutation.target.parentElement === tablist
    );
  }

  #synchronize() {
    const tabs = this.#tabs();

    tabs.forEach((tab) => {
      tab.type = "button";
    });

    const requestedTabById = tabs.find((tab) => tab.id === this.selected);
    const requestedTab = requestedTabById && this.#isSelectable(requestedTabById)
      ? requestedTabById
      : null;
    const selectedTab = tabs.find(
      (tab) =>
        this.#isSelectable(tab) && tab.getAttribute("aria-selected") === "true",
    );
    const firstEnabledTab = tabs.find((tab) => this.#isSelectable(tab));
    const activeTab = requestedTab || selectedTab || firstEnabledTab;

    if (!activeTab) return;

    // Preserve an explicit yet temporarily unavailable selected id. This lets
    // a parent set selection before it replaces tabs and panels asynchronously.
    // A disabled requested tab instead reflects the valid fallback immediately.
    const preserveRequestedId =
      Boolean(this.selected) &&
      !requestedTab &&
      !(requestedTabById?.disabled && this.#panelFor(requestedTabById));

    this.#activate(activeTab, {
      reflect: !preserveRequestedId,
    });
  }

  #isSelectable(tab) {
    return !tab.disabled && Boolean(tab.id) && Boolean(this.#panelFor(tab));
  }

  #activate(activeTab, { emit = false, reflect = true } = {}) {
    const activePanel = this.#panelFor(activeTab);
    if (!activePanel || !this.#isSelectable(activeTab)) return;

    const previouslyActive = this.#tabs().find(
      (tab) => this.#isSelectable(tab) && tab.getAttribute("aria-selected") === "true",
    );

    this.#tabs().forEach((tab) => {
      const selected = tab === activeTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    this.#panels().forEach((panel) => {
      panel.hidden = panel !== activePanel;
    });

    if (reflect) this.selected = activeTab.id;

    if (emit && previouslyActive !== activeTab) {
      this.dispatchEvent(
        tabChangeEvent({ tabId: activeTab.id, panelId: activePanel.id }),
      );
    }
  }
}

if (canUseDOM && !customElements.get(tagName)) customElements.define(tagName, Tabs);

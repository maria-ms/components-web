const tagName = "ds-tooltip";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
const validSides = new Set(["top", "right", "bottom", "left"]);
const interactiveSelector = [
  "a[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "summary",
  "[role='button'][tabindex]",
  "[role='link'][tabindex]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");
let generatedId = 0;

const descriptionTokens = (element) =>
  (element.getAttribute("aria-describedby") ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const isEnabled = (element) =>
  !element.matches(":disabled") && element.getAttribute("aria-disabled") !== "true";

const nextId = () => {
  let id;

  do {
    generatedId += 1;
    id = `ds-tooltip-${generatedId}`;
  } while (typeof document !== "undefined" && document.getElementById(id));

  return id;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const oppositeSide = { top: "bottom", right: "left", bottom: "top", left: "right" };

/**
 * An automatic, non-interactive text description for one interactive trigger.
 *
 * The trigger remains normal authored HTML. This element adds the tooltip
 * relationship, hover/focus behaviour, Escape dismissal, and a progressive
 * native Popover top-layer implementation when the browser provides it.
 */
export class Tooltip extends ElementBase {
  static observedAttributes = ["side", "text"];

  #hideTimer;
  #observer;
  #pointerInside = false;
  #target;
  #tooltip;
  #usesPopover = false;

  #onFocusIn = (event) => {
    if (this.#isTriggerEvent(event)) this.#show();
  };

  #onFocusOut = (event) => {
    if (!this.contains(event.relatedTarget)) this.#scheduleHide();
  };

  #onPointerEnter = () => {
    this.#pointerInside = true;
    this.#cancelHide();
    this.#show();
  };

  #onPointerLeave = () => {
    this.#pointerInside = false;
    this.#scheduleHide();
  };

  #onTooltipPointerEnter = () => {
    this.#pointerInside = true;
    this.#cancelHide();
  };

  #onTooltipPointerLeave = () => {
    this.#pointerInside = false;
    this.#scheduleHide();
  };

  #onKeyDown = (event) => {
    if (event.key !== "Escape" || !this.#isTriggerEvent(event)) return;

    this.#hide();
    event.stopPropagation();
  };

  #onViewportChange = () => this.#position();

  connectedCallback() {
    this.#ensureTooltip();
    this.addEventListener("focusin", this.#onFocusIn);
    this.addEventListener("focusout", this.#onFocusOut);
    this.addEventListener("pointerenter", this.#onPointerEnter);
    this.addEventListener("pointerleave", this.#onPointerLeave);
    this.addEventListener("keydown", this.#onKeyDown);
    globalThis.addEventListener?.("resize", this.#onViewportChange);
    globalThis.addEventListener?.("scroll", this.#onViewportChange, true);

    if (typeof MutationObserver !== "undefined") {
      this.#observer = new MutationObserver(() => this.#synchronize());
      this.#observer.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-describedby", "aria-disabled", "disabled", "href", "tabindex"],
      });
    }

    this.#synchronize();
  }

  disconnectedCallback() {
    this.#hide();
    this.#cancelHide();
    this.removeEventListener("focusin", this.#onFocusIn);
    this.removeEventListener("focusout", this.#onFocusOut);
    this.removeEventListener("pointerenter", this.#onPointerEnter);
    this.removeEventListener("pointerleave", this.#onPointerLeave);
    this.removeEventListener("keydown", this.#onKeyDown);
    globalThis.removeEventListener?.("resize", this.#onViewportChange);
    globalThis.removeEventListener?.("scroll", this.#onViewportChange, true);
    this.#observer?.disconnect();
    this.#observer = undefined;
    this.#removeDescription();
  }

  attributeChangedCallback() {
    this.#synchronize();
    this.#position();
  }

  #ensureTooltip() {
    if (this.#tooltip || !canUseDOM) return;

    const tooltip = document.createElement("span");

    tooltip.dataset.tooltipContent = "";
    tooltip.id = nextId();
    tooltip.setAttribute("role", "tooltip");
    tooltip.addEventListener("pointerenter", this.#onTooltipPointerEnter);
    tooltip.addEventListener("pointerleave", this.#onTooltipPointerLeave);

    this.#usesPopover = typeof tooltip.showPopover === "function";
    if (this.#usesPopover) {
      tooltip.setAttribute("popover", "manual");
      this.dataset.tooltipTopLayer = "";
    } else {
      tooltip.hidden = true;
    }

    this.#tooltip = tooltip;
    this.append(tooltip);
  }

  #synchronize() {
    if (!this.isConnected) return;

    this.#ensureTooltip();
    const target = this.#findTarget();
    const message = this.#message();

    if (target !== this.#target) {
      this.#removeDescription();
      this.#target = target;
    }

    if (!this.#target || !message) {
      this.#removeDescription();
      this.#hide();
      return;
    }

    if (this.#tooltip.textContent !== message) {
      this.#tooltip.textContent = message;
    }
    this.#tooltip.dataset.side = this.#requestedSide();
    this.#addDescription();
  }

  #findTarget() {
    const directChildren = Array.from(this.children).filter(
      (child) => child !== this.#tooltip,
    );

    if (directChildren.length !== 1) return null;

    const root = directChildren[0];
    const candidates = [
      ...(root.matches(interactiveSelector) ? [root] : []),
      ...root.querySelectorAll(interactiveSelector),
    ].filter(isEnabled);

    return candidates.length === 1 ? candidates[0] : null;
  }

  #requestedSide() {
    const side = this.getAttribute("side");

    return validSides.has(side) ? side : "top";
  }

  #message() {
    return this.getAttribute("text")?.trim() ?? "";
  }

  #addDescription() {
    const descriptionIds = descriptionTokens(this.#target);

    if (descriptionIds.includes(this.#tooltip.id)) return;

    this.#target.setAttribute(
      "aria-describedby",
      [...descriptionIds, this.#tooltip.id].join(" "),
    );
  }

  #removeDescription() {
    if (!this.#target || !this.#tooltip) return;

    const descriptionIds = descriptionTokens(this.#target).filter(
      (id) => id !== this.#tooltip.id,
    );

    if (descriptionIds.length) {
      this.#target.setAttribute("aria-describedby", descriptionIds.join(" "));
    } else {
      this.#target.removeAttribute("aria-describedby");
    }
  }

  #isTriggerEvent(event) {
    return Boolean(this.#target && event.target instanceof Node && this.#target.contains(event.target));
  }

  #show() {
    if (!this.#target || !this.#message()) return;

    this.#cancelHide();

    if (this.#usesPopover) {
      if (!this.#tooltip.matches(":popover-open")) this.#tooltip.showPopover();
      this.#position();
      return;
    }

    this.#tooltip.hidden = false;
  }

  #scheduleHide() {
    this.#cancelHide();
    this.#hideTimer = setTimeout(() => {
      if (!this.#pointerInside && !this.matches(":focus-within")) this.#hide();
    }, 100);
  }

  #cancelHide() {
    if (this.#hideTimer) clearTimeout(this.#hideTimer);
    this.#hideTimer = undefined;
  }

  #hide() {
    if (!this.#tooltip) return;

    if (this.#usesPopover) {
      if (this.#tooltip.matches(":popover-open")) this.#tooltip.hidePopover();
      return;
    }

    this.#tooltip.hidden = true;
  }

  #position() {
    if (!this.#usesPopover || !this.#target || !this.#tooltip.matches(":popover-open")) {
      return;
    }

    const update = () => {
      if (!this.#tooltip.matches(":popover-open")) return;

      const targetRect = this.#target.getBoundingClientRect();
      const tooltipRect = this.#tooltip.getBoundingClientRect();
      const styles = getComputedStyle(this);
      const gap =
        Number.parseFloat(styles.getPropertyValue("--ds-semantic-spacing-2xs")) || 4;
      const gutter =
        Number.parseFloat(styles.getPropertyValue("--ds-semantic-spacing-xs")) || 8;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const positions = (side) => {
        switch (side) {
          case "right":
            return {
              left: targetRect.right + gap,
              top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
            };
          case "bottom":
            return {
              left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
              top: targetRect.bottom + gap,
            };
          case "left":
            return {
              left: targetRect.left - tooltipRect.width - gap,
              top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
            };
          default:
            return {
              left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
              top: targetRect.top - tooltipRect.height - gap,
            };
        }
      };
      const fits = (position) =>
        position.left >= gutter &&
        position.top >= gutter &&
        position.left + tooltipRect.width <= viewportWidth - gutter &&
        position.top + tooltipRect.height <= viewportHeight - gutter;
      const requestedSide = this.#requestedSide();
      const candidates = [
        requestedSide,
        oppositeSide[requestedSide],
        "top",
        "right",
        "bottom",
        "left",
      ];
      const side = candidates.find((candidate, index) => {
        if (candidates.indexOf(candidate) !== index) return false;
        return fits(positions(candidate));
      }) ?? requestedSide;
      const position = positions(side);

      this.#tooltip.dataset.side = side;
      this.#tooltip.style.left = `${clamp(
        position.left,
        gutter,
        Math.max(gutter, viewportWidth - tooltipRect.width - gutter),
      )}px`;
      this.#tooltip.style.top = `${clamp(
        position.top,
        gutter,
        Math.max(gutter, viewportHeight - tooltipRect.height - gutter),
      )}px`;
    };

    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(update);
    } else {
      update();
    }
  }
}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Tooltip);
}

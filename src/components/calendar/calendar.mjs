import "../button/button.mjs";

const tagName = "ds-calendar";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_MONTH = /^\d{4}-\d{2}$/;
const DAY = 24 * 60 * 60 * 1000;

const toIsoDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
  if (!ISO_DATE.test(value ?? "")) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return toIsoDate(date) === value ? date : undefined;
};

const parseMonth = (value) => {
  if (!ISO_MONTH.test(value ?? "")) return undefined;

  const [year, month] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1
    ? date
    : undefined;
};

const monthValue = (date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

const addDays = (date, amount) => new Date(date.getTime() + amount * DAY);

const addMonths = (date, amount) => {
  const targetMonth = date.getUTCMonth() + amount;
  const target = new Date(Date.UTC(date.getUTCFullYear(), targetMonth, 1));
  const maximumDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();

  target.setUTCDate(Math.min(date.getUTCDate(), maximumDay));
  return target;
};

const startOfMonth = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const localToday = () => {
  const today = new Date();

  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
};

const compareDateValues = (left, right) => left.localeCompare(right);
const isSameMonth = (left, right) =>
  left.getUTCFullYear() === right.getUTCFullYear() &&
  left.getUTCMonth() === right.getUTCMonth();

const isIsoDate = (value) => Boolean(parseDate(value));
const uniqueId = (() => {
  let count = 0;

  return () => {
    let id;

    do {
      count += 1;
      id = `ds-calendar-month-${count}`;
    } while (typeof document !== "undefined" && document.getElementById(id));

    return id;
  };
})();

/**
 * An intrinsic Gregorian month grid for selecting one date or one contiguous
 * date range. It intentionally does not provide a date-input, dialog, time,
 * scheduler, or multi-month API; compose those from this primitive instead.
 */
export class Calendar extends ElementBase {
  static observedAttributes = [
    "selection",
    "month",
    "locale",
    "value",
    "range-start",
    "range-end",
    "min",
    "max",
    "disabled-dates",
    "today",
  ];

  #headingId = uniqueId();
  #disabledDates = new Set();
  #focusedDate;

  connectedCallback() {
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
    this.#render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("keydown", this.#onKeyDown);
  }

  attributeChangedCallback(name, previousValue, value) {
    if (name === "disabled-dates" && previousValue !== value) {
      this.#disabledDates = this.#parseDisabledDates(value);
    }

    if (previousValue !== value && this.isConnected) this.#render();
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value) {
    this.#setOptionalAttribute("value", value);
  }

  get rangeStart() {
    return this.getAttribute("range-start") ?? "";
  }

  set rangeStart(value) {
    this.#setOptionalAttribute("range-start", value);
  }

  get rangeEnd() {
    return this.getAttribute("range-end") ?? "";
  }

  set rangeEnd(value) {
    this.#setOptionalAttribute("range-end", value);
  }

  get disabledDates() {
    return new Set(this.#disabledDateValues());
  }

  set disabledDates(values) {
    const iterable = typeof values === "string" ? values.split(",") : values;

    this.#disabledDates = new Set(
      Array.from(iterable ?? [], (value) => String(value).trim()).filter(isIsoDate),
    );
    if (this.isConnected) this.#render();
  }

  #setOptionalAttribute(name, value) {
    const normalized = String(value ?? "").trim();

    if (normalized) this.setAttribute(name, normalized);
    else this.removeAttribute(name);
  }

  #onClick = (event) => {
    const button = event.target.closest("button[data-calendar-date]");

    if (button && this.contains(button)) {
      this.#select(button.dataset.calendarDate);
      return;
    }

    const direction = event.target.closest("button[data-calendar-navigation]")?.dataset
      .calendarNavigation;

    if (direction === "previous") this.#changeMonth(-1);
    if (direction === "next") this.#changeMonth(1);
  };

  #onKeyDown = (event) => {
    const button = event.target.closest("button[data-calendar-date]");

    if (!button || !this.contains(button)) return;

    const date = parseDate(button.dataset.calendarDate);
    if (!date) return;

    let target;

    if (event.key === "ArrowLeft") target = addDays(date, -1);
    if (event.key === "ArrowRight") target = addDays(date, 1);
    if (event.key === "ArrowUp") target = addDays(date, -7);
    if (event.key === "ArrowDown") target = addDays(date, 7);
    if (event.key === "Home") target = addDays(date, -this.#weekOffset(date));
    if (event.key === "End") target = addDays(date, 6 - this.#weekOffset(date));
    if (event.key === "PageUp") target = addMonths(date, event.shiftKey ? -12 : -1);
    if (event.key === "PageDown") target = addMonths(date, event.shiftKey ? 12 : 1);

    if (!target) return;

    event.preventDefault();
    this.#focusDate(target, target < date ? -1 : 1);
  };

  #selection() {
    return this.getAttribute("selection") === "range" ? "range" : "single";
  }

  #locale() {
    const requested = this.getAttribute("locale")?.trim();

    try {
      return new Intl.Locale(requested || document.documentElement.lang || navigator.language || "en-US");
    } catch {
      return new Intl.Locale("en-US");
    }
  }

  #format(options) {
    return new Intl.DateTimeFormat(this.#locale().toString(), {
      calendar: "gregory",
      timeZone: "UTC",
      ...options,
    });
  }

  #weekStartsOn() {
    const locale = this.#locale();

    if (typeof locale.getWeekInfo === "function") {
      return locale.getWeekInfo().firstDay % 7;
    }

    // Sunday is the least surprising fallback where locale week data is absent.
    return 0;
  }

  #weekOffset(date) {
    return (date.getUTCDay() - this.#weekStartsOn() + 7) % 7;
  }

  #today() {
    return parseDate(this.getAttribute("today")) ?? localToday();
  }

  #displayMonth() {
    const explicitMonth = parseMonth(this.getAttribute("month"));
    if (explicitMonth) return explicitMonth;

    const selected = parseDate(this.value);
    const rangeStart = parseDate(this.rangeStart);

    return startOfMonth(selected ?? rangeStart ?? this.#today());
  }

  #disabledDateValues() {
    const fromAttribute = this.#parseDisabledDates(this.getAttribute("disabled-dates"));

    return new Set([...fromAttribute, ...this.#disabledDates]);
  }

  #parseDisabledDates(value) {
    return new Set(
      (value ?? "")
        .split(",")
        .map((date) => date.trim())
        .filter(isIsoDate),
    );
  }

  #isDisabled(date) {
    const value = toIsoDate(date);
    const min = parseDate(this.getAttribute("min"));
    const max = parseDate(this.getAttribute("max"));

    return (
      (min && value < toIsoDate(min)) ||
      (max && value > toIsoDate(max)) ||
      this.#disabledDateValues().has(value)
    );
  }

  #focusedDateFor(month) {
    const current = parseDate(this.#focusedDate);
    if (current && isSameMonth(current, month) && !this.#isDisabled(current)) return current;

    const selected = this.#selection() === "single" ? parseDate(this.value) : parseDate(this.rangeStart);
    if (selected && isSameMonth(selected, month) && !this.#isDisabled(selected)) return selected;

    const today = this.#today();
    if (isSameMonth(today, month) && !this.#isDisabled(today)) return today;

    for (let day = 1; day <= 31; day += 1) {
      const candidate = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), day));
      if (!isSameMonth(candidate, month)) break;
      if (!this.#isDisabled(candidate)) return candidate;
    }

    return undefined;
  }

  #focusDate(date, direction) {
    let target = date;
    let attempts = 0;

    while (this.#isDisabled(target) && attempts < 3660) {
      target = addDays(target, direction);
      attempts += 1;
    }

    if (this.#isDisabled(target)) return;

    this.#focusedDate = toIsoDate(target);
    this.setAttribute("month", monthValue(target));

    queueMicrotask(() =>
      this.querySelector(`button[data-calendar-date="${this.#focusedDate}"]`)?.focus(),
    );
  }

  #changeMonth(amount) {
    const target = startOfMonth(addMonths(this.#displayMonth(), amount));

    this.#focusedDate = undefined;
    this.setAttribute("month", monthValue(target));
    this.dispatchEvent(
      new CustomEvent("ds-calendar-month-change", {
        bubbles: true,
        composed: true,
        detail: { month: monthValue(target) },
      }),
    );
  }

  #select(value) {
    if (!isIsoDate(value) || this.#isDisabled(parseDate(value))) return;

    this.#focusedDate = value;

    if (this.#selection() === "single") {
      this.value = value;
    } else {
      const start = this.rangeStart;
      const end = this.rangeEnd;

      if (!isIsoDate(start) || isIsoDate(end)) {
        this.rangeStart = value;
        this.rangeEnd = "";
      } else if (compareDateValues(value, start) < 0) {
        this.rangeStart = value;
        this.rangeEnd = start;
      } else {
        this.rangeEnd = value;
      }
    }

    this.dispatchEvent(
      new CustomEvent("ds-calendar-change", {
        bubbles: true,
        composed: true,
        detail: {
          selection: this.#selection(),
          value: this.#selection() === "single" ? this.value : "",
          rangeStart: this.#selection() === "range" ? this.rangeStart : "",
          rangeEnd: this.#selection() === "range" ? this.rangeEnd : "",
        },
      }),
    );
  }

  #createNavigationButton(direction, label) {
    const wrapper = document.createElement("ds-icon-button");
    const button = document.createElement("button");
    const icon = document.createElement("span");

    wrapper.setAttribute("variant", "ghost");
    button.type = "button";
    button.dataset.calendarNavigation = direction;
    button.setAttribute("aria-label", label);
    icon.dataset.calendarIcon = direction;
    icon.setAttribute("aria-hidden", "true");
    button.append(icon);
    wrapper.append(button);

    return wrapper;
  }

  #render() {
    if (!canUseDOM) return;

    const month = this.#displayMonth();
    const selection = this.#selection();
    const focusDate = this.#focusedDateFor(month);
    const selected = parseDate(this.value);
    const rangeStart = parseDate(this.rangeStart);
    const rangeEnd = parseDate(this.rangeEnd);
    const today = this.#today();
    const start = addDays(startOfMonth(month), -this.#weekOffset(startOfMonth(month)));
    const root = document.createElement("div");
    const header = document.createElement("div");
    const monthHeading = document.createElement("h2");
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const headingRow = document.createElement("tr");
    const tableBody = document.createElement("tbody");

    root.dataset.calendar = "";
    root.dataset.selection = selection;
    header.dataset.calendarHeader = "";
    monthHeading.dataset.calendarMonth = "";
    monthHeading.id = this.#headingId;
    monthHeading.setAttribute("aria-live", "polite");
    monthHeading.textContent = this.#format({ month: "long", year: "numeric" }).format(month);
    header.append(
      this.#createNavigationButton("previous", "Show previous month"),
      monthHeading,
      this.#createNavigationButton("next", "Show next month"),
    );

    table.dataset.calendarGrid = "";
    table.setAttribute("role", "grid");
    table.setAttribute("aria-labelledby", this.#headingId);
    if (selection === "range") table.setAttribute("aria-multiselectable", "true");

    for (let offset = 0; offset < 7; offset += 1) {
      const weekday = addDays(new Date(Date.UTC(2024, 0, 7)), this.#weekStartsOn() + offset);
      const heading = document.createElement("th");
      const abbreviation = document.createElement("abbr");

      heading.scope = "col";
      abbreviation.title = this.#format({ weekday: "long" }).format(weekday);
      abbreviation.textContent = this.#format({ weekday: "narrow" }).format(weekday);
      heading.append(abbreviation);
      headingRow.append(heading);
    }

    tableHead.append(headingRow);

    for (let week = 0; week < 6; week += 1) {
      const row = document.createElement("tr");

      for (let day = 0; day < 7; day += 1) {
        const date = addDays(start, week * 7 + day);
        const value = toIsoDate(date);
        const cell = document.createElement("td");
        const button = document.createElement("button");
        const outside = !isSameMonth(date, month);
        const disabled = this.#isDisabled(date);
        const inRange =
          selection === "range" &&
          rangeStart &&
          rangeEnd &&
          value >= toIsoDate(rangeStart) &&
          value <= toIsoDate(rangeEnd);
        const isSelected =
          (selection === "single" && selected && value === toIsoDate(selected)) ||
          (selection === "range" && rangeStart && !rangeEnd && value === toIsoDate(rangeStart)) ||
          (selection === "range" && rangeStart && rangeEnd && value === toIsoDate(rangeStart) && value === toIsoDate(rangeEnd));
        const isRangeStart =
          selection === "range" &&
          rangeStart &&
          rangeEnd &&
          value === toIsoDate(rangeStart) &&
          value !== toIsoDate(rangeEnd);
        const isRangeEnd =
          selection === "range" &&
          rangeEnd &&
          rangeStart &&
          value === toIsoDate(rangeEnd) &&
          value !== toIsoDate(rangeStart);
        const isRangeMiddle = inRange && !isRangeStart && !isRangeEnd && !isSelected;

        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-selected", isSelected || inRange ? "true" : "false");
        button.type = "button";
        button.dataset.calendarDate = value;
        button.textContent = this.#format({ day: "numeric" }).format(date);
        button.tabIndex = focusDate && value === toIsoDate(focusDate) ? 0 : -1;
        button.disabled = disabled;
        button.setAttribute(
          "aria-label",
          this.#format({ weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(date),
        );
        if (value === toIsoDate(today)) button.setAttribute("aria-current", "date");
        if (outside) button.dataset.outside = "";
        if (isSelected) button.dataset.selected = "";
        if (isRangeStart) button.dataset.rangeStart = "";
        if (isRangeMiddle) button.dataset.rangeMiddle = "";
        if (isRangeEnd) button.dataset.rangeEnd = "";
        if (value === toIsoDate(today)) button.dataset.today = "";
        cell.append(button);
        row.append(cell);
      }

      tableBody.append(row);
    }

    table.append(tableHead, tableBody);
    root.append(header, table);
    this.replaceChildren(root);
  }
}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, Calendar);
}

import "../button/button.mjs";
import "../badge/badge.mjs";
import "../checkbox/checkbox.mjs";
import "../spinner/spinner.mjs";

const tagName = "ds-data-table";
const canUseDOM =
  typeof document !== "undefined" && typeof customElements !== "undefined";
const ElementBase = globalThis.HTMLElement ?? class {};
const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const isRowId = (value) =>
  (typeof value === "string" && value.length > 0) ||
  (typeof value === "number" && Number.isFinite(value));
const isPlainCellValue = (value) =>
  value == null ||
  typeof value === "string" ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value));

const fail = (message) => {
  throw new TypeError(`Invalid Data Table model: ${message}`);
};

const event = (name, detail) =>
  new CustomEvent(name, { bubbles: true, composed: true, detail });

const asRowId = (value) => String(value);

/**
 * The JSON model deliberately has only one flexible column. Keep that track
 * usable when the host is narrower than the table, while leaving the parent
 * scroll region responsible for overflow. The CSS custom properties keep the
 * token-owned selection width and component-owned flexible-track minimum out
 * of the public data model.
 */
const tableMinimumInlineSize = ({ columns, selection }) => {
  const tracks = columns.map((column) =>
    typeof column.width === "number"
      ? `${column.width}px`
      : "var(--ds-data-table-fill-column-min-inline-size)",
  );

  if (selection) tracks.unshift("var(--ds-data-table-selection-width)");

  return `calc(${tracks.join(" + ")})`;
};

const accessibleRowLabel = (row, rowHeader, rowId) => {
  const value = row[rowHeader.id];

  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (
    isObject(value) &&
    (typeof value.label === "string" || typeof value.label === "number")
  ) {
    return String(value.label);
  }

  return `row ${rowId}`;
};

const textNode = (value) =>
  document.createTextNode(value == null ? "" : String(value));

/**
 * Validates the serializable model. JSON Schema consumers can use the colocated
 * schema file; this runtime validation protects the component boundary and the
 * cross-field rules JSON Schema cannot express.
 */
export const validateDataTableModel = (model) => {
  if (!isObject(model)) fail("model must be an object.");

  const allowedModelKeys = new Set([
    "caption",
    "rowKey",
    "columns",
    "rows",
    "selection",
    "sort",
    "state",
  ]);

  Object.keys(model).forEach((key) => {
    if (!allowedModelKeys.has(key)) fail(`model.${key} is not supported.`);
  });

  if (typeof model.caption !== "string" || model.caption.trim().length === 0) {
    fail("caption must be one concise, non-empty string.");
  }
  if (typeof model.rowKey !== "string" || model.rowKey.length === 0) {
    fail("rowKey must be a non-empty string.");
  }
  if (!Array.isArray(model.columns) || model.columns.length === 0) {
    fail("columns must contain at least one column.");
  }
  if (!Array.isArray(model.rows)) fail("rows must be an array.");

  const columnIds = new Set();
  let fillColumns = 0;
  let rowHeaders = 0;

  model.columns.forEach((column, index) => {
    if (!isObject(column)) fail(`columns[${index}] must be an object.`);
    const allowedColumnKeys = new Set([
      "id",
      "label",
      "width",
      "align",
      "hiddenLabel",
      "rowHeader",
      "sortable",
      "renderer",
    ]);

    Object.keys(column).forEach((key) => {
      if (!allowedColumnKeys.has(key))
        fail(`columns[${index}].${key} is not supported.`);
    });

    if (typeof column.id !== "string" || column.id.length === 0) {
      fail(`columns[${index}].id must be a non-empty string.`);
    }
    if (columnIds.has(column.id))
      fail(`column id “${column.id}” is duplicated.`);
    columnIds.add(column.id);

    if (typeof column.label !== "string" || column.label.length === 0) {
      fail(`columns[${index}].label must be a non-empty string.`);
    }
    if (column.width === "fill") fillColumns += 1;
    else if (
      typeof column.width !== "number" ||
      !Number.isFinite(column.width) ||
      column.width <= 0
    ) {
      fail(`columns[${index}].width must be "fill" or a positive number.`);
    }
    if (
      column.align !== undefined &&
      !["start", "center", "end"].includes(column.align)
    ) {
      fail(`columns[${index}].align must be start, center, or end.`);
    }
    if (
      column.hiddenLabel !== undefined &&
      typeof column.hiddenLabel !== "boolean"
    ) {
      fail(`columns[${index}].hiddenLabel must be boolean.`);
    }
    if (column.rowHeader === true) rowHeaders += 1;
    else if (
      column.rowHeader !== undefined &&
      typeof column.rowHeader !== "boolean"
    ) {
      fail(`columns[${index}].rowHeader must be boolean.`);
    }
    if (column.sortable !== undefined && typeof column.sortable !== "boolean") {
      fail(`columns[${index}].sortable must be boolean.`);
    }
    if (column.hiddenLabel === true && column.sortable === true) {
      fail(`columns[${index}] cannot be both hiddenLabel and sortable.`);
    }
    if (
      column.renderer !== undefined &&
      (typeof column.renderer !== "string" || column.renderer.length === 0)
    ) {
      fail(`columns[${index}].renderer must be a non-empty string.`);
    }
  });

  if (fillColumns !== 1)
    fail('columns must contain exactly one width: "fill" column.');
  if (rowHeaders > 1)
    fail("columns can contain at most one rowHeader: true column.");

  const rowIds = new Set();
  model.rows.forEach((row, index) => {
    if (!isObject(row)) fail(`rows[${index}] must be an object.`);
    const rowId = row[model.rowKey];
    if (!isRowId(rowId))
      fail(
        `rows[${index}].${model.rowKey} must be a non-empty string or finite number.`,
      );
    const id = asRowId(rowId);
    if (rowIds.has(id)) fail(`row id “${id}” is duplicated.`);
    rowIds.add(id);

    model.columns.forEach((column) => {
      if (!column.renderer && !isPlainCellValue(row[column.id])) {
        fail(
          `rows[${index}].${column.id} must be text, a finite number, boolean, or empty unless columns[${model.columns.indexOf(column)}] supplies a renderer.`,
        );
      }
    });
  });

  if (model.selection !== undefined) {
    if (
      !isObject(model.selection) ||
      !Array.isArray(model.selection.selectedIds)
    ) {
      fail("selection must contain a selectedIds array.");
    }
    Object.keys(model.selection).forEach((key) => {
      if (key !== "selectedIds") fail(`selection.${key} is not supported.`);
    });
    if (rowHeaders !== 1)
      fail(
        "selection requires exactly one rowHeader column for named checkboxes.",
      );

    const selectedIds = new Set();
    model.selection.selectedIds.forEach((rowId, index) => {
      if (!isRowId(rowId))
        fail(`selection.selectedIds[${index}] must be a row id.`);
      const id = asRowId(rowId);
      if (!rowIds.has(id))
        fail(`selection.selectedIds includes unknown row id “${id}”.`);
      if (selectedIds.has(id))
        fail(`selection.selectedIds includes “${id}” more than once.`);
      selectedIds.add(id);
    });
  }

  if (model.sort !== undefined) {
    if (!isObject(model.sort)) fail("sort must be an object.");
    Object.keys(model.sort).forEach((key) => {
      if (!["column", "direction"].includes(key))
        fail(`sort.${key} is not supported.`);
    });
    const column = model.columns.find(
      (candidate) => candidate.id === model.sort.column,
    );
    if (!column || column.sortable !== true) {
      fail("sort.column must reference a sortable column.");
    }
    if (!["ascending", "descending"].includes(model.sort.direction)) {
      fail("sort.direction must be ascending or descending.");
    }
  }

  if (model.state !== undefined) {
    if (
      !isObject(model.state) ||
      !["loading", "empty", "error"].includes(model.state.kind)
    ) {
      fail("state.kind must be loading, empty, or error.");
    }
    Object.keys(model.state).forEach((key) => {
      if (!["kind", "message", "action"].includes(key))
        fail(`state.${key} is not supported.`);
    });
    if (
      typeof model.state.message !== "string" ||
      model.state.message.length === 0
    ) {
      fail("state.message must be a non-empty string.");
    }
    if (model.state.action !== undefined) {
      const { action } = model.state;
      if (
        !isObject(action) ||
        typeof action.id !== "string" ||
        action.id.length === 0 ||
        typeof action.label !== "string" ||
        action.label.length === 0
      ) {
        fail("state.action must contain non-empty id and label strings.");
      }
      Object.keys(action).forEach((key) => {
        if (!["id", "label"].includes(key))
          fail(`state.action.${key} is not supported.`);
      });
    }
  }

  return model;
};

const validateCellRenderers = (renderers) => {
  if (!isObject(renderers))
    throw new TypeError("Data Table cellRenderers must be an object.");
  Object.entries(renderers).forEach(([key, renderer]) => {
    if (typeof renderer !== "function") {
      throw new TypeError(
        `Data Table cell renderer “${key}” must be a function.`,
      );
    }
  });
  return renderers;
};

/**
 * A data-driven native table. `model` is intentionally JSON-only;
 * `cellRenderers` supplies arbitrary, existing design-system composition as DOM
 * nodes, preserving the unrestricted Figma Cell / Content Slot. Selection and
 * sort state update immediately while the host remains responsible for sorting
 * the actual rows after ds-sort-change.
 */
export class DataTable extends ElementBase {
  #cellRenderers = {};
  #model = null;
  #previousStateKind = null;

  get model() {
    return this.#model;
  }

  set model(value) {
    this.#model = validateDataTableModel(value);
    this.#render();
  }

  get cellRenderers() {
    return this.#cellRenderers;
  }

  set cellRenderers(value) {
    this.#cellRenderers = validateCellRenderers(value);
    this.#render();
  }

  connectedCallback() {
    this.#render();
  }

  #render() {
    if (!canUseDOM || !this.isConnected || !this.#model) return;

    const model = this.#model;
    const isState = model.state !== undefined;
    const selectedIds = new Set(
      (model.selection?.selectedIds ?? []).map(asRowId),
    );
    const rowHeader = model.columns.find((column) => column.rowHeader === true);
    const scrollRegion = document.createElement("div");
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    const colgroup = document.createElement("colgroup");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const tbody = document.createElement("tbody");
    const liveRegion = document.createElement("div");

    scrollRegion.className = "ds-data-table__scroll";
    scrollRegion.tabIndex = 0;
    scrollRegion.setAttribute("role", "region");
    scrollRegion.setAttribute(
      "aria-label",
      `Scrollable ${model.caption} table`,
    );
    if (model.state?.kind === "loading")
      scrollRegion.setAttribute("aria-busy", "true");

    caption.textContent = model.caption;
    table.style.setProperty(
      "--ds-data-table-min-inline-size",
      tableMinimumInlineSize(model),
    );
    table.append(caption);

    if (model.selection) {
      const selectionColumn = document.createElement("col");
      selectionColumn.className = "ds-data-table__selection-column";
      colgroup.append(selectionColumn);
    }

    model.columns.forEach((column) => {
      const col = document.createElement("col");
      if (typeof column.width === "number")
        col.style.width = `${column.width}px`;
      colgroup.append(col);
    });
    table.append(colgroup);

    if (model.selection) {
      const header = document.createElement("th");
      header.className = "ds-data-table__selection-cell";
      header.scope = "col";
      header.append(
        this.#checkbox({
          checked:
            !isState &&
            model.rows.length > 0 &&
            selectedIds.size === model.rows.length,
          disabled: isState || model.rows.length === 0,
          indeterminate:
            !isState &&
            selectedIds.size > 0 &&
            selectedIds.size < model.rows.length,
          label: `Select all ${model.caption}`,
          onChange: (checked) => {
            const nextSelectedIds = checked
              ? model.rows.map((row) => row[model.rowKey])
              : [];
            this.#updateSelection(nextSelectedIds, "all");
          },
        }),
      );
      headerRow.append(header);
    }

    model.columns.forEach((column) => {
      const header = document.createElement("th");
      header.scope = "col";
      if (column.align) header.dataset.align = column.align;
      if (model.sort?.column === column.id)
        header.setAttribute("aria-sort", model.sort.direction);

      if (column.sortable) {
        const button = document.createElement("button");
        const icon = document.createElement("span");
        const currentDirection =
          model.sort?.column === column.id ? model.sort.direction : "unsorted";

        button.type = "button";
        button.className = "ds-data-table__sort-button";
        button.dataset.sortColumn = column.id;
        button.append(textNode(column.label));
        icon.className = "ds-data-table__sort-icon";
        icon.dataset.sortIcon = currentDirection;
        icon.setAttribute("aria-hidden", "true");
        button.append(icon);
        button.addEventListener("click", () => {
          const direction =
            model.sort?.column === column.id &&
            model.sort.direction === "ascending"
              ? "descending"
              : "ascending";
          this.#updateSort(column.id, direction);
        });
        header.append(button);
      } else if (column.hiddenLabel) {
        const label = document.createElement("span");
        label.className = "ds-data-table__visually-hidden";
        label.textContent = column.label;
        header.append(label);
      } else {
        header.append(textNode(column.label));
      }

      headerRow.append(header);
    });
    thead.append(headerRow);
    table.append(thead);

    if (model.state) {
      tbody.append(
        this.#stateRow(model, model.columns.length + (model.selection ? 1 : 0)),
      );
    } else {
      model.rows.forEach((row, rowIndex) => {
        const rowId = row[model.rowKey];
        const id = asRowId(rowId);
        const tableRow = document.createElement("tr");

        if (model.selection && selectedIds.has(id))
          tableRow.dataset.selected = "true";
        if (model.selection) {
          const cell = document.createElement("td");
          cell.className = "ds-data-table__selection-cell";
          cell.append(
            this.#checkbox({
              checked: selectedIds.has(id),
              label: `Select ${accessibleRowLabel(row, rowHeader, rowId)}`,
              rowId: id,
              onChange: (checked) => {
                const next = new Set(selectedIds);
                if (checked) next.add(id);
                else next.delete(id);
                const nextSelectedIds = model.rows
                  .filter((candidate) =>
                    next.has(asRowId(candidate[model.rowKey])),
                  )
                  .map((candidate) => candidate[model.rowKey]);
                this.#updateSelection(nextSelectedIds, id);
              },
            }),
          );
          tableRow.append(cell);
        }

        model.columns.forEach((column) =>
          tableRow.append(this.#bodyCell(column, row, rowIndex)),
        );
        tbody.append(tableRow);
      });
    }
    table.append(tbody);
    scrollRegion.append(table);

    liveRegion.className = "ds-data-table__live-region";
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    if (model.state?.kind === "error" && this.#previousStateKind !== "error") {
      liveRegion.textContent = model.state.message;
    }

    this.replaceChildren(scrollRegion, liveRegion);
    this.#previousStateKind = model.state?.kind ?? null;
  }

  #bodyCell(column, row, rowIndex) {
    const cell = document.createElement(column.rowHeader ? "th" : "td");
    const content = document.createElement("div");

    if (column.rowHeader) cell.scope = "row";
    if (column.align) cell.dataset.align = column.align;
    content.className = "ds-data-table__cell-content";
    content.append(this.#renderCell(column, row, rowIndex));
    cell.append(content);
    return cell;
  }

  #renderCell(column, row, rowIndex) {
    const value = row[column.id];

    if (!column.renderer) {
      const valueNode = document.createElement("span");
      valueNode.className = "ds-data-table__value";
      valueNode.append(textNode(value));
      return valueNode;
    }

    const renderer = this.#cellRenderers[column.renderer];
    if (typeof renderer !== "function") {
      throw new TypeError(
        `Data Table renderer “${column.renderer}” is not registered.`,
      );
    }
    const result = renderer({ column, row, rowIndex, value });
    if (!(result instanceof Node)) {
      throw new TypeError(
        `Data Table renderer “${column.renderer}” must return a DOM Node.`,
      );
    }
    return result;
  }

  #checkbox({
    checked,
    disabled = false,
    indeterminate = false,
    label,
    onChange,
    rowId,
  }) {
    const component = document.createElement("ds-checkbox");
    const control = document.createElement("input");

    control.type = "checkbox";
    control.checked = checked;
    control.disabled = disabled;
    control.indeterminate = indeterminate;
    component.setAttribute("size", "medium");
    control.setAttribute("aria-label", label);
    if (label.startsWith("Select all ")) control.dataset.selectionAll = "";
    if (rowId !== undefined) control.dataset.selectionRow = rowId;
    control.addEventListener("change", () => onChange(control.checked));
    component.append(control);
    return component;
  }

  #updateSort(column, direction) {
    this.#model = validateDataTableModel({
      ...this.#model,
      sort: { column, direction },
    });
    this.#render();
    Array.from(this.querySelectorAll(".ds-data-table__sort-button"))
      .find((button) => button.dataset.sortColumn === column)
      ?.focus();
    this.dispatchEvent(event("ds-sort-change", { column, direction }));
  }

  #updateSelection(selectedIds, focusTarget) {
    this.#model = validateDataTableModel({
      ...this.#model,
      selection: { ...this.#model.selection, selectedIds },
    });
    this.#render();

    const controls = this.querySelectorAll('input[type="checkbox"]');
    const control =
      focusTarget === "all"
        ? Array.from(controls).find(
            (input) => input.dataset.selectionAll === "",
          )
        : Array.from(controls).find(
            (input) => input.dataset.selectionRow === focusTarget,
          );
    control?.focus();
    this.dispatchEvent(event("ds-selection-change", { selectedIds }));
  }

  #stateRow(model, columnCount) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    const content = document.createElement("div");

    row.dataset.tableState = model.state.kind;
    cell.colSpan = columnCount;
    content.className = "ds-data-table__state-content";

    if (model.state.kind === "loading") {
      const spinner = document.createElement("ds-spinner");
      spinner.setAttribute("aria-hidden", "true");
      content.append(spinner);
    }
    if (model.state.kind === "error") {
      const badge = document.createElement("ds-badge");
      badge.setAttribute("color", "destructive");
      badge.textContent = "Load error";
      content.append(badge);
    }
    content.append(textNode(model.state.message));

    if (model.state.action) {
      const buttonComponent = document.createElement("ds-button");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = model.state.action.label;
      button.addEventListener("click", () => {
        this.dispatchEvent(
          event("ds-data-table-action", {
            id: model.state.action.id,
            state: model.state.kind,
          }),
        );
      });
      buttonComponent.setAttribute("variant", "outline");
      buttonComponent.append(button);
      content.append(buttonComponent);
    }

    cell.append(content);
    row.append(cell);
    return row;
  }
}

if (canUseDOM && !customElements.get(tagName)) {
  customElements.define(tagName, DataTable);
}

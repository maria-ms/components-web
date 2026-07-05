import { defineTextField } from "../input/text-field.mjs";

const searchIcon = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

const clearIcon = `
  <button
    part="clear-button"
    class="clear-button"
    type="button"
    aria-label="Clear search"
    data-clear
    hidden
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-figma-node-id="40012621:11743"
      data-icon="x"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
`;

const searchStyles = `
  .control::-webkit-search-cancel-button,
  .control::-webkit-search-decoration {
    display: none;
    appearance: none;
    -webkit-appearance: none;
  }

  .clear-button {
    display: grid;
    width: var(--ds-primitive-space-05);
    height: var(--ds-primitive-space-05);
    flex: 0 0 auto;
    place-items: center;
    border: 0;
    border-radius: var(--ds-primitive-radius-03);
    padding: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  .clear-button[hidden] {
    display: none;
  }

  .clear-button:focus-visible {
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

  .clear-button svg {
    display: block;
    width: 16px;
    height: 16px;
  }
`;

/**
 * Form-associated search input.
 *
 * @tag ds-input-search
 * @attr {string} name - Form field name.
 * @attr {string} value - Initial value used by form reset.
 * @attr {string} placeholder - Placeholder text shown when the input is empty.
 * @attr {string} autocomplete - Native autocomplete hint.
 * @attr {boolean} disabled - Disables the input.
 * @attr {boolean} readonly - Prevents editing while keeping the value submittable.
 * @attr {boolean} required - Requires a value before form submission.
 * @attr {"small"|"medium"} size - Visual size. Defaults to medium.
 * @attr {string} aria-label - Accessible name when no visible field label is provided.
 * @attr {string} aria-labelledby - Accessible name reference.
 * @attr {string} aria-describedby - Accessible description reference.
 * @slot prefix - Optional leading replacement for the search icon.
 * @slot suffix - Optional trailing replacement for the built-in clear button.
 * @prop {string} value - Live value. Setting it does not rewrite the value attribute.
 * @fires input - Fired when the value changes.
 * @fires change - Fired when the value is committed.
 */
export const InputSearch = defineTextField({
  tagName: "ds-input-search",
  clearable: true,
  defaultType: "search",
  extraStyles: searchStyles,
  prefixFallback: searchIcon,
  prefixHasFallback: true,
  suffixFallback: clearIcon,
  typeAttribute: false,
});

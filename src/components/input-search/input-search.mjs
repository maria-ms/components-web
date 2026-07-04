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
 * @slot label - Optional visible label content.
 * @slot description - Optional helper or validation text.
 * @slot prefix - Optional leading replacement for the search icon.
 * @slot suffix - Optional trailing icon or text.
 * @prop {string} value - Live value. Setting it does not rewrite the value attribute.
 * @fires input - Fired when the value changes.
 * @fires change - Fired when the value is committed.
 */
export const InputSearch = defineTextField({
  tagName: "ds-input-search",
  defaultType: "search",
  prefixFallback: searchIcon,
  prefixHasFallback: true,
  typeAttribute: false,
});

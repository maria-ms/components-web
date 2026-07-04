import { defineTextField } from "../input/text-field.mjs";

/**
 * Form-associated text input.
 *
 * @tag input-text
 * @attr {string} name - Form field name.
 * @attr {string} value - Initial value used by form reset.
 * @attr {string} type - Native text input type. Defaults to text.
 * @attr {string} placeholder - Placeholder text shown when the input is empty.
 * @attr {string} autocomplete - Native autocomplete hint.
 * @attr {string} inputmode - Native virtual keyboard hint.
 * @attr {string} pattern - Native validation pattern.
 * @attr {string} minlength - Native minimum text length.
 * @attr {string} maxlength - Native maximum text length.
 * @attr {boolean} disabled - Disables the input.
 * @attr {boolean} readonly - Prevents editing while keeping the value submittable.
 * @attr {boolean} required - Requires a value before form submission.
 * @attr {"small"|"medium"} size - Visual size. Defaults to medium.
 * @attr {"top"|"start"} label-position - Label placement. Defaults to top.
 * @slot label - Visible label content.
 * @slot description - Helper or validation text.
 * @slot prefix - Optional leading icon or text.
 * @slot suffix - Optional trailing icon or text.
 * @prop {string} value - Live value. Setting it does not rewrite the value attribute.
 * @prop {string} defaultValue - Initial value reflected through the value attribute.
 * @fires input - Fired when the value changes.
 * @fires change - Fired when the value is committed.
 */
export const InputText = defineTextField({
  tagName: "input-text",
  defaultType: "text",
});

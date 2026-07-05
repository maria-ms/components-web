# Pre-02 Readiness Audit

This audit captures the local engineering state while the Figma source is still
being migrated by Prompt 02. Do not use this as the final Figma/code alignment
audit for form components.

## Package Shape

- `../tokens` owns Figma Export Modes sources, the DTCG-style intermediate
  token model, and generated CSS/JS/React Native outputs.
- `components-web` owns the Web Components package. It imports generated token
  CSS from `@maria-ms/tokens` at consumption time and keeps component modules as
  plain `.mjs`.
- `../storybook-web` owns component examples, docs, and review surfaces. It
  should demonstrate composition patterns, not redefine component behavior.
- `../tokens-plugin` is a local helper for exporting Figma variable modes into
  the `../tokens/sources` shape.

Each publishable package is an independent repo. The `ds` folder is only a local
workspace container.

## Checks Run

- `npm run check` in `../tokens`
- `npm run check` in `components-web`
- `npm run check` in `../storybook-web`
- `npm run check` in `../tokens-plugin`

All passed before this audit document was written.

## Future Local Audits

Do not add source-level audit scripts until Prompt 02 is complete and the Figma
component anatomy is stable.

Useful future checks may include:

- every generated `var(--ds-...)` referenced by components exists in both light
  and dark token CSS
- input/select primitives do not own field label, description, or error slots
- stories compose fields and field groups instead of encoding product-specific
  patterns inside primitive controls

These checks should remain documentation until the Figma source of truth has
settled.

## Current Component State

- `ds-field` and `ds-field-group` already exist in code, but the Figma source
  still needs to complete Prompt 02 before they should be treated as final.
- Input primitives are already mostly separated from visible label,
  description, and error content locally.
- `ds-input-text`, `ds-input-search`, and `ds-input-number` share the internal
  text-field shell pattern.
- `ds-input-select` follows the customizable select model and remains a form
  value control, not an action menu.
- `ds-dropdown` is an action/settings menu. It is not a select replacement.
- `ds-button`, `ds-avatar`, `ds-alert`, and `ds-accordion` are presentational or
  interactive shells with consumer-provided content where appropriate.

## Expected Follow-Up After Prompt 02

1. Export the updated Figma variable modes into `../tokens/sources`.
2. Run `npm run check` in `../tokens`.
3. Run `npm run audit` in `components-web`.
4. Use Figma MCP to audit the final Field, Field Group, input, and select
   artboards against the rebuilt token CSS.
5. Update component internals to consume the new generated component geometry
   tokens where they exist.
6. Update Storybook stories so labels, descriptions, errors, currency, phone,
   and select-plus-input examples are shown through `ds-field` and
   `ds-field-group` composition.
7. Run `npm run check` in `components-web` and `../storybook-web`.
8. Run `npm run build` in `../storybook-web`.

## Known Provisional Areas

- Some component geometry is still represented as local custom properties or
  primitive spacing references in code. That should be revisited after Prompt 02
  and the next token export, not guessed now.
- Storybook composition may still need another cleanup pass once the Figma
  Field/Field Group model is final.
- Final visual matching should wait for fresh Figma exports and an MCP audit.

You are working in `<repo-root>/ds`.

Add one new Web Component to `components-web`.

Before doing anything else, ask me for the Figma component selection/artboard
node URL. Do not inspect, design, or implement the component until I provide
that URL.

After I provide the URL, use the `figma-desktop` MCP namespace to inspect the
node. If `figma-desktop` is not exposed, stop and report that the required MCP
server is unavailable.

## Goal

Create the smallest professional Web Component that matches the Figma design
system, consumes generated token CSS, and stays composable for future product
use cases.

The design-system model is:

- primitive controls
- structural wrappers
- stable behavior shells
- composed patterns in Storybook/Figma, not rigid product-specific package
  components

Treat the Figma artboard as design evidence, not as a 1:1 implementation
contract. The artboard may contain variants, states, example content, and
product-specific usages. Extract the reusable component boundary before writing
code.

## Required Context

Inspect these before designing the API:

- `components-web/docs/manifest.md`
- `tokens/sources/figma-export-modes`
- `tokens/dist/css/light.css`
- `tokens/dist/css/dark.css`
- `components-web/src/components/*`
- `components-web/package.json`
- `storybook-web/src/*.stories.mjs`

Do not invent a new architecture. Follow the existing `.mjs`, Web Components,
Shadow DOM, token, and Storybook conventions.

## Classify First

Classify the Figma node before implementation:

- **Form control**: a styled native-like input, select, button, or similar
  control that owns a value and participates in forms.
- **Field wrapper**: supplies label, description, error placement, and
  accessibility wiring around one or more controls, but does not own a form
  value.
- **Disclosure/menu/interactive shell**: owns stable interaction behavior such
  as `open`, `expanded`, selected/checkable item state, keyboard behavior, and
  dismiss behavior.
- **Presentational/status shell**: owns visual identity only and renders
  consumer-provided content.
- **Product pattern**: a composed use case that should live in Storybook,
  Figma examples, or app code.

If the Figma node is mostly a product pattern, stop and propose a composition
instead of creating a package component.

Examples that should normally stay compositions:

- currency amount field
- phone number field
- country selector with extra product rules
- profile menu
- payment method row
- page header
- footer
- dashboard card
- billing section

Only create a compound package component when the compound has stable reusable
behavior, meaningful accessibility requirements, tokenized states, and repeated
cross-product use that would be error-prone to rebuild from smaller parts.

## Figma Audit

From the Figma node, capture:

- visible variants and states
- repeated structure shared by variants
- optional regions such as icons, avatars, media, metadata, shortcuts, badges,
  controls, custom actions, and helper content
- which parts are component-owned and which parts are consumer-owned
- states such as hover, focus, focus-visible, disabled, readonly, invalid,
  selected, checked, expanded, open, loading, and filled
- keyboard, form, or dismissal behavior implied by the component
- responsive or density differences, if visible

Do not mirror every Figma variation as a separate component or story. Use the
variations to infer the smallest durable API and the most composable internal
structure.

## Token Gate

Identify the Figma variables/tokens referenced by the component.

Verify every visual token needed by the component exists in both:

- `tokens/dist/css/light.css`
- `tokens/dist/css/dark.css`

Use generated CSS custom properties from `@maria-ms/tokens`. Prefer
semantic/component tokens over primitive tokens when available.

If a required Figma-bound token is missing, stop and report:

- the missing token or Figma variable
- where it is used in the Figma component
- what the designer needs to fix in Figma or the token export

Do not hardcode missing design-token values.

## Component Boundary

Each component should be as composable as possible inside its real
responsibility.

The component owns:

- behavior
- structure
- accessibility
- keyboard behavior where relevant
- component-owned state
- tokenized visual identity
- intrinsic internal geometry
- slots/parts that define where consumer content parks

The consumer owns:

- product meaning
- business data
- labels and copy
- icons and media unless intrinsic to behavior
- actions
- validation timing
- page/form layout
- composition width and placement

Avoid rigid compounds such as `ds-currency-input`, `ds-phone-field`,
`ds-profile-dropdown`, or `ds-payment-method-row` unless the classification
step proves they are real reusable components rather than product patterns.

## API Rules

- Design the public API before implementation.
- Keep the API smaller than the Figma artboard surface.
- Prefer native web behavior and native attribute names.
- Prefer slots for consumer-owned content.
- Use attributes/properties for component-owned behavior, form behavior, or
  styling axes only.
- Do not add props that encode example content from Figma, such as
  `avatarInitials`, `iconName`, `title`, `description`, `shortcut`,
  `badgeText`, or `items`, unless the component truly owns that behavior.
- Do not add React-style business state.
- Do not force consumers to duplicate the component for small content/layout
  differences.
- Separate components by behavior, not by example content.
- Do not create one mega component with a large `type` matrix unless the
  platform behavior remains clean and the public API stays small.

For consumer-owned icons/adornments:

- accept them through slots such as `start`, `end`, `media`, `icon`, or another
  existing local convention
- the component owns the parking space, alignment, sizing, padding, and
  disabled/invalid treatment
- the consumer owns which icon/media/content appears

Component-owned icons are appropriate only when intrinsic to behavior, such as:

- search clear button
- number stepper controls
- select chevron/checkmark
- accordion disclosure icon
- dropdown indicator

## Forms And Fields

For form controls:

- make the custom element form-associated with `ElementInternals` unless there
  is a concrete browser limitation
- mirror the relevant native API: `name`, `value`, `defaultValue`, `disabled`,
  `readonly`, `required`, constraint attributes, `form`, `validity`,
  `validationMessage`, `willValidate`, `checkValidity()`,
  `reportValidity()`, `setCustomValidity()`, `focus()`, and `blur()`
- use the internal native control for browser behavior and validation whenever
  possible
- expose or forward `input` and `change` events consistently with native
  controls
- keep visible invalid/error presentation parent-controlled through
  `aria-invalid="true"` and/or `ds-field invalid`

Form controls must not own visible label, description/helper text, or error
message slots. Those belong to `ds-field`.

`ds-field` should handle one control or a composed group of controls:

```html
<ds-field invalid>
  <span slot="label">Price</span>

  <div class="price-controls">
    <ds-input-select name="currency"></ds-input-select>
    <ds-input-number name="amount"></ds-input-number>
  </div>

  <span slot="description">Choose currency and amount.</span>
  <span slot="error">Enter a valid price.</span>
</ds-field>
```

Do not introduce or depend on `ds-field-group` by default. Use or add a
field-group component only if there is proven reusable grouped behavior such as
true fieldset/legend semantics, shared validation, attached-control styling,
group-level focus treatment, or repeated multi-control behavior that would be
error-prone to rebuild.

## Layout Rules

- Parent layouts, forms, fields, optional field groups, and Storybook examples
  own page/form sizing and flow.
- Components should not bake in Figma frame widths such as `276px`, `343px`,
  `440px`, or similar artboard/example dimensions as default widths.
- Reproduce fixed example widths in Storybook or parent compositions, not in
  component defaults.
- Form controls and wrappers should generally be block/full-width-friendly:
  `display: block` or `display: grid`, `width: 100%`, `max-width: 100%`.
- Content-sized components such as buttons, avatars, badges, icons, and menu
  triggers may keep natural intrinsic sizing.
- Keep intrinsic dimensions only when they are part of component identity or
  behavior: avatar size, icon size, OTP cell size, control height, internal
  padding, select picker width matching the trigger, menu surface width, and
  similar internal geometry.
- If a pattern needs horizontal layout, set that on the wrapper in the story or
  consumer composition.
- Do not add `direction`, `layout`, `width`, or `inline` attributes unless the
  component itself is explicitly a layout primitive.

## Implementation Rules

- Use plain `.mjs` modules.
- Add JSDoc only where it helps intellisense or explains non-obvious behavior.
- Use custom elements, Shadow DOM, `template.innerHTML`, `WeakMap` instance
  state, and small helper functions like the existing components.
- Avoid OOP-heavy abstractions beyond the custom element class itself.
- Do not add framework code, TypeScript, build tools, new dependencies,
  fallback APIs, broad runner code, or extra layers of indirection.
- Keep the component useful as a reference model for other platforms. Platform
  syntax may differ, but the responsibility boundary, state model, token usage,
  and composition rules should be clear enough to map to React Native, iOS,
  Android, or other targets.

## Styling Rules

- Use generated CSS custom properties from `@maria-ms/tokens`.
- Prefer semantic/component tokens over primitive tokens.
- Do not hardcode colors, shadows, typography, radius, spacing, or component
  geometry when a generated token exists.
- Do not add `letter-spacing: 0`; omit letter spacing unless Figma maps it to a
  real token.
- Keep `font-family: inherit`; the app/root owns font loading and family
  selection.
- Use `box-sizing: border-box`.
- Use low-specificity component-local selectors.
- Use `:host`, slots, and `part` consistently with existing components.
- Use `:focus-visible` and tokenized focus shadows for interactive controls.
- Do not switch to constructable stylesheets unless the package adopts that
  convention globally.

## Package Contract

- Add the component under
  `components-web/src/components/<component-name>/<component-name>.mjs`.
- Export it from `components-web/src/components/index.mjs`.
- Add a subpath export in `components-web/package.json`, for example:
  `"./button": "./src/components/button/button.mjs"`.
- Keep `"sideEffects": true`.
- Update the `components-web` `check` script so the new component is
  syntax-checked.
- Consumers must be able to import only this component:
  `import "@maria-ms/components-web/<component-name>";`

## Storybook Contract

- Add or update a story in `storybook-web/src`.
- Import only the component subpath needed by the story.
- If the story uses another component, import that specific subpath too.
- Stories do not need to match Figma variants 1:1.
- Stories should document the clean component API and the main reusable states
  or use cases.
- Prefer a small story set:
  - default usage
  - important semantic states
  - composition examples with slotted content
  - form or interaction behavior when relevant
  - one grouped visual overview only when it helps designers review coverage
- Hide story/demo-only args from Controls.
- Controls should expose only real public component attributes/properties.
- Story examples may include local demo icons, avatars, copy, or layout, but
  that content belongs in Storybook, not in the component package.
- Form-control stories with visible labels/help/errors must compose `ds-field`
  around the primitive or composed controls.
- Do not pass `slot="label"` or `slot="description"` into primitive
  input/select components.
- Story examples should set composition widths, form layout, wrapper direction,
  and child control proportions explicitly when needed.
- If Figma shows a compound use case, write it as a composition story first.
- Show clean consumer-facing HTML source for the specific story instance, not
  internal helper code and not every Figma artboard variation.
- Update `storybook-web/package.json` `check` script to include the new story.

## Validation

Run:

- `npm run check` in `tokens` if token output may be stale
- `npm run check` in `components-web`
- `npm run check` in `storybook-web`
- `npm run build` in `storybook-web`

Also verify:

- every `var(--ds-...)` used by the new component exists in both light and dark
  token CSS
- the component does not contain missing-token hardcodes
- form controls work inside a native `<form>` where applicable
- labels/descriptions/errors are handled through `ds-field`
- Storybook examples are composition examples, not hidden product APIs

## Final Response

Summarize:

- the component classification
- the public API
- the Figma node used
- token families used
- any Figma/token gaps found
- files changed
- checks/builds that passed or could not be run

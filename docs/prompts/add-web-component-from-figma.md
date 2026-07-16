# Add One Web Component From Figma

You are working in `<repo-root>/ds` with these existing independent packages:

- `tokens` -> `@maria-ms/tokens`
- `components-web` -> `@maria-ms/components-web`
- `storybook-web` -> `@maria-ms/storybook-web`

Add one component to the existing Web Component package. Do not scaffold,
rename, or migrate the packages.

## First Response

Before doing anything else, respond with only:

> Please send the exact Figma component selection or artboard node URL.

Do not inspect, plan, or implement the component until the URL is provided.

## Required Figma Tool

After receiving the URL, use the `figma-desktop` MCP namespace. If that namespace
is not exposed, stop and report that the required MCP server is unavailable. Do
not substitute another Figma connector.

Inspect the exact node before coding:

1. Retrieve design context for the selected node.
2. Retrieve metadata only when needed to map a truncated component set.
3. Capture a screenshot of the exact node and relevant variants.
4. Identify bound variables, component properties, assets, constraints, and
   interaction states.

Use Figma-generated framework output only as structural evidence. Do not copy
React, Tailwind, or generated implementation code into the package.

## Goal

Create the smallest professional `ds-*` Web Component that:

- follows `components-web/docs/manifest.md`
- preserves native semantics and browser behavior
- matches the reusable visual contract shown in Figma
- consumes generated `@maria-ms/tokens` CSS variables
- remains composable for future product use cases
- is documented with focused `.stories.mjs` stories

Treat the selected artboard as design evidence, not a one-to-one component API.
Variants may be states, example content, or product-specific compositions.

## Inspect Before Designing

Read:

- `components-web/docs/manifest.md`
- `components-web/package.json`
- `components-web/src/components/index.mjs`
- relevant existing component modules
- `tokens/sources/figma-export-modes`
- `tokens/dist/css/light.css`
- `tokens/dist/css/dark.css`
- relevant `storybook-web/src/*.stories.mjs`
- `storybook-web/package.json`

Respect existing user changes. Do not invent a new architecture.

## Classify The Node

Before implementation, classify the selected design as one of:

- **Primitive**: reusable behavior or visual identity with one responsibility.
- **Structural wrapper**: stable layout or accessibility relationships around
  consumer-provided content.
- **Behavior shell**: stable interaction behavior such as disclosure, menu,
  dismissal, or selection.
- **Product pattern**: an arrangement of existing parts tied to a workflow or
  example.

If it is primarily a product pattern, stop and propose the composition that
belongs in Storybook, Figma examples, or application code. Do not create a rigid
package component merely because Figma contains a component set.

Only package a compound when it has repeated cross-product behavior, meaningful
accessibility requirements, tokenized states, and a durable API that would be
error-prone to rebuild from smaller parts.

## Audit The Design

Capture:

- shared structure across variants
- visual and interaction states
- optional regions and consumer-owned content
- intrinsic versus example geometry
- native semantics implied by the behavior
- keyboard, focus, form, selection, or dismissal behavior
- responsive, density, localization, and RTL implications
- intrinsic assets such as chevrons, checkmarks, or disclosure icons

Do not mirror every Figma variant as an attribute, component, or story. Infer the
smallest durable responsibility and API.

## Token Gate

Map every Figma-bound visual variable needed by the component to generated CSS.
Verify each required token exists in both:

- `tokens/dist/css/light.css`
- `tokens/dist/css/dark.css`

Use this preference order:

1. component token
2. semantic token
3. primitive token for intentionally invariant geometry or where no more
   meaningful exported token exists

If a required Figma-bound token is missing, stop and report:

- the Figma variable/token name
- the property and node where it is used
- whether the gap is in Figma binding, Export Modes source, or generated output
- the exact upstream action needed

Do not hardcode the missing value, add a CSS fallback, invent a replacement
token, or modify the token pipeline unless explicitly asked.

## Design The Public API First

The component owns behavior, semantics, accessibility, intrinsic geometry,
tokenized states, and stable content regions.

The consumer owns product data, business copy, validation timing, surrounding
layout, composition width, and non-intrinsic icons/media/actions.

Use:

- native attribute names and behavior where applicable
- slots for consumer-owned DOM content
- attributes for small serializable configuration
- properties for richer or native-like state
- native events when their semantics fit
- custom events only when no standard event fits
- CSS parts/custom properties only as intentional stable styling surfaces

Do not expose Figma example content as props, accept consumer HTML strings,
serialize complex data into attributes, expose internal classes, require private
shadow access, or create a large visual `variant` matrix.

Custom events must document their name and payload. Set `bubbles`, `composed`,
and `cancelable` only when required by the consumer interaction contract.

## Native And Accessibility Contract

Implement in this order:

1. correct native HTML
2. native browser APIs and behavior
3. progressive enhancement
4. ARIA only for semantics or state native HTML cannot express
5. custom interaction only when genuinely necessary

Do not use a generic element as a control when a native control is suitable. Do
not add redundant roles or ARIA. Verify accessible naming, keyboard behavior,
focus visibility, tab order, state exposure, pointer/touch behavior, and absence
of keyboard traps.

Use open shadow DOM only when it does not break semantic or accessibility
relationships. Consumers must not depend on private DOM.

Consider forced colors, reduced motion, RTL, localization, zoom/reflow, touch
targets, and contrast when applicable to the component.

## Form Controls

When the component is a form control:

- preserve the relevant native API and failure modes
- use an internal native control whenever possible
- use `ElementInternals` when the custom element itself must participate in forms
- support applicable value, default value, name, disabled, readonly, required,
  constraint validation, form reset, state restoration, focus, and blur behavior
- emit native-like `input` and `change` events with appropriate timing
- keep visible label, description, and error content outside the primitive

Use an existing public field wrapper for visible field content only if one is
currently exported by `@maria-ms/components-web`. Otherwise use correct native
labeling in the story and report the wrapper as a separate prerequisite; do not
silently create it during this task.

## Layout And Styling

- Use generated CSS variables from `@maria-ms/tokens`.
- Do not hardcode tokenized color, typography, spacing, radius, shadow, or
  component geometry.
- Keep `font-family: inherit`; the application root owns font loading.
- Omit letter spacing unless Figma maps it to an exported token.
- Use logical properties, intrinsic sizing, resilient wrapping, and
  `box-sizing: border-box`.
- Parent layouts own page/form width and flow.
- Components own only intrinsic geometry that is part of their identity or
  behavior.
- Use `:focus-visible` and exported focus tokens where relevant.
- Do not leak styles globally or reset unrelated consumer styles.
- Do not switch styling architecture as part of this task.

## Implementation Contract

- Use plain `.mjs` and useful JSDoc.
- Follow the existing native Custom Element, open Shadow DOM,
  `template.innerHTML`, small-helper, and `WeakMap` conventions where applicable.
- Keep implementation direct; avoid framework code and unnecessary abstraction.
- Do not add TypeScript, Lit, dependencies, build tooling, generated type files,
  Custom Elements Manifest tooling, or registration frameworks.
- Clean up listeners, observers, timers, and subscriptions.
- Support connection, disconnection, and reconnection.
- Make registration idempotent.

Add the module at:

`components-web/src/components/<name>/<name>.mjs`

The module must export its public class/classes and register its own `ds-*`
element family. Then:

- export the classes from `components-web/src/components/index.mjs`
- add `./<name>` to `components-web/package.json` exports
- include the module in the existing `check` script
- keep `sideEffects: true`

Consumers must be able to import only that component:

```js
import "@maria-ms/components-web/<name>";
```

Do not introduce a class-only registration layer or `register-all` entry point.

## Storybook Contract

Add focused `.stories.mjs` coverage under `storybook-web/src`.

- Import only public `@maria-ms/components-web/<name>` subpaths.
- Import every additional component through its own public subpath.
- Use a small story set: default, important semantic states, meaningful
  composition, and interaction/form behavior when relevant.
- Do not reproduce Figma variants one-to-one.
- Expose only real public API through Controls.
- Hide demo data and layout-only args from Controls.
- Keep product copy, icons, media, and composition layout in Storybook.
- Show clean consumer-facing HTML for each story instance.
- Do not use private story CSS to conceal a component API defect.
- Add the story file to the existing Storybook `check` script.

Do not add Playwright, another testing framework, generated documentation, or CI
infrastructure during this component task. Use the separate audit prompt when a
deeper hardening pass is requested.

## Validation

Run the repository's existing contracts:

1. `npm run check` in `tokens` when token output may be stale
2. `npm run check` in `components-web`
3. `npm run check` in `storybook-web`
4. `npm run build` in `storybook-web`
5. `npm pack --dry-run` in `components-web` when package exports changed

Also verify:

- every used `var(--ds-...)` exists in light and dark CSS
- there are no missing-token hardcodes or fallbacks
- public subpath import and duplicate registration work
- form behavior works in a native `<form>` when relevant
- the Storybook implementation visually matches the selected Figma node at
  representative states and widths

Do not claim a check passed unless it was executed successfully.

## Final Response

Report concisely:

- classification and public API
- Figma node used
- token families consumed
- accessibility and native-platform decisions
- files changed
- commands and actual results
- intentional differences from Figma
- genuine Figma/token/tooling blockers

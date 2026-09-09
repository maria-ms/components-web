---
name: implement-figma-web-component
description: Autonomously research and implement an approved Maria Figma public component as a small, standards-aligned, product-agnostic Web Component.
---

# Implement a Maria Web Component

## Mission

Given an approved Maria Figma component page or public-asset name, independently
create or reconcile its Web Component implementation in `ds/components-web`.

Research the current open-web platform and established composition patterns
before deciding the API. Translate the component’s intent—not every Figma layer
or preview control—into the smallest stable, product-agnostic interface.

The user only needs to identify the Figma component. Make ordinary
implementation decisions independently.

## Discover and decide

Before writing, inspect:

- The public Figma master, its Slots, allowed children, geometry, states, and
  page guidance.
- Its compact contract, when present.
- Related Maria components, tokens, package conventions, Storybook, and tests.
- Relevant MDN and HTML/W3C/WHATWG documentation for semantics, accessibility,
  native behaviour, or browser capabilities. Use shadcn only as a useful
  composition comparison.

Validate the mapping, not just the labels: every Figma variant/property value
must correspond to its actual visual geometry or state. Treat duplicate,
misnamed, or visually contradictory variants as a source defect to resolve
before mirroring them in code.

Then decide the best implementation using these principles:

1. **Platform first.** Use native HTML for semantics, forms, focus, keyboard
   interaction, and validation. Add ARIA only where native HTML cannot express
   the need.
2. **Small public API.** Expose only stable attributes, properties, and events
   that a consumer genuinely needs to control or observe.
3. **Composition over variants.** Use children or Slots for rich, variable
   content. Do not turn example content, Figma previews, or product states into
   code API.
4. **Clear ownership.** The component owns its own semantics, interaction, and
   internal visual geometry. The parent owns layout, outer width, and
   cross-sibling/group behaviour. The product owns data and copy.
5. **Portable geometry.** Parent-fill components use the inline width their
   parent provides. Intrinsic components size to their content or an explicit
   size. Figma source dimensions are visual references, not shipped widths.
6. **Maria visual fidelity.** Use generated `--ds-*` tokens. Do not hard-code
   a Figma-bound value when a token is missing.

Test the chosen boundary mentally and in code against plain, long, rich, and
allowed nested content; documented states; and normal product layout use. A
legitimate composition must not require detaching.

## Implement

Proceed autonomously with normal implementation work:

- Create or update the compact contract for a new component using only
  `html`, `aria`, `figma`, and `rules`.
- Implement the smallest semantic DOM, CSS, properties, events, and child
  structure that satisfy the chosen boundary.
- Keep custom-element registration SSR-safe; keep component CSS in
  `<component>.css` and export it through `styles.css`.
- Add public exports and use the public package subpath in Storybook.
- Keep a single `Playground` story that demonstrates only the actual component
  interface. Neutral reference geometry is allowed; product compositions,
  product copy, fake data models, and Figma-only controls are not.
- When a story needs a composed trigger or child, use an existing Maria public
  component that the Figma page permits or demonstrates. Do not introduce a
  one-off SVG, private fixture, or substitute component merely to make the
  story render.
- Keep the visible story pure. Do not use a story `play` function that mutates
  the Canvas or leaves it in a test state. Add automated interaction evidence
  only for deterministic, contract-defined behaviour, using an isolated
  fixture that cleans itself up and respecting the repository's current test
  policy.

## Stop and ask only when necessary

Stop before changing code when:

- Figma and the compact contract conflict about semantics, ownership, or allowed
  composition.
- A required Figma-bound value has no generated token.
- The Figma component is not approved or does not contain enough information to
  determine a safe public boundary.
- The best solution would require a product-specific API, a breaking migration,
  or a separate component.

Explain the conflict, the recommended option, and its impact. Do not silently
invent an API or change the Figma public interface.

## Verify

Run after every component, CSS, contract, or Storybook change:

```sh
cd ds/components-web && npm run check
cd ds/storybook-web && npm run build
cd ds/storybook-web && npm run test:storybook -- --run
```

Confirm native semantics, accessible relationships, intended composition,
parent-fill or intrinsic geometry, supported token modes, and absence of
product-specific API.

For browser-managed primitives such as Popover or Dialog, verify final author
CSS in both supported and fallback paths: the component is absent on first
render, opens from its authored trigger, is positioned correctly, and any
intentional external geometry (such as an arrow) is not clipped.

Report:

```text
Research and implementation decisions:
Actual public package API:
Figma-only mappings:
Composability evidence:
Files changed:
Checks:
Figma follow-ups: none | [list]
Unresolved gaps: none | [list]
```

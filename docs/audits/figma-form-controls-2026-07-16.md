# Figma form-control audit — 2026-07-16

## Scope

The supplied links target one Figma file and twelve node IDs. The required
`figma-desktop` MCP namespace was available. Exact design context, bound
variables, and screenshots were retrieved for the accessible Button,
Destructive Button, and Icon Button component sets and representative variants.

## Classification and implementation

- `40021535:19433` — Button documentation frame. Its reusable child set is a
  primitive. Implemented as `ds-button`.
- `40021535:21204` — Destructive Button documentation frame. This is a tone of
  the same primitive, not a separate element. Implemented with
  `tone="destructive"`.
- `40021535:22571` — Icon Button documentation frame. This has the same native
  behavior and visual state model as Button. Implemented with `icon-only`, not
  a separate element.
- Figma `state` values represent interaction evidence. They map to native
  `:hover`, `:focus-visible`, and `:disabled` states rather than an attribute.
- Figma icon visibility and icon instance properties represent consumer-owned
  child composition. They do not become icon-name or show-icon properties.

`ds-button` decorates one native `<button>` or `<a>`. This keeps form
participation, submission, reset, keyboard behavior, link navigation, native
events, arbitrary attributes, and child DOM in the web platform instead of
reimplementing them in a form-associated custom element.

## Token gate

All bound Button variables used by the implementation are present in both
`tokens/dist/css/light.css` and `tokens/dist/css/dark.css`, including component
background/foreground/border tokens, four component heights, icon-only sizes,
semantic focus shadows, typography, spacing, and radii.

## Figma access and structure gaps

The following supplied IDs could not be audited as components in the active
desktop document:

- `40002045:15585` resolved to the zero-size page canvas named `↳ Inputs`, not
  to a component or artboard. `get_design_context` cannot inspect it.
- `40021506:17480`
- `40021507:14118`
- `40021507:16230`
- `40021507:18492`
- `40021507:22131`
- `40021507:23307`
- `40021510:24146`

For the last seven IDs, the desktop server reported that no node exists in the
active document. Consequently no bound-variable, property, descendant,
semantics, state, or screenshot audit was possible.

Upstream action: provide links whose `node-id` selects each exact component set
or component documentation frame in the current published file/version, and
open that file/version as the active Figma desktop tab. A page-level link is not
sufficient for implementation.

## Field and compound-control gaps

No `ds-field`, input, select, textarea, checkbox, radio, or compound input was
implemented because their supplied nodes were not inspectable. In particular,
the current evidence cannot answer these required questions unambiguously:

- whether visible label, description, error, optional, and required regions are
  separate structural properties or flattened into input variants;
- whether primitives are independent component sets reused by compounds;
- whether disabled, readonly, invalid, focus, filled, and placeholder are
  native states or manually duplicated presentation variants;
- which variables bind control border/background/foreground/focus/error states;
- whether select chevrons and other intrinsic affordances are instances with
  stable ownership;
- whether prefix/suffix buttons and selects are nested instances or detached
  vector/text layers;
- how label/description/error IDs and control association are represented for a
  durable `Field` wrapper.

For clear generation, Figma should expose:

1. Independent primitive component sets for each native control responsibility.
2. One `Field` structural component with label, description, and error as
   explicit optional regions and a nested control instance/slot.
3. Compounds assembled from published instances (`Field` + input/select/button),
   not flattened copies or boolean matrices for every product example.
4. Native interaction states named consistently and separated from example
   content states such as filled values.
5. Variable bindings on every tokenized property, with the same tokens exported
   to both light and dark distributions.
6. Component descriptions documenting semantics, content ownership, and which
   combinations are examples rather than supported primitive API.

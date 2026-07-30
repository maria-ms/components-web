---
name: create-figma-component-page
description: Create or revise a Maria canonical Figma component page. Use when adding a reusable component, migrating a legacy component page, or defining a public Figma interface before implementation.
---

# Create a canonical Figma component page

Before every Figma write, load `figma-use` and `figma-generate-library`.
Inspect the existing template, the closest canonical assets, variables, and the
native web element before changing anything.

## Decide the boundary

Create a reusable public asset only for a stable component or restricted
compound. Keep one-off screen layout in the product mockup.

- Native HTML owns semantics, permitted content, form behaviour, keyboard, and
  accessibility defaults.
- Figma variables and styles own visual values.
- A parent owns layout, label/message association, and coordination only when
  its contract says so. A child keeps its own interface and native behaviour.
- Use a restricted Slot only for a stable semantic child position. Do not mirror
  child properties on the parent.

Before writing, state the native target, public properties/defaults, allowed
children, ownership of labels/errors/status, non-goals, and any unresolved
decision. Do not infer public properties from an Appearance card or screenshot.

## Use the approved two-frame shell

On `[COMPONENT]-SHADCN`, create these top-level sibling frames:

```text
[Component] / Page                    Documentation only
  Page metadata
  Page content
    Page title
    01 Appearance
      Section title
      Section guidance
      Theme coverage
        Light
        Dark
    02 Examples
      Section title
      Section guidance
      Example list
        Example / [purpose]
    03 Using this component
      Section title
      Section guidance
      Use it for
      Configure in Figma
      Add content / combine components
      Property details
      Rules and limits

Asset source / [category]             Public masters only
  Source header
  Public component sets
    [Public component set]
```

Follow the live `COMPONENT-PAGE-TEMPLATE` rather than recreating the shell by
hand. A related family may share one Asset source frame and retain separate
documentation pages.

## Build the public master

- Put the only public component set or component in `Asset source / [category]`.
  Documentation frames contain linked instances only—never masters.
- Bind every visual value to existing variables/styles. Keep Light/Dark through
  variable modes; do not hard-code a replacement value.
- Use `Size` values in visual order Small → Medium → Large. Lay out each matrix
  row from Small to Large.
- Use public properties only for deliberate design choices. Map browser
  conditions such as disabled, focus-visible, invalid, hover, and open to a
  Figma `State` or preview only when designers genuinely need to configure or
  inspect it; never imply it is a code API.
- Restrict every Slot to approved public component sets. The child owns its
  intrinsic size and interface; the parent should not redraw or restyle it.
- Put focus effects on the painted interactive child. Keep the component root
  and any evidence container unclipped when the halo extends outward.
- Give the public master a short Assets-panel description: native boundary,
  intended use, and Slot limit where one exists. Do not paste package/API prose.

## Document without duplicating the master

- `01 Appearance` is Light/Dark theme coverage. Show states that need visual
  proof, including focus treatment; use linked public instances only.
- `02 Examples` shows real product assemblies using linked public assets. Add
  Light/Dark versions only when the example itself needs both modes to teach a
  decision.
- `03 Using this component` stays short and designer-facing. Keep purpose,
  non-obvious Figma configuration, allowed composition, property classification,
  and 2–5 durable limits. Do not repeat variant menus, token names, DOM/CSS,
  framework props, or sample text from the master.

## Validate

Confirm before reporting:

- two top-level frames only; public masters only in Asset source;
- exact public properties/defaults and restricted Slot children;
- every documentation/example instance remains linked;
- no private reference/master appears in Examples;
- public matrix is complete, ordered, unclipped, and token-bound;
- Light/Dark and focus halos render correctly;
- `03` follows the five subsections and has no duplicate specification;
- no unrelated page, component, token, variable, or style changed.

Report the component key, public interface, Slot eligibility, changed node IDs,
and screenshots of the Asset source and both appearance modes.

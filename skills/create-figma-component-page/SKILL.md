---
name: create-figma-component-page
description: Create or revise a Maria designer-facing Figma component page and public master. Use when adding a reusable component, migrating a legacy component page, or defining a public Figma interface before implementation.
---

# Create a canonical Figma component page

Before every Figma write, load `figma-use` and `figma-generate-library`.
Inspect the live template, closest canonical components, variables, and native
web element before changing anything.

## 1. Define the public boundary

State the native target, public Figma properties/defaults, allowed Slot
children, ownership of label/error/status, and non-goals. Do not infer a public
property from an Appearance card or screenshot.

Native HTML owns semantics, permitted content, form behaviour, keyboard, and
accessibility defaults. Variables/styles own visual values. A Slot is only for
a stable semantic child position; do not mirror child properties on its parent.

## 2. Use the approved shell

Follow the live `COMPONENT-PAGE-TEMPLATE`; do not rebuild it by hand.

```text
[Component] / Page                    Documentation only
  Page metadata
  Page content
    Page title
    01 Appearance
      Theme coverage
        Light
        Dark
    02 Examples
      Example list
    03 Using this component
      Use this when
      Configure in Figma
      Combine with
      Design guardrails

Asset source / [category]             Public masters only
  Source header
  Public component sets
    [Public component set]
```

A related family may share an Asset source frame while retaining separate
documentation pages.

## 3. Build the public master

- Put public masters only in `Asset source / [category]`; documentation uses linked instances only.
- Bind visuals to existing variables/styles and preserve Light/Dark modes.
- Lay out Size values Small → Medium → Large.
- Use public properties only for deliberate design choices. Mark browser conditions as Figma previews unless they are a real design control.
- Restrict Slots to approved public component sets. The child owns its intrinsic size and interface.
- Put focus effects on the painted interactive child and keep halo carriers unclipped.
- Add a short Assets-panel description: native boundary, intended use, and Slot limit where relevant.

## 4. Document for designers

- `01 Appearance`: Light/Dark visual proof, including focus treatment when needed.
- `02 Examples`: meaningful product assemblies using linked public assets.
- `03 Using this component`: concise purpose, non-obvious Figma actions, composition boundary, and 2–5 durable guardrails.

Do not add a property table by default. The public component panel is the
source for values and defaults. Do not repeat variant menus, tokens, DOM/CSS,
framework props, or sample text.

## 5. Validate

Confirm the two top-level frames, exact public properties/defaults, restricted
Slots, linked documentation instances, complete unclipped matrix, visible
focus halos, and no unrelated changes. Report the component key, public
interface, Slot eligibility, changed node IDs, and screenshots of the source
and both theme cards.

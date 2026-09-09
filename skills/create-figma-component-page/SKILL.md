---
name: create-figma-component-page
description: Autonomously research and create or revise a Maria Figma public component page with a small, composable, product-agnostic designer interface.
---

# Create a Maria Figma Component Page

## Mission

Given a component name or Figma reference, independently research and create
the smallest composable, product-agnostic Figma component page.

Use only Maria `*-SHADCN` pages in the Design System Figma file as existing
Figma architecture and authoring-pattern references. A legacy page may inform
visual styling only when the user explicitly supplies it; never infer public
API, component structure, Slots, variants, or page architecture from it.

The user identifies the component. The agent decides the appropriate master
structure, properties, Slots, geometry, documentation, and examples.

Create or revise Figma only. Do not implement Web code or create/change tokens.
Before every Figma Plugin API call, load `figma:figma-use`; before every Figma
write, also load `figma:figma-generate-library`.

## Research and decide

Inspect the target, the live component-page template, relevant Maria
`*-SHADCN` peers, Maria variables/styles/icons, and current MDN,
HTML/W3C/WHATWG guidance. Consult shadcn only as a composition comparison.

For an existing implementation revision, inspect its compact contract as
alignment evidence. For a new Figma component, do not let an absent or older
Web contract define the Figma interface.

Decide:

- Native semantic boundary and non-goals.
- Public masters versus parent-restricted child masters versus private
  structure.
- Variants for finite visual author choices.
- Slots for semantic, composable content.
- Parent-fill versus intrinsic geometry.
- Light/Dark evidence and examples needed for safe reuse.

Do not copy legacy structure, product layouts, browser-only states, Figma
preview evidence, or shadcn API into the public component interface.

## Build safely

Use the live template shell. A normal component Page contains:

```text
[Component] / Page             ← documentation and linked instances only
Asset source / [category]      ← shared Source header and public masters only
```

- Keep public masters directly inside `Asset source`, immediately after the
  shared Source header. Do not add wrapper frames or another asset label.
- Keep masters out of the documentation frame; documentation uses linked
  instances only.
- A parent-restricted child master may share the source only when it has no
  standalone or cross-component use.
- Bind visual values to existing Maria variables and styles. Do not hard-code a
  Figma-bound value or create a token.
- Preserve component keys and linked instances on revisions. Do not detach,
  recreate, or replace a master unless the user explicitly authorizes a
  migration.
- Hide internal structure from publication using Figma’s native control.
- Add concise public descriptions and Slot guidance.
- Use Appearance for Light/Dark visual evidence, Examples for meaningful linked
  composition, and Using this component for durable authoring guardrails.

## Stop only when necessary

Stop and report the conflict if:

- The target Page or master is ambiguous, duplicated, or unapproved.
- A necessary variable, style, icon, or Figma capability is missing.
- An approved contract conflicts with the Figma model during a revision.
- The best solution needs a product-specific API, a breaking migration, or a
  separate component.

Do not silently invent a public API or alter unrelated Pages, components,
tokens, styles, or existing instances.

## Validate and hand off

Inspect the live Figma result. Verify:

- Public master, properties, Slots, geometry, and descriptions match the chosen
  interface.
- Public masters are direct `Asset source` children; private structure is not
  published.
- Variables/styles are bound; Light/Dark evidence and focus treatment are
  visible and unclipped.
- Linked examples demonstrate relevant Slot composition without empty repeatable
  Slots, broken instances, overlap, or overflow.
- No unrelated component, token, style, Page, or existing instance changed.

When Web implementation is intended, include a proposed compact contract using
only applicable `html`, `aria`, `figma`, and `rules` keys.

Report:

```text
Research and design decisions:
Public interface:
Geometry ownership:
Slot validation:
Compact contract:
Validation:
Changed node IDs:
Target Figma Page:
Unresolved gaps: none | [list]
```

---
name: create-figma-component-page
description: Create or revise a Maria reusable Figma component, its public master, and its designer-facing page. Use when a designer wants to add, migrate, or change a component in the Maria Figma library before Web implementation.
---

# Create a Maria Figma component

Before every Figma write, load `figma:figma-use` and
`figma:figma-generate-library`. Work in small sequential writes and validate
after each one. This skill creates Figma; it does not implement Web code or
change tokens.

## 1. Start with a designer brief

If any answer is missing, ask only for:

1. Component name and intended Asset category, if known.
2. The user job: what people do or choose with it.
3. The choices designers need to configure in product mockups.
4. Existing public components it must contain or work beside.
5. A product-frame reference or a short example of intended use.

For a revision or migration, item 1 must include the exact Figma component or
page URL.

Do not ask designers to choose HTML, ARIA, variant axes, token names, or Figma
node structure. Derive those and present the recommendation.

## 2. Research before writing

Read only. Inspect:

1. The live `COMPONENT-PAGE-TEMPLATE`.
2. Two closest Maria component pages and their public masters.
3. Existing variables, styles, icons, and public assets that the component can
   reuse.
4. The colocated `components-web` contract when this is a revision of a shipped
   component.
5. The closest existing `contract.yaml` as a shape reference when a new
   component is intended for Web.
6. The relevant MDN element documentation for native semantics and the relevant
   shadcn component page for common composition patterns.

Source order:

1. The approved designer brief and product context define the user job.
2. MDN determines the native HTML and accessibility boundary.
3. Existing Maria masters, tokens, contracts, and the page template.
4. shadcn as a comparison source only.

Do not copy shadcn names, APIs, variants, tokens, or documentation. If any
sources disagree about semantics, ownership, allowed children, or a required
token, report the conflict and ask for a decision. Do not create a local
hard-coded substitute or fake a native semantic.

## 3. Propose, then wait

Before creating or changing nodes, return a compact proposal containing:

- native boundary and non-goals;
- public Figma properties, defaults, and which are Figma previews;
- Slots and their eligible public masters, if any;
- label, description, error, and disabled-state ownership;
- whether to create, revise, or reuse an existing public master;
- closest Maria references and any shadcn/MDN finding that affected the choice;
- source-matrix plan, Appearance proof, and product Examples;
- any unresolved decision.

Wait for explicit approval. Do not infer a public property from an Appearance
card, screenshot, or shadcn example.

## 4. Build the public master

Use only public masters inside:

```text
Asset source / [category]
  Source header
  Public component sets
    [Public component set]
```

A related family may share one Asset source frame but keeps separate
documentation pages. Documentation uses linked instances only.

- For a revision, preserve the component key. Do not detach, rebuild, or
  replace existing instances; migrate them and verify they stay linked.
- Use a property for a deliberate designer choice; use TEXT, BOOLEAN,
  INSTANCE_SWAP, and SLOT for their actual Figma purposes.
- A Slot represents one stable semantic child position. Restrict it to approved
  public masters. Never mirror a child's properties, size, or state on its
  parent.
- `State` is a Figma visual-preview property, not a Web API. Use it only for
  documented visual configurations. Do not make Hover a public State.
- For control primitives, order applicable State values: `Default →
  Focus-visible → Invalid → Invalid + focus-visible → Disabled`. Field and
  Choice Field use `Default → Error → Disabled` instead. Do not keep a separate
  Disabled axis when State includes Disabled.
- For a new set, create variant values in that order. If Figma's existing
  property menu cannot be reordered through the Plugin API, report the one
  exact manual reorder instead of claiming it changed.
- Treat displayed content, picker-open, and similar simulation controls as
  previews unless the approved brief makes them real design configuration.
- Bind visual values to existing variables/styles. If a needed token does not
  exist, stop for a token decision; do not hard-code a new visual value.
- Use Figma Grid or auto-layout for every variant matrix, never manual variant
  coordinates. When Size exists, show Small → Medium → Large across each row.
- Put focus effects on the painted interactive child. Every ancestor that must
  show the halo is unclipped.
- Add a short Assets-panel description: native boundary, intended use, and Slot
  limit where relevant.

## 5. Build the page from the live template

Follow `COMPONENT-PAGE-TEMPLATE`; do not recreate its shell or add components
inside `[Component] / Page`.

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
```

- `01 Appearance` is Light/Dark proof of relevant visual configurations. Show
  browser Hover as evidence only, not as a public State.
- `02 Examples` is a small set of meaningful product assemblies made with linked
  public assets.
- `03` is concise designer handoff: purpose, non-obvious configuration,
  composition boundary, and 2–5 durable guardrails. Do not add a property table
  by default or repeat menus, tokens, DOM/CSS, framework props, or sample text.

## 6. Validate and hand off

Verify the live Figma file, not just the write report:

- exact public properties, defaults, matrix combinations, and Slots;
- preserved component key on a revision, correct linked instances, and zero
  detached/broken instances;
- public master only in Asset source and zero COMPONENT/COMPONENT_SET nodes in
  the documentation page;
- variable-bound visuals, visible unclipped focus halos, and Light/Dark modes;
- source and documentation auto-layout with no overflow, overlap, or blank
  space;
- no unrelated components, tokens, styles, or pages changed.

When Web implementation is intended, include a proposed compact contract using
only applicable `html`, `aria`, `figma`, and `rules` keys; omit empty keys and
keep every rule to one durable constraint. Do not create framework API guidance
in Figma.

Return the public interface, contract facts, changed node IDs, and screenshots
of the Asset source plus Light and Dark Appearance cards.

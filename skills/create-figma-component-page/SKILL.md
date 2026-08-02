---
name: create-figma-component-page
description: Create or revise a Maria reusable Figma component, its public master, and its designer-facing page. Use when a designer wants to add, migrate, or change a component in the Maria Figma library before Web implementation.
---

# Create a Maria Figma component

Before every Figma Plugin API call, load `figma:figma-use`. Before every Figma
write, also load `figma:figma-generate-library`. Follow those system skills for
tool mechanics; this skill supplies Maria-specific decisions. Work in small
sequential writes and validate after each one. This skill creates Figma; it does
not implement Web code or change tokens.

## 1. Start with a designer brief

Start with the supplied name, Figma URL, product frame, or description. Research
before asking a questionnaire. For a revision or migration, use the exact URL.

Ask before research only when neither a component name nor a reference is
provided. After research, ask at most one concise question at a time, and only
when its answer materially changes the public interface or composition model.
Make a clearly labelled recommendation when a safe default exists.

Derive the Asset category, native boundary, Figma properties, Slots, token use,
and page structure. Do not ask designers to choose HTML, ARIA, variant axes,
token names, Figma node structure, or nearby reference components.

## 2. Research before writing

Read only. Inspect:

1. The live `COMPONENT-PAGE-TEMPLATE`.
2. Two closest live Maria `*-SHADCN` Pages, including their documentation,
   Asset source frames, and public masters.
3. Existing variables, styles, icons, and public assets that the component can
   reuse.
4. The colocated `components-web` contract when this is a revision of a shipped
   component.
5. The closest existing `contract.yaml` as a shape reference when a new
   component is intended for Web.
6. The relevant MDN element documentation for native semantics.
7. The relevant shadcn registry component through the available shadcn MCP:
   search it, inspect its details or examples when found, and use it only as a
   comparison for common composition patterns. Fall back to the official shadcn
   documentation only when the MCP cannot provide the component.

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

Before creating or changing nodes, return exactly:

```text
Decision: Create | Revise | Reuse
Target Figma Page(s):
Native boundary and non-goals:
Public Figma interface and defaults:
Slots:
Ownership:
References that affected the recommendation:
Source matrix, Appearance, and Examples:
Compact contract draft:
Open decision: none | [one question]
```

Wait for explicit approval. Do not infer a public property from an Appearance
card, screenshot, or shadcn example.

## 4. Build the public master

### Own one Figma Page

For every public component in the approved proposal, create or use one Figma
Page named `UPPERCASE-COMPONENT-NAME-SHADCN`. For example, `Accordion` uses
`ACCORDION-SHADCN`; a separately public `Accordion / Item` uses
`ACCORDION-ITEM-SHADCN`. Do not treat related components as a page family.

Before any node write:

1. Find Figma Pages with each exact target name.
2. Create a target Page only when it does not exist; stop when a target name is
   duplicated.
3. Call `figma.setCurrentPageAsync(targetPage)` and assert the current page is
   that page before creating, duplicating, moving, or editing a node.

Put every created or moved frame for that component on its target Page. Never
use the template page, a reference component page, or an unrelated page as a
write target. The live template is copied only as a shell into the target Page.

For a revision, use the existing approved canonical `*-SHADCN` Page. A legacy
reference on another Page remains read-only unless the user explicitly approves
its migration by URL.

Every normal component Page has exactly these top-level frames:

```text
[Component] / Page
Asset source / [category]
```

Its Asset source contains that Page's public master only. A parent uses another
component through a linked Slot instance; it does not own or copy the child's
master or documentation page.

Use the Page's public master only inside:

```text
Asset source / [category]
  Source header
  Public component sets
    [Public component set]
```

Documentation uses linked instances only.

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

Follow `COMPONENT-PAGE-TEMPLATE` by copying its shell onto the target Figma
Page; do not recreate it by hand or add components inside `[Component] / Page`.

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
- every target Figma Page has its exact `*-SHADCN` name and every newly created
  or moved node is on its component's Page; no node was created or moved on
  another Page;
- every normal component Page has only `[Component] / Page` and `Asset source /
  [category]` as top-level frames, with one public master in its Asset source;
- variable-bound visuals, visible unclipped focus halos, and Light/Dark modes;
- source and documentation auto-layout with no overflow, overlap, or blank
  space;
- no unrelated components, tokens, styles, or pages changed.

When Web implementation is intended, include a proposed compact contract using
only applicable `html`, `aria`, `figma`, and `rules` keys; omit empty keys and
keep every rule to one durable constraint. Do not create framework API guidance
in Figma.

Return exactly:

```text
Public interface:
Compact contract:
Validation:
Changed node IDs:
Target Figma Page(s):
Evidence: Asset source | Light Appearance | Dark Appearance
```

---
name: create-figma-component-page
description: Create or revise a Maria reusable Figma component, its public master, and its designer-facing page before Web implementation. Use when a designer wants to add, migrate, or change a reusable component in the Maria Figma library.
---

# Create a Maria Figma component

Create or revise Figma only. Do not implement Web code or change tokens.

Before every Figma Plugin API call, load `figma:figma-use`. Before every Figma
write, also load `figma:figma-generate-library`. Follow those skills for tool
mechanics. Work in small writes and validate each result visually and
structurally.

## 1. Collect the brief

Before research or Figma work, collect this compact brief if it is not already
provided:

1. Component name.
2. User job: what a person does with it.
3. Designer needs: what must be editable, repeatable, or composable in a mockup.
4. Existing reference: product screen, legacy Figma URL, or closest component;
   otherwise `none`.

For a revision or migration, require the exact Figma URL.

Do not create a public component from a name alone. Ask at most one further
question only when its answer changes the public interface or composition model.
Otherwise make a recommendation.

Derive HTML semantics, Asset category, variants, Slots, tokens, and Page
structure. Do not ask designers to choose HTML, ARIA, token names, Figma node
structure, or reference components.

## 2. Research current authoritative guidance before writing

Read only. Inspect:

1. The live `COMPONENT-PAGE-TEMPLATE`.
2. Two closest live Maria `*-SHADCN` Pages.
3. Existing Maria public assets, icons, variables, and styles.
4. The target component's colocated `contract.yaml`, if shipped.
5. The closest contract as a shape reference if this is new.
6. Relevant MDN documentation for the native semantic boundary.
7. The relevant shadcn registry component, if available, as comparison only.
8. Official Figma guidance only when Figma capability or authoring behaviour
   affects the proposed interface.

Use this precedence:

1. Approved brief and product context.
2. Native HTML and current MDN guidance; use WAI-ARIA guidance only when
   native HTML does not cover the pattern.
3. Existing Maria masters, tokens, contracts, and template.
4. Official Figma guidance for Figma-specific capability constraints.
5. shadcn comparison.

Do not adopt an external pattern merely because it is newer, and do not replace
native semantics with a custom ARIA pattern when native HTML covers the job.
Do not copy shadcn names, APIs, variants, tokens, or documentation. If sources
conflict on semantics, ownership, allowed children, required tokens, or Figma
capability, report the conflict and ask for a decision.

## 3. Decide before building

Before proposing properties, variants, or Slots, identify:

- **Ownership** — what belongs to this component, its parent, or its children.
- **Authoring** — what a designer deliberately chooses.
- **Derived behavior** — what follows from state, content, composition, or
  context.
- **Evidence** — what documentation must show but designers do not configure.
- **Composition** — allowed children, cardinality, repetition, shared behavior,
  and sizing ownership.

Expose only deliberate designer choices as public properties. Keep derived
behavior and documentation evidence internal.

A Slot represents one stable semantic child position. It is not an arbitrary
content container. Define allowed children, cardinality, and whether repeated
children are valid. Do not mirror child controls, size, or state on a parent.

When Figma cannot model a runtime-derived relationship dynamically, preserve the
correct public interface and use internal visual evidence. Do not add a fake
public property to compensate.

Before writing, return exactly:

```text
Decision: Create | Revise | Reuse
Target Figma Page:
Native boundary and non-goals:
Public Figma interface and defaults:
Derived behavior and evidence:
Slots, ownership, and layout responsibility:
Source matrix, Appearance, and Examples:
References that affected the recommendation:
Compact contract draft:
Open decision: none | [one question]
```

Wait for explicit approval.

## 4. Build the public master

Use one Figma Page per normal public component:

```text
UPPERCASE-COMPONENT-NAME-SHADCN
```

A public child master restricted to one parent Slot may live in that parent's
Asset source only when it has no standalone or cross-component use. It keeps its
own key and description but has no standalone documentation Page.

Before writing:

1. Find Pages with the exact target name.
2. Create the target Page only if it does not exist.
3. Stop if the target Page name is duplicated.
4. Assert the target Page is current before creating, moving, or editing nodes.

Every normal component Page has exactly these top-level frames:

```text
[Component] / Page
Asset source / [category]
```

Place public masters only in:

```text
Asset source / [category]
  Source header
  Public component sets
    [Public component set]
    [Approved parent-restricted child master, if any]
```

Documentation uses linked instances only.

Apply these rules:

- Preserve the component key on revisions. Do not detach, rebuild, or replace
  existing instances.
- Use TEXT, BOOLEAN, INSTANCE_SWAP, and SLOT only for their actual Figma
  purposes.
- `State` is a Figma visual-preview property, not a Web API. Do not make Hover
  a public State.
- For controls, create State values in this order:

  ```text
  Default → Focus-visible → Invalid → Invalid + focus-visible → Disabled
  ```

  Field and Choice Field use:

  ```text
  Default → Error → Disabled
  ```

- Bind visuals to existing variables and styles. Stop for a token decision if a
  needed token does not exist.
- Use Grid or auto layout for variant matrices; never manual variant positions.
  When Size exists, show Small → Medium → Large across each row.
- When programmatically appending a linked child into a Slot, set its layout
  deliberately. For a vertical Slot that fills horizontally, set the appended
  child to `layoutAlign: "STRETCH"` after insertion. Do not assume
  `stretchChildOnInsert` is applied by the Plugin API. Verify inserted child
  width equals Slot width.
- Put focus effects on the painted interactive child. Ancestors that must show
  a halo are unclipped.
- Add a short Asset-panel description: native boundary, intended use, and Slot
  restriction where relevant.

## 5. Build the documentation page

Copy the live `COMPONENT-PAGE-TEMPLATE` shell onto the target Page. Do not
recreate it by hand or place component masters inside `[Component] / Page`.

```text
[Component] / Page
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

- `01 Appearance` proves relevant visual configurations in Light and Dark.
  Browser Hover is evidence only.
- `02 Examples` proves meaningful product composition with linked public assets.
  Repeatable Slots require populated repeated-child evidence, not empty Slots,
  one-child placeholders, or decorative orphan layers.
- Documentation layout is parent-owned: horizontal wrappers fill available
  width; siblings share it through auto layout; examples fill their parent and
  hug vertically.
- Default documentation text is left-aligned unless another alignment is
  intentional.
- `03 Using this component` contains purpose, non-obvious configuration,
  composition boundary, and two to five durable guardrails. Do not duplicate
  menus, tokens, DOM/CSS, framework APIs, or sample content.

## 6. Validate and hand off

Verify the live Figma file, not the write report:

- public properties, defaults, variants, and Slot eligibility;
- component keys preserved on revisions;
- linked instances intact and zero detached or broken instances;
- public masters only in Asset source;
- zero COMPONENT or COMPONENT_SET nodes in the documentation frame;
- correct target Page name and top-level structure;
- every created or moved node on the target Page;
- variable-bound visuals, Light/Dark modes, and unclipped focus effects;
- populated linked evidence for every relevant public capability;
- for every Fill-width Slot, one inserted eligible child resolves to the Slot
  width;
- no overflow, clipping, overlap, empty example Slots, orphan layers,
  unintended fixed sizing, or stale layer names;
- no unrelated components, tokens, styles, or Pages changed.

Capture and inspect:

1. Public Asset source.
2. Full documentation page.
3. Light and Dark Appearance.
4. Every changed compound example.

When Web implementation is intended, include a compact proposed contract using
only applicable `html`, `aria`, `figma`, and `rules` keys. Omit empty keys and
keep each rule to one durable constraint.

Return exactly:

```text
Public interface:
Compact contract:
Validation:
Changed node IDs:
Target Figma Page:
Evidence: Asset source | Documentation | Appearance | Examples
```

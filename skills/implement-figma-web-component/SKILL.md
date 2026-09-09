---
name: implement-figma-web-component
description: Audit an approved Maria public Figma component, then create or reconcile a standards-aligned, product-agnostic Web Component whose interface supports real composition. Use for a Figma asset in ds/components-web.
---

# Implement a Maria Web Component

## Goal and definition of done

Turn an approved Figma component into the smallest stable Web Component API
that supports the widest legitimate range of product compositions. The result
must let a product team supply its data, content, and page layout without
detaching, reimplementing component semantics, or relying on product-specific
variants.

The component is done only when all of these are true:

- Native HTML owns semantics, keyboard interaction, form behaviour, and
  accessibility wherever the platform provides them; ARIA supplements native
  HTML only when necessary.
- The public API contains only stable, product-agnostic concepts: meaningful
  attributes/properties, slots or children for authored composition, and
  composed events where a consumer must observe a state change. It does not
  expose Figma preview controls, example content, or product data models.
- Each intended content region can accept the appropriate real native or Maria
  component composition. Structural restrictions are used only when they
  protect a semantic or ownership invariant.
- Geometry is portable: a parent-fill component takes the inline size supplied
  by its layout parent; an intrinsic component retains content- or
  size-determined width. Neither requires a screen-specific width to work.
- The Storybook evidence demonstrates the actual public API and representative
  composition. Automated checks prove contract-specific behaviour, not merely
  a screenshot-like static state.

Use MDN and relevant W3C/WHATWG specifications to establish the native
boundary. Use shadcn only as a battle-tested composition comparison: it may
reveal useful structure, but it never overrides the platform, Maria tokens, or
the approved Maria contract.

Audit first. Do not modify Figma, tokens, or package code until the user
approves the recommended course.

## 1. Identify and audit

If no approved public Figma component name or URL is supplied, ask exactly:

> Which approved public Figma component should I bring into `ds/components-web`? Paste its Figma URL or give its exact Asset name.

Then read, without writing:

1. The approved Figma asset name and its colocated Web contract, if one exists:
   `ds/components-web/src/components/<component>/contract.yaml`.
   `Button / Icon-only` uses `button/icon-button.contract.yaml`; `Select / Option`
   uses `select/option.contract.yaml`.
2. Its `html`, `aria`, `figma`, and `rules` only.
3. The live public master in `Asset source / [category]`, including whether it is
   intrinsic or parent-fill, its source-reference geometry, and its internal
   control or Slot sizing.
4. Its component page: Appearance, Examples, and designer guardrails.
5. Existing component source, CSS, public exports, generated token CSS, tests,
   and matching Storybook story.
6. Relevant MDN or normative platform documentation when the native boundary is
   new or changed, and the relevant shadcn page only when a composition pattern
   needs comparison.

For every public property, Slot, structural child, and event, answer these
questions before proposing an API:

- What platform or parent-owned responsibility does it represent?
- What legitimate authored composition does it enable?
- Does it protect a semantic/structural invariant, or is it a visual example
  being incorrectly promoted into public API?
- Can the same need be met by ordinary children, a Slot, native markup, or page
  layout rather than another variant, boolean, or component?

Explicitly test the proposed design against representative product-neutral
compositions: plain content, long or multiline content, an appropriate nested
Maria/native control where allowed, parent-controlled width, and every
contractual state. Identify any composition that would require detaching and
say whether that is a valid boundary or a gap.

Report exactly:

```text
Status: New | Aligned | Needs reconciliation
Figma interface and Slots:
Native/ARIA boundary:
Geometry ownership:
Composability evidence:
Compact contract: existing | proposed draft
Concrete package or Storybook mismatch:
Recommended action:
Approval needed: yes
```

Then stop for explicit approval. If a new component has no contract, the
recommended action is to create the proposed compact contract first. Do not
write it, invent an API, or implement during audit.

## 2. Reconcile after approval

Use this authority order:

1. Native HTML for semantics, form behaviour, validation, focus, and keyboard behaviour.
2. Contract for ownership, Figma-only previews, Slots, and non-goals.
3. Figma master for visual values, design defaults, and allowed inserted assets.
4. Package for custom-element API, DOM, CSS, tests, and browser workarounds.

Implement only genuine package API. Figma `preview` controls never become a
matching Web Component API. A Figma Slot is a restricted design composition;
follow the contract to decide the native child structure in code. Prefer an
authored child or Slot over an attribute when consumers need to supply rich,
variable, or interactive content. Prefer one parent-owned composition boundary
over duplicating that responsibility across children.

Keep geometry ownership explicit. A source-master width is a Figma reference,
not a shipped width. Parent layouts own inline size for parent-fill components;
the component owns its internal geometry and content-driven block size. In code,
make the host and its painted native control or Slot child fill available inline
size without adding a production demonstration width. Keep demonstration widths
in the local Storybook render wrapper. Intrinsic components remain intrinsic.

When behavior depends on siblings or a container—such as dividers, one-open
disclosure behavior, group-level missing-selection errors, selection, sorting,
or overflow—keep it parent-owned in the component and contract. Do not invent a
child property or runtime API merely to mirror Figma evidence. Conversely, do
not bury a consumer-observable state change inside the component: expose a
small, composed event and a controllable state API when real consumers need to
coordinate it.

For a new component, write the approved compact contract first, using only
`html`, `aria`, `figma`, and `rules` keys, then implement from it. MDN confirms
native semantics; shadcn can inform a composition comparison but never supplies
the shipped API, token values, or documentation.

If the public Figma master and contract disagree about semantics, ownership, or
allowed composition, stop and report the conflict. Do not silently make code
match one source by changing the other.

Use native controls rather than ARIA imitations. Use generated `--ds-*` tokens.
If a Figma-bound visual value has no generated token, stop and report the token
gap; do not hard-code its resolved value. Put focus effects on the painted
interactive child and keep any halo carrier unclipped. Reconcile the Storybook
story when it no longer represents the contract or shipped component; expose
only real package or native controls and import the public package subpath.

For a compound Slot, distinguish two checks. A Plugin API append can prove the
resulting geometry only after its inserted child is deliberately stretched; it
does not emulate a designer inserting an Asset through Figma's UI. Treat the
live Slot restriction and `stretchChildOnInsert` setting as configuration
evidence. If native UI insertion cannot be exercised, report one manual
acceptance check rather than claiming it was verified.

Web components must be SSR-safe: keep styles in `<component>.css`, export them
from `styles.css`, and guard custom-element registration and DOM globals at
module evaluation. Do not add a shared runtime helper merely for that guard.

Keep the matching Storybook file to one `Playground` story. Its Controls expose
only real package, native HTML, or ARIA behaviour; Figma previews do not
appear as Controls. The existing browser suite mounts every Playground. Add a
`play` test only when a deterministic, contract-specified interaction or
composition invariant cannot be proved by mount, unit, or integration checks.
Never add one merely to exercise visual states.

## 3. Verify

For every package reconciliation, run:

```sh
cd ds/components-web && npm run check
cd ds/storybook-web && npm run build && npm run test:storybook -- --run
```

The Storybook commands are required whenever a component module, component CSS,
or story changes: the browser suite mounts every Playground against the public
package. Verify the native boundary, accessible name/relationship, allowed child
composition, geometry ownership, and token modes where applicable. For a
parent-fill component, verify host, painted control or Slot, and eligible child
resolve to the parent width without clipping focus treatment. For an intrinsic
component, verify it does not acquire fill behavior accidentally.

Before declaring success, verify the concrete composability outcomes promised by
the contract: valid arbitrary content in unrestricted regions, valid use of
restricted structural children, no nested-interactive-control violation, no
product-specific content or state baked into the API, and no detachment needed
for the representative compositions approved in the audit. If an intended use
cannot be supported without detaching, list it as an unresolved boundary or
recommend a separate structural component; do not disguise it as a variant.

Report exactly:

```text
Compact contract:
Figma-only mappings:
Actual public package API:
Composability checks:
Files changed:
Checks:
Unresolved gaps: none | [list]
```

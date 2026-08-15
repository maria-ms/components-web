---
name: implement-figma-web-component
description: Audit an approved Maria public Figma component, then create or reconcile its standards-compliant Web Component and Storybook evidence after approval. Use for a Figma asset in ds/components-web.
---

# Implement a Maria Web Component

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
6. Relevant MDN documentation when the native boundary is new or changed, and
   the relevant shadcn page only when a composition pattern needs comparison.

Report exactly:

```text
Status: New | Aligned | Needs reconciliation
Figma interface and Slots:
Native/ARIA boundary:
Geometry ownership:
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
follow the contract to decide the native child structure in code.

Keep geometry ownership explicit. A source-master width is a Figma reference,
not a shipped width. Parent layouts own inline size for parent-fill components;
the component owns its internal geometry and content-driven block size. In code,
make the host and its painted native control or Slot child fill available inline
size without adding a production demonstration width. Keep demonstration widths
in the local Storybook render wrapper. Intrinsic components remain intrinsic.

When behavior depends on siblings or a container—such as dividers, one-open
disclosure behavior, or group-level missing-selection errors—keep it
parent-owned in the component and contract. Do not invent a child property or
runtime API merely to mirror Figma evidence.

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
appear as Controls. The existing browser suite mounts every Playground.
Add a `play` test only for custom composition or ownership behaviour that a
successful mount cannot prove.

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

Report exactly:

```text
Compact contract:
Figma-only mappings:
Actual public package API:
Files changed:
Checks:
Unresolved gaps: none | [list]
```

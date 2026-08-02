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
3. The live public master in `Asset source / [category]` and its component page:
   Appearance, Examples, and designer guardrails.
4. Existing component source, CSS, public exports, generated token CSS, tests,
   and matching Storybook story.
5. Relevant MDN documentation when the native boundary is new or changed, and
   the relevant shadcn page only when a composition pattern needs comparison.

Report whether the component is new, aligned, or needs reconciliation. Include
the public Figma interface and Slots, the native/ARIA boundary, every concrete
package or Storybook mismatch, and one recommended next action. Then stop for
explicit approval. If a new component has no contract, report that as the
recommended first change and include a proposed compact contract. Do not write
the contract, invent an API, or implement during audit.

## 2. Reconcile after approval

Use this authority order:

1. Native HTML for semantics, form behaviour, validation, focus, and keyboard behaviour.
2. Contract for ownership, Figma-only previews, Slots, and non-goals.
3. Figma master for visual values, design defaults, and allowed inserted assets.
4. Package for custom-element API, DOM, CSS, tests, and browser workarounds.

Implement only genuine package API. Figma `preview` controls never become a
matching Web Component API. A Figma Slot is a restricted design composition;
follow the contract to decide the native child structure in code.

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
composition, and token modes where applicable.

Report the contract, Figma-only mappings, actual package API, files changed,
checks run, and unresolved gaps.

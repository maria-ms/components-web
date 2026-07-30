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

1. `ds/component-contracts/component-registry.yaml`.
2. Its linked `components/<contract>.yaml`: `html`, `aria`, `figma`, and `rules` only.
3. The live public master in `Asset source / [category]`.
4. Existing component source, exports, tests, and matching Storybook story.

Report whether the component is new, aligned, or needs reconciliation. Include
the public Figma interface and Slots, the native/ARIA boundary, every concrete
package or Storybook mismatch, and one recommended next action. Then stop for
explicit approval.

## 2. Reconcile after approval

Use this authority order:

1. Native HTML for semantics, form behaviour, validation, focus, and keyboard behaviour.
2. Contract for ownership, Figma-only previews, Slots, and non-goals.
3. Figma master for visual values, design defaults, and allowed inserted assets.
4. Package for custom-element API, DOM, CSS, tests, and browser workarounds.

Implement only genuine package API. Figma `preview` controls never become a
matching Web Component API. A Figma Slot is a restricted design composition;
follow the contract to decide the native child structure in code.

Use native controls rather than ARIA imitations. Use generated `--ds-*` tokens.
Put focus effects on the painted interactive child and keep any halo carrier
unclipped. Reconcile the Storybook story when it no longer represents the
contract or shipped component; expose only real package or native controls.

## 3. Verify

Run the smallest relevant package checks, plus the Storybook check when its
story changed. Verify the native boundary, accessible name/relationship,
allowed child composition, and token modes where applicable.

Report the contract, Figma-only mappings, actual package API, files changed,
checks run, and unresolved gaps.

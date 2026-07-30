---
name: implement-figma-web-component
description: Audit first, then create or reconcile a Maria public Figma component and its Storybook evidence as a standards-compliant Web Component. Use for an approved Figma asset in ds/components-web; inspect the live public master, shared contract, and matching story, present the recommended course, and wait for approval before coding.
---

# Implement a Maria Web Component

Audit, then create or reconcile one component in `ds/components-web`. Do not
modify Figma, tokens, or `ds/tokens/dist` unless the request explicitly
includes them.

## Mandatory intake and audit stop

Before inspecting or changing code, identify the target component. If the user
has not supplied a public Figma component name or URL, ask exactly:

> Which approved public Figma component should I bring into
> `ds/components-web`? Paste its Figma URL or give its exact Asset name.

When a target is supplied, perform a **read-only** audit before making any
write. Inspect the public Figma master, registry, contract, existing package
implementation, exports, token path, matching Storybook story, and relevant
tests.

Report:

- whether this is **new**, **already aligned**, or **requires reconciliation**;
- the live Figma properties/defaults, Slots, and allowed child assets;
- the contract's native HTML/ARIA boundary and Figma-only preview mappings;
- existing implementation, Storybook, and test coverage and every concrete
  mismatch;
- a short recommended next course: create, reconcile, documentation-only, or
  no action.

Then stop and wait for explicit approval before editing a package file. Do not
infer permission to create or reconcile merely because an audit found a gap.

## Read the sources during the audit

1. Find the public Figma master key in
   `ds/component-contracts/component-registry.yaml`.
2. Read its linked YAML contract. It has only:
   - `html` — native element or HTML pattern;
   - `aria` — real ARIA attributes or relationships, when needed;
   - `figma` — the public Figma interface and Figma-only preview mappings;
   - `rules` — durable limits.
3. Inspect the master in `Asset source / [category]` when its current visual
   values, variable bindings, defaults, or Slots matter.
4. Read the existing source, exports, tests, package README, and matching
   `ds/storybook-web/src/<component>.stories.mjs` when it exists.

Authority order:

1. Native HTML owns semantics, keyboard behaviour, form participation,
   validation, focus, and accessible naming.
2. The contract owns the shared native boundary, composition ownership, and
   non-goals.
3. The Figma master owns visual values, public design defaults, variable
   bindings, and allowed Slot children.
4. The package owns its custom-element API, DOM, CSS, tests, and browser
   workarounds.
5. Storybook verifies the shipped package. It is not a second component API or
   a source of visual values.

Stop and ask for direction when the registry or contract is missing, a required
Slot is ambiguous, or the Figma visual has no token-backed implementation path.

## After approval: translate deliberately

- Do not turn Figma `State`, `Content`, displayed text, picker-open, or option
  preview into a matching Web Component API unless the contract explicitly
  requires a genuine API.
- Map Figma focus-visible, disabled, and invalid evidence to native
  `:focus-visible`, `disabled`, validity, and `aria-invalid` as the contract
  states.
- Treat a Figma Slot as a restricted design composition. Preserve the allowed
  child boundary; use the contract to decide whether code needs native child DOM
  or another component.
- Never infer an API from Appearance cards, Examples, screenshots, or old
  documentation copy.
- Reconcile a matching Storybook story when it no longer represents the
  contract or shipped component. Its controls expose only real package or
  native inputs; Figma-only previews remain out of Storybook controls.

## Implement and verify

1. Start with the contract's native element or pattern; never replace a native
   control with a `div` plus ARIA.
2. Preserve native attributes, properties, events, focus, validity, and form
   behaviour on the consumer-owned control.
3. Use generated `--ds-*` token custom properties only. Keep Light/Dark in the
   existing token mechanism.
4. Put a focus halo on the painted interactive child, not a compound wrapper;
   keep any ancestor that carries it unclipped.
5. Add only a genuine package API. Do not mirror native attributes or Figma-only
   preview controls.
6. Update exports and package documentation only when the public package
   surface changes. Update the matching Storybook story when needed to reflect
   the approved component, but do not create a variant matrix or duplicate
   Figma Appearance evidence.

Run the smallest relevant package checks. When a Storybook story is changed,
run its check too. Verify native DOM, accessible name,
keyboard/focus/disabled/validity behaviour where applicable, allowed child
composition, and both token modes.

Report the contract ID, native boundary, actual package API, Figma-only
mappings, files changed, checks run, and unresolved gaps.

---
name: implement-approved-figma-component
description: Implement an accepted canonical Figma component page in ds/components-web and Storybook. Use after a component page created with figma-component-page is approved, when asked to turn that Figma contract into a composable, standards-compliant web component and the smallest evidence-based stories. Do not use to create or correct Figma pages.
---

# Implement an approved Figma component

Implement only after the user supplies an accepted canonical Figma page or
component URL. Work only in `ds/components-web` and `ds/storybook-web`; do not
modify Figma, Foundations, token source snapshots, or `ds/tokens/dist`.

## Read the contract

Inspect, in this order:

1. Figma README, Foundations, and actual live variable/style bindings.
2. `COMPONENT-PAGE-TEMPLATE` for the canonical shell and BUTTON-SHADCN for
   quality precedent only.
3. The approved `[COMPONENT NAME]-SHADCN` page: `00 Use`, `01 Component`,
   `02 States`, `03 Examples`, component descriptions, and actual bindings.
4. `ds/tokens/dist`, the only source for design values in code.
5. Existing components, exports, Storybook configuration, and stories.
6. The closest shadcn and MDN/native HTML sources. Use WAI-ARIA APG only where
   native HTML cannot supply the required widget behaviour.

Treat legacy Figma pages as discovery-only. Do not adopt their variants, states,
or web API unless the accepted component's 00 Use explicitly approves them.
Use Foundations/Figma for visual values; native HTML and MDN for semantics,
attributes, events, keyboard and form behaviour; shadcn and other systems only
for compositional or behavioural precedent.

Before writing code, report:

- native semantic target and public API/defaults;
- mapping from each approved Figma Property to the platform API or native HTML;
- content/part contract and canonical child components;
- native states, state precedence, accessibility/form behaviour, and approved
  motion/reduced-motion treatment;
- exact Figma variable path and matching `tokens/dist` export for every
  non-browser-default visual decision;
- smallest stories evidenced by the accepted page;
- unresolved material gaps.

Stop and ask for direction if a value is not in `tokens/dist`, a material
semantic/state/accessibility/ownership/responsive rule is ambiguous, or a
required child component is not canonical. Do not repair the design in code or
invent a fallback.

## Implement

- Use the smallest composable implementation with the correct native element.
  Preserve standard attributes, properties, events, focus API, constraint
  validation, form participation, keyboard behaviour, and accessible name.
- Add a public property only for an approved Figma Property. State evidence,
  Figma previews, consumer conditions, and fixture content do not create API.
- Use only generated CSS custom properties from `ds/tokens/dist` for design
  values. Browser resets/forced-colors rules and explicitly documented fixed
  exceptions are allowed; do not add undocumented hard-coded visual values.
- Translate the exact Figma binding, not a visually matching alias. Use
  `box-sizing: border-box` where a fixed Figma dimension includes padding.
- Preserve approved vector geometry. Use `currentColor` only when the Figma
  contract makes contextual foreground explicit.
- In custom elements, do not mutate host attributes or children in the
  constructor. Verify that a fresh Storybook iframe upgrades and renders the
  actual DOM.
- Keep consumer content as real DOM. Add named slots only for stable named
  content positions owned by the component.
- Compose actual canonical child components for a compound; never redraw or
  flatten a child component. A missing child is a blocker unless the approved
  Figma contract explicitly permits a family implementation.
- Update public exports and the concise package README only when the approved
  public contract requires it.

## Create evidence-based stories

Create only the stories evidenced by the approved page:

1. **Playground** — 01 Component with controls only for real public properties and
   Actions wired to real native events.
2. **Comparison** — only when a compact comparison makes the canonical set
   easier to inspect; never render a full cross-product by default.
3. **Figma Examples** — exact 03 Examples labels, composition, assets, bindings,
   and fixed-frame sizing semantics.
4. **State evidence** — inspectable native states from 02 States, such as
   disabled. Never expose hover/focus as fake consumer controls.

Fixture-only story arguments may create native child DOM for documented Figma
content, but label the mapping clearly and never promote it to a component API.
When an example has a stable reusable interface, stop and propose the missing
compound instead of disguising it as a fixture.

## Verify and report

Import through the public package entry point and load token theme CSS through
`@maria-ms/tokens`. Verify native semantic/form/keyboard/accessibility behaviour
and a fresh custom-element render where relevant. Run the package check and
Storybook production build.

Report the Figma-to-code mapping, public API, token bindings, stories created,
files changed, verification performed, documented exceptions, and unresolved
gaps.

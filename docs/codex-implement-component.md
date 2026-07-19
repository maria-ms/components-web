# Codex prompt — implement an approved Figma component

Use this prompt in Codex only after
[`codex-create-figma-component.md`](./codex-create-figma-component.md) has
created a complete, accepted canonical Figma page. It reads Figma through MCP
but does not change Figma unless a separate request explicitly asks for a
design correction.

```text
Implement [COMPONENT NAME] from this approved canonical Figma page:
[CANONICAL FIGMA PAGE OR COMPONENT URL]

Work only in ds/components-web and ds/storybook-web. Do not modify Figma,
Foundations, token source snapshots, or ds/tokens/dist.

Before writing code, inspect these sources in this order:
1. Figma README, Foundations, and live variable/style bindings.
2. BUTTON-SHADCN, the page, layers, About rules, and handoff benchmark.
3. The approved [COMPONENT NAME]-SHADCN page: read 00 About, 01 Component,
   02 States, 03 Examples, component descriptions, and actual bindings.
4. ds/tokens/dist, which is the only permitted source of design values.
5. The existing Button in ds/components-web and its README, for native
   composition, exports, and package conventions.
6. The existing Button stories and Storybook configuration, for the smallest
   useful story and theme pattern.
7. The closest shadcn component through its MCP, for behavioural and
   compositional precedent only. It does not override Figma, tokens, or native
   web standards, and it is not a dependency to copy into this package.

`BUTTON-SHADCN` is the only canonical Button baseline. Legacy component pages
are discovery-only: never inherit their variants, state axes, or old web API
unless the approved component's `00 About` explicitly adds and justifies
them.

External cross-reference rules — these inform behaviour and interface decisions;
they never supply visual values or override our Figma Contract or `tokens/dist`.

- Native HTML and MDN define the semantic element, native attributes, form
  behaviour, keyboard defaults, and permitted content.
- WAI-ARIA APG defines keyboard, focus, role, state, and relationship rules
  only when native HTML cannot provide the required widget behaviour.
- React Aria, Radix, and shadcn provide behavioural and compositional precedent.
  Translate their intent into this platform; do not copy framework-specific APIs
  or dependencies.
- Open UI provides vocabulary for anatomy, slots, parts, states, behaviours, and
  composite components.
- Carbon and GOV.UK provide cross-checks for usage, state coverage, tokens,
  forms, content, accessibility, documentation, and test completeness.

First report the implementation contract:
- native semantic target;
- public component API and defaults;
- mapping from every Figma property to web API or native HTML;
- content/slot contract and composed child components;
- native states and accessibility/form behaviour;
- exact token mappings available in dist;
- the exact Figma variable path for every fixed size, gap, padding, radius,
  colour, and typography decision;
- smallest stories justified by the Figma page;
- every unresolved gap.

Also report:
- the approved Option / State / Rule / Part / Example classification from the
  Figma page;
- canonical child-component dependencies and any consumer-owned composition;
- the value map for every non-browser-default visual decision: token-bound,
  inherited, documented fixed exception, or missing;
- the approved motion and reduced-motion rule when motion exists;
- accessibility ownership for components with no native semantic element or
  system-status behaviour.

Stop and request direction if Figma requires a value not present in tokens
dist, or if any semantic, state, accessibility, ownership, or responsive rule
is ambiguous. This includes unresolved motion, reduced-motion, announcement,
or child-dependency decisions. Do not repair the design in code or invent a
fallback.

When the contract is complete:
- Implement the smallest composable web component using the correct native HTML
  element. Preserve native attributes, events, keyboard behaviour, form
  participation, and accessibility API. Do not replace native attributes such
  as disabled, name, value, type, required, or aria-* with duplicate custom
  properties.
- When no native semantic element exists, use the smallest appropriate visual
  element and follow the approved accessibility owner. Do not add a default
  ARIA role or live announcement merely because a component is animated or
  visually indicates progress.
- Add a public web attribute/property only for an approved Option. State
  evidence, a consumer-owned condition, or a composed example never creates a
  public API by itself.
- Use only generated CSS custom properties from ds/tokens/dist for design
  values. CSS reset values and browser/forced-colors compatibility rules are
  allowed. An explicitly documented Figma fixed exception, inherited value, or
  intrinsic asset geometry may be reproduced exactly; do not create an
  undocumented hard-coded value.
- Map the exact Figma variable path to its `tokens/dist` export. Do not infer a
  token from a matching current value, visual appearance, or component name.
  An alias with the same resolved value is not automatically the same handoff
  reference.
- Translate fixed Figma frame dimensions with `box-sizing: border-box` when
  the frame has padding, so its declared height or width includes that padding.
- For an approved Figma vector, render the approved vector geometry directly;
  do not substitute a similarly named icon or redraw it. Use inherited
  `currentColor` only when the Figma contract documents contextual foreground.
- If the approved contract has motion, implement only its documented trigger,
  timing, and end/loop behaviour, and include its reduced-motion treatment.
- In a custom element, do not mutate the host's attributes or children in its
  constructor. Render or update them in `connectedCallback` (or use a valid
  shadow-DOM bootstrap). Verify the component upgrades and renders actual DOM
  in a fresh Storybook iframe or restarted dev server; hot reload cannot replace
  an already-defined custom-element class.
- Follow the existing Button's composable-child approach where it applies:
  consumer content remains real DOM content. Use named slots only when the
  component genuinely owns stable named content positions.
- For a compound, compose the actual primitive/component children. For example,
  Field owns label, description/error, and their relationships to one real
  Input, Select, or Textarea; it does not recreate the control's styling.
- A compound may compose only an already-canonical child component. If a child
  is missing, create and approve it first with the Figma-page prompt, unless
  the task explicitly authorises a component-family page.
- The same dependency rule applies to a primitive or an existing component
  gaining a conditional child part. Do not redraw, inline, or make a hidden
  dependency substitute for a missing canonical child component.
- Use shadcn to inform behaviour and composition, not visual values, DOM APIs,
  React-specific patterns, or dependencies.
- Update public exports and the concise package README when the public contract
  requires it.

Create only the stories evidenced by the approved Figma page:
1. Playground from 01 Component: controls for the real public interface,
   semantic markup, and Actions wired to real native events.
2. Compact variant/size comparison only when it makes the canonical set easier
   to inspect; never create a story for every cross-product.
3. Figma Examples from 03 Examples: exactly mirror its labels, composition,
   approved assets, exact variable bindings, and fixed-frame sizing semantics.
4. Inspectable native-state evidence from 02 States, such as disabled. Do not
   expose hover or focus as fake controls.

Storybook may use fixture-only args to render Figma content choices into native
child DOM. Mark their mapping clearly; never turn them into component attributes
unless the approved Figma Contract defines them as such.

When a Figma Example demonstrates composition rather than a public Option,
first identify it as a canonical instance, fixture-only composition, or missing
compound. Create a fixture-only composition as a fixed, inspectable example—not
as a new component control or an ambiguous inline replacement for a missing
component. If the approved component has motion, include the reduced-motion
result in the component verification.

Import the component through its public package entry point and the light/dark
token CSS through @maria-ms/tokens. Run the package check and a Storybook
production build. Report the exact Figma-to-code mapping, files changed,
verification performed, approved exceptions or inherited values used, and
unresolved gaps.
```

The web baseline is the [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button), relevant native HTML elements and WAI-ARIA patterns, plus shadcn's small-variant, composable-content discipline.

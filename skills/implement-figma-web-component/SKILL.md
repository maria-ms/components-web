---
name: implement-figma-web-component
description: Implement an accepted canonical Figma component page as standards-compliant Web Components in ds/components-web, with minimal Storybook evidence. Use after a canonical *-SHADCN Figma page is approved and the task is to port it to components-web/Storybook. Apply the repository's Figma conventions, native HTML/MDN semantics, tokens/dist bindings, and Web Component architecture. Do not use to create or modify Figma pages.
---

# Implement an approved Figma Web Component

Implement only an accepted canonical `*-SHADCN` Figma page. Work in
`ds/components-web` and `ds/storybook-web` only. Do not alter Figma,
Foundations, token source snapshots, or `ds/tokens/dist`.

Stop and report the gap before coding when the supplied Figma page lacks a
clear public contract, an essential state/ownership/accessibility decision, a
required canonical child, or an exact token in `tokens/dist`.

## Intake

Before inspection, ask only for the Figma component page-root URL when it is
not already supplied.

Infer the component name, whether this is a new component or reconciliation,
the public interface, states, tokens, examples, and platform semantics from the
Figma page, MDN, `tokens/dist`, and this package. Do not ask the user to repeat
them. Ask a follow-up question only when the audit finds a material unresolved
gap, including a compatibility behaviour that cannot be discovered.

## Read the contract

Inspect in this order:

1. The accepted Figma page: `00 Use`, `01 Component`, `02 States`, `03
   Examples`, public component descriptions, and live variable/style bindings.
   Read legacy pages only when explicitly supplied as visual discovery material.
2. The relevant MDN/native HTML reference through MCP. Establish the native
   semantic target, standard attributes/properties, events, focus API,
   keyboard behaviour, form behaviour, and constraint validation before
   designing a wrapper API. Use WAI-ARIA only when native HTML cannot provide
   the required widget.
3. Existing `ds/components-web` components, package exports, and Storybook.
   Match their public entry-point and Web Component conventions unless the
   accepted contract requires a deliberate change.
4. `ds/tokens/dist`, the only source for values in code. Map each non-browser
   visual decision to the exact Figma-bound token.
5. The closest shadcn registry component only when a composition, named-part,
   or behaviour question remains. Use it as precedent; never copy its React
   API, visual values, dependencies, or implementation wholesale.

## Apply this decision hierarchy

Use these sources to resolve conflicts:

1. **Native HTML / MDN** — semantics, existing interface, events, focus,
   keyboard behaviour, validation, form participation, and accessible name.
2. **Accepted Figma `00 Use`** — the product-specific visual contract, public
   design-system choices, named parts, ownership, and approved state rules.
   It cannot override native behaviour.
3. **Existing `components-web`** — Web Component architecture, package
   boundaries, naming, and composition conventions.
4. **Actual Figma bindings + `tokens/dist`** — exact visual values and theme
   resolution. `tokens/dist` is the code source of truth.
5. **shadcn and other systems** — optional compositional precedent only.

Never infer an interface from a screenshot, an old component page, a visual
state, an example, or a shadcn prop.

## Translate Figma conventions deliberately

Classify every Figma item before adding code:

| Figma item | Web Components treatment |
| --- | --- |
| `property` row | Add a public component API only when it is a deliberate design-system choice and is not already native. A Figma Boolean used to preview a native condition remains native, not a wrapper property. |
| `native` row | Preserve/map to the real native element's standard attribute, property, event, focus, validation, or form behaviour. Never wrap it in a bespoke API. |
| `content` row | Render as real child DOM or a documented slot/part. A Figma Text or instance override is not a Web Component attribute. Map an icon-only accessible name to the relevant native accessible-name mechanism. |
| `preview` row, `Preview value`, `Preview placeholder`, `Preview text`, `Preview state` | Canvas evidence only. Map each visible preview to the specific native condition it represents—`Preview value` to value/defaultValue, `Preview placeholder` to placeholder, and `Preview text` according to its documented Preview state. Never create a component API. |
| `State` / `02 States` | Implement with native mechanisms, CSS pseudo-classes, or documented state coordination. Do not turn it into a public attribute unless `00 Use` approves it as a Property. |
| `Part` | Implement as a semantic DOM part, stable named slot, or canonical child component only when that position is part of the public composition contract. |
| `Example` / `03 Examples` | Use as composition or content evidence. It does not create a component, property, or required Storybook story. |
| `.Name / …` | Private Figma reference asset. Never export it, expose it in Assets, or treat it as a code API. |

`01 Component` contains the only public Figma asset(s) designers use. If a
page deliberately contains a component family—such as labelled Button and
Icon-only Button—implement and document one public Web Component per distinct
public asset. Do not collapse them into an invented boolean or enum unless the
accepted Figma contract defines that interface.

States and examples must use public assets or canonical child assets. Treat a
fixture-only Figma composition as product evidence, not as a missing API.

## Report the mapping before writing code

State concisely:

- native semantic target and whether the implementation is a direct native
  control or a styling/composition wrapper around consumer-owned native DOM;
- each accepted Figma Property and its Web Component mapping;
- every `native`, `preview`, State, Part, and Example mapping that affects
  implementation;
- named slots/child components, reading order, and ownership boundaries;
- state precedence, accessible-name path, form/validation behaviour, and
  motion/reduced-motion rule;
- exact Figma variable path and corresponding `tokens/dist` CSS custom
  property for each non-browser visual decision;
- smallest Storybook evidence and any unresolved material decision.

Stop for direction instead of inventing a fallback.

## Implement Web Components

- Start with the real native element. Never imitate an input, button, select,
  checkbox, or other standard control with a `div`.
- Preserve native attributes, properties, events, focus API, keyboard
  activation, constraint validation, form participation, and accessible name.
- When 00 Use assigns validation timing to a parent Field or form, style the
  child invalid state from owner-provided `[aria-invalid="true"]`, not bare
  `:invalid`. The parent may set that attribute after its approved blur or
  failed-submit timing; it must preserve existing `aria-describedby` references
  and restore any Field-managed supporting copy when the control becomes valid.
- Use a custom-element wrapper only for a stable visual/compositional role.
  Do not make it obscure, replace, or duplicate the native control's contract.
- Add only approved design-system properties. Consumer conditions, temporary
  states, preview controls, fixture content, and examples do not create API.
- Keep consumer content as real DOM. Add a named slot only for a stable,
  documented content position. Compose real canonical child components for a
  compound; never redraw them.
- Use only generated CSS custom properties from `tokens/dist` for design
  values. Translate the exact Figma variable binding, not a visually similar
  alias. Browser resets, forced-colors rules, and documented raw exceptions
  are the only exceptions.
- Use `box-sizing: border-box` when a Figma fixed dimension includes padding.
  Resolve Light/Dark through token CSS and the existing theme mechanism, never
  through copied theme-specific values.
- Preserve approved SVG geometry. Use `currentColor` only where the Figma
  contract explicitly makes the foreground contextual.
- Do not mutate host attributes or consumer children in a custom-element
  constructor. Verify a fresh Storybook iframe upgrades and renders the real
  DOM.
- Update exports and the concise package README only for an approved public
  asset or public interface change.

## Create minimal Storybook evidence

For each public Web Component, create one colocated story file with one
`Playground` story:

- Expose genuine component configuration as Controls and wire real native
  events to Actions.
- A Storybook fixture arg may create documented native child DOM—such as a
  Button label, icon, or Icon Button accessible name—but must state its mapping
  and must never become a Web Component attribute unless the Figma contract
  approves it.
- Add one fixed named story only when a meaningful composition, content stress
  case, deterministic state, or behaviour cannot be clearly inspected through
  Playground Controls.
- Use the global theme toolbar for Light/Dark. Do not add variant/size matrices,
  duplicate every Figma example, or create fake hover/focus controls.
- Link the canonical Figma page in the story's design parameter.

## Verify and report

Verify through public package entry points with active token theme CSS:

- fresh custom-element render and actual DOM structure;
- all accepted public properties/assets and exact token bindings in Light and
  Dark;
- native interaction, accessible name, keyboard, disabled, and focus behaviour;
- form submit/reset, validation, and `aria-*` association when applicable;
- motion and `prefers-reduced-motion` when applicable;
- package syntax check, package dry run, Storybook syntax check, and Storybook
  production build.

If a browser-capable test runtime is unavailable, do not claim the build as
proof of live DOM or interaction behaviour. Run every available static/build
check, report the precise unverified interactions, and treat a reusable browser
test harness as separate infrastructure work unless the task explicitly
authorises adding it.

Report the Figma-to-code mapping, public Web Components, token bindings,
Storybook stories, files changed, verification performed, documented
exceptions, and unresolved decisions.

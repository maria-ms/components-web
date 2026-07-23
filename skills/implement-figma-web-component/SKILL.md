---
name: implement-figma-web-component
description: Implement an accepted canonical Figma component page as standards-compliant Web Components in ds/components-web with minimal Storybook evidence. Use when given an approved *-SHADCN Figma page to port or reconcile in the web package. Apply the page's public contract, native HTML semantics, tokens/dist, and repository conventions; do not modify Figma.
---

# Implement an approved Figma Web Component

Implement only an accepted canonical `*-SHADCN` Figma page. Work in
`ds/components-web` and the repository's Storybook package. Do not modify
Figma, Foundations, token sources, or `ds/tokens/dist`.

Stop and report a material gap before coding when the page lacks a clear public
contract, essential state/ownership/accessibility decision, required canonical
child, or exact token available in `tokens/dist`.

## Intake

Ask only for the Figma component page-root URL when it is not already supplied.

Infer the component name, platform semantics, public interface, states, token
bindings, and Storybook evidence from the page and repository. Ask a follow-up
only for a material decision that cannot be discovered. Do not ask the user to
restate component properties, children, or examples already documented in
Figma.

## Read the contract in order

1. Read the accepted Figma page: `00 Component`, `01 Behavior`, `02 Recipes`,
   and `03 Use`. Treat `Usage` as the plain-language intent, `Properties` as
   the exact public classification, and `Rules` as the non-negotiable contract.
   Inspect public component definitions, nested instances, slot preferred
   values, descriptions, and live variable/style bindings.
2. Read relevant native HTML/MDN material. Establish the semantic target,
   allowed children, standard attributes/properties/events, accessible-name
   path, keyboard behaviour, focus API, constraint validation, and form
   participation before designing any wrapper API.
3. Inspect existing `ds/components-web`, exports, tests, and Storybook. Match
   established Web Component and story conventions unless the accepted page
   explicitly requires a change.
4. Read `ds/tokens/dist`. It is the only code source for visual values.
5. Consult an established component precedent only when a composition or
   behaviour question remains after the preceding sources.

Resolve conflicts in this order:

1. Native HTML/MDN owns semantics and platform behaviour.
2. Figma Properties and Rules own approved design-system choices,
   composition, and visual-state requirements.
3. Existing package code owns repository architecture and package boundaries.
4. Figma variable bindings map to `tokens/dist` values.

Never derive an API from a screenshot, private reference, behavior evidence,
recipe, preview helper, legacy page, or external framework API.

## Translate Figma deliberately

| Figma contract item | Web Components treatment |
| --- | --- |
| `property` | Add a public API only for an intentional design-system choice that is not already native. |
| `native` | Preserve/map to the real native attribute, property, event, focus, validation, or form behaviour. If an owned native control needs forwarding through a custom element, use the standard native name and semantics; do not invent a bespoke API. |
| `content` | Render as real child DOM, documented named slot, or canonical child component. A Figma Text or instance override is not automatically an attribute. |
| `preview` | Canvas-only evidence. Map it to the exact documented native condition; never add API. |
| `01 Behavior` | Implement through native mechanisms, CSS pseudo-classes, or documented parent/child coordination. It does not create an API. |
| `02 Recipes` | Product composition evidence. It does not create a component, property, slot, or required Storybook story. |
| `.Name / …` | Private Figma reference. Never export or expose it in code. |

Apply these rules without exception:

- The only reusable Figma Assets are in `00 Component`.
- A Figma-only `Preview value`, `Preview placeholder`, `Preview text`, or
  `Preview state` never becomes an attribute/property. Use the documented
  native mapping instead.
- A Figma canvas selector for a native condition, such as Disabled, Checked,
  Invalid, or selection, is not a wrapper API.
- A compound owns layout, label/message placement, and documented coordination.
  Its child owns native interaction, state, accessibility, and its own public
  interface.
- Use a named slot only when the Figma page documents a stable semantic child
  position and approved children. Do not turn arbitrary Figma nesting into a
  generic slot.
- Treat a fixture-only assembly as evidence, not a code component.

## Map before writing

State in concise commentary:

- native semantic target and whether the component wraps or styles
  consumer-owned native DOM;
- public Web Component API and all native/content/preview mappings;
- named parts, real child DOM/slots, reading order, and ownership boundaries;
- behaviour precedence, accessible-name path, form/validation behaviour, and
  motion/reduced-motion requirements;
- exact Figma-bound token and `tokens/dist` custom property mapping for each
  non-browser visual decision;
- smallest Storybook evidence and any blocked decision.

Continue without waiting unless a material decision is unresolved. Do not
invent a fallback.

## Implement

- For a native control, start with the real native element. Never imitate a
  standard control with a `div`. For a compound, preserve its canonical native
  child DOM rather than inventing a substitute control.
- Preserve native attributes, properties, events, focus API, keyboard
  activation, constraint validation, form participation, and accessible name.
- Use a custom-element wrapper only for a stable visual or compositional role.
  Do not obscure or duplicate the native contract.
- Style validation from the owner documented in Figma. When parent/form timing
  controls invalid exposure, use owner-provided `[aria-invalid="true"]` rather
  than exposing a wrapper validation property. Preserve existing
  `aria-describedby` references.
- Keep consumer content as real DOM. Use real canonical child Web Components
  for compounds; do not redraw their DOM or duplicate child properties.
- Use only CSS custom properties generated from `tokens/dist` for design
  values. Match the exact Figma variable binding, not a visually similar alias.
- Use `box-sizing: border-box` when fixed Figma dimensions include padding.
  Resolve themes through the existing token mechanism, never copied values.
- Do not mutate host attributes or consumer children in a constructor. Verify
  a fresh Storybook iframe upgrades and renders the intended native DOM.
- Update exports and package documentation only for approved public assets or
  interface changes.

## Add minimal Storybook evidence

Create one colocated story file per public Web Component with one `Playground`
story by default.

- Expose only genuine public configuration as Controls.
- Log real native events to Actions only when they help inspect the component;
  never add fake callback args.
- A fixture-only story arg may create documented child DOM or text to render a
  Figma composition. Label the mapping clearly and never turn it into a
  component attribute.
- Add a fixed named story only when a meaningful composition, content stress
  case, deterministic state, or behaviour cannot be inspected through
  Playground.
- Use the global theme toolbar for Light/Dark. Do not create size/variant
  matrices or duplicate every Figma recipe.
- Link the canonical Figma page in the story design parameter.

## Verify and report

Verify from public package entry points with token theme CSS active:

- fresh custom-element render and intended native DOM;
- accepted public interface and exact bindings in Light and Dark;
- keyboard, focus-visible, disabled, accessible-name, and browser-owned-part
  behaviour;
- submit/reset, validity, and `aria-*` association for form controls;
- documented motion and reduced-motion behaviour;
- package checks, relevant tests, Storybook syntax check, and production build.

If no browser-capable test runtime is available, do not claim live interaction
proof. Run every available static/build check and list the exact unverified
behaviour.

Report mapping, public components, files changed, token bindings, Storybook
evidence, checks run, exceptions, and unresolved decisions.

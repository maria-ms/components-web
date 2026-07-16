# Component Library Manifest

This document defines the durable engineering and design rules for Maria's Web
Component library. Component implementations, Figma components, and Storybook
examples should all follow it.

## Package Responsibilities

The design system is split across three independently managed packages:

- `@maria-ms/tokens` turns reviewed Figma Export Modes sources into generated
  platform artifacts, including light and dark CSS custom properties.
- `@maria-ms/components-web` implements reusable `ds-*` custom elements using
  those generated tokens.
- `@maria-ms/storybook-web` documents public APIs and demonstrates realistic
  compositions using published package entry points.

Figma variables are the visual source of truth. Generated token artifacts are
the code-facing contract. Components consume that contract; they do not recreate
or reinterpret the token system.

## Decision Priorities

When requirements conflict, use this order:

1. Accessibility, user safety, and correct semantics
2. Web standards and native browser behavior
3. Composability and public API stability
4. Existing package conventions
5. Design-system consistency
6. Figma visual fidelity
7. Implementation convenience

Treat Figma as design evidence, not a literal DOM or API specification. A visual
detail must not override correct semantics, keyboard behavior, accessible
naming, focus behavior, contrast, or reduced-motion requirements.

## What Belongs In The Package

The package should expose the smallest durable building blocks needed to build
product interfaces consistently:

- **Primitives** own reusable behavior or visual identity, such as a button,
  input, avatar, alert, or disclosure item.
- **Structural wrappers** own a stable composition or accessibility contract,
  such as associating a label, description, and error with one or more controls.
- **Behavior shells** own a reusable interaction model, such as menu opening,
  dismissal, keyboard navigation, or selection.

Package a component only when it has a clear responsibility, a durable public
API, meaningful reusable behavior or accessibility requirements, tokenized
states, and repeated cross-product value.

Keep something as a Figma/Storybook pattern when it is mostly an arrangement of
existing components, contains product-specific rules or content, is likely to
vary by workflow, or is difficult to name without business context.

Examples that normally remain compositions include currency fields, phone
fields, profile menus, payment rows, page headers, footers, dashboard cards, and
billing sections.

## Ownership Boundary

A component owns:

- its stable behavior and state model
- semantic structure and accessibility behavior
- keyboard and focus behavior where relevant
- intrinsic internal geometry
- tokenized visual identity
- the slots and parts where consumer content is placed

The consumer owns:

- product meaning, business data, and copy
- validation timing and business rules
- page, form, and composition layout
- composition width and placement
- icons, media, and actions unless they are intrinsic to component behavior

Components provide a parking space and behavior contract. They must not encode
example content from a Figma artboard as properties such as `iconName`,
`avatarInitials`, `items`, `description`, or `shortcut` unless the component
genuinely owns that data model.

## Web Platform Contract

Use native HTML and browser behavior first. Do not replace links, buttons,
headings, lists, labels, tables, landmarks, or form controls with custom
semantics merely for styling.

Every public component must:

- have one clear responsibility and work independently
- compose through documented attributes, properties, slots, events, and styles
- avoid another component's private DOM and internal class names
- tolerate missing, long, localized, and nested consumer content
- behave correctly when connected, disconnected, and reconnected
- clean up listeners, observers, timers, and subscriptions
- avoid global mutable state and unsafe consumer HTML injection
- use idempotent custom-element registration

Use the `ds-` custom-element prefix. Prefer open shadow roots when encapsulation
is valuable. Use light DOM when a shadow boundary would damage native semantics,
document structure, accessibility relationships, or consumer composition.

Shadow DOM is an implementation boundary, not a reason to invent an API.
Consumers must never need to query or mutate private shadow DOM.

## Composition Contract

Use the smallest appropriate public mechanism:

- slots for consumer-owned DOM content
- attributes for small serializable configuration
- properties for non-serializable values or native-like state
- native events when their semantics apply
- custom events only for behavior without a suitable native event
- CSS custom properties for intentional theme or component overrides
- CSS parts only for stable styling surfaces consumers genuinely need

Custom events must have stable names and documented payloads. They should bubble,
cross a shadow boundary, or be cancelable only when the interaction contract
requires it.

Do not accept HTML strings when DOM can be slotted, serialize complex objects
into attributes, expose internal classes, hardcode page layout, or create a
large variant matrix from example content.

## Forms And Fields

Form controls should behave like enriched native controls, not React-style state
containers. Preserve the relevant native contract, including value, name,
disabled/readonly/required state, validation, form submission, reset behavior,
focus, and `input`/`change` timing.

Use a real native control internally when possible. Use a form-associated custom
element and `ElementInternals` when the custom element itself must participate in
the form contract. Verify the behavior in real browsers.

Primitive controls own their own interactive and visual states. They do not own
surrounding visible labels, descriptions, or error messages. A structural field
wrapper may provide those relationships when that wrapper exists in the public
package. Until then, stories and consumers must use correct native labeling and
must not assume an unavailable `ds-field` component.

## Accessibility Contract

Implement in this order:

1. Correct native HTML
2. Native browser APIs and behavior
3. Progressive enhancement
4. ARIA only for semantics or states native HTML cannot express
5. Custom interaction only when genuinely required

Do not use ARIA to repair avoidable semantic mistakes or add redundant roles to
native elements. Interactive components must have a correct accessible name,
logical tab order, visible focus, appropriate keyboard behavior, no keyboard
trap, and correctly exposed disabled/expanded/selected/checked/invalid states.

Check applicable WCAG 2.2 AA concerns, including contrast, target size, zoom and
reflow, forced colors, reduced motion, right-to-left layout, localization, touch
input, and states that cannot rely on color alone.

Automated accessibility checks are a safety net, not proof of accessibility.
Keyboard behavior and semantic outcomes must also be reviewed.

## Tokens And Styling

Components consume generated CSS variables from `@maria-ms/tokens`:

1. Prefer component tokens when they express the exact intent.
2. Otherwise use semantic tokens.
3. Use primitive tokens only for intentionally invariant geometry or when no
   more meaningful exported token exists.

If Figma binds a required visual property to a variable but the corresponding
generated token is absent from either light or dark CSS, stop component work and
report the upstream gap. Do not hardcode the missing value, add a fallback, or
quietly modify the token pipeline.

Use logical properties, intrinsic sizing, resilient wrapping, and
container-relative behavior. Parent layouts own page widths and flow. Components
own only intrinsic dimensions that are part of their identity or behavior.

The application root owns font loading and `font-family`; components inherit it.
Do not add `letter-spacing: 0`. Do not leak styles globally or reset unrelated
consumer styles.

## Package Contract

`@maria-ms/components-web` uses plain `.mjs` modules, native Custom Elements,
JSDoc where useful, and no framework or compilation step.

Each component module:

- lives at `src/components/<name>/<name>.mjs`
- exports its public class or classes
- idempotently registers its own `ds-*` element or related element family
- is available through an explicit package subpath

Consumers should import only the component they need:

```js
import "@maria-ms/components-web/avatar";
```

The root entry remains an aggregate convenience entry. Do not introduce Lit,
TypeScript, a new build system, a class-only registration layer, `register-all`,
generated declarations, or Custom Elements Manifest tooling as part of an
ordinary component task. Those require a deliberate package-wide migration.

## Storybook Contract

Storybook imports public component subpaths and generated light/dark token CSS.
It must not deep-import private source files.

Stories should explain the smallest useful public API through:

- default usage
- important semantic and interaction states
- composition with consumer-owned content
- form behavior when relevant
- one grouped visual overview only when it materially helps review

Stories do not mirror Figma variants one-to-one. Story controls expose only real
public attributes/properties; demo data and layout controls stay hidden.
Product-like content, icons, and layout belong in Storybook, not in the component
package.

## Change Rule

Do not turn a component task into an architecture migration. New dependencies,
testing frameworks, registration models, generated metadata, or token transforms
must be proposed and approved as separate package-wide work.

---
name: create-figma-component-page
description: Create or revise an implementation-ready canonical component page in this Design System's Figma file. Use when asked to add a Figma component page, turn an old component into a canonical page, or create a new primitive or compound before code implementation. Research the component interface with Figma Foundations, shadcn, MDN, and relevant standards; duplicate and validate the fixed COMPONENT-PAGE-TEMPLATE shell.
---

# Canonical Figma component page

Create Figma pages only. Do not implement code, alter Foundations/tokens, or
modify existing canonical component pages unless the request expressly says to
revise one.

## Figma page vs. canvas root

Use these terms precisely:

- **Figma Page**: the top-level page in the file sidebar, named
  `[COMPONENT NAME]-SHADCN`.
- **Canvas root**: the single frame on that page, named
  `[Component name] / Page`.

Never treat a canvas root as a Figma Page. Never leave a new component canvas
on Readme, Foundations, the template page, or the active page by accident.

Before every Figma write, load and follow `figma-use` and
`figma-generate-library`. Stop and report the limitation if Figma MCP is not
available or cannot write to the supplied Design System file.

## Intake

Before inspecting or changing Figma, ask only for:

1. Component name.
2. What it helps a person do, in one sentence.
3. Does it use other canonical components? Answer `standalone`, provide links
   or selections for the canonical public children, or answer `unsure`. Ask for
   instances from Assets or the child page's `01 Component`, never `02 States`
   or `03 Examples`.
4. Optional Figma links or selections for an old component, visual reference,
   related component, or product screen. Accept `none`.

Use the canonical template by default. Do not ask for its URL unless it is
missing or ambiguous, or the user explicitly wants a different approved shell.
Accept a supplied template URL as that intentional override.

Do not ask a designer to classify it as primitive or compound. Treat their
answer about child reuse as the source of truth: never assume or select a child
component on their behalf. Infer the interface, states, accessibility, motion,
and responsive behaviour through research. Summarize the answer concisely and
propose the page name `[COMPONENT NAME]-SHADCN`.

When the answer is `unsure`, inspect the library and return a small candidate
list with a recommendation. Pause for the designer to approve, reject, or amend
the child list before duplicating the template or creating the page. Ask a
follow-up question only for that confirmation or another material unresolved
decision; never guess one.

## Adaptive routing

Do not route requests through a fixed catalogue. Classify each request by its
native semantic target, reuse boundary, child dependencies, ownership, and
interaction complexity:

- **Page-local composition:** a one-off arrangement for a screen. Do not create
  a component page; document it in the product work instead.
- **Standalone or fixed compound:** a stable reusable asset. Create one
  canonical component page.
- **Restricted-slot compound:** a stable reusable asset with a genuine semantic
  child position, such as Field's `Control`. Create one page and expose only
  that restricted slot.

Use the classification to choose research, not to prescribe an implementation:

- For a native semantic target, use HTML and MDN first.
- For designer-approved canonical children, inspect their Figma pages and
  matching code and stories before designing the parent.
- For a non-native interaction with keyboard, overlay, or selection behaviour,
  research the closest shadcn pattern, Open UI, and WAI-ARIA APG only as needed.
- If a reusable child is missing, propose that child first. If the user
  explicitly authorises a component-family page, record the dependency and
  create the parent only to the approved scope.

Examples such as inputs, navigation, calendars, and layouts are research hints,
not a component taxonomy. Do not invent a page merely because a pattern is
familiar.

## Research and decision hierarchy

Inspect, in this order:

1. Figma README, Foundations, and the live variables, styles, and bindings.
2. The canonical
   [COMPONENT-PAGE-TEMPLATE](https://www.figma.com/design/quQrWVWWnKGO2y2IHMudis/Design-System-v2.0-2026?node-id=40022477-52),
   unless the user supplied an approved alternate template URL. Duplicate it;
   never recreate the shell manually or infer it from another component page.
   If the canonical page is missing or ambiguous, stop and ask for the template
   URL.
3. Closest approved `*-SHADCN` pages: BUTTON-SHADCN as the generic interaction
   baseline, the nearest page in the same family, and FIELD-SHADCN when the
   candidate may have a restricted child slot. Use them for visual quality,
   naming, editorial convention, and construction technique only. Never inherit
   their interface or state axes without an explicit decision.
4. Supplied Figma sources. Treat legacy pages as visual/discovery material, not
   as authorisation for obsolete variants or APIs.
5. `ds/tokens/dist`, `ds/components-web`, and Storybook, to establish the
   available values and implementation capabilities. Do not alter them.
6. The closest shadcn component and relevant native HTML/MDN material through
   MCP. Consult WAI-ARIA APG, Open UI, React Aria, Radix, Carbon, or GOV.UK
   only to answer a real remaining interface or behaviour question.

Resolve conflicts in this order:

- Foundations and approved Figma bindings own visual values.
- Native HTML and MDN own semantics, permitted content, attributes, form
  behaviour, events, and keyboard defaults.
- Use WAI-ARIA only when native HTML cannot supply the required widget.
- Use shadcn and other systems as behavioural/compositional precedent, never as
  visual values, framework APIs, or dependencies to copy.

Use each source for its proper job:

- The template defines **where** information and assets belong on the page.
- Closest approved canonical pages show **how** to construct and document them.
- Foundations and token bindings own visual values.
- Platform standards define **what** the component means and how it behaves.
- Existing package code and stories establish current platform capability.

Do not substitute one source's authority for another's, and do not copy a
public interface merely because it exists on a reference page.

## Propose the contract

Report this compact contract before writing:

- purpose, native semantic target, and out-of-scope cases;
- classification: standalone, page-local composition, fixed compound, or
  restricted-slot compound; and designer-approved canonical child dependencies
  with their Figma and code-package readiness;
- public properties, defaults, and platform mapping;
- named parts/content positions, reading order, and ownership of label,
  description, validation, status, and child controls;
- required visual states, precedence where states overlap, accessibility/form
  behaviour, and motion/reduced-motion treatment when applicable;
- available token/style bindings, visible theme evidence, smallest useful
  examples, and unresolved material decisions.

Classify each proposed addition once: **Property** (product-controlled choice),
**State** (temporary condition), **Rule** (always true), **Part** (internal
piece or canonical child), or **Example** (representative use).

Stop and ask a concise question, with viable choices and a recommendation, for
any material unresolved semantic, state, accessibility, ownership, responsive,
content, motion, or token decision. Never invent a token, visual value, state,
public property, or accessibility rule.

Treat a reusable compound as a real component. It owns its layout, coordination,
and only new stable behaviour; each child retains its native semantics,
accessibility, visual states, and child interface. Expose only the compound's
stable public interface—never mirror all child properties.

Build a designer-approved compound from real instances of the approved canonical
child components. A fixed compound uses configured child instances. A
restricted-slot compound may have one instance-swap property only for a genuine
named semantic slot; it is not a generic "put anything here" escape hatch. If
a required reusable child is missing, stop and propose that child first unless
the user explicitly authorises a component-family page. If the arrangement is
not reusable outside one screen, it is page-local and must not receive a
component page.

Calculate the public variant matrix before adding an axis. If it would exceed
30 public combinations or become impractical to browse, use a named part,
state evidence, or a smaller interface. Do not turn hover, focus-visible,
pressed, open, empty, validation, loading, or a Figma-only content preview into
a public property merely because it has visual evidence. Classify a Figma-only
textual preview by the one native condition it depicts: `Preview value` for
`value/defaultValue`; `Preview placeholder` for `placeholder`; or `Preview text`
plus a Figma-only `Preview state` only when the page intentionally shows both.
Give each row type `preview`, state `Figma-only canvas preview; not a code API.`,
and record its exact native mapping. Never call it a generic `Preview`, `Text`,
`Canvas content`, `Canvas value`, or `Content / Preview`.

## Create from the fixed shell

Create the target **Figma Page** first. Its name is
`[COMPONENT NAME]-SHADCN`. Then set that page as the current page exactly once.
Duplicate the canonical template's `Component / Page` **frame** (or the
user-approved alternate), explicitly append the clone to the target Figma Page,
and rename the cloned frame `[Component name] / Page`. Do not rely on
`clone()` inheriting the correct parent or on whatever Figma page happens to be
active.

Before populating any content, verify all of the following through Figma MCP:

```text
target Figma Page name = [COMPONENT NAME]-SHADCN
canvas root name       = [Component name] / Page
canvas root parent     = target Figma Page
target page children   = exactly one canvas root
Readme/template pages  = unchanged
```

Only then preserve this exact visible **canvas-root** layer tree:

```text
[Component name] / Page
├── Page metadata
└── Page content
    ├── Page title
    ├── 00 Use
    │   ├── Section title
    │   ├── Usage
    │   ├── Properties
    │   │   └── Properties table
    │   └── Rules
    ├── 01 Component
    │   ├── Section title
    │   ├── Section guidance
    │   └── Component interface
    ├── 02 States
    │   ├── Section title
    │   ├── Section guidance
    │   ├── State evidence
    │   └── Theme coverage
    │       └── Theme modes
    │           ├── Theme mode / Light
    │           └── Theme mode / Dark
    └── 03 Examples
        ├── Section title
        ├── Section guidance
        └── Examples
```

Keep exactly one visible `[Component name] / Page` root on the target Figma
Page and one canonical public component set. Do not create duplicate page
shells, legacy matrices, loose legends, or competing public assets.

### Populate 00 Use

- State intended use and nearest inappropriate use.
- Do not add generic section guidance or an update note. Record only information
  that affects use, the interface, or implementation.
- Use the Properties table for every implementation-relevant choice. It has four
  columns: **Property**, **Type**, **Default**, and **Description**. Type is
  exactly one of: `property` (approved design-system API), `native` (platform
  interface), `content` (child/slot content), or `preview` (Figma-only canvas
  evidence). State the allowed values and exact platform/content mapping in
  Description.
- Use `native` as the Type for an existing platform interface such as
  `disabled`, even when Figma exposes a Boolean property to preview that native
  condition on canvas. A Figma inspector control does not create a wrapper or
  code API.
- Use `content` for visible child content such as a Button label or icon. State
  the exact child/slot or native accessible-name mapping; do not turn it into a
  bespoke code attribute merely because Figma exposes a Text or instance
  property.
- A preview row has type `preview`. Name a value-only preview `Preview value`
  and map it to `value/defaultValue`; name a placeholder-only preview `Preview
  placeholder` and map it to `placeholder`. If the page shows both, name the
  text row `Preview text`, add a Figma-only `Preview state` selector, and state
  the mapping for each state. Every preview Description starts: `Figma-only
  canvas preview; not a code API.` Use `native` for platform attributes a
  consumer supplies rather than inventing a wrapper property.
- If the component needs a canvas-only Placeholder/Value selector, name that
  Figma variant property `Preview state`. Describe it with the preview row; it
  is not a code API. If it is exposed in the Figma inspector, give it its own
  table row with type `preview`, never `enum`.
- Record invariant content, accessibility, ownership, composition behaviour,
  and state precedence in 00 Use → Rules. For an interactive component,
  state the component-specific resolution order in one concise sentence.
  Separate a persistent value such as Checked, Selected, or Indeterminate from
  temporary interaction treatment. Do not reuse a generic order blindly:
  compound controls must state child ownership and bound/disabled behaviour,
  while a non-interactive asset needs no precedence rule.
- For native text-like controls, record whether the shown dimensions are fixed,
  minimum, or content-driven, and whether native resize behaviour is preserved
  or deliberately constrained. When a Field or form owns validation timing,
  state that it supplies `aria-invalid` after the approved event (for example,
  blur or failed submit); do not imply that every raw native `:invalid` state
  is immediately visible.

### Populate 01 Component

- Replace the placeholder with the single canonical public component set. It is
  the only asset designers use on product screens.
- Set Section guidance exactly to: `Public asset. Use from Assets in product
  screens.` Put any meaningful implementation mapping in 00 Use, not in this
  generic guidance line.
- Include only intentional public properties and real defaults. Add a concise
  Figma component description describing the public interface and native/
  platform mapping.
- Use meaningful logical layer names such as Container, Control, Label,
  Leading content, Trailing content, Description, and Validation only when the
  part exists. Preserve reading order and avoid left/right names.
- For a compound, nest real canonical child instances here; never redraw,
  detach, or copy their layers. A fixed compound shows its configured children.
  A restricted-slot compound exposes only the approved instance-swap property
  for its named semantic slot. Keep layout and compound-owned parts around the
  child instances, and do not surface child-local controls as parent properties.
- Bind visual layers to existing variables and styles. Never replace a live
  binding with a typed visual value or infer a token from an apparent match.
  Record an approved raw exception in 00 Use.

### Populate 02 States

- Show only approved visual-state evidence, using instances of the 01 Component
  asset. State evidence is never a competing public component set.
- For a compound, show only states it owns or coordinates. Show a child-local
  condition through the nested child instance; do not duplicate that condition
  as a new parent state unless the parent has an explicit response to it.
- For a native control with browser-owned parts, define the control and each
  browser-owned part's states separately. Do not infer that a child uses the
  parent’s focus treatment. Record the approved keyboard-focus treatment and
  any geometry rule that affects the part, then show it as state evidence.
- Prefix every private component asset with `.`. Use names such as
  `.Component / State reference` or `.Component / Embedded`; the dot signals
  “internal, not for product screens” but does not replace an explicit
  documentation-only description.
- Keep Light and Dark evidence when the theme has a visible result.
- For motion, show static evidence and record the approved motion and
  reduced-motion rule in 00 Use.

### Populate 03 Examples

- Use real 01 Component instances and other canonical child instances.
- Show only normal use, meaningful optional/long content, and one meaningful
  compound composition where relevant. Do not make a permutation matrix.
- Name a fixture-only composition as such: its visible label begins
  `Fixture only —` and its root layer begins `Fixture only /`. It is not an
  Asset or component API. If it has a stable reusable interface, stop and
  propose a missing compound component instead.

## Validate and report

Re-read the created page through Figma MCP and inspect a screenshot. Confirm:

- correct top-level Figma Page: `[COMPONENT NAME]-SHADCN`; the canvas root's
  direct parent is that page; it is the page's only canvas root; Readme and the
  template page do not contain the new canvas root;
- exact shell hierarchy, one visible root, no stale placeholder, loose legend,
  duplicate asset, cropped content, or overlap;
- every public Figma property is an approved Property and every Property is
  explained in 00 Use;
- every State is evidence, not an accidental public property, and overlapping
  state precedence is recorded in 00 Use → Rules when applicable;
- States and Examples use real canonical instances or are explicitly marked as
  fixture-only compositions;
- every nested child in a compound is a real canonical public Figma instance,
  not copied from State or Example evidence; check its target code-package
  availability and report an unavailable child as an implementation dependency;
- child references, property references, layer names, ownership, and reading
  order are clear;
- variables/styles are bound and every raw-value exception is explicit.

Report page/component-set URLs and IDs, public properties, named parts, state and
theme coverage, child dependencies, variable/style bindings, examples, and
remaining decisions. Do not implement code.

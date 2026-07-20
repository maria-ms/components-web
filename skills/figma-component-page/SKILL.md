---
name: figma-component-page
description: Create or revise an implementation-ready canonical component page in this Design System's Figma file. Use when asked to add a Figma component page, turn an old component into a canonical page, or create a new primitive or compound before code implementation. Research the component interface with Figma Foundations, shadcn, MDN, and relevant standards; duplicate and validate the fixed COMPONENT-PAGE-TEMPLATE shell.
---

# Canonical Figma component page

Create Figma pages only. Do not implement code, alter Foundations/tokens, or
modify existing canonical component pages unless the request expressly says to
revise one.

Before every Figma write, load and follow `figma-use` and
`figma-generate-library`. Stop and report the limitation if Figma MCP is not
available or cannot write to the supplied Design System file.

## Intake

Before inspecting or changing Figma, ask only for the following. Accept
`unknown` when the decision has not been made.

1. Component name.
2. What it is and the product job it supports.
3. Primitive, compound, or unknown. For a compound, name expected child
   components if known.
4. Figma links or selections that show an old/deprecated component, a visual
   reference, a product screen, or a related canonical component. Accept
   `none`.
5. Known decisions or open questions: states, validation, content, loading,
   responsive behaviour, accessibility, or motion.

Summarize the answer concisely. Propose the page name
`[COMPONENT NAME]-SHADCN`. Do not create the page until the brief is sufficient
to research; do not guess missing material decisions.

## Research and decision hierarchy

Inspect, in this order:

1. Figma README, Foundations, and the live variables, styles, and bindings.
2. `COMPONENT-PAGE-TEMPLATE`. Duplicate it; never recreate the shell manually
   or infer it from another component page.
3. The closest approved `*-SHADCN` pages, including BUTTON-SHADCN, for visual
   quality, naming, and editorial precedent only. Never inherit their interface
   or state axes without an explicit decision.
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

## Propose the contract

Report this compact contract before writing:

- purpose, native semantic target, and out-of-scope cases;
- primitive/compound decision and canonical child dependencies;
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

Treat a compound as a real component: compose already-canonical child instances
and expose only its stable public interface. If a required child is missing,
stop and propose that child first unless the user explicitly authorises a
component-family page.

Calculate the public variant matrix before adding an axis. If it would exceed
30 public combinations or become impractical to browse, use a named part,
state evidence, or a smaller interface. Do not turn hover, focus-visible,
pressed, open, empty, validation, loading, or a Figma-only content preview into
a public property merely because it has visual evidence. Name a preview `Preview`
and record its native mapping; it is not a code property by itself.

## Create from the fixed shell

Duplicate `COMPONENT-PAGE-TEMPLATE`, rename the new page
`[COMPONENT NAME]-SHADCN`, and preserve this exact visible layer tree:

```text
Component / Page
├── Page metadata
└── Page content
    ├── Page title
    ├── 00 Use
    │   ├── Section title
    │   ├── Section guidance
    │   ├── Update note
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

Keep exactly one visible `Component / Page` root and one canonical public
component set. Do not create duplicate page shells, legacy matrices, loose
legends, or competing public assets.

### Populate 00 Use

- State intended use and nearest inappropriate use.
- Use the Properties table for genuine public properties only. It has four
  columns: **Property**, **Type**, **Default**, and **Description**. State the
  allowed values and native/platform mapping in Description.
- Label Figma-only canvas content as `preview`; state its mapping clearly and
  never present it as a code property. Use `native` for platform attributes a
  consumer supplies rather than inventing a wrapper property.
- Record invariant content, accessibility, ownership, and composition behaviour
  in Rules.
- Use Update note only for a decision that changes a public property, state, or
  rule. Do not duplicate token values.

### Populate 01 Component

- Replace the placeholder with the single canonical public component set. It is
  the only asset designers use on product screens.
- Include only intentional public properties and real defaults. Add a concise
  Figma component description describing the public interface and native/
  platform mapping.
- Use meaningful logical layer names such as Container, Control, Label,
  Leading content, Trailing content, Description, and Validation only when the
  part exists. Preserve reading order and avoid left/right names.
- Bind visual layers to existing variables and styles. Never replace a live
  binding with a typed visual value or infer a token from an apparent match.
  Record an approved raw exception in 00 Use.

### Populate 02 States

- Show only approved visual-state evidence, using instances of the 01 Component
  asset. State evidence is never a competing public component set.
- Keep Light and Dark evidence when the theme has a visible result.
- For motion, show static evidence and record the approved motion and
  reduced-motion rule in 00 Use.

### Populate 03 Examples

- Use real 01 Component instances and other canonical child instances.
- Show only normal use, meaningful optional/long content, and one meaningful
  compound composition where relevant. Do not make a permutation matrix.
- Name a fixture-only composition as such. If it has a stable reusable
  interface, stop and propose a missing compound component instead.

## Validate and report

Re-read the created page through Figma MCP and inspect a screenshot. Confirm:

- exact shell hierarchy, one visible root, no stale placeholder, loose legend,
  duplicate asset, cropped content, or overlap;
- every public Figma property is an approved Property and every Property is
  explained in 00 Use;
- every State is evidence, not an accidental public property, and overlapping
  state precedence is recorded;
- States and Examples use real canonical instances or are explicitly marked as
  fixture-only compositions;
- child references, property references, layer names, and reading order are
  clear;
- variables/styles are bound and every raw-value exception is explicit.

Report page/component-set URLs and IDs, public properties, named parts, state and
theme coverage, child dependencies, variable/style bindings, examples, and
remaining decisions. Do not implement code.

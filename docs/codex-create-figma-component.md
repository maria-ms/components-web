# Codex prompt — create a canonical Figma component page

Use this prompt in Codex to create a Figma page only. It uses Codex's Figma
MCP, shadcn MCP, and repository access. Run
[`codex-implement-component.md`](./codex-implement-component.md) only after
this page is complete and accepted.

```text
Create an implementation-ready canonical Figma page for [COMPONENT NAME], a
[PRIMITIVE / COMPOUND]. Work in the current Design System Figma file using
Figma MCP. Use [SOURCE FIGMA URL OR EXISTING COMPONENT] only as source
material, not as a reason to duplicate obsolete structure.

Before changing anything, inspect these sources in this order:
1. Figma README, Foundations, and live variable/style bindings.
2. BUTTON-SHADCN, the page, layer, contract, and handoff benchmark.
3. ds/tokens/dist, which defines the implementation values available to code.
4. The existing Button in ds/components-web and its README, for native
   composition, exports, and package conventions.
5. The existing Button stories and Storybook configuration, for the smallest
   useful story and theme pattern.
6. The closest shadcn component through its MCP, for behavioural and
   compositional precedent only. It does not override Figma, tokens, or native
   web standards, and it is not a dependency to copy into this package.

`BUTTON-SHADCN` is the only canonical Button baseline. Legacy component pages
are discovery-only: never inherit their variants, state axes, or old web API
unless the new `00 Contract` explicitly adds and justifies them.

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

First report a concise proposed contract containing:
- semantic native target and purpose;
- out-of-scope cases;
- public properties, defaults, and platform mapping;
- logical content positions / slots and reading order;
- native states and visual-state evidence;
- ownership of label, description, validation, and child controls;
- child components required by a compound;
- available token mappings and the smallest required stories;
- every unresolved decision.

If a material token, semantic, accessibility, state, ownership, responsive, or
content decision is missing, stop and request that decision. Do not invent a
token, visual value, state, public property, accessibility rule, or responsive
behaviour.

If the contract is complete, create a new Figma page named
[COMPONENT NAME]-SHADCN. Follow BUTTON-SHADCN exactly as the working-page
pattern. The page contains one component section with these four frames, in
this exact order:

00 Contract
- State purpose, native semantics, public interface, content positions,
  ownership, state rules, layout/content ownership, scope, and platform
  implementation mapping.
- Record decisions visuals cannot express. Do not repeat token values here.
- A true/false Figma variant may represent a native boolean condition such as
  disabled when it is needed to show the visual result. State its native
  platform mapping here. Hover, focus-visible, pressed, empty, and loading are
  not public properties unless product users intentionally configure them.

01 Components
- Create the canonical reusable component set with only intentional public
  product choices and real defaults.
- Bind visual layers to existing Figma variables and styles. Do not type visual
  values into layers. If an approved source has an unavoidable raw visual
  exception, document it in 00 Contract rather than creating a speculative
  token.
- Keep meaningful layers: Container, leading content, control or label,
  trailing content, description, and validation where applicable.
- A primitive owns one semantic control, its token styling, and defined native
  states. A compound is also a component: it composes real child component
  instances and exposes only its stable public interface. Never flatten or
  redraw a reusable child component.
- A compound may compose only an already-canonical child component. If a child
  is missing, create and approve it first with this prompt, unless the task
  explicitly authorises a component-family page.
- Add a concise component description for the selection panel: public API and
  platform mapping only.

02 States
- Show only defined default, hover, focus-visible, disabled, and other
  documented states as visual evidence.
- Use the same structure, variables, and layers as 01 Components.
- State evidence is not a product API. If a state or its token is absent, leave
  it unresolved and report it; never invent it.

03 Examples
- Use real component instances and actual child components.
- Show the smallest meaningful set: normal use, optional content, long
  content, and one meaningful compound composition when relevant.
- Examples are not new variants and not a permutation matrix.

Use logical names and reading order, not left/right assumptions. Reuse existing
variables, text styles, icons, and components; do not create duplicates.

Before reporting completion, re-read the page through Figma MCP and verify:
- the page hierarchy and the four required frames;
- canonical component properties and their references on descendant layers;
- variable/style bindings and every declared raw-value exception;
- separation between public component properties and state evidence;
- examples are real instances of canonical components and real child
  components;
- a screenshot shows readable, uncropped, non-overlapping content.

Report the new page and canonical component-set URLs/IDs, public properties,
state-reference coverage, token/style bindings, examples, and unresolved
decisions. Do not implement code in this task.
```

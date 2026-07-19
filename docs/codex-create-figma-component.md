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

Start with this designer brief. State `unknown` rather than guessing:
- Component or change:
- Primitive or compound:
- Product situation it supports:
- Known content or child parts:
- Known states or behaviours:
- Source material or existing page:
- Decisions already made:

Before changing anything, inspect these sources in this order:
1. Figma README, Foundations, and live variable/style bindings.
2. BUTTON-SHADCN, the page, layers, About rules, and handoff benchmark.
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
unless the new `00 About` explicitly adds and justifies them.

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

Before proposing a contract, classify every proposed addition with one primary
meaning. A change may be shown in more than one section, but it must not gain
multiple, conflicting meanings.

- Option — a product-controlled choice.
- State — a temporary user, system, or platform condition.
- Rule — behaviour that is always true.
- Part — a named internal piece or canonical child component.
- Example — a representative use of the canonical component.

Classify every 03 Examples item explicitly as one of: a canonical component
instance, a fixture-only composition, or a missing compound component. Do not
leave a raw frame whose ownership or implementation status is ambiguous.

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

Also report, before writing to Figma:
- the Option / State / Rule / Part / Example classification;
- required existing child components and missing dependencies;
- a value map: token-bound, inherited from the surrounding context, documented
  fixed exception, or missing;
- a decision table for every unresolved material choice, with question,
  viable choices, recommendation, Figma impact, and implementation impact.

Treat a component that has no native semantic equivalent as a material
accessibility decision: define whether it is purely visual, exposes a status,
or has its meaning owned by a parent. If it has motion, define its trigger,
direction, timing/easing, loop/end behaviour, and reduced-motion behaviour.

Before adding a Figma variant axis, calculate the resulting component matrix.
If it would create more than 30 combinations or an impractical browsing and
maintenance burden, stop and propose a nested canonical part, state evidence,
or a revised public interface. Do not multiply variants merely to represent a
temporary condition.

If a material token, semantic, accessibility, state, ownership, responsive, or
content decision is missing, stop and request that decision. Do not invent a
token, visual value, state, public property, accessibility rule, or responsive
behaviour.

If the contract is complete, create a new Figma page named
[COMPONENT NAME]-SHADCN. Follow BUTTON-SHADCN exactly as the working-page
pattern. The page contains one component section with these four frames, in
this exact order:

00 About
- State purpose, native semantics, public interface, content positions,
  ownership, state rules, layout/content ownership, scope, and platform
  implementation mapping.
- Keep the same short `How to update this page` guide and shared meanings for
  Option, State, Rule, Part, and Example as BUTTON-SHADCN. Adapt the component
  content; do not copy Button-specific rules.
- Record decisions visuals cannot express. Do not repeat token values here.
- A true/false Figma variant may represent a native boolean condition such as
  disabled when it is needed to show the visual result. State its native
  platform mapping here. Hover, focus-visible, pressed, empty, and loading are
  not public properties unless product users intentionally configure them.

01 Component
- Create the canonical reusable component set with only intentional public
  product choices and real defaults.
- Bind visual layers to existing Figma variables and styles. Do not type visual
  values into layers. If an approved source has an unavoidable raw visual
  exception, document it in 00 About rather than creating a speculative
  token.
- Read and preserve each exact Figma binding. Never infer a token from a
  visual value, a frame's apparent size, or a component name.
- Name properties and parts by the capability they permit, not only the asset
  currently shown. For example, call a position `Leading content` only when it
  genuinely permits more than icons; otherwise keep the deliberate constraint
  explicit.
- Keep meaningful layers: Container, leading content, control or label,
  trailing content, description, and validation where applicable.
- A primitive owns one semantic control, its token styling, and defined native
  states. A compound is also a component: it composes real child component
  instances and exposes only its stable public interface. Never flatten or
  redraw a reusable child component.
- Any canonical component that references a child, including a conditional
  state or an example, may compose only an already-canonical child component.
  If a child is missing, create and approve it first with this prompt, unless
  the task explicitly authorises a component-family page.
- Add a concise component description for the selection panel: public API and
  platform mapping only.

02 States
- Show only defined default, hover, focus-visible, disabled, and other
  documented states as visual evidence.
- Use the same structure, variables, and layers as 01 Component.
- State evidence is not a product API. If a state or its token is absent, leave
  it unresolved and report it; never invent it.
- For motion, show the static visual reference and record the approved motion
  and reduced-motion rule in 00 About; do not imply an unspecified animation.

03 Examples
- Use real component instances and actual child components whenever a
  canonical component exists. A fixture-only composition must be named as such
  and must not pretend to be a canonical instance or introduce a public API.
- Show the smallest meaningful set: normal use, optional content, long
  content, and one meaningful compound composition when relevant.
- Examples are not new variants and not a permutation matrix.

Use logical names and reading order, not left/right assumptions. Reuse existing
variables, text styles, icons, and components; do not create duplicates.

Before reporting completion, re-read the page through Figma MCP and verify:
- the page hierarchy and the four required frames;
- every Option in 00 About maps to an intentional public Figma property, and
  every public Figma property is explained in 00 About;
- canonical component properties and their references on descendant layers;
- variable/style bindings and every declared raw-value exception;
- separation between public component properties and state evidence;
- each example's instance / fixture / missing-compound classification, plus
  its child components and exact bindings;
- a screenshot shows readable, uncropped, non-overlapping content.

Report the new page and canonical component-set URLs/IDs, public properties,
state-reference coverage, token/style bindings, examples, and unresolved
decisions. Do not implement code in this task.
```

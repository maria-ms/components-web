# Component workflow prompts

Use these two prompts as the handoff path. The Figma page is the visual source
of truth; `ds/tokens/dist` is the only source of implementation values. A
component is ready only when the two describe the same public interface.

## 1. Figma Agent — create an implementation-ready component page

Paste this into the Figma Agent after replacing the bracketed values.

```text
Create a new component page named [COMPONENT NAME] from this existing source:
[SOURCE FIGMA URL]. Work in the current Design System file. Read the README
and Foundations first. Reuse only existing variables, text styles, icon assets
and component instances. Do not create duplicate variables, styles or icons.

The page must be a designer-friendly working page and an unambiguous handoff
for developers and coding agents. Use exactly these four top-level frames, in
this order:

1. 01 Component
   - Create the canonical reusable component set here.
   - Include only public choices as component properties: required appearance
     variants, size, boolean product conditions, text and instance-swap
     content. Give every property a clear product name and a real default.
   - Bind every visual layer directly to existing Figma variables and styles;
     do not type visual values into layers. Keep meaningful layers: Container,
     leading content, label/control, trailing content. Do not flatten reusable
     child components.
   - Add a concise component description that says purpose, semantic element,
     public choices, accessibility rule, and what is deliberately out of
     scope. Add descriptions to non-obvious component properties.

2. 02 State reference
   - Show default, hover, focus-visible, disabled and any other defined
     behaviour as visual reference. These are evidence for implementation,
     not public properties, unless users can intentionally choose them in the
     product.
   - Use the same variables and layers as the canonical component. Mark any
     missing state or token as a decision needed; never invent it.

3. 03 Examples
   - Show the smallest set of meaningful product compositions: normal use,
     optional content/slots, long content, and a real compound composition
     where relevant.
   - Use instances of the component set and actual child components. Examples
     are examples, not new variants or text properties.

4. 04 Handoff notes
   - Write brief, explicit notes for semantics, keyboard/accessibility,
     responsive/content ownership, slot/content order, and out-of-scope cases.
   - For a compound component, name the child component(s) it composes and
     state which child owns each responsibility. For example, Field composes a
     Label, one Input/Select/Textarea control, and optional description or
     validation text; it must use those real child instances rather than a
     flattened drawing.

Rules:
- A primitive owns only its semantic element, token styling and defined native
  states. A compound is also a component: it composes real primitive/component
  instances and exposes only its own stable public interface.
- Treat Label, leading content, control, trailing content, description and
  validation as logical content positions. Use their reading order; never bake
  left/right assumptions into names.
- Put visual values on the component layers through variable bindings. Do not
  add a separate token table that can drift from those bindings.
- Do not turn hover, focus-visible, pressed, empty, loading or content examples
  into public variants unless they are intentional product API. Do not create a
  matrix of every possible combination.
- Use the native semantic control as the implementation target: Button is an
  action, Link is navigation, input/select/textarea retain their native
  semantics. If a custom behaviour is necessary, document why.

Before making changes, report any missing variable, state, accessibility rule,
content rule or ownership decision that makes the component ambiguous. Once
complete, report the canonical component-set name, its public properties, the
state-reference coverage, examples created, and every unresolved decision.
```

## 2. Codex or engineering agent — implement from Figma into web components and Storybook

Paste this into the coding agent after replacing the bracketed URL.

```text
Implement [COMPONENT NAME] from this canonical Figma page:
[CANONICAL FIGMA PAGE OR COMPONENT URL]

Work only in ds/components-web and ds/storybook-web. Use values only from the
generated ds/tokens/dist output. Inspect the Figma canonical component set,
state-reference frame, examples, component/property descriptions and the
actual variable/style bindings before writing code. Treat them as one contract.

First report the implementation contract: semantic HTML target; public
properties and defaults; native states; content/slots; composed children;
token mappings; example stories; and every gap. Stop for direction rather than
inventing a missing state, token, value, semantic rule or responsive rule.

Then implement the smallest public component that preserves the web-standard
counterpart:
- Use the correct native semantic element. Preserve its standard attributes,
  events, keyboard behaviour, form behaviour and accessibility API. Do not
  replace native attributes such as disabled, name, value, type, required or
  aria-* with duplicate custom properties.
- Use custom-element properties only for the stable visual/component API
  documented in Figma. Map Figma state reference to native selectors and
  mechanisms, not artificial public controls.
- Keep the component composable. Consumer content must remain real DOM content;
  use named slots only when the component genuinely owns named content areas.
  A compound component must compose the actual primitive/component children,
  never duplicate their styling as flattened markup.
- Use token variables from dist for all design values. CSS reset values and
  browser/forced-colors compatibility rules are allowed; no hard-coded visual
  values, copied Figma colours or invented fallbacks.
- Follow the current shadcn-style discipline of small explicit variants and
  composable child content, while keeping native HTML as the behaviour source.
  Follow MDN and WAI-ARIA guidance: explicit button type where appropriate,
  native disabled where available, visible focus, and an accessible name for
  every interactive control.

Create only the stories justified by the Figma page:
1. Playground: public choices as Controls, real semantic markup and event
   logging in Actions.
2. Canonical variants/sizes only when the Figma component set needs visual
   comparison.
3. FigmaExamples: mirror the examples/compositions frame using approved child
   assets. Do not create a story for every cross-product.
4. Native state evidence such as disabled; do not expose hover/focus as fake
   Controls.

Import components through their public package entry point and token CSS from
@maria-ms/tokens. Update the package export, concise README and this workflow
only if the public contract changes. Delete superseded component/stories only
when explicitly requested. Run package checks and a Storybook production build,
then report the exact Figma-to-code mapping, files changed, verification and
unresolved gaps.
```

The baseline for the web contract is the [HTML button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button), the [WAI-ARIA Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), and the [shadcn Button](https://ui.shadcn.com/docs/components/button) approach to small variants and composable content.

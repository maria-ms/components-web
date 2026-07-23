---
name: create-figma-component-page
description: Create or revise an implementation-ready canonical component page in this design system's Figma file. Use when asked to add a Figma component page, turn a legacy component into a canonical page, or define a new reusable primitive or compound before code implementation. Build from the approved template, Foundations, existing canonical assets, and web-platform semantics.
---

# Create a canonical Figma component page

Create or revise Figma component pages only. Do not implement code, alter
Foundations or tokens, or change another canonical component page unless the
request expressly includes it.

Before every Figma write, load and follow `figma-use` and
`figma-generate-library`. Stop and report the limitation if Figma MCP is not
available or cannot write to the supplied file.

Use these terms precisely:

- **Figma Page** — the top-level item in the Figma file sidebar, named
  `[COMPONENT NAME]-SHADCN`.
- **Canvas root** — the one frame on that Figma Page, named
  `[Component name] / Page`.

Never place a new canvas root on README, Foundations, the template page, or
whatever page happens to be active. Never describe a canvas root as a Figma
Page.

## Intake

Ask only for information that is not already supplied:

1. Component name.
2. One sentence describing the product need it solves.
3. Reuse boundary: `standalone`, or links/selections for the canonical public
   components it must compose. Accept `unsure`.
4. Optional Figma links/selections for legacy visual reference, related
   components, or product screens. Accept `none`.

Do not ask the designer to classify the component as primitive, compound,
layout, input, or navigation. Use the reuse boundary and the native semantic
target to make that decision.

When reuse is `unsure`, inspect the library, offer a short candidate list, and
wait for approval of child dependencies. Never silently select or create a
reusable child on the designer's behalf.

## Sources and decision order

Inspect in this order:

1. The Figma README, Foundations, live variables, styles, and bindings.
2. The approved
   [Component Page Template](https://www.figma.com/design/quQrWVWWnKGO2y2IHMudis/Design-System-v2.0-2026?node-id=40022477-52).
3. The closest approved canonical component pages: their construction and
   editorial conventions are precedent, not authority for a new interface.
4. Supplied Figma references. Treat legacy pages as visual discovery only.
5. `ds/tokens/dist`, `ds/components-web`, and Storybook. Inspect only; do not
   modify them during this skill.
6. Native HTML/MDN first, then accessibility or established component
   precedents only when a genuine interaction, composition, or keyboard
   question remains.

Resolve conflicts in this order:

1. Native HTML/MDN owns semantics, permitted content, form behaviour,
   accessibility, and keyboard defaults.
2. Figma Foundations and live bindings own visual values.
3. The approved page contract owns intentional design-system choices,
   composition, and documentation.
4. Existing package code establishes current implementation capability.

Never infer a public API from a screenshot, legacy variant, state evidence,
recipe, or external library API.

## Decide the reusable boundary

- **Page-local composition:** a one-off screen arrangement. Do not create a
  component page.
- **Standalone component:** one stable reusable asset with no child component
  dependency.
- **Fixed compound:** a stable reusable asset assembled from configured public
  child instances.
- **Restricted-slot compound:** a stable reusable asset with a genuine named
  semantic child position. Restrict the slot to approved canonical children.

A compound owns layout, coordination, and any new stable behaviour. Its child
retains native semantics, interaction state, and its own interface. Do not
mirror child properties on the parent.

If a required reusable child is missing, propose that child first. Create the
parent only when the user explicitly authorises a component-family dependency.

## Propose the contract before writing

Report briefly:

- purpose, native semantic target, and out-of-scope cases;
- reusable boundary and approved child dependencies;
- public properties, defaults, content positions, and platform mappings;
- ownership of labels, descriptions, errors, status, and child controls;
- required behaviour evidence, state precedence, theme, motion, and reduced
  motion treatment where relevant;
- exact available bindings and any material unresolved decision.

Classify every item once:

- **property** — an intentional design-system choice;
- **native** — a platform interface or condition;
- **content** — text, a child, or a documented slot;
- **preview** — Figma-only canvas evidence;
- **state** — temporary evidence, never a public API;
- **rule** — always true;
- **recipe** — a representative real assembly.

Stop for a concise decision when a material semantic, ownership, accessibility,
state, token, or content question remains. Do not invent a fallback.

## Create from the approved shell

Create a top-level Figma Page named `[COMPONENT NAME]-SHADCN`. Duplicate the
template canvas root, append it explicitly to that new Figma Page, and rename
the root `[Component name] / Page`. Do not rely on the active page or clone
parentage.

Before populating it, verify:

```text
Figma Page name       = [COMPONENT NAME]-SHADCN
canvas root name      = [Component name] / Page
canvas root parent    = target Figma Page
target page children  = exactly one canvas root
README/template pages = unchanged
```

Preserve this shell exactly:

```text
[Component name] / Page
├── Page metadata
└── Page content
    ├── Page title
    ├── 00 Component
    │   ├── Section title
    │   ├── Section guidance
    │   └── Component interface
    ├── 01 Behavior
    │   ├── Section title
    │   ├── Section guidance
    │   ├── Behavior evidence
    │   └── Theme coverage
    ├── 02 Recipes
    │   ├── Section title
    │   ├── Section guidance
    │   └── Examples
    └── 03 Use
        ├── Section title
        ├── Section guidance
        ├── Usage
        │   ├── Use it for
        │   │   ├── Heading
        │   │   └── Body
        │   ├── Configure
        │   │   ├── Heading
        │   │   └── Body
        │   └── Add content / compose
        │       ├── Heading
        │       └── Body
        ├── Properties
        └── Rules
```

Use the template's styles, Auto Layout, and variable bindings. Do not recreate
the shell manually, add archive layers, or leave loose legends, matrices, or
duplicate public assets.

### 00 Component — public Asset

- Put the only public component master or component set here.
- Set guidance to: `Public asset. Use from Assets in product screens.`
- Expose only intentional public Figma properties and real defaults.
- Use meaningful part names only where they exist: Control, Label, Leading
  content, Trailing content, Description, Validation, Options.
- Compose a compound from real linked public child instances. Never redraw,
  detach, or copy a child’s layers.
- Bind every visual value to existing variables or styles. Never replace a
  live binding with a raw visual value.

### 01 Behavior — private proof

- Show only interaction, validation, content-stress, browser-owned, motion, or
  theme behaviour that needs proof.
- Put private reference assets here only. Prefix their component-set name with
  `.`; for example, `.Select / State reference`.
- Treat checked/selected/on-off as persistent value; treat hover, focus-visible,
  invalid, loading, and open as temporary conditions unless the contract says
  otherwise.
- Keep Light and Dark evidence when tokens visibly differ.
- Do not make a visual state a public component property merely because Figma
  needs a canvas selector to demonstrate it.

### 02 Recipes — real public assemblies

- Make this section optional in substance; leave it empty when no useful
  assembly exists.
- Use only real linked public instances from Assets. No component masters, no
  private `.` references, no manually rebuilt canonical components.
- Show a product assembly only when it teaches a meaningful content,
  composition, or ownership decision.
- Label a non-reusable visual proof `Fixture only / …`; keep it in Behavior,
  not Recipes.

### 03 Use — everyday use and exact contract

Set guidance to:

`How to use, configure, and compose the public component in product screens.`

Fill `Usage` with exactly three short blocks:

- **Use it for:** one sentence describing the product need.
- **Configure:** public Figma properties or native conditions a designer can
  see/configure. Distinguish code-supplied native attributes from Figma
  controls.
- **Add content / compose:** allowed text, child content, or public component
  instances. If none: `No content. The parent provides any related text.`

Keep the three purposes separate:

- `Usage` gives plain-language operational guidance.
- `Properties` is the exact interface table: **Property | Type | Default |
  Description**.
- `Rules` contains semantics, accessibility, ownership, state precedence, and
  constraints.

Use only these property types:

- `property` — intentional design-system API;
- `native` — platform attribute, property, event, focus, validation, or form
  behaviour;
- `content` — visible text, child content, or a documented slot;
- `preview` — Figma-only canvas evidence, never a code API.

For preview values, use precise names and mappings: `Preview value` maps to
`value/defaultValue`; `Preview placeholder` maps to `placeholder`; when both
are intentionally shown, use `Preview text` plus `Preview state`. Every
preview description starts: `Figma-only canvas preview; not a code API.`

## Validate and report

Re-read the page and inspect a screenshot after writing. Confirm:

- correct Figma Page, one visible canvas root, and unchanged README/template;
- exact shell and Usage hierarchy; no placeholders, overlap, cropped content,
  or duplicate assets;
- public component masters only in `00 Component`;
- private references only in `01 Behavior` and dot-prefixed;
- Recipes contain linked public instances only, with no masters or private
  references;
- each Properties type is `property`, `native`, `content`, or `preview`;
- every content/slot relationship, property reference, state owner, and theme
  proof is unambiguous;
- bindings are live and raw-value exceptions are explicit.

Report page/root URLs and IDs, interface, content/slot contract, behaviour
coverage, variables/styles, recipes, unresolved dependencies, and the final
screenshot.

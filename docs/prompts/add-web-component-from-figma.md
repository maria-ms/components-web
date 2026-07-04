You are working in `<repo-root>/ds`.

Add one new Web Component to `components-web`.

First, ask me for the Figma component selection/artboard node URL. Do not start implementation until I provide the URL.

After I provide the URL, use Figma MCP / figma-desktop to inspect that node and implement the component using the existing repo conventions. Do not invent a new architecture.

Treat the Figma artboard as design evidence, not as a 1:1 implementation contract. The artboard may contain variants, states, example content, and product-specific usages. Extract the underlying reusable component model from those examples before writing code.

Before implementing, inspect:

- `tokens/sources/figma-export-modes`
- `tokens/dist/css/light.css`
- `tokens/dist/css/dark.css`
- `components-web/src/components/*`
- `components-web/package.json`
- `storybook-web/src/*.stories.mjs`

Identify the variables/tokens referenced by the Figma component. Verify that every visual token needed by the component exists in the generated token CSS for both light and dark modes.

When reading the Figma artboard, capture:

- all visible variants and states
- repeated structure shared by the variants
- optional regions such as icons, avatars, labels, descriptions, metadata, actions, shortcuts, badges, controls, and helper text
- which parts are component responsibility and which parts are consumer-provided content
- interaction states such as hover, focus, disabled, selected, checked, invalid, expanded, and loading
- responsive or density differences if visible

Do not mirror every Figma variation as a separate component or story. Use the variations to infer the smallest durable API and the most composable internal structure.

If a required Figma-bound token is missing from `tokens/dist/css/light.css` or `tokens/dist/css/dark.css`, stop and report:

- the missing token or Figma variable
- where it is used in the Figma component
- what the designer needs to fix in Figma or in the token export

Do not hardcode missing design-token values in the component.

API design rules:

- Design the public API before implementation and keep it smaller than the Figma artboard surface.
- Prefer semantic native attributes and standard web behavior over design-specific jargon.
- Prefer slots for consumer-owned content: icons, avatars, images, rich labels, row content, metadata, custom actions, suffixes, prefixes, and supporting visuals.
- Use attributes/properties only for component-owned state or styling decisions: `disabled`, `open`, `checked`, `selected`, `expanded`, `invalid`, `size`, `variant`, `tone`, `name`, `value`, native form attributes, and ARIA passthrough where appropriate.
- Do not add props that encode example content from Figma, such as `avatarInitials`, `iconName`, `title`, `description`, `shortcut`, `badgeText`, or `items`, unless the existing component pattern already requires that for a specific reason.
- Avoid API designs that force consumers to duplicate the component for small layout/content differences.
- If the Figma artboard shows multiple use cases, create one composable shell plus optional child elements only when child elements are reusable and stable.
- If the component is mostly a product layout, page region, header, footer, or marketing/content block, stop and report that it should probably be a pattern or Storybook composition rather than a packaged Web Component.

Implementation rules:

- Use plain `.mjs` modules with JSDoc where useful.
- Use the existing Web Component style: custom elements, Shadow DOM, `template.innerHTML`, `WeakMap` instance state, small helper functions.
- Keep the component API minimal, semantic, and web-standard.
- Prefer slotted content over narrow props when consumers should own the content.
- The component should provide branded structure, styling, states, accessibility, keyboard behavior, and layout.
- Consumers should provide business-specific content such as labels, icons, avatars, media, shortcuts, descriptions, and actions through slots or native attributes.
- Keep the Web Component as a light branded style shell where possible: it should park consumer content in the correct structure and apply the design system visual behavior.
- Do not add framework code, TypeScript, build tools, new dependencies, or fallback APIs unless the existing package already uses that pattern.
- Do not use OOP-heavy abstractions beyond the custom element class itself.
- Do not add broad runner code or new layers of indirection.

Styling rules:

- Use generated CSS custom properties from `@maria-ms/tokens`.
- Prefer semantic/component tokens over primitive tokens when available.
- Do not hardcode colors, shadows, typography, radius, or spacing when a generated token exists.
- Do not add `letter-spacing: 0`; omit letter spacing unless the Figma component maps to a real token.
- Keep `font-family: inherit`; the app/root owns font loading and family selection.
- Use `box-sizing: border-box`.
- Use low-specificity component-local selectors.
- Use `:host`, slots, and `part` consistently with existing components.
- Use focus-visible states and tokenized focus shadows when the component is interactive.
- Keep fixed Figma dimensions behind component custom properties so consumers can override them.
- Do not switch to constructable stylesheets unless the existing package already has that convention.

Package contract:

- Add the component under `components-web/src/components/<component-name>/<component-name>.mjs`.
- Export it from `components-web/src/components/index.mjs`.
- Add a subpath export in `components-web/package.json`, for example:
  `"./button": "./src/components/button/button.mjs"`
- Keep `"sideEffects": true`.
- Update the `components-web` `check` script so the new component is syntax-checked.
- Consumers should be able to import only this component:
  `import "@maria-ms/components-web/<component-name>";`

Storybook contract:

- Add or update a story in `storybook-web/src`.
- Import only the component subpath needed by the story, not the whole package.
- If the story uses another component, import that specific subpath too.
- Stories do not need to match Figma variants 1:1. They should document the clean component API and the main reusable states/use cases.
- Prefer a small story set:
  - default usage
  - important semantic states
  - composition examples with slotted content
  - form or interaction behavior when relevant
  - one grouped visual overview only when it helps designers review coverage
- Hide story/demo-only args from Controls.
- Controls should expose only real public component attributes/properties, not example labels, icons, item arrays, or helper data.
- Keep examples composable and realistic.
- Story examples may include local demo content such as icons or avatars, but that content belongs in Storybook, not in the component package, unless it is intrinsic to the component.
- Show the clean consumer-facing HTML source for the specific story instance, not internal helper code and not every Figma artboard variation.
- Update `storybook-web/package.json` `check` script to include the new story.

Validation:

- Run `npm run check` in `tokens` if token output may be stale.
- Run `npm run check` in `components-web`.
- Run `npm run check` in `storybook-web`.
- Run `npm run build` in `storybook-web`.
- Verify every `var(--ds-...)` used by the new component exists in both `tokens/dist/css/light.css` and `tokens/dist/css/dark.css`.
- Report any remaining mismatch between Figma, generated tokens, component styles, and Storybook examples.

Before finishing, summarize:

- the component API
- which Figma node was used
- which token families the component relies on
- any Figma/token gaps found
- checks/builds that passed

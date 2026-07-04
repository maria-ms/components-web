You are working in `<repo-root>/ds`.

Add one new Web Component to `components-web`.

First, ask me for the Figma component selection/artboard node URL. Do not start implementation until I provide the URL.

After I provide the URL, use Figma MCP / figma-desktop to inspect that node and implement the component using the existing repo conventions. Do not invent a new architecture.

Before implementing, inspect:

- `tokens/sources/figma-export-modes`
- `tokens/dist/css/light.css`
- `tokens/dist/css/dark.css`
- `components-web/src/components/*`
- `components-web/package.json`
- `storybook-web/src/*.stories.mjs`

Identify the variables/tokens referenced by the Figma component. Verify that every visual token needed by the component exists in the generated token CSS for both light and dark modes.

If a required Figma-bound token is missing from `tokens/dist/css/light.css` or `tokens/dist/css/dark.css`, stop and report:

- the missing token or Figma variable
- where it is used in the Figma component
- what the designer needs to fix in Figma or in the token export

Do not hardcode missing design-token values in the component.

Implementation rules:

- Use plain `.mjs` modules with JSDoc where useful.
- Use the existing Web Component style: custom elements, Shadow DOM, `template.innerHTML`, `WeakMap` instance state, small helper functions.
- Keep the component API minimal, semantic, and web-standard.
- Prefer slotted content over narrow props when consumers should own the content.
- The component should provide branded structure, styling, states, accessibility, keyboard behavior, and layout.
- Consumers should provide business-specific content such as labels, icons, avatars, media, shortcuts, descriptions, and actions through slots or native attributes.
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
- Hide story/demo-only args from Controls.
- Keep examples composable and realistic.
- Show the clean consumer-facing HTML source, not internal helper code.
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

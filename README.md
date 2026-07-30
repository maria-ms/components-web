# Maria Web Components

Standards-first visual wrappers around consumer-owned native elements. The
native child retains its form, event, validation, focus, and accessibility
behaviour; the `ds-*` element supplies the token-backed visual contract.

## Install

```js
import "@maria-ms/tokens/css/light";
import "@maria-ms/tokens/css/dark";
import "@maria-ms/components-web/styles.css";
import "@maria-ms/components-web/text-input";
```

Set `data-theme="light"` or `data-theme="dark"` on the application root.
Import the CSS entry once; component modules are SSR-safe and register custom
elements only in the browser.

## Sources of truth

| Need | Source |
| --- | --- |
| Visual values, public Figma properties, Slots, and theme evidence | Public Figma master in `Asset source / [category]` |
| Native HTML, ARIA relationships, Figma-only previews, and limits | The component's colocated `contract.yaml` |
| CSS custom-property values | `@maria-ms/tokens` |
| DOM, package API, CSS, and tests | This package |

Figma `State`, `Content`, displayed text, and picker-open settings are design
preview controls unless the linked contract explicitly says otherwise. In code,
use the native element's actual `disabled`, value, validity, focus, and child
content instead of reproducing preview properties.

Each component folder owns its Web contract. `Button / Icon-only` uses
`button/icon-button.contract.yaml`; `Select / Option` uses
`select/option.contract.yaml`. The contracts describe the Web platform only,
not a cross-platform API.

## Shipped components

| Element | Consumer-owned native content |
| --- | --- |
| `ds-button` | `<button>` |
| `ds-icon-button` | `<button aria-label="…">` with decorative icon |
| `ds-checkbox` | `<input type="checkbox">` |
| `ds-choice-field` | label, one Checkbox, Radio, or Switch, optional message |
| `ds-field` | label, one supported control, optional message |
| `ds-link` | `<a href="…">` |
| `ds-number-input` | `<input type="number">` |
| `ds-radio` | `<input type="radio">` |
| `ds-radio-group` | one native `<fieldset>` with same-name Radios |
| `ds-select` | `<select>` with native `<option>` / `<optgroup>` children |
| `ds-spinner` | decorative indicator; parent owns status text/announcement |
| `ds-switch` | `<input type="checkbox" switch>` |
| `ds-text-input` | textual `<input>` |
| `ds-textarea` | `<textarea>` |

`Select / Option` intentionally maps to native `<option>`, not a standalone
web component.

## Example

```html
<ds-field>
  <label slot="label" for="email">Email address</label>
  <ds-text-input slot="control" size="medium">
    <input id="email" type="email" name="email" required />
  </ds-text-input>
  <p slot="message">We’ll only use this for account updates.</p>
</ds-field>
```

Do not use a `ds-*` wrapper to replace the native child with a `div` and ARIA.
Do not create framework APIs from Figma preview controls.

## Development

```sh
npm run check
npm run skills:link
```

`skills:link` symlinks this package’s version-controlled skills into your local
Codex skills folder. Use `npm run skills:unlink` to remove only those links.

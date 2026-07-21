# Maria Web Components

This package currently ships `ds-button`, `ds-icon-button`, and `ds-spinner`.

## Install and register

```sh
npm install @maria-ms/components-web @maria-ms/tokens
```

Load the active token theme once in the application entry point, then import
the component entry point you use.

```js
import "@maria-ms/tokens/css/light";
import "@maria-ms/tokens/css/dark";
import "@maria-ms/components-web/button";
```

Set `data-theme="light"` or `data-theme="dark"` on the document root.

## Button

`ds-button` styles one consumer-owned native `<button>`. It does not replace
the native element or invent a second button API.

```html
<ds-button variant="primary" size="medium">
  <button type="button">Save changes</button>
</ds-button>
```

| Figma property | Web contract |
| --- | --- |
| `Variant` | `primary` (default), `secondary`, `outline`, `ghost`, or `destructive` on `ds-button` |
| `Size` | `small` (default), `medium`, or `large` on `ds-button` |
| `Disabled` | Native `disabled` on the inner `<button>` |
| `Label` | The inner button's accessible text content |
| `Leading icon` / `Trailing icon` | Ordinary first / last child content of the inner button |

```html
<ds-button variant="outline" size="medium">
  <button type="button">
    <svg
      aria-hidden="true"
      width="var(--ds-button-icon-size)"
      height="var(--ds-button-icon-size)"
      viewBox="0 0 24 24"
    ></svg>
    <span>Search</span>
  </button>
</ds-button>
```

The inner native button owns every native concern: `type`, `name`, `value`,
`form`, `disabled`, `aria-*`, popover/command attributes, event listeners and
its child composition. Use `type="button"` unless the intended form action is
submission. The system has no approved Link component or Link Button API yet.

## Icon Button

`ds-icon-button` is the separate public Icon-only Button asset. It uses the
same Variant, Size, native disabled, hover, and focus rules as `ds-button`, but
has a fixed square footprint. Supply a decorative icon and the inner native
button's accessible name.

```html
<ds-icon-button variant="ghost" size="medium">
  <button type="button" aria-label="Search">
    <svg aria-hidden="true" viewBox="0 0 24 24"></svg>
  </button>
</ds-icon-button>
```

This is the Web Components equivalent of shadcn's composable-child approach:
the caller supplies the real semantic control and its content, while
`ds-button` supplies only the documented visual contract. It intentionally does
not reproduce React-specific APIs such as `asChild`.

The component provides token-backed default, hover, focus-visible and disabled
styles. It deliberately has no active/pressed treatment because that state is
not yet defined by the canonical Figma component.

## Spinner

`ds-spinner` is a pure decorative loading indicator. It has no status role,
live-region behaviour or accessible name; its parent supplies the visible task
or status message and any announcement.

```html
<p id="saving-status">
  <ds-spinner size="medium"></ds-spinner>
  Saving changes…
</p>
```

| Figma property | Web contract |
| --- | --- |
| `Size` | `small` (default), `medium`, or `large` on `ds-spinner` |
| Decorative by default | `ds-spinner` is always `aria-hidden="true"`; do not give it a role |
| Reduced motion | CSS stops rotation under `prefers-reduced-motion: reduce` while keeping the partial circle visible |

Spinner inherits the surrounding text colour through `currentColor`. Its outer
sizes use the existing icon-size tokens; its geometry comes from the
Figma-exported SVG content.

## Development

```sh
npm run check
```

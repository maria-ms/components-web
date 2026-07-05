# Maria's Web Components.

## Install

```sh
npm install @maria-ms/components-web @maria-ms/tokens
```

## Use

Load the token CSS once in your app entry, then register the component module you need.

```js
import "@maria-ms/tokens/css/light";
import "@maria-ms/tokens/css/dark";
import "@maria-ms/components-web/avatar";
import "@maria-ms/components-web/input-number";
import "@maria-ms/components-web/dropdown";
```

```html
<ds-field>
  <span slot="label">Amount</span>
  <ds-input-number name="amount" value="1" min="0" max="10" step="1"></ds-input-number>
  <span slot="description">Whole numbers only.</span>
</ds-field>
```

Set `data-theme="light"` or `data-theme="dark"` on your document root to switch token themes.

## Input Number

```html
<ds-input-number value="1" min="0" max="10" step="1"></ds-input-number>
<ds-input-number size="small"></ds-input-number>
<ds-input-number aria-invalid="true" value="1"></ds-input-number>
<ds-input-number disabled value="1"></ds-input-number>
<ds-input-number controls="none" value="1">
  <svg slot="suffix" aria-hidden="true"></svg>
</ds-input-number>
```

Events:

- `input` fires when the value changes.
- `change` fires when the value is committed.

Use `ds-field` for visible labels, descriptions, and validation messages. Use
`ds-field-group` when a pattern combines multiple controls, such as select plus
input.

## Avatar

`ds-avatar` provides the circular frame, photo slot, initials fallback,
placeholder state, and optional badge/status. Slotted media wins over
`initials`; no media and no initials renders the placeholder icon.

```html
<ds-avatar size="md" initials="IN" status="online"></ds-avatar>

<ds-avatar size="md" status="online">
  <img src="/avatar.jpg" alt="Isabel Navarro" />
</ds-avatar>

<ds-avatar size="md" initials="IN" status="online">
  <img src="/avatar.jpg" alt="Isabel Navarro" />
</ds-avatar>

<ds-avatar size="md">
  <img src="/avatar.jpg" alt="Isabel Navarro" />
  <img slot="badge" src="/company.jpg" alt="Acme" />
</ds-avatar>

<ds-avatar size="md" initials="IN">
  <picture>
    <source srcset="/avatar.avif" type="image/avif" />
    <source srcset="/avatar.webp" type="image/webp" />
    <img src="/avatar.jpg" alt="Isabel Navarro" />
  </picture>
</ds-avatar>

<ds-avatar size="md"></ds-avatar>
```

Set `aria-label` on `ds-avatar` when initials are meaningful on their own.
Set `aria-hidden="true"` when the avatar is decorative beside visible text.

## Dropdown

`ds-dropdown` is a menu shell for actions and settings. The component owns menu
behavior; consumers provide the trigger element and menu rows.

```html
<ds-dropdown aria-label="Account menu" align="end">
  <button slot="trigger" type="button">
    <ds-avatar size="md" initials="IN" status="online">
      <img src="/avatar.jpg" alt="Isabel Navarro" />
    </ds-avatar>
  </button>

  <ds-dropdown-header>
    <ds-avatar slot="media" size="md" initials="IN" status="online">
      <img src="/avatar.jpg" alt="Isabel Navarro" />
    </ds-avatar>
    <span slot="title">Isabel Navarro</span>
    <span slot="description">isabel.navarro@gmail.com</span>
  </ds-dropdown-header>

  <ds-dropdown-separator></ds-dropdown-separator>

  <ds-dropdown-group>
    <ds-dropdown-item value="profile">
      <svg slot="media" aria-hidden="true"></svg>
      <span slot="label">View profile</span>
      <span slot="description">Account settings and preferences</span>
    </ds-dropdown-item>
    <ds-dropdown-item value="settings">Settings</ds-dropdown-item>
  </ds-dropdown-group>
</ds-dropdown>
```

Use `slot="trigger"` for the button or interactive element that opens the menu.
A trigger element is required. The trigger can contain text, SVG, images,
custom elements, or regular HTML.
Use `slot="media"`, `slot="label"`, `slot="description"`, and `slot="end"` to
compose row content without creating new row components.

Set `align="start|end"` for menu placement. Override `--ds-dropdown-menu-width` for
product-specific menu sizes. Style the slotted trigger in product code or use a
shared button component.

## Development

```sh
npm run check
npm run audit
```

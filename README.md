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
<input-number name="amount" value="1" min="0" max="10" step="1">
  <span slot="label">Amount</span>
  <span slot="description">Whole numbers only</span>
</input-number>
```

Set `data-theme="light"` or `data-theme="dark"` on your document root to switch token themes.

## Input Number

```html
<input-number value="1" min="0" max="10" step="1"></input-number>
<input-number size="small"></input-number>
<input-number label-position="start"></input-number>
<input-number aria-invalid="true" value="1"></input-number>
<input-number disabled value="1"></input-number>
<input-number controls="none" value="1">
  <svg slot="suffix" aria-hidden="true"></svg>
</input-number>
```

Events:

- `input` fires when the value changes.
- `change` fires when the value is committed.

Override `--input-number-width` or style the host for form layouts that need to
control width.

## Avatar

`user-avatar` provides the circular frame, initials fallback, and optional status
dot. Slotted media wins over `initials`, so consumers can pass a plain image, an
image with `srcset`, or a `picture` element.

```html
<user-avatar initials="IN" status="online"></user-avatar>

<user-avatar status="online">
  <img src="/avatar.jpg" alt="Isabel Navarro" />
</user-avatar>

<user-avatar initials="IN" status="online">
  <img src="/avatar.jpg" alt="Isabel Navarro" />
</user-avatar>

<user-avatar initials="IN">
  <picture>
    <source srcset="/avatar.avif" type="image/avif" />
    <source srcset="/avatar.webp" type="image/webp" />
    <img src="/avatar.jpg" alt="Isabel Navarro" />
  </picture>
</user-avatar>
```

Set `aria-label` on `user-avatar` when initials are meaningful on their own.
Set `aria-hidden="true"` when the avatar is decorative beside visible text.

## Dropdown

`drop-down` is a menu button for actions and settings. The component owns the
trigger button; consumers provide trigger content and menu rows.

```html
<drop-down aria-label="Account menu" align="end">
  <user-avatar slot="trigger" initials="IN" status="online"></user-avatar>

  <drop-down-header>
    <user-avatar slot="media" initials="IN" status="online"></user-avatar>
    <span slot="title">Isabel Navarro</span>
    <span slot="description">isabel.navarro@gmail.com</span>
  </drop-down-header>

  <drop-down-separator></drop-down-separator>

  <drop-down-group>
    <drop-down-item value="profile">
      <svg slot="media" aria-hidden="true"></svg>
      <span slot="label">View profile</span>
      <span slot="description">Account settings and preferences</span>
    </drop-down-item>
    <drop-down-item value="settings">Settings</drop-down-item>
  </drop-down-group>
</drop-down>
```

Use text, SVG, images, custom elements, or regular HTML in `slot="trigger"`.
Use `slot="media"`, `slot="label"`, `slot="description"`, and `slot="end"` to
compose row content without creating new row components.

Set `align="start|end"` for menu placement. Override `--dropdown-menu-width` for
product-specific menu sizes. Override `--dropdown-trigger-*` variables or style
`::part(trigger)` for product-specific trigger chrome.

## Development

```sh
npm run check
```

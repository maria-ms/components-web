# Component Library Manifest

The Web Components package should expose the smallest reusable building blocks
needed to build product interfaces consistently.

## Default Model

The package exports:

- primitives
- structural wrappers
- component behavior that is stable across products

Figma and Storybook show:

- examples
- product-like compositions
- implementation patterns
- realistic usage cases

Examples in Figma or Storybook do not automatically become exported package
components.

## Primitives

Primitives are durable components with reusable behavior or visual identity.

Examples:

- `ds-button`
- `ds-input-text`
- `ds-input-search`
- `ds-input-number`
- `ds-input-select`
- `ds-input-otp`
- `ds-avatar`
- `ds-alert`
- `ds-accordion`
- `ds-dropdown`

Primitives own:

- visual identity
- native-like behavior
- accessibility
- keyboard behavior where relevant
- focus, hover, disabled, invalid, selected, open, and filled states where
  relevant
- tokenized typography, color, spacing, radius, shadows, and intrinsic geometry
- slots or native attributes for consumer-owned content

Primitives should not own:

- business copy
- product-specific examples
- surrounding form labels, descriptions, or error messages
- page or form layout
- one-off Figma artboard widths
- APIs that encode example content, such as `iconName`, `avatarInitials`,
  `items`, `description`, or `shortcut`, unless the component truly owns that
  behavior

## Structural Wrappers

Structural wrappers provide reusable composition contracts.

Examples:

- `ds-field`
- `ds-field-group`

Wrappers own:

- label, description, and error placement
- accessibility wiring between labels, descriptions, errors, and controls
- grouped layout where multiple controls form one logical field
- invalid/focus context around one control or a group of controls
- spacing and geometry needed for the wrapper itself

Wrappers should not own:

- child control values
- child control options
- validation timing
- business rules
- product-specific content

## Product Patterns

Product patterns are usually documented in Figma and Storybook instead of
exported from the package.

Examples:

- phone number field
- currency amount field
- profile menu
- payment method row
- country selector with flag
- billing address section

These should normally be composed from primitives and wrappers:

```html
<ds-field-group>
  <span slot="label">Phone number</span>

  <div class="phone-layout">
    <ds-input-select name="countryCode"></ds-input-select>
    <ds-input-text name="phone"></ds-input-text>
  </div>

  <span slot="description">Include your area code.</span>
  <span slot="error">Enter a valid phone number.</span>
</ds-field-group>
```

## Packaging Rule

Package a component when it has:

- stable reusable behavior
- meaningful accessibility requirements
- tokenized states
- a durable API
- repeated use across products
- behavior that would be error-prone to rebuild from smaller pieces

Keep something as a pattern when it is:

- mostly arrangement of existing primitives
- product-specific content
- likely to vary by product or workflow
- mostly a layout example
- difficult to name without business context

## Composition Rule

Components should provide the parking space and behavior contract.

They define:

- where content goes
- how content is spaced and aligned
- how states look
- which tokens are used
- what accessibility behavior exists

Consumers provide:

- business copy
- icons and media
- product data
- actions
- validation timing
- layout around the component

## Source Of Truth

Figma variables and exported token sources define the visual system.

The token package turns those sources into generated platform artifacts.

The Web Components package consumes generated tokens and implements reusable
behavior and structure.

Storybook demonstrates how primitives and wrappers compose into real usage
patterns.

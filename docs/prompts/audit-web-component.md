# Audit One Web Component

You are working in `<repo-root>/ds` with the existing packages
`@maria-ms/tokens`, `@maria-ms/components-web`, and
`@maria-ms/storybook-web`.

Audit one existing public Web Component against its exact Figma node, the
component manifest, generated tokens, package contract, Storybook coverage, web
standards, and accessibility requirements. Do not rewrite or add infrastructure
until the audit findings are reported.

## First Response

Before doing anything else, respond with only:

> Please send the exact Figma component selection or artboard node URL and the `ds-*` component name to audit.

## Required Figma Tool

Use the `figma-desktop` MCP namespace. If it is not exposed, stop and report that
the required MCP server is unavailable. Do not substitute another connector.

Retrieve design context, relevant metadata, a screenshot, bound variables,
assets, component properties, states, and constraints for the exact node.

## Audit Inputs

Inspect:

- `components-web/docs/manifest.md`
- the component's public subpath and implementation
- `components-web/package.json`
- related generated token CSS in light and dark modes
- corresponding Figma Export Modes sources when needed to trace an alias
- the component's Storybook stories and helper code
- `storybook-web/package.json` and current configured tooling

Respect existing user changes. Do not expand the audit to unrelated components
unless a shared contract creates a concrete cross-component defect.

## Report Findings First

Before changing files, report findings ordered by severity:

1. accessibility, semantic, form, or keyboard defects
2. public API and composition defects
3. missing or incorrect Figma/token mappings
4. behavior and lifecycle defects
5. visual differences from Figma
6. package, Storybook, testing, or maintainability gaps

For each finding include:

- evidence from Figma and code
- user or consumer impact
- whether the fix belongs in Figma, `tokens`, `components-web`, or Storybook
- the smallest appropriate correction

Distinguish confirmed defects from recommendations and future hardening. If no
findings exist, say so and identify remaining unautomated risk.

## Classification And Boundary

Confirm that the implementation is a primitive, structural wrapper, behavior
shell, or justified compound. Check that it has one clear responsibility and is
not a product pattern disguised as a reusable component.

Verify that the component owns only behavior, semantics, intrinsic geometry,
tokenized states, and stable content regions. Product copy, data, validation
timing, surrounding layout, and non-intrinsic content should remain consumer
owned.

Flag APIs that encode Figma examples, duplicate native web APIs unnecessarily,
accept HTML strings, expose internal classes, require private shadow access, or
create a large visual variant matrix.

## Standards And Accessibility Audit

Verify applicable behavior in this order:

1. native HTML semantics
2. native browser APIs and behavior
3. progressive enhancement
4. necessary ARIA only
5. custom interaction only where native behavior is insufficient

Check:

- role, accessible name, description, and state exposure
- visible label and label activation where relevant
- keyboard operation and logical tab order
- focus visibility, movement, restoration, and absence of traps
- disabled, readonly, expanded, selected, pressed, checked, invalid, required,
  and busy states where applicable
- pointer and touch behavior
- announcement of dynamic changes
- form submission, reset, validation, and event timing for controls
- behavior after connection, disconnection, and reconnection
- listener, observer, timer, and subscription cleanup

Also inspect applicable WCAG 2.2 AA concerns: text/control contrast, target size,
zoom, reflow, forced colors, reduced motion, RTL, localization/text expansion,
touch input, and meaning that does not rely on color alone.

Automated accessibility results are only supporting evidence. Review keyboard
and semantic behavior directly.

## Composition Audit

Verify that:

- slots accept arbitrary appropriate consumer DOM
- nested design-system components work through public APIs
- parent and child components do not depend on private DOM
- attributes and properties represent component-owned behavior
- events use native semantics where possible
- custom events have justified bubbling/composed/cancelable behavior
- CSS parts and custom properties expose only intentional stable surfaces
- long, missing, localized, and unexpected optional content remain resilient
- page/form layout and product-specific width remain consumer controlled

For form controls, verify the relevant native API and failure modes, including
value, name, disabled/readonly/required state, validation, focus, form reset, and
`input`/`change` behavior.

## Token And Visual Audit

Trace each Figma-bound visual property to generated CSS. Prefer component tokens,
then semantic tokens, then primitives for intentionally invariant geometry.

Verify:

- every used `var(--ds-...)` exists in light and dark output
- aliases resolve as intended
- no unresolved references, `undefined`, or object stringification leak into CSS
- the component does not hardcode a missing Figma-bound token
- no CSS fallback conceals a missing required token
- root font loading/family remains outside the component
- intrinsic geometry belongs to the component; composition geometry does not
- light and dark modes preserve the intended semantic relationships

Compare the implementation with Figma screenshots at representative states and
container widths. Record intentional semantic or accessibility deviations from
Figma rather than treating them as visual regressions.

When a token is missing, identify whether the correction belongs in Figma
variable binding, Export Modes sources, token transformation, or component usage.
Do not patch around an upstream design-source defect.

## Storybook Audit

Verify that stories:

- import public component subpaths
- demonstrate the smallest useful API
- cover important semantic states and meaningful compositions
- expose only real public API in Controls
- hide demo data and layout-only args
- show clean consumer-facing HTML for each story
- do not mirror every Figma variation unnecessarily
- do not use private styling to conceal component defects
- exercise keyboard, form, or interaction behavior where relevant

Do not require every possible state to have a separate story. Prefer a small set
that proves the public contract.

## Package And Runtime Audit

Verify:

- the public subpath exports the expected module
- the module exports its public classes and idempotently registers its elements
- importing one subpath does not require private deep imports
- duplicate imports/registration are safe
- no unexpected framework or dependency was introduced
- the component is included in the existing syntax check
- package dry-run includes the required files
- runtime work avoids unnecessary measurement, layout thrashing, and global state

Do not introduce TypeScript, Lit, generated declarations, a Custom Elements
Manifest, Playwright, or new CI infrastructure merely to satisfy this audit.
Recommend such package-wide work separately when evidence justifies it.

## Existing Validation

Run all currently applicable commands:

1. `npm run check` in `tokens` when token integrity is in scope
2. `npm run check` in `components-web`
3. `npm run check` in `storybook-web`
4. `npm run build` in `storybook-web`
5. `npm pack --dry-run` in `components-web`

Use existing browser or accessibility tooling when already configured. Do not
claim unconfigured browser matrices, visual regression, or assistive-technology
coverage was completed.

## Optional Remediation

After reporting the audit, implement corrections only when the user explicitly
asked for both audit and remediation. Keep fixes scoped to confirmed findings.

Stop and report instead of patching when:

- `figma-desktop` is unavailable
- the exact Figma node is inaccessible
- a required Figma-bound token is missing
- the fix requires an unapproved package-wide architecture migration
- a destructive conflict prevents a safe edit

## Final Response

Provide:

1. findings ordered by severity with file/node evidence
2. component classification and public API assessment
3. token and Figma mapping status
4. accessibility and native-platform status
5. Storybook and package-contract status
6. commands run and actual results
7. remaining blockers, unautomated risks, and intentionally deferred hardening

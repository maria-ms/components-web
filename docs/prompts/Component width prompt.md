We need explicit width/dimension variables for component examples that engineers use as Storybook defaults.

Right now these values exist only as fixed Figma layer widths, not variables, so they cannot be exported into the token package or referenced as generated CSS tokens.

Please add and bind width variables for:

- Alert:
  - large: 976px
  - medium: 560px
  - small: 343px

- Text input:
  - vertical/default: 276px
  - horizontal/default: 329px

- Number input:
  - default/card: 276px
  - x-small vertical: 140px
  - x-small horizontal: 193px

- Select input:
  - default/country/currency/phone variants: 276px

- Dropdown:
  - menu/list item width: 240px
  - button trigger: 93-94px
  - icon trigger: 24px
  - avatar trigger: 40px

- Accordion:
  - item width: 353px
  - preset/card width: 440px

These should be semantic/component variables, not raw frame sizes, so the exported token pipeline can generate CSS vars that Storybook and components can reference.

Suggested naming direction:

- component/input/width/default = 276
- component/input/width/small = 140
- component/input/width/horizontal = 329
- component/select/width/default = 276
- component/dropdown/menu/width/default = 240
- component/accordion/width/default = 353
- component/accordion/width/card = 440
- component/alert/width/large = 976
- component/alert/width/medium = 560
- component/alert/width/small = 343

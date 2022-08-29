
# Contributing Guidelines

First off, thanks for taking the time to contribute!

## Code of Conduct

This project and everyone participating in it is governed by the [ciphereditor code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to contact@wierk.lu.

## How to contribute

### Reporting bugs or feature requests

Please follow these steps when creating an issue:

1. Make sure your issue hasn't been [reported already](https://github.com/wierkstudio/ciphereditor/issues).
2. Please don't report multiple unrelated bugs or requests in a single issue.
3. If your issue has security implications please refer to the [security policy](SECURITY.md).
4. Follow all instructions in the issue template.

### Bring your changes to the repository with a pull request

By contributing your code to this repository, you agree to license your contribution under [the same license](LICENSE.txt).

Please follow these steps to have your contribution considered:

1. Follow the technical assumptions, constraints and styleguides below.
2. Write tests for your changes.
3. Successfully build the project.
4. Create a pull request and follow all instructions in the template.

## Technical Assumptions & Constraints

### Browser Compatibility

We target modern browsers that support the [native ES Modules](https://caniuse.com/es6-module), [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) and [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta).

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

For more details refer to the [Vite docs](https://vitejs.dev/guide/build.html#browser-compatibility).

### JavaScript

- Use functional style React components with hooks over React component classes.
- Use [Pointer events](https://developer.mozilla.org/en-US/docs/web/api/pointer_events) instead of mouse or touch specific events.

## Styleguides

### General

- Avoid trailing whitespaces at the ends of lines.
- Add a single newline character at the end of each file.
- Capitalize comments (“Awesome comment” instead of “awesome comment”).

### Brand Styleguide

When referring to “ciphereditor” use this exact spelling (all lowercase and no space between “cipher” and “editor”).

### Git Commit Messages

1. Capitalize the subject line
2. Use the present tense (“Add feature” instead of “Added feature”)
3. Use the imperative mood (“Move cursor to…” instead of “Moves cursor to…”)
4. Do not end the subject line with a period
5. Limit the first line to 72 characters or less

### JavaScript Styleguide

All JavaScript, JSX and TypeScript must adhere to the [Standard Style](https://standardjs.com/).

Naming conventions:

- When dealing with [Zod](https://github.com/colinhacks/zod) schema objects use the naming pattern `${typeName}Schema` with a lowercase first character. Example: The Zod schema for the TypeScript type `TypedValue` is called `typedValueSchema`. Instances of `TypedValue` may be called `typedValue`.
- Use a `View` suffix when naming React components to avoid mixing them up with equally named object types (`OperationView` instead of `Operation`)


### Sass Styleguide

We use [Sass](https://sass-lang.com/) with the [SCSS syntax](https://sass-lang.com/documentation/syntax#scss) for CSS style generation and follow the [BEM methodology](https://en.bem.info/methodology/) (introducing blocks, elements and modifiers) with the [Two Dashes style](https://en.bem.info/methodology/naming-convention/#two-dashes-style) to organize and name our CSS classes.

- Introduce new BEM blocks or elements instead of using HTML tags as selectors to keep the CSS specificity flat. Default styles for HTML tags go to `generics.scss`.

## Work amenities

Wearing nice sneakers while coding is not a requirement but it is very much appreciated.

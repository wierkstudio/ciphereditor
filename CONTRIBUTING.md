
# Contributing

First off, thanks for taking the time to contribute!

## Styleguides

### Naming Conventions

- Use the naming pattern `${typeName}Schema` with a lowercase first character when naming [Zod](https://github.com/colinhacks/zod) schema objects. Example: The Zod schema for the TypeScript type `TypedValue` is called `typedValueSchema`. Instances of `TypedValue` may be called `typedValue`.
- Use a `View` suffix when naming React components to avoid mixing them up with equally named object types (`OperationView` instead of `Operation`)

### Comments

- Capitalize comments (`// Awesome comment` instead of `// awesome comment`)

### Git Commit Messages

1. Capitalize the subject line
2. Use the present tense ("Add feature" instead of "Added feature")
3. Use the imperative mood ("Move cursor to…" instead of "Moves cursor to…")
4. Do not end the subject line with a period
5. Limit the first line to 72 characters or less

### JavaScript Styleguide

All JavaScript, JSX and TypeScript must adhere to the [Standard Style](https://standardjs.com/).

## License

By contributing your code to this repository, you agree to license your contribution under [the same license](LICENSE.txt).

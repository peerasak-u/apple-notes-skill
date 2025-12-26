# AGENTS.md

This file provides guidelines for agentic coding assistants working in this repository.

## Build/Lint/Test Commands

### Core Commands

- `npm test` - Run all tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Running Single Tests

To run a single test file:

```bash
node --test tests/conversion.unit.test.js
node --test tests/utils.unit.test.js
```

To run a single test suite (e.g., only HTML to Markdown tests):

```bash
node --test --test-name-pattern="HTML to Markdown" tests/*.test.js
```

To run tests with verbose output:

```bash
node --test --reporter=verbose tests/*.test.js
```

## Code Style Guidelines

### Imports

- Use ES6 module imports: `import { describe, it } from "node:test"`
- Group imports by source (Node.js built-ins, local modules)
- No default exports - use named exports
- Test files import from `node:test` and `node:assert`

### Formatting (Prettier)

- Single quotes: `'string'`
- Semicolons required
- 2-space indentation
- 80-character line width
- Trailing commas in ES5-compatible locations
- Arrow function parentheses avoided when single parameter

### TypeScript/Type Checking

- Project uses `checkJs: true` for JavaScript type checking
- No actual TypeScript files - JXA scripts use plain JavaScript
- Type checking applies to tests and scripts directories only
- Strict mode enabled in tsconfig.json

### Naming Conventions

- **Functions**: camelCase (`htmlToMarkdown`, `getPreview`)
- **Variables**: camelCase (`let preview = ""`)
- **Constants**: UPPER_SNAKE_CASE for module-level constants (rare in this codebase)
- **Test descriptions**: Start with "should" for assertions (`"should handle empty input"`)
- **Files**: kebab-case for modules (`conversion-utils.js`), `*.test.js` for tests

### Function Style

- **Skill JXA code**: Use traditional function declarations (`function run(argv)`)
- **Test code**: Use arrow functions (`describe("...", () => { ... })`)
- Pure utility functions prefer traditional functions for clarity
- Export pure functions separately from JXA entry point

### Error Handling

- Return error messages as strings starting with `"Error: "`
- Example: `return "Error: Folder 'X' not found"`
- Include specific details in error messages (what went wrong, what was expected)
- No exceptions thrown - all errors returned as strings
- Wrap potentially-failing JXA calls in try-catch blocks

### Code Organization

**skill/notes.js structure:**

1. Shebang and comments at top
2. `run()` - command dispatcher
3. Section comment separators (80-char dashes)
4. Conversion functions (htmlToMarkdown, markdownToHtml)
5. Command functions (searchNotes, listNotes, etc.)
6. Helper functions (findFolder, getPreview, etc.)
7. `getUsage()` - help text at bottom

**Test files:**

1. Imports at top
2. Utility functions (if testing pure JS)
3. `describe` blocks organized by functionality
4. `it` tests with descriptive names
5. Use `assert.strictEqual` for equality checks
6. Use `assert.ok` for truthy checks

### String Handling

- Use template literals with `${}` for string interpolation
- Escape newlines in command-line args: `\n` becomes actual newline
- Use single quotes for strings with embedded double quotes
- HTML entities decoded in htmlToMarkdown, encoded in markdownToHtml

### Loop Patterns

- Traditional C-style for loops preferred in JXA code: `for (let i = 0; i < arr.length; i++)`
- This ensures compatibility with JXA environment
- Modern `for...of` loops used in test code
- Use `forEach` when array methods available

### Comments

- No inline comments unless necessary
- Section comments use double-line format with dashes
- Don't add explanatory comments to code unless implementing complex logic

### File Structure

```
skill/notes.js           # Main JXA entry point (no exports)
tests/*.test.js          # Unit tests using Node.js test runner
tests/conversion-utils.js # Pure JS utilities ported for testing
scripts/*.js             # Utility scripts
docs/                    # Architecture documentation
```

### ESLint Rules

- No unused variables (prefix with `_` to ignore: `argsIgnorePattern: "^_"`)
- Console allowed (useful for debugging JXA scripts)
- Prefer `const`, enforce `no-var`
- Use strict equality (`===`)
- All control structures require curly braces

### Testing Best Practices

- Test empty/null/undefined inputs
- Test edge cases (maxLength=0, empty arrays, etc.)
- Use descriptive test names starting with "should"
- Group related tests in describe blocks
- Test both success and failure paths
- Pure functions should be tested independently from JXA code

### Platform Considerations

- `skill/notes.js` runs in JXA environment (macOS osascript)
- Tests run in Node.js environment
- JXA code cannot use Node.js built-ins
- Type checking excludes skill/ directory
- Pure functions should be portable between environments

### Git Workflow

- Don't commit to main/master without explicit request
- Test files only: tests/_.js and scripts/_.js
- Run lint and typecheck before committing
- Follow existing commit message style when creating commits

### Important Notes

- **JXA Limitations**: No async/await, no ES modules inside JXA scripts
- **Conversion Fallback**: If HTML conversion fails, return `[RAW_HTML]` prefix
- **Unique Titles**: generateUniqueTitle suffix starts at 2
- **Index-based access**: 1-based indexing for read-index command
- **Folder Paths**: Support nested folders with "/" separator

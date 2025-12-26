# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands

```bash
npm test                          # Run all tests
npm run test:coverage             # Run tests with coverage
npm run lint                      # Run ESLint on tests/ and scripts/
npm run lint:fix                  # Auto-fix linting issues
npm run format                    # Format with Prettier
npm run typecheck                 # TypeScript type checking (JS files)
```

### Running Single Tests

```bash
node --test tests/conversion.unit.test.js                           # Single test file
node --test --test-name-pattern="HTML to Markdown" tests/*.test.js  # By test name
node --test --reporter=verbose tests/*.test.js                      # Verbose output
```

## Architecture

This is a JXA (JavaScript for Automation) skill for Apple Notes on macOS. The main entry point is `skill/notes.js` which runs via `osascript -l JavaScript`.

### Key Components

- **skill/notes.js** - JXA script with command dispatcher (`run(argv)`), conversion functions (`htmlToMarkdown`, `markdownToHtml`), command handlers (search, list, read, create, delete, recent), and helper utilities
- **tests/*.unit.test.js** - Node.js test runner tests for pure JS functions
- **tests/conversion-utils.js** - Pure JS utilities ported from notes.js for testing

### Dual Runtime Environment

- `skill/notes.js` runs in **JXA environment** (osascript) - no Node.js built-ins, no async/await, no ES modules
- Tests run in **Node.js** - uses `node:test` and `node:assert`
- Type checking via `checkJs: true` applies only to tests/ and scripts/, not skill/

## Code Style

- ES6 module imports with named exports (no default exports)
- Single quotes, semicolons, 2-space indentation
- Traditional `for` loops in JXA code (not `for...of`)
- Errors returned as strings starting with `"Error: "` (no thrown exceptions)
- Test descriptions start with "should"
- Functions: camelCase, Files: kebab-case

## Important Constraints

- JXA code cannot use modern JS features (async/await, ES modules, Node.js APIs)
- All notes.js errors are returned as strings, never thrown
- HTML conversion fallback returns `[RAW_HTML]` prefix when conversion fails
- `read-index` uses 1-based indexing
- Nested folder paths use "/" separator

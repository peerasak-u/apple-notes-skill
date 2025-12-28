# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands

```bash
bun run build                     # Build the CLI package
bun test                          # Run all tests
bun test --coverage               # Run tests with coverage
bun run lint                      # Run ESLint on tests
bun run lint:fix                  # Auto-fix linting issues
bun run format                    # Format with Prettier
bun run typecheck                 # TypeScript type checking
```

### Running Single Tests

```bash
cd packages/apple-notes-cli
bun test tests/conversion.unit.test.js                           # Single test file
bun test --test-name-pattern="HTML to Markdown" tests/*.test.js  # By test name
bun test --reporter=verbose tests/*.test.js                      # Verbose output
```

## Architecture

This is a monorepo containing:

1. **CLI Package** (`packages/apple-notes-cli/`) - npm package `@peerasak-u/apple-notes`
2. **Skill** (`skills/apple-notes/`) - Claude Code plugin (markdown only)

### CLI Package Structure

```
packages/apple-notes-cli/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── executor.ts       # osascript wrapper
│   └── jxa/
│       └── notes.js      # JXA script for Apple Notes
├── tests/
│   ├── conversion.unit.test.js
│   ├── utils.unit.test.js
│   └── conversion-utils.js
└── scripts/
    └── sync-test-utils.js
```

### Skill Structure

```
skills/apple-notes/
├── SKILL.md              # Agent instructions
└── references/
    └── COMMANDS.md       # Command documentation
```

### Dual Runtime Environment

- `src/jxa/notes.js` runs in **JXA environment** (osascript) - no Node.js built-ins, no async/await, no ES modules
- `src/*.ts` runs in **Node.js/Bun** - TypeScript CLI wrapper
- Tests run in **Bun** - uses `bun:test` with global `assert`

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

## Publishing

```bash
cd packages/apple-notes-cli
bun run build
npm publish --access public
```

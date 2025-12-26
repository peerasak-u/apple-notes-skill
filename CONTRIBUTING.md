# Contributing to Apple Notes Skill

Thank you for considering contributing! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Be respectful, inclusive, and constructive. We're here to build something useful together.

## Getting Started

### Prerequisites

- macOS 10.10 or later
- Node.js 18+ (for testing)
- Apple Notes app
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/your-username/apple-notes-skill.git
cd apple-notes-skill

# Install development dependencies
npm install

# Verify installation
npm test
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Edit the relevant files in `skill/`
- Update tests in `tests/`
- Update documentation if needed

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint your code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### 4. Test on macOS

Since this is a JXA script, always test on macOS:

```bash
# Quick test
osascript -l JavaScript skill/notes.js recent

# Test your specific changes
osascript -l JavaScript skill/notes.js <your-command>
```

## Coding Standards

### JavaScript (JXA) Style

- Use 2-space indentation
- Use `const` and `let`, never `var`
- Use camelCase for variables and functions
- Use PascalCase for constructors/classes
- Add semicolons
- Keep functions focused and small

```javascript
// Good
function getPreview(body, maxLength) {
  if (!body) return "";
  const length = Math.min(maxLength, body.length);
  return body.substring(0, length);
}

// Bad
function GetPreview(Body,maxLen){
  return Body.substring(0,maxLen)
}
```

### Error Handling

All errors must return strings starting with `"Error:"`:

```javascript
// Good
if (!folder) {
  return "Error: Folder '${folderName}' not found";
}

// Bad
if (!folder) {
  throw new Error("Folder not found");  // JXA doesn't handle throws well
}
```

### Documentation

- Document complex logic with comments
- Update README.md for new features
- Add examples for new commands

## Testing

### Unit Tests

Test pure functions in Node.js:

```javascript
import { describe, it } from "node:test";
import assert from "node:assert";

describe("myFunction", () => {
  it("should do something", () => {
    const result = myFunction(input);
    assert.strictEqual(result, expected);
  });
});
```

### Integration Tests

Test actual Apple Notes interaction:

```bash
# Create test note
osascript -l JavaScript skill/notes.js create "Test Note" "Content"

# Verify creation
osascript -l JavaScript skill/notes.js read "Test Note"

# Cleanup
osascript -l JavaScript skill/notes.js delete "Test Note"
```

### Test Coverage

- Aim for >80% coverage on utility functions
- Test all conversion edge cases
- Test error conditions

## Submitting Changes

### Commit Messages

Follow conventional commits:

```
feat: add batch note creation
fix: handle nested folder paths correctly
docs: update README with examples
test: add unit tests for htmlToMarkdown
refactor: simplify title generation logic
```

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] Commit messages are clear
- [ ] No merge conflicts

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
```

## Reporting Issues

### Bug Reports

Include:
- macOS version
- Node.js version (if relevant)
- Steps to reproduce
- Expected vs actual behavior
- Error messages
- Example notes (redacted)

### Feature Requests

Include:
- Use case
- Proposed implementation
- Alternatives considered
- Example usage

## Areas for Contribution

Looking for ideas? Here are some good starting points:

1. **Testing** - Add more unit tests for edge cases
2. **Documentation** - Improve README and add examples
3. **Features** - New commands (export, import, templates)
4. **Performance** - Optimize large library searches
5. **Compatibility** - Test on different macOS versions

## Questions?

Feel free to open a discussion or issue for questions!

Thanks for contributing! 🎉

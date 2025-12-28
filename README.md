# Apple Notes Skill

> 🍎 A Claude Code Plugin for interacting with Apple Notes on macOS

[![npm version](https://img.shields.io/npm/v/@peerasak-u/apple-notes)](https://www.npmjs.com/package/@peerasak-u/apple-notes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS-lightgrey)](https://www.apple.com/macos/)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-blue)](https://claude.ai/code)

## Overview

This is a **Claude Code Plugin** that provides an Apple Notes skill for interacting with notes on macOS. It extends Claude Code's capabilities with domain expertise for reading, searching, listing, creating, and deleting notes, with automatic HTML-to-Markdown conversion for seamless integration with development workflows.

Also compatible with [OpenCode](https://opencode.ai) and other Agent Skills-compatible products via the open format standard.

### What are Agent Skills?

Agent Skills are folders of instructions, scripts, and resources that agents can discover and use to do things more accurately and efficiently. They enable:

- **New capabilities**: Give agents the ability to interact with local applications and system resources
- **Domain expertise**: Package specialized knowledge into reusable instructions
- **Interoperability**: Use the same skill across multiple agent products (OpenCode, Claude Code, Cursor, Amp, and more)

## Features

- 🔍 **Search** - Find notes by content
- 📋 **List** - List notes by title with indexing
- 📖 **Read** - Read note content in Markdown format
- ✨ **Create** - Create notes from Markdown
- 🗑️ **Delete** - Delete notes by title
- ⏰ **Recent** - Get recently modified notes
- 📁 **Folder Support** - Work with nested folder paths

## Requirements

- macOS 10.10+
- Apple Notes app installed
- Node.js 18+ or Bun (for CLI usage)
- `osascript` (included with macOS)

## Installation

### Claude Code

```bash
/plugin marketplace add peerasak-u/apple-notes-skill
/plugin install apple-notes@peerasak-u/apple-notes-skill
```

Restart Claude Code after installation.

### Manual Installation

Clone the repository and use with Claude Code:

```bash
git clone https://github.com/peerasak-u/apple-notes-skill.git
cd apple-notes-skill
claude --plugin-dir .
```

### For OpenCode (Agent Skills Format)

```bash
# Clone the repository
git clone https://github.com/peerasak-u/apple-notes-skill.git
cd apple-notes-skill

# Backup existing skill if present, then install
[ -d ~/.opencode/skill/apple-notes ] && mv ~/.opencode/skill/apple-notes ~/.opencode/skill/apple-notes.tmp
cp -r skills/apple-notes ~/.opencode/skill/apple-notes
rm -rf ~/.opencode/skill/apple-notes.tmp
```

### Usage

Once installed, you can use the skill directly in your AI coding assistant:

```bash
# Claude Code
# Just ask: "List all my notes about project X"
# Claude will automatically use the apple-notes skill

# OpenCode
# Just ask: "List all my notes about project X"
```

### Command-Line Usage

The CLI is available as an npm package:

```bash
# Run directly with bunx/npx
bunx @peerasak-u/apple-notes <command> [args...]

# Or install globally
npm install -g @peerasak-u/apple-notes
apple-notes <command> [args...]
```

## Commands

### Search Notes by Content

```bash
bunx @peerasak-u/apple-notes search "meeting notes"
```

### List Notes by Title

```bash
bunx @peerasak-u/apple-notes list "project"
```

Returns indexed results for use with `read-index`.

### Read a Note

```bash
# Read from any folder
bunx @peerasak-u/apple-notes read "My Note"

# Read from specific folder
bunx @peerasak-u/apple-notes read "My Note" "Work"

# Read from nested folder
bunx @peerasak-u/apple-notes read "My Note" "Work/Projects"
```

### Read Note by Index

```bash
# First, list notes
bunx @peerasak-u/apple-notes list "meeting"

# Then read by index (1-based)
bunx @peerasak-u/apple-notes read-index "meeting" 2
```

### Get Recent Notes

```bash
# Get 5 recent notes (default)
bunx @peerasak-u/apple-notes recent

# Get 10 recent notes
bunx @peerasak-u/apple-notes recent 10

# Get recent notes from specific folder
bunx @peerasak-u/apple-notes recent 5 "Work"
```

### Create a Note

```bash
# Create in default folder
bunx @peerasak-u/apple-notes create "Meeting Notes" "# Agenda\n- Item 1\n- Item 2"

# Create in specific folder
bunx @peerasak-u/apple-notes create "Meeting Notes" "# Agenda\n- Item 1" "Work"
```

Note: If a note with the same title exists, a suffix like "(2)" will be added.

### Delete a Note

```bash
# Delete from any folder (exact title match)
bunx @peerasak-u/apple-notes delete "Old Note"

# Delete from specific folder
bunx @peerasak-u/apple-notes delete "Old Note" "Archive"
```

⚠️ **Warning**: This permanently deletes the note. Use exact title match.

## Examples

### Workflow: Find and Read a Note

```bash
# Step 1: Search for notes about "budget"
bunx @peerasak-u/apple-notes list "budget"

# Output shows indexed results like:
# [1] Budget 2024
# [2] Budget Meeting Notes
# [3] Project Budget

# Step 2: Read the second result
bunx @peerasak-u/apple-notes read-index "budget" 2
```

### Workflow: Create a Daily Note

```bash
bunx @peerasak-u/apple-notes create \
  "Daily Log - 2024-01-15" \
  "# Tasks\n- [ ] Task 1\n- [ ] Task 2\n\n# Notes\nToday's observations..." \
  "Journal"
```

### Workflow: Check Recent Activity

```bash
bunx @peerasak-u/apple-notes recent 10
```

## HTML to Markdown Conversion

The skill automatically converts Apple Notes HTML to Markdown:

- Headings (`<h1>` → `#`)
- Bold (`<b>` → `**text**`)
- Italic (`<i>` → `*text*`)
- Lists (`<li>` → `- item`)
- Links (`<a>` → `[text](url)`)
- Images (`<img>` → `
![alt](url)
`)
- Code blocks
- Blockquotes
- And more...

If HTML conversion produces poor results (complex formatting), output will start with `[RAW_HTML]`.

## Error Handling

Errors are returned as strings starting with "Error:". Common errors:

- `Error: No notes found matching...` - No results for query
- `Error: Folder 'X' not found` - Invalid folder name
- `Error: Index X out of range` - Invalid index for read-index
- `Error: read requires a note identifier` - Missing required argument

## Development

### Project Structure

This is a monorepo containing:

```
apple-notes-skill/
├── packages/
│   └── apple-notes-cli/       # npm package (@peerasak-u/apple-notes)
│       ├── src/
│       │   ├── index.ts       # CLI entry point
│       │   ├── executor.ts    # osascript wrapper
│       │   └── jxa/
│       │       └── notes.js   # JXA implementation
│       ├── tests/             # Unit tests
│       │   ├── conversion.unit.test.js
│       │   └── utils.unit.test.js
│       └── package.json
├── skills/                    # Claude Code plugin (markdown only)
│   └── apple-notes/
│       ├── SKILL.md           # Skill definition
│       └── references/
│           └── COMMANDS.md    # Command reference
├── .claude-plugin/            # Plugin manifest
│   └── plugin.json
├── docs/                      # Documentation
├── README.md                  # This file
├── LICENSE                    # MIT License
└── .gitignore
```

### Running Tests

```bash
# Navigate to CLI package
cd packages/apple-notes-cli

# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage
```

### Linting & Type Checking

```bash
cd packages/apple-notes-cli

# Run linter
bun run lint

# Fix linting issues
bun run lint:fix

# Type check
bun run typecheck
```

### Building

```bash
cd packages/apple-notes-cli
bun run build
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new functionality
- Follow the existing code style
- Update documentation as needed
- Ensure macOS compatibility

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [JXA](https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/) (JavaScript for Automation)
- CLI available on [npm](https://www.npmjs.com/package/@peerasak-u/apple-notes)
- Distributed as [Claude Code Plugin](https://claude.ai/code)
- Compatible with [OpenCode](https://opencode.ai) via Agent Skills format

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/peerasak-u/apple-notes-skill/issues)

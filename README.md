# Apple Notes Skill

> 🍎 A Claude Code Plugin for interacting with Apple Notes on macOS

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
- `osascript` (included with macOS)
- Bun 1.0+ (for development/testing)

## Installation

### As Claude Code Plugin

```bash
# Clone the repository
git clone https://github.com/peerasak-u/apple-notes-skill.git
cd apple-notes-skill

# Use with Claude Code
claude --plugin-dir .
```

### For OpenCode (Agent Skills Format)

```bash
# Clone the repository
git clone https://github.com/peerasak-u/apple-notes-skill.git
cd apple-notes-skill

# Install for OpenCode (use skills/apple-notes/ directory)
cp -r skills/apple-notes ~/.opencode/skill/apple-notes
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

```bash
# From the plugin directory
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" <command> [args...]
```

## Commands

### Search Notes by Content

```bash
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" search "meeting notes"
```

### List Notes by Title

```bash
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" list "project"
```

Returns indexed results for use with `read-index`.

### Read a Note

```bash
# Read from any folder
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" read "My Note"

# Read from specific folder
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" read "My Note" "Work"

# Read from nested folder
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" read "My Note" "Work/Projects"
```

### Read Note by Index

```bash
# First, list notes
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" list "meeting"

# Then read by index (1-based)
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" read-index "meeting" 2
```

### Get Recent Notes

```bash
# Get 5 recent notes (default)
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" recent

# Get 10 recent notes
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" recent 10

# Get recent notes from specific folder
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" recent 5 "Work"
```

### Create a Note

```bash
# Create in default folder
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" create "Meeting Notes" "# Agenda\n- Item 1\n- Item 2"

# Create in specific folder
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" create "Meeting Notes" "# Agenda\n- Item 1" "Work"
```

Note: If a note with the same title exists, a suffix like "(2)" will be added.

### Delete a Note

```bash
# Delete from any folder (exact title match)
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" delete "Old Note"

# Delete from specific folder
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" delete "Old Note" "Archive"
```

⚠️ **Warning**: This permanently deletes the note. Use exact title match.

## Examples

### Workflow: Find and Read a Note

```bash
# Step 1: Search for notes about "budget"
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" list "budget"

# Output shows indexed results like:
# [1] Budget 2024
# [2] Budget Meeting Notes
# [3] Project Budget

# Step 2: Read the second result
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" read-index "budget" 2
```

### Workflow: Create a Daily Note

```bash
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" create \
  "Daily Log - 2024-01-15" \
  "# Tasks\n- [ ] Task 1\n- [ ] Task 2\n\n# Notes\nToday's observations..." \
  "Journal"
```

### Workflow: Check Recent Activity

```bash
osascript -l JavaScript "skills/apple-notes/scripts/notes.js" recent 10
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

```
apple-notes-skill/
├── .claude-plugin/     # Plugin manifest
│   └── plugin.json
├── skills/             # Skills directory
│   └── apple-notes/    # Apple Notes skill
│       ├── SKILL.md    # Skill definition
│       ├── scripts/
│       │   └── notes.js    # JXA implementation
│       └── references/
│           └── COMMANDS.md  # Command reference
├── tests/              # Unit tests
│   ├── conversion.test.js
│   └── utils.test.js
├── docs/               # Documentation
├── README.md           # This file
├── LICENSE             # MIT License
├── package.json        # Bun tooling
└── .gitignore
```

### Running Tests

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage tests/*.test.js
```

### Linting

```bash
# Run linter
bun run lint

# Fix linting issues
bun run lint:fix
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
- Distributed as [Claude Code Plugin](https://claude.ai/code)
- Compatible with [OpenCode](https://opencode.ai) via Agent Skills format

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/peerasak-u/apple-notes-skill/issues)

# Apple Notes Skill

> 🍎 An Agent Skill for interacting with Apple Notes on macOS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS-lightgrey)](https://www.apple.com/macos/)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-compatible-green)](https://agentskills.io)

## Overview

This is an **Agent Skill** that gives AI agents the ability to interact with Apple Notes on macOS. It extends agent capabilities with domain expertise for reading, searching, listing, creating, and deleting notes, with automatic HTML-to-Markdown conversion for seamless integration with development workflows.

Built using the [Agent Skills](https://agentskills.io) open format - a simple, interoperable standard for extending agent capabilities. Install once and use with any Agent Skills-compatible product.

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

## Installation

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/your-username/apple-notes-skill.git
cd apple-notes-skill

# Install for OpenCode
cp -r skill ~/.opencode/skill/apple-notes

# Install for Claude Code
cp -r skill ~/.claude/commands/apple-notes
```

### Usage with OpenCode or Claude Code

Once installed, you can use the skill directly in your AI coding assistant:

```bash
# OpenCode
# Just ask: "List all my notes about project X"

# Claude Code
# Use the slash command: /apple-notes
# Or ask: "Use the apple-notes skill to list my notes"
```

Both tools will automatically load the skill and provide natural language access to your Apple Notes.

### Command-Line Usage

```bash
# Set path to skill
export APPLE_NOTES_SKILL_PATH="path/to/skill"

# Execute commands
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" <command> [args...]
```

## Commands

### Search Notes by Content

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" search "meeting notes"
```

### List Notes by Title

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" list "project"
```

Returns indexed results for use with `read-index`.

### Read a Note

```bash
# Read from any folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read "My Note"

# Read from specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read "My Note" "Work"

# Read from nested folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read "My Note" "Work/Projects"
```

### Read Note by Index

```bash
# First, list notes
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" list "meeting"

# Then read by index (1-based)
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read-index "meeting" 2
```

### Get Recent Notes

```bash
# Get 5 recent notes (default)
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent

# Get 10 recent notes
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent 10

# Get recent notes from specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent 5 "Work"
```

### Create a Note

```bash
# Create in default folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" create "Meeting Notes" "# Agenda\n- Item 1\n- Item 2"

# Create in specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" create "Meeting Notes" "# Agenda\n- Item 1" "Work"
```

Note: If a note with the same title exists, a suffix like "(2)" will be added.

### Delete a Note

```bash
# Delete from any folder (exact title match)
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" delete "Old Note"

# Delete from specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" delete "Old Note" "Archive"
```

⚠️ **Warning**: This permanently deletes the note. Use exact title match.

## Examples

### Workflow: Find and Read a Note

```bash
# Step 1: Search for notes about "budget"
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" list "budget"

# Output shows indexed results like:
# [1] Budget 2024
# [2] Budget Meeting Notes
# [3] Project Budget

# Step 2: Read the second result
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read-index "budget" 2
```

### Workflow: Create a Daily Note

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" create \
  "Daily Log - 2024-01-15" \
  "# Tasks\n- [ ] Task 1\n- [ ] Task 2\n\n# Notes\nToday's observations..." \
  "Journal"
```

### Workflow: Check Recent Activity

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent 10
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
├── skill/              # Main skill files
│   ├── SKILL.md        # Skill definition
│   └── notes.js        # JXA implementation
├── tests/              # Unit tests
│   ├── conversion.test.js
│   └── utils.test.js
├── docs/               # Documentation
├── scripts/            # Utility scripts
├── README.md           # This file
├── LICENSE             # MIT License
├── package.json        # Node.js tooling
└── .gitignore
```

### Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
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
- Compatible with [OpenCode](https://opencode.ai) and [Claude Code](https://claude.ai/code)

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/your-username/apple-notes-skill/issues)
- 💬 [Discussions](https://github.com/your-username/apple-notes-skill/discussions)

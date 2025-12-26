---
name: apple-notes
description: Reads, searches, lists, creates, and deletes notes in Apple Notes on macOS. Use when the user asks about their notes, wants to save information to Notes, or needs to find something they wrote in Apple Notes.
---

# Apple Notes

Interacts with Apple Notes via JXA (JavaScript for Automation).

## Quick Reference

### Using the Wrapper Script (Recommended)

The skill includes a convenient wrapper script that handles path detection automatically:

```bash
# Find the skill directory (try these locations in order)
~/.claude/plugins/apple-notes-marketplace/skills/apple-notes/scripts/run.sh <command> [args]
~/.claude/skills/apple-notes/scripts/run.sh <command> [args]
~/.opencode/skill/apple-notes/scripts/run.sh <command> [args]
```

The `run.sh` wrapper automatically locates `notes.js` and forwards all arguments.

### Direct JXA Invocation (Alternative)

For direct control, you can invoke the JXA script directly:

```bash
osascript -l JavaScript <path-to-skill>/scripts/notes.js <command> [args]
```

| Command | Usage |
|---------|-------|
| `search <query>` | Search notes by body content |
| `list <query>` | List notes by title (returns indexes) |
| `read <title> [folder]` | Read note content |
| `read-index <query> <index>` | Read by index from list result |
| `recent [count] [folder]` | Get recent notes (default: 5) |
| `create <title> <body> [folder]` | Create note from Markdown |
| `delete <title> [folder]` | Delete note (exact match) |

**Full command details**: See [references/COMMANDS.md](references/COMMANDS.md)

## Common Workflows

### Find and read a note

```bash
# Search by title (using wrapper script)
~/.claude/skills/apple-notes/scripts/run.sh list "budget"
# Read the second result
~/.claude/skills/apple-notes/scripts/run.sh read-index "budget" 2
```

### Create a note

```bash
~/.claude/skills/apple-notes/scripts/run.sh create "Meeting Notes" "# Agenda\n- Item 1\n- Item 2" "Work"
```

### Check recent activity

```bash
~/.claude/skills/apple-notes/scripts/run.sh recent 10
```

## Output Format

- Note content returns as Markdown
- If HTML conversion fails, output starts with `[RAW_HTML]`
- Errors return strings starting with `Error:`

## Folder Paths

Specify folders as simple names (`"Work"`) or nested paths (`"Work/Projects/2024"`).

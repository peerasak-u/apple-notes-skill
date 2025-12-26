---
name: apple-notes
description: Reads, searches, lists, creates, and deletes notes in Apple Notes on macOS. Use when the user asks about their notes, wants to save information to Notes, or needs to find something they wrote in Apple Notes.
---

# Apple Notes

Interacts with Apple Notes via JXA (JavaScript for Automation).

## Setup

Detect skill location and set `SKILL_PATH`:

```bash
for dir in ".opencode/skill/apple-notes" ".claude/skills/apple-notes" "$HOME/.opencode/skill/apple-notes"; do
  [ -f "$dir/scripts/notes.js" ] && SKILL_PATH="$dir" && break
done
```

## Quick Reference

All commands use: `osascript -l JavaScript "$SKILL_PATH/scripts/notes.js" <command> [args]`

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
# Search by title
osascript -l JavaScript "$SKILL_PATH/scripts/notes.js" list "budget"
# Read the second result
osascript -l JavaScript "$SKILL_PATH/scripts/notes.js" read-index "budget" 2
```

### Create a note

```bash
osascript -l JavaScript "$SKILL_PATH/scripts/notes.js" create "Meeting Notes" "# Agenda\n- Item 1\n- Item 2" "Work"
```

### Check recent activity

```bash
osascript -l JavaScript "$SKILL_PATH/scripts/notes.js" recent 10
```

## Output Format

- Note content returns as Markdown
- If HTML conversion fails, output starts with `[RAW_HTML]`
- Errors return strings starting with `Error:`

## Folder Paths

Specify folders as simple names (`"Work"`) or nested paths (`"Work/Projects/2024"`).

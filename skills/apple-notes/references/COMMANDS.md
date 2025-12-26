# Command Reference

## Setup

First, set the skill directory path (checks multiple possible locations):

```bash
APPLE_NOTES_SKILL_DIR="$(
  for dir in \
    ~/.claude/plugins/cache/apple-notes-marketplace/apple-notes \
    ~/.claude/skills/apple-notes \
    ~/.opencode/skill/apple-notes; do
    if [ -d "$dir" ]; then
      echo "$dir"
      break
    fi
  done
)"
```

All commands below use: `osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" <command> [args]`

## Contents

- [search](#search) - Search by content
- [list](#list) - List by title
- [read](#read) - Read by title
- [read-index](#read-index) - Read by index
- [recent](#recent) - Get recent notes
- [create](#create) - Create note
- [delete](#delete) - Delete note

---

## search

Search notes by body content.

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" search "<query>"
```

**Output**: List of matching notes with title, folder, modified date, and preview.

---

## list

List notes whose title contains the query. Returns indexed results.

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" list "<query>"
```

**Output**: Numbered list. Use the index with `read-index`.

---

## read

Read a note by title. Optionally specify folder.

```bash
# From any folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" read "<title>"

# From specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" read "<title>" "<folder>"

# From nested folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" read "<title>" "Work/Projects"
```

**Output**: Full note content in Markdown with metadata header.

---

## read-index

Read a note by its index from a previous `list` result.

```bash
# First list, then read by 1-based index
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" list "meeting"
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" read-index "meeting" 2
```

---

## recent

Get recently modified notes. Default count is 5.

```bash
# Default: 5 recent from all folders
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" recent

# Custom count
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" recent 10

# From specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" recent 5 "Work"

# Folder first (also works)
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" recent "Work" 10
```

---

## create

Create a new note from Markdown. Default folder is "Notes".

```bash
# In default folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" create "<title>" "<markdown-body>"

# In specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" create "<title>" "<markdown-body>" "<folder>"
```

**Note**: If title exists, a suffix like "(2)" is added.

**Markdown support**: Headings, bold, italic, lists, links, code blocks.

---

## delete

Delete a note by exact title match.

```bash
# Delete from any folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" delete "<exact-title>"

# Delete from specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_DIR/scripts/notes.js" delete "<exact-title>" "<folder>"
```

**Warning**: Permanent deletion. Requires exact title match.

---

## Folder Paths

Folders can be:
- Simple: `"Work"`
- Nested: `"Work/Projects/2024"`

---

## Error Messages

Errors return strings starting with `Error:`:
- `Error: No notes found matching...` - No results
- `Error: Folder 'X' not found` - Invalid folder
- `Error: Index X out of range` - Invalid read-index
- `Error: read requires a note identifier` - Missing argument

---

## Output Format

### Markdown Conversion

Note content is converted from Apple Notes HTML to Markdown:
- `<h1>` to `#`
- `<b>` to `**text**`
- `<i>` to `*text*`
- `<li>` to `- item`

### Fallback

If conversion fails, output starts with `[RAW_HTML]`. Parse the HTML yourself in this case.

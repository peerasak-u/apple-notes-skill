# Command Reference

## Run commands

```bash
bunx @peerasak-u/apple-notes <command> [args]
```

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
bunx @peerasak-u/apple-notes search "<query>"
```

**Output**: List of matching notes with title, folder, modified date, and preview.

---

## list

List notes whose title contains the query. Returns indexed results.

```bash
bunx @peerasak-u/apple-notes list "<query>"
```

**Output**: Numbered list. Use the index with `read-index`.

---

## read

Read a note by title. Optionally specify folder.

```bash
# From any folder
bunx @peerasak-u/apple-notes read "<title>"

# From specific folder
bunx @peerasak-u/apple-notes read "<title>" "<folder>"

# From nested folder
bunx @peerasak-u/apple-notes read "<title>" "Work/Projects"
```

**Output**: Full note content in Markdown with metadata header.

---

## read-index

Read a note by its index from a previous `list` result.

```bash
# First list, then read by 1-based index
bunx @peerasak-u/apple-notes list "meeting"
bunx @peerasak-u/apple-notes read-index "meeting" 2
```

---

## recent

Get recently modified notes. Default count is 5.

```bash
# Default: 5 recent from all folders
bunx @peerasak-u/apple-notes recent

# Custom count
bunx @peerasak-u/apple-notes recent 10

# From specific folder
bunx @peerasak-u/apple-notes recent 5 "Work"

# Folder first (also works)
bunx @peerasak-u/apple-notes recent "Work" 10
```

---

## create

Create a new note from Markdown. Default folder is "Notes".

```bash
# In default folder
bunx @peerasak-u/apple-notes create "<title>" "<markdown-body>"

# In specific folder
bunx @peerasak-u/apple-notes create "<title>" "<markdown-body>" "<folder>"
```

**Note**: If title exists, a suffix like "(2)" is added.

**Markdown support**: Headings, bold, italic, lists, links, code blocks.

---

## delete

Delete a note by exact title match.

```bash
# Delete from any folder
bunx @peerasak-u/apple-notes delete "<exact-title>"

# Delete from specific folder
bunx @peerasak-u/apple-notes delete "<exact-title>" "<folder>"
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

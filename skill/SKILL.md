---
name: apple-notes
description: Read, search, list, create, and delete notes in Apple Notes app. Returns Markdown-formatted content for human readability.
license: MIT
compatibility: opencode
metadata:
  platform: macos
  requires: osascript
---

## What I Do

Interact with Apple Notes application on macOS to:
- Search notes by content
- List notes by title
- Read note content (returns Markdown)
- Create notes from Markdown
- Delete notes by title
- Get recent notes

## How to Use

### Step 1: Detect Skill Location

First, determine where this skill is installed and set the path variable:

```bash
# Check installation location (in order of priority)
if [ -f ".opencode/skill/apple-notes/notes.js" ]; then
    APPLE_NOTES_SKILL_PATH=".opencode/skill/apple-notes"
elif [ -f ".claude/skills/apple-notes/notes.js" ]; then
    APPLE_NOTES_SKILL_PATH=".claude/skills/apple-notes"
elif [ -f "$HOME/.opencode/skill/apple-notes/notes.js" ]; then
    APPLE_NOTES_SKILL_PATH="$HOME/.opencode/skill/apple-notes"
else
    echo "Error: apple-notes skill not found"
fi
```

### Step 2: Run Commands

Run commands using `osascript` with JavaScript (JXA):

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" <command> [arguments...]
```

## Available Commands

### 1. search `<query>`
Search notes by content (body text).

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" search "meeting notes"
```

**Output:** List of matching notes with title, folder, modified date, and preview.

### 2. list `<query>`
List notes whose title contains the query. Returns indexed results.

```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" list "project"
```

**Output:** Numbered list of notes. Use the index with `read-index` command.

### 3. read `<title>` `[folder]`
Read a note by its title. Optionally specify folder to narrow search.

```bash
# Read from any folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read "My Note"

# Read from specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read "My Note" "Work"

# Read from nested folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read "My Note" "Work/Projects"
```

**Output:** Full note content in Markdown format with metadata header.

### 4. read-index `<query>` `<index>`
Read a note by its index from a previous `list` command result.

```bash
# First, list notes
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" list "meeting"

# Then read by index (1-based)
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read-index "meeting" 2
```

### 5. recent `[count]` `[folder]`
Get the most recently modified notes. Default count is 5.

```bash
# Get 5 recent notes from all folders
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent

# Get 10 recent notes
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent 10

# Get 5 recent notes from specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent 5 "Work"

# Folder name first also works
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent "Work" 10
```

### 6. create `<title>` `<body>` `[folder]`
Create a new note. Body should be in Markdown format. Default folder is "Notes".

```bash
# Create in default folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" create "Meeting Notes" "# Agenda\n- Item 1\n- Item 2"

# Create in specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" create "Meeting Notes" "# Agenda\n- Item 1" "Work"
```

**Note:** If a note with the same title exists, a suffix like "(2)" will be added.

### 7. delete `<title>` `[folder]`
Delete a note by its title. Use with caution.

```bash
# Delete from any folder (must be exact title match)
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" delete "Old Note"

# Delete from specific folder
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" delete "Old Note" "Archive"
```

**Warning:** This permanently deletes the note. Use exact title match to avoid accidents.

## Output Format

### Markdown Conversion
All note content is automatically converted from Apple Notes HTML to Markdown:
- Headings (`<h1>` → `#`)
- Bold (`<b>` → `**text**`)
- Italic (`<i>` → `*text*`)
- Lists (`<li>` → `- item`)
- Links preserved
- Line breaks handled

### Fallback Behavior
If HTML conversion produces poor results (complex formatting), output will start with `[RAW_HTML]`. In this case, convert the HTML to Markdown yourself.

## Error Handling

Errors are returned as strings starting with "Error:". Common errors:
- `Error: No notes found matching...` - No results for query
- `Error: Folder 'X' not found` - Invalid folder name
- `Error: Index X out of range` - Invalid index for read-index
- `Error: read requires a note identifier` - Missing required argument

## Folder Path Support

Folders can be specified as:
- Simple name: `"Work"`
- Nested path: `"Work/Projects/2024"`

## Examples

### Workflow: Find and read a note
```bash
# Step 1: Search for notes about "budget"
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" list "budget"

# Step 2: Read the second result
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" read-index "budget" 2
```

### Workflow: Create a daily note
```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" create "Daily Log - 2024-01-15" "# Tasks\n- [ ] Task 1\n- [ ] Task 2\n\n# Notes\nToday's observations..." "Journal"
```

### Workflow: Check recent activity
```bash
osascript -l JavaScript "$APPLE_NOTES_SKILL_PATH/notes.js" recent 10
```

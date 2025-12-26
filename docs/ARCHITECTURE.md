# Architecture Documentation

## Overview

Apple Notes Skill is a JXA (JavaScript for Automation) script that provides command-line access to Apple Notes on macOS. It runs within the `osascript` environment and bridges Apple Notes AppleScript API with a friendly command-line interface.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Command Line                             │
│  (User runs: osascript -l JavaScript notes.js <command>)    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  JXA Runtime Environment                     │
│                 (JavaScript for Automation)                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      notes.js                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  run(argv) - Command dispatcher                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────┼────────────────────────────────┐ │
│  │                      │                                │ │
│  ▼                      ▼                                ▼ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Commands    │  │ Conversion   │  │   Helpers    │     │
│  │              │  │              │  │              │     │
│  │ • search     │  │ htmlToMd     │  │ findFolder   │     │
│  │ • list       │  │ mdToHtml     │  │ getPreview   │     │
│  │ • read       │  │              │  │ getFolder    │     │
│  │ • create     │  │              │  │              │     │
│  │ • delete     │  │              │  │ uniqueTitle  │     │
│  │ • recent     │  │              │  │              │     │
│  └──────┬───────┘  └──────────────┘  └──────────────┘     │
│         │                                                    │
└─────────┼──────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│              Apple Notes Application                         │
│              (via AppleScript API)                           │
│  • Application("Notes")                                      │
│  • Notes, Folders, Accounts                                  │
│  • Note properties: name, body, dates, etc.                  │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Command Dispatcher (`run(argv)`)

Entry point that parses command-line arguments and routes to the appropriate function.

**Commands:**
- `search <query>` - Search note bodies
- `list <query>` - List notes by title
- `read <title> [folder]` - Read full note content
- `read-index <query> <index>` - Read by indexed result
- `recent [count] [folder]` - Get recent notes
- `create <title> <body> [folder]` - Create new note
- `delete <title> [folder]` - Delete note

### 2. Conversion Layer

Handles bidirectional conversion between HTML (Apple Notes format) and Markdown.

**htmlToMarkdown(html):**
- Removes Apple Notes-specific div wrappers
- Converts HTML tags to Markdown syntax
- Handles headings, formatting, links, lists, code, etc.
- Decodes HTML entities
- Returns `[RAW_HTML]` prefix if conversion fails

**markdownToHtml(markdown):**
- Parses Markdown syntax
- Generates Apple Notes-compatible HTML
- Wraps paragraphs in `<div>` tags
- Creates proper `<ul>` lists

### 3. Command Functions

Each command function performs specific operations:

#### Search Functions
- `searchNotes(query)` - Search all notes by body content
- `listNotes(query)` - List notes by title with indexing

#### Read Functions
- `readNote(identifier, folder)` - Find and read specific note
- `readNoteByIndex(query, index)` - Read from list result
- `formatNoteContent(note)` - Format note for display

#### Write Functions
- `createNote(title, body, folder)` - Create new note with unique title
- `deleteNote(title, folder)` - Delete note by exact title

#### Utility Functions
- `getRecentNotes(limit, folder)` - Get most recently modified notes
- `parseRecentArgs(args)` - Parse flexible recent command arguments

### 4. Helper Functions

**Folder Operations:**
- `findFolder(folderPath)` - Find folder by name or nested path
- `getFolderName(note)` - Extract folder name from note

**Text Utilities:**
- `getPreview(body, maxLength)` - Create text preview
- `generateUniqueTitle(baseTitle, folder)` - Ensure unique note titles

**Application Access:**
- `getNotesApp()` - Get Notes application object

## Data Flow

### Reading a Note

```
User Command
    ↓
run(["read", "My Note", "Work"])
    ↓
readNote("My Note", "Work")
    ↓
findFolder("Work")
    ↓
folder.notes().find(name === "My Note")
    ↓
note.body() → HTML
    ↓
htmlToMarkdown(HTML)
    ↓
formatNoteContent()
    ↓
Return Markdown to user
```

### Creating a Note

```
User Command
    ↓
run(["create", "Title", "# Markdown", "Work"])
    ↓
markdownToHtml("# Markdown")
    ↓
generateUniqueTitle("Title", folder)
    ↓
app.Note({name, body})
    ↓
folder.notes.push(newNote)
    ↓
Return success message
```

## Error Handling

### Error Strategy

All errors are returned as strings starting with `"Error:"`:

```javascript
return "Error: Folder 'X' not found";
return "Error: No notes found matching...";
```

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `Error: Folder 'X' not found` | Invalid folder name/path | Check folder spelling, use correct path format |
| `Error: No notes found matching...` | No search results | Try different query or check if notes exist |
| `Error: Index X out of range` | Invalid index for read-index | Use index from previous list command |
| `Error: read requires a note identifier` | Missing required argument | Provide note title or query |
| `[RAW_HTML]` prefix | Complex HTML conversion | Manual HTML to Markdown conversion needed |

## Testing Strategy

### Unit Tests

Test pure JavaScript functions in Node.js:
- `htmlToMarkdown()` conversion
- `markdownToHtml()` conversion
- `getPreview()` utility
- `generateUniqueTitle()` utility

**Location:** `tests/*.unit.test.js`

### Integration Tests

Run with actual Apple Notes (requires macOS):
- Test all commands with real notes
- Verify folder navigation
- Check note creation/deletion

**Location:** `tests/integration.test.js` (future)

### Running Tests

```bash
# Unit tests (Node.js)
npm test

# Unit tests with coverage
npm run test:coverage

# Integration tests (macOS only)
npm run test:integration
```

## Limitations

1. **macOS Only** - JXA is macOS-specific
2. **Apple Notes Required** - Must have Notes app installed
3. **No Cloud Sync Control** - Uses default iCloud account
4. **Limited HTML Support** - Complex HTML may require manual conversion
5. **Synchronous Operations** - No async/await support in JXA

## Future Enhancements

1. **Async Support** - Use Node.js bridge for better performance
2. **Batch Operations** - Process multiple notes efficiently
3. **Search Filters** - Date ranges, tags, attachments
4. **Attachment Support** - Handle images, files, etc.
5. **Export Formats** - PDF, RTF, plain text
6. **Note Templates** - Create notes from templates

## Performance Considerations

- **Large Note Libraries**: Searching all notes can be slow with thousands of notes
- **HTML Parsing**: Regex-based conversion is O(n) where n is HTML length
- **Folder Traversal**: Nested paths require sequential lookups
- **Note Deletion**: Permanent operation - no undo available

## Security Considerations

- **No Authentication**: Uses macOS user session permissions
- **File Access**: Requires permission to access Notes data
- **No Network**: All operations are local
- **User Data**: Note content is processed locally, never transmitted

#!/usr/bin/env osascript -l JavaScript

// Apple Notes JXA Script
// Provides: search, list, read, read-index, recent, create, delete

function run(argv) {
  if (argv.length === 0) {
    return getUsage();
  }

  const command = argv[0];

  switch (command) {
    case "search":
      if (argv.length < 2) {
        return "Error: search requires a query string\n" + getUsage();
      }
      return searchNotes(argv[1]);

    case "list":
      if (argv.length < 2) {
        return "Error: list requires a search term\n" + getUsage();
      }
      return listNotes(argv[1]);

    case "read":
      if (argv.length < 2) {
        return "Error: read requires a note identifier\n" + getUsage();
      }
      return readNote(argv[1], argv[2] || "");

    case "read-index":
      if (argv.length < 3) {
        return "Error: read-index requires search term and index\n" + getUsage();
      }
      return readNoteByIndex(argv[1], parseInt(argv[2], 10));

    case "recent":
      return parseRecentArgs(argv.slice(1));

    case "create":
      if (argv.length < 3) {
        return "Error: create requires title and body\n" + getUsage();
      }
      return createNote(argv[1], argv[2], argv[3] || "Notes");

    case "delete":
      if (argv.length < 2) {
        return "Error: delete requires a note title\n" + getUsage();
      }
      return deleteNote(argv[1], argv[2] || "");

    default:
      return `Error: Unknown command '${command}'\n` + getUsage();
  }
}

// ============================================================================
// Notes App Interaction
// ============================================================================

// HTML <-> Markdown conversion is now handled in TypeScript (converter.ts)
// JXA now passes raw HTML to/from Apple Notes

function getNotesApp() {
  return Application("Notes");
}

function searchNotes(query) {
  const app = getNotesApp();
  const allNotes = app.notes();
  const results = [];

  for (let i = 0; i < allNotes.length; i++) {
    const note = allNotes[i];
    const body = note.body();
    if (body && body.toLowerCase().includes(query.toLowerCase())) {
      const folderName = getFolderName(note);
      const preview = getPreview(body, 150);
      results.push({
        title: note.name(),
        folder: folderName,
        modified: note.modificationDate().toString(),
        preview: preview,
      });
    }
  }

  if (results.length === 0) {
    return `No notes found matching: ${query}`;
  }

  let output = `Found ${results.length} note(s):\n\n`;
  for (const r of results) {
    output += `Title: ${r.title}\n`;
    output += `Folder: ${r.folder}\n`;
    output += `Modified: ${r.modified}\n`;
    output += `Preview: ${r.preview}\n`;
    output += "---\n\n";
  }

  return output;
}

function listNotes(query) {
  const app = getNotesApp();
  const allNotes = app.notes();
  const results = [];

  for (let i = 0; i < allNotes.length; i++) {
    const note = allNotes[i];
    const name = note.name();
    if (name && name.toLowerCase().includes(query.toLowerCase())) {
      const folderName = getFolderName(note);
      const body = note.body() || "";
      const preview = getPreview(body, 80);
      results.push({
        index: results.length + 1,
        title: name,
        folder: folderName,
        modified: note.modificationDate().toString(),
        preview: preview,
      });
    }
  }

  if (results.length === 0) {
    return `No notes found with title containing: ${query}`;
  }

  let output = `Found ${results.length} note(s) matching '${query}':\n\n`;
  for (const r of results) {
    output += `[${r.index}] ${r.title}\n`;
    output += `    Folder: ${r.folder}\n`;
    output += `    Modified: ${r.modified}\n`;
    output += `    Preview: ${r.preview}\n\n`;
  }

  output += `\nUse 'read-index ${query} <index>' to read full note`;

  return output;
}

function readNote(identifier, folderName) {
  const app = getNotesApp();
  let matchingNotes = [];

  if (folderName === "") {
    // Search all notes
    const allNotes = app.notes();
    for (let i = 0; i < allNotes.length; i++) {
      const note = allNotes[i];
      const name = note.name();
      if (name === identifier) {
        matchingNotes.push(note);
      }
    }
    // Try partial match if exact match fails
    if (matchingNotes.length === 0) {
      for (let i = 0; i < allNotes.length; i++) {
        const note = allNotes[i];
        const name = note.name();
        if (name && name.toLowerCase().includes(identifier.toLowerCase())) {
          matchingNotes.push(note);
        }
      }
    }
  } else {
    // Search in specific folder
    const folder = findFolder(folderName);
    if (!folder) {
      return `Error: Folder '${folderName}' not found`;
    }
    const folderNotes = folder.notes();
    for (let i = 0; i < folderNotes.length; i++) {
      const note = folderNotes[i];
      const name = note.name();
      if (name === identifier) {
        matchingNotes.push(note);
      }
    }
    if (matchingNotes.length === 0) {
      for (let i = 0; i < folderNotes.length; i++) {
        const note = folderNotes[i];
        const name = note.name();
        if (name && name.toLowerCase().includes(identifier.toLowerCase())) {
          matchingNotes.push(note);
        }
      }
    }
  }

  if (matchingNotes.length === 0) {
    let errorMsg = `Error: No note found matching '${identifier}'`;
    if (folderName !== "") {
      errorMsg += ` in folder '${folderName}'`;
    }
    return errorMsg;
  }

  if (matchingNotes.length > 1) {
    let output = `Found ${matchingNotes.length} notes. Please use one of these options:\n\n`;
    for (let i = 0; i < matchingNotes.length; i++) {
      const note = matchingNotes[i];
      const folder = getFolderName(note);
      output += `[${i + 1}] ${note.name()} (${folder})\n`;
    }
    output += `\nUse: read-index '${identifier}' <index>`;
    output += `\nOr:  read '${identifier}' '<folder-name>'`;
    return output;
  }

  return formatNoteContent(matchingNotes[0]);
}

function readNoteByIndex(query, index) {
  const app = getNotesApp();
  const allNotes = app.notes();
  const matchingNotes = [];

  for (let i = 0; i < allNotes.length; i++) {
    const note = allNotes[i];
    const name = note.name();
    if (name && name.toLowerCase().includes(query.toLowerCase())) {
      matchingNotes.push(note);
    }
  }

  if (matchingNotes.length === 0) {
    return `Error: No notes found with title containing '${query}'`;
  }

  if (index < 1 || index > matchingNotes.length) {
    return `Error: Index ${index} out of range. Found ${matchingNotes.length} notes.`;
  }

  return formatNoteContent(matchingNotes[index - 1]);
}

function parseRecentArgs(args) {
  let limit = 5;
  let folderName = "";

  if (args.length >= 1) {
    const arg1 = args[0];
    const num1 = parseInt(arg1, 10);
    if (!isNaN(num1)) {
      limit = num1;
      if (args.length >= 2) {
        folderName = args[1];
      }
    } else {
      folderName = arg1;
      if (args.length >= 2) {
        const num2 = parseInt(args[1], 10);
        if (!isNaN(num2)) {
          limit = num2;
        }
      }
    }
  }

  return getRecentNotes(limit, folderName);
}

function getRecentNotes(limit, folderName) {
  const app = getNotesApp();
  let notes = [];

  if (folderName === "") {
    notes = app.notes();
  } else {
    const folder = findFolder(folderName);
    if (!folder) {
      return `Error: Folder '${folderName}' not found`;
    }
    notes = folder.notes();
  }

  if (notes.length === 0) {
    let msg = "No notes found";
    if (folderName !== "") {
      msg += ` in '${folderName}' folder`;
    }
    return msg;
  }

  // Build array with dates for sorting
  const notesWithDates = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    notesWithDates.push({
      note: note,
      modDate: note.modificationDate(),
    });
  }

  // Sort by modification date descending
  notesWithDates.sort((a, b) => b.modDate - a.modDate);

  // Get top N
  const count = Math.min(limit, notesWithDates.length);
  let output = `Last ${count} note(s)`;
  if (folderName !== "") {
    output += ` from '${folderName}' folder`;
  }
  output += ":\n\n";

  for (let i = 0; i < count; i++) {
    const item = notesWithDates[i];
    const note = item.note;
    const body = note.body() || "";
    const preview = getPreview(body, 100);
    const folder = getFolderName(note) || folderName;

    output += `[${i + 1}] ${note.name()}\n`;
    output += `    Folder: ${folder}\n`;
    output += `    Modified: ${item.modDate.toString()}\n`;
    output += `    Preview: ${preview}\n\n`;
  }

  return output;
}

function createNote(title, body, folderName) {
  const app = getNotesApp();
  const folder = findFolder(folderName);

  if (!folder) {
    return `Error: Folder '${folderName}' not found`;
  }

  // body is now pre-converted to HTML in TypeScript
  const uniqueTitle = generateUniqueTitle(title, folder);

  const newNote = app.Note({ name: uniqueTitle, body: body });
  folder.notes.push(newNote);

  // Get the created note to return info
  const createdNote = folder.notes().find((n) => n.name() === uniqueTitle);
  if (!createdNote) {
    return `Note created but could not retrieve details.\nTitle: ${uniqueTitle}\nFolder: ${folderName}`;
  }

  let output = "Note created successfully!\n\n";
  output += `Title: ${createdNote.name()}\n`;
  output += `Folder: ${folderName}\n`;
  output += `Created: ${createdNote.creationDate().toString()}\n`;

  return output;
}

function deleteNote(title, folderName) {
  const app = getNotesApp();
  let targetNote = null;
  let targetFolder = null;

  if (folderName === "") {
    // Search all notes for exact match
    const allNotes = app.notes();
    for (let i = 0; i < allNotes.length; i++) {
      const note = allNotes[i];
      if (note.name() === title) {
        targetNote = note;
        break;
      }
    }
  } else {
    targetFolder = findFolder(folderName);
    if (!targetFolder) {
      return `Error: Folder '${folderName}' not found`;
    }
    const folderNotes = targetFolder.notes();
    for (let i = 0; i < folderNotes.length; i++) {
      const note = folderNotes[i];
      if (note.name() === title) {
        targetNote = note;
        break;
      }
    }
  }

  if (!targetNote) {
    let errorMsg = `Error: No note found with exact title '${title}'`;
    if (folderName !== "") {
      errorMsg += ` in folder '${folderName}'`;
    }
    return errorMsg;
  }

  const deletedTitle = targetNote.name();
  const deletedFolder = getFolderName(targetNote);

  // Delete the note
  app.delete(targetNote);

  return `Note deleted successfully!\n\nTitle: ${deletedTitle}\nFolder: ${deletedFolder}`;
}

// ============================================================================
// Helper Functions
// ============================================================================

function findFolder(folderPath) {
  const app = getNotesApp();
  const defaultAccount = app.defaultAccount();

  if (folderPath.includes("/")) {
    // Nested folder path
    const parts = folderPath.split("/");
    let currentFolder = defaultAccount.folders().find((f) => f.name() === "Notes");

    if (!currentFolder) {
      return null;
    }

    for (const part of parts) {
      const subfolders = currentFolder.folders();
      let found = false;
      for (let i = 0; i < subfolders.length; i++) {
        if (subfolders[i].name() === part) {
          currentFolder = subfolders[i];
          found = true;
          break;
        }
      }
      if (!found) {
        return null;
      }
    }

    return currentFolder;
  } else {
    // Top-level folder
    const folders = defaultAccount.folders();
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].name() === folderPath) {
        return folders[i];
      }
    }
    return null;
  }
}

function getFolderName(note) {
  try {
    const container = note.container();
    if (container) {
      return container.name();
    }
  } catch (e) {
    // Container might not be accessible
  }
  return "";
}

function getPreview(body, maxLength) {
  if (!body) return "";
  const length = Math.min(maxLength, body.length);
  let preview = body.substring(0, length);
  if (body.length > length) {
    preview += "...";
  }
  return preview;
}

function formatNoteContent(note) {
  const title = note.name();
  const body = note.body() || "";
  const folder = getFolderName(note);
  const created = note.creationDate().toString();
  const modified = note.modificationDate().toString();

  let output = "========================================\n";
  output += `Title: ${title}\n`;
  output += `Folder: ${folder}\n`;
  output += `Created: ${created}\n`;
  output += `Modified: ${modified}\n`;
  output += "========================================\n\n";
  output += body + "\n";

  return output;
}

function generateUniqueTitle(baseTitle, folder) {
  const notes = folder.notes();
  const existingTitles = new Set();

  for (let i = 0; i < notes.length; i++) {
    existingTitles.add(notes[i].name());
  }

  if (!existingTitles.has(baseTitle)) {
    return baseTitle;
  }

  let suffix = 2;
  while (true) {
    const candidate = `${baseTitle} (${suffix})`;
    if (!existingTitles.has(candidate)) {
      return candidate;
    }
    suffix++;
  }
}

function getUsage() {
  return `Usage:
  apple-notes search <query>              - Search notes by content
  apple-notes list <query>                - List notes by title
  apple-notes read <title> [folder]       - Read note by title
  apple-notes read-index <query> <index>  - Read by search index
  apple-notes recent [count] [folder]     - Get recent notes (default: 5)
  apple-notes create <title> <body> [folder] - Create note from markdown
  apple-notes delete <title> [folder]     - Delete note by title

Examples:
  apple-notes list 'meeting'
  apple-notes read-index 'meeting' 2
  apple-notes read 'Todo' 'Work'
  apple-notes recent 10 'Blog'
  apple-notes create 'Meeting Notes' '# Agenda\\n- Item 1' 'Work'
  apple-notes delete 'Old Note' 'Archive'
`;
}

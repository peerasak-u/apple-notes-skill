#!/usr/bin/env node
import { executeNotesCommand } from './executor.js';

const USAGE = `
Apple Notes CLI - Interact with Apple Notes on macOS

Usage:
  apple-notes <command> [arguments]

Commands:
  search <query>                    Search notes by content
  list <query>                      List notes by title (returns indexed results)
  read <title> [folder]             Read a note by title
  read-index <query> <index>        Read note by index from list results (1-based)
  recent [count] [folder]           Get recently modified notes (default: 5)
  create <title> <body> [folder]    Create a new note (body in Markdown)
  delete <title> [folder]           Delete a note by exact title

Examples:
  apple-notes search "meeting notes"
  apple-notes list "project"
  apple-notes read "My Note"
  apple-notes read "My Note" "Work/Projects"
  apple-notes read-index "budget" 2
  apple-notes recent 10
  apple-notes recent 5 "Work"
  apple-notes create "New Note" "# Hello\\n- Item 1" "Notes"
  apple-notes delete "Old Note"

Folder paths use "/" separator for nested folders (e.g., "Work/Projects/2024").
`;

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(USAGE.trim());
    process.exit(0);
  }

  if (args[0] === '--version' || args[0] === '-v') {
    // Read version from package.json
    console.log('1.0.0');
    process.exit(0);
  }

  try {
    const result = executeNotesCommand(args);
    if (result) {
      console.log(result);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
}

main();

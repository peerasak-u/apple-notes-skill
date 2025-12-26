#!/usr/bin/env bash

# Wrapper script for Apple Notes skill
# Automatically detects the script location and runs notes.js with JXA

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NOTES_JS="$SCRIPT_DIR/notes.js"

# Verify notes.js exists
if [ ! -f "$NOTES_JS" ]; then
  echo "Error: notes.js not found at $NOTES_JS" >&2
  exit 1
fi

# Forward all arguments to notes.js via osascript
exec osascript -l JavaScript "$NOTES_JS" "$@"

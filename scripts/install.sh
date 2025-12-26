#!/bin/bash

# Installation script for Apple Notes Skill

set -e

echo "🍎 Apple Notes Skill Installation"
echo "================================"

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
  echo "❌ Error: This skill requires macOS"
  exit 1
fi

# Check if osascript is available
if ! command -v osascript &> /dev/null; then
  echo "❌ Error: osascript not found"
  exit 1
fi

# Determine installation directory
INSTALL_DIR=""
if [ -d "$HOME/.opencode/skill" ]; then
  INSTALL_DIR="$HOME/.opencode/skill"
elif [ -d "$HOME/.claude/skills" ]; then
  INSTALL_DIR="$HOME/.claude/skills"
else
  echo "⚠️  Neither ~/.opencode/skill nor ~/.claude/skills exists"
  read -p "Create ~/.opencode/skill and install there? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    mkdir -p "$HOME/.opencode/skill"
    INSTALL_DIR="$HOME/.opencode/skill"
  else
    echo "❌ Installation cancelled"
    exit 1
  fi
fi

# Copy skill files
echo "📦 Installing to $INSTALL_DIR/apple-notes..."
cp -r skill "$INSTALL_DIR/apple-notes"

# Make script executable
chmod +x "$INSTALL_DIR/apple-notes/notes.js"

# Test the installation
echo "🧪 Testing installation..."
if osascript -l JavaScript "$INSTALL_DIR/apple-notes/notes.js" &> /dev/null; then
  echo "✅ Installation successful!"
  echo ""
  echo "Usage:"
  echo "  osascript -l JavaScript '$INSTALL_DIR/apple-notes/notes.js' <command> [args...]"
  echo ""
  echo "Examples:"
  echo "  osascript -l JavaScript '$INSTALL_DIR/apple-notes/notes.js' list 'meeting'"
  echo "  osascript -l JavaScript '$INSTALL_DIR/apple-notes/notes.js' recent 5"
else
  echo "⚠️  Installation completed but script returned an error"
  echo "   This may be normal if Apple Notes hasn't been set up yet"
fi

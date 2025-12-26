#!/bin/bash

# Test runner script

set -e

echo "🧪 Running Apple Notes Skill Tests"
echo "=================================="

# Check if Node.js is available
if ! command -v node &> /dev/null; then
  echo "❌ Error: Node.js not found"
  echo "   Tests require Node.js 18+"
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18+ required, found $(node -v)"
  exit 1
fi

# Run unit tests
echo "📋 Running unit tests..."
node --test tests/*.unit.test.js

# Check if tests passed
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ All tests passed!"
else
  echo ""
  echo "❌ Some tests failed"
  exit 1
fi

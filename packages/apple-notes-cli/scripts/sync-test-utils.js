#!/usr/bin/env bun
// Extracts pure JS functions from notes.js for unit testing
// This ensures tests always run against the actual JXA implementation

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SOURCE = resolve(ROOT, 'src/jxa/notes.js');
const TARGET = resolve(ROOT, 'tests/conversion-utils.js');

const FUNCTIONS = ['htmlToMarkdown', 'markdownToHtml', 'getPreview'];

/**
 * Transforms JXA code style to match ESLint rules
 * @param {string} code - The function code
 * @returns {string} - Transformed code
 */
function transformForLint(code) {
  // Fix: if (!x) return ""; -> if (!x) { return ""; }
  return code.replace(/if\s*\(([^)]+)\)\s*return\s*([^;]+);/g, 'if ($1) {\n    return $2;\n  }');
}

/**
 * Extracts a function from source code by matching braces
 * @param {string} source - The source code
 * @param {string} funcName - The function name to extract
 * @returns {string|null} - The extracted function or null if not found
 */
function extractFunction(source, funcName) {
  const pattern = new RegExp(`function ${funcName}\\s*\\(`);
  const match = source.match(pattern);

  if (!match) {
    console.error(`Function '${funcName}' not found`);
    return null;
  }

  const startIndex = match.index;
  let braceCount = 0;
  let foundFirstBrace = false;
  let endIndex = startIndex;

  for (let i = startIndex; i < source.length; i++) {
    const char = source[i];

    if (char === '{') {
      braceCount++;
      foundFirstBrace = true;
    } else if (char === '}') {
      braceCount--;
    }

    if (foundFirstBrace && braceCount === 0) {
      endIndex = i + 1;
      break;
    }
  }

  return source.substring(startIndex, endIndex);
}

function main() {
  console.log('Syncing test utilities from notes.js...');

  const source = readFileSync(SOURCE, 'utf-8');
  const extractedFunctions = [];

  for (const funcName of FUNCTIONS) {
    const func = extractFunction(source, funcName);
    if (func) {
      extractedFunctions.push(transformForLint(func));
      console.log(`  Extracted: ${funcName}`);
    } else {
      console.error(`  Failed to extract: ${funcName}`);
      process.exit(1);
    }
  }

  const output = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Source: src/jxa/notes.js
// Run \`bun run sync-utils\` to regenerate

${extractedFunctions.join('\n\n')}

export { ${FUNCTIONS.join(', ')} };
`;

  writeFileSync(TARGET, output);
  console.log(`\nWritten to: ${TARGET}`);
}

main();

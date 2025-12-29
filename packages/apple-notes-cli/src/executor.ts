import { execSync, type ExecSyncOptionsWithStringEncoding } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { htmlToMarkdown, markdownToHtml } from './converter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Commands that return HTML and need post-processing to Markdown
 */
const HTML_OUTPUT_COMMANDS = new Set(['search', 'list', 'read', 'read-index', 'recent']);

/**
 * Path to the bundled JXA notes.js script
 * After build, __dirname is 'dist/', so we go up one level to package root
 */
export function getNotesScriptPath(): string {
  return join(__dirname, '..', 'src', 'jxa', 'notes.js');
}

/**
 * Escape a shell argument for safe execution
 */
export function escapeShellArg(arg: string): string {
  // Replace single quotes with escaped version and wrap in single quotes
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

/**
 * Execute the Apple Notes JXA script with the given arguments
 * Handles conversion between Markdown and HTML transparently
 */
export function executeNotesCommand(args: string[]): string {
  const command = args[0];

  // For create command, convert body (args[2]) from Markdown to HTML before passing to JXA
  let processedArgs = [...args];
  if (command === 'create' && args.length >= 3) {
    // args[2] is the body - convert Markdown to HTML
    const htmlBody = markdownToHtml(args[2]);
    processedArgs = [args[0], args[1], htmlBody];
    if (args[3]) {
      processedArgs.push(args[3]); // folder
    }
  }

  const scriptPath = getNotesScriptPath();
  const escapedArgs = processedArgs.map(escapeShellArg).join(' ');
  const shellCommand = `osascript -l JavaScript "${scriptPath}" ${escapedArgs}`;

  const options: ExecSyncOptionsWithStringEncoding = {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large notes
  };

  try {
    const result = execSync(shellCommand, options);
    const output = result.trim();

    // Convert HTML output to Markdown for commands that return HTML
    if (HTML_OUTPUT_COMMANDS.has(command)) {
      return htmlToMarkdown(output);
    }

    return output;
  } catch (error) {
    if (error instanceof Error && 'stderr' in error) {
      const stderr = (error as { stderr?: string }).stderr;
      if (stderr) {
        throw new Error(stderr.toString().trim());
      }
    }
    throw error;
  }
}

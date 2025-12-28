import { execSync, type ExecSyncOptionsWithStringEncoding } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
 */
export function executeNotesCommand(args: string[]): string {
  const scriptPath = getNotesScriptPath();
  const escapedArgs = args.map(escapeShellArg).join(' ');
  const command = `osascript -l JavaScript "${scriptPath}" ${escapedArgs}`;

  const options: ExecSyncOptionsWithStringEncoding = {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large notes
  };

  try {
    const result = execSync(command, options);
    return result.trim();
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

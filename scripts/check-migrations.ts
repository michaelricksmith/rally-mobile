/**
 * Utility: print a summary of every migration and confirm:
 *  - every file starts with a SQL comment header
 *  - every file ends with a newline
 *  - no file contains "TODO" or "FIXME" markers
 *
 * This is a guardrail for the Phase 0 commit and runs in CI as part of
 * `npm run lint` via a separate script if you wire it in.
 */
import { promises as fs } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(__dirname, '..');

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.isFile()) files.push(p);
  }
  return files;
}

async function main() {
  const files = (await walk(join(ROOT, 'supabase'))).filter((f) => f.endsWith('.sql'));
  let problems = 0;
  for (const f of files) {
    const body = await fs.readFile(f, 'utf8');
    if (!body.startsWith('--')) {
      console.error(`[migrations] ${relative(ROOT, f)}: missing leading SQL comment`);
      problems += 1;
    }
    if (!body.endsWith('\n')) {
      console.error(`[migrations] ${relative(ROOT, f)}: missing trailing newline`);
      problems += 1;
    }
    if (/\b(TODO|FIXME)\b/.test(body)) {
      console.error(`[migrations] ${relative(ROOT, f)}: contains TODO/FIXME`);
      problems += 1;
    }
  }
  if (problems > 0) {
    console.error(`[migrations] ${problems} problem(s) found`);
    process.exit(1);
  }
  console.log(`[migrations] ok: ${files.length} SQL file(s) checked`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

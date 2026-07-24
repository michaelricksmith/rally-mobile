/**
 * Cross-check: every table created in 0001_init.sql has RLS enabled
 * and at least one policy in 0002_rls.sql.
 *
 * This is a static check, not a runtime check. CI runs the pgTAP suite
 * against a real local Postgres. This script catches drift between
 * the schema and the RLS layer before it gets to CI.
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const INIT = join(ROOT, 'supabase/migrations/0001_init.sql');
const RLS = join(ROOT, 'supabase/migrations/0002_rls.sql');

async function main() {
  const init = await fs.readFile(INIT, 'utf8');
  const rls = await fs.readFile(RLS, 'utf8');

  // Extract `create table <name> (`
  const tableRe = /create\s+table\s+(?:if\s+not\s+exists\s+)?([a-z_][a-z0-9_]*)\s*\(/gi;
  const tables = new Set<string>();
  for (const m of init.matchAll(tableRe)) tables.add(m[1].toLowerCase());

  // Extract `alter table <name> enable row level security`
  const rlsEnabledRe = /alter\s+table\s+([a-z_][a-z0-9_]*)\s+enable\s+row\s+level\s+security/gi;
  const rlsEnabled = new Set<string>();
  for (const m of rls.matchAll(rlsEnabledRe)) rlsEnabled.add(m[1].toLowerCase());

  // Extract `create policy <name> on <table>`
  const policyRe = /create\s+policy\s+[a-z_][a-z0-9_]*\s+on\s+([a-z_][a-z0-9_]*)/gi;
  const policies = new Set<string>();
  for (const m of rls.matchAll(policyRe)) policies.add(m[1].toLowerCase());

  const failures: string[] = [];
  for (const t of tables) {
    if (!rlsEnabled.has(t)) failures.push(`table ${t}: RLS not enabled`);
    if (!policies.has(t)) failures.push(`table ${t}: no policies defined`);
  }

  if (failures.length > 0) {
    console.error('[rls-coverage] failures:');
    for (const f of failures) console.error('  - ' + f);
    process.exit(1);
  }
  console.log(`[rls-coverage] ok: ${tables.size} tables, all RLS-enabled and policy-covered`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

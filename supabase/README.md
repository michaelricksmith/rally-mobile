# Supabase

## Local development

```bash
# 1. Start the local stack (Postgres + Auth + Realtime + Storage)
npx supabase start

# 2. Reset the database to apply all migrations + seed
npx supabase db reset

# 3. Lint the migrations
npx supabase db lint

# 4. Run the RLS test suite
npx supabase test db
```

> **Never run `supabase db reset` against a cloud project.** Reset is local-only. Cloud migrations are applied with `supabase db push`.

## Files

| File                       | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `migrations/0001_init.sql` | All 31 tables, enums, indexes, foreign keys |
| `migrations/0002_rls.sql`  | RLS policies for every multi-tenant table   |
| `seed.sql`                 | Local-only seed with safety guard           |
| `tests/rls.test.sql`       | pgTAP test suite for RLS policies           |
| `config.toml`              | Local Supabase project configuration        |

## Safety guards

- `seed.sql` raises an exception if the database is not local.
- `point_transactions` accepts INSERT only from `service_role`. Client INSERTs fail with `insufficient_privilege`.
- `audit_logs` is admin-read-only and INSERT only by `service_role`.
- `wearable_metrics` and `activity_location_samples` are the most restricted tables in the schema.

## Generating TypeScript types

After changing any migration, regenerate the typed client:

```bash
npx supabase gen types typescript --local > src/types/database.generated.ts
```

The output is gitignored and rebuilt by CI before linting.

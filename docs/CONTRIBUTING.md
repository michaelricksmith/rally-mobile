# Contributing

## Commit standards

Conventional Commits are enforced. Examples:

```
feat: add group create flow
fix: dedupe group invites by code
db: add campaigns + prizes + sponsors
rls: lock activity_location_samples to owner + authorized viewers
chore: bump expo to 51.0.28
docs: document wearable provider interface
refactor: extract normalized workout mapper
test: add rls coverage for wearable_metrics
```

The `commit-msg` husky hook runs `commitlint`. Commits that don't follow the format are rejected.

## Branch policy

- `main` is protected.
- One concern per branch.
- `feat/<short-name>`, `fix/<short-name>`, `db/<short-name>`, `rls/<short-name>`, `chore/<short-name>`, `docs/<short-name>`.
- Branch from `main`, rebase before merge.
- Squash-merge to `main`.

## PR review checklist

Before requesting review, the author confirms:

- [ ] `npx tsc --noEmit` is clean.
- [ ] `npx eslint .` is clean.
- [ ] `npx prettier --check` is clean.
- [ ] `npx jest` is green; new logic has unit tests.
- [ ] Schema changes ship a migration AND a pgTAP RLS test in `supabase/tests/rls.test.sql`.
- [ ] No new secrets in source, screenshots, or fixtures.
- [ ] No shared modifications to Strive, MedClear, or any other product.
- [ ] README / docs updated if the change is user-facing or changes setup.

## Phase discipline

Do not import Phase N+1 abstractions into a Phase N PR. The wearable interface exists in Phase 0 to keep doors open, but the **call sites** that use it land in their respective phase. This keeps PRs reviewable and rollbacks safe.

## Code style

- TypeScript strict mode on.
- 2-space indent, single quotes, trailing commas (Prettier defaults).
- Prefer named exports.
- Avoid `any`. If you must, justify in a comment.
- Service modules are the only place that knows about third-party SDKs.
- RLS policies are the only place that knows who can read what.

## Questions?

Open a GitHub Discussion or ping in the team chat. Security issues: `security@strive.app`.

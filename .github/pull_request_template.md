# Pull Request

## Type

<!-- feat | fix | chore | docs | refactor | test | db | rls -->

## Phase

<!-- 1-9 from docs/ROADMAP.md -->

## Linked issues

<!-- closes #... -->

## Summary

<!-- 1-3 bullets. -->

## Screens

<!-- if UI change -->

## Checklist

- [ ] `npx tsc --noEmit` clean
- [ ] `npx eslint .` clean
- [ ] `npx jest` green
- [ ] `supabase db lint` clean
- [ ] RLS test updated (if schema change)
- [ ] No secrets committed
- [ ] No shared modifications to Strive / MedClear / other projects

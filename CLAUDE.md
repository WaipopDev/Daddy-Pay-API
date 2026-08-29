# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here

This repo already has a full agent-facing doc set — read these before making non-trivial changes, don't re-derive:
- @docs/AGENTS.md — stack, repo layout, auth model, "adding a feature" flow
- @docs/RULE.md — coding rules (Controller/Service/Repository/Entity/DTO layering, naming, anti-patterns)
- @docs/SKILL.md — step-by-step workflows (new endpoint, migration, auth, IoT endpoint) + pre-finish checklist

## Commands

- Build: `npm run build` (`nest build`)
- Lint: `npm run lint` (eslint --fix)
- Unit test: `npx jest <pattern>` or `npx jest -t "<name>"` (rootDir is `src`, specs sit next to source)
- E2E test: `npm run test:e2e`
- Migrations (datasource is `ormconfig.ts`, not the runtime config — always pass `-d ormconfig.ts`):
  - `npm run migration:generate --name=X`
  - `npm run migration:run`
  - `npm run migration:revert`
- Entity scaffold: `npm run entity:create --name=Foo`

## Non-obvious gotchas

- `synchronize: false` always — schema changes must go through a migration in `src/models/migrations/`, never rely on auto-sync.
- Global route prefix `api` is set once in `src/main.ts` — do not add `api` again inside `@Controller()` paths.
- `ValidationPipe`'s `exceptionFactory` returns a custom shape: `{ message: 'Validation failed', errors: [{ property, message }] }` — not Nest's default validation error format.
- Two separate auth guards exist: `AdminAuthGuard` (`JWT_ADMIN_SECRET`) and `IoTAuthGuard` (`JWT_IOT_SECRET`) — never mix them on the same route. `JWT_IOT_SECRET` is required at runtime but missing from `.env.example`.
- Never put full user JSON in a custom response header (e.g. `x-user-data`) — this previously caused 502s from nginx/ALB header-size limits. Use the `/admin/me` endpoint instead.
- `any` and floating promises are intentionally allowed (`no-explicit-any` off, `no-floating-promises` is a warning) — don't flag these as issues to fix unprompted.
- Production runs under pm2 as process name `api` (deployed via `.github/workflows/deploy.yml` on push to `main`, rsync + SSH to the GCP VM — see the sibling `Daddy-Pay` repo's CLAUDE.md for the frontend counterpart).

## Git

Commit only when explicitly asked. No force-push to main/master, no `--no-verify`, unless explicitly asked.

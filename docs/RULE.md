# Daddy Pay API — Rules

Rules for AI agents and contributors. Keep changes small and consistent with existing code.

## Architecture

- **Controller** — HTTP, Swagger decorators, guards, DTO validation; thin try/catch only where the project already uses it.
- **Service** — business rules, orchestration, exceptions (`BadRequestException`, `NotFoundException`, `UnauthorizedException`).
- **Repository** — TypeORM queries/transactions; inject `@InjectEntityManager() private readonly db: EntityManager`.
- **Entity** — `src/models/entities/`; extend `DefaultEntity` when applicable.
- **DTO** — `src/<feature>/dto/`; use `class-validator` + `@ApiProperty`; `PartialType` for updates.

Do not bypass repositories with raw SQL unless the codebase already does for that case.

## API conventions

- Global prefix: `api`; default version: `v1` (URI versioning).
- Admin routes: `@ApiBearerAuth()`, `@UseGuards(AdminAuthGuard)`, `@ApiTags('...')`.
- Pagination: reuse `PaginationDto` from `src/constants/pagination.constant`.
- HTTP status copy: `HTTP_STATUS_MESSAGES` from `src/constants/http-status.constant`.
- Put **specific routes before param routes** (e.g. `PATCH change-password` before `PATCH :id`).
- Response user context: `@User()` decorator — not custom oversized headers.

## Auth & security

- Admin JWT: `JWT_ADMIN_SECRET`, `JWT_ADMIN_EXPIRE`; sign/verify in `AdminAuthService`.
- Passwords: `hashPassword` / `matchPassword` from `src/utility/password.ts` only.
- IoT routes use `IoTAuthGuard` and `JWT_IOT_SECRET` — do not mix with admin guard unless intentional.
- Never log or commit tokens, passwords, or `.env` values.
- Do not add secrets to git; use `.env.example` for new env keys only (placeholder values).

## IDs & encoding

- External IDs may use `IdEncoderService` / encoded DTOs (`encoded-id-param.dto.ts`).
- `IdEncoderExceptionFilter` is global — handle decode errors consistently.
- When accepting shop IDs from admin DTOs, follow existing `user` / `shop-info` patterns (validate shop exists).

## Database

- Schema changes require a migration under `src/models/migrations/`.
- Use transactions in repositories for multi-table writes (see `UsersRepository.create`, `updateWithPermissions`).
- Run `npm run migration:run` after adding migrations; do not edit applied migrations in production workflows.

## Code style

- TypeScript strict patterns; 4-space indent per existing files.
- Imports: use `src/...` path alias as in the project.
- Match naming: `*Module`, `*Controller`, `*Service`, `*Repository`, `create-*.dto.ts`, `update-*.dto.ts`.
- Comments only for non-obvious business logic.
- Avoid drive-by refactors unrelated to the task.
- Avoid `console.log` in new code unless matching an existing controller pattern being extended.

## Swagger

- Document endpoints with `@ApiResponse` for 200 and 401 (and others when relevant).
- DTO fields need `@ApiProperty` with examples where helpful.

## CORS / token refresh

- Exposed headers for admin refresh: `X-Token-Expired`, `X-New-Token`, `X-Token-Refreshed` (configured in `main.ts`).
- Frontend should read new token from response headers when `X-Token-Refreshed` is set.

## Testing & verification

- Run `npm run build` or `npm run lint` when touching TypeScript broadly.
- Add tests only when requested or when covering non-trivial behavior worth guarding.

## Git

- Commit only when the user explicitly requests it.
- No force-push to `main`/`master`; no `--no-verify` unless asked.

## Anti-patterns

- ❌ Large Base64/JSON user blobs in request headers
- ❌ Storing plaintext passwords
- ❌ Business logic duplicated in controllers that belongs in services/repositories
- ❌ New modules not registered in `app.module.ts`
- ❌ Breaking existing API paths without coordination with frontend

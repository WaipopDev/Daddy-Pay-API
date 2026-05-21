# Daddy Pay API — Agent Guide

NestJS backend for Daddy Pay: admin panel, shop/machine management, IoT devices, payments (KBank), Firebase, and reporting.

## Quick reference

| Item | Value |
|------|--------|
| Stack | NestJS 11, TypeORM, PostgreSQL, JWT, Swagger, Firebase Admin |
| Base URL | `/api` + URI version (default `v1`) → e.g. `GET /api/v1/admin/me` |
| Swagger | `/document` |
| Timezone | `Asia/Bangkok` (set in `main.ts`) |
| Dev | `npm run start:dev` |
| Migrations | `npm run migration:run` / `migration:generate` / `migration:create` |

## Repository layout

```
src/
├── <feature>/           # module: *.module.ts, *.controller.ts, *.service.ts, dto/
├── repositories/        # TypeORM data access (inject EntityManager)
├── models/entities/     # TypeORM entities
├── models/migrations/   # DB migrations
├── guards/              # AdminAuthGuard, IoTAuthGuard
├── decorators/          # @User() → request userId
├── utility/             # password, id-encoder, key-generator
├── constants/           # HTTP messages, pagination
├── config/              # DB connection (DADDY_PAY_DB)
└── main.ts              # bootstrap, CORS, validation, versioning
```

## Authentication

- **Admin / back-office**: `Authorization: Bearer <JWT>` + `AdminAuthGuard`
  - Profile: `GET /api/v1/admin/me`
  - Login: `POST /api/v1/admin/auth/signin`
  - Token refresh headers (for frontend): `X-New-Token`, `X-Token-Refreshed`, `X-Token-Expired`
- **IoT**: `IoTAuthGuard` on `iot-*` modules (`JWT_IOT_SECRET`)
- **Do not** put large user JSON in HTTP headers (e.g. `x-user-data`); use JWT + `/admin/me` body instead (avoids proxy 502 from header size limits).

After guard runs, use `@User()` for `userId` on controllers; `request['username']`, `request['rolePermissions']` are set in `AdminAuthGuard`.

## Adding a feature (typical flow)

1. `nest g module <name>` (or mirror an existing module under `src/`)
2. DTOs with `class-validator` + `@ApiProperty` for Swagger
3. Service: business logic; call repository(ies)
4. Controller: `@ApiTags`, `@ApiBearerAuth`, `@UseGuards(AdminAuthGuard)` when admin-only
5. Register module in `app.module.ts`
6. Add migration if schema changes: `npm run migration:generate --name=YourMigration`

## Commands

```bash
npm install
npm run start:dev
npm run lint
npm run test
npm run migration:run
npm run gen:repo    # generate repository scaffold
```

## Environment

Copy `.env.example` → `.env`. Required groups: `PG_*`, `JWT_ADMIN_*`, Firebase vars, `ID_ENCODER_SECRET`. Never commit `.env` or secrets.

## Agent instructions

- Read **[RULE.MD](./RULE.MD)** for coding standards and anti-patterns.
- Use **[SKILL.MD](./SKILL.MD)** (or `.cursor/skills/daddy-pay-api/SKILL.md`) for step-by-step workflows (new endpoint, migration, auth).
- Prefer minimal, focused diffs; match existing module/repository patterns.
- Do not create git commits unless the user explicitly asks.
- Verify with `npm run build` or relevant tests before claiming work is done.

## Related docs

- [RULE.MD](./RULE.MD) — project rules for AI and contributors
- [SKILL.MD](./SKILL.MD) — task workflows for this codebase
- NestJS modules: `admin-auth`, `admin-me`, `user`, `shop-info`, `machine-info`, `iot-payment`, `payment`, `report`, `dashboard`

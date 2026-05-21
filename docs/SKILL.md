---
name: daddy-pay-api
description: >-
  Implements and debugs Daddy Pay API (NestJS, TypeORM, admin JWT, IoT auth,
  repositories, migrations). Use when working in Daddy-Pay-API, adding endpoints,
  fixing auth/payment/shop/machine modules, or running migrations.
---

# Daddy Pay API — Skill

## When to use

- New or changed REST endpoints in this repo
- Admin auth, `/admin/me`, user/shop/machine/IoT/payment/report features
- TypeORM entities, repositories, migrations
- JWT refresh headers or guard behavior

## Workflow: new admin endpoint

1. **Locate module** under `src/<feature>/` or create module matching neighbors (`user`, `shop-info`, etc.).
2. **DTO** — `class-validator` + `@ApiProperty`; export from `dto/`.
3. **Repository** — add method in `src/repositories/<Entity>.repository.ts` (or generate via `npm run gen:repo`).
4. **Service** — call repository; throw Nest HTTP exceptions with clear messages.
5. **Controller**:
   - `@Controller('<path>')` (no `api` prefix in decorator — global prefix applies)
   - `@UseGuards(AdminAuthGuard)` + `@ApiBearerAuth()` + `@ApiTags`
   - `@User() userId: number` when the acting user is needed
6. **Register** `*Module` in `app.module.ts` if new.
7. **Verify**: `npm run build` or `npm run start:dev` and hit Swagger `/document`.

### Example controller pattern

```typescript
@ApiTags('Feature')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  findAll(@Query() option: PaginationDto) {
    return this.featureService.findAll(option);
  }
}
```

## Workflow: change password (existing pattern)

- Route: `PATCH /api/v1/user/change-password` (before `:id` routes)
- DTO: `ChangePasswordDto` (`oldPassword`, `newPassword`)
- Service: `findUserById` with password, `matchPassword`, `hashPassword`, `usersRepo.update`

## Workflow: database migration

1. Edit entity in `src/models/entities/`.
2. Generate: `npm run migration:generate --name=DescribeChange`
3. Review generated file in `src/models/migrations/`.
4. Apply: `npm run migration:run`
5. Revert if needed: `npm run migration:revert`

## Workflow: admin auth / profile

| Action | Method | Path |
|--------|--------|------|
| Login | POST | `/api/v1/admin/auth/signin` |
| Profile | GET | `/api/v1/admin/me` |
| Bearer | Header | `Authorization: Bearer <token>` |

Token refresh: guard may set `X-New-Token`, `X-Token-Refreshed`; expired → `X-Token-Expired`.

Frontend integration: **do not** send full user JSON in `x-user-data`; call `/admin/me` and use response body.

## Workflow: IoT endpoint

- Use `IoTAuthGuard` (not `AdminAuthGuard`).
- Modules: `iot-machine`, `iot-payment`, `iot-program`, `auth` (IoT JWT).
- Env: `JWT_IOT_SECRET`.

## Workflow: encoded IDs

- Use `IdEncoderService` / validators in `src/utility/`.
- DTOs like `encoded-id-param.dto.ts` for route params.
- Expect `IdEncoderExceptionFilter` for invalid IDs.

## Workflow: passwords

```typescript
import { hashPassword, matchPassword } from 'src/utility/password';

const ok = await matchPassword(storedHash, plainPassword);
const hash = await hashPassword(newPassword);
```

## Checklist before finishing

- [ ] Module registered in `app.module.ts`
- [ ] DTO validated; Swagger decorated
- [ ] Correct guard (Admin vs IoT)
- [ ] Migration added if schema changed
- [ ] No secrets in diff
- [ ] Build passes (`npm run build`)

## See also

- [AGENTS.MD](./AGENTS.MD) — project map and commands
- [RULE.MD](./RULE.MD) — standards and anti-patterns

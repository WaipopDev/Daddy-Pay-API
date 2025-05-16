import { PartialType } from '@nestjs/swagger';
import { CreateAdminMeDto } from './create-admin-me.dto';

export class UpdateAdminMeDto extends PartialType(CreateAdminMeDto) {}

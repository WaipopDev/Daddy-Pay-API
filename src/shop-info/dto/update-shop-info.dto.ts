import { PartialType } from '@nestjs/swagger';
import { CreateShopInfoDto } from './create-shop-info.dto';

export class UpdateShopInfoDto extends PartialType(CreateShopInfoDto) {}

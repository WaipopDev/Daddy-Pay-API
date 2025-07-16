import { PartialType } from '@nestjs/swagger';
// import { CreateShopInfoDto } from './create-shop-info.dto';
import { CreateShopInfoMultipartDto } from './create-shop-info-multipart.dto';

export class UpdateShopInfoDto extends PartialType(CreateShopInfoMultipartDto) {}

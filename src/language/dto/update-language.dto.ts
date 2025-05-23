import { PartialType } from '@nestjs/swagger';
import { CreateLanguageMainDto } from './create-language.dto';

export class UpdateLanguageMainDto extends PartialType(CreateLanguageMainDto) {

}

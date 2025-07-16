import { PartialType } from '@nestjs/swagger';
import { CreateIotProgramDto } from './create-iot-program.dto';

export class UpdateIotProgramDto extends PartialType(CreateIotProgramDto) {}

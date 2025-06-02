import { PartialType } from '@nestjs/swagger';
import { CreateMachineInfoDto } from './create-machine-info.dto';

export class UpdateMachineInfoDto extends PartialType(CreateMachineInfoDto) {}

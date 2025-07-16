import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIotProgramDto } from './dto/create-iot-program.dto';
import { UpdateIotProgramDto } from './dto/update-iot-program.dto';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import { MachineProgramEntity } from 'src/models/entities/MachineProgram.entity';
import { ResponseMachineProgramDto } from 'src/shop-management/dto/shop-management.dto';

@Injectable()
export class IotProgramService {
    constructor(
        private readonly shopManagementRepository: ShopManagementRepository
    ) { }

    async findOne(id: string) {
        const iotProgram: ResponseMachineProgramDto[] = await this.shopManagementRepository.findProgramByIdIoT(id);
        if (!iotProgram || iotProgram.length === 0) {
            throw new BadRequestException(`No IoT program found with ID: ${id}`);
        }
        return this.formatIotProgramResponse(iotProgram);
    }

    private formatIotProgramResponse(iotProgram: ResponseMachineProgramDto[]) {
        return iotProgram.map(program => ({
            id               : program.id,
            machineProgramKey: program.machineProgramKey,
            programName      : program.programInfo.programName,
            programCode      : program.programInfo.programKey,
            price            : program.machineProgramPrice,
            time             : program.machineProgramOperationTime,
            description      : program.programInfo.programDescription || '',
        }));
    }
}

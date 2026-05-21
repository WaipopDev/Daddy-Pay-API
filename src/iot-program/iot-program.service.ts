import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIotProgramDto } from './dto/create-iot-program.dto';
import { UpdateIotProgramDto } from './dto/update-iot-program.dto';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { MachineProgramEntity } from 'src/models/entities/MachineProgram.entity';
import { ResponseMachineProgramDto } from 'src/shop-management/dto/shop-management.dto';
import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';

@Injectable()
export class IotProgramService {
    constructor(
        private readonly shopManagementRepository: ShopManagementRepository,
        private readonly shopInfoRepository: ShopInfoRepository,
    ) { }

    async findOne(id: string) {
        const iotProgram: {machineProgram: ResponseMachineProgramDto[], shopManagement: ShopManagementEntity | null} = await this.shopManagementRepository.findProgramByIdIoT(id);
        if (!iotProgram || iotProgram.machineProgram.length === 0) {
            throw new BadRequestException(`No IoT program found with ID: ${id}`);
        }
        if (!iotProgram.shopManagement) {
            throw new BadRequestException('Machine not found');
        }
        const shopInfo = await this.shopInfoRepository.findShopInfoById(iotProgram.shopManagement.shopInfoID);
        if (!shopInfo) {
            throw new BadRequestException('Shop info not found');
        }
        if (shopInfo.subSubscriptionStatus !== 'active') {
            throw new BadRequestException('Subscription is not active');
        }
        return this.formatIotProgramResponse(iotProgram.machineProgram, iotProgram.shopManagement);
    }

    private formatIotProgramResponse(iotProgram: ResponseMachineProgramDto[], shopManagement: ShopManagementEntity | null) {
        return iotProgram.map(program => ({
            id                : program.id,
            machineProgramKey : program.machineProgramKey,
            programName       : program.programInfo.programName,
            programCode       : program.programInfo.programKey,
            price             : program.machineProgramPrice,
            time              : program.machineProgramOperationTime,
            description       : program.programInfo.programDescription || '',
            shopIntervalTime  : shopManagement?.shopManagementIntervalTime || 0,
            shopManagementName: shopManagement?.shopManagementName || '',
            shopName          : program?.shopInfo.shopName || '',
        }));
    }
}

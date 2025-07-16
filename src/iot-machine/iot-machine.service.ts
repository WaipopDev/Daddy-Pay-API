import { BadRequestException, Injectable } from '@nestjs/common';
import { MachineProgramRequestDto } from './dto/machine-program-request.dto';
import { MachineTransactionRepository } from 'src/repositories/MachineTransaction.repository';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import { ProgramInfoRepository } from 'src/repositories/ProgramInfo.repository';
import { MachineProgramRepository } from 'src/repositories/MachineProgram.repository';

@Injectable()
export class IotMachineService {
    constructor(
        private readonly machineTransactionRepository: MachineTransactionRepository,
        private readonly shopManagementRepository: ShopManagementRepository,
        private readonly programInfoRepository: ProgramInfoRepository,
        private readonly machineProgramRepository: MachineProgramRepository,
    ) { }

    async processMachineProgram(data: MachineProgramRequestDto) {
        const programInfo = await this.machineProgramRepository.findByIdAndKey(data.id, data.machineProgramKey);
        if (!programInfo) {
            throw new BadRequestException('Invalid program ID or key');
        }

        const shopManagement = await this.shopManagementRepository.findByIdIoT(data.iotId);
        if (!shopManagement) {
            throw new BadRequestException('Machine not found');
        }
        if (data.status === 'active' && shopManagement.status === 'standby') {
            await this.shopManagementRepository.updateShopManagement(shopManagement.id, {
                status: 'active',
                lastConnect: new Date(),
                errorMessage: data.errorMessage || ''
            });
            await this.machineTransactionRepository.createMachineTransaction({
                shopManagementId: shopManagement.id,
                shopInfoId      : shopManagement.shopInfoID,
                machineInfoId   : shopManagement.machineInfoID,
                programInfoId   : programInfo.programInfoId,
                machineProgramId: programInfo.id,
                priceType       : data.priceType,
                transactionId   : data.transactionId,
                transactionIot  : data.transactionIot,
                price           : programInfo.machineProgramPrice,
                status          : 'active',
                createdAt       : new Date(),
                updatedAt       : new Date(),
                createdBy       : 2,
                updatedBy       : 2,
            });
        }else if (data.status === 'standby' && shopManagement.status === 'active') {
            await this.shopManagementRepository.updateShopManagement(shopManagement.id, {
                status: 'standby',
                lastConnect: new Date(),
                errorMessage: ''
            });
        }

        return {
            success: true,
            message: 'Machine program processed successfully',
            data: {
                id: data.id,
                machineProgramKey: data.machineProgramKey,
                processedAt: new Date().toISOString()
            }
        };
    }
}

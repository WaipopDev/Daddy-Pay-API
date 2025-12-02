import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { MachineProgramRepository } from 'src/repositories/MachineProgram.repository';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { ProgramInfoRepository } from 'src/repositories/ProgramInfo.repository';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import {
    MachineProgramResponseDto,
    ResponseProgramInfoDto,
    ResponseMachineInfoDto,
    ResponseMachineProgramDto,
    ResponseMachineProgramAllDto,
    UpdateMachineProgramDto
} from './dto/machine-program.dto';
import { CreateMachineProgramDto } from './dto/create-machine-program.dto';

@Injectable()
export class MachineProgramService {
    constructor(
        private readonly machineProgramRepository: MachineProgramRepository,
        private readonly machineInfoRepository: MachineInfoRepository,
        private readonly shopInfoRepository: ShopInfoRepository,
        private readonly programInfoRepository: ProgramInfoRepository,
        private readonly keyGeneratorService: KeyGeneratorService,
    ) { }

    async create(createMachineProgramDto: CreateMachineProgramDto, createdBy: number): Promise<ResponseMachineProgramDto> {
        // Decode IDs
        const shopInfoId = IdEncoderService.decode(createMachineProgramDto.shopId);
        const machineInfoId = IdEncoderService.decode(createMachineProgramDto.machineId);
        const programInfoId = IdEncoderService.decode(createMachineProgramDto.programId);

        // Verify shop exists
        const shopInfo = await this.shopInfoRepository.findShopInfoById(shopInfoId);
        if (!shopInfo) {
            throw new UnauthorizedException('Shop not found');
        }

        // Verify machine exists
        const machineInfo = await this.machineInfoRepository.findMachineInfoById(machineInfoId);
        if (!machineInfo) {
            throw new UnauthorizedException('Machine not found');
        }

        // Verify program exists
        const programInfo = await this.programInfoRepository.findProgramInfoById(programInfoId);
        if (!programInfo) {
            throw new UnauthorizedException('Program not found');
        }

        // Generate unique machine program key
        const machineProgramKey = await this.machineProgramRepository.generateUniqueMachineProgramKey();

        // Create machine program data
        const machineProgramData = {
            machineProgramKey,
            shopInfoId,
            machineInfoId,
            programInfoId,
            machineProgramPrice: createMachineProgramDto.machineProgramPrice,
            machineProgramOperationTime: createMachineProgramDto.machineProgramOperationTime,
            machineProgramStatus: 'active',
            createdBy,
            updatedBy: createdBy,
        };

        const machineProgram = await this.machineProgramRepository.createMachineProgram(machineProgramData);

        // Fetch the complete machine program with relations
        const completeMachineProgram = await this.machineProgramRepository.findMachineProgramById(machineProgram.id);

        if (!completeMachineProgram) {
            throw new UnauthorizedException('Machine program not found after creation');
        }

        return plainToInstance(ResponseMachineProgramDto, completeMachineProgram, {
            excludeExtraneousValues: true
        });
    }

    async findByMachine(machineInfoId: number): Promise<MachineProgramResponseDto[]> {

        const machineInfo = await this.machineInfoRepository.findMachineInfoById(machineInfoId);
        if (!machineInfo) {
            throw new UnauthorizedException('Machine not found');
        }

        const programs = await this.machineProgramRepository.findByMachine(machineInfoId);

        const transformedPrograms = programs.map(program => {
            const transformed = plainToInstance(MachineProgramResponseDto, program, {
                excludeExtraneousValues: true
            });
            transformed.id = IdEncoderService.encode(program.id);
            return transformed;
        });

        return transformedPrograms;
    }

    async findAll(idMachine: number, idShop: number): Promise<ResponseMachineProgramAllDto[]> {

        const machinePrograms = await this.machineProgramRepository.findAll(idMachine, idShop);

        return machinePrograms.map(program =>
            plainToInstance(ResponseMachineProgramAllDto, program, { excludeExtraneousValues: true })
        );
    }

    async remove(id: number, deletedBy: number): Promise<void> {
        const machineProgram = await this.machineProgramRepository.findMachineProgramById(id);
        if (!machineProgram) {
            throw new NotFoundException('Machine program not found');
        }

        await this.machineProgramRepository.deleteMachineProgram(machineProgram.id, deletedBy);
    }

    async findByProgramKey(programKey: string): Promise<ResponseProgramInfoDto | null> {
        const programInfo = await this.programInfoRepository.findProgramInfoByKey(programKey);

        if (!programInfo) {
            return null;
        }

        return plainToInstance(ResponseProgramInfoDto, programInfo, {
            excludeExtraneousValues: true
        });
    }

    async update(id: number, updateMachineProgramDto: UpdateMachineProgramDto): Promise<ResponseMachineProgramDto> {
        const machineProgram = await this.machineProgramRepository.findMachineProgramById(id);
        if (!machineProgram) {
            throw new NotFoundException('Machine program not found');
        }

        const updatedMachineProgram = await this.machineProgramRepository.updateMachineProgram(id, updateMachineProgramDto);

        return plainToInstance(ResponseMachineProgramDto, updatedMachineProgram, {
            excludeExtraneousValues: true
        });
    }
}

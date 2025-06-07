import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { CreateProgramInfoDto } from './dto/create-program-info.dto';
import { UpdateProgramInfoDto } from './dto/update-program-info.dto';
import { ResponseProgramInfoDto, ResponseProgramInfoListDto, QueryProgramInfoDto, ProgramInfoPaginationDto } from './dto/program-info.dto';
import { ProgramInfoRepository } from 'src/repositories/ProgramInfo.repository';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { IdEncoderService } from 'src/utility/id-encoder.service';

@Injectable()
export class ProgramInfoService {
  constructor(
    private readonly programInfoRepository: ProgramInfoRepository,
    private readonly machineInfoRepository: MachineInfoRepository,
    private readonly keyGeneratorService: KeyGeneratorService,
  ) {}

  async create(createProgramInfoDto: CreateProgramInfoDto, createdBy: number): Promise<ResponseProgramInfoDto> {
    // Decode machine ID
    const machineInfoId = IdEncoderService.decode(createProgramInfoDto.machineId);
    
    // Verify machine exists
    const machineInfo = await this.machineInfoRepository.findMachineInfoById(machineInfoId);
    if (!machineInfo) {
      throw new NotFoundException('Machine not found');
    }

    // Generate unique program key
    const programKey = await this.programInfoRepository.generateUniqueProgramKey();

    // Create program info
    const programInfoData = {
      programKey,
      machineInfoId,
      programName: createProgramInfoDto.programName,
      programDescription: createProgramInfoDto.programDescription,
      createdBy,
      updatedBy: createdBy,
    };

    const programInfo = await this.programInfoRepository.createProgramInfo(programInfoData);
    
    // Fetch the complete program info with relations
    const completeProgramInfo = await this.programInfoRepository.findProgramInfoById(programInfo.id);
    
    return plainToInstance(ResponseProgramInfoDto, completeProgramInfo, { 
      excludeExtraneousValues: true 
    });
  }

  async findAll(query: QueryProgramInfoDto): Promise<ProgramInfoPaginationDto> {
    const { page = 1, limit = 10, machineId, ...sortOptions } = query;
    
    const options: IPaginationOptions = {
      page,
      limit
    };

    let result;
    
    if (machineId) {
      // Decode machine ID and filter by it
      const machineInfoId = IdEncoderService.decode(machineId);
      result = await this.programInfoRepository.findProgramInfoByMachineId(machineInfoId, options);
    } else {
      result = await this.programInfoRepository.findAllProgramInfo(options, sortOptions);
    }

    const items = result.items.map(item => 
      plainToInstance(ResponseProgramInfoListDto, item, { excludeExtraneousValues: true })
    );

    return {
      items,
      meta: result.meta
    };
  }

  async findOne(id: number): Promise<ResponseProgramInfoDto> {
    const programInfo = await this.programInfoRepository.findProgramInfoById(id);
    
    if (!programInfo) {
      throw new NotFoundException('Program info not found');
    }

    return plainToInstance(ResponseProgramInfoDto, programInfo, { 
      excludeExtraneousValues: true 
    });
  }

  async update(encodedId: string, updateProgramInfoDto: UpdateProgramInfoDto, updatedBy: number): Promise<ResponseProgramInfoDto> {
    const id = IdEncoderService.decode(encodedId);
    
    // Check if program exists
    const existingProgram = await this.programInfoRepository.findProgramInfoById(id);
    if (!existingProgram) {
      throw new NotFoundException('Program info not found');
    }

    const updateData: any = { updatedBy, updatedAt: new Date() };

    // Handle machine ID update
    if (updateProgramInfoDto.machineId) {
      const machineInfoId = IdEncoderService.decode(updateProgramInfoDto.machineId);
      
      // Verify machine exists
      const machineInfo = await this.machineInfoRepository.findMachineInfoById(machineInfoId);
      if (!machineInfo) {
        throw new NotFoundException('Machine not found');
      }
      
      updateData.machineInfoId = machineInfoId;
    }

    // Handle other fields
    if (updateProgramInfoDto.programName) {
      updateData.programName = updateProgramInfoDto.programName;
    }

    if (updateProgramInfoDto.programDescription !== undefined) {
      updateData.programDescription = updateProgramInfoDto.programDescription;
    }

    await this.programInfoRepository.updateProgramInfo(id, updateData);
    
    // Fetch updated program info
    const updatedProgramInfo = await this.programInfoRepository.findProgramInfoById(id);
    
    return plainToInstance(ResponseProgramInfoDto, updatedProgramInfo, { 
      excludeExtraneousValues: true 
    });
  }

  async remove(encodedId: string, deletedBy: number): Promise<void> {
    const id = IdEncoderService.decode(encodedId);
    
    // Check if program exists
    const programInfo = await this.programInfoRepository.findProgramInfoById(id);
    if (!programInfo) {
      throw new NotFoundException('Program info not found');
    }

    await this.programInfoRepository.deleteProgramInfo(id, deletedBy);
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
}

import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateMachineInfoDto } from './dto/create-machine-info.dto';
import { UpdateMachineInfoDto } from './dto/update-machine-info.dto';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { MachineInfoEntity } from 'src/models/entities/MachineInfo.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FileValidationService } from 'src/utility/file-validation.service';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { ResponseMachineInfoListDto, SortDto, PaginatedMachineInfoResponseDto, ResponseMachineInfoDto } from './dto/machine-info.dto';
import { PaginationDto } from 'src/constants/pagination.constant';
import { Pagination } from 'nestjs-typeorm-paginate';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MachineInfoService {
    constructor(
        private readonly machineInfoRepository: MachineInfoRepository,
        private readonly firebaseService: FirebaseService
    ) { }

    async create(createMachineInfoDto: CreateMachineInfoDto, userId: number, file?: Express.Multer.File): Promise<{ id: number }> {
        createMachineInfoDto.machineKey = await this.machineInfoRepository.generateUniqueMachineKey();
        
        // Upload file to Firebase Storage if provided
        if (file) {
            try {
                // Validate file
                FileValidationService.validateFile(file, {
                    maxSize: 10 * 1024 * 1024, // 10MB
                    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
                    allowedExtensions: ['.jpg', '.jpeg', '.png']
                });

                const fileName = FileValidationService.generateUniqueFileName(file.originalname, 'machine');
                const fileUrl = await this.firebaseService.uploadFile(file.buffer, fileName, 'machine-files');
                createMachineInfoDto.machinePicturePath = fileUrl;
            } catch (error) {
                console.error('Error uploading file to Firebase:', error);
                throw new UnauthorizedException(error.message || 'Failed to upload file');
            }
        }
        
        const id = await this.machineInfoRepository.create({
            ...createMachineInfoDto,
            createdBy: userId,
            updatedBy: userId,
        });
        return { id };
    }

    

    async findAll(option: PaginationDto, sort: SortDto): Promise<Pagination<ResponseMachineInfoDto>> {
        const result = await this.machineInfoRepository.findAll(option, sort);
        
        const transformedItems = result.items.map(item => 
            plainToInstance(ResponseMachineInfoDto, item, { excludeExtraneousValues: true })
        );

        return {
            items: transformedItems,
            meta: result.meta
        };
    }

    async findList(): Promise<ResponseMachineInfoListDto[]> {
        const machines = await this.machineInfoRepository.findList();
        return plainToInstance(ResponseMachineInfoListDto, machines, { excludeExtraneousValues: true });
    }

    async findOne(id: number): Promise<ResponseMachineInfoDto | null> {
        const machine = await this.machineInfoRepository.findMachineInfoById(id);
        if (!machine) {
            throw new BadRequestException('Machine not found');
        }
        return plainToInstance(ResponseMachineInfoDto, machine, { excludeExtraneousValues: true });
    }

    async update(id: number, updateMachineInfoDto: UpdateMachineInfoDto, userId: number): Promise<{ message: string }> {
        const existingMachine = await this.machineInfoRepository.findMachineInfoById(id);
        if (!existingMachine) {
            throw new BadRequestException('Machine not found');
        }

        // Check if machineKey is being updated and ensure it's unique
        if (updateMachineInfoDto.machineKey && updateMachineInfoDto.machineKey !== existingMachine.machineKey) {
            const duplicateMachine = await this.machineInfoRepository.findByKeyExcludingId(updateMachineInfoDto.machineKey, id);
            if (duplicateMachine) {
                throw new UnauthorizedException('Machine key already exists');
            }
        }

        await this.machineInfoRepository.update(id, {
            ...updateMachineInfoDto,
            updatedBy: userId,
        });

        return { message: 'Machine updated successfully' };
    }

    async remove(id: number): Promise<{ message: string }> {
        const existingMachine = await this.machineInfoRepository.findMachineInfoById(id);
        if (!existingMachine) {
            throw new BadRequestException('Machine not found');
        }

        await this.machineInfoRepository.remove(id);
        return { message: 'Machine deleted successfully' };
    }
}

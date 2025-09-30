import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateShopBankDto, CreateShopInfoDto } from './dto/create-shop-info.dto';
import { UpdateShopInfoDto } from './dto/update-shop-info.dto';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { ShopInfoEntity } from 'src/models/entities/ShopInfo.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FileValidationService } from 'src/utility/file-validation.service';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { ResponseShopInfoListDto, SortDto, PaginatedShopInfoResponseDto, ResponseShopInfoDto, ResponseShopInfoListUserDto } from './dto/shoo-info.dto';
import { PaginationDto } from 'src/constants/pagination.constant';
import { Pagination } from 'nestjs-typeorm-paginate';
import { plainToInstance } from 'class-transformer';
import { UsersRepository } from 'src/repositories/Users.repository';

@Injectable()
export class ShopInfoService {
    constructor(
        private readonly shopInfoRepository: ShopInfoRepository,
        private readonly firebaseService: FirebaseService,
        private readonly usersRepository: UsersRepository
    ) { }

    async create(createShopInfoDto: CreateShopInfoDto, userId: number, file?: Express.Multer.File): Promise<{ id: number }> {
        createShopInfoDto.shopKey = await this.generateUniqueShopKey();
        const checkCode = await this.shopInfoRepository.findShopInfoByCode(createShopInfoDto.shopCode)
        if (checkCode) {
            throw new UnauthorizedException('Shop code already exists');
        }
        // Upload file to Firebase Storage if provided
        if (file) {
            createShopInfoDto.shopUploadFile = await this.fileUploadToFirebase(file);
        }
        
        const id = await this.shopInfoRepository.create({
            ...createShopInfoDto,
            createdBy: userId,
            updatedBy: userId,
        });
        return { id };
    }

    async findAll(option: PaginationDto, sort: SortDto): Promise<Pagination<ResponseShopInfoDto>> {
        // Get the raw entity data using the existing findAll method
        const result = await this.shopInfoRepository.findAll(option, sort);
        
        // Transform each entity to ResponseShopInfoDto using class-transformer
        // This ensures the @EncodeId decorator is properly applied
        const transformedItems = result.items.map(item => 
            plainToInstance(ResponseShopInfoDto, item, { 
                excludeExtraneousValues: false,
                enableImplicitConversion: true 
            })
        );

        return {
            ...result,
            items: transformedItems
        };
    }

    async findList(userId: number): Promise<ResponseShopInfoListDto[]> {
        let permissions: number[] = [];
        if(userId){
            const result = await this.usersRepository.findRolePermissions(userId);
            permissions = result.map(item => item.shopId);
        }
        const result = await this.shopInfoRepository.findList(permissions);
        
        // Transform each entity to ResponseShopInfoListDto using class-transformer
        // This ensures the @EncodeId decorator is properly applied
        return result.map(item => 
            plainToInstance(ResponseShopInfoListDto, item, { 
                excludeExtraneousValues: false,
                enableImplicitConversion: true 
            })
        );
    }
    async findListUser(): Promise<ResponseShopInfoListUserDto[]> {
        const result = await this.shopInfoRepository.findList();
        return result;
    }

    async findOne(id: number): Promise<ResponseShopInfoDto | null> {
        const result = await this.shopInfoRepository.findById(id);
        
        if (!result) {
            return null;
        }
        
        // Transform entity to ResponseShopInfoDto using class-transformer
        // This ensures the @EncodeId decorator is properly applied
        return plainToInstance(ResponseShopInfoDto, result, { 
            excludeExtraneousValues: false,
            enableImplicitConversion: true 
        });
    }

    async update(id: number, updateShopInfoDto: UpdateShopInfoDto, file?: Express.Multer.File): Promise<void> {
        if (file) {
            updateShopInfoDto.shopUploadFile = await this.fileUploadToFirebase(file);
        }
        await this.shopInfoRepository.update(id, {
            ...updateShopInfoDto,
            updatedBy: 1, // TODO: Get from authenticated user
        });
    }

    async remove(id: number): Promise<void> {
        await this.shopInfoRepository.softDelete(id);
    }

    async findByShopCode(shopCode: string): Promise<ShopInfoEntity | null> {
        return this.shopInfoRepository.findShopInfoByCode(shopCode);
    }

    async findByShopKey(shopKey: string): Promise<ShopInfoEntity | null> {
        return this.shopInfoRepository.findShopInfoByKey(shopKey);
    }

    async findActiveShops(): Promise<ShopInfoEntity[]> {
        return this.shopInfoRepository.findActiveShopInfos();
    }

    async checkShopCodeExists(shopCode: string): Promise<boolean> {
        return this.shopInfoRepository.checkShopCodeExists(shopCode);
    }

    async checkShopKeyExists(shopKey: string): Promise<boolean> {
        return this.shopInfoRepository.checkShopKeyExists(shopKey);
    }

    private async generateUniqueShopKey(): Promise<string> {
        let shopKey = '';
        let isUnique = false;

        while (!isUnique) {
            shopKey = KeyGeneratorService.generateRandomKey(10);
            isUnique = !(await this.checkShopKeyExists(shopKey));
        }

        return shopKey;
    }

    private async fileUploadToFirebase(file: Express.Multer.File): Promise<string> {
          try {
                // Validate file
                FileValidationService.validateFile(file, {
                    maxSize: 10 * 1024 * 1024, // 10MB
                    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
                    allowedExtensions: ['.jpg', '.jpeg', '.png']
                });

                const fileName = FileValidationService.generateUniqueFileName(file.originalname, 'shop');
                const fileUrl = await this.firebaseService.uploadFile(file.buffer, fileName, 'shop-files');
                return fileUrl;
            } catch (error) {
                console.error('Error uploading file to Firebase:', error);
                throw new UnauthorizedException(error.message || 'Failed to upload file');
            }
    }

    async findBank(id: number) {
        const result = await this.shopInfoRepository.findBankById(id);
        return result;
    }

    async createOrUpdateBank(id: number, body: CreateShopBankDto, userId: number) {
        return this.shopInfoRepository.createOrUpdateBank(id, body, userId);
    }
}

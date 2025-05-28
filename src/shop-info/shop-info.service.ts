import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateShopInfoDto } from './dto/create-shop-info.dto';
import { UpdateShopInfoDto } from './dto/update-shop-info.dto';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { ShopInfoEntity } from 'src/models/entities/ShopInfo.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FileValidationService } from 'src/utility/file-validation.service';

@Injectable()
export class ShopInfoService {
    constructor(
        private readonly shopInfoRepository: ShopInfoRepository,
        private readonly firebaseService: FirebaseService
    ) { }

    async create(createShopInfoDto: CreateShopInfoDto, userId: number, file?: Express.Multer.File): Promise<{ id: number }> {
        createShopInfoDto.shopKey = await this.generateUniqueShopKey();
        
        // Upload file to Firebase Storage if provided
        if (file) {
            try {
                // Validate file
                FileValidationService.validateFile(file, {
                    maxSize: 10 * 1024 * 1024, // 10MB
                    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                    allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
                });

                const fileName = FileValidationService.generateUniqueFileName(file.originalname, 'shop');
                const fileUrl = await this.firebaseService.uploadFile(file.buffer, fileName, 'shop-files');
                createShopInfoDto.shopUploadFile = fileUrl;
            } catch (error) {
                console.error('Error uploading file to Firebase:', error);
                throw new BadRequestException(error.message || 'Failed to upload file');
            }
        }
        
        const id = await this.shopInfoRepository.create({
            ...createShopInfoDto,
            createdBy: userId,
            updatedBy: userId,
        });
        return { id };
    }

    async findAll(): Promise<ShopInfoEntity[]> {
        return this.shopInfoRepository.findAll();
    }

    async findOne(id: number): Promise<ShopInfoEntity | null> {
        return this.shopInfoRepository.findById(id);
    }

    async update(id: number, updateShopInfoDto: UpdateShopInfoDto): Promise<void> {
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
            shopKey = this.generateRandomKey(10);
            isUnique = !(await this.checkShopKeyExists(shopKey));
        }

        return shopKey;
    }

    private generateRandomKey(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }
}

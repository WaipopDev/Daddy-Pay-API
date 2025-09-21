import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from 'src/repositories/Users.repository';
import { PaginationDto } from 'src/constants/pagination.constant';
import { SortDto } from './dto/user.dto';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly shopInfoRepo: ShopInfoRepository,
    ) { }

    async create(createUserDto: CreateUserDto) {
        const checkUserNameAndEmail = await this.usersRepo.findUserAndEmail(createUserDto.username, createUserDto.email);
        if (checkUserNameAndEmail) {
            throw new BadRequestException('Username and email already exists');
        }
        
        // Decode shop IDs
        const decodedShopIds = createUserDto.shopIds.map((shopId) => {
            return `${IdEncoderService.decode(shopId)}`;
        });
        
        // Validate that all shops exist
        for (const shopId of decodedShopIds) {
            const shop = await this.shopInfoRepo.findShopInfoById(Number(shopId));
            if (!shop) {
                throw new NotFoundException('Shop not found');
            }
        }
        
        // Create new DTO with decoded shop IDs
        const createUserDtoWithDecodedIds = {
            ...createUserDto,
            shopIds: decodedShopIds
        };
        
        try {
            const user = await this.usersRepo.create(createUserDtoWithDecodedIds);
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    findAll(option: PaginationDto, sort: SortDto) {
        return this.usersRepo.findAllWithDto(option, sort);
    }

    findOne(id: number) {
        return this.usersRepo.findByIdWithPermissions(id);
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.usersRepo.updateWithPermissions(id, updateUserDto);
    }

    remove(id: number) {
        return this.usersRepo.delete(id);
    }
}

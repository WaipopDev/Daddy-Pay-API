import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersRepository } from 'src/repositories/Users.repository';
import { QueryUserDto } from './dto/user.dto';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { hashPassword, matchPassword } from 'src/utility/password';
import { UpdateUserSubscribeDto } from './dto/update-user-subscribe.dto';
import { UsersEntity } from 'src/models/entities/Users.entity';

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
        const decodedShopIds = createUserDto.shopIds;
        // // Decode shop IDs
        // const decodedShopIds = createUserDto.shopIds.map((shopId) => {
        //     return `${IdEncoderService.decode(shopId)}`;
        // });
        
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

    findAll(query: QueryUserDto) {
        return this.usersRepo.findAllWithDto(query);
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

    async updateSubscribe(id: number, body: UpdateUserSubscribeDto, updatedBy: number) {
        const user = await this.usersRepo.findUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const updateData: Partial<UsersEntity> = {
            subscribe: body.subscribe,
            updatedBy,
        };

        if (body.subscribeStartDate !== undefined) {
            updateData.subscribeStartDate = body.subscribeStartDate
                ? new Date(body.subscribeStartDate)
                : null;
        }

        if (body.subscribeEndDate !== undefined) {
            updateData.subscribeEndDate = body.subscribeEndDate
                ? new Date(body.subscribeEndDate)
                : null;
        }

        await this.usersRepo.update(id, updateData);

        return {
            message: 'บันทึกข้อมูลการสมัครสมาชิกสำเร็จ',
        };
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
        const user = await this.usersRepo.findUserById(userId, true);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordMatch = await matchPassword(user.password, changePasswordDto.oldPassword);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const hashedNewPassword = await hashPassword(changePasswordDto.newPassword);
        await this.usersRepo.update(userId, { password: hashedNewPassword });
        
        return { message: 'Password changed successfully' };
    }
}

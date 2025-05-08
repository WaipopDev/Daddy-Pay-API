import { Injectable } from '@nestjs/common';
import { CreateAdminAuthDto } from './dto/create-admin-auth.dto';
import { UpdateAdminAuthDto } from './dto/update-admin-auth.dto';
import { UsersEntity } from 'src/models/entities/Users.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { hashPassword } from 'src/utility/password';

@Injectable()
export class AdminAuthService {

    constructor(@InjectEntityManager() private readonly db: EntityManager) { }

   async create(createAdminAuthDto: CreateAdminAuthDto) {
        console.log("🚀 ~ AdminAuthService ~ create ~ createAdminAuthDto:", createAdminAuthDto)
        const user                    = new UsersEntity()
              user.username           = createAdminAuthDto.username
              user.password           = await hashPassword(createAdminAuthDto.password)
              user.email              = createAdminAuthDto.email
              user.role               = createAdminAuthDto.role
              user.active             = createAdminAuthDto.active
              user.subscribe          = createAdminAuthDto.subscribe
              user.isVerified         = createAdminAuthDto.isVerified
              user.isAdminLevel       = createAdminAuthDto.isAdminLevel
              user.subscribeStartDate = createAdminAuthDto.subscribeStartDate || null
              user.subscribeEndDate   = createAdminAuthDto.subscribeEndDate || null
              user.createdBy = 1
              user.updatedBy = 1

        return this.db.save(user)
    }

    findAll() {
        return `This action returns all adminAuth`;
    }

    findOne(id: number) {
        return `This action returns a #${id} adminAuth`;
    }

    update(id: number, updateAdminAuthDto: UpdateAdminAuthDto) {
        return `This action updates a #${id} adminAuth`;
    }

    remove(id: number) {
        return `This action removes a #${id} adminAuth`;
    }
}

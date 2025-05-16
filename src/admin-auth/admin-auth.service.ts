import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminAuthDto } from './dto/create-admin-auth.dto';
import { UpdateAdminAuthDto } from './dto/update-admin-auth.dto';
import { UsersEntity } from 'src/models/entities/Users.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { hashPassword, matchPassword } from 'src/utility/password';
import { LoginAdminAuthDto, ResponseAdminAuthDto } from './dto/admin-auth.dto';
import { UsersRepository } from 'src/repositories/Users.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthService {

    constructor(
        @InjectEntityManager() private readonly db: EntityManager,
        private usersRepo: UsersRepository,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    private jwtSign(user: UsersEntity): string {
        return this.jwtService.sign(
            {
                sub: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                subscribeEndDate: user.subscribeEndDate,
                subscribeStartDate: user.subscribeStartDate,
            },
            {
                expiresIn: this.config.get<string>('JWT_ADMIN_EXPIRE'),
                secret: this.config.get<string>('JWT_ADMIN_SECRET'),
                algorithm: 'HS256',
            },
        );
    }

    async create(createAdminAuthDto: CreateAdminAuthDto): Promise<UsersEntity> {
        const user = new UsersEntity()
        user.username = createAdminAuthDto.username
        user.password = await hashPassword(createAdminAuthDto.password)
        user.email = createAdminAuthDto.email
        user.role = createAdminAuthDto.role
        user.active = createAdminAuthDto.active
        user.subscribe = createAdminAuthDto.subscribe
        user.isVerified = createAdminAuthDto.isVerified
        user.isAdminLevel = createAdminAuthDto.isAdminLevel
        user.subscribeStartDate = createAdminAuthDto.subscribeStartDate || null
        user.subscribeEndDate = createAdminAuthDto.subscribeEndDate || null
        user.createdBy = 1
        user.updatedBy = 1

        return this.db.save(user)
    }


    async login(loginAdminAuthDto: LoginAdminAuthDto): Promise<ResponseAdminAuthDto> {
        const user = await this.usersRepo.findUserByUsername(loginAdminAuthDto.email, true);
        if (!user) {
            throw new UnauthorizedException('Email does not exist in the system.');
        }
        const isPasswordMatch = await matchPassword(user.password, loginAdminAuthDto.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Incorrect password.');
        }
        const accessToken = this.jwtSign(user);
        return {
            id: user.id,
            accessToken,
        };
    }

    validate(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.config.get<string>('JWT_ADMIN_SECRET'),
            });
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    async getUserById(id: number): Promise<UsersEntity | null> {
        const user = await this.usersRepo.findById(id);
        if (!user) {
            throw new UnauthorizedException('User not found or inactive.');
        }
        if (!user.active) {
            throw new UnauthorizedException('User not found or inactive.');
        }
        if (!user.isVerified) {
            throw new UnauthorizedException('User not found or inactive.');
        }
        return user;
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

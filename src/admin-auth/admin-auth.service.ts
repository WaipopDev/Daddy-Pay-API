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
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * ตรวจสอบ token และถ้าเหลือเวลาน้อยกว่า 10 นาที จะ refresh token ใหม่
     * @param token JWT token ที่ต้องการตรวจสอบ
     * @returns object ที่มี shouldRefresh และ newToken (ถ้า refresh)
     */
    async checkAndRefreshToken(token: string): Promise<{
        shouldRefresh: boolean;
        newToken?: string;
        payload: any;
    }> {
        try {
            // Decode token โดยไม่ verify เพื่อดู payload
            const decoded = this.jwtService.decode(token) as any;
            if (!decoded || !decoded.exp) {
                throw new UnauthorizedException('Invalid token format');
            }

            // ตรวจสอบเวลาปัจจุบันกับเวลา expire
            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpireTime = decoded.exp;
            const timeLeft = tokenExpireTime - currentTime;
            
            // ถ้าเหลือเวลาน้อยกว่า 10 นาที (600 วินาที)
            const TEN_MINUTES = 10 * 60;
            
            if (timeLeft > 0 && timeLeft < TEN_MINUTES) {
                // ดึงข้อมูล user เพื่อสร้าง token ใหม่
                const user = await this.getUserById(decoded.sub);
                if (!user) {
                    throw new UnauthorizedException('User not found');
                }
                
                // สร้าง token ใหม่
                const newToken = this.jwtSign(user);
                
                return {
                    shouldRefresh: true,
                    newToken,
                    payload: decoded
                };
            }

            // ถ้า token ยังใช้ได้และเวลาเหลือมากกว่า 10 นาที
            if (timeLeft > 0) {
                // Verify token เพื่อให้แน่ใจว่าถูกต้อง
                const verifiedPayload = this.validate(token);
                return {
                    shouldRefresh: false,
                    payload: verifiedPayload
                };
            }

            // Token หมดอายุแล้ว
            throw new UnauthorizedException('Token expired');

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * สร้าง token ใหม่สำหรับ user ที่มีอยู่
     * @param userId ID ของ user
     * @returns token ใหม่
     */
    async refreshTokenByUserId(userId: number): Promise<string> {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.jwtSign(user);
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

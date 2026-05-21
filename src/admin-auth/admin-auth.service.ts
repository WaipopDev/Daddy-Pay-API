import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CreateAdminAuthDto } from './dto/create-admin-auth.dto';
import { UpdateAdminAuthDto } from './dto/update-admin-auth.dto';
import { UsersEntity } from 'src/models/entities/Users.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { hashPassword, matchPassword } from 'src/utility/password';
import { LoginAdminAuthDto, ResponseAdminAuthDto } from './dto/admin-auth.dto';
import { ForgotPasswordDto, ForgotPasswordResponseDto } from './dto/forgot-password.dto';
import { ResetPasswordDto, ResetPasswordResponseDto } from './dto/reset-password.dto';
import { UsersRepository } from 'src/repositories/Users.repository';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AdminAuthService {

    constructor(
        @InjectEntityManager() private readonly db: EntityManager,
        private usersRepo: UsersRepository,
        private jwtService: JwtService,
        private config: ConfigService,
        private mailService: MailService,
    ) { }

    private static readonly PASSWORD_RESET_PURPOSE = 'password-reset';

    private jwtSign(user: UsersEntity): string {
        const secret = this.config.get<string>('JWT_ADMIN_SECRET');
        const expire = this.config.get<string>('JWT_ADMIN_EXPIRE');

        if (!secret || !expire) {
            throw new Error('JWT_ADMIN_SECRET or JWT_ADMIN_EXPIRE not configured');
        }

        return this.jwtService.sign(
            {
                sub: user.id.toString(),
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                subscribeEndDate: user.subscribeEndDate,
                subscribeStartDate: user.subscribeStartDate,
            },
            {
                expiresIn: expire,
                secret: secret,
                algorithm: 'HS256',
            } as JwtSignOptions
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


    private signPasswordResetToken(user: UsersEntity): string {
        const secret = this.config.get<string>('JWT_RESET_SECRET');
        const expire = this.config.get<string>('JWT_RESET_EXPIRE') || '1h';

        if (!secret) {
            throw new Error('JWT_RESET_SECRET is not configured');
        }

        return this.jwtService.sign(
            {
                sub: user.id.toString(),
                purpose: AdminAuthService.PASSWORD_RESET_PURPOSE,
            },
            {
                expiresIn: expire,
                secret,
                algorithm: 'HS256',
            } as JwtSignOptions,
        );
    }

    private verifyPasswordResetToken(token: string): number {
        const secret = this.config.get<string>('JWT_RESET_SECRET');
        if (!secret) {
            throw new BadRequestException('Password reset is not configured');
        }

        try {
            const payload = this.jwtService.verify(token, { secret }) as {
                sub?: string;
                purpose?: string;
            };
            if (payload.purpose !== AdminAuthService.PASSWORD_RESET_PURPOSE || !payload.sub) {
                throw new UnauthorizedException('Invalid or expired reset token');
            }
            return Number(payload.sub);
        } catch {
            throw new UnauthorizedException('Invalid or expired reset token');
        }
    }

    async forgotPassword(dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
        const user = await this.usersRepo.findUserByUsername(dto.email, false);
        if (!user) {
            throw new NotFoundException('Email does not exist in the system.');
        }

        const token = this.signPasswordResetToken(user);
        const frontendUrl = this.config.get<string>('FRONTEND_URL') || '';
        const resetPath =
            this.config.get<string>('FRONTEND_RESET_PASSWORD_PATH') ||
            '/reset-password';
        const resetUrl = frontendUrl
            ? `${frontendUrl.replace(/\/$/, '')}${resetPath}?token=${encodeURIComponent(token)}`
            : `token=${token}`;

        await this.mailService.sendPasswordResetEmail(user.email, resetUrl);

        return {
            message: 'A password reset link has been sent to your email.',
        };
    }

    async resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
        const userId = this.verifyPasswordResetToken(dto.token);
        const user = await this.usersRepo.findUserById(userId, false);
        if (!user || !user.active) {
            throw new UnauthorizedException('Invalid or expired reset token');
        }

        const hashedPassword = await hashPassword(dto.newPassword);
        await this.usersRepo.update(userId, { password: hashedPassword });

        return { message: 'Password has been reset successfully.' };
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

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly shopManagementRepository: ShopManagementRepository,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }
    private jwtSign(shopManagement: ShopManagementEntity): string {
        return this.jwtService.sign(
            {
                sub: shopManagement.id,
                machineID: shopManagement.shopManagementMachineID,
                iotID: shopManagement.shopManagementIotID,
            },
            {
                expiresIn: '1d',
                secret: this.config.get<string>('JWT_IOT_SECRET'),
                algorithm: 'HS256',
            },
        );
    }
    async getKeyAuth(idIoT: string) {
        const shopInfo = await this.shopManagementRepository.findByIdIoT(idIoT);
        if (!shopInfo) {
            throw new BadRequestException('Shop management not found for the provided idIoT.');
        }
        const keyAuth = this.jwtSign(shopInfo);
        return Promise.resolve({
            keyAuth,
        });
    }

    validate(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.config.get<string>('JWT_IOT_SECRET'),
            });
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}

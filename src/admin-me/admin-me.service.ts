import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/Users.repository';

@Injectable()
export class AdminMeService {
    constructor(
        private readonly usersRepo: UsersRepository,
    ) { }
    async getProfile(userId: number) {
        const user = await this.usersRepo.findUserById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found.');
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            active: user.active,
            subscribe: user.subscribe,
            isVerified: user.isVerified,
            isAdminLevel: user.isAdminLevel,
            subscribeStartDate: user.subscribeStartDate,
            subscribeEndDate: user.subscribeEndDate,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            createdBy: user.createdBy,
            updatedBy: user.updatedBy,
        };
    }
}

import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { UsersEntity } from 'src/models/entities/Users.entity';

export class UsersRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    private get repo() {
        return this.db.getRepository(UsersEntity);
    }

    private async findOneUser(where: FindOptionsWhere<UsersEntity>, password = false) {
        return this.repo.findOne({
            where: where,
            select: {
                id: true,
                username: true,
                password,
                email: true,
                role: true,
                active: true,
                subscribe: true,
                isVerified: true,
                isAdminLevel: true,
                subscribeStartDate: true,
                subscribeEndDate: true,
                createdAt: true,
                updatedAt: true,
                createdBy: true,
                updatedBy: true
            },
        });
    }

    async findUserByUsername(email: string, password = false): Promise<UsersEntity | null> {
        return this.findOneUser({ email, active: true }, password);
    }
    
    async findUserById(id: number, password = false) {
        return this.findOneUser({ id }, password);
    }

    async findAll(): Promise<UsersEntity[]> {
        return this.repo.find();
    }

    async findById(id: number): Promise<UsersEntity | null> {
        return this.repo.findOneBy({ id });
    }

    async create(data: Partial<UsersEntity>): Promise<number> {
        const user = await this.repo.save(data);
        return user.id;
    }

    async update(id: number, data: Partial<UsersEntity>): Promise<void> {
        await this.repo.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}

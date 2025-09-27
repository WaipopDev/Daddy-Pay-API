import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { UsersEntity } from 'src/models/entities/Users.entity';
import { PaginationDto } from 'src/constants/pagination.constant';
import { ResponseUserDto, SortDto } from 'src/user/dto/user.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersPermissionsEntity } from 'src/models/entities/UsersPermissions.entity';
import { hashPassword } from 'src/utility/password';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

export class UsersRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    private get repo() {
        return this.db.getRepository(UsersEntity);
    }
    private get repoPermissions() {
        return this.db.getRepository(UsersPermissionsEntity);
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
    async findUserAndEmail(username: string, email: string): Promise<boolean> {
        const checkUsername = await this.repo.findOne({
            where: {
                username: username,
                active: true
            }
        });
        const checkEmail = await this.repo.findOne({
            where: {
                email: email,
                active: true
            },
        });
        if (checkUsername || checkEmail) {
            return true;
        }
        return false;
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

    async findAllWithDto(option: PaginationDto, sort: SortDto) {
        const queryBuilder = this.repo.createQueryBuilder('users');
        queryBuilder.select([
            'users.id',
            'users.username',
            'users.email',
            'users.role',
            'users.active',
            'users.subscribe',
            'users.isVerified',
            'users.isAdminLevel',
            'users.subscribeStartDate',
            'users.subscribeEndDate',
            'users.createdAt',
            'users.updatedAt',
            'users.createdBy',
            'users.updatedBy'
        ]);
        queryBuilder.where('users.deletedAt IS NULL');
        queryBuilder.andWhere('users.id NOT IN (1,2)');
        if (sort.column && sort.sort) {
            queryBuilder.orderBy(`users.${sort.column}`, sort.sort);
        }
        const paginationOptions: IPaginationOptions = {
            page: Number(option.page) || 1,
            limit: Number(option.limit) || 10,
        };
        const result = await paginate<UsersEntity>(queryBuilder, paginationOptions);
        return result;
    }

    async findById(id: number): Promise<UsersEntity | null> {
        return this.repo.findOneBy({ id });
    }

    async create(data: CreateUserDto): Promise<number> {
        return await this.db.transaction(async (transactionalEntityManager) => {
            try {
                const user = new UsersEntity();
                user.username = data.username;
                user.email = data.email;
                user.password = await hashPassword(data.password);
                user.role = data.role;
                user.active = true;
                user.isVerified = true;
                user.isAdminLevel = 0;
                user.subscribeStartDate = data.subscribeStartDate || null;
                user.subscribeEndDate = data.subscribeEndDate || null;
                user.createdBy = Number(data.createdBy);
                user.updatedBy = Number(data.createdBy);

                const userSaved = await transactionalEntityManager.save(UsersEntity, user);

                // Create user permissions for each shop
                const userPermissions = data.shopIds.map((shopId: string) => {
                    const userPermission = new UsersPermissionsEntity();
                    userPermission.userId = userSaved.id;
                    userPermission.shopId = Number(shopId);
                    userPermission.status = 'active';
                    userPermission.createdBy = Number(data.createdBy);
                    userPermission.updatedBy = Number(data.createdBy);
                    return userPermission;
                });

                await transactionalEntityManager.save(UsersPermissionsEntity, userPermissions);

                return userSaved.id;
            } catch (error) {
                // Transaction will automatically rollback if any error occurs
                throw error;
            }
        });
    }

    async update(id: number, data: Partial<UsersEntity>): Promise<void> {
        await this.repo.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
        await this.repoPermissions.delete({ userId: id });
    }

    async findRolePermissions(userId: number): Promise<UsersPermissionsEntity[]> {
        return this.repoPermissions.find({ where: { userId } });
    }

    async findByIdWithPermissions(id: number): Promise<ResponseUserDto | null> {
      const user = await this.repo.findOne({
            where: { id },
            relations: ['permissions']
        });

        if (!user) {
            return null;
        }

        return {
            id                : user.id,
            username          : user.username,
            email             : user.email,
            role              : user.role,
            active            : user.active,
            subscribe         : user.subscribe,
            isVerified        : user.isVerified,
            isAdminLevel      : user.isAdminLevel,
            subscribeStartDate: user.subscribeStartDate,
            subscribeEndDate  : user.subscribeEndDate,
            createdAt         : user.createdAt,
            updatedAt         : user.updatedAt,
            createdBy         : user.createdBy,
            updatedBy         : user.updatedBy,
            permissions       : user.permissions.map((permission) => {
                return {
                    id: permission.id,
                    shopId: permission.shopId,
                    status: permission.status,
                    createdBy: permission.createdBy,
                    updatedBy: permission.updatedBy,
                    createdAt: permission.createdAt,
                    updatedAt: permission.updatedAt
                };
            })
        };
    }

    async updateWithPermissions(id: number, data: UpdateUserDto): Promise<void> {
        return await this.db.transaction(async (transactionalEntityManager) => {
            try {
                const user = new UsersEntity();
                user.username = data.username || '';
                user.email = data.email || '';
                user.role = data.role || '';
                user.updatedBy = Number(data.updatedBy);


                await transactionalEntityManager.update(UsersEntity, id, user);
                await transactionalEntityManager.delete(UsersPermissionsEntity, { userId: id });
                if (data.shopIds) {
                    const userPermissions = data.shopIds.map((shopId: string) => {
                        const userPermission = new UsersPermissionsEntity();
                        userPermission.userId = id;
                        userPermission.shopId = Number(shopId);
                        userPermission.status = 'active';
                        userPermission.createdBy = Number(data.updatedBy);
                        userPermission.updatedBy = Number(data.updatedBy);
                        return userPermission;
                    });

                    await transactionalEntityManager.save(UsersPermissionsEntity, userPermissions);
                }
            } catch (error) {
                throw error;
            }
        });
    }
}

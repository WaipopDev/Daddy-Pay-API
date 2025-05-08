import { Column, Entity } from "typeorm"
import { DefaultEntity } from './default.entity';

@Entity({ name: 'users' })
export class UsersEntity extends DefaultEntity {

    @Column({ type: 'varchar', name: 'username', length: 255, unique: true })
    username: string;

    @Column({ type: 'varchar', name: 'password', length: 255 })
    password: string;

    @Column({ type: 'varchar', name: 'email', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', name: 'role', length: 100 })
    role: string;

    @Column({ type: 'boolean', name: 'active', default: true })
    active: boolean;

    @Column({ type: 'boolean', name: 'subscribe', default: false })
    subscribe: boolean;

    @Column({ type: 'boolean', name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ type: 'int', name: 'is_admin_level', default: 0 })
    isAdminLevel: number;

    @Column({ type: 'date', name: 'subscribe_start_date', nullable: true })
    subscribeStartDate: Date | null;

    @Column({ type: 'date', name: 'subscribe_end_date', nullable: true })
    subscribeEndDate: Date | null;

}

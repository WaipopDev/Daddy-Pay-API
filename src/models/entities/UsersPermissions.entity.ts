import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { ShopInfoEntity } from "./ShopInfo.entity";
import { UsersEntity } from "./Users.entity";

@Entity({ name: 'users_permissions' })
export class UsersPermissionsEntity extends DefaultEntity {

    @Column({ type: 'int', name: 'user_id', primary: true })
    userId: number;

    @Column({ type: 'int', name: 'shop_id' })
    shopId: number;

    @ManyToOne(() => UsersEntity, (user) => user.permissions, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;

    @ManyToOne(() => ShopInfoEntity, { nullable: false })
    @JoinColumn({ name: 'shop_id' })
    shopInfo: ShopInfoEntity;

    @Column({ type: 'varchar', name: 'status', default: 'active', enum: ['active', 'inactive'] })
    status: string;
}

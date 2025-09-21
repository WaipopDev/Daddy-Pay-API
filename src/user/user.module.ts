import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersRepository } from 'src/repositories/Users.repository';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';

@Module({
  imports: [AdminAuthModule,UsersRepository,ShopInfoRepository],
  controllers: [UserController],
  providers: [UserService, UsersRepository, ShopInfoRepository],
})
export class UserModule {}

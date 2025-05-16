import { Module } from '@nestjs/common';
import { AdminMeService } from './admin-me.service';
import { AdminMeController } from './admin-me.controller';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { UsersRepository } from 'src/repositories/Users.repository';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminMeController],
  providers: [AdminMeService, UsersRepository],
})
export class AdminMeModule {}

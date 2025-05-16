import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { UsersRepository } from 'src/repositories/Users.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, UsersRepository],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, ShopManagementRepository],
  exports: [AuthService],
})
export class AuthModule {}

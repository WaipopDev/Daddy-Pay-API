import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { UsersRepository } from 'src/repositories/Users.repository';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [JwtModule, MailModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, UsersRepository],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}

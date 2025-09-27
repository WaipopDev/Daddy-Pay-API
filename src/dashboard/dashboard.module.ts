import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from 'src/repositories/Dashboard.repository';
import { UserModule } from 'src/user/user.module';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule, UserModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}

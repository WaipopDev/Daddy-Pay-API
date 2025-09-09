import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportRepository } from 'src/repositories/Report.repository';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
})
export class ReportModule {}

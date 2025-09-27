import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportRepository } from 'src/repositories/Report.repository';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AdminAuthModule, FirebaseModule, UserModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
})
export class ReportModule {}

import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { LanguageRepository } from 'src/repositories/Language.repository';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [AdminAuthModule, FirebaseModule],
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository],
})
export class LanguageModule {}
